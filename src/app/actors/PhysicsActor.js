var properties = require('../properties');

/**
 * p2 Physics Enabled Phaser.Sprite
 * - Tailored to use the thrust-engine collisions / groups systems.
 *
 * @class PhysicsActor
 * @param {Collisions} collisions - Our collisions container of collisionGroups.
 * @param {Groups} groups - Our groups container.
 * @param {String} imageCacheKey - Sprite image key.
 * @param {Number} [x] - initial position x, if unset is 0
 * @param {Number} [y] - initial position y, if unset is 0
 * @extends {Phaser.Sprite}
 * @constructor
 */
function PhysicsActor(collisions, groups, imageCacheKey, x, y) {
  /**
   * The collisions container
   *
   * @property collisions
   * @type {Collisions}
   */
  this.collisions = collisions;

  /**
   * The groups container
   *
   * @property groups
   * @type {Groups}
   */
  this.groups = groups;

  /**
   * @property initialPosition
   * @type {Phaser.Point}
   */
  this.initalPosition = new Phaser.Point(x || 0, y || 0);

  Phaser.Sprite.call(this, game, this.initalPosition.x, this.initalPosition.y, imageCacheKey);
  this.anchor.setTo(0.5);
  this.init();
}

var p = PhysicsActor.prototype = Object.create(Phaser.Sprite.prototype, {
  constructor: PhysicsActor
});
module.exports = PhysicsActor;

/**
 * @method init
 */
p.init = function() {
  console.log('PhysicsActor :: init ::', this);
};

/**
 *
 * @method initPhysics
 * @param physicsDataKey {String} eg 'playerPhysics'
 * @param physicsDataObjKey {String} eg 'player'
 */
p.initPhysics = function(physicsDataKey, physicsDataObjKey) {
  console.log('Actor :: initPhysics');
  game.physics.p2.enable(this, properties.debugPhysics);
  this.body.clearShapes();
  this.body.loadPolygon(physicsDataKey, physicsDataObjKey);
  this.body.motionState = 2;
  this.body.mass = 1;
};

/**
 *
 *
 * @method initCollisions
 */
p.initCollisions = function() {
  //this.body.collides([this.collisions.enemyBullets, this.collisions.terrain, this.collisions.orb], this.crash, this);
  //this.body.setCollisionGroup(this.collisions.players);
};

/**
 * Activates dynamic physics
 *
 * @method start
 */
p.start = function() {
  this.body.motionState = 1;
};

/**
 * Hard stops the object, stops any external physics forces and resets them
 *
 * @method stop
 */
p.stop = function() {
  this.body.setZeroVelocity();
  this.body.setZeroDamping();
  this.body.setZeroForce();
  this.body.setZeroRotation();
  this.body.motionState = 2;
};
