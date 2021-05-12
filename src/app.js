import config from 'config';
import getHTML from './utils/request';
import Storage from './utils/storage';
import compare from './utils/compare';
import getProducts from './utils/amd-parse';
import getCatErrors from './utils/cat-checker';

const websiteUrl = config.get('url');

export default async function run() {
  // generate storage name
  const storageKey = Storage.getStorageKeyFromUrl(websiteUrl);

  // get raw html
  const currentValue = await getHTML(websiteUrl);

  // get result from previous run from storage
  const storage = new Storage();
  const previousValue = storage.getLastValueInArray(storageKey);

  // append new value to storage
  storage.append(storageKey, currentValue);

  const products = getProducts(currentValue);

  const catErrors = await getCatErrors(products.map((product) => product.id));

  // Join the cat code and product name
  const catProducts = catErrors.map((cat) => {
    const product = products.find((p) => p.id === cat.id);

    return {
      id: product.id,
      name: product.name,
      catCode: cat.catCode,
    };
  });

  if (!previousValue) {
    // no previous data, so continue to next interval
    return {};
  }

  let result = {};

  // compare values
  if (currentValue !== previousValue) {
    // oooh! something different in the HTML!
    const diff = compare(previousValue, currentValue);
    // return diff
    result = {
      diff,
      currentLength: currentValue.length,
      previousLength: previousValue.length,
      catProducts,
    };
  }

  // no change
  return result;
}
