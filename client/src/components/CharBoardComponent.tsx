import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CreateCharAction, GetCharsAction } from '../actions/charActions';

import styled from 'styled-components';
import { RootState } from '../store';
import { resetChars } from '../reducers/charEditReducer';

const CharBoardWrapper = styled(Box)`
  padding-top: 2rem;
  display: flex;
`;
const CustomBadge = styled.div`
  background-color: #99ff99;
  padding: 4px 12px;
  color: #fff;
  border-radius: 16px;
`;

enum CHAR_VARIANTS {
  ARRAY_VALUE  = 'ARRAY_VALUE',
  STRING_VALUE = 'STRING_VALUE',
  BOOL_VALUE   = 'BOOL_VALUE'
};

export const CharBoardComponent = () => {

  
  const [isApartmentPicked,setApartmentPicked ] = useState(false);

  const [currentApartment, setCurrentApartment] = useState<null|any>(
  localStorage.getItem('apartment') 
    ? JSON.parse( localStorage.getItem('apartment')||"{}" )
  : null);

  const [charsData, setCharsData] = useState<any>({
    keyName: '',
    isReseted: false
  });

  const [charVariant, setcharVariant] = useState<CHAR_VARIANTS>(CHAR_VARIANTS.STRING_VALUE);
  const [charTextValue, setCharTextValue] = useState<string>('');
  const [charBoolValue, setCharBoolValue] = useState<boolean>(false);

  const [charArrayValue, setCharArrayValue] = useState<string[]>([]);

  const [charArrayElValue, setCharArrayElValue] = useState<string>('');
  
  function getValue(type:CHAR_VARIANTS):any{
    if(type === CHAR_VARIANTS.ARRAY_VALUE){
      return charArrayValue;
    }
    if(type === CHAR_VARIANTS.BOOL_VALUE){
      return charBoolValue;
    }
    if(type === CHAR_VARIANTS.STRING_VALUE){
      return charTextValue;
    }
  }
  
  const { chars } = useSelector((state: RootState) => state.charEdit);
  const dispatch = useDispatch();

  const createChar=()=>{
    
    dispatch(CreateCharAction({
      keyName: charsData.keyName,
      charVariant,
      charValue: getValue(charVariant),
      apartmentId: isApartmentPicked ? currentApartment.id : null
    }));

  }
  const handleKeyNameChage=(e:any) => {
    setCharsData((prevData: any) => {
      return {
        ...prevData,
        isReseted: false,
        keyName: e.target.value,
      }
    });
    setTimeout(() => {
      if (charsData.keyName) {
        dispatch(GetCharsAction({ charKeyName: charsData.keyName }));
      } else {
        dispatch(resetChars());
      }
    }, 500);
  }
  return <CharBoardWrapper>
    <Card style={{ padding: '10px' }}>
      <Box style={{ display: 'flex', flexFlow: 'column', gap: '1rem' }}>
        <Box style={{position:'relative'}}>
          <TextField
            value={charsData.keyName}
            onChange={handleKeyNameChage}
            label="Название характеристики" variant="outlined" />
          <Box>
            {chars.map((char) => {
              return <MenuItem key={char.charId}
                onClick={(e) => {
                  dispatch(resetChars());
                  setCharsData((prevData:any)=>({...prevData, keyName: char.keyName, isReseted: true }));
                }}
              >{char.keyName}</MenuItem>
            })}
          </Box>
        </Box>
        <Box>
             <Box style={{
               marginLeft:'-10px',
               display:'flex', alignItems:'center'}}>
               <Box>
                <Checkbox value={isApartmentPicked} onChange={(e:any)=>{
                  setApartmentPicked(e.target.value)
                }}  />
               </Box>
               <Box>
                 <Typography>
                 Прикрепить к предыдущей квартире ?
                 </Typography>
               </Box>
               </Box>
           <FormControl component="fieldset">
            <FormLabel component="legend">Отображение характеристики</FormLabel>
            <RadioGroup
              value={charVariant}
              onChange={(e:any)=>{setcharVariant(e.target.value)}}>
              <FormControlLabel value={CHAR_VARIANTS.BOOL_VALUE} control={<Radio />} label="Чекбокс" />
              <FormControlLabel value={CHAR_VARIANTS.ARRAY_VALUE} control={<Radio />} label="Массив" />
              <FormControlLabel value={CHAR_VARIANTS.STRING_VALUE} control={<Radio />} label="Строка" />
            </RadioGroup>
            {(()=>{
            if(charVariant === CHAR_VARIANTS.STRING_VALUE){
                return <Box><TextField value={charTextValue} onChange={(e)=>{setCharTextValue(e.target.value)}}/></Box>
            }
            if(charVariant === CHAR_VARIANTS.BOOL_VALUE){
              return <Box style={{marginLeft:'-0.6rem'}}><Checkbox value={charBoolValue} onChange={()=>{setCharBoolValue(!charBoolValue)}}/></Box>;
            }
            if(charVariant === CHAR_VARIANTS.ARRAY_VALUE){
                return (
                <Box>
                  <Box style={{display:'flex', gap:'1rem', marginBottom:'1rem'}}>
                  {charArrayValue.map((el)=>{
                    return (<CustomBadge key={el}>{el}</CustomBadge>)
                  })}
                  </Box>
                  <Box style={{display:'flex', flexFlow:'column'}}>
                  <TextField style={{marginBottom:'1rem'}} value={charArrayElValue} onChange={(e)=>{setCharArrayElValue(e.target.value)}}/>
                  <Button variant='contained' onClick={(e)=>{
                    setCharArrayValue([...charArrayValue,charArrayElValue])
                  }}>Добавить</Button>
                  </Box>
                </Box>)
            }
          })()}
          </FormControl>
        </Box>
        <Box >
          <Button  onClick={(e)=>createChar()}>Создать</Button>
        </Box>
      </Box>
    </Card>
  </CharBoardWrapper>
}