import config from 'config';
import * as htmlParser from 'node-html-parser';
import getHTML from './request';

const catUrl = config.get('catUrl');

/**
 * Get the response of the CAT website.
 * @param {Array} productIds
 * @returns {Promise<Array>}
 */
async function getHTMLCatWebsite(productIds) {
  const requests = productIds.map((id) => {
    // create URL object
    const url = new URL(catUrl);
    // append the product Id
    url.searchParams.append('ProductID', id);
    const requestUrl = url.toString();
    return getHTML(requestUrl);
  });

  return Promise.allSettled(requests);
}

/**
 * Get ProductID from url.
 * @param {String} requestUrl
 * @returns
 */
function getProductIdFromUrl(requestUrl) {
  const url = new URL(requestUrl);
  return url.searchParams.get('ProductID');
}

/**
 * Get the CAT code from the response data from the CAT website.
 * @param {String} responseData
 * @returns {String} 'CAT_000016'
 */
function getCatCodeFromHTML(responseData) {
  const dom = htmlParser.default.parse(responseData);
  const errorNodeText = dom.querySelector('.dr_error').querySelectorAll('p')[2].innerText;
  return errorNodeText.replace('Error Number:&nbsp;&nbsp;', '');
}

/**
 * Get the CAT messages from http://store.digitalriver.com/
 * @param {Array} productIds ['5335621300', '5458372800', ...]
 * @returns
 */
export default async function getCatErrors(productIds) {
  // all the promises will be rejected, because it will return
  // a HTTP status code 404, but it will return the CAT code!
  // We are using the getHTML method, but it doesn't return the HTML because of this 404.
  // We need to get the CAT code from the data that is returned.
  const promiseResults = await getHTMLCatWebsite(productIds);

  return promiseResults.map((promiseResult) => {
    const { reason } = promiseResult;
    // get the product id again...this should be easier some how right?
    const id = getProductIdFromUrl(reason.config.url);
    const catCode = getCatCodeFromHTML(reason.response.data);
    return {
      id,
      catCode,
    };
  });
}
