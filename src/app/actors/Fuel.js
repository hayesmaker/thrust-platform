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
 * @deprecated
 * @property particles
 * @type {null}
 */
p.particles = null;

/**
 *
 * @property refuelAmount
 * @type {number}
 */
p.refuelAmount = 2;

/**
 *
 * @type {boolean}
 */
p.isRefuelling = false;

/**
 *
 * @type {boolean}
 */
p.isAnimating = false;

/**
 * @method init
 */
p.init = function () {
  this.createParticles();
  this.initCustomPhysics(true);
  this.drawSensor();
  this.initSensorPhysics();
  this.setPhysicsShape();
  this.createFuelAnim();
};

p.createFuelAnim = function () {
  this.fuelAnim = game.add.sprite(this.x, this.y, 'combined', 'Fuel_Anim_001.png');
  this.fuelAnim.x -= this.width;
  this.fuelAnim.y -= this.height / 2 + this.fuelAnim.height / 2;
  this.fuelAnim.animations.add('refuelling', [
    'Fuel_Anim_001.png',
    'Fuel_Anim_002.png',
    'Fuel_Anim_003.png',
    'Fuel_Anim_004.png',
    'Fuel_Anim_005.png',
    'Fuel_Anim_006.png',
    'Fuel_Anim_007.png',
    'Fuel_Anim_008.png',
    'Fuel_Anim_009.png',
    'Fuel_Anim_010.png',
    'Fuel_Anim_011.png',
    'Fuel_Anim_012.png',
    'Fuel_Anim_013.png',
    'Fuel_Anim_014.png',
    'Fuel_Anim_015.png',
    'Fuel_Anim_016.png',
    'Fuel_Anim_017.png',
    'Fuel_Anim_018.png',
    'Fuel_Anim_019.png',
    'Fuel_Anim_020.png',
    'Fuel_Anim_021.png',
    'Fuel_Anim_022.png',
    'Fuel_Anim_023.png',
    'Fuel_Anim_024.png',
    'Fuel_Anim_025.png',
    'Fuel_Anim_026.png',
    'Fuel_Anim_027.png',
    'Fuel_Anim_028.png',
    'Fuel_Anim_029.png',
    'Fuel_Anim_030.png'
  ], 60, true);
  this.fuelAnim.visible = true;
  this.fuelAnim.play('refuelling');
};

p.drawSensor = function () {
  var bmd = game.make.bitmapData(1, 1);
  bmd.rect(0, 0, 1, 1, 'rgba(0, 255, 0, 0)');
  this.sensor = game.add.sprite(this.x, this.y - this.height, bmd);
  this.sensor.width = this.width;
  this.sensor.height = this.height;
  this.sensor.x -= this.sensor.width / 2;
  this.sensor.y -= this.sensor.height / 2;
};

p.initSensorPhysics = function () {
  game.physics.p2.enable(this.sensor, properties.dev.debugPhysics);
  this.sensor.body.clearShapes();
  var box = this.sensor.body.addRectangle(this.sensor.width, this.sensor.height, this.sensor.width / 2, this.sensor.height / 2, 0);
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
  particles.fuelExplode(this.x, this.y + this.height / 2);
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
    x: 0,
    y: 0
  };
  this.body.addRectangle(this.width - this.fuelPadding.x * 2, this.height - this.fuelPadding.y, this.fuelPadding.x, this.fuelPadding.y);
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
  this.fuelAnim.kill();
  this.body.removeFromWorld();
  this.body.destroy();
  this.sensor.kill();
  this.sensor.body.removeFromWorld();
  this.sensor.body.destroy();
};