import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import App, { build_query_params, is_larger_than_window, ajaxGetAsync } from './App';

const GCSE_URI = 'http://stephsun.com';
const query_params = build_query_params();

const search_terms = { simple: 'unicorns', symbols: 'handmaid\'s+tale+&+hulu' };

const app_blank = <App searchTerm="" />;
const app_simple = <App searchTerm={search_terms.simple} />;
const app_symbols = <App searchTerm={search_terms.symbols} />;

const sample_image = { key: 1, image: 'http://stephsun.com/image.png', title: 'Image title', landscape: true };

test('#build_query_params returns an array of length 3', () => {
  expect(query_params).toHaveLength(3);
});

test('#is_larger_than_window returns a boolean', () => {
  let image = { naturalHeight: 200, naturalWidth: 200 };
  expect(is_larger_than_window(image)).toBe(false);
});

test('#ajaxGetAsync returns a Promise', () => {
  let query_params_with_search = query_params;
  query_params_with_search.push('q=unicorns');
  query_params_with_search.push('start=1');
  let promise = ajaxGetAsync(GCSE_URI + '?' + query_params_with_search.join('&'));

  expect(promise.isFulfilled()).toBe(false);
  expect(promise.isRejected()).toBe(false);
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(app_blank, div);
});

it('renders search form', () => {
  const testApp = shallow(app_blank);
  const searchForm = (<form className="search-form" method="get">
            <label htmlFor="searchTerm">
                Search for images related to:
                <input type="text" name="searchTerm" />
                <input type="submit" value="Search" className="btn" />
            </label>
        </form>);
  expect(testApp.contains(searchForm)).toEqual(true);
});

it('auto-filled searchTerm renders legibly in header', () => {
  let testApp = shallow(app_simple);
  const h3_plain = <h3>&ldquo;{search_terms.simple}&rdquo;</h3>;
  expect(testApp.contains(h3_plain)).toBe(true);

  testApp = shallow(app_symbols);
  const h3_symbols = <h3>&ldquo;{search_terms.symbols}&rdquo;</h3>;
  expect(testApp.contains(h3_symbols)).toBe(true);
});

it('blank searchTerm does not trigger searching', () => {
  const testApp = mount(app_blank);
  expect(testApp.state().searching).toBe(false);
});

it('auto-filled searchTerm triggers searching', () => {
  const testApp = mount(app_simple);
  expect(testApp.state().searching).toBe(true);
});

it('clicking More Images button triggers searching', () => {
  const testApp = mount(app_simple);
  testApp.setState({ moreImagesBtnVisible: true, searching: false });
  expect(testApp.state().searching).toBe(false);

  testApp.find('#more-images').simulate('click');
  expect(testApp.state().searching).toBe(true);
});

it('thumbnail reflects image data in state', () => {
  const testApp = mount(app_blank);
  testApp.setState({images: [sample_image]});

  const thumbnail_img = (<img
                            src={sample_image.image}
                            alt={sample_image.title}
                            className="landscape"
                         />
                        );
  expect(testApp.contains(thumbnail_img)).toBe(true);
  expect(testApp.find('.thumbnail')).toHaveLength(1);
});

