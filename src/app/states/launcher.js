'use strict';

var properties = require('../properties');

/**
 * ## Game entry point
 * > called from window.onload 
 * > initilise the Phaser.Game and register game states
 * > start state: boot.
 * 
 * #### Note about fonts
 * To ensure that all fonts are loaded by window.onload, an invisible element using the font must be placed on the app's page
 * This will work fine... In the future we could implement Google's WebFontLoader
 *
 * @main
 * @class launcher
 */
module.exports = {

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
    var domParent = document.getElementById('gameContainer') || '';
    global.game = new Phaser.Game(properties.width, properties.height, this.renderMode, domParent);
    game.state.add('play', require('./play'));
    game.state.add('load', require('./load'));
    game.state.add('boot', require('./boot'));
    game.state.start('boot');

    //game.renderer.renderSession.roundPixels = true;
    //Phaser.Canvas.setImageRenderingCrisp(game.canvas);

  }
};  