import { createSlice } from "@reduxjs/toolkit";
import { GetOrders } from '../actions/orderActions';
import { IOrder } from './../interfaces/order-interface';

export const initialState = {
  orders: [] as IOrder[],
  loading: false,
  error: null as null | { message: string },
};
export const orderSlice = createSlice({
  name: "order",
  initialState : initialState,
  reducers:{},
  extraReducers: (builder)=>{
    
    builder.addCase(GetOrders.fulfilled,(state,{payload})=>{
      const { data } = payload;
      state.loading = false;
      state.orders = data;
    });

    builder.addCase(GetOrders.pending,(state)=>{
      state.loading = true;
    });

    builder.addCase(GetOrders.rejected,(state,data)=>{
      state.loading = false;
      state.error = {
        message: 'Не удалось получить список заказов'
      }     
    })
  }
});

export const orderReducer = orderSlice.reducer;