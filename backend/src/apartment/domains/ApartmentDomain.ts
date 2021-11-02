import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Snap } from "src/entities/snap.entity";
import { In, Repository } from "typeorm";
import { EventEntity, EVENT_TYPES } from 'src/entities/event.entity';
import { Expose, plainToClass } from "class-transformer";
import { Order } from "src/entities/order.entity";
import { IsArray, IsPositive, IsString } from "class-validator";
import { Characteristic } from "src/entities/char.entity";
import { Apartment } from "src/aggregate_like_classes/Apartment";
import { EventManager } from "src/event_manager/EventManager";



// aggregate analog


@Injectable()
export class ApartmentDomain {
  
  constructor(
    @InjectRepository(EventEntity) private readonly _eventRepo: Repository<EventEntity>,
    @InjectRepository(Snap) private readonly _snapRepo: Repository<Snap>,
    @InjectRepository(Characteristic) private readonly _charRepo: Repository<Characteristic>
    ){
  }
  public async getChars(charIds: string[]){
    return await this._charRepo.find({where:{
      id: In(charIds)
    }});
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
      finalResponse.chars = this.getChars(curentState.chars);
    }
    finalResponse.id = aggregateId
    return   curentState;
  }
}