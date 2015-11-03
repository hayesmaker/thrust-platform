"use strict";

var properties = require('./properties');

var init = function() {
  global.game = new Phaser.Game(properties.width,properties.height, Phaser.AUTO);

  game.state.add('play', require('./states/play'));
  game.state.add('load', require('./states/load'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('boot', require('./states/boot'));

  game.state.start('boot');
};

/**
 * to ensure fonts are loaded, an invisible element using the font must be placed on the app's page
 * This will work until Google's WebFontLoader is implemented
 * @type {Function}
 */
window.onload = init;
