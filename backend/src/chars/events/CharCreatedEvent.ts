import { AggregateRoot, EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Characteristic } from 'src/entities/char.entity';
import { Repository } from 'typeorm';
import { Apartment } from '../../entities/apartment.entity';


export class CharCreatedEvent {
  constructor(public readonly id:number,public readonly apartmentId:number){}
}

export class CharAggregate extends AggregateRoot {
  constructor(private id: number){
    super();
  }

  addApartmentToChar(apartmentId:number){
    console.log('CHAR WAS CREATED');
    this.apply(new CharCreatedEvent(this.id,apartmentId));
  }
}

@EventsHandler(CharCreatedEvent)
export class CharCreatedEventHandler implements IEventHandler<CharCreatedEvent>{
  
  constructor(@InjectRepository(Apartment) private readonly _apartmentRepo: Repository<Apartment>,@InjectRepository(Characteristic) private readonly _charRepo: Repository<Characteristic>){}
  
  async handle(event:CharCreatedEvent){
    const apartment = await  this._apartmentRepo.findOne(event.apartmentId,{relations:['characteristics']}) ;
    const characteristic = await this._charRepo.findOne(event.id);
    apartment.characteristics = apartment.characteristics.concat(characteristic);
    return await this._apartmentRepo.save(apartment);    
  }
}