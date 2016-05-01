var gameState = require('../data/game-state');
var UIMenu = require('./ui-menu');
var UIHighScores = require('./ui-high-scores');
var UIInterstitial = require('./ui-interstitial');
var manager = require('./manager');



module.exports = {

  init: function(menuSelectedCallback, playState) {
    manager.init(this);
    this.group = game.make.group();
    this.scoreGroup = game.add.group(this.group);
    this.scoreGroup.x = 10;
    this.fade.init(this.group);
    this.countdown.init(this.group);
    this.missionSwipe.init(0, game.height * 0.2, game.width * 0.5, 80, this.group);
    this.score.init(0, 10, this.scoreGroup);
    this.score.update(gameState.score, true);
    this.fuel.init(0, 30, this.scoreGroup);
    this.fuel.update(gameState.fuel, true);
    this.lives.init(0, 50, this.scoreGroup);
    this.lives.update(gameState.lives, true);
    this.interstitial = new UIInterstitial(this.group, "INTERSTITIAL", playState);
    this.interstitial.onExitComplete.add(this.levelTransitionCompleted, this);
    this.menu = new UIMenu(this.group, "MENU", menuSelectedCallback, playState);
    this.highscores = new UIHighScores(this.group, "HIGH_SCORES", playState);
  },

  levelTransitionCompleted: function() {
    console.log('ui : index :: levelTransitionCompleted');
    this.fade.tweenOut();
  },
  
  showScreen: function(name) {
    console.log('ui : index :: showScreen', name);
    gameState.currentState = name;
    manager.showScreen(name);
  },
  
  hideUser: function() {
    this.scoreGroup.visible = false;
  },

  showUser: function() {
    this.scoreGroup.visible = true;
  },

  destroy: function() {
    this.group.removeAll(true);
    this.group.destroy();
  },

  fade: require('./fade'),

  missionSwipe: require('./mission-swipe'),

  score: require('./score'),

  fuel: require('./fuel'),

  lives: require('./lives'),
  
  countdown: require('./countdown')
};