import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "../../entities/order.entity";


export class GetOrderById {
  constructor(public orderId: number){}
}


@QueryHandler(GetOrderById)
export class GetOrderByIdHandler implements IQueryHandler<GetOrderById>{
  
  constructor(
    @InjectRepository(Order)
    private readonly _orderRepo: Repository<Order>){}

  public async execute(query: GetOrderById){
    return await this._orderRepo.findOne(query.orderId);
  }
}