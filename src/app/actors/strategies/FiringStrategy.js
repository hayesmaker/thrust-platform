/**
 * FiringStrategy description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class FiringStrategy
 * @param origin
 * @param collisions
 * @param groups
 * @param bulletBmp
 * @param lifeSpan
 * @constructor
 */
function FiringStrategy(origin, collisions, groups, bulletBmp, lifeSpan) {
	this.origin = origin;

	this.collisions = collisions;

	this.groups = groups;

	this.bulletBitmap = bulletBmp;

	this.lifeSpan = lifeSpan;
}

var p = FiringStrategy.prototype;

/**
 * FiringStrategy initialisation
 *
 * @method fire
 */
p.fire = function() {

};

/**
 * @method update
 */
p.update = function() {
	var updateBullet = function(bullet)
	{
		if (--bullet.lifeSpan === 0)
		{
			this.bulletEnd(bullet, this.groups.bullets);
		}
	};
	this.groups.bullets.forEach(updateBullet, this);
};

/**
 * @method bulletEnd
 * @param bullet
 * @param group
 */
p.bulletEnd = function(bullet, group) {
	if (bullet) {
		group.remove(bullet);
		bullet.body.destroy();
		bullet.body = null;
		bullet.destroy();
	}
};


module.exports = FiringStrategy;