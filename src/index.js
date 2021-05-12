import config from 'config';
import parseArgs from 'minimist';
import chalk from 'chalk';
import run from './app';
import Dashboard from './utils/dashboard';

// multiply refresh time for milliseconds
const refreshTime = config.get('refreshTime');
const maximumRetries = config.get('maximumRetries');
const url = config.get('url');
const notification = config.get('notification');

// CLI arguments
const args = parseArgs(process.argv.slice(2));
const hideDashboard = args && !!args.hideDashboard;

let countTry = 1;
let secondsLeft = refreshTime;
let dashboard;

function updateErrorDashboard(error) {
  const date = new Date();
  dashboard.setError(date, error.message);
  dashboard.addLogLine(date, error.log);
}

function handleErrors(error) {
  if (!dashboard) {
    // eslint-disable-next-line no-console
    console.error(error);
    return;
  }

  let errorObject;

  // check if error is Error class, so we can check message
  if (error instanceof Error) {
    if (error.message.includes('ECONNREFUSED')) {
      errorObject = {
        log: {
          error: true,
          important: false,
          message: 'Error',
        },
        message: `Can not connect to configured website "${url}". Try ${countTry} of ${maximumRetries}.`,
      };

      // update try count and check if another try should be done
      countTry += 1;
      if (countTry > maximumRetries) {
        // eslint-disable-next-line no-console
        console.error(chalk.bgRed('Too many retries. Aborting.'));
        process.exit(1);
      }
    } else {
      errorObject = {
        log: {
          error: true,
          important: false,
          message: 'Error',
        },
        message: error.message,
      };
    }

    updateErrorDashboard(errorObject);
  } else {
    // not handled!
    throw error;
  }
}

// run anonymous function when starting the application
(async () => {
  // The dashboard can be hidden by using the '--hideDashboard' CLI argument.
  // This is usefull when debugging things, because console.logs are not visible
  // when rendering the dashboard.
  if (!hideDashboard) {
    dashboard = new Dashboard(refreshTime);

    dashboard.setConfigBox({
      refreshTime,
      url,
      notification,
    });
  }

  setInterval(async () => {
    try {
      // if seconds left is 0, run the scraper
      if (!secondsLeft) {
        secondsLeft = refreshTime;

        // run scraper
        const result = await run();

        if (dashboard) {
          // set diff if available
          if (result && result.diff) {
            dashboard.setDiff(new Date(), result.diff);

            if (notification) {
              // nice trick to trigger bell in unix terminals
              process.stderr.write('\x07');
            }
          }

          // set log message
          const messageObj = result && result.diff ? { message: 'Change!', important: true } : { message: 'No change', important: false };
          dashboard.addLogLine(new Date(), messageObj);

          // remove any previous errors from dashboard
          dashboard.clearError();
        }
      }

      // substract 1 second
      secondsLeft -= 1;

      // render dashboard
      if (dashboard) {
        dashboard.setTimerPercentage(secondsLeft);
        dashboard.render();
      }
    } catch (error) {
      handleErrors(error);
    }
  }, 1000);
})();

process.on('uncaughtException', (err) => {
  // clear terminal
  dashboard.clear();

  // print error
  // eslint-disable-next-line no-console
  console.error(err);

  // exit process with error
  process.exit(1);
});
