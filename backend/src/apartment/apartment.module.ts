import { Module } from '@nestjs/common';
import { ApartmentController } from './apartment.controller';
import { ApartmentService } from './apartment.service';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import {QueryHandlers} from './queries';
import { CommandHandlers } from './commands';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apartment } from '../entities/apartment.entity';
import { Snap } from './../entities/snap.entity';
import { AgregateVersion } from 'src/entities/AgreateVersion.entity';
import { EventEntity } from 'src/entities/event.entity';
import { ApartmentDomain } from './domains/ApartmentDomain';
import { Characteristic } from 'src/entities/char.entity';
import { ImageEntity } from 'src/entities/Image.entity';
import { SubwayTimeInfo } from 'src/entities/SubwayTimeInfo.entity';

import { Subway } from './../entities/Subway.entity';
import { ApartmentFilterDomain } from './domains/ApartmentFilterDomain';
import { ApartmentTransformFieldsDomain } from './domains/ApartmentTransformFieldsDomain';

@Module({
  imports: [TypeOrmModule.forFeature([Apartment,Snap, AgregateVersion,EventEntity,Characteristic,ImageEntity,SubwayTimeInfo, Subway]),
CqrsModule
],
  controllers: [ApartmentController],
  providers: [ApartmentDomain,ApartmentFilterDomain,ApartmentTransformFieldsDomain, ApartmentService,...QueryHandlers,...CommandHandlers]
})
export class ApartmentModule {}
