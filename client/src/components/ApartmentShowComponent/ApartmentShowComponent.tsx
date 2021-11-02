import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  Navigation,Pagination
} from 'swiper';

import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";
import "swiper/components/pagination/pagination.min.css";
import './style.scss';

import { Box, Card } from "@mui/material";
import React , { useState } from "react";
import { spawn } from "child_process";
import ReactTooltip from 'react-tooltip';


SwiperCore.use([Navigation, Pagination]);
 
const QuestionMarkIcon =()=>{
  return (<svg width="16px" height="16px" className="question-mark"
  viewBox="0 0 16 16"><path fill="currentColor" d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm-1-5v2h2v-2H7zm.134-1.57h1.644c-.01-.498.033-.844.125-1.037.093-.193.33-.45.713-.767.74-.614 1.22-1.1 1.446-1.456.226-.357.34-.735.34-1.135 0-.72-.31-1.354-.923-1.898-.615-.543-1.442-.815-2.482-.815-.988 0-1.786.27-2.394.806-.608.537-.936 1.19-.983 1.96l1.664.205c.116-.537.328-.936.638-1.2.31-.26.694-.392 1.153-.392.477 0 .856.127 1.138.378.28.252.422.554.422.906 0 .253-.08.485-.24.696-.102.133-.417.414-.946.844-.53.43-.88.816-1.058 1.16-.176.344-.264.782-.264 1.315l.006.43z" ></path></svg>);
}
export const ApartmentShowComponent = () => {
  const [images, setImages] = useState<string[]>(["https://images.unsplash.com/photo-1548247416-ec66f4900b2e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=420&q=80","https://images.unsplash.com/photo-1552053831-71594a27632d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9nfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60","https://images.unsplash.com/photo-1561948955-570b270e7c36?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=301&q=80"]);
  return (
  <>
  <Card variant="outlined" className="apartment">
    <Box className="apartment-top">
      <Box className="apartment-header">
        <div className="apartment-header__offer-title"><h1>2-комн. квартира, 80,3 м²</h1></div>
        <div className="apartment-header__location-info">Москва, ЮАО, р-н Бирюлево Восточное, Михневская ул., 8</div>
        <ul className="apartment-header__undegrounds">
          <li className="apartment-header__undeground">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="17" height="17"
              className="apartment-header__undeground-icon"
            ><path data-name="UndergroundIcon" fill="#00701A"  d="M11.154 4L8 9.53 4.845 4 1.1 13.466H0v1.428h5.657v-1.428H4.81l.824-2.36L8 15l2.365-3.893.824 2.36h-.85v1.427H16v-1.428h-1.1z"></path></svg>
            <a href="!#" className="apartment-header__undeground-link">Царицыно</a>
            <span className="apartment-header__undeground-time">15 мин. пешком</span>
          </li>
        </ul>
      </Box>
      <Box className="apartment-image-container">
        <Swiper
          slidesPerView={1}
          initialSlide={1}
          centeredSlides={true}
          navigation={true}
          className="apartment-swiper"
          pagination={{
            type:'bullets',
            clickable:true,
            renderBullet:(index, className)=>{
              console.log(index,className);
              return `<div class='${className + " apartment-swiper__bullet"}'>
                <div class="apartment-swiper__bullet-img-wrapper">
                  <img alt="swiper image" class="apartment-swiper__bullet-img"   src=${images[index]}/>
                </div>
              </div>`
            }
          }}
        >
          {images.map((image,index)=>{
            return (<SwiperSlide key={index}>
              <div className="swiper-el"
              style={{backgroundImage:`url(${image})`}}
              ></div>
            </SwiperSlide>)
          })}

        </Swiper>
        {/* Slider Content */}
      </Box>
      <Box className="apartment-summary-description">
        <div className="apartment-summary-description__title">Дом заселен! Оперативный показ!</div>
        {/* характеристики, типа общие, то есть площадь кухни, площадь комнаты и тд:start  */}
        <div className="apartment-summary-description__info-block">
          <div className="apartment-summary-description__info-block-el">
            <div className="apartment-summary-description__info-block-el-value">80,3 м²</div>
            <div className="apartment-summary-description__info-block-el-title">Общая</div>
          </div>
          <div className="apartment-summary-description__info-block-el">
            <div className="apartment-summary-description__info-block-el-value" >43 м²</div>
            <div className="apartment-summary-description__info-block-el-title">Жилая</div>
          </div>
          <div className="apartment-summary-description__info-block-el">
            <div className="apartment-summary-description__info-block-el-value">10,1 м²</div>
            <div className="apartment-summary-description__info-block-el-title">Жилая</div>
          </div>
          <div className="apartment-summary-description__info-block-el">
            <div className="apartment-summary-description__info-block-el-value">9 из 45</div>
            <div className="apartment-summary-description__info-block-el-title">этаж</div>
          </div>
          <div className="apartment-summary-description__info-block-el">
            <div className="apartment-summary-description__info-block-el-value">2013</div>
            <div className="apartment-summary-description__info-block-el-title">Построен</div>
          </div>
        </div>
        {/* характеристики, типа общие, то есть площадь кухни, площадь комнаты и тд:end  */}
      </Box>
    </Box>

    <Box style={{ borderTop: '1px solid #e4e4e4' }} className="apartment-middle">
      <div className="apartment-description">
        <p className="apartment-description__text">Продается просторная 2-комнатная квартира Номер 292 площадью 80,3 кв.м. в ЖК "Загорье" на 9 этаже 45 этажного дома.
          Квартира без отделки с возведенными перегородками, установлены радиаторы отопления, окна и лоджии остеклены, установлены все приборы учета.
          ЖК "Загорье" - монолитный дом повышенной комфортности с панорамными видами, подземной парковкой. В ЖК установлены лифты OTIS. Вся необходимая инфраструктура уже построена: 2-а детских сада, школа (есть кадетский класс), ДЮСШ, поликлиника, ТЦ, банки, рестораны, МФЦ, фитнес центры и сетевые магазины.
          Комплекс окружают природные пруды, вокруг которых благоустроены прогулочные зоны + рядом Герценский парк 24 Га, Дендропарк.
          В шаговой доступности ж/д станция Бирюлёво-пассажирская от которой ходят электрички до МЦК и Павелецкого вокзала (20 мин). Ближайшая станция метро Царицыно 15 минут на общественном транспорте.
          Зеленый и чистый район.
          Юридически и физически свободна.
          Свободная продажа от собственника.</p>
      </div>
    </Box>
  </Card>
  <Card className="apartment">
      <Box className="apartment-general-info-block">
      <div className="apartment-general-info-block__title">Общая информация</div>
      <section className="apartment-general-info-block__chars">
        <article className="apartment-general-info-block__article">
          <ul className="apartment-general-info-block__list">
            <li className="apartment-general-info-block__chars-item">
              <span className="apartment-general-info-block__char-key">Тип жилья</span>
              <span className="apartment-general-info-block__char-val">Вторичка</span>
            </li>
            <li className="apartment-general-info-block__chars-item">
              <span className="apartment-general-info-block__char-key">Планировка</span>
              <span className="apartment-general-info-block__char-val">Изолированная</span>
            </li>
            <li className="apartment-general-info-block__chars-item">
              <span className="apartment-general-info-block__char-key">Площадь комнат
                {/* svg question mark:*/}
                <span data-tip="+ обозначение смежных комнат<br/> - обозначение изолированных комнат" className="">
                <QuestionMarkIcon />
                </span>
                <ReactTooltip className="apartment-general-info-block__char-hint-box" place="right"  type="light" html={true}/>
              </span>
              <span className="apartment-general-info-block__char-val">28.15-14.85 м²</span>
            </li>
          </ul>
        </article>
      </section>
    </Box>
  </Card>
  </>
  )
}