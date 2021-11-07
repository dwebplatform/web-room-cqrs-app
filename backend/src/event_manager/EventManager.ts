import { Apartment } from "../aggregate_like_classes/Apartment";
import { EVENT_TYPES } from "src/entities/event.entity";
export const EventManager = {
  // TODO: event: сделать типом соответствующим данному
  
  [EVENT_TYPES.ADD_IMAGES_TO_APARTMENT]:(event:any,state:Apartment):Apartment=>{

    const images = [...new Set([...state.images,...event.data.imageIds])];
    state.images = images;
    return state;
  },
  [EVENT_TYPES.APARTMENT_NAME_CHANGED]:(event:any,state:Apartment):Apartment=>{
    state.name = event.data.name;

    return state;
  },
  [EVENT_TYPES.APARTMENT_CREATED]:(event:any,state:Apartment):Apartment=>{
    state.name = event.data.name;
    state.apartmentSaleType = event.data.apartmentSaleType;
    state.offerTitle = event.data.offerTitle;
    state.currency = event.data.currency;
    state.subways  = event.data.subways;
    state.images = event.data.images;
    state.chars = event.data.chars;
    // если в сутки
    state.priceForDay = event.data.priceForDay;
    // если в месяц то price for mounth:
    state.priceForMonth = event.data.priceForMonth;
    //информация о цене
    state.priceInfo = event.data.priceInfo;
    state.rentType = event.data.rentType;
    return state;
  }
    // далее будут обработчики событий квартире обновили цену, фотографию, метро, описание, добавили убрали характеристики и тд
    // if(ev.type === EVENT_TYPES.ORDER_UPDATED){
    //   curentState.info = {
    //     ...curentState.info,
    //     apartment : ev.data.apartment||curentState.info.apartment,
    //     client: ev.data.client|| curentState.info.client,
    //     totalPrice: ev.data.totalPrice|| curentState.info.totalPrice
    //   };
    // }
}