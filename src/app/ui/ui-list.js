module.exports = UiList;

var _ = require('lodash');
var canvas = require('../utils/canvas');
var UiComponent = require('./ui-component');
var UiButton = require('./ui-button');
/**
 * @class UiList
 * @constructor
 */
function UiList(group, name, listItems) {
  UiComponent.call(this, group, name, true, false);
  this.listItems = listItems || [];
  this.listComponents = [];
  console.log('ui-list :: render : ', this.listItems);
}

var p = UiList.prototype = Object.create(UiComponent.prototype, {
  constructor: UiList
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
p.margin = 0;

/**
 * @property padding
 * @type {number}
 */
p.padding = 0;

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
 *
 * @type {null}
 */
p.currentSelectedId = null;

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

  var button = new UiButton(this.group, label);
  button.render();

  //var text = game.add.text(0, 0, label, this.style, this.group);
  var x, y;
  if (this.layoutType === UiComponent.HORIZONTAL) {
    x = this.drawPosition;
    this.drawPosition += button.group.width + this.padding * 2 + this.margin * 2;
    y = 0;
  } else if (this.layoutType === UiComponent.VERTICAL) {
    x = 0;
    y = this.drawPosition;
    this.drawPosition += button.group.height + this.padding * 2 + this.margin * 2;
  } else {
    x = this.layout[index].x;
    y = this.layout[index].y;
  }
  button.group.x = x;
  button.group.y = y;


  this.listComponents.push({
    id: label,
    button: button
  });
};

p.hideSelectionBackgrounds = function() {
  _.each(this.listComponents, function(component) {
    component.spr.alpha = 0;
  });
};

p.initEvents = function () {
  _.each(this.listComponents, function(component) {
    component.button.onItemSelected.add(this.selectOption, this);
  }.bind(this));
};

p.dispose = function() {
  UiComponent.prototype.dispose.call(this);
  console.log('ui-list :: dispose', this, this.listComponents);
  _.each(this.listComponents, function(component) {
    component.button.onItemSelected.remove(this.selectOption, this);
    component.button.dispose();
  }.bind(this));
  this.listComponents = [];
  console.log('ui0list :: dispose', this.listComponents);
};

p.componentMouseDown = function(arg1, arg2, id) {
  this.selectOption(id);
};

p.selectOption = function(id, button) {
  console.log('selectOption :: ', button, id, this.listComponents);
  if (id !== this.currentSelectedId) {
    _.each(this.listComponents, this.deselectComponent);
    if (!button) {
      button = this.getButtonById(id);
    }
    this.selectComponent(button);
    this.onItemSelected.dispatch(id);
    this.currentSelectedId = id;
  }
};

p.getButtonById = function(id) {
  var listComponent = _.find(this.listComponents, function(component) {
    return component.id === id;
  });
  console.log('getButtonById id=', id, listComponent);
  return listComponent.button;
};

p.selectComponent = function(button) {
  //component.spr.tint = 0x51b33d;
  button.selectComponent();
};

p.deselectComponent = function(component) {
  //component.spr.tint = 0xffffff;
  component.button.deselectComponent();
};