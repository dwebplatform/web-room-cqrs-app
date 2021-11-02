
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

import { IOrder, STATUSES } from "../interfaces/order-interface";

import styled from 'styled-components';
import { useHistory } from "react-router-dom";


const CustomBadge = styled.div`
  background-color: #99ff99;
  padding: 4px 12px;
  color: #fff;
  border-radius: 16px;
`;
const FirstRaw =  styled.div`
  display:flex; 
  gap:6px; 
  align-items:center
`;
export const Order=({order}: {order:IOrder})=>{

  const history = useHistory();
  const normalizeComment=(comment:string)=>{
    return comment.length>15? comment.substring(0,15).concat('...') : comment;
  }
  const goToDetail=(id: number)=>{
    history.push(`/orders/${id}`);
  }
  return (<TableRow
    hover={true}
    key={order.id}
    style={{cursor:'pointer'}}
    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    onClick={()=>goToDetail(order.id)}
  >

    <TableCell component="th" scope="row">
      <FirstRaw >
      <div>{order.info.client.name} {order.info.client.phone}</div>
      { order.status === STATUSES.CREATED &&  <CustomBadge>новый заказ</CustomBadge>}
      </FirstRaw>
    </TableCell>
    <TableCell align="right">{normalizeComment(order.info.client.comment)}</TableCell>
    <TableCell align="right">{order.info.apartment.name}</TableCell>
    <TableCell align="right">{order.info.apartment.from}</TableCell>
    <TableCell align="right">{order.info.apartment.to}</TableCell>
    <TableCell align="right">{order.info.totalPrice}</TableCell>
  </TableRow>)
}
