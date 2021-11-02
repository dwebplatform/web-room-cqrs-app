import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Order } from "../../entities/order.entity";



interface IFilter {
  status: string;
}
export class GetOrdersQuery {
  constructor(public filter?:IFilter){}
}

@QueryHandler(GetOrdersQuery)
export class GetOrdersQueryHandler implements IQueryHandler<GetOrdersQuery> {
  constructor(@InjectRepository(Order) private readonly _repo: Repository<Order>){}
  public async execute(query: GetOrdersQuery) {
    const filter = query.filter ? query.filter: {};
    return await this._repo.find({});
  }
}