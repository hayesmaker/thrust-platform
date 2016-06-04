var UiComponent = require('./ui-component');
var _ = require('lodash');
var gameState = require('../data/game-state');

var p = UiLevelsComplete.prototype = Object.create(UiComponent.prototype, {
  constructor: UiLevelsComplete
});

module.exports = UiLevelsComplete;

p.group = null;

p.padding = 20;

/**
 *
 *
 * @class UiLevelsComplete
 * @param group
 * @param name
 * @constructor
 */
function UiLevelsComplete(group, name, playState) {
  UiComponent.call(this, group, name, true, true);
  this.playState = playState;
}

/**
 * @method render
 */
p.render = function () {
  UiComponent.prototype.render.call(this);
  this.createDisplay();
  this.renderText();
  this.renderImage();
  this.enable();
};

p.createDisplay = function() {
  this.layoutRect = new Phaser.Rectangle(this.padding,this.padding, window.innerWidth * 0.45, window.innerHeight * 0.9);
  this.styles = {
    title: {font: '24px thrust_regular', fill: '#ffffff', align: 'left'},
    default: {font: '16px thrust_regular', fill: '#ffffff', align: 'left'}
  };
  var rect = game.add.graphics(0, 0, this.group);
  rect.beginFill(0x000000, 0.8);
  rect.lineStyle(2, 0xffffff, 1);
  rect.drawRect(this.layoutRect.x, this.layoutRect.y, this.layoutRect.width, this.layoutRect.height);
  rect.endFill();
};

p.renderText = function() {
  this.title = game.add.text(this.layoutRect.x + this.layoutRect.halfWidth, 0, "CONGRATULATIONS", this.styles.title, this.group);
  this.title.anchor.setTo(0.5);
  this.title.y = this.layoutRect.height * 0.075;

  var para1Str = "" +
    "You have successfully recovered all the orbs in the system." +
    "\n\n" +
    "Unlocks:" +
    "\n\n" +
    "* New game mode: Speed run" +
    "\n" +
    "* New game mode: Endless mode" +
    "\n" +
    "* New ship skin" +
    "\n\n" +
    "You can now try all the new game modes" +
    "\n\n" +
    "Thank you for playing Thrust 2016\n\n" +
    "Look out for more systems to complete in the appstore or online";

  this.paragraph1 = game.add.text(this.layoutRect.x + this.padding * 2, 0, para1Str, this.styles.default, this.group);
  this.paragraph1.y = this.title.y + this.padding * 2;
  this.paragraph1.width = this.layoutRect.width - this.padding * 4;

  this.pressFire = game.add.text(this.layoutRect.x + this.layoutRect.halfWidth, 0, "PRESS FIRE TO CONTINUE", this.styles.default, this.group);
  this.pressFire.y = this.layoutRect.height * 0.8;
  this.pressFire.anchor.setTo(0.5);
};

p.renderImage = function() {
  var image = game.add.image(0,0, 'coverImage', '', this.group);
  image.y = this.paragraph1.y + this.paragraph1.height + 10;
  image.scale.setTo(0.5);
  image.x = this.layoutRect.x + this.layoutRect.halfWidth - image.width/2;
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
  this.playState.showCurrentScreenByState.call(this.playState, gameState.PLAY_STATES.HIGH_SCORES);
};