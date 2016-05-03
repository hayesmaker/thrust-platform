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
  _.bindAll(this, 'keyboardOnPress');
  _.bindAll(this, 'swallowBackspace');
}

p.highScoreInputEnabled = false;
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
p.newScoreName = "";

p.mobileCharsIndex = 0;
p.mobileChars = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "_", "<3", ":)", "END"
];
p.mobileCharDirty = false;

p.render = function () {
  UIComponent.prototype.render.call(this);
  this.items = [];
  this.initSignals();
  this.initLayout();
  this.createDisplay();
  this.centerDisplay();
  this.drawLines();
  this.drawPressFire();
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
  this.layoutRect = new Phaser.Rectangle(this.padding, this.padding, window.innerWidth - this.padding * 2, window.innerHeight - this.padding * 2);
  this.styles = {
    title: {font: '14px thrust_regular', fill: '#ffffff', align: 'left'},
    scores: {font: '10px thrust_regular', fill: '#ffffff', align: 'left'},
    subtitle: {font: '12px thrust_regular', fill: '#ffffff', align: 'left'}
  };
};

p.drawLines = function () {
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
  this.createSubtitles();
};

p.centerDisplay = function () {
  this.group.x = game.width / 2 - this.group.width / 2 - this.padding;
  this.group.y = game.height / 2 - this.group.height / 2 - this.padding;
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
  var y = this.layoutRect.y + this.layoutRect.height * 0.2 + (numberTf.height + 5) * index;
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

p.renderHighScores = function () {
  _.each(gameState.highScoreTable, function (highScore, index) {
    this.items[index].name.text = highScore.name;
    this.items[index].score.text = highScore.score;
  }.bind(this));

};

p.insertNewScore = function () {
  var scoreIndex = gameState.getScoreIndex();
  console.log('scoreIndex:', scoreIndex);
  if (scoreIndex >= 0) {
    var currentScoreItem = this.items[scoreIndex];
    console.log('insertNewScore :: scoreIndex=', scoreIndex);
    this.cursor = game.add.text(this.layoutRect.x + 20, this.layoutRect.y + 20, "_", this.styles.scores, this.group);
    this.cursor.x = currentScoreItem.name.x;
    this.cursor.y = currentScoreItem.name.y;
    gameState.insertNewHighScore(scoreIndex);
    this.renderHighScores();
    this.newHighScoreSubTitle();
    this.enableKeyboardEntry();
  } else {
    this.gameOverSubTitle();
  }
};

p.drawPressFire = function () {
  this.subTitle3.visible = true;
};

p.createSubtitles = function () {
  var style = this.styles.subtitle;
  this.subTitle1 = game.add.text(this.layoutRect.halfWidth, this.layoutRect.height * 0.75, "", style, this.group);
  this.subTitle1.anchor.setTo(0.5);
  this.subTitle2 = game.add.text(this.layoutRect.halfWidth, this.subTitle1.y + this.subTitle1.height + 10, "", style, this.group);
  this.subTitle2.anchor.setTo(0.5);
  this.subTitle3 = game.add.text(this.layoutRect.halfWidth, 0, "PRESS FIRE", this.styles.scores, this.group);
  this.subTitle3.anchor.setTo(0.5);
  this.subTitle3.y = this.layoutRect.height - this.layoutRect.height * 0.075;
  this.subTitle1.visible = false;
  this.subTitle2.visible = false;
  this.subTitle3.visible = false;
};

p.newHighScoreSubTitle = function () {
  this.subTitle1.visible = this.subTitle2.visible = true;
  this.subTitle1.text = "NEW HIGH SCORE";
  this.subTitle2.text = "ENTER YOUR NAME PILOT";
};

p.gameOverSubTitle = function () {
  this.subTitle1.visible = this.subTitle2.visible = true;
  this.subTitle1.text = "GAME OVER";
  this.subTitle2.text = "YOU REACHED LEVEL " + parseInt(levelManager.levelIndex + 1, 10);
  this.subTitle3.visible = true;
};

p.checkMobileInput = function () {
  if (!this.highScoreInputEnabled) {
    return;
  }
  var stick = game.controls.stick;
  if (stick) {
    if (stick.isDown) {
      if (stick.direction === Phaser.UP) {
        this.stickUpPressed = true;
        this.stickDownPressed = false;
      } else if (stick.direction === Phaser.DOWN) {
        this.stickUpPressed = false;
        this.stickDownPressed = true;
      }
    } else {
      if (this.stickDownPressed) {
        this.stickDownPressed = false;
        //this.downPressed();
        this.stepDownMobileChar();
        this.mobileCharDirty = true;
      }
      if (this.stickUpPressed) {
        this.stickUpPressed = false;
        //this.upPressed();
        this.stepUpMobileChar();
        this.mobileCharDirty = true;
      }
    }
  }
  /*
  var stick = game.controls.stick;
  if (stick && stick.isDown) {
    if (stick.direction === Phaser.UP) {
      this.stepUpMobileChar();
      this.mobileCharDirty = true;
    }
    if (stick.direction === Phaser.DOWN) {
      this.stepDownMobileChar();
      this.mobileCharDirty = true;
    }
  }
  */
  this.renderMobileChar();
};

p.stepUpMobileChar = function () {
  if (this.mobileCharsIndex + 1 === this.mobileChars.length) {
    this.mobileCharsIndex = 0;
  } else {
    this.mobileCharsIndex++;
  }
};

p.stepDownMobileChar = function () {
  if (this.mobileCharsIndex === 0) {
    this.mobileCharsIndex = this.mobileChars.length - 1;
  } else {
    this.mobileCharsIndex--;
  }
};

p.renderMobileChar = function () {
  if (this.mobileCharDirty) {
    console.log('ui-high-scores :: renderMobileChar', this.mobileChars[this.mobileCharsIndex]);
    this.mobileCharDirty = false;
    this.char = this.mobileChars[this.mobileCharsIndex];
    this.renderScoreInput(this.newScoreName + this.char);
  }
};

p.assignMobileChar = function () {
  if (this.newScoreName.length < 13) {
    console.warn('ui-high-scores :: assignMobileChar', this.char);
    this.newScoreName = this.newScoreName + this.char;
    this.mobileCharsIndex = 0;
    this.char = this.mobileChars[this.mobileCharsIndex];
    this.renderScoreInput(this.newScoreName + this.char);
  } else {
    this.char = this.mobileChars[this.mobileChars.length - 1];
    this.renderScoreInput(this.newScoreName + this.char);
  }
};

p.enable = function () {
  game.controls.spacePress.onDown.add(this.spacePressed, this);
  if (game.controls.stick) {
    game.controls.buttonB.onDown.add(this.spacePressed, this);
  }
};

p.disable = function () {
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

p.upButtonB = function() {
  this.commitScore();
};

p.upButtonA = function() {
  this.assignMobileChar();
};

/**
 * @method enableKeyboardEntry
 */
p.enableKeyboardEntry = function () {
  this.highScoreInputEnabled = true;
  if (game.controls.stick) {
    //game.controls.buttonB.onDown.add(this.pressButtonB, this);
    this.char = this.mobileChars[this.mobileCharsIndex];
    this.renderScoreInput(this.newScoreName + this.char);
    game.controls.buttonB.onUp.add(this.upButtonB, this);
    game.controls.buttonA.onUp.add(this.upButtonA, this);

  }
  this.disable();
  window.addEventListener('keydown', this.swallowBackspace);
  window.addEventListener('keypress', this.keyboardOnPress);
};

/**
 * @method disableKeyboardEntry
 */
p.disableKeyboardEntry = function () {
  this.highScoreInputEnabled = false;
  if (game.controls.stick) {
    //game.controls.buttonB.onDown.add(this.pressButtonB, this);
    game.controls.buttonB.onUp.remove(this.upButtonB, this);
    game.controls.buttonA.onUp.remove(this.upButtonA, this);
  }
  window.removeEventListener('keydown', this.swallowBackspace);
  window.removeEventListener('keypress', this.keyboardOnPress);
  this.enable();
};

/**
 * @method swallowBackspace
 * @param e
 */
p.swallowBackspace = function (e) {
  if (e.keyCode === 8) {
    e.preventDefault();
    if (this.newScoreName.length) {
      this.newScoreName = this.newScoreName.substring(0, this.newScoreName.length - 1);
      this.renderScoreInput(this.newScoreName);
    }
  }
};

/**
 * @method keyboardOnPress
 * @param e
 */
p.keyboardOnPress = function (e) {
  var char = String.fromCharCode(e.keyCode);
  if (e.keyCode === 8) {
    this.swallowBackspace(e);
  }
  if (e.keyCode === 13) {
    this.commitScore();
  } else {
    this.newScoreName = this.newScoreName + char;
    this.renderScoreInput(this.newScoreName);
  }
};

/**
 * @method renderScoreInput
 * @param str
 */
p.renderScoreInput = function (str) {
  this.cursor.text = str + "_";
};

/**
 * @method commitScore
 */
p.commitScore = function() {
  this.disableKeyboardEntry();
  this.group.remove(this.cursor);
  this.cursor.text = "";
  this.cursor = null;
  gameState.newScoreEntered(this.newScoreName);
  this.newScoreName = "";
  this.renderHighScores();
  this.gameOverSubTitle();
};