var properties = require('../properties');
var features = require('../utils/features');
var StatsModule = require('../utils/StatsModule');
var UserControl = require('../environment/UserControl');

var stats;
var userControl;
/**
 * The boot state
 *
 * @namespace states
 * @module boot
 * @type {{create: Function, update: Function}}
 */
module.exports = {
	preload: function() {
		game.scale.scaleMode = properties.scale.mode;
		game.scale.setScreenSize();
	},

	create: function() {

		features.init();

		stats = new StatsModule();

		userControl = new UserControl(features.isTouchScreen || properties.enableJoypad);

		console.warn("Instructions: Use Cursors to move ship, space to shoot, collect orb by passing near");
		console.warn("TouchScreenDetected:", features.isTouchScreen);

		game.stats = stats;

		game.controls = userControl;

		game.state.start('play');



	},
	update: function() {

	}
};
