import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Apartment } from 'src/entities/apartment.entity';

export interface IFilter {
  char?: string;
}
export class ListApartmentQuery {
  constructor(public filter?:IFilter){}
}
@QueryHandler(ListApartmentQuery)
export class ListApartmentHadler implements IQueryHandler<ListApartmentQuery> {

  constructor(
    @InjectRepository(Apartment)
    private readonly _repo: Repository<Apartment>
  ){}
    public async execute(query:ListApartmentQuery):Promise<any>{
      const filter = query.filter ? query.filter :{};

      const selectorFilter = {
        relations:[]
      };
      if(filter.char && filter.char === 'true'){
        selectorFilter.relations.push('characteristics');
      }
      return this._repo.find(selectorFilter);
    }

}