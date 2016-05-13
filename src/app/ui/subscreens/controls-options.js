var _ = require('lodash');
var UiComponent = require('../ui-component');
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

/**
 *
 *
 * @class ControlOptions
 * @param group
 * @param name
 * @constructor
 */
function ControlOptions(group, name) {
  UiComponent.call(this, group, name, true, false);
}

p.render = function() {
  UiComponent.prototype.render.call(this);
  this.createDisplay();
};

p.createDisplay = function() {
  var switch1 = new UiSwitch(this.group, "Virtual Joypad");
  switch1.group.x = 350;
  switch1.group.y = 150;
  switch1.render();
  
  switch1.switch(true);

  this.components = [switch1];
};

p.dispose = function(){
  _.each(this.components, function(component) {
    component.dispose();
  });
};
