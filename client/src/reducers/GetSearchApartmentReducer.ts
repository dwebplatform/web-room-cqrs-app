

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { customAxios } from "../api/customAxios";
import { GetSearchApartmentsAction } from "../actions/showSearchedApartmentAction";
import { IShowSearchedApartment } from "../interfaces/show-searched-apartment";



  interface ISearchApartmentState {
    error: null | {message:string},
    apartments: IShowSearchedApartment[],
    loading: boolean
  }

  const initialState:ISearchApartmentState = {
    error: null,
    apartments: [],
    loading: false,
  };
  export const showSearchedApartmentSlice = createSlice({
  name: "apartmentSearched",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetSearchApartmentsAction.fulfilled,(state,{payload})=>{
      console.log("PAYLOAD");
      state.apartments =  payload.data;
    });
    builder.addCase( GetSearchApartmentsAction.rejected,(state,{payload})=>{
      console.log("REJECTED");
      state.error = {message:'не удалось загрузить список квартир'};
    });
  }
});

export const  showSearchedApartmentReducer  = showSearchedApartmentSlice.reducer;