var _ = require('lodash');
var UiComponent = require('../ui-component');
var UiSwitch = require('../ui-switch');
var optionsModel = require('../../data/options-model');

var p = ControlOptions.prototype = Object.create(UiComponent.prototype, {
  constructor: ControlOptions
});

module.exports = ControlOptions;

/**
 * @property group
 * @type {null}
 */
p.group = null;

/**
 * @property marginTop
 * @type {number}
 */
p.marginTop = 0;

/**
 *
 *
 * @class ControlOptions
 * @param group
 * @param name
 * @param layoutRect
 * @constructor
 */
function ControlOptions(group, name, layoutRect) {
  UiComponent.call(this, group, name, true, false);
  this.layoutRect = layoutRect;
}

/**
 * @method setTopMargin
 * @param marginTop
 */
p.setTopMargin = function(marginTop) {
  this.marginTop = marginTop;
};

/**
 * @method render
 */
p.render = function() {
  UiComponent.prototype.render.call(this);
  this.createDisplay();
  this.renderDefaults();
};

/**
 * @method createDisplay
 */
p.createDisplay = function() {

  var leftTexts = ['ROTATE LEFT', 'ROTATE RIGHT', 'THRUST', 'FIRE', 'PAUSE'];
  var leftText;
  var fraction = this.layoutRect.height * 0.05;
  _.each(leftTexts, function(str, index) {
    leftText = game.add.text(0, 0, str, this.style, this.group);
    leftText.anchor.setTo(1, 0);
    leftText.x = this.layoutRect.width * 0.45;
    leftText.y = this.marginTop + index * (leftText.height + fraction);
  }.bind(this));

  var rightTexts = ['LEFT ARROW', 'RIGHT ARROW', 'UP ARROW', 'SPACE', 'ESC'];
  var rightText;
  _.each(rightTexts, function(str, index) {
    leftText = game.add.text(0, 0, str, this.style, this.group);
    leftText.anchor.setTo(0, 0);
    leftText.x = this.layoutRect.width * 0.55;
    leftText.y = this.marginTop + index * (leftText.height + fraction);
  }.bind(this));

};

/**
 * @method renderDefaults
 */
p.renderDefaults = function() {

};

/**
 * @method dispose
 * @todo fix this dispose
 */
p.dispose = function(){
  _.each(this.components, function(component) {
    component.switchOn.removeAll();
    component.switchOff.removeAll();
  });
  UiComponent.prototype.dispose.call(this);
};

/**
 *
 */
p.virtualJoypadOn = function() {
  optionsModel.controls.virtualJoypad = true;
};

/**
 *
 */
p.virtualJoypadOff = function() {
  optionsModel.controls.virtualJoypad = false;
};