'use strict';

var PhysicsActor = require('./PhysicsActor');
var FuelParticlesSystem = require('../environment/particles/FuelParticlesSystem');
var gameState = require('../data/game-state');
var _ = require('lodash');
var particles = require('../environment/particles/manager');
var TweenLite = global.TweenLite;
var sound = require('../utils/sound');
var properties = require('../properties');

/**
 * Fuel Sprite - PhysicsActor enabled fuel cell sprite
 *
 * @class Fuel
 * @param {Collisions} collisions - Our collisions groups.
 * @param {Groups} groups - Our display groups.
 * @param {String} imageCacheKey - Sprite image key.
 * @param {String} imageFrameKey - Sprite frame key.
 * @param {Number} [x] - initial position x, if unset is 0
 * @param {Number} [y] - initial position y, if unset is 0
 * @param {Player} player
 * @extends {PhysicsActor}
 * @constructor
 */
function Fuel(collisions, groups, imageCacheKey, imageFrameKey, x, y, player) {
  PhysicsActor.call(this, collisions, groups, imageCacheKey, imageFrameKey, x, y);
  this.health = 250;
  this.player = player;
  this.init();
}

var p = Fuel.prototype = Object.create(PhysicsActor.prototype, {
  constructor: Fuel
});

module.exports = Fuel;

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
p.refuelAmount = 1;

/**
 *
 * @type {boolean}
 */
p.isRefuelling = false;

/**
 * @method init
 */
p.init = function () {
  this.createParticles();
  this.initCustomPhysics(true);
  this.drawSensor();
  this.initSensorPhysics();
  this.setPhysicsShape();
};

p.drawSensor = function () {
  var bmd = game.make.bitmapData(1, 1);
  bmd.rect(0, 0, 1, 1, 'rgba(0, 255, 0, 0)');
  this.sensor = game.add.sprite(this.x, this.y - this.height, bmd);
  this.sensor.width = this.width;
  this.sensor.height = this.height;
  //this.sensor.anchor.setTo(0.5);
  this.sensor.x -= this.sensor.width / 2;
  this.sensor.y -= this.sensor.height / 2;
};

p.initSensorPhysics = function () {
  game.physics.p2.enable(this.sensor, properties.dev.debugPhysics);
  this.sensor.body.clearShapes();
  var box = this.sensor.body.addRectangle(this.sensor.width, this.sensor.height, this.sensor.width/2, this.sensor.height/2, 0);
  box.sensor = true;
  this.sensor.body.motionState = 2;
  this.sensor.body.setCollisionGroup(this.collisions.fuels);
  this.sensor.body.collides([this.collisions.players]);
  this.sensor.body.onBeginContact.add(this.contactStart, this);
  this.sensor.body.onEndContact.add(this.contactLost, this);
};

/**
 * @method contactLost
 */
p.contactLost = function () {
  this.isRefuelling = false;
};

/**
 * @method contactStart
 */
p.contactStart = function () {
  this.isRefuelling = true;
};

/**
 * @method explode
 */
p.explode = function () {
  sound.playSound('boom1');
  particles.explode(this.x, this.y + this.height / 2);
  gameState.score += gameState.SCORES.FUEL;
  this.cleanup();
};

/**
 * @method update
 */
p.update = function () {
    if (this.isRefuelling) {
      if (!this.particles.isEmitting) {
        this.particles.start(this.position, this.player.position);
        TweenMax.to(this, 0.5, {tint: 0xfffffe, tintAmount: 1});
      }
      this.particles.update();
      gameState.fuel += this.refuelAmount;
      this.damage(1);
    } else {
      if (this.particles.isEmitting) {
        this.particles.stop();
        this.tint = 0xffffff;
      }
    }
};

/**
 * @method createParticles
 */
p.createParticles = function () {
  this.particles = new FuelParticlesSystem();
  this.particles.init(this.position);
};

/**
 * Sets the collision box and initialises collision detection
 *
 * @method setPhysicsShape
 */
p.setPhysicsShape = function () {
  this.fuelPadding = {
    x: 6.5,
    y: 5
  };
  this.body.addRectangle(this.width - this.fuelPadding.x * 2, this.height - this.fuelPadding.y, 1, this.fuelPadding.y);
  this.body.setCollisionGroup(this.collisions.fuels);
  this.body.collides([this.collisions.players, this.collisions.bullets], this.explode, this);
};

/**
 * Starts the kill tween animation
 * This is called by phaser magic when
 * - this.health == 0
 * - after taking this.damage(x)
 *
 * @method kill
 */
p.kill = function () {
  this.alive = false;
  gameState.score += gameState.SCORES.FUEL;
  TweenLite.to(this, 0.3, {
    alpha: 0,
    ease: Quad.easeOut,
    onComplete: _.bind(this.cleanup, this
    )
  });
};

/**
 * @method cleanup
 */
p.cleanup = function () {
  Phaser.Sprite.prototype.kill.call(this);
  this.body.removeFromWorld();
  this.body.destroy();
  this.sensor.kill();
  this.sensor.body.removeFromWorld();
  this.sensor.body.destroy();
};