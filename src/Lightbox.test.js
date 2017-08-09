import React from 'react';
import ReactDOM from 'react-dom';
import Lightbox from './Lightbox';

it('renders without crashing', () => {
  const div = document.createElement('div');
  let empty_func = () => true;
  ReactDOM.render(
    <Lightbox
      currentImageLarge
      image={{ src: 'string', title: 'string' }}
      hasNextImage
      hasPreviousImage={false}
      viewNextImage={empty_func}
      viewPreviousImage={empty_func}
      closeLightbox={empty_func}
    />,
    div
  );
});
