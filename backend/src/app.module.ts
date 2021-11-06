import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Customer } from './entities/customer.entity';
import { Dragon } from './orders/dragon.entity';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Apartment } from './entities/apartment.entity';
import { Characteristic } from './entities/char.entity';
import { ApartmentModule } from './apartment/apartment.module';
import { EventEntity } from './entities/event.entity';
import { CharsModule } from './chars/chars.module';
import { GolemModule } from './golem/golem.module';

import { Snap } from './entities/snap.entity';
import { AgregateVersion } from './entities/AgreateVersion.entity';
import { ImageEntity } from './entities/Image.entity';
import { Subway } from './entities/Subway.entity';
import { SubwayTimeInfo } from './entities/SubwayTimeInfo.entity';

@Module({
  imports: [
TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'apartment_with_mental_db',
      entities: [
        Subway,
        SubwayTimeInfo,
        Order, 
        Apartment,
        Characteristic, 
        Customer,
        Dragon, 
        EventEntity, 
        Snap,
        AgregateVersion,
        ImageEntity],
      synchronize: false,
    }),
    OrdersModule,
    EventEmitterModule.forRoot(),
    ApartmentModule,
    CharsModule,
    GolemModule,
  ],
  controllers: [AppController],
  providers: [AppService,CommandBus, QueryBus],
})
export class AppModule {}
