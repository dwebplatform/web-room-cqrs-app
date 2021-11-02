import { createSlice } from "@reduxjs/toolkit";
import { GetCharsAction } from "../actions/charActions";
import { IChar } from './../interfaces/apartment-interface';
import { CreateCharAction } from './../actions/charActions';


export const initialState = {
  chars:[] as IChar[],
  loading: false,
  error: null as null | { message: string },
};

export const charEditSlice = createSlice({
  name: "charEdit",
  initialState: initialState,
  reducers: {
    resetChars:(state)=>{
      state.chars = [];
    }
  },
  extraReducers: (builder) => {

    builder.addCase(CreateCharAction.fulfilled,(state,{payload})=>{
      //TODO: сделать нормальный modal window
      alert('Характеристика создана успешно');
    });

    builder.addCase(CreateCharAction.rejected, (state,{payload})=>{
      //TODO: сделать нормальный modal window
      alert(' произошла ошибка при создании характеристики ');
    });
    
    builder.addCase(GetCharsAction.fulfilled,(state,{payload})=>{
     state.chars = payload.data;
    });

    builder.addCase(GetCharsAction.rejected,(state)=>{
      state.chars = [];
    });
  }
});

export const {resetChars} = charEditSlice.actions;
export const charEditReducer = charEditSlice.reducer;