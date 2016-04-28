var UIComponent = require('./ui-component');
var _ = require('lodash');
var gameState = require('../data/game-state');
var levelManager = require('../data/level-manager');

var p = UIHighScores.prototype = Object.create(UIComponent.prototype, {
  constructor: UIHighScores
});

module.exports = UIHighScores;

/**
 *
 *
 * @class UIHighScores
 * @param group
 * @param name
 * @param playState
 * @constructor
 */
function UIHighScores(group, name, playState) {
  UIComponent.call(this, group, name);
  this.playState = playState;
}

p.items = [];
p.padding = 30;
p.maxY = 0;
p.styles = {
  title: {font: '26px thrust_regular', fill: '#ffffff', align: 'left'},
  scores: {font: '16px thrust_regular', fill: '#ffffff', align: 'left'},
  subtitle: {font: '18px thrust_regular', fill: '#ffffff', align: 'left'}
};
p.selectedIndex = 0;
p.itemSelected = null;
p.layoutRect = null;
p.fullLayout = false;

p.render = function() {
  UIComponent.prototype.render.call(this);
  this.initSignals();
  this.initLayout();
  this.createDisplay();
  this.centerDisplay();
  this.drawLines();
  //this.drawGameOver();
  this.drawPressFire();
  this.insertHighScore();
};

p.initLayout = function () {
  if (game.width > 1000) {
    this.initFullLayout();
  } else {
    this.initSmallLayout();
  }
};

p.initFullLayout = function () {
  this.fullLayout = true;
  this.lineHeight = 4;
  this.layoutRect = new Phaser.Rectangle(0, 0, 640, 480);
};

p.initSmallLayout = function () {
  this.padding = 10;
  this.lineHeight = 3;
  this.layoutRect = new Phaser.Rectangle(this.padding, this.padding, window.innerWidth - this.padding*2, window.innerHeight - this.padding*2);
  this.styles = {
    title: {font: '14px thrust_regular', fill: '#ffffff', align: 'left'},
    scores: {font: '10px thrust_regular', fill: '#ffffff', align: 'left'},
    subtitle: {font: '12px thrust_regular', fill: '#ffffff', align: 'left'}
  };
};

p.drawLines = function() {
  var linePadding = this.layoutRect.height * 0.02;
  var y = this.layoutRect.height * 0.075;
  var line = game.add.graphics(0, y, this.group);
  var xTo = this.layoutRect.width;
  line.lineStyle(this.lineHeight, 0xffffff, 0.5);
  line.moveTo(0, y);
  line.lineTo(xTo, y);
  line.moveTo(0, y + linePadding);
  line.lineTo(xTo, y + linePadding);
  line.moveTo(0, this.maxY);
  line.lineTo(xTo, this.maxY);
};

p.initSignals = function () {

};

p.createDisplay = function () {
  var rect = game.add.graphics(0, 0, this.group);
  rect.beginFill(0xff0000, 0.35);
  rect.drawRect(this.layoutRect.x, this.layoutRect.y, this.layoutRect.width, this.layoutRect.height);
  rect.endFill();
  this.createTitle();
  _.each(gameState.highScoreTable, _.bind(this.addHighScore, this));
  //this.gameOverSubTitle();
};

p.centerDisplay = function() {
  this.group.x = game.width/2 - this.group.width/2 - this.padding;
  this.group.y = game.height/2 - this.group.height/2 - this.padding;
};

p.createTitle = function () {
  this.title = game.add.text(this.layoutRect.halfWidth, 0, "HIGH SCORES", this.styles.title, this.group);
  this.title.anchor.setTo(0.5);
  this.title.y = this.layoutRect.height * 0.075;
};

