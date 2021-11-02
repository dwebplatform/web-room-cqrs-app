import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from '@nestjs/typeorm';
import { Aparment } from "src/orders/dtos/create-order.dto";
import { Apartment } from 'src/entities/apartment.entity';
import { Repository } from "typeorm";
import { ApartmentDomain } from './../domains/ApartmentDomain';


export class GetApartmentById {
  constructor(public apartmentId: string){}
}

@QueryHandler(GetApartmentById)
export class GetApartmentByIdHandler implements IQueryHandler<GetApartmentById>{
  constructor(@InjectRepository(Apartment) private readonly _apartmentRepository: Repository<Aparment>,
  private readonly apartmentDomain: ApartmentDomain
  ){}
  
  public async execute(query: GetApartmentById){
    const apartment = await this.apartmentDomain.getApartment(query.apartmentId, true);
    return apartment;
  }
}