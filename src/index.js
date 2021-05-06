import config from 'config'
import chalk from 'chalk'
import { run } from './app.js'
import { Dashboard } from './utils/dashboard.js'

// multiply refresh time for milliseconds
const refreshTime = config.get('refreshTime');
const maximumRetries = config.get('maximumRetries');
const url = config.get('url');

let countTry = 1;

(async() => {
  let secondsLeft = refreshTime;
  const dashboard = new Dashboard(refreshTime);

  setInterval(async() => {
    try {
      // if seconds left is 0, run the scraper
      if (!secondsLeft) {
        secondsLeft = refreshTime
        await run()
      }

      dashboard.setTimerPercentage(secondsLeft)
      // console.log(`Seconds left for next try: ${secondsLeft}`)

      // substract 1 second
      secondsLeft--

      // render dashboard
      dashboard.render();
    } catch (error) {
      handleErrors(error);
    }
  }, 1000);
})()

function handleErrors(error) {
  // check if error is Error class, so we can check message
  if (error instanceof Error) {
    if (error.message.includes('ECONNREFUSED')) {
      // show error in console
      console.error(chalk.red(`Can not connect to configured website "${url}". Try ${countTry} of ${maximumRetries}.`))

      // update try count and check if another try should be done
      countTry++
      if (countTry > maximumRetries) {
        console.log(chalk.bgRed('Too many retries. Aborting.'))
        process.exit(1)
      }
    }
  }
}

process.on('uncaughtException', (err) => {
  console.error(err)
  process.exit(1)
})