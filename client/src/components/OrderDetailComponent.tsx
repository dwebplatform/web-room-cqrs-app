import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box  from '@mui/material/Box';
import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select'

import styled from 'styled-components';

import { RootState } from '../store';
import { ChangeOrderStatus, GetOrderById } from '../actions/orderActions';
import { STATUSES } from '../interfaces/order-interface';

const OrderDetailWrapper = styled.div`
  display: flex;
  gap: 1rem;
  max-width: 100%;
  padding-top:20px;
`
const OrderDetailLeft = styled(Card)`
  flex:1;
`;
const OrderDetailRight = styled(Card)`
  flex-basis: 300px;
`;

const InfoWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 1rem;
  min-height: 30vh;
`;

const ClientInfoCard = styled(Card)`
  flex: 1;
`;

const ApartmentInfoCard = styled(Card)`
  flex: 2;
`;
const TotalBox = styled(Box)`
  max-width: 100%;
  display: flex;
  gap: 1rem;
  padding: 12px;
  justify-content: flex-end;
`;

const CommentTitle = styled(Box)`
  padding: 10px;
`;
const CommentRow = styled(Box)`
  padding: 6px 8px;
  width: 100%;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
`;

const StatusBadge = styled(Typography)` 
    background-color: #99ff99; 
    padding: 6px 12px; 
    border-radius: 20px;
`;

const TopDescription = styled(Box)`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
const StatusChangeButton = styled(Button)`
max-width: 200px;
`;

const OrderBottom = styled(Box)`
display: flex;
justify-content: space-between;
`;
export const OrderDetailComponent = () => {

  let { id } = useParams<{ id: string }>();

  const { order, error } = useSelector((state: RootState) => state.orderDetail);
  
  const dispatch = useDispatch();
  let initialStatus = order ? order.status : '';
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string| null>(initialStatus);
  
  useEffect(()=>{
    if(order){
      setSelectedOrderStatus(order.status);
    }
  },[order]);
  
  useEffect(() => {
    dispatch(GetOrderById(id));
  }, [dispatch, id]);
  
  const handleChangeStatus=()=>{
    if(!order|| !selectedOrderStatus){return;}
    dispatch(ChangeOrderStatus({
      id:order.id,
      newStatus: selectedOrderStatus
    }));
  }

  if(error) {
    return <Alert severity='error'>{error.message}</Alert>
  }

  if(!order) {
    return null;
  }

return (<OrderDetailWrapper>
    <OrderDetailLeft>
      <CardContent>
        <TopDescription>
          <Typography sx={{ fontSize: 18, fontWeight: 'bold' }} gutterBottom>
            Заказ номер #{order.id} 
          </Typography>
          {STATUSES.CREATED === order.status && (
          <StatusBadge sx={{ fontSize: 16, fontWeight: '500' }} gutterBottom>
            Новый заказ
          </StatusBadge>)}
        </TopDescription>
        <InfoWrapper>
          <ClientInfoCard >
            <CardContent>
              <Typography>
                Клиент
              </Typography>
              <Divider style={{ marginBottom: '1rem' }} />
              <Typography>
                Имя: {order.info.client.name}
              </Typography>
              <Typography>
                телефон: {order.info.client.phone}
              </Typography>
              <Typography>
                email: {order.info.client.email}
              </Typography>
            </CardContent>
          </ClientInfoCard>
          <ApartmentInfoCard>
            <CardContent>
              <Typography>
                Квартира
              </Typography>
              <Divider style={{ marginBottom: '1rem' }} />
              <Typography>
                Название: {order.info.apartment.name}
              </Typography>
              <Typography>
                Обычная цена за сутки: {order.info.totalPrice}
              </Typography>
              <Typography>
                Время заезда: {order.info.apartment.from}
              </Typography>
              <Typography>
                Время выезда: {order.info.apartment.to}
              </Typography>
            </CardContent>
          </ApartmentInfoCard>
        </InfoWrapper>
      </CardContent>
      <TotalBox>
        <Box style={{flex:1}}>
        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">
            <Typography sx={{background:'#fff'}}>
              Сменить статус
            </Typography>
          </InputLabel>
        <Select
          value={selectedOrderStatus}
          onChange={(e:any)=>{setSelectedOrderStatus(e.target.value);}}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Age"
          style={{
            marginBottom:'1rem'
          }}>
          <MenuItem value={STATUSES.CREATED}>Создан</MenuItem>
          <MenuItem value={STATUSES.PENDING}>В ожидании</MenuItem>
          <MenuItem value={STATUSES.SUCCESS}>Оплачен</MenuItem>
          <MenuItem value={STATUSES.UPDATED}>Обновлен</MenuItem>
        </Select>
      </FormControl>
      
      <OrderBottom>
      <StatusChangeButton variant="contained" color="info" onClick={(e)=>handleChangeStatus()}
      >Сменить статус </StatusChangeButton>
      <Button variant="outlined" color="success">
          <Typography sx={{ color: '#000', fontSize: '14px', fontWeight: '600' }}>Итого:</Typography>
          <Typography sx={{ color: '#000', fontSize: '18px', fontWeight: 'bold' }}>&nbsp;{order.info.totalPrice}$</Typography>
        </Button>
      </OrderBottom>
        </Box>
        
      </TotalBox>
    </OrderDetailLeft>
    <OrderDetailRight variant="outlined">
      <Box>
        <CommentTitle>
          <Typography sx={{ fontSize: 18, fontWeight: 'bold' }} gutterBottom>
            Комментарии
          </Typography>
        </CommentTitle>
        {/* списочек комментариев осталвенный клиентом */}
        <Box style={{ width: '100%' }}>{order.comments?.map((c) => {return <CommentRow key={c.id}>{c.body}</CommentRow>})}
        </Box>
      </Box>
    </OrderDetailRight>
  </OrderDetailWrapper>)
}