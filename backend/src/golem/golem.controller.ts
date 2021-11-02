import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Expose } from 'class-transformer';
import { CreateGolemCommand } from './commands/createGolem.command';
import { IsDefined, IsString } from 'class-validator';

import { UpdateGolemCommand } from './commands/updateGolemCommand.command';
import { UpdateGolemDto } from './dtos/UpdateGolem.dto';
import { GetGolemQuery } from './queries/GetGolemQuery';
import { CreateGolemDto } from './dtos/CreateGolem.dto';

export class GolemDto {
  @Expose()
  aggregateId: string;
  @Expose()
  data: any;
}




@Controller('golem')
export class GolemController {
  constructor(private readonly commandBus: CommandBus,private readonly queryBus: QueryBus) { }

  // todo: update golem DTO
  @Post('/update')
  updateGolem(@Body() updateGolemDto: UpdateGolemDto){

    return this.commandBus.execute(new UpdateGolemCommand(updateGolemDto));
  }
  @Post('/create')
  createGolem(@Body() body: CreateGolemDto){
    return this.commandBus.execute(new CreateGolemCommand(body));
  }

  @Get('/:aggregateId')
  getGolem(@Param('aggregateId') aggregateId:string){

    // пусть три события update нужно, чтобы они применились в правильном порядке:
    // {type:"GOLEM_UPDATED", version: 1} // последняя версия в бд
    // {type:"GOLEM_UPDATED", version: 2} // последняя версия в бд
    // {type:"GOLEM_UPDATED", version: 3} // последняя версия в бд
    
    return this.queryBus.execute(new GetGolemQuery(aggregateId));
   
  }
}
