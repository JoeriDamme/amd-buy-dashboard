import config from 'config'
import { run } from './app.js'

// multiply refresh time for milliseconds
const refreshTime = config.get('refreshTime') * 1000;

(async() => {
  let i = 0;
  let interval;

  try {
    interval = setInterval(async() => {
      i++
      console.log(i)

      await run();
  
    }, refreshTime)
  } catch (error) {
    console.log(error);
  }

})()
