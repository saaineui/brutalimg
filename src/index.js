import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Utils } from './utils';
import './index.css';

var searchTerm = Utils.getQueryVariable(window.location, 'searchTerm') || '';

ReactDOM.render(
  <App searchTerm={decodeURI(searchTerm)} />,
  document.getElementById('root')
);
