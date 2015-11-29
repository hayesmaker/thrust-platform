'use strict';

var properties = require('../properties');
var features = require('../utils/features');
var StatsModule = require('../utils/StatsModule');
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
   * * Stats and phaser timing mode
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
    game.scale.scaleMode = features.isTouchScreen ? Phaser.ScaleManager.EXACT_FIT : properties.scale.mode;
    game.time.advancedTiming = true;
    if (properties.stats) {
      game.stats = new StatsModule();
    }
    userControl = new UserControl(features.isTouchScreen || properties.enableJoypad);
    console.warn("Instructions: Use Cursors to move ship, space to shoot, collect orb by passing near");
    console.warn("TouchScreenDetected:", features.isTouchScreen);
    console.warn("ScaleMode:", game.scale.scaleMode);

    game.controls = userControl;

    var spr = game.add.sprite(0,0, 'title');
    spr.inputEnabled = true;
    spr.useHandCursor = true;
    spr.events.onInputDown.add(this.startLoad, this);

    game.controls.spacePress.onDown.add(this.startLoad, this);
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
