import { Expose } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class ChangeApartmentNameDto {
  @Expose()
  @IsString()
  aggregateId: string;
  @Expose()
  @IsString()
  name:string;

  @Expose()
  @IsNumber()
  version: number;
}