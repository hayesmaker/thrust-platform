var _ = require('lodash');
var UiComponent = require('../ui-component');
var UiButton = require('../ui-button');
var UiSwitch = require('../ui-switch');
var optionsModel = require('../../data/options-model');

var p = GeneralOptions.prototype = Object.create(UiComponent.prototype, {
  constructor: GeneralOptions
});

module.exports = GeneralOptions;

/**
 * @property group
 * @type {null}
 */
p.group = null;

/**
 *
 *
 * @class GeneralOptions
 * @param group
 * @param name
 * @constructor
 */
function GeneralOptions(group, name) {
  UiComponent.call(this, group, name, true, false);
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
  if (optionsModel.gameModes.speedRun.unlocked) {
    var switch1 = new UiSwitch(this.group, "Speed Run");
    switch1.group.x = 350;
    switch1.group.y = 150;
    switch1.render();
    switch1.switchedOn.add(this.speedRunOn, this);
    switch1.switchedOff.add(this.speedRunOff, this);
    this.components.push(switch1);
  }
  var resetButton = new UiButton(this.group, "Reset High Scores");
  resetButton.group.x = 200;
  resetButton.group.y = 300;
  resetButton.render();
  resetButton.onItemSelected.add(this.resetHighScores, this);
  this.components.push(resetButton);
};

/**
 * @method renderDefaults
 */
p.renderDefaults = function() {
  if (optionsModel.gameModes.speedRun.unlocked) {
    if (optionsModel.gameModes.speedRun.enabled) {
      this.components[0].switch(true);
    }
  }
};

/**
 * @method speedRunOn
 */
p.speedRunOn = function() {
  optionsModel.gameModes.speedRun.enabled = true;
};

/**
 * @method speedRunOff
 */
p.speedRunOff = function() {
  optionsModel.gameModes.speedRun.enabled = false;
  console.warn('speedRunOff', optionsModel);
};

/**
 * Clears the localStorage highscores..
 * @todo automatically reset current session's highscores also
 * @todo maybe make a confirmation dialog component
 * @todo maybe implement a restore deleted highscores
 * @method resetHighScores
 */
p.resetHighScores = function() {
  window.localStorage.clear();
};

/**
 * @method dispose
 */
p.dispose = function(){
  _.each(this.components, function(component) {
    component.dispose();
  });
};
