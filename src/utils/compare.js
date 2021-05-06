import diff from 'cli-diff'

/**
 * Get the difference between two string.
 * @param {String} oldValue 
 * @param {String} newValue 
 * @returns CLI output of the differene between the two string.
 */
export function compare(oldValue, newValue) {
  return diff.default({
    name: 'old',
    content: oldValue,
  }, {
    name: 'new',
    content: newValue,
  })
}