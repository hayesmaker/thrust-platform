var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET
});

var url = 'http://thrust-platform.herokuapp.com';

var status = function() {
  return '#HTML5 Thrust beta update: (v' + process.env.npm_package_version +') successfully deployed at: ' + url;
};

client.post('statuses/update', {status: status() }, function(error, tweet, response){
  if (!error) {
    console.log('Tweeted status:', status());
  }
});