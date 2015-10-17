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
	debugPhysics: true,
	collideWorldBounds: true,
	enableJoypad: false,
	fatalCollisions: true,
	scale: {
		mode: Phaser.ScaleManager.NO_SCALE
	},
	drawStats: true,
	drawMontains: false,
	drawBackground: true,
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
