var FiringStrategy = require('./FiringStrategy');
var _ = require('lodash');


/**
 * ForwardsFire description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class ForwardsFire
 * @constructor
 */
function ForwardsFire(origin, collisions, groups, bulletBmp, lifeSpan) {
	FiringStrategy.call(this, origin, collisions, groups, bulletBmp, lifeSpan);
}

var p = ForwardsFire.prototype = Object.create(FiringStrategy.prototype);
p.constructor = ForwardsFire;

/**
 * ForwardsFire initialisation
 *
 * @method shoot
 */
p.fire = function() {
	var magnitude = 240;
	var bullet = game.make.sprite(this.origin.position.x, this.origin.position.y, this.bulletBitmap);
	bullet.lifeSpan = this.lifeSpan;
	bullet.anchor.setTo(0.5,0.5);
	game.physics.p2.enable(bullet);
	var angle = this.origin.body.rotation + (3 * Math.PI) / 2;
	bullet.body.collidesWorldBounds = false;
	bullet.body.setCollisionGroup(this.collisions.bullets);
	bullet.body.collides([this.collisions.terrain, this.collisions.enemies], function() {
		this.bulletEnd(bullet, this.groups.bullets);
	}, this);
	bullet.body.data.gravityScale = 0;
	bullet.body.velocity.x = magnitude * Math.cos(angle) + this.origin.body.velocity.x;
	bullet.body.velocity.y = magnitude * Math.sin(angle) + this.origin.body.velocity.y;
	this.groups.bullets.add(bullet);
};

module.exports = ForwardsFire;