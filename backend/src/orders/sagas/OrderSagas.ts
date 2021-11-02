
import {Injectable} from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';

import { map, Observable } from 'rxjs';
import { ReportAboutOrderCommand } from '../commands/ReportAboutOrder.command';
import { OrderCreatedEvent } from './../events/OrderCreatedEvent';

@Injectable()
export class OrderSagas {

  @Saga()
  orderCreated=(event$:Observable<any>):Observable<ICommand>=>{
      return event$.pipe(ofType(OrderCreatedEvent),
      map((event:any)=>{
        console.log(event);
        return new ReportAboutOrderCommand(event.id);
      }));
  }
}

