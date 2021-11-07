import axios, { AxiosResponse } from "axios";


import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiUrl } from "../configs";
import { IApartment } from '../interfaces/apartment-interface';
import { customAxios } from "../api/customAxios";


async function getPathsOfLoadedFiles(files: any[]) {
  let imagesResponses: any = [];
  for await (let imgData of files.map(async (file) => {
    try {
      const response = await axios({
        headers: { "Content-Type": "multipart/form-data" },
        method: "POST",
        data: fileToPost(file, 'photo'),
        url: `${apiUrl}/apartments/upload`
      }) as AxiosResponse<any>;
      response.data.error = false;
      return response;
    } catch (err) {
      return { data: { error: true } };
    }
  })) {

    imagesResponses.push(imgData)
  }
  // для всех изображений сохранить их пути в данном апартаменте
  // do axios to save filePaths
  return imagesResponses.filter((imgResp: any) => !imgResp.data.error);

}

function fileToPost(file: any, fieldKey: string) {
  let sendedFormData = new FormData();
  sendedFormData.append(fieldKey, file);
  return sendedFormData;
}


export const UploadApartmentFilesAction = createAsyncThunk(
  "apartments/uploadFilesById",
  async ({ id, files, version }: { id: string, version: number, files: any[] }) => {
    let imagesResponses = await getPathsOfLoadedFiles(files);
    return await customAxios.post(`${apiUrl}/apartments/add-images`, {
      aggregateId:id,
      version,
      imageIds: imagesResponses.map(({ data }: { data: any }) => data.id)
    }) as AxiosResponse<{version:number}>;
  });
export const GetApartmentByIdAction = createAsyncThunk("apartments/getApartmentById",
  async (id: string) => {
    return await customAxios.get<IApartment>(`${apiUrl}/apartments/show/${id}`);
  });

export const ChangeApartmentDescription = createAsyncThunk("apartments/changeDescription",
  async ({ id, description }: { id: number, description: string }) => {
    return (await customAxios.post<{ id: number, description: string }>(`${apiUrl}/apartments/change-description`, {
      id,
      description
    }));
  });


export const ChangeApartmentNameAction = createAsyncThunk("apartments/changeName",
  async ({ id, name, version }: { id: string, name: string, version: number }) => {
    return (await axios.post(`${apiUrl}/apartments/change-name`, {
      aggregateId: id,
      name,
      version
    })) as AxiosResponse<{ id: string, version: number }>;
  }
)