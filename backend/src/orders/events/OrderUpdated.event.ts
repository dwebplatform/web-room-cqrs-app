import { EventsHandler, IEventHandler } from "@nestjs/cqrs";

export class OrderUpdatedEvent  {
  constructor(public readonly aggregateId: string){}
}


@EventsHandler(OrderUpdatedEvent)
export class OrderUpdatedEventHandler implements  IEventHandler<OrderUpdatedEvent>{
  handle(event:OrderUpdatedEvent){
    console.log('Событие OrderCreated Event было обработано',event.aggregateId);
  }
}