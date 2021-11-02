import { BaseEntity,Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
 
@Entity()
export class AgregateVersion extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  aggregateId: string;  

  @Column()
  version: number;
    
}