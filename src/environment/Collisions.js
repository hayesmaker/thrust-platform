/**
 * A private var description
 *
 * @property myPrivateVar
 * @type {number}
 * @private
 */
var myPrivateVar = 0;

/**
 * Collisions description
 * calls init
 *
 * @class Collisions
 * @constructor
 */
var Collisions = function() {
	/**
	 * A public var description
	 *
	 * @property myPublicVar
	 * @type {number}
	 */
	this.myPublicVar = 1;
	this.init();
};

var p = Collisions.prototype;

/**
 * Collisions initialisation
 *
 * @method init
 */
p.init = function() {
	this.players = game.physics.p2.createCollisionGroup();
	this.terrain = game.physics.p2.createCollisionGroup();
	this.bullets = game.physics.p2.createCollisionGroup();
};


module.exports = Collisions;