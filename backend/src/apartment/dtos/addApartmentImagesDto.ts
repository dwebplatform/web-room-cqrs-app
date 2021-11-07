import { Expose } from "class-transformer";
import { IsArray, IsNumber, IsString } from "class-validator";


export class AddApartmentImagesDto{

  @Expose()
  @IsNumber()
  version: number;

  @Expose()
  @IsString()
  aggregateId: string;

  @Expose()
  @IsArray()
  imageIds: string[];
}