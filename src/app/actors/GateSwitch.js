'use strict';

var PhysicsActor = require('./PhysicsActor');
var sound = require('../utils/sound');

/**
 * GateSwitch Sprite - PhysicsActor enabled enemy GateSwitch gun
 *
 * @class GateSwitch
 * @param {Collisions} collisions - Our collisions groups.
 * @param {Groups} groups - Our display groups.
 * @param {Map} map - The level map which includes any gateSprite this switch is responsible for opening.
 * @param {Number} [x] - initial position x, if unset is 0
 * @param {Number} [y] - initial position y, if unset is 0
 * @param {Number} [angleDeg] - initial angle in degrees, if unset is 0
 * @param [gateDuration] {Number} - GateDuration
 * @extends {PhysicsActor}
 * @constructor
 */
function GateSwitch (collisions, groups, map, x, y, angleDeg, gateDuration) {
  this.gateDuration = gateDuration * 1000 || 6000;
  var bmd = game.make.bitmapData(50, 50);
  bmd.ctx.strokeStyle = '#ffffff';
  bmd.ctx.lineWidth = 2;
  bmd.ctx.beginPath();
  bmd.ctx.moveTo(25, 25);
  bmd.ctx.arc(25, 25, 20, Math.PI/2, 3* Math.PI/2, false);
  bmd.ctx.closePath();
  bmd.ctx.stroke(); 

  PhysicsActor.call(this, collisions, groups, bmd, null, x, y);
  this.map = map;
  this.angle = angleDeg;
  this.alive = true;

  this.initCustomPhysics(true);
  this.body.addCircle(22, 0, 0, 0);
  this.body.rotation = game.math.degToRad(this.angle);
  this.body.fixedRotation = true;
  this.body.setCollisionGroup(this.collisions.enemies);
  this.body.collides(this.collisions.bullets, this.hit, this);
}

var p = GateSwitch.prototype = Object.create(PhysicsActor.prototype, {
  constructor: GateSwitch
});

module.exports = GateSwitch;

/**
 * Cache the level map for opening Gate
 *
 * @property map
 * @type {Map}
 * @default null
 */
p.map = null;


/**
 * @method explode
 */
p.hit = function () {
  this.map.openGate();
  if (!this.timer) {
    this.timer = game.time.events.add(this.gateDuration, this.closeGate, this);
  }
  sound.playSound(sound.LIMPET_EXPLODE);
};

p.closeGate = function() {
  this.map.closeGate();
  if (this.timer) {
    game.time.events.remove(this.timer);
    this.timer = null;
  }
};





