import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharsController } from './chars.controller';
import { CommandHandlers } from './commands';
import { Characteristic } from 'src/entities/char.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { QueriesHandlers } from './queries';
import { EventHandlers } from './events';
import { Apartment } from 'src/entities/apartment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Characteristic,Apartment]),
  CqrsModule
],
  controllers: [CharsController],
  providers:[...CommandHandlers,...QueriesHandlers,...EventHandlers]
})
export class CharsModule {}
