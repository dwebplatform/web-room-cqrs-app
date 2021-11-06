import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  Navigation,Pagination
} from 'swiper';

import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";
import "swiper/components/pagination/pagination.min.css";
import './style.scss';

import { Alert, Box, Card } from "@mui/material";
import React , { useEffect, useState } from "react";
import ReactTooltip from 'react-tooltip';
import { apiUrl } from './../../configs/index';
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetApartmentShowAction } from "../../actions/apartmentShowActions";
import { RootState } from "../../store";
import { GROUP_VARIANTS } from "../../interfaces/apartment-show-interface";

SwiperCore.use([Navigation, Pagination]);
 
const QuestionMarkIcon =()=>{
  return (<svg width="16px" height="16px" className="question-mark"
  viewBox="0 0 16 16"><path fill="currentColor" d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm-1-5v2h2v-2H7zm.134-1.57h1.644c-.01-.498.033-.844.125-1.037.093-.193.33-.45.713-.767.74-.614 1.22-1.1 1.446-1.456.226-.357.34-.735.34-1.135 0-.72-.31-1.354-.923-1.898-.615-.543-1.442-.815-2.482-.815-.988 0-1.786.27-2.394.806-.608.537-.936 1.19-.983 1.96l1.664.205c.116-.537.328-.936.638-1.2.31-.26.694-.392 1.153-.392.477 0 .856.127 1.138.378.28.252.422.554.422.906 0 .253-.08.485-.24.696-.102.133-.417.414-.946.844-.53.43-.88.816-1.058 1.16-.176.344-.264.782-.264 1.315l.006.43z" ></path></svg>);
}
// TODO:
export const ApartmentShowComponent = () => {
  // char group "summary"
  let { apartmentId } = useParams<{ apartmentId: string }>();
  const dispatch = useDispatch();
  
  const { apartment , error } = useSelector((state:RootState)=>state.apartmentShow);
  useEffect(() =>{
    dispatch(GetApartmentShowAction({apartmentId}));
  },[apartmentId,dispatch]);
  if(error){
    return <Alert severity='error'>{error.message}</Alert>
  }
  if(!apartment){
    return null;
  }
  const summaryChars = apartment.chars.filter(char=>char.groupValue === GROUP_VARIANTS.SUMMARY);
  const generalChars = apartment.chars.filter(char=>char.groupValue === GROUP_VARIANTS.GENERAL);
  console.log(apartment);
  return (
  <>
  <Card variant="outlined" className="apartment">
    <Box className="apartment-top">
      <Box className="apartment-header">
        <div className="apartment-header__offer-title"><h1>{apartment.name}</h1></div>
        <div className="apartment-header__location-info">Москва, ЮАО, р-н Бирюлево Восточное, Михневская ул., 8</div>
        <ul className="apartment-header__undegrounds">
          {apartment.subways.map(subway=>{
            return (<li className="apartment-header__undeground"
            key={subway.id}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="17" height="17"
              className="apartment-header__undeground-icon"
            ><path data-name="UndergroundIcon" fill={subway.color}  d="M11.154 4L8 9.53 4.845 4 1.1 13.466H0v1.428h5.657v-1.428H4.81l.824-2.36L8 15l2.365-3.893.824 2.36h-.85v1.427H16v-1.428h-1.1z"></path></svg>            
            <a href="!#" className="apartment-header__undeground-link">{subway.name}</a>
            <span className="apartment-header__undeground-time">⋅&nbsp;{subway.timeInfo}</span>
          </li>)
          })}
        </ul>
      </Box>
      <Box className="apartment-image-container">
        <Swiper
          slidesPerView={1}
          initialSlide={1}
          centeredSlides={true}
          navigation={{
          }}
          className="apartment-swiper"
          pagination={{
            type:'bullets',
            clickable:true,
            renderBullet:(index, className)=>{
              let path = `"${apiUrl}/img/${apartment.images[index].fileName}"`;
           
              return `<div class='${className + " apartment-swiper__bullet"}'>
                <div class="apartment-swiper__bullet-img-wrapper">
                  <img alt="swiper image" class="apartment-swiper__bullet-img"   src=${path}/>
                </div>
              </div>`
            }
          }}
        >
          {apartment.images.map((image,index)=>{
            return (<SwiperSlide key={index}>
              <div className="swiper-el"
              style={{backgroundImage:`url(${apiUrl}/img/${image.fileName})`}}
              ></div>
            </SwiperSlide>)
          })}
        </Swiper>
        {/* Slider Content */}
      </Box>
      <Box className="apartment-summary-description">
        <div className="apartment-summary-description__title">{apartment.offerTitle}</div>
        {/* характеристики, типа общие, то есть площадь кухни, площадь комнаты и тд:start  */}
        <div className="apartment-summary-description__info-block">
          {summaryChars.map((char)=>{
            return (<div className="apartment-summary-description__info-block-el" key={char.id}>
            <div className="apartment-summary-description__info-block-el-value">{char.STRING_VALUE}</div>
            <div className="apartment-summary-description__info-block-el-title">{char.keyName}</div>
          </div>);
          })}
        </div>
        {/* характеристики, типа общие, то есть площадь кухни, площадь комнаты и тд:end  */}
      </Box>
    </Box>

    <Box style={{ borderTop: '1px solid #e4e4e4' }} className="apartment-middle">
      <div className="apartment-description">
        <p className="apartment-description__text">{apartment.description}</p>
      </div>
    </Box>
  </Card>
  <Card className="apartment">
      <Box className="apartment-general-info-block">
      {/*  добавить general char */}
      <div className="apartment-general-info-block__title">Общая информация</div>
      <section className="apartment-general-info-block__chars">
        <article className="apartment-general-info-block__article">
          <ul className="apartment-general-info-block__list">
          {generalChars.map(char=>{
            if(char.hasHint){
              let hintString = char.hints.split(',').join('<br/>');
              return (<li className="apartment-general-info-block__chars-item" key={char.id}>
              <span className="apartment-general-info-block__char-key">{char.keyName}
                <span data-tip={hintString} >
                <QuestionMarkIcon />
                </span>
                 <ReactTooltip className="apartment-general-info-block__char-hint-box" place="right"  type="light" html={true}/>
              </span>
              <span className="apartment-general-info-block__char-val">{char.STRING_VALUE}</span>
            </li>);
          }
            return (<li className="apartment-general-info-block__chars-item" key={char.id}>
            <span className="apartment-general-info-block__char-key">{char.keyName}</span>
            <span className="apartment-general-info-block__char-val">{char.STRING_VALUE}</span>
          </li>)
          })}
          </ul>
        </article>
      </section>
    </Box>
  </Card>
  </>
  )
}