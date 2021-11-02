import { NotFoundException } from "@nestjs/common";
import { CommandHandler, IQueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { Dragon } from "../dragon.entity";


export class UpdateDragonCommand{
  constructor(public readonly id: number, public name: string){}

};

@CommandHandler(UpdateDragonCommand)
export class UpdateDragonHandler implements IQueryHandler<UpdateDragonCommand> {
  

  constructor(@InjectRepository(Dragon) private readonly _repo:Repository<Dragon>){}

  public async execute(query:UpdateDragonCommand):Promise<Dragon>{
    const dragon = await this._repo.findOne(query.id);
    if(!dragon){
      throw new NotFoundException('Dragon not found');
    }
    dragon.name = query.name;

    return this._repo.save(dragon);
  }
}