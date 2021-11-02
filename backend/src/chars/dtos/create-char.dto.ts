import { Expose } from "class-transformer";
import { IsDefined, IsNotEmpty } from 'class-validator';

export enum CHAR_VARIANTS {
  ARRAY_VALUE  = 'ARRAY_VALUE',
  STRING_VALUE = 'STRING_VALUE',
  BOOL_VALUE   = 'BOOL_VALUE'
}
export class CreateCharDto {
  @Expose()
  keyName:string; 

  @Expose()
  charVariant: CHAR_VARIANTS;

  @Expose()
  apartmentId?: number;
  @Expose()
  @IsDefined()
  @IsNotEmpty()
  charValue: string|boolean|string[];
}