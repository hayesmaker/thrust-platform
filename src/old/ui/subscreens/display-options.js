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
  var paddingFaction = this.layoutRect.height * 0.025;
  var switches = ['FULL SCREEN', 'PARTICLE FX', 'BACKGROUND', 'SHOW FPS', 'FPS 60'];
  var x = this.isFullLayout ? 0.5 : 0.5;
  _.each(switches, function (name, index) {
    var lock = false;
    if (name === 'FULL SCREEN' && !game.device.fullscreen) {
      lock = true;
    }
    var uiSwitch = new UiSwitch(this.group, name, lock);
    //todo allow to define positions at render time to avoid pre-render flashes
    uiSwitch.render();
    uiSwitch.group.x = this.layoutRect.width * x - uiSwitch.originPos.x;
    uiSwitch.group.y = this.marginTop + (uiSwitch.group.height + paddingFaction) * index;
    uiSwitch.switchedOn.add(this.onSwitch, this, 0, name);
    uiSwitch.switchedOff.add(this.offSwitch, this, 0, name);
    this.components.push(uiSwitch);
  }.bind(this));
};

p.onSwitch = function (name) {
  switch (name) {
    case "SHOW FPS":
      this.showFpsOn();
      break;
    case "FPS 60":
      this.fpsToggleOn();
      break;
    case  "FULL SCREEN":
      this.fullscreenOn();
      break;
    case  "PARTICLE FX":
      this.particlesOn();
      break;
    case  "BACKGROUND":
      this.backgroundOn();
      break;
  }
};

p.offSwitch = function (name) {
  switch (name) {
    case "SHOW FPS":
      this.showFpsOff();
      break;
    case "FPS 60":
      this.fpsToggleOff();
      break;
    case  "FULL SCREEN":
      this.fullscreenOff();
      break;
    case  "PARTICLE FX":
      this.particlesOff();
      break;
    case  "BACKGROUND":
      this.backgroundOff();
      break;
  }
};

p.fpsToggleOn  = function() {
  optionsModel.display.fps = 60;
  game.time.desiredFps = optionsModel.display.fps;

  console.warn('fpsToggleOn :: FPS', optionsModel.display.fps);

  var fpsSwitch = this.getComponentByName("FPS 60");
  fpsSwitch.label.text = "FPS 60";
};

p.fpsToggleOff = function() {
  optionsModel.display.fps = 30;
  game.time.desiredFps = optionsModel.display.fps;

  console.warn('fpsToggleOff :: FPS', optionsModel.display.fps);

  var fpsSwitch = this.getComponentByName("FPS 60");
  fpsSwitch.label.text = "FPS 30";
};

/**
 * @method update
 */
p.update = function () {
  var uiSwitch = this.getComponentByName("FULL SCREEN");
  if (!uiSwitch) return;
  if (game.scale.isFullScreen) {
    uiSwitch.switchOn(true);
  } else {
    uiSwitch.switchOff(true);
  }
};

/**
 * @method fullscreenOn
 */
p.fullscreenOn = function () {
  optionsModel.display.fullscreen = true;
  game.scale.startFullScreen(false);
};

/**
 * @method fullscreenOff
 */
p.fullscreenOff = function () {
  optionsModel.display.fullscreen = false;
  game.scale.stopFullScreen();
};

/**
 * @method showFpsOn
 */
p.showFpsOn = function () {
  game.time.advancedTiming = true;
  optionsModel.display.showFps = true;
};

/**
 * @method showFpsOff
 */
p.showFpsOff = function () {
  game.time.advancedTiming = false;
  optionsModel.display.showFps = false;
};


/**
 * @method particlesOn
 */
p.particlesOn = function () {
  optionsModel.display.fx.particles = true;
  optionsModel.fxParticlesOn.dispatch();
};


p.backgroundOn = function () {
  optionsModel.display.fx.background = true;
  optionsModel.fxBackgroundOn.dispatch();
};

p.particlesOff = function () {
  optionsModel.display.fx.particles = false;
  optionsModel.fxParticlesOff.dispatch();
};
p.backgroundOff = function () {
  optionsModel.display.fx.background = false;
  optionsModel.fxBackgroundOff.dispatch();
};

p.renderDefaults = function () {
  var particlesSwitch = this.getComponentByName("PARTICLE FX");
  var backgroundSwitch = this.getComponentByName("BACKGROUND");
  var fpsSwitch = this.getComponentByName("FPS 60");
  var showFpsSwitch = this.getComponentByName("SHOW FPS");
  if (optionsModel.display.showFps) {
    showFpsSwitch.switch(true);
  }
  if (optionsModel.display.fx.background) {
    backgroundSwitch.switch(true);
  }
  if (optionsModel.display.fx.particles) {
    particlesSwitch.switch(true);
  }
  if (optionsModel.display.fps === 60) {
    fpsSwitch.switch(true);
    fpsSwitch.label.text = "FPS 60";
  } else {
    fpsSwitch.label.text = "FPS 30";
  }
};

p.dispose = function () {
  _.each(this.components, function (component) {
    component.switchedOn && component.switchedOn.removeAll();
    component.switchedOff && component.switchedOff.removeAll();
  });
  UiComponent.prototype.dispose.call(this);
};
