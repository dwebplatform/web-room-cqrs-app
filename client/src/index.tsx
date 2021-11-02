import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {App} from './App';
import { createStore } from './store/index';
import './index.scss';
const AppWrapper=()=>(<Provider store={createStore()}><App /></Provider>);

ReactDOM.render(
  <AppWrapper/>,
  document.getElementById('root')
);

