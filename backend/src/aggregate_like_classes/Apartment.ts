import { Expose, plainToClass } from "class-transformer";
import { Order } from "src/entities/order.entity";
import { IsArray, IsPositive, IsString } from "class-validator";
export class Apartment {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsPositive()
  priceForDay: number;
  @Expose()
  @IsString()
  apartmentSaleType: string;
  
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
  images: string[];
  
}