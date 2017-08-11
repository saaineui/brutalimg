export function ajaxGetAsync(Promise, url) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('error', () => reject(new Error('Could not connect to ' + url + '.')));
    xhr.addEventListener('load', resolve);
    xhr.open('GET', url);
    xhr.send(null);
  });
}

export function buildQueryParams() {
  let query_params = ['searchType=image'];
  query_params.push('key=' + process.env.REACT_APP_GCSE_KEY);
  query_params.push('cx=' + process.env.REACT_APP_GCSE_CX);
  return query_params;
}

export function findInQueryString(window_location, lookup_key) {
  const query = window_location.search.substring(1); // remove question mark
  const pairs = query.split('&');
  for (let pair of pairs) {
    pair = pair.split('=');
    if (pair[0] === lookup_key) { return pair[1]; }
  }
  return false;
}

export function largerThanWindow(img) {
  return (img.naturalHeight > window.innerHeight) || (img.naturalWidth > window.innerWidth);
}

export function updateStartIndex(search_results) {
  // looks for signs that we can continue to query the GCSE json
  return search_results.hasOwnProperty('queries') &&
         search_results.queries.hasOwnProperty('nextPage') &&
         search_results.queries.nextPage.length > 0 &&
         search_results.queries.nextPage[0].hasOwnProperty('startIndex');
}
