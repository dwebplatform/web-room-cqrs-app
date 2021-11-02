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

@Module({
  imports: [TypeOrmModule.forFeature([Apartment,Snap, AgregateVersion,EventEntity,Characteristic]),
  CqrsModule
],
  controllers: [ApartmentController],
  providers: [ApartmentDomain,ApartmentService,...QueryHandlers,...CommandHandlers]
})
export class ApartmentModule {}
