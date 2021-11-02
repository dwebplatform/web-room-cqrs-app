import { CommandHandler, EventPublisher, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { AgregateVersion } from 'src/entities/AgreateVersion.entity';
import { EventEntity, EVENT_TYPES } from 'src/entities/event.entity';
import { Snap } from 'src/entities/snap.entity';
import { Repository } from 'typeorm';
import { CreateApartmentDto } from '../dtos/CreateApartment.dto';

import { v4 as uuidv4 } from 'uuid';

export class CreateApartmentCommand {
  constructor(public readonly createApartmentDto: CreateApartmentDto){}
}

@CommandHandler(CreateApartmentCommand)
export class CreateApartmentHandler implements IQueryHandler<CreateApartmentCommand>{
  constructor(
    @InjectRepository(EventEntity) private readonly _eventEntity: Repository<EventEntity>,
    @InjectRepository(Snap) private readonly _snapRepo: Repository<Snap>,
    @InjectRepository(AgregateVersion) private readonly _agregateRepo: Repository<AgregateVersion>,
    private publisher: EventPublisher
  ){}
  public async execute(request:CreateApartmentCommand) {
    // создаем событие APARTMENT_CREATED
    const event = new EventEntity();
    event.aggregateId = uuidv4();
    event.type = EVENT_TYPES.APARTMENT_CREATED;
    event.data = {
      ...request.createApartmentDto
    };
  
    const snapShot = new Snap();
    snapShot.aggregateId = event.aggregateId;

    snapShot.snapshotinfo = event.data;
    snapShot.version = 0;
    const aggregateVersion =  new AgregateVersion();
    aggregateVersion.version = 0;
    aggregateVersion.aggregateId = event.aggregateId;
    // сохраняем версию события
    await this._agregateRepo.save(aggregateVersion);
    // сохраняем само событие
    await this._eventEntity.save(event);
    // сохраняем снимок события
    await this._snapRepo.save(snapShot); 
    return {
      status:'ok',
      msg:'Квартира создана успешно'
    };
  }
}