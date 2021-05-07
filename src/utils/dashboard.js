import blessed from 'blessed'
import contrib from 'blessed-contrib'
import chalk from 'chalk'
import config from 'config'

export class Dashboard {
  /**
   * Setup the dashboard.
   * @param {Number} refreshTime The time inbetween to scrape the AMD website.
   */
  constructor(refreshTime) {
    this.refreshTime = refreshTime;

    this.screen = blessed.screen({
      title: 'AMD Buy Dashboard'
    })

    this.grid = new contrib.grid({
      rows: 12,
      cols: 12,
      screen: this.screen
    })

    this.boxDiff = this.grid.set(0, 3, 10, 9, blessed.box, {
      content: '',
      label: 'Last diff'
    })

    this.boxError = this.grid.set(10, 3, 1, 9, blessed.box, {
      content: '',
      label: 'Errors'
    })

    this.boxInfo = this.grid.set(11, 3, 1, 9, blessed.box, {
      label: 'Config',
      content: chalk.blue(`Refresh Time: ${config.get('refreshTime')} seconds, Website: ${config.get('url')}`),
    })

    this.gauge = this.grid.set(0, 0, 2, 3, contrib.gauge, {
      label: 'Timer',
      percent: [100]
    })

    this.log = this.grid.set(2, 0, 10, 3, contrib.log, {
      fg: 'green',
      label: 'Log',
    })

    this.screen.key(['escape', 'q', 'C-c'], () => {
      return process.exit(0)
    })

    this.screen.on('resize', () => {
      this.log.emit('attach')
      this.gauge.emit('attach')
      this.boxDiff.emit('attach')
      this.boxError.emit('attach')
      this.boxInfo.emit('attach')
    })
  }

  /**
   * Get percentage of time left for retry of getting website.
   * @param {Number} leftInSeconds
   * @returns 
   */
  setTimerPercentage(leftInSeconds) {
    const percentage = Math.ceil(leftInSeconds / this.refreshTime * 100)
    this.gauge.setData([percentage])
  }

  /**
   * Add log line to logger.
   * @param {String} date 
   * @param {Object} messageObj
   *  messageObj.error {Boolean}: will mark the message as an error
   *  messageObj.important {Boolean}: will mark the message
   *  messageObj.message {String}: message to display
   */
  addLogLine(date, messageObj) {
    const timeStr = this.formateTime(date)
    const { important, error, message } = messageObj
    let str;
    if (error) {
      str = chalk.bgRed.white(message)
    } else if (important) {
      str = chalk.bgGreen.white(message)
    } else {
      str = chalk.grey(message)
    }

    this.log.log(`${chalk.bgWhite.black(`${timeStr}:`)} ${str}`)
  }

  /**
   * Render the dashboard.
   */
  render() {
    this.screen.render()
  }

  /**
   * Set error message.
   * @param {Date} date 
   * @param {String} message 
   */
  setError(date, message) {
    const timeStr = this.formateTime(date)
    this.boxError.setContent(`${chalk.bgWhite.black(`${timeStr}:`)} ${chalk.red(message)}`)
  }

  /**
   * Clear error box
   */
  clearError() {
    this.boxError.setContent('')
  }

  /**
   * Format time accroding to config
   * @todo make config item, currently it's using toLocaleString()
   * @param {Data} date 
   * @returns 
   */
  formateTime(date) {
    return date.toLocaleString()
  }

  /**
   * Dispay diff in box
   * @param {Data} date 
   * @param {String} diff 
   */
  setDiff(date, diff) {
    this.boxDiff.setContent(diff)
  }

  /**
   * Destroy the screen, clear the terminal.
   */
  clear() {
    this.screen.destroy()
  }
}