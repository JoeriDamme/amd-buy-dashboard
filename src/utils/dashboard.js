import blessed from 'blessed'
import contrib from 'blessed-contrib'

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

    this.gauge = this.grid.set(0, 0, 2, 12, contrib.gauge, {
      label: 'Timer',
      percent: [100]
    })

    this.screen.key(['escape', 'q', 'C-c'], () => {
      return process.exit(0)
    });

    this.screen.on('resize', () => {
      this.gauge.emit('attach')
    });
  }

  /**
   * Get percentage of time left for retry of getting website.
   * @param {Number} leftInSeconds
   * @returns 
   */
  setTimerPercentage(leftInSeconds) {
    const percentage = Math.ceil(leftInSeconds / this.refreshTime * 100)
    this.gauge.setData([percentage])
    this.gauge.set
  }

  /**
   * Render the dashboard.
   */
  render() {
    this.screen.render()
  }
}