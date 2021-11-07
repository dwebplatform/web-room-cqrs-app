import { CommandHandler, IQueryHandler } from "@nestjs/cqrs";
import { AddApartmentImagesDto } from "../dtos/addApartmentImagesDto";
import { EventEntity } from 'src/entities/event.entity';
import { EVENT_TYPES } from 'src/entities/event.entity';
import { AgregateVersion } from "src/entities/AgreateVersion.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Snap } from "src/entities/snap.entity";
import { plainToClass } from "class-transformer";
import { Apartment } from "src/entities/apartment.entity";
import { EventManager } from "src/event_manager/EventManager";

export class AddImagesToApartmentCommand {
  constructor(public readonly addApartmentImagesDto: AddApartmentImagesDto) { }
}

@CommandHandler(AddImagesToApartmentCommand)
export class AddImagesToApartmentHandler implements IQueryHandler<AddImagesToApartmentCommand> {

  constructor(
    @InjectRepository(EventEntity) private readonly _eventRepo: Repository<EventEntity>,
    @InjectRepository(Snap) private readonly _snapRepo: Repository<Snap>,
    @InjectRepository(AgregateVersion) private readonly _agregateRepo: Repository<AgregateVersion>) { }
  public async execute(request: AddImagesToApartmentCommand): Promise<any> {
    const event = new EventEntity();
    event.type = EVENT_TYPES.ADD_IMAGES_TO_APARTMENT;
    event.aggregateId = request.addApartmentImagesDto.aggregateId;

    event.data = { imageIds: request.addApartmentImagesDto.imageIds };
    const agregateVersion = await this._agregateRepo.findOne({
      aggregateId: event.aggregateId,
      version: request.addApartmentImagesDto.version
    });

    if (!agregateVersion) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }


    await this._eventRepo.save(event);
    agregateVersion.version = agregateVersion.version + 1;
    await this._agregateRepo.save(agregateVersion);

    const currentSnap = await this._snapRepo.findOne({
      where: {
        aggregateId: request.addApartmentImagesDto.aggregateId,
      },
      order: {
        version: 'DESC'
      }
    });
 
    const events = await this._eventRepo.find({
      take: 10,
      skip: currentSnap.version,
      where: {
        aggregateId: request.addApartmentImagesDto.aggregateId,
      },
      order: {
        happendIn: 'ASC',
      }
    });

    let curentState = plainToClass(Apartment, currentSnap.snapshotinfo);
    for (let ev of events) {
      curentState = EventManager[ev.type](ev, curentState);
    }

    // side effect для snap:
    if (events.length > 0 && events.length % 10 === 0) {
      let newSnap = new Snap();
      newSnap.aggregateId = currentSnap.aggregateId;
      newSnap.snapshotinfo = curentState;
      newSnap.version = currentSnap.version + 10;
      await this._snapRepo.save(newSnap);
    }
  
    return {
      ...curentState,
      version: agregateVersion.version
    }
  }
}