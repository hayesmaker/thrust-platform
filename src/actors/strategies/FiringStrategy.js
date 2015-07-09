/**
 * FiringStrategy description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class FiringStrategy
 * @constructor
 */
function FiringStrategy(origin, collisions, groups, bulletBmp) {
	this.origin = origin;

	this.collisions = collisions;

	this.groups = groups;

	this.bulletBitmap = bulletBmp;
}

var p = FiringStrategy.prototype;

/**
 * FiringStrategy initialisation
 *
 * @method fire
 */
p.fire = function() {
	console.log('Abstract Fire');
};


module.exports = FiringStrategy;