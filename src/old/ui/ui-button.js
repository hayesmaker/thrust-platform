module.exports = UiButton;

var canvas = require('../utils/canvas');
var UiComponent = require('./ui-component');
/**
 * Generic UiButton component
 * Draws a grpahic, text and a selector sprite
 * The graphic can change tint if activated.
 * The selector should be visible when this UiComponent is selected in game to allow for
 * controlling the Ui via game controls (keys / gamepads)
 *
 * @class UiButton
 * @constructor
 */
function UiButton(group, name) {
  UiComponent.call(this, group, name, true, false);
  this.label = this.name;
  this.onItemSelected = new Phaser.Signal();
}

var p = UiButton.prototype = Object.create(UiComponent.prototype, {
  constructor: UiButton
});

/**
 * @property margin
 * @type {number}
 */
p.margin = 2;

/**
 * @property padding
 * @type {number}
 */
p.padding = 10;

p.selectionPadding = 5;

/**
 * @property stickUpPressed
 * @type {boolean}
 */
p.leftPressed = false;

/**
 * @property stickDownPressed
 * @type {boolean}
 */
p.rightPressed = false;

/**
 * @property onItemSelected
 * @type {Phaser.Signal}
 */
p.onItemSelected = null;

/**
 * @property buttonElements
 * @type {{}}
 */
p.buttonElements = {};

p.gamepadSelector = null;

/**
 * @method render
 */
p.render = function() {
  UiComponent.prototype.render.call(this);
  this.drawItem();
  this.drawSelector();
  this.initEvents();

};

/**
 * 
 * @property drawPosition
 * @type {number}
 */
p.drawPosition = p.padding + p.margin;

/**
 * todo make skinnable
 * @method drawItem
 * @param label
 */
p.drawItem = function() {
  var text = game.make.text(0, 0, this.label, this.getDarkStyle());
  var x = this.selectionPadding, y = this.selectionPadding;
  var width = text.width + this.padding * 2;
  var height = text.height + this.padding * 2;
  var backgroundSkin = game.make.bitmapData(width, height);
  backgroundSkin.ctx.fillStyle = 'rgba(225, 225, 225, 0.7)';
  canvas.drawRoundRect(backgroundSkin.ctx, 0, 0, width, height, 5, true, false);
  var spr = game.add.sprite(x, y, backgroundSkin, '', this.group);
  text.x = spr.x + this.padding;
  text.y = spr.y + this.padding * 1.25;
  this.group.add(text);
  this.buttonElements = {
    id: this.label,
    tf: text,
    spr: spr
  };


};

p.drawSelector = function() {
  var w = this.group.width + this.selectionPadding * 2, h = this.group.height + this.selectionPadding * 2;
  var selector = game.make.bitmapData(w , h);
  selector.ctx.translate(0.5, 0.5);
  selector.ctx.beginPath();
  selector.ctx.strokeStyle =  '#ffffff';
  selector.ctx.lineWidth = 2;
  selector.ctx.setLineDash([3,2]);
  canvas.drawRoundRect(selector.ctx, 2, 2, w - 4, h-4, 2, false, true );
  var bg = this.buttonElements.spr;
  this.gamepadSelector = game.add.sprite(bg.x - this.selectionPadding, bg.y -this.selectionPadding, selector, '', this.group);
  this.userDeselected();
};

p.userSelected = function() {
  this.gamepadSelector.alpha = 1;
};

p.userDeselected = function() {
  this.gamepadSelector.alpha = 0;
};

p.hideSelectionBackground = function() {
  this.buttonElements.spr.alpha = 0;
};

p.initEvents = function () {
  var spr = this.buttonElements.spr;
  spr.inputEnabled = true;
  spr.useHandCursot = true;
  spr.events.onInputDown.add(this.componentMouseDown, this, 0, this.buttonElements.id);
};

p.dispose = function() {
  var spr = this.buttonElements.spr;
  spr.inputEnabled = false;
  spr.useHandCursot = false;
  spr.events.onInputDown.remove(this.componentMouseDown, this);
  this.onItemSelected.removeAll();
  this.onItemSelected = null;
};

p.componentMouseDown = function(arg1, arg2, id) {
  this.selectOption(id);
};

p.apiSelect = function() {
  this.selectOption(this.buttonElements.id);
};

p.selectOption = function(id) {
  this.onItemSelected.dispatch(id, this);
};

p.selectComponent = function() {
  var component = this.buttonElements;
  component.spr.tint = 0x51b33d;
};

p.deselectComponent = function() {
  var component = this.buttonElements;
  component.spr.tint = 0xffffff;
};