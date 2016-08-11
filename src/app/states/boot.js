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

  init: function (customScaleMode) {
    console.log('boot :: customScaleMode', customScaleMode);
    this.customScaleMode = customScaleMode;
  },

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
    game.load.image('splash', 'assets/images/splash-1.png');
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
    //Experimental poorly documented feature of Phaser
    game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(game.canvas);

    features.init();
    levelManager.init();
    particles.init();
    gameState.init();

    if (this.customScaleMode >= 0) {
      game.scale.scaleMode = this.customScaleMode;
    } else {
      game.scale.scaleMode = features.isTouchScreen ? properties.scale.device : properties.scale.web;
    }
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

    this.bootScreen = game.add.sprite(0, 0, 'splash');
    this.bootScreen.inputEnabled = true;
    this.bootScreen.useHandCursor = true;
    this.bootScreen.width = game.width;
    this.bootScreen.height = game.height;
    this.bootScreen.alpha = 0;

    TweenMax.to(this.bootScreen, 3, {alpha: 1, ease: Quad.easeOut, onComplete: this.startLoad});
    game.e2e.boot = this;
  },

  /**
   * @method update
   */
  update: function () {
    if (game.externalJoypad && game.externalJoypad.fireButton.isDown) {
      this.startLoad();
    }
  },


  /**
   * Launch game on correct user input
   *
   * @method startGame
   */
  startLoad: function () {
    game.state.start('load', false, false);
  }
};
