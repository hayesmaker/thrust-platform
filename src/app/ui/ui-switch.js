var UiComponent = require('./ui-component');
var canvas = require('../utils/canvas');
var TimelineMax = global.TimelineMax;
var TweenMax = global.TweenMax;
var Quad = global.Quad;

var p = UiSwitch.prototype = Object.create(UiComponent.prototype, {
  constructor: UiSwitch
});

module.exports = UiSwitch;

p.backgroundSkin = null;
p.buttonSkin = null;
p.selectionSkin = null;
p.isOn = false;
p.switchedOn = null;
p.switchedOff = null;
p.gamepadSelector = null;
p.originPos = null;

/**
 * Skinnable Ui switch button
 *
 * @class UiSwitch
 * @param group
 * @param name
 * @constructor
 */
function UiSwitch(group, name) {
  UiComponent.call(this, group, name, true, false);
  this.originPos = new Phaser.Point();
  this.label = this.name;
}

/**
 * @method render
 */
p.render = function () {
  UiComponent.prototype.render.call(this);
  this.createDisplay();
  this.createLabel();
  this.alignToLabel();
  this.drawSelector();
  this.initEvents();
};

/**
 * @method createDisplay
 */
p.createDisplay = function () {
  if (!this.backgroundSkin) {
    this.backgroundSkin = game.make.bitmapData(60, 20);
    this.backgroundSkin.ctx.fillStyle = 'rgba(225, 225, 225, 1)';
    canvas.drawRoundRect(this.backgroundSkin.ctx, 0, 0, 60, 20, 5, true, false);
  }
  if (!this.buttonSkin) {
    this.buttonSkin = game.make.bitmapData(36, 24);
    this.buttonSkin.ctx.fillStyle = 'rgba(161, 161, 161, 1)';
    //this.skinBitmap.ctx.strokeStyle = 'rgb(255,255,255)';
    //this.skinBitmap.ctx.lineWidth = strokeWidth;
    canvas.drawRoundRect(this.buttonSkin.ctx, 0, 0, 36, 24, 7, true, false);
  }

  if (!this.selectionSkin) {
    this.selectionSkin = game.make.bitmapData(36, 24);
    //this.selectionSkin.ctx.fillStyle = 'rgba(161, 161, 161, 0.5)';
    this.selectionSkin.ctx.fillStyle = 'rgba(161, 161, 161, 0.5)';
    canvas.drawRoundRect(this.selectionSkin.ctx, 0, 0, 36, 24, 7, true, false);
  }

  this.background = game.add.sprite(0, 0, this.backgroundSkin, '', this.group);
  this.selection = game.add.sprite(0, 0, this.selectionSkin, '', this.group);
  this.button = game.add.sprite(0, 0, this.buttonSkin, '', this.group);
  //this.button.anchor.setTo(0.5);
  this.selection.anchor.setTo(0.5);

};

p.createLabel = function() {
  this.label = game.add.text(0, 0, this.label, this.style, this.group);
  this.label.anchor.setTo(0, 0.5);
  //this.label.x = -this.button.x - this.label.width - 10;
  this.label.y = this.backgroundSkin.height / 2 + 2;
};

p.alignToLabel = function() {
  this.originPos.setTo(this.label.x + this.label.width + 10, this.backgroundSkin.height / 2 - this.button.height / 2);
  this.background.x = this.originPos.x;
  this.button.x = this.originPos.x;
  this.button.y = this.originPos.y;
  this.selection.x = this.originPos.x + this.selection.width/2;
  this.selection.y = this.originPos.y + this.selection.height/2;
};

p.drawSelector = function() {
  var w = this.background.width + 10, h = this.background.height + 10;
  var selector = game.make.bitmapData(w , h);
  selector.ctx.translate(0.5, 0.5);
  selector.ctx.beginPath();
  selector.ctx.strokeStyle =  '#ffffff';
  selector.ctx.lineWidth = 2;
  selector.ctx.setLineDash([3,2]);
  canvas.drawRoundRect(selector.ctx, 2, 2, w - 4, h-4, 2, false, true );
  var bg = this.background;
  this.gamepadSelector = game.add.sprite(bg.x - 5, bg.y -5, selector, '', this.group);
};

