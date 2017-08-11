import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import App from './App';

const api_uri = 'http://stephsun.com';
const Promise = require('bluebird');
Promise.config({ longStackTraces: true, warnings: true });

const search_terms = { simple: 'unicorns', symbols: 'handmaid\'s+tale+&+hulu' };
const app_blank = <App searchTerm={''} apiURI={api_uri} />;
const app_simple = <App searchTerm={search_terms.simple} apiURI={api_uri} />;
const app_symbols = <App searchTerm={search_terms.symbols} apiURI={api_uri} />;
const items = [{ link: 'http://stephsun.com/image.png', title: 'Image title', image: { height: 100, width: 200 } },
               { link: 'http://stephsun.com/image2.png', title: 'Image 2 title', image: { height: 200, width: 100 } }];
const images = items.map((item, index) => {
  return { key: index, src: item.link, title: item.title, landscape: item.image.width > item.image.height };
});
const error_msg = (
                    <div id="errors">
                      We&rsquo;re sorry, images can not be loaded right now. Please wait and try again.
                    </div>
                  );

describe('App template tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(app_blank, div);
  });

  it('renders search form', () => {
    const testApp = shallow(app_blank);
    const searchForm = <input type="text" name="searchTerm" />;
    expect(testApp.contains(searchForm)).toEqual(true);
  });

  it('auto-filled searchTerm renders legibly in h3 header', () => {
    const testApp = shallow(app_symbols);
    const h3_symbols = <h3>&ldquo;{search_terms.symbols}&rdquo;</h3>;
    expect(testApp.contains(h3_symbols)).toBe(true);
  });

  it('blank searchTerm hides h3 header', () => {
    const testApp = shallow(app_blank);
    const h3_blank = <h3>&ldquo;{''}&rdquo;</h3>;
    expect(testApp.contains(h3_blank)).toBe(false);
  });

  it('.lightboxVisible toggles Lightbox', () => {
    const testApp = mount(app_blank);
    expect(testApp.find('#lightbox')).toHaveLength(0);

    testApp.setState({ images: images, currentImageIndex: 0, lightboxVisible: true });
    expect(testApp.find('#lightbox')).toHaveLength(1);
  });

  it('.moreImagesBtnVisible toggles More Images button', () => {
    const testApp = mount(app_blank);
    expect(testApp.find('#more-images')).toHaveLength(0);

    testApp.setState({ moreImagesBtnVisible: true });
    expect(testApp.find('#more-images')).toHaveLength(1);
  });

  it('.errorMessageVisible toggles error message', () => {
    const testApp = mount(app_blank);
    expect(testApp.contains(error_msg)).toBe(false);

    testApp.setState({ errorMessageVisible: true });
    expect(testApp.contains(error_msg)).toBe(true);
  });

  it('.currentImageLarge toggles fit-on-screen class on Lightbox', () => {
    const testApp = mount(app_blank);
    testApp.setState({ images: images, currentImageIndex: 0, lightboxVisible: true });
    expect(testApp.find('#lightbox.fit-on-screen')).toHaveLength(0);

    testApp.setState({ currentImageLarge: true });
    expect(testApp.find('#lightbox.fit-on-screen')).toHaveLength(1);
  });
});

describe('App unit tests', () => {
  it('#hasSearchTerm returns true if searchTerm is string and not empty', () => {
    let testApp = mount(app_blank);
    expect(testApp.instance().hasSearchTerm()).toBe(false);

    testApp = mount(app_simple);
    expect(testApp.instance().hasSearchTerm()).toBe(true);
  });

  it('#hasMoreImages returns true if startIndex is greater than images length', () => {
    const testApp = mount(app_blank);
    expect(testApp.instance().hasMoreImages()).toBe(true);

    testApp.setState({ images: images });
    expect(testApp.instance().hasMoreImages()).toBe(false);
  });

  it('#showErrorMessage displays error message', () => {
    const testApp = mount(app_blank);
    expect(testApp.contains(error_msg)).toBe(false);

    testApp.instance().showErrorMessage();
    expect(testApp.contains(error_msg)).toBe(true);
  });

  it('#addImagesAndUpdateState adds images to state and DOM', () => {
    const testApp = mount(app_blank);
    testApp.instance().addImagesAndUpdateState(items);

    let thumbnail_imgs = images.map(image => {
      return (<img
                src={image.src}
                alt={image.title}
                className={image.landscape && 'landscape'}
              />
             );
    });

    expect(testApp.contains(thumbnail_imgs[0])).toBe(true);
    expect(testApp.contains(thumbnail_imgs[1])).toBe(true);
    expect(testApp.find('.thumbnail')).toHaveLength(2);
  });

  it('#search triggers search', () => {
    const testApp = mount(app_simple);
    testApp.setState({ searching: false });
    expect(testApp.state().searching).toBe(false);

    testApp.instance().search();
    expect(testApp.state().searching).toBe(true);
  });

  it('#shrinkLargeImage returns boolean', () => {
    const testApp = mount(app_blank);
    testApp.setState({ images: images, currentImageIndex: 0, currentImageLarge: true });
    testApp.instance().shrinkLargeImage();
    expect(testApp.state().currentImageLarge).toBe(false);
  });

  it('#viewInLightbox changes currentImageIndex and sets lightboxVisible to true', () => {
    const testApp = mount(app_blank);
    testApp.setState({ images: images, currentImageIndex: 1 });
    testApp.instance().viewInLightbox(0);
    expect(testApp.state().currentImageIndex).toBe(0);
    expect(testApp.state().lightboxVisible).toBe(true);
  });

  it('#openLightbox and #closeLightbox open and close Lightbox', () => {
    const testApp = mount(app_blank);
    testApp.setState({ images: images });
    testApp.instance().openLightbox(images[1]);
    expect(testApp.state().lightboxVisible).toBe(true);
    expect(testApp.state().currentImageIndex).toBe(1);

    testApp.instance().closeLightbox();
    expect(testApp.state().lightboxVisible).toBe(false);
  });

  it('#viewPreviousImage and #viewNextImage change currentImageIndex', () => {
    const testApp = mount(app_blank);
    testApp.setState({ images: images, currentImageIndex: 1 });
    testApp.instance().viewPreviousImage();
    expect(testApp.state().currentImageIndex).toBe(0);

    testApp.instance().viewNextImage();
    expect(testApp.state().currentImageIndex).toBe(1);
  });
});

describe('App integration tests', () => {
  it('blank searchTerm stores blank string, does not trigger search', () => {
    const testApp = mount(app_blank);
    expect(testApp.props().searchTerm).toBe('');
    expect(testApp.instance().hasSearchTerm()).toBe(false);
    expect(testApp.state().searching).toBe(false);
  });

  it('present searchTerm stores term, triggers search', () => {
    const testApp = mount(app_simple);
    expect(testApp.props().searchTerm).toBe(search_terms.simple);
    expect(testApp.instance().hasSearchTerm()).toBe(true);
    expect(testApp.state().searching).toBe(true);
  });

  it('clicking More Images button triggers search', () => {
    const testApp = mount(app_simple);
    testApp.setState({ moreImagesBtnVisible: true, searching: false });
    expect(testApp.state().searching).toBe(false);

    testApp.find('#more-images').simulate('click');
    expect(testApp.state().searching).toBe(true);
  });
});
