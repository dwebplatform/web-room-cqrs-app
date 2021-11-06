import { createSlice } from "@reduxjs/toolkit";
import { GetApartmentShowAction } from "../actions/apartmentShowActions";
import { IApartment } from "../interfaces/apartment-interface";
import { IShowApartment } from "../interfaces/apartment-show-interface";
import { ChangeApartmentDescription, GetApartmentByIdAction, UploadApartmentFilesAction } from './../actions/apartmentActions';


export const initialState = {
  apartment: null as IShowApartment | null,
  loading: false,
  error: null as null | { message: string },
};
export const apartmentShowSlice = createSlice({
  name: "apartmentShow",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder.addCase(GetApartmentShowAction.fulfilled,(state,{payload})=>{
      state.apartment  = payload.data;
    });
    builder.addCase(GetApartmentShowAction.rejected,(state)=>{
      state.error ={message:'Не удалось получить квартиры по данному id'};
    });
 
  }
});

export const apartmentShowReducer = apartmentShowSlice.reducer;