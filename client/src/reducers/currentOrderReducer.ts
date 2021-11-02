import { createSlice } from "@reduxjs/toolkit";
import { error } from "console";
import { ChangeOrderStatus, GetOrderById } from "../actions/orderActions";
import { IOrder } from './../interfaces/order-interface';

export const initialState = {
  order: null as IOrder|null,
  loading: false,
  error: null as null | { message: string },
};
export const orderDetailSlice = createSlice({
  name: "orderDetail",
  initialState: initialState,
  reducers:{},
  extraReducers: (builder)=>{
    builder.addCase(ChangeOrderStatus.fulfilled,(state,{payload})=>{
    });
    builder.addCase(GetOrderById.fulfilled,(state,{payload})=>{
      const {data} = payload;
        state.order = data;
    });
    builder.addCase(GetOrderById.rejected,(state)=>{
      
      state.error = {message: 'Не удалось получить заказ по данному id'};
    })
  }
});

export const orderDetailReducer = orderDetailSlice.reducer;