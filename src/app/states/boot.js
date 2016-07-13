'use strict';

var properties = require('../properties');
var features = require('../utils/features');
var UserControl = require('../environment/UserControl');
var levelManager = require('../data/level-manager');
var particles = require('../environment/particles/manager');
var gameState = require('../data/game-state');
var userControl;

/**
 * The boot state
 *
 * @module states
 * @namespace states
 * @submodule boot
 * @class boot
 * @type {Phaser.State}
 * @static
 */
module.exports = {
  /**
   * @property bootScreen
   */
  bootScreen: null,
  /**
   * Preload the title screen
   * Initialise the e2e hooks object
   *
   * @method preload
   */
  preload: function () {
    game.load.image('title', 'assets/images/title.png');
  },

  /**
   * Initialises key game management systems:
   * * Features
   * * Level Manager
   * * Scaling
   * * phaser timing mode
   * * User control
   * * Display title splash screen
   * * Initialise title screen events
   *
   * @method create
   */
  create: function () {
    console.log('boot :: create');
    features.init();
    levelManager.init();
    particles.init();
    gameState.init();
    game.scale.scaleMode = features.isTouchScreen ? properties.scale.device : properties.scale.web;
    if (properties.dev.stats) {
      game.time.advancedTiming = true;
    }
    userControl = new UserControl(features);
    console.warn("Instructions: Use Cursors to move ship, space to shoot, collect orb by passing near");
    console.warn("TouchScreenDetected : features=", features);
    console.warn("ControlMethods:", userControl);
    console.warn("ScaleMode:", game.scale.scaleMode);
    game.controls = userControl;
    game.e2e = {};

    if (properties.dev.skipSplashScreen) {
      this.startLoad();
    } else {
      this.bootScreen = game.add.sprite(0,0, 'title');
      this.bootScreen.inputEnabled = true;
      this.bootScreen.useHandCursor = true;
      this.bootScreen.events.onInputDown.add(this.startLoad, this);
      this.bootScreen.width = properties.width;
      this.bootScreen.height = properties.height;
      game.e2e.boot = this;
      if (game.controls.useKeys) {
        game.controls.spacePress.onDown.add(this.startLoad, this);
      }
    }
  },

  /**
   * @method update
   */
  update:function() {
    if (game.externalJoypad && game.externalJoypad.fireButton.isDown) {
      this.startLoad();
    }
  },


  /**
   * Launch game on correct user input
   *
   * @method startGame
   */
  startLoad: function() {
    if (this.bootScreen) {
      this.bootScreen.events.onInputDown.remove(this.startLoad, this);
    }
    game.state.start('load', false, false);
  }
};
