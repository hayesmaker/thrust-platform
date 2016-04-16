var gameState = require('../data/game-state');
var UIMenu = require('./ui-menu');
var manager = require('./manager');



module.exports = {

  init: function(menuSelectedCallback, playState) {
    manager.init();
    this.group = game.make.group();
    
    this.scoreGroup = game.add.group(this.group);
    this.interstitial.init(this.group);
    this.countdown.init(this.group);
    this.missionSwipe.init(0, game.height * 0.2, game.width * 0.5, 80, this.group);
    this.score.init(10, 10, this.scoreGroup);
    this.score.update(gameState.score, true);
    this.fuel.init(10, 30, this.scoreGroup);
    this.fuel.update(gameState.fuel, true);
    this.lives.init(10, 50, this.scoreGroup);
    this.lives.update(gameState.lives, true);

    this.menu = new UIMenu(this.group, "MENU", menuSelectedCallback, playState);
    
    /*
    this.menu.init(this.group);
    this.highScoreTable.init(this.group);
    */
  },
  
  showScreen: function(name) {
    manager.showScreen(name);
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

  highScoreTable: require('./high-score-table')
};