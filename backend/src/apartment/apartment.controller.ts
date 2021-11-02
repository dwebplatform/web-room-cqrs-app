import { Controller, Get, Query, Res, HttpException, HttpStatus, Param, Post, Body } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetApartmentById } from './queries/getApartmentById';
import { ListApartmentQuery } from './queries/ListApartment';
import { CreateApartmentDto } from './dtos/CreateApartment.dto';
import { CreateApartmentCommand } from './commands/createApartment.command';
import { UpdateApartmentNameHandler, UpdateApartmentNameCommand } from './commands/updateApartment.command';
import { GetAllApartment } from './queries/getAllApartments';

@Controller('apartments')
export class ApartmentController {

  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) { }

  
  @Post('/update-name')
  updateName(
    @Body('name') name: string,
    @Body('aggregateId') aggregateId: string,
    @Body('version') version: number,
  ){
    return this.commandBus.execute(new UpdateApartmentNameCommand(name,aggregateId,version));
  }
  @Post('/create')
  createApartment(@Body() createApartmentDto: CreateApartmentDto){
    // apartmentCreatedEvent
    return this.commandBus.execute(new CreateApartmentCommand(createApartmentDto));
    /**
     * name: 'Фркнзинская',
     * apartmentType:'Койко-место|Дом|Квартира',
     * subways: [1,2,3],
     * priceForDay: 400,
     * description:'Рядом с нами находятся торговые центры , недорогие качественные кафе, пиццерия, кулинария, продуктовый супермаркет, аптека, различные рестораны, исторический Измайловский парк культуры и отдыха. Проживающие все приличные люди, всегда на помощь придет добродушная управляющая. Есть wifi, телевизор и тд',
     * priceCurrency: 'Pуб',
     * images: [1,2,3,4,5,6,7,8]
     * id характеристик:
     * chars: [1,2,3,4,5,6,7,8,9,10],
     * 
     */
    /**
     * что может быть с апартаментом:
     * APARTMENT_CREATED - событие
     * APARTMENT_CHANGED_PRICE - изменена цена,
     * APARTMENT_CHANGED_DESCRIPTION - изменено описание
     * APARTMENT_ADD_CHAR - добавлена характеристика
     * APARTMENT_REMOVE_CHAR - убрана характеристика
     * APARTMENT_ADD_IMAGE - добавлено изображение
     * APARTMENT_REMOVE_IMAGE -удрано изображения
     * APARTMENT_ADD_SUB_WAY - добавлено метро
     * APARTMENT_REMOVE_SUB_WAY - убрано метро
     */
  }
  @Get('/show/all')
  showAll(@Query() filterQuery: Partial<{ char: string }>) {
    try{
      return this.queryBus.execute(new ListApartmentQuery(filterQuery));
    } catch(err){
      throw new HttpException('Не удалось получить список квартир', HttpStatus.BAD_REQUEST);
    }
  }
  @Get('/show/:apartmentId')
  getApartmentById(@Param('apartmentId') apartmentId: string){
    try{
      return this.queryBus.execute(new GetApartmentById(apartmentId));
    } catch(err){
      throw new HttpException('Не удалось получить квартиры по данному id',HttpStatus.BAD_REQUEST);
    }
  }
  @Get('/get-all-test')
  getAll(){
    return this.queryBus.execute(new GetAllApartment());
  }
}

