/**
 * Defines build settings for the thrust-engine
 *
 * @namespace thrust-engine
 * @module properties
 * @class
 * @static
 * @type {{enableJoypad: boolean, fatalCollisions: boolean, scale: {mode: number}, drawStats: boolean}}
 */
module.exports = {
	debugPhysics: false,
	collideWorldBounds: true,
	enableJoypad: true,
	fatalCollisions: true,
	scale: {
		mode: Phaser.ScaleManager.SHOW_ALL
	},
	drawStats: true,
	drawMontains: false,
	width: 700,
	height: 500,
	gamePlay: {
		freeOrbLocking: false,
		autoOrbLocking: true,
		tractorBeamLength: 80,
		tractorBeamVariation: 10,
		lockingDuration: 900
	}
};
