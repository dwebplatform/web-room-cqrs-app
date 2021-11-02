
import { Expose, Type } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { STATUSES } from '../../entities/order.entity';


export class Aparment {
  @Expose()
  @IsDefined()
  id: number;
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  from: string;

  @Expose()
  @IsString()
  to: string;

}
export class Client {

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  phone: string;

  @Expose()
  @IsString()
  email: string;

  @Expose()
  @IsString()
  comment: string;

}

export class Info  {
  @Expose()
  @IsObject()
  @ValidateNested({each:true})
  @Type(() => Client)
  @IsNotEmpty()
  client: Client;
  @Expose()
  @IsNumber()
  totalPrice: number;
  
  @IsObject()
  @ValidateNested({each:true})
  @Type(() => Aparment)
  apartment: Aparment;
}
export class CreateOrderDto{
status: STATUSES.CREATED;

@Expose()
@IsDefined()
@IsNotEmptyObject()
@IsObject()
@ValidateNested({ each: true })
@Type(()=>Info)
info: Info;


}