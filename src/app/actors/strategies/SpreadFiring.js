var FiringStrategy = require('./FiringStrategy');
var properties = require('../../properties');

/**
 * ForwardsFire description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class ForwardsFire
 * @constructor
 */
function SpreadFiring(origin, collisions, groups, bulletBmp, lifeSpan) {
	FiringStrategy.call(this, origin, collisions, groups, bulletBmp, lifeSpan);
}

var p = SpreadFiring.prototype = Object.create(FiringStrategy.prototype);
p.constructor = SpreadFiring;

/**
 * SpreadFire initialisation
 *
 * @method shoot
 */
p.fire = function() {
	var magnitue = 240;
	this.bullet = game.make.sprite(this.origin.position.x, this.origin.position.y, this.bulletBitmap);
	this.bullet.anchor.setTo(0.5,0.5);
	this.bullet.lifespan = 1000;
	game.physics.p2.enable(this.bullet, properties.debugPhysics);
	var angle = this.origin.body.rotation + Math.PI + Math.random()*Math.PI;
	this.bullet.body.collidesWorldBounds = false;
	this.bullet.body.setCollisionGroup(this.collisions.enemyBullets);
	this.groups.bullets.add(this.bullet);
	this.bullet.body.collides([this.collisions.terrain, this.collisions.players],this.bulletEnd, this);
	this.bullet.body.data.gravityScale = 0;
	this.bullet.body.velocity.x = magnitue * Math.cos(angle) + this.origin.body.velocity.x;
	this.bullet.body.velocity.y = magnitue * Math.sin(angle) + this.origin.body.velocity.y;
};

module.exports = SpreadFiring;