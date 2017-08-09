import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if(pair[0] === variable){return pair[1];}
    }
    return(false);
  }

var searchTerm = getQueryVariable('searchTerm') || '';

ReactDOM.render(
  <App searchTerm={searchTerm} />,
  document.getElementById('root')
);
