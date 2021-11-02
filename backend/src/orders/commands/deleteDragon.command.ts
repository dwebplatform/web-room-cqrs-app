import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dragon } from '../dragon.entity';


export class DeleteDragonCommand {
  constructor(public readonly id:number){}
}


@CommandHandler(DeleteDragonCommand)
export class DeleteDragonHandler implements IQueryHandler<DeleteDragonCommand>{

  constructor(@InjectRepository(Dragon) private readonly _repo: Repository<Dragon>){}
  public async execute(request: DeleteDragonCommand):Promise<any>{
    return await this._repo.delete({'id': request.id});
  }
}