import { Controller, Get, Query, Res, HttpException, HttpStatus, Param, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetApartmentById } from './queries/getApartmentById';
import { ListApartmentQuery } from './queries/ListApartment';
import { CreateApartmentDto } from './dtos/CreateApartment.dto';
import { CreateApartmentCommand } from './commands/createApartment.command';
import { UpdateApartmentNameHandler, UpdateApartmentNameCommand } from './commands/updateApartment.command';
import { GetAllApartment } from './queries/getAllApartments';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/utils/diskStorage';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from 'src/entities/Image.entity';
import { ApartmentFilterDto } from './dtos/ApartmentFilterDto';
import { ChangeApartmentNameDto } from './dtos/ChangeApartmentDto';
import { ChangeApartmentNameCommand } from './commands/changeApartmentName.command';
import { AddApartmentImagesDto } from './dtos/addApartmentImagesDto';
import { AddImagesToApartmentCommand } from './commands/addImagesToApartment';




@Controller('apartments')
export class ApartmentController {

  constructor(
    @InjectRepository(ImageEntity) private readonly _imageRepo: Repository<ImageEntity>,
    private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) { }
  
  @Post('/upload')
	@UseInterceptors(FileInterceptor("photo", { storage }))
	async uploadSingle(@UploadedFile() file: Express.Multer.File) {
    const imageEntity = new ImageEntity();
    imageEntity.fileName = file.filename;
    imageEntity.path = file.path;
    imageEntity.originalName = file.originalname;
    return  this._imageRepo.save(imageEntity);

  }
  @Post('/change-name')
  updateName(
    @Body() changeApartmentNameDto: ChangeApartmentNameDto
  ){
    return this.commandBus.execute(new ChangeApartmentNameCommand(changeApartmentNameDto));
  }


  @Post('/add-images')
  addImages(
    @Body() addApartmentImagesDto:AddApartmentImagesDto
  ){
    return this.commandBus.execute(new AddImagesToApartmentCommand(addApartmentImagesDto));
  }


  @Post('/change-description')
  updateDescription(){

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

  @Get('/search')
  searchAll(@Query() query:ApartmentFilterDto){
    return this.queryBus.execute(new GetAllApartment(query));
  }
}