p.addHighScore = function (highscore, index) {
  var numberTf = game.add.text(this.layoutRect.x + this.padding, 0, index + 1, this.styles.scores, this.group);
  var nameTf = game.add.text(0, 0, highscore.name, this.styles.scores, this.group);
  var scoreTf = game.add.text(0, 0, highscore.score, this.styles.scores, this.group);
  var y = this.layoutRect.y + this.layoutRect.height*0.2 + (numberTf.height + 5) * index;
  numberTf.y = nameTf.y = scoreTf.y = y;
  nameTf.x = numberTf.x + numberTf.width + this.layoutRect.width * 0.02;
  scoreTf.x = this.layoutRect.width - scoreTf.width - this.padding;
  this.items.push({
    number: numberTf,
    name: nameTf,
    score: scoreTf
  });
  this.maxY = y;
};

p.insertHighScore = function() {
  var scoreIndex = gameState.getScoreIndex();
  var currentScoreItem = this.items[scoreIndex];
  console.log('insertHighScore :: scoreIndex=', scoreIndex);
  this.cursor = game.add.text(this.layoutRect.x + 20, this.layoutRect.y + 20, "_", this.styles.scores, this.group);
  this.cursor.x = currentScoreItem.name.x;
  this.cursor.y = currentScoreItem.name.y;
  var pushedScores = _.slice(this.items, scoreIndex);
  _.each(pushedScores, function(scoreItem, index) {
    //scoreItem.number.y += scoreItem.yOffset;
    var yOffset = scoreItem.number.height + 5; //<--//todo link to offset in addHighScore
    scoreItem.name.y += yOffset;
    scoreItem.score.y += yOffset;
    if (index === pushedScores.length - 1) {
      //this.group.remove(scoreItem.name);
      //this.items.splice(this.items.length - 1, 1);
    }
  }.bind(this));
};

p.drawGameOver = function() {
  var style = this.styles.subtitle;
  var subTitle = game.add.text(this.layoutRect.halfWidth, 0, "GAME OVER", style, this.group);
  subTitle.y = this.layoutRect.height - this.layoutRect.height * 0.15;
  subTitle.anchor.setTo(0.5);
};

p.drawPressFire = function () {
  var subTitle = game.add.text(this.layoutRect.halfWidth, 0, "PRESS FIRE", this.styles.scores, this.group);
  subTitle.anchor.setTo(0.5);
  subTitle.y =  this.layoutRect.height - this.layoutRect.height * 0.075;
};

p.newHighScoreSubTitle = function () {
  var style = this.styles.subtitle;
  var subTitle = game.add.text(this.layoutRect.halfWidth, - this.group.y + this.padding*2 , "CONGRATULATIONS, YOU RANK 4TH", style, this.group);
  subTitle.anchor.setTo(0.5);
  var subTitle2 = game.add.text(this.layoutRect.halfWidth, subTitle.y + subTitle.height + 10, "ENTER YOUR NAME PILOT", style, this.group);
  subTitle2.anchor.setTo(0.5);
};

p.gameOverSubTitle = function () {
  var style = this.styles.subtitle;
  var subTitle2 = game.add.text(this.layoutRect.halfWidth, 0, "YOUR SCORE WAS " + gameState.score, style, this.group);
  subTitle2.y = this.layoutRect.height * 0.7;
  subTitle2.anchor.setTo(0.5);
  var subTitle3 = game.add.text(this.layoutRect.halfWidth,0, "YOU REACHED LEVEL " + parseInt(levelManager.levelIndex + 1, 10), style, this.group);
  subTitle3.y = subTitle2.y + subTitle2.height + this.layoutRect.height * 0.01;
  subTitle3.anchor.setTo(0.5);
};

p.enable = function() {
  game.controls.spacePress.onDown.add(this.spacePressed, this);
  if (game.controls.stick) {
    game.controls.buttonB.onDown.add(this.spacePressed, this);
  }
};

p.disable = function() {
  game.controls.spacePress.onDown.remove(this.spacePressed, this);
  if (game.controls.stick) {
    game.controls.buttonB.onDown.remove(this.spacePressed, this);
  }
};

/**
 * @method spacePressed
 */
p.spacePressed = function () {
  this.playState.showCurrentScreenByState.call(this.playState, gameState.PLAY_STATES.MENU);
};
