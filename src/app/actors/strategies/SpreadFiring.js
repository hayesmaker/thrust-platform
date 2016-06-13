var FiringStrategy = require('./FiringStrategy');

/**
 * SpreadFiring - Defines a Firing strategy for a Turret, where
 * bullets emit at random angles, around 180* spread from the origin rotation
 *
 * @class SpreadFiring
 * @extends {FiringStrategy}
 * @constructor
 */
function SpreadFiring(origin, collisions, groups, bulletBmp, lifespan) {
  FiringStrategy.call(this, origin, collisions, groups, bulletBmp, lifespan);
	this.setCollisionGroup(this.collisions.enemyBullets);
	this.setCollidesWith([this.collisions.terrain, this.collisions.players]);
}

var p = SpreadFiring.prototype = Object.create(FiringStrategy.prototype);
p.constructor = SpreadFiring;

/**
 * Fires a bullet over 180* spread
 *
 * @method fire
 */
p.fire = function () {
  FiringStrategy.prototype.fire.call(this);
  var magnitude = 280;
  var angle = this.origin.body.rotation + Math.PI + Math.random() * Math.PI;
  this.bullet.body.velocity.x = magnitude * Math.cos(angle) + this.origin.body.velocity.x;
  this.bullet.body.velocity.y = magnitude * Math.sin(angle) + this.origin.body.velocity.y;
};

module.exports = SpreadFiring;