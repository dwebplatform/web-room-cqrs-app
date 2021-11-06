import { Expose, Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, ValidateIf } from "class-validator";
import { APARTMENT_SALE_TYPE, RENT_TYPE } from "src/aggregate_like_classes/Apartment";

enum CURRENCY {
  RUB="RUB",
  DOLLAR="DOLLAR"
}

export class CreateApartmentDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  offerTitle: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Expose()
  @IsEnum(APARTMENT_SALE_TYPE)
  apartmentSaleType: APARTMENT_SALE_TYPE;

  @Expose()
  @IsEnum(RENT_TYPE)
  rentType: RENT_TYPE;
  
  @Expose()
  @IsNumber()
  @ValidateIf((o)=>o.apartmentSaleType === APARTMENT_SALE_TYPE.APARTMENT_IN_NEW_BUILDING||o.apartmentSaleType=== APARTMENT_SALE_TYPE.APARTMENT_IN_SECONDARY)
  roomsAmount: number;

  @Expose()
  @IsEnum(CURRENCY)
  currency: CURRENCY;
  
  @Expose()
  @IsArray()
  subways: string[];

  @Expose()
  @IsNumber()
  @IsPositive()
  priceForDay:number;

  @Expose()
  @IsNumber()
  @IsPositive()
  priceForMonth:number;
  
  @Expose()
  @IsString()
  priceInfo: string;

  @Expose()
  @IsArray()
  images: string[];

  @Expose()
  @IsArray()
  chars: string[];
}