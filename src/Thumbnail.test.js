import React from 'react';
import ReactDOM from 'react-dom';
import Thumbnail from './Thumbnail';
import { mount } from 'enzyme';

const empty_func = jest.fn();
const thumb = (<Thumbnail
                image={{ src: 'string', title: 'string' }}
                openLightbox={empty_func}
               />
              );

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    thumb,
    div
  );
});

it('clicking thumbnail calls openLightbox', () => {
  const testThumbnail = mount(thumb);
  testThumbnail.simulate('click');
  expect(empty_func).toHaveBeenCalledTimes(1);
});
