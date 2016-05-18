//noinspection JSUnresolvedFunction
var UiComponent = require('./ui-component');
var SoundOptions = require('./subscreens/sound-options');
var DisplayOptions = require('./subscreens/display-options');
var ControlsOptions = require('./subscreens/controls-options');
var GeneralOptions = require('./subscreens/general-options');
var UiPanel = require('./ui-panel');
var UiList = require('./ui-list');
var manager = require('./manager');
var UiButton = require('./ui-button');
var gameState = require('../data/game-state');
var _ = require('lodash');

var p = UiOptions.prototype = Object.create(UiComponent.prototype, {
  constructor: UiOptions
});

module.exports = UiOptions;


p.subScreenLabels = ['SOUND', 'DISPLAY', 'CONTROLS', 'GENERAL'];

p.subScreens = [];

p.panel = null;

p.group = null;

p.playState = null;

p.components = [];

p.selectedOptionIndex = 0;

p.activeOptions = [];

p.numMainOptions = 0;

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
  this.selectedOptionIndex = 0;
  this.activeOptions = [];
}

p.render = function() {
  UiComponent.prototype.render.call(this);
  this.selectedOptionIndex = 0;
  this.activeOptions = [];
  this.panel.render();
  this.layoutRect = this.panel.layoutRect;
  this.styles = this.panel.styles;
  this.createDisplay();
  this.initSubScreens();
  this.initEvents();
  this.centerDisplay();
  this.renderSubScreens();
  this.components = [this.optionsList, this.exitButton, this.soundOptions, this.displayOptions, this.controlsOptions, this.generalOptions];
  this.selectActiveOption();
};

p.createDisplay = function() {
  this.optionsList = new UiList(this.group, "OPTIONS_LIST", this.subScreenLabels);
  this.optionsList.setAutoLayout(UiComponent.HORIZONTAL);
  this.optionsList.render();
  this.optionsList.group.x = this.layoutRect.width/2 - this.optionsList.group.width/2;
  this.optionsList.group.y = this.layoutRect.height * 0.15;
  
  this.exitButton = new UiButton(this.group, "x");
  this.exitButton.render();
  this.exitButton.group.x = 20;
  this.exitButton.group.y = 20;

  console.log('ui-options :: render this.activeOptions=', this.activeOptions);
  
  this.activeOptions.push(this.exitButton);
  _.each(this.optionsList.listComponents, function(component) {
    this.activeOptions.push(component.button);
  }.bind(this));
  this.numMainOptions = this.activeOptions.length;
  console.log('this.activeOptions =-', this.activeOptions);
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

p.update = function() {
  
};

p.dispose = function() {
  UiComponent.prototype.dispose.call(this);
  this.optionsList.onItemSelected.remove(this.itemSelected, this);
  this.exitButton.onItemSelected.remove(this.exit, this);
  game.controls.cursors.up.onDown.remove(this.upPressed, this);
  game.controls.cursors.down.onDown.remove(this.downPressed, this);
  game.controls.cursors.left.onDown.remove(this.leftPressed, this);
  game.controls.cursors.right.onDown.remove(this.rightPressed, this);
  game.controls.spacePress.onDown.remove(this.spacePressed, this);
  if (game.controls.stick) {
    game.controls.buttonB.onDown.remove(this.spacePressed, this);
  }
  manager.clearSubscreens();
};

p.renderSubScreens = function() {
  this.optionsList.selectOption('SOUND');
};

p.initEvents = function() {
  this.optionsList.onItemSelected.add(this.itemSelected, this);
  this.exitButton.onItemSelected.add(this.exit, this);
  game.controls.cursors.up.onDown.add(this.upPressed, this);
  game.controls.cursors.down.onDown.add(this.downPressed, this);
  game.controls.cursors.left.onDown.add(this.leftPressed, this);
  game.controls.cursors.right.onDown.add(this.rightPressed, this);
  game.controls.spacePress.onDown.add(this.spacePressed, this);
  if (game.controls.stick) {
    game.controls.buttonB.onDown.add(this.spacePressed, this);
  }
};

p.upPressed = function() {
  if (this.selectedOptionIndex > this.numMainOptions) {
    this.selectedOptionIndex--;
  } else if (this.selectedOptionIndex === 1) {
    this.selectedOptionIndex=0;
  } else if (this.selectedOptionIndex > 0) {
    this.selectedOptionIndex=1;
  }
  this.selectActiveOption();
};

p.downPressed = function() {
  if (this.selectedOptionIndex === 0) {
    this.selectedOptionIndex = 1;
  } else if (this.selectedOptionIndex < this.numMainOptions) {
    this.selectedOptionIndex = this.numMainOptions;
  } else if (this.selectedOptionIndex < this.activeOptions.length - 1) {
    this.selectedOptionIndex++;
  }
  this.selectActiveOption();
};

p.leftPressed = function() {
  if (this.selectedOptionIndex > 0) {
    this.selectedOptionIndex--;
  }
  this.selectActiveOption();
};

p.rightPressed = function() {
  if (this.selectedOptionIndex < this.activeOptions.length - 1) {
    this.selectedOptionIndex++;
  }
  this.selectActiveOption();
};

p.selectActiveOption = function() {
  _.each(this.activeOptions, function(button) {
    button.userDeselected();
  });
  this.activeOptions[this.selectedOptionIndex].userSelected();
};

p.spacePressed = function() {
  this.pressActiveButton();
};

p.pressActiveButton = function() {
  var activeButton = this.activeOptions[this.selectedOptionIndex];
  activeButton.apiSelect()
  
};

p.itemSelected = function(id) {
  var screen = manager.showScreen(id + "_OPTIONS" , true);
  this.activeOptions.splice(this.numMainOptions);
  if (screen) {
    _.each(screen.components, function(component) {
      this.activeOptions.push(component)
    }.bind(this));
  }
  this.selectActiveOption();
};

p.exit = function() {
  this.playState.showCurrentScreenByState.call(this.playState, gameState.PLAY_STATES.MENU);
};





