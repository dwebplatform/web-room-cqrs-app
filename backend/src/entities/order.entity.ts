import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { Info } from '../orders/dtos/create-order.dto';


export enum STATUSES {
  CREATED="CREATED",
  CANCELLED="CANCELLED",
  PENDING="PENDING"
}


class InfoDto {
  client: {
    name: string;
    phone: string; 
    email:string;
  };
  apartment: {
    id: number;
    name: string;
    from: string;
    to: string;
  };
  totalPrice: any;  
}
@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({type:'json', 
    default: JSON.stringify({
    client: {},
    apartment: {},
    totalPrice: 0 
  })})
  info: Info;

  @Column({
      type: "enum",
      enum: STATUSES,
      default: STATUSES.CREATED
  })
  status: STATUSES;
  
}