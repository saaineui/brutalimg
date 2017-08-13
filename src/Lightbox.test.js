import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import Lightbox from './Lightbox';

let empty_func = () => true;
const lightbox_tag = (func) => (<Lightbox
                                  currentImageLarge
                                  image={{ src: 'string', title: 'string' }}
                                  hasNextImage={func()}
                                  hasPreviousImage={func()}
                                  viewNextImage={func}
                                  viewPreviousImage={func}
                                  closeLightbox={func}
                                />
                               );

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(lightbox_tag(empty_func), div);
});

it('clicking title box toggles its visibility', () => {
  const testLightbox = mount(lightbox_tag(empty_func));
  expect(testLightbox.state().titleVisible).toBe(false);

  testLightbox.find('#image-title').simulate('click');
  expect(testLightbox.state().titleVisible).toBe(true);

  testLightbox.find('#image-title').simulate('click');
  expect(testLightbox.state().titleVisible).toBe(false);
});

it('.hasNextImage and .hasPreviousImage toggle navigation buttons', () => {
  let testLightbox = mount(lightbox_tag(empty_func));
  expect(testLightbox.find('#prev .lightbox-icon')).toHaveLength(1);
  expect(testLightbox.find('#next .lightbox-icon')).toHaveLength(1);

  empty_func = () => false;
  testLightbox = mount(lightbox_tag(empty_func));
  expect(testLightbox.find('#prev .lightbox-icon')).toHaveLength(0);
  expect(testLightbox.find('#next .lightbox-icon')).toHaveLength(0);
});

