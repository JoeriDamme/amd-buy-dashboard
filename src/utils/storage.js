import { LocalStorage } from 'node-localstorage'
import config from 'config'

export class Storage {

  constructor() {
    // storage is set in bytes.
    // 1 Mb = 1.000.000 bytes.
    this.storage = new LocalStorage('./storage', config.get('storageQuota') * 1000000);
  }

  /**
   * Append data to  storage key.
   * Data will be converted to array.
   * @param {String} key 
   * @param {String} value 
   */
  append(key, value) {
    const currentData = this.get(key);

    // if key value is currently not an array, make it
    const newData = !Array.isArray(currentData) ? [value] : currentData.push(value) && currentData;

    this.set(key, newData);
  }

  /**
   * Get key from storage
   * @param {String} key 
   * @returns {any}
   */
  get(key) {
    return JSON.parse(this.storage.getItem(key))
  }

  /**
   * Set value in storage. Data will be JSON stringified.
   * @param {String} key 
   * @param {any} value 
   */
  set(key, value) {
    this.storage.setItem(key, JSON.stringify(value))
  }

  /**
   * Get length of key in storage if data is array.
   * @param {String} key 
   * @returns 
   */
  getLength(key) {
    const data = this.get(key);

    // check if array
    Storage.isArray(data);

    return data.length;
  }

  /**
   * Get data from array in storage on specfic key in array.
   * @param {String} key 
   * @param {Number} arrayKey 
   * @returns 
   */
  getIndexFromArray(key, arrayKey) {
    const data = this.get(key)

    // check if array
    Storage.isArray(data)

    return data[arrayKey]
  }

  /**
   * Get last value of array of storage key.
   * Will return false if length is 0.
   * @param {String} key 
   * @returns 
   */
  getLastValueInArray(key) {
    const data = this.get(key)

    if (!data) {
      // no data yet on this key
      return false;
    }

    Storage.isArray(data)

    const length = data.length;

    if (!length) {
      return false;
    }

    return data[length - 1]
  }

  /**
   * Validate if data in storage is array.
   * @param {any} data 
   */
  static isArray(data) {
    if (!Array.isArray(data)) {
      throw new Error(`Can not get length of data, because it is not an Array. `);
    }
  }

  /**
   * Makes of an URL a 'flatten' string, so it can be used as 'unique' storage key name
   * @param {String} websiteUrl e.g. https://www.amd.com/en/direct-buy/nl
   * @returns {String} wwwamdcomendirectbuynl
   */
  static getStorageKeyFromUrl(websiteUrl) {
    const url = new URL(websiteUrl)
    const summary = `${url.hostname}${url.pathname.split('/').join('')}`
    const replace = summary.replace(/-|\./g, '')
    return replace
  }
}