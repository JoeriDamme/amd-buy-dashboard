import config from 'config'
import { getHTML } from './utils/request.js'
import { Storage } from './utils/storage.js'
import { compare } from './utils/compare.js'

export async function run() {
  // get raw html
  const currentValue = await getHTML(config.get('url'))

  // get result from previous run from storage
  const storage = new Storage()
  const previousValue = storage.getLastValueInArray('website')

  // append new value to storage
  storage.append('website', currentValue)

  if (!previousValue) {
    // no previous data, so continue to next interval
    return;
  }

  // compare values
  if (currentValue !== previousValue) {
    // oooh! something different
    console.log('DIFFERENCE!');
    console.log({
      currentLength: currentValue.length,
      previousLength: previousValue.length,
    });
    
    const diff = compare(previousValue, currentValue);

    // return change
    return diff;
  }

  // no change
  return false;
}
