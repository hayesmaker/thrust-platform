var properties = require('../properties');

/**
 * Orb description
 * calls init
 *
 * @class Orb
 * @constructor
 */
function Orb(x, y, collisions) {
  this.collisions = collisions;
  this.player = null;
  var bmd = game.make.bitmapData(22, 22);
  bmd.ctx.strokeStyle = '#999999';
  bmd.ctx.lineWidth = 2;
  bmd.ctx.beginPath();
  bmd.ctx.arc(11, 11, 10, 0, Math.PI * 2, true);
  bmd.ctx.closePath();
  bmd.ctx.stroke();
  this.sprite = game.make.sprite(x, y, bmd);
  this.sprite.anchor.setTo(0.5, 0.5);
  this.initialPosition = {x: x, y: y};
  this.init();
}

var p = Orb.prototype;

/**
 * Orb initialisation
 * motionState = 1; //for dynamic
 * motionState = 2; //for static
 * motionState = 4; //for kinematic
 *
 * @method init
 */
p.init = function () {
  game.physics.p2.enable(this.sprite, properties.debugPhysics);
  this.body = this.sprite.body;
  this.body.setCircle(10, 0, 0);
  this.body.motionState = 2;
  this.body.setCollisionGroup(this.collisions.orb);
  this.body.collideWorldBounds = properties.collideWorldBounds;
  this.body.collides([this.collisions.enemyBullets, this.collisions.players, this.collisions.terrain, this.collisions.bullets], this.crash, this);
};

/**
 * @method setPlayer
 * @param player
 */
p.setPlayer = function (player) {
  this.player = player;
};

/**
 * @method move
 * motionState = 1; //for dynamic
 * motionState = 2; //for static
 * motionState = 4; //for kinematic
 */
p.move = function () {
  this.body.motionState = 1;
  this.body.mass = 1;
  this.body.velocity = 0;
  this.body.angularVelocity = 0;
  this.body.angle = 0;
};

/**
 * @method stop
 */
p.stop = function() {
  this.body.setZeroVelocity();
  this.body.setZeroDamping();
  this.body.setZeroForce();
  this.body.setZeroRotation();
  this.body.motionState = 2;
};

/**
 * @method crash
 */
p.crash = function () {
  console.warn('Orb :: crash');
  if (this.player) {
    this.player.crash();
  }
  this.body.motionState = 1;
};

/**
 * Stop the orb and reset location to starting position
 *
 * @method respawn
 */
p.respawn = function () {
  this.body.reset(this.initialPosition.x, this.initialPosition.y, true, true);
  this.body.motionState = 2;
};


module.exports = Orb;
