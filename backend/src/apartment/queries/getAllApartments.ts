import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { EventEntity, EVENT_TYPES } from 'src/entities/event.entity';
import { In, Repository } from "typeorm";
import { Snap } from 'src/entities/snap.entity';
import { Apartment } from '../../aggregate_like_classes/Apartment';
import { plainToClass } from "class-transformer";
import { EventManager } from "src/event_manager/EventManager";
import { ImageEntity } from './../../entities/Image.entity';
import { ApartmentFilterDto } from "../dtos/ApartmentFilterDto";
import { Subway } from './../../entities/Subway.entity';
import { SubwayTimeInfo } from 'src/entities/SubwayTimeInfo.entity';
import { ApartmentFilterDomain } from "../domains/ApartmentFilterDomain";
import { ApartmentTransformFieldsDomain } from "../domains/ApartmentTransformFieldsDomain";

 

export class GetAllApartment {
  constructor(public readonly filter?:ApartmentFilterDto){}
}


@QueryHandler(GetAllApartment)
export class GetAllApartmentHandler implements IQueryHandler<GetAllApartment> {

  constructor(
    private readonly _apartmentTransformFieldsDomain:ApartmentTransformFieldsDomain,
    @InjectRepository(EventEntity) private readonly _eventRepo: Repository<EventEntity>,
    @InjectRepository(Snap) private readonly _snapRepo: Repository<Snap>,
    @InjectRepository(ImageEntity) private readonly _imageRepo: Repository<ImageEntity>,
    @InjectRepository(SubwayTimeInfo) private readonly _subwayTimeInfo: Repository<SubwayTimeInfo>,
    @InjectRepository(Subway) private readonly _subwayRepo: Repository<Subway>,
    private readonly _apartmentFilter: ApartmentFilterDomain
) { }
  public async execute(request: GetAllApartment) {

    // по стоимости:
    
    // по количеству комнат
    const filterRoomAmount =  this._apartmentFilter.roomAmountFilter(request.filter);
    const rentType = request.filter.rentType?request.filter.rentType:'';
    let rentTypeFilterStr = '';
    if(rentType && rentType === "DAY" || rentType === "MONTH"){
      rentTypeFilterStr =`AND  JSON_EXTRACT(s.snapshotinfo,"$.rentType") = "${rentType}"  `;
    }
    const fromPrice = request.filter.fromPrice;
    const toPrice = request.filter.toPrice;
    
    let filterPriceStr = '';
    if(rentType ==="DAY"){
      if(fromPrice){

        filterPriceStr = `AND JSON_EXTRACT(s.snapshotinfo,"$.priceForDay") >= "${fromPrice}"`;
      }
      if(toPrice){
        filterPriceStr +=`AND JSON_EXTRACT(s.snapshotinfo,"$.priceForDay") <= "${toPrice}"`;
      }
    } else {
      // считаем что месяц:
      if(fromPrice){
        filterPriceStr = `AND JSON_EXTRACT(s.snapshotinfo,"$.priceForMonth") >= "${fromPrice}"`;
      }
      if(toPrice){
        filterPriceStr +=`AND JSON_EXTRACT(s.snapshotinfo,"$.priceForMonth") <= "${toPrice}"`;
      }
    }
     // по типу жилья:
    const saleTypes = request.filter.apartmentSaleTypes ?request.filter.apartmentSaleTypes.split(','):[];
    let apartmentSaleFilterStr = '';
    if(saleTypes.length){
      // если есть типы, ищем типы такие:
      if(saleTypes.length == 2){
        apartmentSaleFilterStr =`AND (JSON_EXTRACT(s.snapshotinfo, "$.apartmentSaleType") = "${saleTypes[0]}"
        OR JSON_EXTRACT(s.snapshotinfo, "$.apartmentSaleType") = "${saleTypes[1]}")`;
      } else {
        apartmentSaleFilterStr = `AND JSON_EXTRACT(s.snapshotinfo, "$.apartmentSaleType") IN (${saleTypes.map(saleType=>'\''+saleType+'\'').join(',')})`
      }
    }

    const snaps =  await this._snapRepo.query(`
    SELECT s.aggregateId, s.version, s.snapshotinfo
    FROM snap s
    INNER JOIN (
        SELECT aggregateId, MAX(version) version
        FROM snap
        GROUP BY aggregateId
    ) b ON s.aggregateId = b.aggregateId 
    AND s.version = b.version
    AND s.aggregateId IN (SELECT aggregateId FROM event_entity e WHERE  e.type = "${EVENT_TYPES.APARTMENT_CREATED}")
    ${filterRoomAmount}
    ${apartmentSaleFilterStr}
    ${rentTypeFilterStr}
    ${filterPriceStr}
`); 

    // если комнату то, комнату предложение комната в 
    // если квартиру, то СКОЛЬКИ КОМНАТНУЮ
    // сюда будут идти все апартаменты конвертированные в сущности аггрегатов с текущим состоянием
    const finalResult = [];

    // проходимся по всем snapaм
    for(let snap of snaps){
      // для каждого snap находим последние 10
      const events = await this._eventRepo.find({
        take: 10,
        skip: snap.version,
        where: {
          aggregateId: snap.aggregateId,
        },
        order: {
          happendIn: 'ASC',
        }
      });
   
      // преврашаем данные из JSON snapshotinfo в наш аггрегат 
      let curentState:any = plainToClass(Apartment,JSON.parse(snap.snapshotinfo)) as any;
      for(let ev of events){ // проходим по всем событиям принадлежащим данному аггрегату, ПРОИЗОШЕДШИЕ С НИМ ПОСЛЕ snapa 
        curentState =  EventManager[ev.type](ev, curentState); // меняем текущее состояние в зависимости от типа события
        curentState.id = snap.aggregateId;
       
        curentState.images =  await this._apartmentTransformFieldsDomain.getImages(curentState.images);
        
        curentState.subways = await this._apartmentTransformFieldsDomain.getSubways(curentState.subways,curentState.id);
        console.log(curentState.subways);
      }
      finalResult.push(curentState);
    }
    return finalResult;
  }
}