import * as utils from './utils';

const Promise = require('bluebird');
Promise.config({ longStackTraces: true, warnings: true });

const api_uri = 'http://stephsun.com';

describe('utils module', () => {
  test('#ajaxGetAsync returns a Promise', () => {
    let query_params = utils.buildQueryParams();
    query_params.push('q=unicorns');
    query_params.push('start=1');
    let promise = utils.ajaxGetAsync(Promise, api_uri + '?' + query_params.join('&'));

    expect(promise.isFulfilled()).toBe(false);
    expect(promise.isRejected()).toBe(false);
  });

  test('#buildQueryParams returns an array of length 3', () => {
    expect(utils.buildQueryParams()).toHaveLength(3);
  });

  test('#findInQueryString parses URL params and returns value for matched key', () => {
    const lookup_key = 'searchTerm';
    let window_location = { search: '' };
    expect(utils.findInQueryString(window_location, lookup_key)).toBe(false);

    window_location.search = '?searchTerm=handmaid%27s+tale&start=11';
    expect(utils.findInQueryString(window_location, lookup_key)).toBe('handmaid%27s+tale');
  });

  test('#largerThanWindow returns a boolean', () => {
    let image = { naturalHeight: 200, naturalWidth: 200 };
    expect(utils.largerThanWindow(image)).toBe(false);
  });

  test('#updateStartIndex returns a boolean', () => {
    expect(utils.updateStartIndex({})).toBe(false);

    const search_results = { queries: { nextPage: [{ startIndex: 11 }] } };
    expect(utils.updateStartIndex(search_results)).toBe(true);
  });
});
