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
 * @param layoutRect
 * @constructor
 */
function DisplayOptions(group, name, layoutRect) {
  UiComponent.call(this, group, name, true, false);
  this.layoutRect = layoutRect;
}

/**
 * @property render
 */
p.render = function () {
  UiComponent.prototype.render.call(this);
  this.createDisplay();
  this.renderDefaults();
};

/**
 * @method createDisplay
 */
p.createDisplay = function () {
  var switches = ['FULL SCREEN', 'PARTICLE FX', 'BACKGROUND'];
  var x = this.isFullLayout? 0.5 : 0.4;
  _.each(switches, function(name, index) {
    var uiSwitch = new UiSwitch(this.group, name);
    //todo allow to define positions at render time to avoid pre-render flashes
    uiSwitch.render();
    uiSwitch.group.x = this.layoutRect.width * x - uiSwitch.originPos.x;
    uiSwitch.group.y = this.layoutRect.height * 0.25 + uiSwitch.group.height * index;
    uiSwitch.switchedOn.add(this.onSwitch, this, 0, name);
    uiSwitch.switchedOff.add(this.offSwitch, this, 0, name);
    this.components.push(uiSwitch);
  }.bind(this));
};

p.onSwitch = function(name) {
  console.log('onSwitch=', name);


};

p.offSwitch = function(name) {

};

p.renderDefaults = function () {

  /*
  var filter = optionsModel.getFilterByName('scanlines');
  if (filter.scanlines) {
    this.components[1].switch(true);
  }
  if (optionsModel.display.webGl) {
    this.components[0].switch(true);
  }
  */
};

p.dispose = function () {
  _.each(this.components, function (component) {
    //component.switchedOn.removeAll();
    //component.switchedOff.removeAll();
  });
  UiComponent.prototype.dispose.call(this);
};

p.scanlineFilterOn = function () {
  var filter = optionsModel.getFilterByName('scanlines');
  filter.scanlines = true;
};

p.scanlineFilterOff = function () {
  var filter = optionsModel.getFilterByName('scanlines');
  filter.scanlines = false;
};

p.webGlOn = function () {
  optionsModel.display.webGl = true;
};

p.webGlOff = function () {
  optionsModel.display.webGl = false;
};