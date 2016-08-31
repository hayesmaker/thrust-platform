var _ = require('lodash');
var UiComponent = require('../ui-component');
var UiSwitch = require('../ui-switch');
var optionsModel = require('../../data/options-model');
var sound = require('../../utils/sound');

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
 * @param layoutRect {Phaser.Rectangle} - pass as reference, the options ui-component layout rect.
 * @constructor
 */
function SoundOptions(group, name, layoutRect) {
  UiComponent.call(this, group, name, true, false);
  this.layoutRect = layoutRect;
}

p.render = function() {
  UiComponent.prototype.render.call(this);
  this.createDisplay();
  this.renderDefaults();
  //this.renderDebug(this.group.parent);
};

p.createDisplay = function() {
  var switch1 = new UiSwitch(this.group, "Music");
  switch1.render();
  switch1.group.x = this.layoutRect.halfWidth - switch1.originPos.x;
  switch1.group.y = this.layoutRect.height * 0.25;
  switch1.switchedOn.add(this.musicOn, this);
  switch1.switchedOff.add(this.musicOff, this);
  var switch2 = new UiSwitch(this.group, "Sound FX");
  switch2.render();
  switch2.group.x = this.layoutRect.halfWidth - switch2.originPos.x;
  switch2.group.y = switch1.group.y + switch1.group.height;
  switch2.switchedOn.add(this.soundOn, this);
  switch2.switchedOff.add(this.soundOff, this);
  this.components = [switch1, switch2];
};

p.renderDefaults = function() {
  if (optionsModel.sound.soundFx) {
    this.components[1].switch(true);
  }
  if (optionsModel.sound.music) {
    this.components[0].switch(true);
  }
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
  sound.stopMusic();
  optionsModel.sound.music = false;
};

p.dispose = function() {
  _.each(this.components, function(component) {
    //component.switchedOn.removeAll();
    //component.switchedOff.removeAll();
  });
  UiComponent.prototype.dispose.call(this);
};