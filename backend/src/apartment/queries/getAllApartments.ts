import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { EventEntity, EVENT_TYPES } from 'src/entities/event.entity';
import { Repository } from "typeorm";
import { Snap } from 'src/entities/snap.entity';
import { Apartment } from '../../aggregate_like_classes/Apartment';
import { plainToClass } from "class-transformer";
import { EventManager } from "src/event_manager/EventManager";


export class GetAllApartment {
}


@QueryHandler(GetAllApartment)
export class GetAllApartmentHandler implements IQueryHandler<GetAllApartment> {

  constructor(
    @InjectRepository(EventEntity) private readonly _eventRepo: Repository<EventEntity>,
    @InjectRepository(Snap) private readonly _snapRepo: Repository<Snap>
  ) { }
  public async execute() {
    
    // получить квартиры через их snaps по последним версиям:

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
    `);

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
      let curentState = plainToClass(Apartment,JSON.parse(snap.snapshotinfo));
      for(let ev of events){ // проходим по всем событиям принадлежащим данному аггрегату, ПРОИЗОШЕДШИЕ С НИМ ПОСЛЕ snapa 
        curentState =  EventManager[ev.type](ev, curentState); // меняем текущее состояние в зависимости от типа события
      }
      finalResult.push(curentState);
    }
    return finalResult;
  }
}