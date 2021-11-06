// https://images.unsplash.com/photo-1522357262022-50fd510ac901?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Y2F0JTIwcm9vbXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60
import { Checkbox } from '@mui/material'
import './style.scss'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { SEARCH_TYPES, toggleRoomAmountAction, toggleSearchAction } from '../../reducers/searchApartmentReducer';
import { getRoomOfferTitle } from './utils/getRoomOfferTitle';
import { Link } from 'react-router-dom';
import { getSearchLink } from './utils/getSearchLink';

export const HomePageComponent = () => {

  const {
    currentSearchVariants, 
    searchVariants, 
    searchRoomAmountVariants, 
    currentSearchRoomAmountVariants} = useSelector((state:RootState)=>state.searchApartment);
  const dispatch = useDispatch();

  const flatSearchVariants = searchVariants.filter((item)=>item.type === SEARCH_TYPES.FLAT);
  const roomSearchVariants = searchVariants.filter((item)=>item.type === SEARCH_TYPES.ROOM);
  const hasFlats = currentSearchVariants.find(item=>item.type === SEARCH_TYPES.FLAT);
  

  
  const [isFirstDropDownShowed, setFirstDropDownShowed] = useState(false);
  const [isAmountApartmentDropDownShowed, setAmountApartmentShowed] = useState(false);
  const [isPriceDropDownShowed, setPriceDropDownShow] = useState(false);
  
  const [rentType, setRentType] = useState('MONTH');
  const [{fromPrice, toPrice}, setPriceRange] = useState({
    fromPrice: '',
    toPrice: ''
  });
  const searchFieldValue = ()=>{
    const ids = currentSearchVariants.map(item=>item.id).sort((a,b)=>{
      return a>b ? 1: -1
    }).join(':');

    const obj:any ={
      '1':'Квартиру в новостройке',
      '2':'Квартиру во вторичке',
      '1:2':'Квартиру в новостройке и вторичке',
      '3':'Комнату',
      '4':'Долю',
      '3:4':'Долю, комнату',
    } 
    return obj[ids];
  }; 

  const toggleSearch=(id:number)=>{
    dispatch(toggleSearchAction({id})) ;
  }
  const toggleRoomAmount=(id:number)=>{
    dispatch(toggleRoomAmountAction({id})) ;
  }

    // квартира в новостройке:
  // APARTMENT_IN_NEW_BUILDING="APARTMENT_IN_NEW_BUILDING",
  // квартира во вторичке:
  // APARTMENT_IN_SECONDARY="APARTMENT_IN_SECONDARY",
 
  const searchLink  = getSearchLink(currentSearchVariants,currentSearchRoomAmountVariants, rentType,{fromPrice, toPrice});
  return (<section className="home-menu-section">
    <div className="home-menu-content">
      <div className="menu__title">
        #ищи на все Байки ру
      </div>
      <div className="search-container">
        <ul className="search-container__tabs">
          {/* снять или посуточно */}
        <li className="search-container__tabs-el">
          <div  onClick={()=>{
            setRentType("MONTH");
          }}  className={`search-container__tabs-btn ${rentType === 'MONTH' ?"active":""}`} >Снять</div>
        </li>
        <li className="search-container__tabs-el">
          <div  onClick={()=>{
            setRentType("DAY");
          }} className={`search-container__tabs-btn ${rentType==='DAY' ?"active":""}`}>Посуточно</div>
        </li>
        </ul>
        <div className="search-container__filters" >
          {/* тип квартиры | комнаты если квартира */}
          <div onBlur={()=>{
            console.log('Ушел');
        }} className="search-container__filters-item search-container__filters-item--first">
            <button className={`search-container__filters-item-btn ${isFirstDropDownShowed ? 'active':''}`} onClick={()=>setFirstDropDownShowed(!isFirstDropDownShowed)}>{searchFieldValue()}</button>
            {/* popup: start */}
            <div className={`search-container__filters-item-type-dropdown ${isFirstDropDownShowed ?'show':''}`}>
              <ul className="dropdown-container">
                <li className="dropdown-container__item">
                  <ul className="dropdown-list">
                    {
                      flatSearchVariants.map(flat=>{
                        const currentFlat = currentSearchVariants.find(item=>item.id===flat.id);
                        return (<li className="dropdown-list__item"
                        key={flat.id}>
                        <Checkbox checked={currentFlat!==null && currentFlat!==undefined}
                        onClick={()=>{toggleSearch(flat.id)}}
                        />
                        <span className="dropdown-list__val">
                          {flat.name}
                        </span>
                      </li>);
                      })
                    }
                  </ul>
                </li>
                <li className="dropdown-container__item">
                  <ul className="dropdown-list">
                    {
                      roomSearchVariants.map((room)=>{
                        const currentFlat = currentSearchVariants.find(item=>item.id===room.id);
                        return (<li className="dropdown-list__item" key={room.id}>
                        <Checkbox checked={currentFlat!==null && currentFlat!==undefined} 
                        onClick={()=>{toggleSearch(room.id)}}/>
                        <span className="dropdown-list__val">
                          {room.name}
                        </span>
                      </li>)
                      })
                    }
                  </ul>
                </li>
              </ul>
            </div>
            {/* popup: end */}
          </div>
          { hasFlats  && <div className="search-container__filters-item search-container__filters-item--second">
            <button className={`search-container__filters-item-btn ${isAmountApartmentDropDownShowed? "active" : ""}`} 
            onClick={()=>setAmountApartmentShowed(!isAmountApartmentDropDownShowed)}
            >{getRoomOfferTitle(searchRoomAmountVariants, currentSearchRoomAmountVariants)}</button>
            {/* TODO: добавить popup по фильтрации комнат */}
            <div className={`search-container__filters-item-room-dropdown ${ isAmountApartmentDropDownShowed ? "show" : ""}`}>
                  <ul className="search-container__filters-list">
                    {
                      searchRoomAmountVariants.map(amount=>{
                        const isSelected = currentSearchRoomAmountVariants.find(item=>item.id === amount.id);
                        return (<li key={amount.id}>
                          <button onClick={()=>toggleRoomAmount(amount.id)} className={`search-container__filters-list-btn  ${isSelected ? 'active':''}`}>{amount.showValue}</button>
                          </li>)
                      })
                    }
                  </ul> 
            </div>
            </div>}
          {/* цена  квартиры диапозон*/}
          <div className="search-container__filters-item search-container__filters-item--second">
            <button className={`search-container__filters-item-btn ${isPriceDropDownShowed?"active":""}`} onClick={()=>setPriceDropDownShow(!isPriceDropDownShowed)}>Цена</button>
            {/* popup */}
            <div className={`search-container__price-dropdown ${isPriceDropDownShowed? 'show' :''}`}>
              <span className="search-container__input-wrapper">
                <input placeholder="от" 
                value={fromPrice}
                onChange={(e)=>{
                  setPriceRange((prevState)=>{
                    return {
                      ...prevState,
                      fromPrice: e.target.value
                    }
                  });
                }}
                className="search-container__input-price"/>
                <span className="search-container__input-rub">₽</span>
              </span>
              <span className="search-container__input-wrapper">
                <input placeholder="до" className="search-container__input-price"
                value={toPrice}
                onChange={(e)=>{
                  setPriceRange((prevState)=>{
                    return {
                      ...prevState,
                      toPrice:e.target.value
                    }
                  });
                }}
                />
                <span className="search-container__input-rub">₽</span>
              </span>
            </div>
          </div>
          {/* если выбрана квартира добавляется таб с количеством комнат 1,2,3,4,5,6+ */}
          {/* <div className="search-container__filters-item"></div> */}
          {/* гео, поиск по похожим названиям */}
          <div className="search-container__input-wrapper">
            <input className="search-container__filters-input"
              placeholder="Город, адрес, метро, район, ж/д, шоссе или ЖК" />
          </div>
        </div>

        <div className="search-container__find-btns">
          <span className="search-container__find-btns-item">
            <Link to={`search/?${searchLink}`} className="search-container__find-btn">Найти</Link>
          </span>
        </div>
      </div>
    </div>

  </section>)
}

