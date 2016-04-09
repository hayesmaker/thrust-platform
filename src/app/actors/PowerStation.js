'use strict';

var PhysicsActor = require('./PhysicsActor');

/**
 * PowerStation Sprite - PhysicsActor enabled power station sprite
 *
 * @class PowerStation
 * @param {Collisions} collisions - Our collisions container of collisionGroups.
 * @param {Groups} groups - Our groups container.
 * @param {String} imageCacheKey - Sprite image key.
 * @param {Number} [x] - initial position x, if unset is 0
 * @param {Number} [y] - initial position y, if unset is 0
 * @extends {Phaser.Sprite}
 * @constructor
 */
function PowerStation (collisions, groups, imageCacheKey, x, y) {
  PhysicsActor.call(this, collisions, groups, imageCacheKey, x, y);
}

var p = PowerStation.prototype = Object.create(PhysicsActor.prototype, {
  constructor: PowerStation
});

module.exports = PowerStation;

/**
 * @property particles
 * @type {null}
 */
p.particles = null;

/**
 *
 * @type {boolean}
 */
p.isHit = false;

/**
 * @method init
 */
p.init = function() {
  console.log('Fuel :: init ::', this);
  this.createParticles();
};

/**
 *
 * @method initCollisions
 */
p.initCollisions = function() {
  console.log('PowerStation :: initCollisions', this.collisions.bullets);
  this.body.collides(this.collisions.bullets, this.hit, this);
};

p.crash = function() {
  console.log('crash hit');
};

p.log = function() {
  console.log('hit bullet');
};


p.update = function() {

};

p.hit = function() {
  console.log('hit');
  this.tint = 0xfffff9;
};

p.createParticles = function() {
  //this.particles = new FuelParticlesSystem();
  //this.particles.init(this.position);
};
