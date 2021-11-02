// import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { useEffect, useState } from 'react';
import { customAxios } from '../api/customAxios';
import { apiUrl } from './../configs/index';
import { AxiosResponse } from 'axios';
const randomEmail = require('random-email');
export const TestInterceptorComponent = () => {
  const [myToken, setToken] = useState('');
  // get protected data
  const getData = async () => {
    const { data } = await customAxios.post(`${apiUrl}/apartments/get-protected-data`)
  }

  const getCookie = async () => {
    const { data } = await customAxios.get(`${apiUrl}/apartments/cookie-get`);
    console.log(data);
  }
  const getToken = async () => {
    const user = {
      email: randomEmail({domain:'mail.ru'}),
      password: '12345'
    };
    const { data: { accessToken, refreshToken,email,expiresAt } } = await customAxios.post(`${apiUrl}/auth/signin`, user) as AxiosResponse<{
        status: string,
        accessToken: string,
        email: string,
        refreshToken: string,
        expiresAt: number,
      }>;
      localStorage.setItem('userInfo', JSON.stringify({accessToken, refreshToken,email,expiresAt}));   
  }
  useEffect(() => {
    (async () => {
      const { data } = await customAxios.post(`${apiUrl}/apartments/test-verify`);
      console.log("data", data);
    })()
  }, []);
  return (<Box>
    {JSON.stringify({ token: myToken })}
    <Button onClick={(e) => { getToken() }}>Loggin with token</Button>
    <Button onClick={(e) => getData()}>Get Protected Data</Button>
    <Button onClick={(e) => getCookie()}>Get cookie</Button>
  </Box>)
}