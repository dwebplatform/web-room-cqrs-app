import { IRoomAmountVariant, IVariant } from "../../../reducers/searchApartmentReducer";

export function getSearchLink(currentSearchVariants:IVariant[],currentSearchRoomAmountVariants:IRoomAmountVariant[],rentType:string,
  {fromPrice, toPrice}:{fromPrice:string, toPrice:string}){
  
  let searchLinkObj:any = {};
  if(rentType !== "ALL"){
    searchLinkObj.rentType  = rentType;
  } else {
    delete searchLinkObj.rentType;
  }
  // в случае если оба определены
  if(fromPrice && toPrice){
    if(parseInt(fromPrice)<parseInt(toPrice)){
      searchLinkObj.fromPrice  = fromPrice;
      searchLinkObj.toPrice = toPrice;
    } else {
      // TODO отдать ошибку но не тут а при смене
    }
  }
  // если среди currentSearchVariants есть доля или квартира, то ищем другой запрос
  for(let searchItem of currentSearchVariants){
    if(searchItem.apartmentSaleType){
      if(!searchLinkObj.apartmentSaleTypes){
        searchLinkObj.apartmentSaleTypes = [];
      }
      searchLinkObj.apartmentSaleTypes.push(searchItem.apartmentSaleType);
    } 
  }
  
  for(let currentRoomAmountItem of currentSearchRoomAmountVariants){
    
    searchLinkObj[`room${currentRoomAmountItem.value}`] =  1;
  }
  return new URLSearchParams(searchLinkObj).toString();
}