import styled from 'styled-components';
import React from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import { Header } from './components/Header';
import { OrderListComponent } from "./components/OrderListComponent";
import { OrderDetailComponent} from './components/OrderDetailComponent';
import { ApartmentListComponent} from './components/ApartmentListComponent';
import { ApartmentEditComponent} from './components/ApartmentEditComponent/ApartmentEditComponent';
import { CharBoardComponent} from './components/CharBoardComponent';
import { TestInterceptorComponent } from './components/TestInterceptorComponent';
import { TestVerstkaComponent } from './components/TestVerstkaComponent';
import { ApartmentTableComponent } from './components/ApartmentTableComponent';
import { ApartmentShowComponent } from './components/ApartmentShowComponent/ApartmentShowComponent';
import { HomePageComponent } from './components/HomePageComponent/HomePageComponent';
import { CardComponent } from './components/Card/CardComponent';
import { ApartmentSearchComponent } from './components/ApartmentSearchComponent/ApartmentSearchComponent';

const MainWrapper = styled.div`
  width: 100%;
  height: 100vh;
`;
export function App() {
  
  return (
    <Router>
    <MainWrapper >
      <Header/>
      <Switch>
        <Route path="/" exact={true}>
        <HomePageComponent/>
        </Route>
        <Route path="/search">
          
          <ApartmentSearchComponent/>
        </Route>
        <Route path="/apartments/show/:apartmentId" exact={true}>
          <ApartmentShowComponent/>
        </Route>
        <Route path="/test-verstka">
        <TestVerstkaComponent/>
        </Route>
        <Route path="/test-interceptors" exact={true}>
          <TestInterceptorComponent/>
        </Route>
      <Route path="/orders" exact={true}>
      <OrderListComponent/>
      </Route>
      <Route path='/orders/:id' exact={true}>
        <OrderDetailComponent/>
      </Route>
      <Route path='/apartments' exact={true}>
        <ApartmentTableComponent />
      </Route>
      <Route  path='/chars-panel' exact={true}>
        <CharBoardComponent />
      </Route>
      <Route path='/apartments/edit/:apartmentId' exact={true}>
        <ApartmentEditComponent />
      </Route>
      </Switch>
    </MainWrapper>
    </Router>
  );
}

