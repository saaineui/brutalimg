import React from 'react';
import ReactDOM from 'react-dom';
import Thumbnail from './Thumbnail';

it('renders without crashing', () => {
  const div = document.createElement('div');
  let empty_func = () => true;
  ReactDOM.render(
    <Thumbnail
      image={{ src: 'string', title: 'string' }}
      openLightbox={empty_func}
    />,
    div
  );
});
