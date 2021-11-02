import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from "@mui/material/TextField";
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

import {CharListComponent} from './CharListComponent';

import { RootState } from '../store';
import { ChangeApartmentDescription, GetApartmentByIdAction, UploadApartmentFilesAction } from './../actions/apartmentActions';

import styled from 'styled-components';
import { useFiles } from './ApartmentListComponent';


const TopContainer = styled(Box)`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ApartmentProfile = styled(Card)`
  flex-basis: 360px;
  padding: 10px;
  
`;
const BottomContainer = styled(Box)`

`;

const ApartmentPictureWrapper = styled(Card)`
  padding: 10px;
  flex:1;
  display: flex;
  flex-flow: column;
`;


const ApartmentWrapper = styled(Box)`
display: flex;
padding-top: 1rem;
`;

const LeftContainer = styled(Box)`
  flex: 1;
`;
const SubWayContainer = styled(Box)`
flex-basis: 350px;
padding: 10px;
`;

const AddPictureContainer = styled(Box)`
  flex: 1;
`;
const AddPictureTitle = styled(Box)`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ImageContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(4,200px);
  grid-template-rows: repeat(4,1fr);
  width: 100%;
  max-width: 800px;
  grid-gap: 1rem;

`;
const ImageItem = styled(Box)`
  padding-bottom: 56.25%;
  position:relative;

`;
const Image = styled.img`
  position:absolute;
  top:0;
  left:0;
  objectFit:cover;
  height:100%;
  width:100%;
`
export const ApartmentDetailComponent = () => {
  const { apartment, error } = useSelector((state: RootState) => state.apartmentDetail);

  const { apartmentId } = useParams<{ apartmentId: string }>();
  useEffect(()=>{
    if(!apartment){
      return;
    }
    let cashedApartment = JSON.parse(localStorage.getItem('apartment')||"{}");
    if("id" in cashedApartment){
        if(cashedApartment.id !== apartment.id){
          localStorage.setItem('apartment', JSON.stringify(apartment));
        }
    } else {
      localStorage.setItem('apartment', JSON.stringify(apartment));
    }
  },[apartment, apartmentId]);

  const history = useHistory();
  const dispatch = useDispatch();
  const [curApartmentDescription, setCurApartmentDescription] = useState<any>(apartment?.description);  
  
  const {upload, files, inputData, preloadedImages}= useFiles();

  const handleUpload=()=>{
   
    if(!apartment){
      return;
    }
    dispatch(UploadApartmentFilesAction({id:apartment.id, files}));
  }
  const handleChangeDescription=()=>{
    if(!apartment){
      return;
    }
    dispatch(ChangeApartmentDescription({id: apartment.id, description: curApartmentDescription}));
  }
  const goToCharsPanel=()=>{
    history.push('/chars-panel');
  }
  useEffect(() => {
    dispatch(GetApartmentByIdAction(apartmentId));
  }, [dispatch, apartmentId])


  if (error) {
    return <Alert severity='error'>{error.message}</Alert>
  }
  if (!apartment) {
    return null;
  }

  return (
    <div>
      <ApartmentWrapper>
        <LeftContainer >
          <TopContainer>
            <ApartmentProfile>
              <Typography sx={{ fontSize: 18, fontWeight: 'bold' }} gutterBottom>
                Квартира #{apartment.id}
              </Typography>
              <Box style={{ display: 'flex' }}>
                <Typography sx={{ fontSize: 16, fontWeight: 'bold' }} gutterBottom>Название:&nbsp;</Typography>
                <Typography> {apartment.name}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 16, fontWeight: 'bold' }} gutterBottom >Описание:</Typography>
                <TextField
                  id="outlined-multiline-static"
                  multiline
                  rows={5}
                  sx={{ width: '100%' }}
                  value={curApartmentDescription}
                  onChange={(e)=>setCurApartmentDescription(e.target.value)}
                  defaultValue={apartment.description}
                  onBlur={()=>{
                    if(apartment.description === curApartmentDescription){
                      return;
                    }
                    let needChange: boolean = window.confirm('Изменить описание ?');
                    if(!needChange ){
                      return;
                    }
                    handleChangeDescription();
                  }}
                />
              </Box>
              <Box style={{ display: 'flex' }}>
                <Typography sx={{ fontSize: 16, fontWeight: 'bold' }} gutterBottom> Цена за сутки: &nbsp;</Typography>
                <Typography>{apartment.priceForDay}</Typography>
              </Box>
            </ApartmentProfile>
            <ApartmentPictureWrapper>
             <AddPictureContainer >
              <AddPictureTitle >
                <Box>
                <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Фотографии</Typography>
                </Box>
                <Box>
                  <Box>
                    <input {...inputData()}/>
                  </Box>
                <Button onClick={(e)=>{
                  upload(e);
                }}>Добавить фотографии</Button>
                </Box>
              </AddPictureTitle>
              <Box style={{display:'flex'}}>
                {preloadedImages.map((filePath)=>{
                  return <Box style={{width:'100px', height:'100px', display:'flex', gap:'6px'}} 
                  key={filePath}><img style={{flex:'1'}} alt="квартира" src={filePath}/></Box>
                })}
              </Box>
              </AddPictureContainer>
              <Button  onClick={()=>handleUpload()} color="success" variant="contained" disabled={files.length===0}>
                Загрузить
              </Button>
            </ApartmentPictureWrapper>
          </TopContainer>
          <BottomContainer>
            {/* Характеристики */}
            <Card>
              <CardContent>
                <Box style={{display:'flex',alignItems:'center', gap:'1rem', marginBottom:'10px'}}>
                <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>
                  Характеристики
                </Typography>
                <Box>
                <Button onClick={(e)=>{
                  goToCharsPanel();
                }} color="secondary" variant="outlined">Перейти к админке характеристик</Button>
                </Box>
                </Box>
                <Divider style={{ marginBottom: '1rem' }} />
                <CharListComponent chars={apartment.chars}/>
              </CardContent>
            </Card>
          
          </BottomContainer>
            

        </LeftContainer>
        <SubWayContainer>
          <Typography>Ближайшие метро</Typography>
          <Box>

          </Box>
        </SubWayContainer>
        
      </ApartmentWrapper>
      <Card style={{width:'100%'}}>
              <ImageContainer>
                {apartment.images.map((imagePath:any,index:number)=>{
                return <ImageItem key={index} >
                  <Image 
                    src={'http://localhost:5000/'+imagePath}
                  />
                  </ImageItem>
                })}
                
              </ImageContainer>
            </Card>
    </div>
  );
}

/**
 * 
 */