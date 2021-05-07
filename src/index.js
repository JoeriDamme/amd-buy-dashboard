import config from 'config'
import chalk from 'chalk'
import { run } from './app.js'
import { Dashboard } from './utils/dashboard.js'

// multiply refresh time for milliseconds
const refreshTime = config.get('refreshTime');
const maximumRetries = config.get('maximumRetries');
const url = config.get('url');

let countTry = 1;
let secondsLeft = refreshTime;
const dashboard = new Dashboard(refreshTime);

// run anonymous function when starting the application
(async() => {
  setInterval(async() => {
    try {
      // if seconds left is 0, run the scraper
      if (!secondsLeft) {
        secondsLeft = refreshTime

        // run scraper
        const result = await run()

        // set diff if available
        if (result && result.diff) {
          dashboard.setDiff(new Date(), result.diff)
        }

        // set log message
        const messageObj = result ? { message: 'Change!', important: true } : { message: 'No change', important: false }
        dashboard.addLogLine(new Date(), messageObj)

        // remove any previous errors from dashboard
        dashboard.clearError()
      }

      dashboard.setTimerPercentage(secondsLeft)

      // substract 1 second
      secondsLeft--

      // render dashboard
      dashboard.render()
    } catch (error) {
      handleErrors(error)
    }
  }, 1000);
})()

function handleErrors(error) {
  // check if error is Error class, so we can check message
  if (error instanceof Error) {
    if (error.message.includes('ECONNREFUSED')) {
      // show error on dashboard
      const date = new Date()
      dashboard.setError(date, `Can not connect to configured website "${url}". Try ${countTry} of ${maximumRetries}.`)
      dashboard.addLogLine(date, {
        error: true,
        important: false,
        message: 'Error'
      })

      // update try count and check if another try should be done
      countTry++
      if (countTry > maximumRetries) {
        console.error(chalk.bgRed('Too many retries. Aborting.'))
        process.exit(1)
      }
    } else {
      // other errors of the error class
      const date = new Date()
      dashboard.setError(date, error.message)
      dashboard.addLogLine(date, {
        error: true,
        important: false,
        message: 'Error'
      })
    }
  }

  dashboard.render()
}

process.on('uncaughtException', (err) => {
  // clear terminal
  dashboard.clear()

  // print error
  console.error(err)

  // exit process with error
  process.exit(1)
})