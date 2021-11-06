import { Injectable } from "@nestjs/common";


@Injectable()
export class ApartmentFilterDomain {


  saleTypeFilter(filter:any){
    
    const apartmentSaleType = filter.apartmentSaleType;
    let apartmentSaleTypeFilterStr = '';
    // получить квартиры через их snaps по последним версиям:
    if(apartmentSaleType){
      apartmentSaleTypeFilterStr = `AND JSON_EXTRACT(s.snapshotinfo, "$.apartmentSaleType") = "${apartmentSaleType}"`;
    } else {
      apartmentSaleTypeFilterStr = '';
    }
    return apartmentSaleTypeFilterStr;
  }

  roomAmountFilter(filter:any){
    const roomFilter = {
      "room1": 1,
      "room2": 1,
      "room3": 1,
      "room4": 1,
      "room5": 1
    }
    // filter room amount
    let filterRoomAmount:any = [];
    for(let key in filter){
      if(key in roomFilter && filter[key] === "1"){
        let amount = key.split('room')[1];
        filterRoomAmount.push(amount);
      }
    }
    if(filterRoomAmount.length){
      filterRoomAmount = " AND " + " JSON_EXTRACT(s.snapshotinfo, \"$.roomsAmount\") IN ("+ filterRoomAmount.join(',') + ")";
    } else {
      filterRoomAmount = "";
    }
    // если пришло 6 значит 6+
    if(filter["room6"]){
      console.log(filter);
      if(filterRoomAmount){
        filterRoomAmount+=" AND JSON_EXTRACT(s.snapshotinfo, \"$.roomsAmount\") >= 6 ";
      } else {
        filterRoomAmount =" AND JSON_EXTRACT(s.snapshotinfo, \"$.roomsAmount\") >= 6 ";
      }
    } 
    return filterRoomAmount;
  }
}