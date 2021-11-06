import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ImageEntity } from './../../entities/Image.entity';
import { In, Repository } from 'typeorm';
import { Subway } from './../../entities/Subway.entity';
import { SubwayTimeInfo } from "src/entities/SubwayTimeInfo.entity";

@Injectable()
export class ApartmentTransformFieldsDomain {
  
  constructor(
    @InjectRepository(Subway) private readonly _subwayRepo: Repository<Subway>,
    @InjectRepository(ImageEntity) private readonly _imageRepo: Repository<ImageEntity>){}
 async getImages(imageIds: string[]){
    return await this._imageRepo.find({
      where: {
        id: In(imageIds)
      }
    })
  }
  async getSubways(subwayIds: string[], apartmentId:string){

    return (await this._subwayRepo.createQueryBuilder("subway").leftJoinAndSelect(SubwayTimeInfo,"sti","sti.subwayId = subway.id").where({
    id: In(subwayIds),
  }).andWhere(`sti.apartmentId = "${apartmentId}"` ).getRawMany()).map((entity)=>{
    return {
      ...entity,
      id: entity.subway_id,
      name: entity.subway_name,
      color: entity.subway_color,
      timeInfo: entity.sti_timeInfo
    }
  })
  }
 
}