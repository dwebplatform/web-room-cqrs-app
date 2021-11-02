import { BaseEntity, Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';



export enum EVENT_TYPES {
  GOLEM_CREATED="GOLEM_CREATED",
  GOLEM_UPDATED="GOLEM_UPDATED",
  GOLEM_DELETED="GOLEM_DELETED",
  ORDER_CREATED="ORDER_CREATED",
  ORDER_UPDATED="ORDER_UPDATED",
  ORDER_DELETED="ORDER_DELETED",
  APARTMENT_CREATED="APARTMENT_CREATED",
  APARTMENT_UPDATED_NAME="APARTMENT_UPDATED_NAME",
  
  ORDER_PAYED="ORDER_PAYED"
}
@Entity() 
export class EventEntity extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  aggregateId: string;
  
  // enum
  @Column({type:'enum', enum: EVENT_TYPES})
  type: EVENT_TYPES;
  // state
  @Column({type:'json'})
  data: any;

  @CreateDateColumn()
  happendIn: Date;
  
}







