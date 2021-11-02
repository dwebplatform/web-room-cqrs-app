import { CreateOrderDto } from "../dtos/create-order.dto";
import { CommandHandler, EventPublisher, IQueryHandler } from '@nestjs/cqrs';
import { Order } from "../../entities/order.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderAgregate } from "../events/OrderCreatedEvent";
import { classToPlain } from "class-transformer";
import { EventEntity, EVENT_TYPES } from 'src/entities/event.entity';
import { Snap } from "src/entities/snap.entity";
import { v4 as uuidv4 } from 'uuid';
import { AgregateVersion } from "src/entities/AgreateVersion.entity";


export class CreateOrderCommand {
  constructor(public readonly createOrderDto: CreateOrderDto){}
}


@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements IQueryHandler<CreateOrderCommand>{
  
  constructor(
    @InjectRepository(EventEntity) private readonly _eventEntity: Repository<EventEntity>,
    @InjectRepository(Snap) private readonly _snapRepo: Repository<Snap>,
    @InjectRepository(AgregateVersion) private readonly _agregateRepo: Repository<AgregateVersion>,
    private publisher: EventPublisher
  ){}
  public async execute(request:CreateOrderCommand):Promise<any>{
    // создаем event ORDER_CREATED создаем snapShot версии 0: 
    const event = new EventEntity();
    event.aggregateId = uuidv4();
    event.type = EVENT_TYPES.ORDER_CREATED;
    event.data = {
      info: request.createOrderDto.info,
      status: request.createOrderDto.status
    };
    const snapShot = new Snap();

    // создаем snapshot этого заказа:
    snapShot.aggregateId = event.aggregateId;

    snapShot.snapshotinfo = event.data;
    snapShot.version = 0;
    const aggregateVersion =  new AgregateVersion();
    aggregateVersion.version = 0;
    aggregateVersion.aggregateId = event.aggregateId;
    await this._agregateRepo.save(aggregateVersion);
    await this._eventEntity.save(event);
    await this._snapRepo.save(snapShot); 
    return {
      status:'ok',
      message:'Заказ успешно создан'
    };
  }
}
