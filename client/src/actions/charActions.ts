import axios, { AxiosResponse } from "axios";


import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiUrl } from "../configs";
import { IChar } from './../interfaces/apartment-interface';
import { customAxios } from "../api/customAxios";


export const CreateCharAction = createAsyncThunk(
  "chars/createChar",
  async({keyName, charVariant,charValue ,apartmentId} : {keyName: string, charVariant: string,charValue: string| string[] | boolean , apartmentId?: null|number})=>{
    
    const {data} =  await customAxios.post(`${apiUrl}/chars/create`,{
        keyName, 
        charVariant,
        charValue,
        apartmentId        
    }) as AxiosResponse<IChar>;
    return data;
  }
);
export const GetCharsAction = createAsyncThunk(
  "chars/getChars",
  async ({ charKeyName }: { charKeyName: string }) => {
    let reqStr = `${apiUrl}/chars/`;
    if(charKeyName){
      reqStr+=`?charKeyName=${charKeyName}`;
    }
    const resp =  await customAxios.get(reqStr) as AxiosResponse<IChar[]>;
    
    return resp;
  });
