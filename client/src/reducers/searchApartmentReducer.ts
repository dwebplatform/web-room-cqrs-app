
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


function inArray(id:number, elements: any[]){
  return elements.find(el=>el.id=== id);
}

export enum APARTMENT_SALE_TYPE {

  // квартира в новостройке:
  APARTMENT_IN_NEW_BUILDING="APARTMENT_IN_NEW_BUILDING",
  // квартира во вторичке:
  APARTMENT_IN_SECONDARY="APARTMENT_IN_SECONDARY",

  // доля:
  APARTMENT_SHARE="APARTMENT_SHARE",

  // комната:
  APARTMENT_ROOM="APARTMENT_ROOM"
}

export enum SEARCH_TYPES {
  FLAT="FLAT",
  ROOM="ROOM"
}

export interface IVariant{
  id: number;
  name: string;
  type: SEARCH_TYPES,
  apartmentSaleType?: string|null;
}

export interface IRoomAmountVariant{
  id: number;
  value: number;
  showValue: string;
}

interface IState {
  searchVariants: IVariant[],
  currentSearchVariants: IVariant[],
  searchRoomAmountVariants: Array<IRoomAmountVariant>,
  currentSearchRoomAmountVariants: Array<IRoomAmountVariant>
}
export const initialState:IState = {
  searchRoomAmountVariants:[
  {id:1, value:1, showValue:'1'},
  {id:2, value:2, showValue:'2'},
  {id:3, value:3, showValue:'3'},
  {id:4, value:4, showValue:'4'},
  {id:5, value:5, showValue:'5'},
  {id:6, value:6, showValue:'6+'}
  ],
  currentSearchRoomAmountVariants:[],
  searchVariants:[
    {
      id:1,
      name:'Квартира в новостройке',
      apartmentSaleType: APARTMENT_SALE_TYPE.APARTMENT_IN_NEW_BUILDING,
      type:SEARCH_TYPES.FLAT
    },
    {
      id:2,
      name:'Квартира во вторичке',
      apartmentSaleType:APARTMENT_SALE_TYPE.APARTMENT_IN_SECONDARY,
      type:SEARCH_TYPES.FLAT,
    },
    {
      id:3,
      name:'Комната',
      type:SEARCH_TYPES.ROOM,
    },
    {
      id:4,
      name:'Доля',
      type:SEARCH_TYPES.ROOM
    }
  ],
  currentSearchVariants:[{
    id:1,
    name:'Квартира в новостройке',
    type:SEARCH_TYPES.FLAT,
    apartmentSaleType:APARTMENT_SALE_TYPE.APARTMENT_IN_NEW_BUILDING,
  },
  {
    id:2,
    name:'Квартира во вторичке',
    type:SEARCH_TYPES.FLAT,
    apartmentSaleType:APARTMENT_SALE_TYPE.APARTMENT_IN_SECONDARY,
  }]
};


export const searchApartmentSlice = createSlice({
  name:"searchApartment",
  initialState:initialState,
  reducers:{
    toggleRoomAmountAction(state, action:PayloadAction<{id:number}>){
      const currentRoomAmount = state.searchRoomAmountVariants.find(item=>item.id===action.payload.id);
      if(!currentRoomAmount){
        return;
      }
      if(inArray(action.payload.id, state.currentSearchRoomAmountVariants)){ // если в массиве, то убрать
        state.currentSearchRoomAmountVariants = state.currentSearchRoomAmountVariants.filter(el=>el.id!==action.payload.id);
      } else { // иначе добавить
        state.currentSearchRoomAmountVariants.push(currentRoomAmount);
      }
    },
    toggleSearchAction(state,action:PayloadAction<{id: number}>){
    // check type of current id
    const addedSearchItem = state.searchVariants.find(item=>item.id === action.payload.id);
    
    if(!addedSearchItem){
      return;
    }
    let findedElement = state.currentSearchVariants.find(item=>item.id === addedSearchItem.id);
    if(findedElement && state.currentSearchVariants.length===1){
      return;
    }
    
    // если нет элементов просто добавляем
    if(state.currentSearchVariants.length === 0){
      state.currentSearchVariants.push(addedSearchItem);
    }
    else if(state.currentSearchVariants.length > 0){
      // в зависимости от текущего типа, либо добавляем к текущим либо убираем оттуда все и создаем новый массив:
      let isSameType = state.currentSearchVariants[0].type === addedSearchItem.type;
      if(isSameType){// если сущность того же типа, просто пушим ее
        if(inArray(action.payload.id,state.currentSearchVariants) ){
          // если он есть, то убираем:
          state.currentSearchVariants = state.currentSearchVariants.filter(item=>item.id!== action.payload.id);
        } else {// если его нет, добавляем:
          state.currentSearchVariants.push(addedSearchItem);
        }
      } else { // иначе пришел другой тип обнуляем массив и в него кладем данный элемент
        state.currentSearchVariants = [addedSearchItem];
      }

    }
   } 
  }
});

export const {toggleSearchAction,toggleRoomAmountAction} = searchApartmentSlice.actions;

export const searchApartmentReducer = searchApartmentSlice.reducer;