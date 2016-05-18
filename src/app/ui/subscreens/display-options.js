var _ = require('lodash');
var UiComponent = require('../ui-component');
var UiSwitch = require('../ui-switch');
var optionsModel = require('../../data/options-model');

var p = DisplayOptions.prototype = Object.create(UiComponent.prototype, {
  constructor: DisplayOptions
});

module.exports = DisplayOptions;

/**
 * @property group
 * @type {null}
 */
p.group = null;

/**
 *
 *
 * @class DisplayOptions
 * @param group
 * @param name
 * @constructor
 */
function DisplayOptions(group, name) {
  UiComponent.call(this, group, name, true, false);
}

p.render = function() {
  UiComponent.prototype.render.call(this);
  this.createDisplay();
};

p.createDisplay = function() {
  var switch1 = new UiSwitch(this.group, "WebGL");
  switch1.group.x = 350;
  switch1.group.y = 150;
  switch1.render();
  switch1.switchedOn.add(this.webGlOn, this);
  switch1.switchedOff.add(this.webGlOff, this);
  var switch2 = new UiSwitch(this.group, "CRT Scanlines");
  switch2.group.x = 350;
  switch2.group.y = 210;
  switch2.render();
  switch2.switchedOn.add(this.scanlineFilterOn, this);
  switch2.switchedOff.add(this.scanlineFilterOff, this);
  switch1.switch(true);
  switch2.switch(true);
  this.components = [switch1, switch2];
};

p.dispose = function() {
  _.each(this.components, function(component) {
    //component.switchedOn.removeAll();
    //component.switchedOff.removeAll();
  });
  UiComponent.prototype.dispose.call(this);
};

p.scanlineFilterOn = function () {
  var filter = optionsModel.getFilterByName('scanlines');
  filter.scanlines = true;
  console.log('filter.scanlines=', filter.scanlines);
};

p.scanlineFilterOff = function () {
  var filter = optionsModel.getFilterByName('scanlines');
  filter.scanlines = false;
  console.log('filter.scanlines=', filter.scanlines);
};

p.webGlOn = function () {
  optionsModel.display.webGl = true;
};

p.webGlOff = function () {
  optionsModel.display.webGl = false;
};