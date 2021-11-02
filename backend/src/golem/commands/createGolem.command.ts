import { CommandHandler, IQueryHandler } from "@nestjs/cqrs";
import { EventEntity, EVENT_TYPES } from 'src/entities/event.entity';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { classToPlain, Expose } from "class-transformer";
import { IsBoolean, IsNumber, IsString } from "class-validator";
import { Snap } from './../../entities/snap.entity';

// create rebuild strict connection

export class GolemCreateDto {
  @Expose()
  @IsString()
  name: string;

  @IsNumber()
  @Expose()
  level: number;

  @Expose()
  @IsBoolean()
  isDanger: boolean;
}
export class CreateGolemCommand{
  constructor(public readonly data: GolemCreateDto){}
}

//!!! ПРАВИЛО:, если хотим обновлять запись, с НОВЫМИ полями, например, что у ГОЛЕМА БУДЕТ НОВОЕ поле, то НЕ ИЗМЕНЯЕМ СОБЫТИЯ, А ДОБАВЛЯЕМ НОВЫЕ!!!!
@CommandHandler(CreateGolemCommand)
export class CreateGolemHandler implements IQueryHandler<CreateGolemCommand>{
  constructor(
  @InjectRepository(EventEntity) private readonly _eventRepo: Repository<EventEntity>,
  @InjectRepository(Snap) private readonly _snapRepo: Repository<Snap>,
  ){}
  public async execute(request: CreateGolemCommand){
    // insert into event this stuff
    const event = new EventEntity();
    event.type = EVENT_TYPES.GOLEM_CREATED;
    event.data = request.data;

    event.aggregateId = uuidv4();

    // создаем snapShot
    const snapShot = new Snap();
    snapShot.aggregateId = event.aggregateId;

    snapShot.snapshotinfo = event.data;
    snapShot.version  = 0;
    await this._snapRepo.save(snapShot);    
    /**
     * поле data:{
     * name:"Marlock",
     * level: 17,
     * isDanger: false
     * }
     */
    return await this._eventRepo.save(event);
  }
}

