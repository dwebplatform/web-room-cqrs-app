import { CreateOrderDto } from "../dtos/create-order.dto";
import { CommandHandler, EventPublisher, IQueryHandler } from '@nestjs/cqrs';
import { Order } from "../../entities/order.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderAgregate } from "../events/OrderCreatedEvent";
import { EventEntity, EVENT_TYPES } from '../../entities/event.entity';


export class ReportAboutOrderCommand {
  constructor(public readonly orderId: number){}
}


@CommandHandler(ReportAboutOrderCommand)
export class ReportAboutOrderHandler implements IQueryHandler<ReportAboutOrderCommand>{
  
  constructor(@InjectRepository(EventEntity) private readonly _eventRepository: Repository<EventEntity>){}
  public async execute(request:ReportAboutOrderCommand):Promise<any>{
    console.log(request);
    const {orderId} = request;
    // const orderEvent = new EventEntity();
    // orderEvent.value = `${orderId}`;
    // orderEvent.type = EVENT_TYPES.ORDER;
    // orderEvent.fromState = "Не было";
    // orderEvent.toState = "Заказ создан";
    
    // await this._eventRepository.save(orderEvent);
  }
}
