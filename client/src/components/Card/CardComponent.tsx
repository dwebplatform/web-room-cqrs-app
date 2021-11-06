import { Swiper, SwiperSlide } from "swiper/react";

import SwiperCore, {
  Navigation,Pagination
} from 'swiper';

import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";
import "swiper/components/pagination/pagination.min.css";

import './style.scss';
import { IShowSearchedApartment } from './../../interfaces/show-searched-apartment';
import { apiUrl } from './../../configs/index';


SwiperCore.use([Navigation, Pagination]);
 
export const CardComponent=({offerTitle,rentType, description,priceForDay,images,subways,priceForMonth,priceInfo}:IShowSearchedApartment)=>{
  return (<div className="card">
    <div className="card__slider-container">
      {/* SLIDER CONTAINER */}
      <div className="card__media">
        <div className="card__gallery">
          <div style={{width:'100%', height:'300px',}}>
          <Swiper style={{height:'100%'}}
          className="card__slider"
          pagination={{
            clickable: true
          }}
          navigation={{
          }}
          >
            {
              images.map((image)=>{
                return (
                  <SwiperSlide key={image.id}>
                <div className="card__gallery-item" >
                <img alt="img" className="card__gallery-image" 
                src={`${apiUrl}/img/${image.fileName}`}
                />
              </div>
              </SwiperSlide>)
              })
            }
          </Swiper>
          </div>
        </div>
        <div className="card__thumb-nails">
          {
            (()=>{
              let thumbItems = [];
              for(let index = 0;index<3;index++){
                if(images[index]){
                  thumbItems.push(<div className="card__thumb-nail">
                  <img alt="img" 
                  src={`${apiUrl}/img/${images[index].fileName}`}
                  />
               </div>);
                }
              }
              return thumbItems;
            })()
          }
        </div>
      </div>
    </div>
    <div className="card__content">
      {/* информация о квартире:start */}
      <div className="card__general">
        <div className="card__title">
          <div className="card__offer-title">
           {offerTitle}
          </div>
          <div className="card__sub-title">
          2-комн. кв., 84,6 м², 2/13 этаж
          </div>
          <div className="card__row">
            <a href="!#" className="card__jk">ЖК «Остров»</a>
          </div>
          
          <div className="card__geo-row">
          {subways.length>0
           && <div className="card__special-geo">
            <a href="!#" className="card__link">
              <div className="card__icon">
                <div className="icon-wrapper">
                  {/* UNDEGROUND ICON */}
                <svg  width="16" height="16" fill={subways[0].color}
                 xmlns="http://www.w3.org/2000/svg"><path d="M0 12.233v1.481h5.556v-1.481h-.89l.89-3.175L8 12.233l2.444-3.175.89 3.175h-.89v1.481H16v-1.481h-.889l-4-9.947L8 8.423 4.889 2.286l-4 9.947H0z"  ></path></svg>
                </div>
              </div>
              <div className="card__undeground-name">{subways[0]?.name}</div>
            </a>
            <div className="card__remoteness">{subways[0]?.timeInfo}</div>
          </div>}
          <div className="card__geo-labels">
            {/* TODO: добавить поля labels в связь с квартирой */}
            <a href="!#" className="card__geo-label">Москва</a>,&nbsp;
            <a href="!#" className="card__geo-label">СЗАО</a>,&nbsp;
            <a href="!#" className="card__geo-label">р-н Хорошево-Мневники</a>,&nbsp;
            <a href="!#" className="card__geo-label">метро Мневники</a>,&nbsp;
            <a href="!#" className="card__geo-label">Жилой комплекс остров</a>,&nbsp;
            <a href="!#" className="card__geo-label">4-й кв-л</a>,&nbsp;
          </div>
        </div>
        </div>
        <div className="card__row">
          <div className="card__main-price">
          {/* {priceForDay} ₽/мес.  */}
            {(()=>{
              let priceString =  '';
              if(rentType === 'MONTH'){
                priceString = `${priceForMonth} ₽/мес.`;
              } else if(rentType==='DAY'){
                priceString = `${priceForDay} ₽/сутки`
              }
              return priceString;
            })()}
          </div>
        </div>
        <div className="card__row">
          <p className="card__price-info">
            {priceInfo}
          </p>
        </div>
        <div className="card__description-wrapper">
        <div className="card__description" >
          <p className="card__description-content">{description}</p>
        </div>
        </div>
      </div>
        {/* информация о квартире| комнате и или доме:end */}

      <div className="card__aside">
        {/*  информация о продавце */}
      </div>
    </div>
  </div>)
}