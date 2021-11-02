import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Dragon } from '../../orders/dragon.entity';

export class GetDragonById {
  constructor(public id: number){}
}


@QueryHandler(GetDragonById)
export class GetDragonByIdHandler implements IQueryHandler<GetDragonById> {
  
  constructor(
    @InjectRepository(Dragon)
    private readonly _repo: Repository<Dragon>
  ){}
  public async execute(query: GetDragonById):Promise<Dragon>{
    // return dragon by its ID:
    return await this._repo.findOne(query.id);

  }
}