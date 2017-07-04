import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

var urlParams = new URLSearchParams(window.location.search);
var searchTerm = urlParams.get("searchTerm") || "space cats";

ReactDOM.render(
  <App searchTerm={searchTerm} />,
  document.getElementById('root')
);
