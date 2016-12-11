var _ = require('lodash');
var UiComponent = require('../ui-component');
var UiSwitch = require('../ui-switch');
var optionsModel = require('../../data/options-model');
var gameState = require('../../data/game-state');
var UiSelect = require('../ui-select');
var properties = require('../../properties');
var levelManager = require('../../data/level-manager');

var p = Sandbox.prototype = Object.create(UiComponent.prototype, {
  constructor: Sandbox
});

module.exports = Sandbox;

/**
 * @property group
 * @type {null}
 */
p.group = null;

/**
 *
 * @class GeneralOptions
 * @param group
 * @param name
 * @param layoutRect
 * @constructor
 */
function Sandbox(group, name, layoutRect) {
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
  var paddingFaction = this.layoutRect.height * 0.025;
  var switch1 = new UiSwitch(this.group, "Infinite Lives") ;
  switch1.render();
  var switch2 = new UiSwitch(this.group, "Infinite Fuel") ;
  switch2.render();
  var switch3 = new UiSwitch(this.group, "Collision Hack");
  switch3.render();

  var optionsData = _.map(levelManager.levels, function(level, index) {
    var level = parseInt(index + 1, 10);
    return {
      str: "LEVEL " + level,
      value: index
    }
  });

  this.uiSelect = new UiSelect(this.group, "Starting Level:", optionsData);
  this.uiSelect.optionSelected.add(this.startLevelSelected, this);
  this.uiSelect.render();
  this.uiSelect.overrideUserControl.add(function() {
    this.overrideUserControl.dispatch();
  }.bind(this), this);
  this.uiSelect.restoreUserControl.add(function() {
    this.restoreUserControl.dispatch();
  }.bind(this), this);

  switch1.group.x = this.layoutRect.width * 0.5 - switch1.originPos.x;
  switch1.group.y = this.marginTop;
  switch1.switchedOn.add(this.infiniteLivesOn, this);
  switch1.switchedOff.add(this.infiniteLivesOff, this);
  this.components.push(switch1);
  switch2.group.x = this.layoutRect.width * 0.5 - switch2.originPos.x;
  switch2.group.y = switch1.group.y + switch1.group.height + paddingFaction;
  switch2.switchedOn.add(this.infiniteFuelOn, this);
  switch2.switchedOff.add(this.infiniteFuelOff, this);
  this.components.push(switch2);
  switch3.group.x = this.layoutRect.width * 0.5 - switch3.originPos.x;
  switch3.group.y = switch2.group.y + switch2.group.height + paddingFaction;
  switch3.switchedOn.add(this.fatalCollisionsOff, this);
  switch3.switchedOff.add(this.fatalCollisionsOn, this);
  this.components.push(switch3);

  this.uiSelect.group.x = this.layoutRect.width * 0.3;
  this.uiSelect.group.y = switch3.group.y + switch3.group.height + paddingFaction * 4;
  this.components.push(this.uiSelect);
};

p.startLevelSelected = function(val) {
  if (levelManager.setNewLevel(val)) {
    gameState.cheats.startDebugLevel = true;
  }
};

p.infiniteLivesOn = function() {
  gameState.cheats.infiniteLives = true;
};

p.infiniteLivesOff = function() {
  gameState.cheats.infiniteLives = false;
};

p.infiniteFuelOn = function() {
  gameState.cheats.infiniteFuel = true;
};

p.infiniteFuelOff = function() {
  gameState.cheats.infiniteFuel = false;
};

p.fatalCollisionsOff = function() {
  gameState.cheats.fatalCollisions = false;
};

p.fatalCollisionsOn = function() {
  gameState.cheats.fatalCollisions = true;
};


/**
 * @method renderDefaults
 */
p.renderDefaults = function() {

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

};
