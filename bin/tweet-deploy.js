#!/usr/bin/env node

var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET
});

var url = 'https://hayesmaker.itch.io/thrust-30';


var status = function() {
  return '#Thrust30 Demo Release v' + process.env.npm_package_version +'-RC-1 ' + url + ' ' +
    'play it now on Itch.io #html5dev';
};


client.post('statuses/update', {status: status() }, function(error, tweet) {
  if (!error) {
    console.log('Tweeted:' + tweet + ' status: ', status());
  } else {
    console.log('Attempt to tweet:', tweet);
    console.error(error);
  }
});



console.log(status());

/*
 Thrust 2016 Major update (v0.8.1) http://thrust-platform.herokuapp.com New Flight Training mode! #indiedev @IndieGameDevBot @IndieDevDog;
 */
