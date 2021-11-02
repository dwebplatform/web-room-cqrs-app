import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { classToPlain, plainToClass } from "class-transformer";
import { EventEntity, EVENT_TYPES } from 'src/entities/event.entity';
import { Repository } from "typeorm";
import { UpdateGolemDto } from './../dtos/UpdateGolem.dto';
import { Snap } from 'src/entities/snap.entity';

class Golem {
  name: string;
  isDanger: boolean;
  level: number;

}

export class UpdateGolemCommand {
  constructor(public updateGolemDto:UpdateGolemDto) { }
}

@CommandHandler(UpdateGolemCommand)
export class UpdateGolemCommandHandler implements ICommandHandler<UpdateGolemCommand>{

  constructor(@InjectRepository(EventEntity) private readonly _eventRepo: Repository<EventEntity>,
  @InjectRepository(Snap) private readonly _snapRepo: Repository<Snap>
  ) { }
  public async execute(request: UpdateGolemCommand) {
    const event = new EventEntity();
    // snapRepository
    // в зависимости от типа пришедшего к нам по разному должны обновлять данные в таблице
    event.type = request.updateGolemDto.eventType;
    event.data = request.updateGolemDto.data;
    event.aggregateId = request.updateGolemDto.aggregateId;
    // находим сущность в "срезе" по версии и aggregateId, далее восстанавливаем ее применяем событие обновляем версию, и текущее состояние
    const currentSnap = await this._snapRepo.findOne({
      where:{
        aggregateId: request.updateGolemDto.aggregateId
      },
      order: {
        version: 'DESC'
      }
    });
    await this._eventRepo.save(event);
    const events = await this._eventRepo.find({
          take:10,
          skip: currentSnap.version,
          where:{
          aggregateId: request.updateGolemDto.aggregateId,
        },
      order:{
        happendIn:'ASC',

      },
      
    });
    if(events.length>0 && events.length % 10 === 0){
     
      //FROM data to curentState 
      const curentState = plainToClass(Golem,currentSnap.snapshotinfo);
      for(let ev of events){
        // applyeachEvent()
        if(ev.type === EVENT_TYPES.GOLEM_UPDATED){

          curentState.name = ev.data.name||curentState.name;
          
          curentState.level = ev.data.level||curentState.level;
          
          curentState.isDanger = ev.data.isDanger||curentState.isDanger;

        }
      }
      let newSnap = new Snap();
      newSnap.aggregateId =currentSnap.aggregateId;
      newSnap.snapshotinfo = curentState;
      newSnap.version = currentSnap.version+10;
      
      return await this._snapRepo.save(newSnap);
      /** {"name":"Karl","isDanger":true,"level":17,"eventType":"GOLEM_CREATED"} */
      
      // make snapshot
      // находим ПОСЛЕДНИЙ СНЕПШОТ из снепшотов принадлежащих ЭТОМУ аггрегату, последней версии,
      // добавляем к версии цифру 10
      // после берем из снепшота данные, состояния сохраненного в нем, и извлекаем его в объект, который можно преобразовать
      // далее проходимся списком событий, которые идут после этой версии, и соответсвенно меняем состояние-> сохраняем новый снепшот

    }
    
  }
}