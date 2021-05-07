import config from 'config'
import { getHTML } from './utils/request.js'
import { Storage } from './utils/storage.js'
import { compare } from './utils/compare.js'

const websiteUrl = config.get('url');

export async function run() {
  // generate storage name
  const storageKey = Storage.getStorageKeyFromUrl(websiteUrl)

  // get raw html
  const currentValue = await getHTML(websiteUrl)

  // get result from previous run from storage
  const storage = new Storage()
  const previousValue = storage.getLastValueInArray(storageKey)

  // append new value to storage
  storage.append(storageKey, currentValue)

  if (!previousValue) {
    // no previous data, so continue to next interval
    return;
  }

  // compare values
  if (currentValue !== previousValue) {
    // oooh! something different in the HTML!    
    const diff = compare(previousValue, currentValue)
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
