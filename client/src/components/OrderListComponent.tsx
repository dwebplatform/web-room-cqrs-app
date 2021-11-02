import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";


import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Paper from "@mui/material/Paper";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import React, { useEffect } from "react";
import { GetOrders } from '../actions/orderActions';
import { Order } from "./OrderComponent";
import Alert from "@mui/material/Alert";

export const OrderListComponent=()=> {

  const { orders, error } = useSelector((state:RootState)=>state.orders);
  const dispatch = useDispatch();

  useEffect(() =>{
    dispatch(GetOrders())
  },[dispatch]);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Заказчик</TableCell>
            <TableCell align="right">Апартаменты</TableCell>
            <TableCell align="right">Комментарий</TableCell>
            <TableCell align="right">Время заселения</TableCell>
            <TableCell align="right">Время выезда</TableCell>
            <TableCell align="right">Итого</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {error && <TableCell><Alert severity="error">{error.message}</Alert></TableCell>}
          {orders.map((order)=><Order key={order.id} order={order}/>)}
         </TableBody>
      </Table>
    </TableContainer>
  );
}




//   const orders = [{
//     id: 113,
//     status:"CREATED",
//     createdAt: "",
//     info: {
//       "client":{
        //  name:  "Вася",
//          phone: "8800553535",
//          email: "test@mail.ru",
//          comment: 'Хотел бы узнать и тд'
//       },
//       "totalPrice": 4900,
//       "apartment": {  
//            id: 12,
//            name:"Фрунзинская дом 4",
//            from: "09.10.2021",
//            to: "12.10.2021",
//       }
//     }
// }
// ];