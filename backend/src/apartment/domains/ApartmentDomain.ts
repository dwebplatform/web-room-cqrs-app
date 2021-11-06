import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Snap } from "src/entities/snap.entity";
import { In, Repository } from "typeorm";
import { EventEntity, EVENT_TYPES } from 'src/entities/event.entity';
import { Expose, plainToClass } from "class-transformer";
import { Characteristic } from "src/entities/char.entity";
import { Apartment } from "src/aggregate_like_classes/Apartment";
import { EventManager } from "src/event_manager/EventManager";
import { ImageEntity } from 'src/entities/Image.entity';
import { SubwayTimeInfo } from './../../entities/SubwayTimeInfo.entity';
import { Subway } from './../../entities/Subway.entity';



// aggregate analog
@Injectable()
export class ApartmentDomain {
  
  constructor(
    @InjectRepository(EventEntity) private readonly _eventRepo: Repository<EventEntity>,
    @InjectRepository(Snap) private readonly _snapRepo: Repository<Snap>,
    @InjectRepository(Characteristic) private readonly _charRepo: Repository<Characteristic>,
    @InjectRepository(SubwayTimeInfo) private readonly _subwayTimeInfoRepo: Repository<SubwayTimeInfo>,
    @InjectRepository(Subway) private readonly _subwayRepo: Repository<Subway>,
    @InjectRepository(ImageEntity) private readonly _imageRepo: Repository<ImageEntity>){
  }

  public async getSubways(ids: string[]){
    const subs =  await this._subwayTimeInfoRepo.find({
      where: {
        id: In(ids)
      }
    });
    const result = [];
    for(let sub of subs){
      const subwayEntity = await this._subwayRepo.findOne(sub.subwayId);
      result.push({
        ...sub,
        name: subwayEntity.name,
        color: subwayEntity.color,
        
      })
    }
    return result;

  }
  public async getImages(images: string[]){
    return await this._imageRepo.find({
      where: {
        id: In(images)
      }
    })
  }
  public async getChars(charIds: string[]){
    const chars =  await this._charRepo.find({where:{
      id: In(charIds)
    }});
    return chars;
  }

  public async  getApartment(aggregateId: string, withChars: boolean):Promise<any>{

    const currentSnap = await this._snapRepo.findOne({
      where: {
        aggregateId: aggregateId,
      },
      order: {
        version: 'DESC'
      }
    });
    
    if(!currentSnap){
      throw new HttpException('Не была передана версия',HttpStatus.BAD_REQUEST);
    }
    const events = await this._eventRepo.find({
        take:10,
        skip: currentSnap.version,
        where:{
        aggregateId: aggregateId,
      },
    order:{
      happendIn:'ASC',
    }
  });
  let curentState = plainToClass(Apartment,currentSnap.snapshotinfo);
  for(let ev of events){
    curentState = EventManager[ev.type](ev, curentState);
  }
  const finalResponse:any = curentState;
    if(withChars){ //! с характеристиками
      finalResponse.chars = await this.getChars(curentState.chars);
    }
    finalResponse.images  = await this.getImages(curentState.images);
    finalResponse.subways  = await this.getSubways(curentState.subways);
    console.log(finalResponse);
    finalResponse.id = aggregateId;
    return   curentState;
  }
}