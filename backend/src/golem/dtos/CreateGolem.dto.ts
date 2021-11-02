import { Expose } from "class-transformer";
import { IsBoolean, IsNumber, IsString } from "class-validator";


export class CreateGolemDto {
  @Expose()
  @IsString()
  name: string;

  @IsNumber()
  @Expose()
  level: number;

  @Expose()
  @IsBoolean()
  isDanger: boolean;
}