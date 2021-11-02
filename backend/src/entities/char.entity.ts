
import { Apartment } from '../entities/apartment.entity';
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';



export enum KEY_VARIANTS {
  ARRAY ="ARRAY",
  STRING="STRING",
  BOOL="BOOL",

}
@Entity()
export class Characteristic extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  keyName: string;

  @Column({type:'enum', enum: KEY_VARIANTS, default: KEY_VARIANTS.STRING})
  valueType: KEY_VARIANTS;

  @Column({default:null})
  STRING_VALUE: string;

  @Column({default:null})
  BOOL_VALUE: boolean;
  
  @Column({type:'json', default:null})
  ARRAY_VALUE: Array<any>;


  @ManyToMany(type=>Apartment,role=>role.characteristics )
  @JoinTable()
  apartments: Apartment[];
}