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
  this.init();
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

  this.animations.add('normal', [
    'power-station_001.png',
    'power-station_002.png'
  ], 1,  true);

  this.animations.add('damaged', [
    'power-station-damaged.png'
  ], 1, true);
  this.play('normal');
  this.startParticles();
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

    if (this.isNormal) {
      this.isNormal = false;
      this.play('damaged');
      this.stopParticles();
    }
    this.health+=0.5;
  } else if (this.health >= gameState.POWER_STATION_HEALTH) {
    if (!this.isNormal) {
      this.isNormal = true;
      this.play('normal');
      this.startParticles()
      ;
    }
  }
};

/**
 * @method hit
 */
p.hit = function() {
  this.damage(75);
  sound.playSound(sound.POWER_STATION_HIT);
};

p.stopParticles = function() {
  particleManager.stopPower();
};

p.startParticles = function() {
  particleManager.emitPower(this.x - this.width/2.5, this.y);
};

/**
 * @method explode
 */
p.explode = function() {
  sound.playSound(sound.POWER_STATION_EXPLODE1);
  particleManager.explode(this.x  - this.width/2, this.y + this.height/2);
  game.time.events.add(Math.random()*500, function() {
    sound.playSound(sound.POWER_STATION_EXPLODE2);
    particleManager.explode(this.x, this.y + this.height/2);
  }, this);
  game.time.events.add(Math.random()*500, function() {
    sound.playSound(sound.POWER_STATION_EXPLODE2);
    particleManager.explode(this.x + this.width/2, this.y + this.height/2);
  }, this);
};
