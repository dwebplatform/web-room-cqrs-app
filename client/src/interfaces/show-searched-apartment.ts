export interface IShowSearchedApartment {
  id:string;
  offerTitle: string;
  description: string;
  
  priceForDay:number;
  priceForMonth:number;
  priceInfo:string;
  rentType: string;
  subways: {id:number,name: string,color:string,timeInfo:string}[];
  images: {id:number,fileName:string}[];
}
