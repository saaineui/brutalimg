import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import Lightbox from './Lightbox';

let empty_func = () => true;
const lightbox_tag = (<Lightbox
                        currentImageLarge
                        image={{ src: 'string', title: 'string' }}
                        hasNextImage
                        hasPreviousImage={false}
                        viewNextImage={empty_func}
                        viewPreviousImage={empty_func}
                        closeLightbox={empty_func}
                      />
                     );

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(lightbox_tag, div);
});

it('clicking title box toggles its visibility', () => {
  const testLightbox = mount(lightbox_tag);
  expect(testLightbox.state().titleVisible).toBe(false);

  testLightbox.find('#image-title').simulate('click');
  expect(testLightbox.state().titleVisible).toBe(true);

  testLightbox.find('#image-title').simulate('click');
  expect(testLightbox.state().titleVisible).toBe(false);
});
