var _ = require('lodash');
var UiComponent = require('../ui-component');
var UiSwitch = require('../ui-switch');

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
  var switch2 = new UiSwitch(this.group, "CRT Scanlines");
  switch2.group.x = 350;
  switch2.group.y = 210;
  switch2.render();
  switch1.switch(true);
  switch2.switch(true);
  this.components = [switch1, switch2];
};