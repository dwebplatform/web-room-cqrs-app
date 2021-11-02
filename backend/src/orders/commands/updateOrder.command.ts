import { CreateOrderDto } from "../dtos/create-order.dto";
import { CommandHandler, EventBus, EventPublisher, IQueryHandler } from '@nestjs/cqrs';
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderAgregate } from "../events/OrderCreatedEvent";
import { classToPlain, Expose, plainToClass, Type } from "class-transformer";
import { EventEntity, EVENT_TYPES } from 'src/entities/event.entity';
import { Snap } from "src/entities/snap.entity";
import { v4 as uuidv4 } from 'uuid';
import { IsOptional, IsString, ValidateNested } from "class-validator";
import { HttpException, HttpStatus } from '@nestjs/common';
import { AgregateVersion } from './../../entities/AgreateVersion.entity';
import { OrderUpdatedEvent } from '../events/OrderUpdated.event';


class Client {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  comment: string;

  @Expose()
  @IsString()
  phone: string;

  @Expose()
  @IsString()
  email: string;
}
class OrderInfo {
  @Expose()
  @IsOptional()
  @ValidateNested({each:true})
  @Type(() => Client)
  client: Client;

  @Expose()
  @IsOptional()
  totalPrice: number;

  @Expose()
  @IsOptional()
  apartment: any;


}
export class UpdateOrderDto {
  @Expose()
  @IsString()
  aggregateId: string;
  
  @Expose()
  version: number;

  @Expose()
  @ValidateNested({each:true})
  @Type(() => OrderInfo)
  info: OrderInfo;
    
  
}

class Order {
  info: {
    client: any;
    totalPrice: any;
    apartment: any;
  };
}
export class UpdateOrderCommand {
  constructor(public readonly updateOrderDto: UpdateOrderDto){}
}



@CommandHandler(UpdateOrderCommand)
export class UpdateOrderHandler implements IQueryHandler<UpdateOrderCommand>{
  
  constructor(
    @InjectRepository(EventEntity) private readonly _eventRepo: Repository<EventEntity>,
    @InjectRepository(Snap) private readonly _snapRepo: Repository<Snap>,
    @InjectRepository(AgregateVersion) private readonly _agregateRepo: Repository<AgregateVersion>,
    private readonly eventBus: EventBus
  ){}


  public async execute(request:UpdateOrderCommand):Promise<any>{
    // ЭТАПЫ ОБНОВЛЕНИЯ ЗАКАЗА:
    // 1 создаем событие типа ORDER_UPDATED
    const event = new EventEntity();
    event.type = EVENT_TYPES.ORDER_UPDATED;
    event.data = request.updateOrderDto.info;
    event.aggregateId = request.updateOrderDto.aggregateId;
    //если не было такого агрегата, для данного события выбрасываем ошибку
    const agregateVersion =  await this._agregateRepo.findOne({
      aggregateId:event.aggregateId,
      version: request.updateOrderDto.version
    });
    if(!agregateVersion){
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
    
    await this._eventRepo.save(event);
    agregateVersion.version =  agregateVersion.version + 1;
    await this._agregateRepo.save(agregateVersion);
    this.eventBus.publish(new OrderUpdatedEvent(event.aggregateId));
    // находим последние 10 событий после последней версии,  
   const order = await this.getOrder(event.aggregateId);
   return order;
  }


  public async  getOrder(aggregateId: string):Promise<any>{
    const currentSnap = await this._snapRepo.findOne({
      where: {
        aggregateId: aggregateId,
      },
      order: {
        version: 'DESC'
      }
    });
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
  const curentState = plainToClass(Order,currentSnap.snapshotinfo);
  for(let ev of events){
    // заказ создан 
    if(ev.type === EVENT_TYPES.ORDER_CREATED){
      curentState.info = ev.data.info;
    }
    // заказ обновлен может обновиться клиент, квартира, цена
    if(ev.type === EVENT_TYPES.ORDER_UPDATED){
      curentState.info = {
        ...curentState.info,
        apartment : ev.data.apartment||curentState.info.apartment,
        client: ev.data.client|| curentState.info.client,
        totalPrice: ev.data.totalPrice|| curentState.info.totalPrice
      };
    }
  }
  // side effect:
  if(events.length > 0 && events.length % 10 === 0){
    let newSnap = new Snap();
    newSnap.aggregateId = currentSnap.aggregateId;
    newSnap.snapshotinfo = curentState;
    newSnap.version = currentSnap.version + 10;
    const savedSnapShot = await this._snapRepo.save(newSnap);
  }
    return curentState;
  }



  
}


/**
 *  const events = await this._eventRepo.find({
          take:10,
          skip: currentSnap.version,
          where:{
          aggregateId: request.updateOrderDto.aggregateId,
        },
      order:{
        happendIn:'ASC',
      }
    });
    // если создалось больше 10 событий воссоздаем текущее состояние прикрепляя к текущему последние 10:
    if(events.length>0 && events.length % 10 === 0){
     
      //FROM data to curentState 
      const curentState = plainToClass(Order,currentSnap.snapshotinfo);
      for(let ev of events){
        // заказ создан 
        if(ev.type === EVENT_TYPES.ORDER_CREATED){
          curentState.info = ev.data.info;
        }
        // заказ обновлен может обновиться клиент, квартира, цена
        if(ev.type === EVENT_TYPES.ORDER_UPDATED){

          curentState.info = {
            ...curentState.info,
            apartment : ev.data.apartment||curentState.info.apartment,
            client: ev.data.client|| curentState.info.client,
            totalPrice: ev.data.totalPrice|| curentState.info.totalPrice
          };
        }
      }
      // side effect:
      let newSnap = new Snap();
      newSnap.aggregateId =currentSnap.aggregateId;
      newSnap.snapshotinfo = curentState;
      newSnap.version = currentSnap.version+10;
      // наш новый snapShot ура:
      const savedSnapShot = await this._snapRepo.save(newSnap);
      return curentState;
    }
 */