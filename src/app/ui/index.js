module.exports = {

  init: function() {
    this.group = game.make.group();
  },

  missionSwipe: require('./mission-swipe'),

  score: require('./score'),

  fuel: require('./fuel'),

  lives: require('./lives')

};