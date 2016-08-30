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
 *
 */
p.render = function() {
  UiComponent.prototype.render.call(this);
  this.createDisplay();
  this.renderDefaults();
};

/**
 *
 */
p.createDisplay = function() {
  var switch1 = new UiSwitch(this.group, "Virtual Joypad");
  switch1.group.x = 350;
  switch1.group.y = 150;
  switch1.render();
  switch1.switchedOn.add(this.virtualJoypadOn, this);
  switch1.switchedOff.add(this.virtualJoypadOff, this);
  switch1.switch(true);
  this.components = [switch1];
};

/**
 *
 */
p.renderDefaults = function() {
  if (optionsModel.controls.virtualJoypad) {
    this.components[0].switch(true);
  }
};

//todo fix this dispose
p.dispose = function(){
  _.each(this.components, function(component) {
    //component.switchOn.removeAll();
    //component.switchOff.removeAll();
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