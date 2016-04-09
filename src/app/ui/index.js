module.exports = {

  init: function() {
    this.group = game.make.group();
    this.interstitial.init(this.group);
    this.countdown.init(this.group);
  },

  missionSwipe: require('./mission-swipe'),

  score: require('./score'),

  fuel: require('./fuel'),

  lives: require('./lives'),

  interstitial: require('./interstitial'),
  
  countdown: require('./countdown')

};