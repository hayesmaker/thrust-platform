var PhysicsActor = require('./PhysicsActor');
var FuelParticlesSystem = require('./FuelParticlesSystem');
var utils = require('../utils');
var gameState = require('../data/game-state');
var _ = require('lodash');
var particles = require('../environment/particles');

/**
 * Fuel Sprite - PhysicsActor enabled fuel cell sprite
 *
 * @class Fuel
 * @param {Collisions} collisions - Our collisions groups.
 * @param {Groups} groups - Our display groups.
 * @param {String} imageCacheKey - Sprite image key.
 * @param {Number} [x] - initial position x, if unset is 0
 * @param {Number} [y] - initial position y, if unset is 0
 * @extends {PhysicsActor}
 * @constructor
 */
function Fuel (collisions, groups, imageCacheKey, x, y) {
  PhysicsActor.call(this, collisions, groups, imageCacheKey, x, y);
  this.health = 250;
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
 *
 * @property refuelAmount
 * @type {number}
 */
p.refuelAmount= 1;

/**
 * @method init
 */
p.init = function() {
  this.createParticles();
};

/**
 * @method update
 */
p.update = function() {
  this.checkPlayerVicinity();
};

p.createParticles = function() {
  this.particles = new FuelParticlesSystem();
  this.particles.init(this.position);
};

/**
 * Destroys this Fuel game object
 *
 * @method kill
 */
p.kill = function() {
  this.alive = false;
  gameState.score += gameState.SCORES.FUEL;
  TweenLite.to(this, 0.3, {alpha: 0, ease: Quad.easeOut, onComplete:_.bind(this.onFadeComplete, this)});
};

/**
 * When Fuel is killed or destroyed it is removed from the game
 *
 * @method onFadeComplete
 */
p.onFadeComplete = function() {
  console.log('onFadeComplete', this.alive);
  particles.explode(this.x, this.y);
  Phaser.Sprite.prototype.kill.call(this);

};

/**
 * If a player is close to the fuel, refuelling can happen
 * and particles emitted to show the refuel.
 *
 * @method checkPlayerVicinity
 */
p.checkPlayerVicinity = function() {
  var dist = utils.distAtoB(this.player.position, this.position);
  if (this.alive && this.player.alive && dist < 80) {
    if (!this.particles.isEmitting) {
      this.particles.start(this.position, this.player.position);
      TweenMax.to(this, 0.5, {tint:0xfffffe, tintAmount:1});
    }
    this.particles.update();
    gameState.fuel+=this.refuelAmount;
    this.damage(1);
  } else {
    if (this.particles.isEmitting) {
      this.particles.stop();
      this.tint = 0xffffff;
    }
  }
};