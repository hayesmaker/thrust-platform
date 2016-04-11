module.exports = {

  init: function() {
    this.group = game.make.group();
    this.scoreGroup = game.add.group(this.group);
    this.interstitial.init(this.group);
    this.countdown.init(this.group);
  },
  
  hideUser: function() {
    this.scoreGroup.visible = false;
  },

  showUser: function() {
    this.scoreGroup.visible = true;
  },

  missionSwipe: require('./mission-swipe'),

  score: require('./score'),

  fuel: require('./fuel'),

  lives: require('./lives'),

  interstitial: require('./interstitial'),
  
  countdown: require('./countdown'),

  highScoreTable: require('./high-score-table'),

  menu: require('./menu')
};