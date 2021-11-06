import axios, { AxiosResponse } from "axios";


import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiUrl } from "../configs";
import { IShowApartment } from "../interfaces/apartment-show-interface";
// import { customAxios } from "../api/customAxios";


export const GetApartmentShowAction = createAsyncThunk(
  "apartmentShow/getApartment",
  async ({apartmentId}:{apartmentId:string}) => {
    const {data} =  await axios.get(`${apiUrl}/apartments/show/${apartmentId}`) as AxiosResponse<IShowApartment>;
    return {data};
  });
