import { BaseEntity,Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Characteristic } from "./char.entity";

@Entity()
export class Apartment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  
  @Column()
  description: string;

  @Column({type:'json', default: '[]'})
  images: string[];

  //type => Role, role => role.users
  // () => Characteristic
  @ManyToMany(type=>Characteristic,role=>role.apartments )
  @JoinTable()
  characteristics: Characteristic[];
    
}