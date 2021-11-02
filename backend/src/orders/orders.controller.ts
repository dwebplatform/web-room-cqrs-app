import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrderCommand } from './commands/createOrder.command';
import { Customer } from '../entities/customer.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { Order } from '../entities/order.entity';
import { ListDragonQuery } from './queries/list.query';
import { GetOrdersQuery } from './queries/getOrders';
import { GetOrderById } from './queries/getOrderById';
import { UpdateOrderCommand, UpdateOrderDto } from './commands/updateOrder.command';

@Controller('orders')
export class OrdersController {

  constructor(private readonly commandBus: CommandBus,private readonly queryBus: QueryBus) { }


  @Get('/')
  async getAllOrders(@Res() response, @Query('status') status: string ) {
    try{
      const orders = await this.queryBus.execute(new GetOrdersQuery());
      return response.status(HttpStatus.OK).json(orders);
    } catch(err){
        throw new HttpException('Не удалось получить список заказов',HttpStatus.BAD_REQUEST);
    }

  }

  @Get('/:orderId')
  async getOrder(@Param('orderId') orderId: string){
    // return query
    try{
      return this.queryBus.execute(new GetOrderById(+orderId));
    } catch(err){
      throw new HttpException('Не удалось получить заказ по данному id', HttpStatus.BAD_REQUEST);
    }
  }
  @Post('/create')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.commandBus.execute(new CreateOrderCommand(createOrderDto));
  }
  @Post('/update')
  async updateOrder(@Body() updateOrderDto: UpdateOrderDto){
    return this.commandBus.execute(new UpdateOrderCommand(updateOrderDto));
  }
}
