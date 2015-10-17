"use strict";

var properties = require('./properties');

var game = new Phaser.Game(properties.width,properties.height, Phaser.AUTO);
global.game = game;

game.state.add('play', require('./states/play'));
game.state.add('load', require('./states/load'));
game.state.add('menu', require('./states/menu'));
game.state.add('boot', require('./states/boot'));

game.state.start('boot');
