//noinspection JSUnresolvedFunction
var UiComponent = require('./ui-component');
var SoundOptions = require('./subscreens/sound-options');
var DisplayOptions = require('./subscreens/display-options');
var ControlsOptions = require('./subscreens/controls-options-keys');
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

/**
 * @todo fix bug in activeOptions:
 * @todo Uncaught TypeError: Cannot read property 'userSelected' of undefined
 * @todo this.activeOptions[this.selectedOptionIndex].userSelected();
 * @type {Array}
 */
p.activeOptions = [];
p.numMainOptions = 0;
p.stickUpPressed = false;
p.stickDownPressed = false;
p.stickLeftPressed = false;
p.stickRightPressed = false;
p.isActive = false;

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
  this.isActive = true;
};

p.createDisplay = function() {
  var paddingPerc = this.isFullLayout? 0.05 : 0.05;
  this.exitButton = new UiButton(this.group, "<");
  this.exitButton.render();
  this.exitButton.group.x = this.layoutRect.height * 0.02;
  this.exitButton.group.y = this.layoutRect.height * 0.02;
  this.optionsList = new UiList(this.group, "OPTIONS_LIST", this.subScreenLabels);
  this.optionsList.setAutoLayout(UiComponent.HORIZONTAL);
  this.optionsList.render();
  this.optionsList.group.y = this.layoutRect.height * paddingPerc;
  this.optionsList.group.x = this.layoutRect.halfWidth - this.optionsList.group.width/2;
  this.activeOptions.push(this.exitButton);
  _.each(this.optionsList.listComponents, function(component) {
    this.activeOptions.push(component.button);
  }.bind(this));
  this.numMainOptions = this.activeOptions.length;
};



p.initSubScreens = function() {
  this.soundOptions = new SoundOptions(this.group, "SOUND_OPTIONS", this.layoutRect);
  this.soundOptions.addAsSubScreen();
  this.displayOptions = new DisplayOptions(this.group, "DISPLAY_OPTIONS", this.layoutRect);
  this.displayOptions.addAsSubScreen();
  this.controlsOptions = new ControlsOptions(this.group, "CONTROLS_OPTIONS", this.layoutRect);
  this.controlsOptions.setTopMargin(this.optionsList.group.y + this.optionsList.group.height + this.layoutRect.height * 0.05);
  this.controlsOptions.addAsSubScreen();
  this.generalOptions = new GeneralOptions(this.group, "GENERAL_OPTIONS", this.layoutRect);
  this.generalOptions.addAsSubScreen();
  this.generalOptions.overrideUserControl.add(this.removeActiveEvents, this);
  this.generalOptions.restoreUserControl.add(this.addActiveEvents, this);
};

p.update = function() {
  if (!this.isActive) {
    return;
  }
  var stick = game.controls.stick;
  if (stick) {
    if (stick.isDown) {
     this.preparePress(stick.direction);
    } else {
      if (this.stickDownPressed) {
        this.stickDownPressed = false;
        this.downPressed();
      }
      if (this.stickUpPressed) {
        this.stickUpPressed = false;
        this.upPressed();
      }
      if (this.stickLeftPressed) {
        this.stickLeftPressed = false;
        this.leftPressed();
      }
      if (this.stickRightPressed) {
        this.stickRightPressed = false;
        this.rightPressed();
      }
    }
  }
};

/**
 *
 * @param directionStr
 */
p.preparePress = function(directionStr) {
  this.stickUpPressed = directionStr === Phaser.UP;
  this.stickDownPressed = directionStr === Phaser.DOWN;
  this.stickLeftPressed = directionStr === Phaser.LEFT;
  this.stickRightPressed = directionStr === Phaser.RIGHT;
};

p.renderSubScreens = function() {
  this.optionsList.selectOption('SOUND');
};

p.initEvents = function() {
  this.optionsList.onItemSelected.add(this.itemSelected, this);
  this.exitButton.onItemSelected.add(this.exit, this);
  this.addActiveEvents();
};

p.addActiveEvents = function() {
  if (game.controls.useKeys) {
    game.controls.cursors.up.onDown.add(this.upPressed, this);
    game.controls.cursors.down.onDown.add(this.downPressed, this);
    game.controls.cursors.left.onDown.add(this.leftPressed, this);
    game.controls.cursors.right.onDown.add(this.rightPressed, this);
    game.controls.spacePress.onDown.add(this.spacePressed, this);
  }
  if (game.controls.useVirtualJoypad) {
    game.controls.buttonB.onDown.add(this.spacePressed, this);
  }
  if (game.controls.useExternalJoypad) {
    game.externalJoypad.up.onDown.add(this.upPressed, this);
    game.externalJoypad.down.onDown.add(this.downPressed, this);
    game.externalJoypad.left.onDown.add(this.leftPressed, this);
    game.externalJoypad.right.onDown.add(this.rightPressed, this);
    game.externalJoypad.fireButton.onDown.add(this.spacePressed, this);
  }
};

/**
 * @method dispose
 */
p.dispose = function() {
  UiComponent.prototype.dispose.call(this);
  this.optionsList.onItemSelected.remove(this.itemSelected, this);
  this.exitButton.onItemSelected.remove(this.exit, this);
  this.removeActiveEvents();
  manager.clearSubscreens();
  this.isActive = false;
};


p.removeActiveEvents = function() {
  console.log('removeActiveEvents', this);
  if (game.controls.useKeys) {
    game.controls.cursors.up.onDown.remove(this.upPressed, this);
    game.controls.cursors.down.onDown.remove(this.downPressed, this);
    game.controls.cursors.left.onDown.remove(this.leftPressed, this);
    game.controls.cursors.right.onDown.remove(this.rightPressed, this);
    game.controls.spacePress.onDown.remove(this.spacePressed, this);
  }
  if (game.controls.useVirtualJoypad) {
    game.controls.buttonB.onDown.remove(this.spacePressed, this);
  }
  if (game.controls.useExternalJoypad) {
    game.externalJoypad.up.onDown.remove(this.upPressed, this);
    game.externalJoypad.down.onDown.remove(this.downPressed, this);
    game.externalJoypad.left.onDown.remove(this.leftPressed, this);
    game.externalJoypad.right.onDown.remove(this.rightPressed, this);
    game.externalJoypad.fireButton.onDown.remove(this.spacePressed, this);
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
  activeButton.apiSelect();
  
};

p.itemSelected = function(id) {
  var screen = manager.showScreen(id + "_OPTIONS" , true);
  this.activeOptions.splice(this.numMainOptions);
  if (screen) {
    _.each(screen.components, function(component) {
      this.activeOptions.push(component);
    }.bind(this));
  }
  this.selectActiveOption();
};

p.exit = function() {
  this.playState.showCurrentScreenByState.call(this.playState, gameState.PLAY_STATES.MENU);
};





