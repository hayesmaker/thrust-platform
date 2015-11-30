var game = window.game;
var properties = require('../properties');

/**
 * Collisions description
 * calls init
 *
 * @class Collisions
 * @constructor
 */
function Collisions (collisions) {
	this.startSystem();
	this.init();
}

var p = Collisions.prototype;

/**
 * Collisions initialisation
 *
 * @method init
 */
p.init = function() {
	this.players 		= game.physics.p2.createCollisionGroup();
	this.terrain 		= game.physics.p2.createCollisionGroup();
	this.orb	 		= game.physics.p2.createCollisionGroup();
	this.bullets		= game.physics.p2.createCollisionGroup();
	this.enemyBullets 	= game.physics.p2.createCollisionGroup();
	this.enemies 		= game.physics.p2.createCollisionGroup();

	game.physics.p2.updateBoundsCollisionGroup();
};

p.startSystem = function() {
	game.physics.startSystem(Phaser.Physics.P2JS);
	game.physics.p2.setImpactEvents(true);
	game.physics.p2.gravity.y = 100;
};

/**
*
*/
p.set = function(sprite, collisionGroups) {
	sprite.body.collides(collisionGroups);
};


module.exports = Collisions;
