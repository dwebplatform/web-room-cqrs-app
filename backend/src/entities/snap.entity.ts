import { BaseEntity, Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Snap extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  aggregateId: string;

  @Column()
  version: number;

  @Column({type:'json'})
  snapshotinfo: any;
}