var _ = require('lodash');
var UiComponent = require('./ui-component');
var UiSwitch = require('./ui-switch');
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
  this.panel.render();
  this.layoutRect = this.panel.layoutRect;
  this.styles = this.panel.styles;
  this.createDisplay();
  this.initSubScreens();
  this.renderSubScreens();
  this.initEvents();
  this.centerDisplay();
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
  _.each(this.subScreenLabels, function(label) {
    var subScreen = new UiComponent(this.group, label, true, false);
    subScreen.addAsSubScreen();
    this.subScreens.push(subScreen);
  }.bind(this));
};

p.renderSubScreens = function() {
  this.soundOptions = manager.getScreenByName("sound");
  this.displayOptions = manager.getScreenByName('display');
  this.controlOptions = manager.getScreenByName('controls');
  this.generalOptions = manager.getScreenByName('general');
  var switch1 = new UiSwitch(this.soundOptions.group, "Music");
  this.soundOptions.add(switch1);
  switch1.group.x = 350;
  switch1.group.y = 150;
  var switch2 = new UiSwitch(this.soundOptions.group, "Sound FX");
  this.soundOptions.add(switch2);
  switch2.group.x = 350;
  switch2.group.y = 210;
  manager.showScreen("sound", true);
  switch1.switch(true);
  switch2.switch(true);
};

p.initEvents = function() {
  this.optionsList.onItemSelected.add(this.itemSelected, this);
};

p.itemSelected = function(item) {
  manager.showScreen(item.id , true);
};





