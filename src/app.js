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
    // oooh! something different in the HTML!    
    const diff = compare(previousValue, currentValue);
    // return diff
    return {
      diff,
      currentLength: currentValue.length,
      previousLength: previousValue.length
    }
  }

  // no change
  return false;
}
