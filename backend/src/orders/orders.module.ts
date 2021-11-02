import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { Customer } from '../entities/customer.entity';
import { Dragon } from './dragon.entity';
import { QueriesHandlers } from './queries';
import { CommandHandlers } from './commands';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';

import { EventHandlers } from './events';
import { EventEntity } from '../entities/event.entity';
import { sagas } from './sagas/index';
import { Snap } from 'src/entities/snap.entity';
import { AgregateVersion } from 'src/entities/AgreateVersion.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Order,Customer,Dragon,EventEntity,Snap,AgregateVersion]),
CqrsModule
],
  controllers: [OrdersController],
  providers: [
  ...QueriesHandlers,
  ...CommandHandlers,
  ...EventHandlers,
     ...sagas 
  ]
})
export class OrdersModule {}
