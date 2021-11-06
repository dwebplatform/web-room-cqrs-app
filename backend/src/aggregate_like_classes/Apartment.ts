import { Expose, plainToClass } from "class-transformer";
import { Order } from "src/entities/order.entity";
import { IsArray, IsEnum, IsPositive, IsString } from "class-validator";
import { Subway } from './../entities/Subway.entity';

export enum RENT_TYPE {
  // аренда в месяц
  MONTH="MONTH",
  // посуточно
  DAY="DAY"
}

// тип жилья!!!
export enum APARTMENT_SALE_TYPE {

  // квартира в новостройке:
  APARTMENT_IN_NEW_BUILDING="APARTMENT_IN_NEW_BUILDING",
  // квартира во вторичке:
  APARTMENT_IN_SECONDARY="APARTMENT_IN_SECONDARY",

  // доля:
  APARTMENT_SHARE="APARTMENT_SHARE",

  // комната:
  APARTMENT_ROOM="APARTMENT_ROOM"
}
export class Apartment {
  @Expose()
  id: string;
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsPositive()
  priceForDay: number;

  @Expose()
  @IsPositive()
  priceForMonth: number;
  
  @Expose()
  @IsString()
  priceInfo: string;

  // тип сдачи жилья в месяц по суточно:
  @Expose()
  @IsEnum({enum:RENT_TYPE})
  rentType: RENT_TYPE;

  // тип жилья
  @Expose()
  @IsEnum({enum:APARTMENT_SALE_TYPE})
  apartmentSaleType: APARTMENT_SALE_TYPE;
  
  @Expose()
  @IsString()
  offerTitle: string;

  @Expose()
  @IsString()
  currency: string;

  @Expose()
  @IsArray()
  subways: string[];

  @Expose()
  @IsArray()
  chars: string[];
  
  @Expose()
  @IsArray()
  images: any[];
  
}