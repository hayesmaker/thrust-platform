var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET
});

var url = 'http://thrust-platform.herokuapp.com';
var changelog = 'https://github.com/hayesmaker/thrust-platform/blob/master/CHANGELOG.md';

var status = function() {
  return 'Thrust2016 update launched (v' + process.env.npm_package_version +') live now at: ' + url + 'changelog: ' + changelog + ' #indiedev ';
};

client.post('statuses/update', {status: status() }, function(error, tweet, response){
  if (!error) {
    console.log('Tweeted:' + tweet + ' status: ', status());
  }
}); 