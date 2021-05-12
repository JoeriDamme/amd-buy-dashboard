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

/**
 * Extract numbers from a string.
 * @param {String} str
 * @returns '5458372800'
 */
function getNumbersFromString(str) {
  return str.replace(/\D/g, '');
}

/**
 * Get the href from an HTMLElement and extract the numbers from '/en/direct-buy/5458372800/us'
 * @param {HTMLElement} htmlElement
 * @returns {String} '5458372800'
 */
function getProductIdFromHTML(htmlElement) {
  // the href will look like '/en/direct-buy/5458372800/us'
  const href = htmlElement.getAttribute('href');
  // extract numbers and return result
  return getNumbersFromString(href);
}

/**
 * Get the span element and extracts the product name
 * @param {HTMLElement} htmlElement
 * @returns AMD Radeon™ RX 6900 XT Graphics
 */
function getNameFromHTML(htmlElement) {
  const span = htmlElement.querySelector('span');
  const text = span.innerText.trim();
  return text.replace('View details for ', '');
}

/**
 * Get all the product names and ids from the Buy from AMD website (https://www.amd.com/en/direct-buy)
 * @param {String} html The HTML string of the Buy from AMD website.
 * @returns {Array} [{ name: 'x',  id: '123'}, ...]
 */
export default function getProducts(html) {
  const queryResults = queryHTML(html, '.shop-image-link');

  if (!queryResults.length) {
    return [];
  }

  const products = queryResults.map((element) => {
    const id = getProductIdFromHTML(element);
    const name = getNameFromHTML(element);

    return {
      id,
      name,
    };
  });

  return products;
}
