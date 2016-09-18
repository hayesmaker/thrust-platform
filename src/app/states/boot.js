'use strict';

var properties = require('../properties');
var features = require('../utils/features');
var UserControl = require('../environment/UserControl');
var particles = require('../environment/particles/manager');
var userControl;
var version = require('../../../package.json').version;

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
    game.stage.backgroundColor = properties.backgroundColour;
    //Experimental poorly documented features of Phaser
    //game.scale.forceOrientation(true, false);
    game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(game.canvas);

    features.init();
    //levelManager.init();
    particles.init();
    //gameState.init();

    if (this.customScaleMode >= 0) {
      game.scale.scaleMode = this.customScaleMode;
    } else {
      game.scale.scaleMode = features.isTouchScreen ? properties.scale.device : properties.scale.web;
    }
    if (properties.dev.stats) {
      game.time.advancedTiming = true;
    }

    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

    userControl = new UserControl(features);
    game.controls = userControl;
    game.e2e = {};

    this.bootScreen = game.add.sprite(0, 0, 'splash');
    this.bootScreen.inputEnabled = true;
    this.bootScreen.useHandCursor = true;
    this.bootScreen.width = game.width;
    this.bootScreen.height = game.height;
    this.bootScreen.alpha = 0;

    var style = {font: "10px thrust_regular", fill: "#ffffff", align: 'left'};
    this.version = game.make.text(0,0, 'v' + version, style);
    this.version.anchor.setTo(0, 0.5);
    this.version.x = 0;
    this.version.y = game.height*0.25;
    this.bootScreen.addChild(this.version);

    TweenMax.to(this.bootScreen, 3, {alpha: 1, ease: Quad.easeIn, onComplete: this.startLoad, callbackScope: this});
    game.e2e.boot = this;
  },

  /**
   * @method update
   */
  update: function () {

  },

  /**
   * Launch game on correct user input
   *
   * @method startGame
   */
  startLoad: function () {
    game.state.start('load', false, false, this.bootScreen, this.version);
  }
};
