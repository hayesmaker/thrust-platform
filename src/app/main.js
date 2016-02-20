'use strict';

var properties = require('./properties');

/**
 * ## Game entry point
 * > called on window.onload to make sure fonts registered to html page are loaded first.
 * > initilise the Phaser.Game and register game states
 * > start state: boot.
 * #### Note about fonts
 * To ensure that all fonts are loaded by window.onload, an invisible element using the font must be placed on the app's page
 * This will work fine... In the future we could implement Google's WebFontLoader
 *
 * @main
 * @method window.onload
 * @namespace window.onload
 */
window.onload = function() {
  global.game = new Phaser.Game(properties.width,properties.height, Phaser.AUTO);

  game.state.add('play', require('./states/play'));
  game.state.add('load', require('./states/load'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('boot', require('./states/boot'));

  game.state.start('boot');
};
