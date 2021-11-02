import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Dragon } from "../dragon.entity";

export class ListDragonQuery {
  constructor(public dragonName:string ='Wolfy'){}
}
@QueryHandler(ListDragonQuery)
export class ListDragonHadler implements IQueryHandler<ListDragonQuery> {

  constructor(
    // Here we would inject what is necessary to retrieve our data
    //! например репозиторий драконов, с целью получить список драконов
    @InjectRepository(Dragon)
    private readonly _repo: Repository<Dragon>
  ){}

    public async execute(query:ListDragonQuery):Promise<Dragon[]>{
      //! Here we are going to have any necessary logic related
      //! to that Query and return the requested information
      //! such as a service method call
      return await this._repo.find({});
    }

}