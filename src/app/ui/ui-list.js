module.exports = UIList;

var _ = require('lodash');
var canvas = require('../utils/canvas');

//var manager = require('./manager');
var UiComponent = require('./ui-component');
/**
 * @property UiComponent
 * @constructor
 */
function UIList(group, name, listItems) {
  UiComponent.call(this, group, name, true, false);
  this.listItems = listItems || [];
  this.listComponents = [];
  console.log('ui-list :: render : ', this.listItems);
}

var p = UIList.prototype = Object.create(UiComponent.prototype, {
  constructor: UIList
});

/**
 * Objects in this array are the cached textfields and graphics
 * Used in this list
 * 
 * @property listComponents
 * @type {Array}
 */
p.listComponents = [];

/**
 * @property listItems
 * @type {Array}
 */
p.listItems = [];

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
 * Custom Layout for Lists can be achieved
 * by providing an array of Phaser.Points to this array
 * Not used if one of the autoLayout methods is used.
 *
 * @property  layout
 * @type {Array}
 */
p.layout = [];

/**
 * @property layoutType
 * @type {string}
 * @default "VERTICAL"
 */
p.layoutType = UiComponent.VERTICAL;

/**
 * @property selectedIndex
 * @type {number}
 */
p.selectedIndex = 0;

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

p.onItemSelected = new Phaser.Signal();

/**
 * @method setAutoLayout;
 * @param layoutType {String|"VERTICAL"|"HORIZONTAL"}
 */
p.setAutoLayout = function(layoutType) {
  console.log('setAutoLayout : this.layoutType = ', layoutType);
  this.layoutType = layoutType;
};

/**
 * @method render
 */
p.render = function() {
  _.each(
    this.listItems,
    _.bind(
      this.drawItem,
      this
    )
  );

  this.initEvents();
};

/**
 * @property drawPosition
 * @type {number}
 */
p.drawPosition = p.padding + p.margin;

/**
 * //todo draw bitmaps instead of Graphic for item backgrounds
 *
 * @method drawItem
 * @param label
 * @param index
 */
p.drawItem = function(label, index) {
  console.log('ui-list :: drawItem', this.listComponents, this.layoutType);
  var text = game.add.text(0, 0, label, this.style, this.group);
  var x, y;
  if (this.layoutType === UiComponent.HORIZONTAL) {
    x = this.drawPosition;
    this.drawPosition += text.width + this.padding * 2 + this.margin * 2;
    y = 0;
  } else if (this.layoutType === UiComponent.VERTICAL) {
    x = 0;
    y = this.drawPosition;
    this.drawPosition += text.height + this.padding * 2 + this.margin * 2;
  } else {
    x = this.layout[index].x;
    y = this.layout[index].y;
  }
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
  this.listComponents.push({
    id: label,
    tf: text,
    spr: spr
  });
};

p.hideSelectionBackgrounds = function() {
  _.each(this.listComponents, function(component) {
    component.spr.alpha = 0;
  });
};

p.initEvents = function () {
  _.each(this.listComponents, function(component) {
    component.spr.inputEnabled = true;
    component.spr.useHandCursot = true;
    component.spr.events.onInputDown.add(this.componentMouseDown, this, 0, component.id);
  }.bind(this));
};

p.dispose = function() {
  UiComponent.prototype.dispose.call(this);
  console.log('ui-list :: dispose', this, this.listComponents);
  _.each(this.listComponents, function(component) {
    component.spr.inputEnabled = false;
    component.spr.useHandCursot = false;
    component.spr.events.onInputDown.remove(this.componentMouseDown, this);
  }.bind(this));
  this.listComponents = [];
  console.log('ui0list :: dispose', this.listComponents);
};

p.componentMouseDown = function(arg1, arg2, id) {
  this.selectOption(id);
};

p.selectOption = function(id) {
  console.log('selectOption :: id=', id, this.listComponents);
  var component = this.getComponentById(id);
  _.each(this.listComponents, this.deselectComponent);
  this.selectComponent(component);
  this.onItemSelected.dispatch(component);
};

p.getComponentById = function(id) {
  return _.find(this.listComponents, function(component) {
    return component.id === id;
  });
};

p.selectComponent = function(component) {
  component.spr.tint = 0x51b33d;
};

p.deselectComponent = function(component) {
  component.spr.tint = 0xffffff;
};