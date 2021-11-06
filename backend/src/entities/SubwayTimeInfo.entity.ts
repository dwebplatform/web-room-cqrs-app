import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class SubwayTimeInfo extends BaseEntity {


  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  apartmentId: string;

  @Column()
  subwayId: string;

  @Column()
  timeInfo: string;
}