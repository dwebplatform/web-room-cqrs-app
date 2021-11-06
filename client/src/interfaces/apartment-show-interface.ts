export enum GROUP_VARIANTS {
  GENERAL = "GENERAL",
  SUMMARY = "SUMMARY"
}
interface IChar {
  ARRAY_VALUE: null | string[],
  BOOL_VALUE: null | boolean,
  STRING_VALUE: null | string,
  groupValue: GROUP_VARIANTS,
  id: number,
  keyName: string,
  valueType: string,
  hasHint: boolean,
  hints: string
}
interface IImage{
  id: number;
  fileName:string;
  originalName:string;
}
interface ISuwayTime{
  id: number;
  subwayId: string;
  name: string;
  timeInfo: string;
  color: string;
}
export interface IShowApartment {
  id: string;
  name: string;
  description: string;
  offerTitle: string;
  priceForDay: number;
  chars: IChar[];
  images: IImage[];
  subways: ISuwayTime[];
}