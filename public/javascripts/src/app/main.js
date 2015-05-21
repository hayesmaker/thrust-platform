define(function(require) {

	console.log('hai world', Phaser, PIXI, p2);

	var _ = require('lodash');

	var game = require('game').game;
	var boot = require('states/boot');

	/*
	var states = {
		boot: boot(game)
	};
	*/


	/*
	_.each(states, function(state, key) {
		console.log('add state ::', key, 'to game ::', game);
		game.state.add(key, state);
	});
	*/

	game.state.add('boot', boot(game));

	setTimeout(function() {
		game.state.start('boot');
	}, 100);


});
/*
 /*
 var Phaser = require('Phaser')
 , _ = require('lodash')
 , properties = require('./properties')
 , states =
 { boot: require('./states/boot.js')
 , preloader: require('./states/preloader.js')
 , game: require('./states/game.js')
 }
 , game = new Phaser.Game(properties.size.x, properties.size.y, Phaser.AUTO, 'game');

 // Automatically register each state.
 _.each(states, function(state, key) {
 game.state.add(key, state(game));
 });

 game.state.start('boot');
 */