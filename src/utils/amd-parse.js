import * as htmlParser from 'node-html-parser';

/**
 * Parse the HTML.
 * @param {String} html
 * @returns HTMLElement
 */
function parseHTML(html) {
  return htmlParser.default.parse(html);
}

/**
 * Query data in the HTML.
 * @param {String} html
 * @param {String} selector
 * @returns
 */
function queryHTML(html, selector) {
  const dom = parseHTML(html);
  return dom.querySelectorAll(selector);
}

export default function getProductIds(html) {
  const query = queryHTML(html, '.shop-image-link');
  console.log(query);

  return [{
    id: 1,
    name: '6900XT',
  }];
}
