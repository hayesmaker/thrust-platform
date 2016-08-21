var UiComponent = require('./ui-component');
var canvas = require('../utils/canvas');

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
  this.label = this.name;
}

p.label = "";
p.name = "";
p.group = null;
p.fullLayout = false;
p.padding = 30;
p.maxY = 0;
p.styles = {
  title: {font: '20px thrust_regular', fill: '#ffffff', align: 'left'},
  scores: {font: '16px thrust_regular', fill: '#ffffff', align: 'left'},
  subtitle: {font: '18px thrust_regular', fill: '#ffffff', align: 'left'}
};

/**
 * @method setSkin
 * @param bmd {Phaser.BitmapData}
 */
p.setSkin = function(bmd) {
  this.skinBitmap = bmd;
};

/**
 * @method render
 */
p.render = function () {
  UiComponent.prototype.render.call(this);
  this.initLayout();
  this.createDisplay();
};

p.initFullLayout = function () {
  this.fullLayout = true;
  this.lineHeight = 4;
  this.layoutRect = new Phaser.Rectangle(0, 0, 700, 500);
};

p.initSmallLayout = function () {
  this.padding = 2;
  this.lineHeight = 3;
  this.layoutRect = new Phaser.Rectangle(this.padding, this.padding, window.innerWidth - this.padding * 2, window.innerHeight - this.padding * 2);
  this.styles = {
    title: {font: '14px thrust_regular', fill: '#ffffff', align: 'left'},
    scores: {font: '10px thrust_regular', fill: '#ffffff', align: 'left'},
    subtitle: {font: '12px thrust_regular', fill: '#ffffff', align: 'left'}
  };
};

p.createDisplay = function() {
  if (!this.skinBitmap) {
    var strokeWidth = 4;
    this.skinBitmap = game.make.bitmapData(this.layoutRect.width + strokeWidth * 2,  this.layoutRect.height + strokeWidth * 2);
    this.skinBitmap.ctx.fillStyle = 'rgba(0,0,0, 0.75)';
    this.skinBitmap.ctx.strokeStyle = 'rgb(255,255,255)';
    this.skinBitmap.ctx.lineWidth = strokeWidth;
    canvas.drawRoundRect(this.skinBitmap.ctx, strokeWidth/2, strokeWidth/2, this.layoutRect.width, this.layoutRect.height, 15, true, true);
  }
  this.background = game.add.sprite(this.layoutRect.x, this.layoutRect.y, this.skinBitmap, '', this.group);
  this.createTitle();
};

p.createTitle = function () {
  this.title = game.add.text(this.layoutRect.halfWidth, 0, this.label, this.styles.title, this.group);
  this.title.anchor.setTo(0.5);
  this.title.y = this.layoutRect.height * 0.075;
};


