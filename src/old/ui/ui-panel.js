var UiComponent = require('./ui-component');
var canvas = require('./canvas');

var p = UiPanel.prototype = Object.create(UiComponent.prototype, {
  constructor: UiPanel
});

module.exports = UiPanel;

/**
 * Skinnable UI Panel
 *
 * @class UiPanel
 * @param group
 * @param name
 * @param playState
 * @constructor
 */
function UiPanel(group, name, playState) {
  UiComponent.call(this, group, name, false, false);
  this.playState = playState;
}

p.group = null;
p.fullLayout = false;
p.padding = 30;
p.maxY = 0;
p.styles = {
  title: {font: '20px thrust_regular', fill: '#ffffff', align: 'left'},
  scores: {font: '16px thrust_regular', fill: '#ffffff', align: 'left'},
  subtitle: {font: '18px thrust_regular',   fill: '#ffffff', align: 'left'}
};

/**
 * @method setSkin
 * @param bmd {Phaser.BitmapData}
 */
p.setSkin = function (bmd) {
  this.skinBitmap = bmd;
};

/**
 * @method render
 */
p.render = function () {
  UiComponent.prototype.render.call(this);
  this.createDisplay();
};

p.initFullLayout = function () {
  UiComponent.prototype.initFullLayout.call(this);
  this.lineHeight = 4;
  this.layoutRect = new Phaser.Rectangle(0, 0, game.width * 0.65, game.height * 0.5);
};

p.initSmallLayout = function () {
  UiComponent.prototype.initSmallLayout.call(this);
  this.padding = 2;
  this.lineHeight = 3;
  this.layoutRect = new Phaser.Rectangle(this.padding, this.padding, game.width - this.padding * 2, game.height - this.padding * 2);
  this.styles = {
    title: {font: '14px thrust_regular', fill: '#ffffff', align: 'left'},
    scores: {font: '10px thrust_regular', fill: '#ffffff', align: 'left'},
    subtitle: {font: '12px thrust_regular', fill: '#ffffff', align: 'left'}
  };
};

/**
 * This creates a Phaser.Graphics version of the options background
 * on iOS devices.. As there's a problem with the drawCanvasBackground method
 * on ipad/iphone.  If the bug can be resolved, then drawCanvasBackground should be used only.
 *
 * @method createDisplay
 */
p.createDisplay = function () {
  if (game.device.iOS) {
    this.drawIOSBackground();
  } else {
    this.drawCanvasBackground();
  }
};

/**
 * @todo find out why ios can't render the bitmapData / ctx draw calls used in drawCanvasBackground
 * @method drawCanvasBackground
 */
p.drawCanvasBackground = function() {
  var strokeWidth = 4;
  var width  = this.layoutRect.width - strokeWidth * 2;
  var height = this.layoutRect.height - strokeWidth * 2;
  this.skinBitmap = game.make.bitmapData(this.layoutRect.width + strokeWidth * 2, this.layoutRect.height + strokeWidth * 2);
  var linearGradient1 = this.skinBitmap.ctx.createLinearGradient(0,0,0,height);
  linearGradient1.addColorStop(0, 'rgb(25, 24, 24)');
  linearGradient1.addColorStop(0.5  , 'rgb(3, 31, 64)');
  this.skinBitmap.ctx.fillStyle = linearGradient1;
  this.skinBitmap.ctx.strokeStyle = 'rgb(255,255,255)';
  this.skinBitmap.ctx.lineWidth = strokeWidth;
  canvas.drawRoundRect(this.skinBitmap.ctx, strokeWidth / 2, strokeWidth / 2, width, height, 10, true, true);
  this.background = game.add.sprite(this.layoutRect.x, this.layoutRect.y, this.skinBitmap, '', this.group);
};

/**
 * iOS friendly version of drawing the panel background
 *
 * @method drawIOSBackground
 */
p.drawIOSBackground = function() {
  var strokeWidth = 4;
  var width  = this.layoutRect.width - strokeWidth * 2;
  var height = this.layoutRect.height - strokeWidth * 2;
  var color = Phaser.Color.RGBtoString(25, 24, 24);
  this.background = game.add.graphics(0, 0, this.group);
  this.background.lineStyle(strokeWidth, 0xffffff);
  this.background.beginFill(color, 1);
  this.background.drawRoundedRect(this.layoutRect.x, this.layoutRect.y, width, height, 10);
  this.background.endFill();
};

