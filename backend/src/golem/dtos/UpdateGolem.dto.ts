import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsEnum, IsNumber, IsOptional, IsString, ValidateIf, ValidateNested } from "class-validator";
import {  EVENT_TYPES } from '../../entities/event.entity';


export class UpdateGolemDataDto {

  @Expose()
  @IsString()
  @IsOptional()
  name: string;

  @Expose()
  @IsBoolean()
  @IsOptional()
  isDanger: boolean;

  @Expose()
  @IsNumber()
  @IsOptional()
  level: number;
}

export class UpdateGolemDto {

  @Expose()
  @IsString()
  aggregateId: string;

  @IsNumber()
  version: number;
  
  @Expose()
  @IsDefined()
  @ValidateNested({each:true})
  @Type(() => UpdateGolemDataDto)
  data: UpdateGolemDataDto;

  @Expose()
  @IsEnum(EVENT_TYPES)
  eventType: EVENT_TYPES;
}