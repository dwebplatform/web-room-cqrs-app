import { CommandHandler, IQueryHandler } from "@nestjs/cqrs";
import { Dragon } from "../dragon.entity";
import { ListDragonQuery } from "../queries/list.query";
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";

export class AddDragonCommand {
    constructor(public name: string){}
}


@CommandHandler(AddDragonCommand)
export class AddDragonHandler implements IQueryHandler<AddDragonCommand>{

  constructor(
    //Here we would inject what is necessary 
    @InjectRepository(Dragon)
    private readonly  _repo: Repository<Dragon>
    ){}
  public async execute(query:AddDragonCommand): Promise<Dragon>{
    const dragon =  Dragon.create();
    dragon.name = query.name;
    return this._repo.save(dragon);
  }
}