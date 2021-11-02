import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToMany, JoinTable } from 'typeorm';
import { Order } from './order.entity';


@Entity()
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  
  @Column()
  phone: string;

  @Column()
  email: string;
  
  @ManyToMany(() => Order)
  @JoinTable()
  orders: Order[];
}