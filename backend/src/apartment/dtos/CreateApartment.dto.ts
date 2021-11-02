import { Expose } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";
enum CURRENCY {
RUB="RUB",
DOLLAR="DOLLAR"
}
enum APARTMENT_SALE_TYPE {
  // Дом
  HOUSE="HOUSE",
  // Комната
  ROOM="ROOM",
  // Койко-место
  BED_PLACE="BED_PLACE"
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
  @IsArray()
  images: string[];

  @Expose()
  @IsArray()
  chars: string[];
}