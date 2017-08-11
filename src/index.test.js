import { Utils } from './utils';

test('#getQueryVariable parses URL params and returns value for matched key', () => {
  const variable = 'searchTerm';
  let window_location = { search: '' };
  expect(Utils.getQueryVariable(window_location, variable)).toBe(false);

  window_location.search = '?searchTerm=handmaid%27s+tale';
  expect(Utils.getQueryVariable(window_location, variable)).toBe('handmaid%27s+tale');
});
