var _ = require('lodash');
var UiComponent = require('../ui-component');
var UiSwitch = require('../ui-switch');

var p = SoundOptions.prototype = Object.create(UiComponent.prototype, {
  constructor: SoundOptions
});

module.exports = SoundOptions;

/**
 * @property group
 * @type {null}
 */
p.group = null;

/**
 *
 *
 * @class SoundOptions
 * @param group
 * @param name
 * @constructor
 */
function SoundOptions(group, name) {
  UiComponent.call(this, group, name, true, false);
}

p.render = function() {
  UiComponent.prototype.render.call(this);
  this.createDisplay();
};

p.createDisplay = function() {
  var switch1 = new UiSwitch(this.group, "Music");
  switch1.group.x = 350;
  switch1.group.y = 150;
  switch1.render();
  var switch2 = new UiSwitch(this.group, "Sound FX");
  switch2.group.x = 350;
  switch2.group.y = 210;
  switch2.render();
  switch1.switch(true);
  switch2.switch(true);
  
  this.components = [switch1, switch2];
};

p.dispose = function(){
  _.each(this.components, function(component) {
    component.dispose();
  });
};
