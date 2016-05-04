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
    //WebGL arcade style CRT scanline Filter
    var fragmentSrc = [
      "precision mediump float;",
      // Incoming texture coordinates.
      'varying vec2 vTextureCoord;',
      // Incoming vertex color
      'varying vec4 vColor;',
      // Sampler for a) sprite image or b) rendertarget in case of game.world.filter
      'uniform sampler2D uSampler;',

      "uniform vec2      resolution;",
      "uniform float     time;",
      "uniform vec2      mouse;",

      "void main( void ) {",
      // colorRGBA = (y % 2) * texel(u,v);
      "gl_FragColor = mod(gl_FragCoord.y,2.0) * texture2D(uSampler, vTextureCoord);",
      "}"
    ];
    var scanlineFilter = new Phaser.Filter(game, null, fragmentSrc);
    var vignette = game.add.filter('Vignette');
    this.filmgrain = game.add.filter('FilmGrain');
    vignette.size = 0.4;
    vignette.amount = 0.5;
    vignette.alpha = 1;

    this.filmgrain.color = 0.1;
    this.filmgrain.amount = 0.4;
    this.filmgrain.luminance = 0.8;

    game.world.filters = [scanlineFilter, vignette, this.filmgrain];
    features.init();
    levelManager.init();
    particles.init();
    gameState.init();
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
   * @method update
   */
  update:function() {
    this.filmgrain.update();
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
