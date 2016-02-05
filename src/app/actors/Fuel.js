var PhysicsActor = require('./PhysicsActor');

/**
 * p2 Physics Enabled Phaser.Sprite
 * - Tailored to use the thrust-engine collisions / groups systems.
 *
 * @class Fuel
 * @param {Collisions} collisions - Our collisions container of collisionGroups.
 * @param {Groups} groups - Our groups container.
 * @param {String} imageCacheKey - Sprite image key.
 * @param {Number} [x] - initial position x, if unset is 0
 * @param {Number} [y] - initial position y, if unset is 0
 * @extends {Phaser.Sprite}
 * @constructor
 */
function Fuel (collisions, groups, imageCacheKey, x, y) {
  PhysicsActor.call(this, collisions, groups, imageCacheKey, x, y);
}

var p = Fuel.prototype = Object.create(PhysicsActor.prototype, {
  constructor: Fuel
});
module.exports = Fuel;

/**
 * @method init
 */
p.init = function() {
  console.log('Fuel :: init ::', this);

};