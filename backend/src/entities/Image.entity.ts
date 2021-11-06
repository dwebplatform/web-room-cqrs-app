

// id, path, originalName, fileName, createdAt

import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ImageEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;
  
  @Column()
  originalName: string;

  @Column()
  fileName: string;
  
  @CreateDateColumn()
  createdAt: Date;


}