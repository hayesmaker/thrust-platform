var PhysicsActor = require('./PhysicsActor');
var FuelParticlesSystem = require('./FuelParticlesSystem');
var utils = require('../utils');

/**
 * Fuel Sprite - PhysicsActor enabled fuel cell sprite
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
 * @property player
 * @type {Player}
 */
p.player = null;

/**
 * @property particles
 * @type {null}
 */
p.particles = null;

/**
 * @method init
 */
p.init = function() {
  console.log('Fuel :: init ::', this);
  this.createParticles();
};

p.update = function() {
  this.checkPlayerVicinity();
};

p.createParticles = function() {
  this.particles = new FuelParticlesSystem();
  this.particles.init(this.position);
};

p.checkPlayerVicinity = function() {
  var dist = utils.distAtoB(this.player.position, this.position);
  if (dist < 80) {
    if (!this.particles.isEmitting) {
      this.particles.start(this.position, this.player.position);
    }
    this.particles.update();
  } else {
    if (this.particles.isEmitting) {
      this.particles.stop();
    }
  }
};