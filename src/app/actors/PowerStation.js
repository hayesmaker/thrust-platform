'use strict';

var PhysicsActor = require('./PhysicsActor');
var gameState = require('../data/game-state');
var particleManager = require('../environment/particles/manager');
var sound = require('../utils/sound');



/**
 * PowerStation Sprite - PhysicsActor enabled power station sprite
 *
 * @class PowerStation
 * @param {Collisions} collisions - Our collisions container of collisionGroups.
 * @param {Groups} groups - Our groups container.
 * @param {String} imageCacheKey - Sprite image key.
 * @param {String} imageFrame - Sprite frame key.
 * @param {Number} [x] - initial position x, if unset is 0
 * @param {Number} [y] - initial position y, if unset is 0
 * @extends {Phaser.Sprite}
 * @constructor
 */
function PowerStation (collisions, groups, imageCacheKey, imageFrame, x, y) {
  PhysicsActor.call(this, collisions, groups, imageCacheKey, imageFrame, x, y);
  this.health = gameState.POWER_STATION_HEALTH;
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
 * @property destructionSequenceActivated
 * @type {Phaser.Signal}
 */
p.destructionSequenceActivated = new Phaser.Signal();

/**
 * @method init
 */
p.init = function() {
  this.createParticles();
};

/**
 * @method kill
 */
p.kill = function() {
  Phaser.Sprite.prototype.kill.call(this);
  this.destructionSequenceActivated.dispatch();
  this.explode();
};

/**
 *
 * @method initCollisions
 */
p.initCollisions = function() {
  this.body.collides(this.collisions.bullets, this.hit, this);
};

/**
 * @method update
 */
p.update = function() {
  if (this.alive && this.health < gameState.POWER_STATION_HEALTH) {
    this.health+=0.5;
  }
};

/**
 * @method hit
 */
p.hit = function() {
  this.damage(85);
  sound.playSound('hurt2');
};

/**
 * @method createParticles
 */
p.createParticles = function() {

};

/**
 * @method explode
 */
p.explode = function() {
  sound.playSound('hurt1');
  particleManager.explode(this.x  - this.width/2, this.y + this.height/2);
  game.time.events.add(Math.random()*500, function() {
    sound.playSound('hurt1');
    particleManager.explode(this.x, this.y + this.height/2);
  }, this);
  game.time.events.add(Math.random()*500, function() {
    sound.playSound('planet-death1');
    particleManager.explode(this.x + this.width/2, this.y + this.height/2);
  }, this);
};
