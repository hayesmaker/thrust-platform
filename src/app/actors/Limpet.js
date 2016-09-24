'use strict';

var PhysicsActor = require('./PhysicsActor');
var Turret = require('./Turret');
var gameState = require('../data/game-state');
var particles = require('../environment/particles/manager');
var SpreadFiring = require('./strategies/SpreadFiring');
var sound = require('../utils/sound');
var levelManager = require('../data/level-manager');

/**
 * Limpet Sprite - PhysicsActor enabled enemy limpet gun
 *
 * 100 0.01      1/(1000-100) 0.00111
 * 100 0.01      1/(1000-100) 0.00111
 * 150 0.0067    1/(1000-150) 0.00117
 * 200 0.005     1(1000-200) 0.00125
 * 225 0.004     1(1000-225) 0.00129
 * 250 0.004     1(1000-250) 0.00133
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
  this.alive = false;
  this.angle = angleDeg;
  this.fireRate = this.getFireRate();
  this.turret = this.createTurret();

  if (game.device.pixelRatio > 1) {
    //this.scale.setTo(0.5);
  }

  /*
  this.data = game.cache.getFrameData('combined');
  this.frames = this.data.getFrames();
  var normalFrames = _.filter(this.frames, function(frame) {
    return frame.name.indexOf('turret_  ') >= 0;
  });

  var damagedFrames = _.filter(this.frames, function(frame) {
    return frame.name.indexOf('turret-damaged') >= 0;
  });
  */
  this.animations.add('normal', [
    'turret_001.png',
    'turret_002.png'
  ], 5, true);
  this.animations.add('damaged', [
    'turret-damaged_001.png',
    'turret-damaged_002.png'
  ], 5, true);
  this.play('normal');

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
p.isPlayingNormal = true;

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

p.getFireRate = function() {
  return 1 / (500 - levelManager.currentLevel.enemyFireRate);
};

/**
 * @method update
 */
p.update = function () {
  if (this.alive) {
    if (!this.hasPower) {
      if (this.isPlayingNormal) {
        this.isPlayingNormal = false;
        this.play('damaged');
      }
    } else {
      if (!this.isPlayingNormal) {
        this.isPlayingNormal = true;
        this.play('normal');
      }
      //todo investigate
      //todo possible recurring error: SpreadFiring.js:28 Uncaught TypeError: Cannot read property 'rotation' of null
      if (Math.random() < this.fireRate) {
        this.turret.fire();
        sound.playSound('zap2');
      }
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
  gameState.addScore(gameState.SCORES.LIMPET);
  sound.playSound('boom3');
};





