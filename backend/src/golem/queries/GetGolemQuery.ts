import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { EventEntity, EVENT_TYPES } from '../../entities/event.entity';
import { Repository } from "typeorm";

export class GetGolemQuery{
  constructor(public aggregateId: string){}

}


@QueryHandler(GetGolemQuery)
export class GetOrdersQueryHandler implements IQueryHandler<GetGolemQuery> {
 
  constructor(@InjectRepository(EventEntity) private readonly _eventRepo: Repository<EventEntity>){}
  public async execute(query: GetGolemQuery) {

    const events = await this._eventRepo.find({
      where:{
        aggregateId: query.aggregateId,
      },
      order: {
        happendIn:"ASC"
      }
    });
   
    let curentGolem = {};
    for(let e of events){
      if(e.type === EVENT_TYPES.GOLEM_UPDATED){
        //@ts-ignore
        curentGolem.name = e.data.name;
      } 
      else if(e.type === EVENT_TYPES.GOLEM_CREATED){
        curentGolem = {
          // ...e.data
        }
      } 
      else if(e.type === EVENT_TYPES.GOLEM_DELETED){
        //@ts-ignore
        curentGolem.isDeleted = true;
      }
    }
    return curentGolem;
  }
}