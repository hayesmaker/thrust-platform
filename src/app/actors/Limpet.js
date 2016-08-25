'use strict';

var PhysicsActor = require('./PhysicsActor');
var Turret = require('./Turret');
var gameState = require('../data/game-state');
var particles = require('../environment/particles/manager');
var SpreadFiring = require('./strategies/SpreadFiring');
var sound = require('../utils/sound');

/**
 * Limpet Sprite - PhysicsActor enabled enemy limpet gun
 *
 * @class Limpet
 * @param {Collisions} collisions - Our collisions groups.
 * @param {Groups} groups - Our display groups.
 * @param {Number} [x] - initial position x, if unset is 0
 * @param {Number} [y] - initial position y, if unset is 0
 * @param {Number} [angleDeg] - initial angle in degrees, if unset is 0
 * @extends {PhysicsActor}
 * @constructor
 */
function Limpet (collisions, groups, x, y, angleDeg) {

  PhysicsActor.call(this, collisions, groups, 'combined', 'turret_001.png', x, y);
  this.angle = angleDeg;
  this.fireRate = 1 / 200;
  this.alive = false;
  this.turret = this.createTurret();

  if (game.device.pixelRatio > 1) {
    //this.scale.setTo(0.5);
  }

  this.initCustomPhysics(true);
  this.body.addRectangle(50, 25, 0, 0);
  this.body.rotation = game.math.degToRad(this.angle);
  this.body.fixedRotation = true;
  this.body.setCollisionGroup(this.collisions.enemies);
  this.body.collides(this.collisions.bullets, this.explode, this);
}

var p = Limpet.prototype = Object.create(PhysicsActor.prototype, {
  constructor: Limpet
});

module.exports = Limpet;

p.hasPower = false;

/**
 * @method start
 */
p.start = function() {
  this.alive = true;
};

/**
 * @method setPower
 * @param powerStationHealth
 */
p.setPower = function(powerStationHealth) {
  this.hasPower = powerStationHealth >= gameState.POWER_STATION_HEALTH;
};

/**
 * @method update
 */
p.update = function () {
  if (!this.alive) {
    return;
  }
  if (!this.hasPower) {
    this.alpha = 0.6;
  } else {
    this.alpha = 1;
    /*
     todo investigate
     todo possible recurring error: SpreadFiring.js:28 Uncaught TypeError: Cannot read property 'rotation' of null
     */
    if (Math.random() < this.fireRate) {
      this.turret.fire();
      sound.playSound('zap2');
    }
  }
};

/**
 * @method createTurret
 * @returns {Turret}
 */
p.createTurret = function () {
  var bulletBitmap = game.make.bitmapData(5, 5);
  bulletBitmap.ctx.fillStyle = '#ffffff';
  bulletBitmap.ctx.beginPath();
  bulletBitmap.ctx.lineWidth = 0.5;
  bulletBitmap.ctx.arc(0, 0, 5, 0, Math.PI * 2, true);
  bulletBitmap.ctx.closePath();
  bulletBitmap.ctx.fill();
  return new Turret(this.groups, this, new SpreadFiring(this, this.collisions, this.groups, bulletBitmap, gameState.ENEMY_BULLET_DURATION));
};

/**
 * @method explode
 */
p.explode = function () {
  particles.explode(this.x, this.y);
  this.kill();
  this.body.removeFromWorld();
  this.body.destroy();
  gameState.score+=gameState.SCORES.LIMPET;
  sound.playSound('boom3');
};





