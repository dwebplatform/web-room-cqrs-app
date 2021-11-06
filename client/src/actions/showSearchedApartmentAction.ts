import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { apiUrl } from "../configs";
import { IShowSearchedApartment } from './../interfaces/show-searched-apartment';

export const GetSearchApartmentsAction = createAsyncThunk(
  "apartments/getSearch",
  async (search: string)=>{
    const {data} = await axios.get(`${apiUrl}/apartments/search${search}`) as AxiosResponse<IShowSearchedApartment[]>;
    return {data};
  });