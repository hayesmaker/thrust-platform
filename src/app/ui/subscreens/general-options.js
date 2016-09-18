var _ = require('lodash');
var UiComponent = require('../ui-component');
var UiButton = require('../ui-button');
var UiSwitch = require('../ui-switch');
var optionsModel = require('../../data/options-model');
var UiSelect = require('../ui-select');
var levelsLoader = require('../../utils/levels-loader');

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
 * @method levelsSelected
 * @param option
 */
p.levelsSelected = function(option) {
  console.log('levelsSelected=', option);
  optionsModel.setLevels(option);
  if (optionsModel.gameModes.levels.dirty) {
    optionsModel.gameModes.levels.current = option;
    optionsModel.loadNewLevels.dispatch();
  }
};

/**
 * @method render
 */
p.render = function() {
  UiComponent.prototype.render.call(this);
  this.createDisplay();
  this.renderDefaults();
};

p.currentOptionIndex = function(optionsData) {
  _.findIndex(optionsData, function(data) {
    return data.value === optionsModel.gameModes.levels.current;
  });
};

/**
 * @method createDisplay
 */
p.createDisplay = function() {
  var paddingFaction = this.layoutRect.height * 0.05;
  var optionsData = [
    {str: 'Classic Levels', value: 'classic'},
    {str: '2016 Levels', value: '2016'}
  ];
  var switch1 = new UiSwitch(this.group, "Speed Run") ;
  switch1.render();
  var switch2 = new UiSwitch(this.group, "Endless");
  switch2.render();
  var switch3 = new UiSwitch(this.group, "Nag\nScreens");
  switch3.render();
  var trainingLabel = game.add.text(0, 0, "Training", this.style, this.group);
  trainingLabel.x = this.layoutRect.width * 0.6;
  trainingLabel.y = this.marginTop;

  this.uiSelect = new UiSelect(this.group, "Levels:", optionsData);
  this.uiSelect.optionSelected.add(this.levelsSelected, this);
  this.uiSelect.group.x = this.layoutRect.width * 0.12;
  this.uiSelect.group.y = this.marginTop;
  this.uiSelect.render();
  this.uiSelect.overrideUserControl.add(function() {
    this.overrideUserControl.dispatch();
  }.bind(this), this);
  this.components.push(this.uiSelect);

  this.uiSelect.restoreUserControl.add(function() {
    this.restoreUserControl.dispatch();
  }.bind(this), this);

  switch1.group.x = this.uiSelect.group.x + this.uiSelect.button.group.x - switch1.originPos.x;
  switch1.group.y = this.uiSelect.group.y + this.uiSelect.label.height + paddingFaction * 2;
  switch1.switchedOn.add(this.speedRunOn, this);
  switch1.switchedOff.add(this.speedRunOff, this);
  this.components.push(switch1);
  switch2.group.x = this.uiSelect.group.x + this.uiSelect.button.group.x - switch2.originPos.x;
  switch2.group.y = switch1.group.y + switch1.group.height + paddingFaction;
  switch2.switchedOn.add(this.endlessOn, this);
  switch2.switchedOff.add(this.endlessOff, this);
  this.components.push(switch2);
  switch3.group.x = this.layoutRect.width * 0.75 - switch3.originPos.x;
  switch3.group.y = switch1.group.y;
  switch3.switchedOn.add(this.endlessOn, this);
  switch3.switchedOff.add(this.endlessOff, this);
  this.components.push(switch3);





  /*
  if (optionsModel.gameModes.speedRun.unlocked) {

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
 * @method speedRunOn
 */
p.endlessOn = function() {
  console.info('endlessOn', optionsModel);
};

/**
 * @method speedRunOff
 */
p.endlessOff = function() {

  console.info('endlessOff', optionsModel);
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
  UiComponent.prototype.dispose.call(this);
};

p.update = function() {
  if (this.uiSelect) {
    this.uiSelect.update();
  }
};
