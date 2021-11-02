
import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler, EventBus, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { AgregateVersion } from 'src/entities/AgreateVersion.entity';
import { EventEntity, EVENT_TYPES } from 'src/entities/event.entity';
import { Snap } from 'src/entities/snap.entity';
import { Repository } from 'typeorm';
import { Apartment } from 'src/aggregate_like_classes/Apartment';
import { EventManager } from 'src/event_manager/EventManager';

export class UpdateApartmentNameCommand {
  constructor(public name: string, public aggregateId: string, public version: number) { }
}

@CommandHandler(UpdateApartmentNameCommand)
export class UpdateApartmentNameHandler implements IQueryHandler<UpdateApartmentNameCommand>{
  constructor(
    @InjectRepository(EventEntity) private readonly _eventRepo: Repository<EventEntity>,
    @InjectRepository(Snap) private readonly _snapRepo: Repository<Snap>,
    @InjectRepository(AgregateVersion) private readonly _agregateRepo: Repository<AgregateVersion>,
    private readonly eventBus: EventBus
  ) { }

  public async execute(request: UpdateApartmentNameCommand) {
    // update command:
    const event = new EventEntity();
    event.type = EVENT_TYPES.APARTMENT_UPDATED_NAME;
    event.data = { name: request.name };
    event.aggregateId = request.aggregateId;

    const agregateVersion = await this._agregateRepo.findOne({
      aggregateId: event.aggregateId,
      version: request.version
    });
    if (!agregateVersion) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }


    await this._eventRepo.save(event);
    agregateVersion.version = agregateVersion.version + 1;
    await this._agregateRepo.save(agregateVersion);


    const currentSnap = await this._snapRepo.findOne({
      where: {
        aggregateId: request.aggregateId,
      },
      order: {
        version: 'DESC'
      }
    });
    const events = await this._eventRepo.find({
      take: 10,
      skip: currentSnap.version,
      where: {
        aggregateId: request.aggregateId,
      },
      order: {
        happendIn: 'ASC',
      }
    });

    let curentState = plainToClass(Apartment, currentSnap.snapshotinfo);
    for (let ev of events) {
      // заказ создан 
      curentState = EventManager[ev.type](ev, curentState);
      // заказ обновлен может обновиться клиент, квартира, цена
    }
    // side effect для snap:
    if (events.length > 0 && events.length % 10 === 0) {
      let newSnap = new Snap();
      newSnap.aggregateId = currentSnap.aggregateId;
      newSnap.snapshotinfo = curentState;
      newSnap.version = currentSnap.version + 10;
      const savedSnapShot = await this._snapRepo.save(newSnap);
    }
    return curentState;
  }
}