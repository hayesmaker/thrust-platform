var gameState = require('../data/game-state');
var UIMenu = require('./ui-menu');
var UIHighScores = require('./ui-high-scores');
var UIInterstitial = require('./ui-interstitial');
var UIOptions = require('./ui-options');
var manager = require('./manager');
var UILevelsComplete = require('./ui-levels-complete');
var game = global.game;




module.exports = {
  playState: null,

  init: function(menuSelectedCallback, playState) {
    this.playState = playState;
    manager.init(this);
    this.group = game.make.group();
    this.group.fixedToCamera = true;
    this.fade.init(this.group);
    this.scoreGroup = game.add.group(this.group);
    this.scoreGroup.x = 10;
    this.countdown.init(this.group);
    this.score.init(0, 10, this.scoreGroup);
    this.score.update(gameState.score, true);
    this.fuel.init(0, 30, this.scoreGroup);
    this.fuel.update(gameState.fuel, true);
    this.lives.init(0, 50, this.scoreGroup);
    this.lives.update(gameState.lives, true);
    this.missionSwipe.init(0, this.lives.textfield.y + this.lives.textfield.height + 10, game.width * 0.6, game.height * 0.1, this.group);
    this.interstitial = new UIInterstitial(this.group, "INTERSTITIAL", playState);
    this.interstitial.onExitComplete.add(this.levelTransitionCompleted, this);
    this.interstitial.trainingComplete.add(this.onTrainingCompleted, this);
    this.interstitial.levelComplete.add(this.onLevelCompleted, this);
    this.interstitial.trainingFailed.add(this.onTrainingFailed, this);
    this.menu = new UIMenu(this.group, "MENU", menuSelectedCallback, playState);
    this.highscores = new UIHighScores(this.group, "HIGH_SCORES", playState);
    this.options = new UIOptions(this.group, "OPTIONS", playState);
    this.levelsComplete = new UILevelsComplete(this.group, gameState.PLAY_STATES.COMPLETE, playState);
    this.missionDialog.init(this.group);
    this.gameOver.init(this.group);
  },

  onTrainingFailed: function() {
    console.log('training not complete, restart training / game over');
    this.playState.gameOver();
  },

  onTrainingCompleted: function() {
    console.log('training complete - return to menu');
    this.playState.gameOver();
  },

  onLevelCompleted: function() {
    this.playState.nextLevel();
  },

  showGameOver: function() {
    this.gameOver.blink();
  },

  removeGameOver: function() {
    this.gameOver.stop();
  },

  drawStopwatch: function() {
    this.stopwatch.init(game.width /2, this.score.scoreLabel.y, this.scoreGroup);
  },

  drawTrainingUi: function() {
    this.drawStopwatch();
    this.score.trainingMode();
  },
  
  update: function(uiMode) {
    if (uiMode) {
      this.menu.update();
      this.options.update();
    } else {
      this.gameOver.update();
    }
  },

  levelTransitionCompleted: function() {
    this.fade.tweenOut();
  },
  
  showScreen: function(name, fadeIn) {
    gameState.currentState = name;
    manager.showScreen(name);
    if (fadeIn) {
      this.fade.tweenIn();
    } else {
      //doesn't always need to be called
      this.fade.tweenOut();
    }
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

  gameOver: require('./ui-game-over'),

  stopwatch: require('./ui-stopwatch'),

  fade: require('./fade'),

  missionSwipe: require('./mission-swipe'),

  score: require('./score'),

  fuel: require('./fuel'),

  lives: require('./lives'),
  
  countdown: require('./countdown'),

  missionDialog: require('./mission-dialog')
};