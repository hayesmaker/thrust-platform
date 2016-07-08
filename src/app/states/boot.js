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
   * External gamepad controller
   * 
   * @property controller
   */
  controller: null,

  /**
   * @property externalGamePadDetected
   */
  externalGamePadDetected: false,

  /**
   *
   */
  fireButton: null,
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
    this.controller = game.input.gamepad.pad1;
    this.controller.addCallbacks(this, {

      onDown: function(code) {
        //alert('code:' + code);
      },

      onConnect: function() {
        this.externalGamePadDetected = true;
        game.externalJoypad = {};
        game.externalJoypad.fireButton = this.controller.getButton(Phaser.Gamepad.BUTTON_1);
        game.externalJoypad.thrustButton = this.controller.getButton(Phaser.Gamepad.BUTTON_0);
        game.externalJoypad.up = this.controller.getButton(Phaser.Gamepad.BUTTON_12);
        game.externalJoypad.down = this.controller.getButton(Phaser.Gamepad.BUTTON_13);
        game.externalJoypad.left = this.controller.getButton(Phaser.Gamepad.BUTTON_14);
        game.externalJoypad.right = this.controller.getButton(Phaser.Gamepad.BUTTON_15);
      }.bind(this)
    });

    game.input.gamepad.start();

    userControl = new UserControl((features.isTouchScreen || properties.enableJoypad) && !this.externalGamePadDetected);
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
    game.state.start('load', false, false);
  }
};
