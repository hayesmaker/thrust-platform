var FiringStrategy = require('./FiringStrategy');

/**
 * @method bulletEnd
 * @param bulletBody
 * @private
 */
function bulletEnd(bulletBody) {
	bulletBody.sprite.kill();
	this.groups.bullets.remove(bulletBody.sprite);
}

/**
 * ForwardsFire description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class ForwardsFire
 * @constructor
 */
function SpreadFiring(origin, collisions, groups, bulletBmp) {
	FiringStrategy.call(this, origin, collisions, groups, bulletBmp);
}

var p = SpreadFiring.prototype = Object.create(FiringStrategy.prototype);
p.constructor = SpreadFiring;

/**
 * ForwardsFire initialisation
 *
 * @method shoot
 */
p.fire = function() {
	var magnitue = 240;
	var bullet = game.make.sprite(this.origin.position.x, this.origin.position.y, this.bulletBitmap);
	bullet.anchor.setTo(0.5,0.5);
	game.physics.p2.enable(bullet);

	var angle = this.origin.body.rotation + Math.PI + Math.random()*Math.PI;
	bullet.body.collidesWorldBounds = false;
	bullet.body.setCollisionGroup(this.collisions.bullets);
	bullet.body.collides(this.collisions.terrain, bulletEnd, this);
	bullet.body.data.gravityScale = 0;
	bullet.body.velocity.x = magnitue * Math.cos(angle) + this.origin.body.velocity.x;
	bullet.body.velocity.y = magnitue * Math.sin(angle) + this.origin.body.velocity.y;
	this.groups.bullets.add(bullet);
};

module.exports = SpreadFiring;