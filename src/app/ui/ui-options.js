var _ = require('lodash');
var UiComponent = require('./ui-component');
var SoundOptions = require('./subscreens/sound-options');
var DisplayOptions = require('./subscreens/display-options');
var ControlsOptions = require('./subscreens/controls-options');
var GeneralOptions = require('./subscreens/general-options');
var canvas = require('../utils/canvas');
var UiPanel = require('./ui-panel');
var UiList = require('./ui-list');
var manager = require('./manager');

var p = UiOptions.prototype = Object.create(UiComponent.prototype, {
  constructor: UiOptions
});

module.exports = UiOptions;


p.subScreenLabels = ['SOUND', 'DISPLAY', 'CONTROLS', 'GENERAL'];

p.subScreens = [];

p.panel = null;

p.group = null;

/**
 *
 *
 * @class UIOptions
 * @param group
 * @param name
 * @param playState
 * @constructor
 */
function UiOptions(group, name, playState) {
  UiComponent.call(this, group, name, true, true);
  this.playState = playState;
  this.panel = new UiPanel(this.group, name, playState);
}

p.render = function() {
  UiComponent.prototype.render.call(this);
  this.panel.render();
  this.layoutRect = this.panel.layoutRect;
  this.styles = this.panel.styles;
  this.createDisplay();
  this.initSubScreens();
  this.initEvents();
  this.centerDisplay();
  this.renderSubScreens();
};

p.createDisplay = function() {
  console.log('ui-options :: createDisplay');
  this.optionsList = new UiList(this.group, "OPTIONS_LIST", this.subScreenLabels);
  this.optionsList.setAutoLayout(UiComponent.HORIZONTAL);
  this.optionsList.render();
  this.optionsList.group.x = this.layoutRect.width/2 - this.optionsList.group.width/2;
  this.optionsList.group.y = this.layoutRect.height * 0.15;
};

p.initSubScreens = function() {
  this.soundOptions = new SoundOptions(this.group, "SOUND_OPTIONS");
  this.soundOptions.addAsSubScreen();
  this.displayOptions = new DisplayOptions(this.group, "DISPLAY_OPTIONS");
  this.displayOptions.addAsSubScreen();
  this.controlsOptions = new ControlsOptions(this.group, "CONTROLS_OPTIONS");
  this.controlsOptions.addAsSubScreen();
  this.generalOptions = new GeneralOptions(this.group, "GENERAL_OPTIONS");
  this.generalOptions.addAsSubScreen();
};

p.renderSubScreens = function() {
  this.optionsList.selectOption('SOUND');
};

p.initEvents = function() {
  this.optionsList.onItemSelected.add(this.itemSelected, this);
};

p.itemSelected = function(item) {
  manager.showScreen(item.id + "_OPTIONS" , true);
};





