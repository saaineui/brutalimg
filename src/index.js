import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as utils from './utils';
import './index.css';

var searchTerm = utils.findInQueryString(window.location, 'searchTerm') || '';

ReactDOM.render(
  <App
    searchTerm={decodeURI(searchTerm)}
    apiURI='https://www.googleapis.com/customsearch/v1'
  />,
  document.getElementById('root')
);
