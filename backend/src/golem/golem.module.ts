import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/entities/customer.entity';
import { EventEntity } from 'src/entities/event.entity';
import { Order } from 'src/entities/order.entity';
import { CommandHandlers } from './commands';
import { Dragon } from 'src/orders/dragon.entity';
import { Snap } from 'src/entities/snap.entity';
import { GolemController } from './golem.controller';
import { QueryHandlers } from './queries';

@Module({
  imports: [TypeOrmModule.forFeature([Order,Customer,Dragon,EventEntity,Snap]),
  CqrsModule
  ],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers
    ],
  controllers: [GolemController]
})
export class GolemModule {}
