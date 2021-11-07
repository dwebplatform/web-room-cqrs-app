export interface IChar {
  charId: number;
  keyName: string;
  valueType: string;
  ARRAY_VALUE: string[]|null;
  STRING_VALUE: string|null;
  BOOL_VALUE: boolean|null;
  apartmentId: number;
}

export interface IApartment {
  id: number;
  name: string;
  
  description: string;
  images: string[];
  priceForDay:number;
  chars: IChar[];
  version:number;
}