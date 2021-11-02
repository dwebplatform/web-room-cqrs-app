import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { orderDetailReducer } from "../reducers/currentOrderReducer";
import { orderReducer } from './../reducers/orderReducer';
import { apartmentReducer } from './../reducers/currentApartmentReducer';
import { charEditReducer } from "../reducers/charEditReducer";


const rootReducer = combineReducers({
  orders: orderReducer,
  charEdit: charEditReducer,
  orderDetail: orderDetailReducer,
  apartmentDetail: apartmentReducer
});
export type RootState = ReturnType<typeof rootReducer>

// create slice for getting jsonplaceholder
export function createStore(){
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck:false,
    }),
  });

  return store;
}