'use strict';

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
 * Initialises this physics actor in p2
 * the caller of this method is now responsible for the physics shape required.
 * As by default no shape is added.
 * 
 * @method initCustomPhysics
 * @param [isStatic] {Boolean} if movable object, pass false or leave blank;
 */
p.initCustomPhysics = function(isStatic) {
  game.physics.p2.enable(this, properties.dev.debugPhysics);
  this.body.clearShapes();
  this.body.static = isStatic || false;
};

/**
 *
 * @method initPhysics
 * @param physicsDataKey {String} eg 'playerPhysics'
 * @param physicsDataObjKey {String} eg 'player'
 */
p.initPhysics = function(physicsDataKey, physicsDataObjKey) {
  console.log('Actor :: initPhysics');
  game.physics.p2.enable(this, properties.dev.debugPhysics);
  this.body.clearShapes();
  this.body.loadPolygon(physicsDataKey, physicsDataObjKey);
  this.body.static = true;
};

/**
 * Activates dynamic physics
 *
 * @method start
 */
p.start = function() {
  //this.body.motionState = 1;
};

/**
 * Hard stops the object, stops any external physics forces and resets them
 *
 * @method stop
 */
p.stop = function() {
  console.log('PhysicsActor :: stop');
  this.body.setZeroVelocity();
  this.body.setZeroDamping();
  this.body.setZeroForce();
  this.body.setZeroRotation();
};
