import axios, { AxiosResponse } from "axios";


import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiUrl } from "../configs";
import { IOrder } from "../interfaces/order-interface";
import { customAxios } from "../api/customAxios";


export const ChangeOrderStatus= createAsyncThunk(
  "orders/changeStatus",
  async ({id, newStatus}:{
    id: number,
    newStatus: string
  })=>{
    return await customAxios.post<{
      id: number,
      newStatus: string
    }>(`${apiUrl}/orders/change-status`,{
      id,
      newStatus
    }) as AxiosResponse<unknown|IOrder>;
  }
 
  );
export const GetOrders = createAsyncThunk(
  "orders/getOrders",
  async () => await customAxios.get<IOrder[]>(`${apiUrl}/orders`)
);


export const GetOrderById = createAsyncThunk(
  "orders/getOrder",
  async (id:string)=> await customAxios.get<IOrder>(`${apiUrl}/orders/${id}`)
);
