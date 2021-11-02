import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import styled from 'styled-components';
import { IChar } from '../interfaces/apartment-interface';





const StatusBadge = styled(Typography)` 
    background-color: #1674d1; 
    padding: 6px 12px; 
    border-radius: 20px;
    color: #fff;
    cursor: pointer;
`;

const BoolChar = styled(Box)`
  display: flex;
  align-items: center;
`;

const ArrayChar = styled(Box)`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.5rem;
`;
export const CharListComponent = ({ chars }: { chars: IChar[] }) => {
  return (<>
    {chars.map((char) => {
      if (char.valueType === "ARRAY" && char.ARRAY_VALUE) {
        return <ArrayChar key={char.charId}>
          <Typography>{char.keyName}:</Typography>
          {char.ARRAY_VALUE.map((charValue, index) => <StatusBadge key={index}>{charValue}</StatusBadge>)}
        </ArrayChar>
      }
      if (char.valueType === "BOOL") {
        console.log(char.BOOL_VALUE,"BOOL VALUE");
        return (<BoolChar key={char.charId}>
          <Box><Typography>{char.keyName}:</Typography></Box>
          <Box>
            <Checkbox checked={char.BOOL_VALUE === true} />
          </Box>
        </BoolChar>);
      }
      if (char.valueType === 'STRING') {
        return (
          <Box key={char.charId} style={{ display: 'flex', alignItems: 'center' }}>
            <Box><Typography>{char.keyName}:&nbsp;</Typography></Box>
            <Box>
              <Typography>{char.STRING_VALUE}</Typography>
            </Box>
          </Box>);
      }
      return null;
    })}
  </>)
}