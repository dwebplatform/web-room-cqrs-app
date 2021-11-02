import { createSlice } from "@reduxjs/toolkit";
import { IApartment } from "../interfaces/apartment-interface";
import { ChangeApartmentDescription, GetApartmentByIdAction, UploadApartmentFilesAction } from './../actions/apartmentActions';


export const initialState = {
  apartment: null as IApartment|null,
  loading: false,
  error: null as null | { message: string },
};
export const apartmentSlice = createSlice({
  name: "apartment",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(UploadApartmentFilesAction.fulfilled,(state,{payload})=>{
      
    });
    builder.addCase(UploadApartmentFilesAction.rejected,(state,{payload})=>{

    });
    builder.addCase(ChangeApartmentDescription.fulfilled,(state,{payload})=>{
      if(!state.apartment){
        return;
      }
      state.apartment.description = payload.data.description;
    });
    builder.addCase(ChangeApartmentDescription.rejected,(state,{payload})=>{
      alert('Произошла ошибка при попытке обновить описание');
    });
    builder.addCase(GetApartmentByIdAction.fulfilled, (state, { payload }) => {
      const { data } = payload;
      state.loading = false;
      state.apartment = data;
    });

    builder.addCase(GetApartmentByIdAction.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(GetApartmentByIdAction.rejected, (state, { payload }) => {
      state.loading = false;
      console.log(payload);
      state.error = { message: 'Не удалось получить квартиры по данному id' };
    });
  }
});

export const apartmentReducer = apartmentSlice.reducer;