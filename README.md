# AMD Buy Dashboard
Scrape the 'Buy Direct from AMD' website, detect changes in HTML and report those in a dashboard.

## Introduction
We all know it's really difficult to obtain a GPU during these times. Almost once every week AMD 'drops' new GPUs on their website (for normal prices), but it's almost impossbile to detect when.
There are some clues prio a drop:
- The order of the products are changing on the website (±30 minutes prop drop)
- The CAT15/16 detection

## So how is this application helping you?
Currently, it doesn't help you too much at this moment. I'm in this 'business' now for a few days, because I really want to obtain a 6900XT myself.
I know there is a script that reveals the 'Add to Cart' buttons, but it's actually only usefull when the drop is really happening and the real buttons are still hidden, because of (probably) caching issues on the CDN of AMD. The script will reveal the buttons, so you have an edge on regular people that have to wait on these buttons. In the meantime, other people with that script already ordering their GPUs, so when finally the real buttons are displayed, everything is sold out.
I think this is still pretty unreliable, so I want to find a method to really detect a drop and will warn you on time (even the partalert notifications are too slow most times).

## How will you detect a drop?
That's the question :) This application will scrape the 'Buy Direct from AMD' website, detect changes in HTML and stores them. That's it at the moment. Hopefully with enough data, it's possible to recognize some patterns so it will be easier to predict a drop.

## hmm...so why should I use this?
It can already be helpfull at the moment if you have some HTML knowledge. As explained before, the dashboard will show the changes in the HTML. We know that most drops happens on Thursdays. And most of the time the order of the products will change.
So if those divs are changing, login at Paypal, start the 'reveal add to card button' script and pray to the gods :D

## The future
That's not really clear. It really depends on the drops of AMD and if it possible to detect some kind of pattern. I first need collect more data just before the drops to make a judgement on this.
When there is a way to detect a drop, I will update the application with a better notification system and maybe other usefull things, for example that it will open your browser automatically and open the Paypal and AMD website, and click on the product you want, so it will show you the reCaptcha. Of course, the part after that is impossible to automate ;)

## Requirements
- Node.js 14 higher
- NPM 6 or higher

## Current features
- Detect changes in HTML and show a diff
- Refresh time between scraping
- Unix terminal notifier (I'm using iTerm on a macbook, it will show a badge and make a sound. Not sure how other terminals are working)

## Installation
- Clone this repo. I always will make sure that the `main` branch will be the latest version
- `npm install`
- That's it. 

## Running the application
- `npm start`

## Configuration
The `config` contains a `default.json` with the default settings. I recommend to not touch this file. Instead in the same folder, create a `local.json` file and override a setting.

- url: "https://www.amd.com/en/direct-buy" => The AMD buy website. Normally you don't change this :)
- refreshTime: 30 => In seconds. Time between scraping. Be carefull changing this, because if the interval is too short, you can maybe be blocked for some time.
- maximumRetries: 5 => If a 'scrape' fails, it will retry. If it fails 5 times in a row, the application will exit.
- storageQuota: 1000 => In MBs (so 1000MB is 1GB). Every scrape will be stored locally at the moment.
- notification: true => Will trigger a notification in the terminal when there is a change.

## Local Storage?
For now. It works the same as the local storage in a browser. Maybe if we have enough people I will create a public API where everyone can push the HTML and MAYBE IF IT POSSIBLE use machine learning or smart pigeons to detect patterns. But I will do it with my own brains at the moment.