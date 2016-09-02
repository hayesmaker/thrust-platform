var _ = require('lodash');
var UiComponent = require('../ui-component');
var UiButton = require('../ui-button');
var UiSwitch = require('../ui-switch');
var optionsModel = require('../../data/options-model');
var UiSelect = require('../ui-select');

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
 * @param layoutRect
 * @constructor
 */
function GeneralOptions(group, name, layoutRect) {
  UiComponent.call(this, group, name, true, false);
  this.layoutRect = layoutRect;
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

  var optionsData = [
    {str: 'Classic Retro', value: 'classic'},
    {str: '2016 Levels', value: '2016'},
    {str: 'Classic Endless', value: 'endless'},
    {str: 'Classic Speed Run', value: 'speed-run'}
  ];

  var uiSelect = new UiSelect(this.group, "Game Modes:", optionsData);
  uiSelect.group.x = 350;
  uiSelect.group.y = 150;

  uiSelect.render();
  uiSelect.overrideUserControl.add(function() {
    this.overrideUserControl.dispatch();
  }.bind(this), this);
  this.components.push(uiSelect);

  uiSelect.restoreUserControl.add(function() {
    this.restoreUserControl.dispatch();
  }.bind(this), this);

  /*
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
  */
};

/**
 * @method renderDefaults
 */
p.renderDefaults = function() {
  /*
  if (optionsModel.gameModes.speedRun.unlocked) {
    if (optionsModel.gameModes.speedRun.enabled) {
      this.components[0].switch(true);
    }
  }
  */
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
