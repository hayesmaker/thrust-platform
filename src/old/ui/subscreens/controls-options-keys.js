var _ = require('lodash');
var UiComponent = require('../ui-component');
var optionsModel = require('../../data/options-model');
var UiSwitch = require('../ui-switch');

var p = ControlOptions.prototype = Object.create(UiComponent.prototype, {
  constructor: ControlOptions
});

module.exports = ControlOptions;

/**
 * @property group
 * @type {null}
 */
p.group = null;

p.rightTexts = [];

p.modernKeys  = ['LEFT ARROW', 'RIGHT ARROW', 'UP ARROW', 'SPACE', 'ESC'];
p.classicKeys  = ['A', 'S', 'SHIFT', 'ENTER', 'ESC'];

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
  this.rightTexts = [];
  this.layoutRect = layoutRect;
}

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
  var uiSwitch = new UiSwitch(this.group, "CLASSIC KEYS");
  uiSwitch.render();
  uiSwitch.group.x = this.layoutRect.halfWidth - uiSwitch.originPos.x;
  uiSwitch.group.y = this.marginTop;
  this.components.push(uiSwitch);
  uiSwitch.switchedOn.add(this.onSwitch, this, 0, name);
  uiSwitch.switchedOff.add(this.offSwitch, this, 0, name);

  var leftTexts = ['ROTATE LEFT', 'ROTATE RIGHT', 'THRUST', 'FIRE', 'PAUSE'];
  var lText;
  var rText;
  var fraction = this.layoutRect.height * 0.05;
  _.each(leftTexts, function(str, index) {
    lText = game.add.text(0, 0, str, this.style, this.group);
    lText.anchor.setTo(1, 0);
    lText.x = this.layoutRect.width * 0.45;
    lText.y = this.marginTop + (index + 2) * (lText.height + fraction);
  }.bind(this));
  var fieldLabels = optionsModel.controls.classicKeys? this.classicKeys : this.modernKeys;
  _.each(fieldLabels, function(str, index) {
    rText = game.add.text(0, 0, str, this.style, this.group);
    rText.anchor.setTo(0, 0);
    rText.x = this.layoutRect.width * 0.55;
    rText.y = this.marginTop + (index + 2) * (rText.height + fraction);
    this.rightTexts.push(rText);
  }.bind(this));
};

p.onSwitch = function() {
  optionsModel.controls.classicKeys = true;
  this.renderLabels();
};

p.offSwitch = function () {
  optionsModel.controls.classicKeys = false;
  this.renderLabels();
};

/**
 * @method renderDefaults
 */
p.renderDefaults = function() {
  var uiSwitch = this.getComponentByName("CLASSIC KEYS");
  if (optionsModel.controls.classicKeys) {
    uiSwitch.switchOn(true, true);
  }

};

p.renderLabels = function() {
  var fieldLabels = optionsModel.controls.classicKeys? this.classicKeys : this.modernKeys;
  _.each(this.rightTexts, function(rText, index) {
    rText.text = fieldLabels[index];
  }.bind(this));
};

/**
 * @method dispose
 * @todo fix this dispose
 */
p.dispose = function(){
  _.each(this.components, function(component) {
    component.switchedOn && component.switchedOn.removeAll();
    component.switchedOff && component.switchedOff.removeAll();
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