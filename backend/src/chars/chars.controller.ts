import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCharCommand } from './commands/createChar.command';
import { CreateCharDto } from './dtos/create-char.dto';

@Controller('chars')
export class CharsController {

  constructor(private readonly commandBus: CommandBus,private readonly queryBus: QueryBus) { }

  @Post('/create')
  createChar(@Body() createCharDto: CreateCharDto){
    try{
      return this.commandBus.execute(new CreateCharCommand(createCharDto));
    } catch(err){
        throw new HttpException('Не удалось создать новую характеристикy',HttpStatus.BAD_REQUEST);
    }
  }
}
