import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import Dropzone from "react-dropzone";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from "@mui/material/TextField";
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

import {CharListComponent} from '../CharListComponent';

import { RootState } from '../../store';
import { ChangeApartmentDescription, ChangeApartmentNameAction, GetApartmentByIdAction, UploadApartmentFilesAction } from '../../actions/apartmentActions';

import styled from 'styled-components';
import { useFiles } from '../ApartmentListComponent';
import { changeApartmentName } from '../../reducers/currentApartmentReducer';

import './style.scss'
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
export const ApartmentEditComponent = () => {
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
  
  const [previews, setPreviews] =useState<any[]>([]);
  const [storedFiles, setStoredFiles] = useState<any[]>([]);
  const handleUpload=()=>{
    if(!apartment){
      return;
    }
    dispatch(UploadApartmentFilesAction({id: apartment.id.toString(), version: apartment.version, files:storedFiles}));
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

  const handleSaveApartmentName=()=>{
    if(!apartment){
      return;
    }
    dispatch(ChangeApartmentNameAction({
      id: ""+apartment.id,
      name: apartment.name,
      version: apartment.version
    }))
  }
  const handleChangeApartmentName=(name:string)=>{
    if(!apartment){
      return;
    }
    dispatch(changeApartmentName({name}));
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
  console.log(apartment);


  return (
    <div>
      <ApartmentWrapper>
        <LeftContainer >
          <TopContainer>
            <ApartmentProfile>
              <Typography sx={{ fontSize: 18, fontWeight: 'bold' }} gutterBottom>
                Квартира #{apartment.id}
              </Typography>
              <Box >
                <Typography sx={{ fontSize: 16, fontWeight: 'bold' }} gutterBottom>Название:&nbsp;</Typography>
                <Box>
                <TextField 
                onBlur={(e)=>{
                  handleSaveApartmentName();
                }}
                fullWidth={true} type="text" value={apartment.name}
                  onChange={(e)=>{
                    handleChangeApartmentName(e.target.value);
                  }}
                />
</Box>
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
                <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Фотографии:</Typography>
                </Box>
                
              </AddPictureTitle>
              <Box>
                  <Dropzone
                  multiple={false}
                  
                  onDrop={(acceptedFiles)=>{

                    setStoredFiles([...storedFiles, acceptedFiles[0]]);
                    const reader = new FileReader();
                    reader.onload =()=>{
                      setPreviews([...previews,reader.result]);
                    }
                    reader.readAsDataURL(acceptedFiles[0]);
                  }}
                  >
                    {({ getRootProps, getInputProps })=>{
                      return <Box
                      {...getRootProps({ className: "dropzone" })}>
                        <p>Перенесите сюда файлы</p>
                        <input {...getInputProps()}/>
                      </Box>
                    }}
                  </Dropzone>
                </Box>
                <Box style={{display:'flex', gap:'6px', marginBottom:'6px'}}>
                  {
                  previews.map((preview)=>{
                    return (<Box key={preview} sx={{width:'200px'}}>
                      <img style={{width:'100%',height:'100%', objectFit:'cover'}} src={preview} alt="preview"/>
                    </Box>);
                  })
                  }
                </Box>
              </AddPictureContainer>
              <Button  onClick={()=>handleUpload()} color="success" variant="contained" >
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