p.initEvents = function () {
  this.button.inputEnabled = true;
  this.background.inputEnabled = true;
  this.button.input.useHandCursor = true;
  this.button.events.onInputDown.add(this.mouseDown, this);
  this.background.inputEnabled = true;
  this.background.input.useHandCursor = true;
  this.background.events.onInputDown.add(this.mouseDown, this);
  this.switchedOn = new Phaser.Signal();
  this.switchedOff = new Phaser.Signal();
  
};

p.dispose = function() {
  this.button.inputEnabled = false;
  this.background.inputEnabled = false;
  this.button.input.useHandCursor = false;
  this.button.events.onInputDown.remove(this.mouseDown, this);
  this.background.inputEnabled = false;
  this.background.input.useHandCursor = false;
  this.background.events.onInputDown.remove(this.mouseDown, this);
  this.switchedOn = null;
  this.switchedOff = null;
};

/**
 * @method mouseDown
 */
p.mouseDown = function () {
  this.switch();
};

/**
 * @method switch
 */
p.switch = function (noAnimation) {
  this.isOn = !this.isOn;
  var switchFunc = this.isOn ? this.switchOn : this.switchOff;
  switchFunc.call(this, noAnimation);
};

/**
 * @method switchOn
 */
p.switchOn = function (noAnimation) {
  var x = this.originPos.x + this.background.width - this.button.width;
  this.selection.scale.setTo(1);
  var sX = x + this.selection.width/2;
  this.selection.alpha = 1;
  this.tl = new TimelineMax();
  var tween1 = new TweenMax(this.button, 0.2, {x: x, ease: Quad.easeOut});
  var tween2 = new TweenMax(this.selection, 0.2, {x: sX, ease: Quad.easeOut});
  this.tl.add([tween1, tween2]);
  this.tl.add(TweenMax.to(this.background, 0.2, {colorProps: {tint: 0x51b33d, tintAmount: 1, format: "number"}, ease: Quad.easeOut}), 0.1);
  this.tl.add(TweenMax.to(this.button, 0.2, {colorProps: {tint: 0x2f961f, tintAmount: 1, format: "number"}, ease: Quad.easeOut}), 0.1);
  this.tl.add(TweenMax.to(this.selection.scale, 0.25, {x: 3, y: 3, ease:Quad.easeOut}), 0.2);
  this.tl.add(TweenMax.to(this.selection, 0.25, {alpha: 0, ease:Quad.easeOut}), 0.2);
  this.switchedOn.dispatch();
  if (noAnimation) {
    this.tl.progress(1, false);
  }
  
};

/**
 * @method switchOff
 */
p.switchOff = function (noAnimation) {
  var x = this.originPos.x;
  this.selection.scale.setTo(1);
  var sX = this. originPos.x + this.selection.width/2;
  this.selection.alpha = 1;
  this.tl = new TimelineMax();
  this.tl = new TimelineMax();
  var tween1 = new TweenMax(this.button, 0.2, {x: x, ease: Quad.easeOut});
  var tween2 = new TweenMax(this.selection, 0.2, {x: sX, ease: Quad.easeOut});
  this.tl.add([tween1, tween2]);
  this.tl.add(TweenMax.to(this.background, 0.2, {colorProps: {tint: 0xffffff, tintAmount: 1, format: "number"}, ease: Quad.easeOut}), 0.1);
  this.tl.add(TweenMax.to(this.button, 0.2, {colorProps: {tint: 0xffffff, tintAmount: 1, format: "number"}, ease: Quad.easeOut}), 0.1);
  this.tl.add(TweenMax.to(this.selection.scale, 0.25, {x: 3, y: 3, ease:Quad.easeOut}), 0.2);
  this.tl.add(TweenMax.to(this.selection, 0.25, {alpha: 0, ease:Quad.easeOut}), 0.2);
  this.switchedOff.dispatch();
  if (noAnimation) {
    this.tl.progress(1, false);
  }
};

p.userSelected = function() {
  this.gamepadSelector.alpha = 1;
};

p.userDeselected = function() {
  this.gamepadSelector.alpha = 0;
};

p.apiSelect = function() {
  this.switch();
};



