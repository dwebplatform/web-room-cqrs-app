import React,{ useState, useRef } from "react";

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import axios from "axios";
import { customAxios } from "../api/customAxios";
import { apiUrl } from './../configs/index';

export function useFiles(){
  const fileRef =  useRef<HTMLInputElement|null>();
  const [files, setFiles] = useState<any[]>([]);
  const [preloadedImages, setPreloadedImages] = useState<string[]>([]);
  function inputData(){
    return {
      type:"file",
      hidden: true,
      ref:(ref:any)=>{fileRef.current=ref},
      onChange:(e:React.ChangeEvent<HTMLInputElement>)=>{
        if(!e.target.files){
          return;
        }
        let file = e.target.files[0];
        if(file){
          let filePath = URL.createObjectURL(file);
          setPreloadedImages((prevImages)=>{
            return [...prevImages,filePath];
          });
          setFiles((prevFiles)=>{
            return [...prevFiles, file];
          })
        }
      }
    }
  }
  return {inputData, preloadedImages,files,
    upload:(e:any)=>{
      e.preventDefault();
      if(!fileRef?.current){
        return;
      }
      fileRef.current.click(); 
    }
  };
}
export const ApartmentListComponent=()=>{
  const fileRef =  useRef<HTMLInputElement|null>();
  const [files, setFiles] = useState<any[]>([]);
  const [preloadedImages, setPreloadedImages] = useState<string[]>([]);

  const handleUpload=(e:any)=>{
      e.preventDefault();
      if(!fileRef?.current){
        return;
      }
      fileRef.current.click();
  } 
   const handleAddFile = async()=>{
    const formData = new FormData();
    formData.append('photo',files[0]);
   const response =  await customAxios.post(`${apiUrl}/apartments/upload`,formData);
   console.log(response)
  }
  return (<div>
    <form encType='multipart/form-data'>
      <input 
      onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
        if(!e.target.files){
          return;
        }
        let file = e.target.files[0];
        if(file){
          let filePath = URL.createObjectURL(file);
          setPreloadedImages((prevImages)=>{
            return [...prevImages,filePath];
          });
          setFiles((prevFiles)=>{
            // TODO: check only available files
            return [...prevFiles, file];
          })
        }
      }}
      ref={(ref)=>{
        fileRef.current = ref;
      }} type="file"  hidden={true}/>
      <Button onClick={(e:any)=>{handleUpload(e)}}>Загрузить</Button>
      <Button onClick={(e)=>{
        e.preventDefault();
        handleAddFile();
      }}>Отправить</Button>
    </form>
    <Box style={{display:'flex'}} >
        {preloadedImages.map((fileName)=>{
          return <Paper key={fileName} style={{width:'250px'}} variant="outlined">
            <img style={{width:'100%'}} src={fileName} alt="изображение"/>
          </Paper>
        })}
    </Box>
   </div>);
}
