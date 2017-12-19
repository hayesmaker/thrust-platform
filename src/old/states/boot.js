'use strict';

var properties = require('../properties');
var features = require('../utils/features');
var UserControl = require('../environment/UserControl');
var particles = require('../environment/particles/manager');
var userControl;
//var inAppPurchaes = require('../data/in-app-purchases');
var optionsModel = require('../data/options-model');
var _ = require('lodash');

/**
 * The boot state
 *
 * @class boot
 * @type {Phaser.State}
 * @static
 */
module.exports = {

  /**
   * @method init
   * @param customScaleMode
   * @param customOptions
   */
  init: function (customScaleMode, customOptions) {
    this.customScaleMode = customScaleMode;
    this.customOptions = customOptions;

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
   * - Features
   * - Level Manager
   * - Scaling
   * - phaser timing mode
   * - User control
   * - Display title splash screen
   * - Initialise title screen events
   *
   * @method create
   */
  create: function () {

    this.mergeOptions();

    game.stage.backgroundColor = properties.backgroundColour;
    //Experimental poorly documented features of Phaser
    //game.scale.forceOrientation(true, false);
    //  game.renderer.renderSession.roundPixels = true;
    //Phaser.Canvas.setImageRenderingCrisp(game.canvas);
    //inAppPurchaes.init();
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

    game.scale.canExpandParent = true;
    game.scale.fullScreenScaleMode = game.scale.NO_SCALE;

    userControl = new UserControl(features);
    game.controls = userControl;
    game.e2e = {};

    this.bootScreen = game.add.sprite(0, 0, 'splash');
    this.bootScreen.inputEnabled = true;
    this.bootScreen.useHandCursor = true;
    this.bootScreen.width = game.width;
    this.bootScreen.height = game.height;
    this.bootScreen.alpha = 0;

    var style = {font: "18px thrust_regular", fill: "#ffffff", align: 'left'};
    this.version = game.add.text(0,0, 'THRUST 30 v' + optionsModel.version + optionsModel.versionSuffix, style);
    this.version.anchor.setTo(0.5, 0.5);
    this.version.x = game.width/2;
    this.version.y = game.height * 0.78;
    this.version.alpha = 0;

    TweenMax.to(this.bootScreen, 3, {alpha: 1, ease: Quad.easeIn, onComplete: this.startLoad, callbackScope: this});
    TweenMax.to(this.version, 3, {alpha: 1, ease: Quad.easeIn});
    game.e2e.boot = this;
  },

  /**
   * @method update
   */
  update: function () {

  },

  mergeOptions: function () {
    _.merge(optionsModel, this.customOptions);
    console.log('options-', optionsModel);
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
