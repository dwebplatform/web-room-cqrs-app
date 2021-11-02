import { Expose, Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";

class Client {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  comment: string;

  @Expose()
  @IsString()
  phone: string;

  @Expose()
  @IsString()
  email: string;
}
class OrderInfo {
  @Expose()
  @IsOptional()
  @ValidateNested({each:true})
  @Type(() => Client)
  client: Client;

  @Expose()
  @IsOptional()
  totalPrice: number;

  @Expose()
  @IsOptional()
  apartment: any;


}
export class UpdateOrderDto {
  @Expose()
  @IsString()
  aggregateId: string;
  
  @Expose()
  version: string;

  @Expose()
  @ValidateNested({each:true})
  @Type(() => OrderInfo)
  info: OrderInfo;
    
  
}