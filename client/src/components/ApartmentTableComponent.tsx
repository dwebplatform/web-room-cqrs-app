
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

export const ApartmentTableComponent=()=> {


  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Название</TableCell>
            <TableCell align="right">Описание</TableCell>
            <TableCell align="right">Тип аренды</TableCell>
            <TableCell align="right">Цена</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
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


 