import { CommandHandler, EventPublisher, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { AgregateVersion } from 'src/entities/AgreateVersion.entity';
import { EventEntity, EVENT_TYPES } from 'src/entities/event.entity';
import { Snap } from 'src/entities/snap.entity';
import { Repository } from 'typeorm';
import { CreateApartmentDto } from '../dtos/CreateApartment.dto';

import { v4 as uuidv4 } from 'uuid';
import { Expose, plainToClass } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Apartment } from 'src/aggregate_like_classes/Apartment';
import { EventManager } from 'src/event_manager/EventManager';
import { ChangeApartmentNameDto } from '../dtos/ChangeApartmentDto';


export class ChangeApartmentNameCommand {
  constructor(public readonly changeApartmentNameDto: ChangeApartmentNameDto){}
}

@CommandHandler(ChangeApartmentNameCommand)
export class ChangeApartmentNameHandler implements IQueryHandler<ChangeApartmentNameCommand>{
  constructor(
    @InjectRepository(EventEntity) private readonly _eventRepo: Repository<EventEntity>,
    @InjectRepository(Snap) private readonly _snapRepo: Repository<Snap>,
    @InjectRepository(AgregateVersion) private readonly _agregateRepo: Repository<AgregateVersion>,
    private publisher: EventPublisher
  ){}
  public async execute(request:ChangeApartmentNameCommand) {
    // создаем событие APARTMENT_NAME_CHANGED
    const event = new EventEntity();
    event.type = EVENT_TYPES.APARTMENT_NAME_CHANGED;
    event.data = { name: request.changeApartmentNameDto.name };
    event.aggregateId = request.changeApartmentNameDto.aggregateId;

    const agregateVersion = await this._agregateRepo.findOne({
      aggregateId: event.aggregateId,
      version: request.changeApartmentNameDto.version
    });
    if (!agregateVersion) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

    await this._eventRepo.save(event);
    agregateVersion.version = agregateVersion.version + 1;
    await this._agregateRepo.save(agregateVersion);
    const currentSnap = await this._snapRepo.findOne({
      where: {
        aggregateId: request.changeApartmentNameDto.aggregateId,
      },
      order: {
        version: 'DESC'
      }
    });
    const events = await this._eventRepo.find({
      take: 10,
      skip: currentSnap.version,
      where: {
        aggregateId: request.changeApartmentNameDto.aggregateId,
      },
      order: {
        happendIn: 'ASC',
      }
    });

    let curentState = plainToClass(Apartment, currentSnap.snapshotinfo);
    for (let ev of events) {
      curentState = EventManager[ev.type](ev, curentState);
      // заказ обновлен может обновиться клиент, квартира, цена
    }
    // side effect для snap:
    if (events.length > 0 && events.length % 10 === 0) {
      let newSnap = new Snap();
      newSnap.aggregateId = currentSnap.aggregateId;
      newSnap.snapshotinfo = curentState;
      newSnap.version = currentSnap.version + 10;
      await this._snapRepo.save(newSnap);
    }
    return {...curentState, version: agregateVersion.version,id: request.changeApartmentNameDto.aggregateId };
  }
}