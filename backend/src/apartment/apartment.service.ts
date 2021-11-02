import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ListApartmentQuery } from './queries/ListApartment';

@Injectable()
export class ApartmentService {

  constructor( private readonly commandBus: CommandBus,private readonly queryBus: QueryBus){}

  async getAll(){
    return await this.queryBus.execute(new ListApartmentQuery());
  }

}
