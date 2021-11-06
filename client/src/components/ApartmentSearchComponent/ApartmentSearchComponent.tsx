import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { GetSearchApartmentsAction } from "../../actions/showSearchedApartmentAction";
import { RootState } from "../../store";
import { CardComponent } from "../Card/CardComponent";
import { useLocation } from 'react-router-dom'


export const ApartmentSearchComponent = () => {

  // fetch all apartments:
  //
  const { search } = useLocation();
  // console.log("LOCATION",search);
  const dispatch = useDispatch();
  const { apartments } = useSelector((state: RootState) => state.showSearchedApartment);
  useEffect(() => {
    dispatch(GetSearchApartmentsAction(search));
  }, [dispatch, search]);
  // квартира в новостройке:
  // APARTMENT_IN_NEW_BUILDING="APARTMENT_IN_NEW_BUILDING",
  // квартира во вторичке:
  // APARTMENT_IN_SECONDARY="APARTMENT_IN_SECONDARY",

  return (
    <div>
      {apartments.map((apartment) => {
        return (<CardComponent key={apartment.id} {...apartment} />)
      })}
    </div>);
}