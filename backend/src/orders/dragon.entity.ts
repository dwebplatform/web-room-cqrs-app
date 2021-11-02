import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, } from 'typeorm';

@Entity()
export class Dragon extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  
  @Column()
  name: string;
  
  }