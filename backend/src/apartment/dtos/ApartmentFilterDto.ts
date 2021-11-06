
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { APARTMENT_SALE_TYPE, RENT_TYPE } from 'src/aggregate_like_classes/Apartment';
import { IsNumber } from 'class-validator';

export class ApartmentFilterDto{
  @Expose()
  @IsString()  
  @IsOptional()
  room1: number;

  @Expose()
  @IsString()  
  @IsOptional()
  room2: number;
  
  @Expose()
  @IsString()
  @IsOptional()
  room3: number;

  @Expose()
  @IsString()
  @IsOptional()
  room4: number;
  
  @Expose()
  @IsString()
  @IsOptional()
  room5: number;
  
  @Expose()
  @IsString()
  @IsOptional()
  room6: number;

  @Expose()
  @IsString()
  @IsOptional()
  fromPrice: number;
  
  @Expose()
  @IsString()
  @IsOptional()
  toPrice: number;
  
  @Expose()
  @IsString()
  @IsOptional()
  apartmentSaleTypes: string;
  
  @Expose()
  @IsString()
  @IsEnum(RENT_TYPE)
  @IsOptional()
  rentType: RENT_TYPE;
}