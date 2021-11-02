import { BaseEntity, Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';

export class VersionEntity  extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  aggregateId: string;

  @Column()
  version: number;

}