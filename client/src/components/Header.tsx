import {
  Link,
  NavLink
} from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import styled from "styled-components";

const CustomNavLink = styled(NavLink)`
  padding: 6px;
  color: #fff;
  text-decoration: none;
`;

export const Header = () => {
  return (<Box>
    <AppBar position="static">
      <Toolbar variant="dense">
        <CustomNavLink to="/orders"
          activeStyle={{
            borderBottom: '1px solid #fff'
          }}>
          <Typography variant="h6" color="inherit" component="div">
            список заказов
          </Typography>
        </CustomNavLink>
        <CustomNavLink to="/chars-panel"
          activeStyle={{
            borderBottom: '1px solid #fff'
          }}>
          <Typography  variant="h6" color="inherit" component="div">
            Создать характеристику
          </Typography></CustomNavLink>

      </Toolbar>
    </AppBar>
  </Box>);
}