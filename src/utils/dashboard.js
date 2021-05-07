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
    });

    this.screen.on('resize', () => {
      this.log('attach')
      this.gauge.emit('attach')
    });

    this.boxDiff = this.grid.set(0, 3, 11, 9, blessed.box, {
      content: 'x',
      label: 'Last diff'
    })

    this.boxInfo = this.grid.set(11, 3, 1, 9, blessed.box, {
      content: chalk.blue(`Refresh Time: ${config.get('refreshTime')} seconds, Website: ${config.get('url')}`),
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
   * @param {String} time 
   * @param {String} message 
   */
  addLogLine(time, message) {
    this.log.log(`${chalk.bgWhite.black(`${time}:`)} ${chalk.grey(message)}`)
  }

  /**
   * Render the dashboard.
   */
  render() {
    this.screen.render()
  }
}