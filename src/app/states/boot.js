'use strict';

var properties = require('../properties');
var features = require('../utils/features');
var UserControl = require('../environment/UserControl');
var levelManager = require('../data/level-manager');
var particles = require('../environment/particles');
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
    features.init();
    levelManager.init();
    particles.init();
    game.scale.scaleMode = features.isTouchScreen ? properties.scale.device : properties.scale.web;
    if (properties.dev.stats) {
      game.time.advancedTiming = true;
    }
    userControl = new UserControl(features.isTouchScreen || properties.enableJoypad);
    console.warn("Instructions: Use Cursors to move ship, space to shoot, collect orb by passing near");
    console.warn("TouchScreenDetected:", features.isTouchScreen);
    console.warn("ScaleMode:", game.scale.scaleMode);
    game.controls = userControl;

    game.e2e = {};

    if (properties.dev.skipSplashScreen) {
      this.startLoad();
    } else {
      var spr = game.add.sprite(0,0, 'title');
      spr.inputEnabled = true;
      spr.useHandCursor = true;
      spr.events.onInputDown.add(this.startLoad, this);
      spr.width = properties.width;
      spr.height = properties.height;
      game.e2e.boot = this;
      game.controls.spacePress.onDown.add(this.startLoad, this);
    }
  },

  /**
   * Launch game on correct user input
   *
   * @method startGame
   */
  startLoad: function() {
    game.state.start('load', false, false);
  }
};
