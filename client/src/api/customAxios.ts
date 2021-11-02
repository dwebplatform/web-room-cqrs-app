import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiUrl } from '../configs';


const axiosInstance = axios.create();
async function getAccessTokenByRefreshToken(oldRefreshToken:string, email:string){
  try{
    const { data: {
        accessToken,
        refreshToken,
        expiresAt
    } } =  await axios.create().post(`${apiUrl}/auth/refresh`,{refreshToken:oldRefreshToken, email}) as AxiosResponse<{accessToken:string;refreshToken:string;expiresAt: number;}>;
      let prevUserInfo = JSON.parse(localStorage.getItem('userInfo')||"{}");
      // set prev userInfo to new
     localStorage.setItem('userInfo',
      JSON.stringify({
        ...prevUserInfo,
          accessToken,
          refreshToken,
          expiresAt})) ;
      return accessToken;
  } catch(err){
    console.log("Occured because of refresh ONLY",err);
  }
}

axiosInstance.interceptors.response.use( (response)=>{
  return response;
}, async (error)=>{
  if(error.config && error.response && error.response.status === 401) {
    console.log("Authorization error occured");
    let {refreshToken,email} =  JSON.parse(localStorage.getItem('userInfo')||"{}");
    let newAccessToken = await getAccessTokenByRefreshToken(refreshToken,email);
    error.config.headers.Authorization = `Bearer ${newAccessToken}`;
    return axios.request(error.config);
  }
    return Promise.reject(error);
});
axiosInstance.interceptors.request.use(
 async (config:AxiosRequestConfig<any>|null)=>{
    let {accessToken, expiresAt, refreshToken,email} =  JSON.parse(localStorage.getItem('userInfo')||"{}");
    if(config && config.headers){
      config.headers.Authorization = `Bearer ${accessToken};`
    }
    return config;
  },
  (err:any)=>{
    return Promise.reject(err);
  }
);

export {axiosInstance as customAxios};