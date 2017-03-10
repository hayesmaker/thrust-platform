'use strict';

var properties = require('../properties');
var PIXI = global.PIXI;

var load = require('../pixi/states/load');
var gameLoop = require('../pixi/rendering/game-loop');

/**
 * Game entry point
 * - called from window.onload
 * - initilise the Phaser.Game and register game states
 * - start state: boot.
 * 
 * #### Note about fonts
 * To ensure that all fonts are loaded by window.onload, an invisible element using the font must be placed on the app's page
 * This will work fine... In the future we could implement Google's WebFontLoader
 *
 * @class launcher
 */
module.exports = {
  renderMode: null,

  renderer: null,

  customScaleMode: null,

  /**
   * @property customOptions
   */
  customOptions: {},

  /**
   * @method customOptions
   * @param options
   */
  setCustomOptions: function(options) {
    this.customOptions = options.options;
  },

  /**
   * @method enableHiResMode
   */
  enableHiResMode: function() {
    var parent = document.getElementById('gameContainer');
    if (parent) {
      properties.width = parent.clientWidth;
      properties.height = parent.clientHeight;
    } else {
      properties.width = window.innerWidth;
      properties.height = window.innerHeight;
    }
  },

  /**
   * @method setCustomScale
   * @param scaleMode
   */
  setCustomScale: function(scaleMode) {
    this.customScaleMode = scaleMode;
  },

  /**
   * @method setRenderMode
   * @param renderMode {string}
   */
  setRenderMode: function(renderMode) {
    this.renderMode = renderMode;
  },

  /**
   * Create Phaser.Game
   * Load States
   * Start Game from Boot State
   * 
   * @method start
   */
  start: function() {
    global.game = new Phaser.Game(properties.width, properties.height, this.renderMode, domParent, 'boot', false, true);
    game.state.add('play', require('./play'));
    game.state.add('load', require('./load'));
    game.state.add('boot', require('./boot'));
    game.state.start('boot', true, false, this.customScaleMode, this.customOptions);
    if (!this.customOptions.isCordova) {
      window.addEventListener('resize', function () {
        this.enableHiResMode();
        game.scale.setGameSize(properties.width, properties.height);
        game.controls.refresh();
        //todo
      }.bind(this));
    }
  }
  
};  