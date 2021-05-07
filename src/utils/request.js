import axios from 'axios';

/**
 * Get the HTML in a string of an url.
 * @param {String} websiteUrl
 * @returns String of the HTML.
 */
export default async function getHTML(websiteUrl) {
  // This will validate the website url
  // If not valid, it will throw
  const url = new URL(websiteUrl);

  const result = await axios.get(url.href);

  return result.data;
}
