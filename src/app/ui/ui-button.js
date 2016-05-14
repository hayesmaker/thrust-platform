module.exports = UiButton;

var canvas = require('../utils/canvas');

//var manager = require('./manager');
var UiComponent = require('./ui-component');
/**
 * @property UiComponent
 * @constructor
 */
function UiButton(group, name) {
  UiComponent.call(this, group, name, true, false);
  this.label = this.name;
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
p.onItemSelected = new Phaser.Signal();

/**
 * @property buttonElements
 * @type {{}}
 */
p.buttonElements = {};

/**
 * @method render
 */
p.render = function() {
  this.drawItem();
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
  var text = game.add.text(0, 0, this.label, this.style, this.group);
  var x = 0, y = 0;
  text.x = x;
  text.y = y;
  x = text.x - this.padding;
  y = text.y - this.padding;
  var width = text.width + this.padding * 2;
  var height = text.height + this.padding * 2;
  var backgroundSkin = game.make.bitmapData(width, height);
  backgroundSkin.ctx.fillStyle = 'rgba(225, 225, 225, 0.7)';
  canvas.drawRoundRect(backgroundSkin.ctx, 0, 0, width, height, 5, true, false);
  var spr = game.add.sprite(x, y, backgroundSkin, '', this.group);
  this.buttonElements = {
    id: this.label,
    tf: text,
    spr: spr
  };
};

p.hideSelectionBackground = function() {
  this.buttonElements.spr.alpha = 0;

};

p.initEvents = function () {
  var spr = this.buttonElements.spr;
  spr.inputEnabled = true;
  spr.useHandCursot = true;
  spr.events.onInputDown.add(this.componentMouseDown, this, 0, spr.id);
};

p.dispose = function() {
  var spr = this.buttonElements.spr;
  spr.inputEnabled = false;
  spr.useHandCursot = false;
  spr.events.onInputDown.remove(this.componentMouseDown, this);
};

p.componentMouseDown = function(arg1, arg2, id) {
  this.selectOption(id);
};

p.selectOption = function(id) {
  this.onItemSelected.dispatch(this.buttonElements, id);
};

p.selectComponent = function() {
  var component = this.buttonElements;
  component.spr.tint = 0x51b33d;
};

p.deselectComponent = function() {
  var component = this.buttonElements;
  component.spr.tint = 0xffffff;
};