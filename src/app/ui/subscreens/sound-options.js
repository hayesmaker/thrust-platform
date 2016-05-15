var _ = require('lodash');
var UiComponent = require('../ui-component');
var UiSwitch = require('../ui-switch');
var optionsModel = require('../../data/options-model');

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
  switch1.switchedOn.add(this.musicOn, this);
  switch1.switchedOff.add(this.musicOff, this);

  var switch2 = new UiSwitch(this.group, "Sound FX");
  switch2.group.x = 350;
  switch2.group.y = 210;
  switch2.render();
  switch1.switch(true);
  switch2.switch(true);
  switch2.switchedOn.add(this.soundOn, this);
  switch2.switchedOff.add(this.soundOff, this);
  
  this.components = [switch1, switch2];
};

p.soundOn = function() {
  optionsModel.sound.soundFx = true;
};

p.soundOff = function() {
  optionsModel.sound.soundFx = false;
};

p.musicOn = function() {
  optionsModel.sound.music = true;
};

p.musicOff = function() {
  optionsModel.sound.music = false;
};

p.dispose = function() {
  _.each(this.components, function(component) {
    component.switchedOn.removeAll();
    component.switchedOff.removeAll();
  });
  UiComponent.prototype.dispose.call(this);
};