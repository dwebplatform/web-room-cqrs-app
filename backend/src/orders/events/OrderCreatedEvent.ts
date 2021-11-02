import { AggregateRoot, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../../entities/customer.entity';
import { Order } from '../../entities/order.entity';


export class OrderCreatedEvent {
  constructor(public readonly id: number,public readonly  message: string){}
}

export class OrderAgregate extends AggregateRoot{
  constructor(private id: number){
    super();
  }

    reportAboutOrderCreated(message: string){

    console.log("EVENT OrderCreatedEvent WAS OCCURED !!! ");       
    this.apply(new OrderCreatedEvent(this.id, message ));

  }
}



@EventsHandler(OrderCreatedEvent)
export class OrderCreatedEventHandler implements IEventHandler<OrderCreatedEvent>{
 constructor(
  @InjectRepository(Order) private readonly _orderRepo: Repository<Order>, 
  @InjectRepository(Customer) private readonly _repo: Repository<Customer>){}

 async handle(event:OrderCreatedEvent){

    const order = await this._orderRepo.findOne(event.id);

    const customerInfo = order.info.client;
    const customer = new Customer();
    customer.name = customerInfo.name;
    customer.phone = customerInfo.phone;
    
    customer.email = customerInfo.email;
    customer.orders = customer.orders? customer.orders.concat(order): [order];

    await this._repo.save(customer);
  }
}