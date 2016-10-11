'use strict';

var properties = require('../properties');
var sound = require('../utils/sound');

/**
 * TractorBeam description
 *
 * @class TractorBeam
 * @constructor
 */
function TractorBeam(orb, player, groups) {
  this.orb = orb;
  this.player = player;
  this.groups = groups;
  this.isLocked = false;
  this.isLocking = false;
  this.hasGrabbed = false;
  this.length = properties.gamePlay.tractorBeamLength;
  this.variance = properties.gamePlay.tractorBeamVariation;
  this.lockingDuration = properties.gamePlay.lockingDuration;
  this.constraint = null;
  this.graphics = null;
  this.timer = null;
  this.init();
}

var p = TractorBeam.prototype;

/**
 * TractorBeam initialisation
 *
 * @method init
 */
p.init = function () {
  this.graphics = game.make.graphics();
  this.groups.actors.add(this.graphics);
  this.timer = game.time.create(false);
};

/**
 * @method contactStart
 */
p.contactStart = function() {
  if (!this.player.orbActivated) {
    return;
  }
  this.startLocking();
};

/**
 * @method contactLoset
 */
p.contactLost = function() {
  var player = this.player;
  this.isLocking = false;
  if (this.isLocked && player.alive) {
    this.grab(this);
  }
  if (!this.hasGrabbed) {
    this.breakLink();
  }

};

/**
 * @method update
 */
p.update = function() {
  if (this.player && this.player.body) {
    if (this.isLocking || this.hasGrabbed) {
      this.drawBeam();
    }
  }
};

/**
 * @method startLocking
 */
p.startLocking = function(){
  if (!this.isLocking) {
    this.isLocking = true;
    this.timer.add(this.lockingDuration, this.lock, this);
    this.timer.start();
    sound.playSound(sound.TRACTOR_BEAM_CONNECTING);
  }
};

/**
 * //todo this timer.add might be a memory leak
 * //todo restart existing timer each time, not adding new signals
 *
 * @method drawBeam
 * @param posA
 */
p.drawBeam = function () {
  this.graphics.clear();
  var colour = this.hasGrabbed ? 0x00ff00 : 0xEF5696;
  var alpha = this.hasGrabbed ? 0.5 : 0.4;
  this.graphics.lineStyle(5, colour, alpha);
  this.graphics.moveTo(this.player.body.x,this.player.body.y);
  this.graphics.lineTo(this.orb.sprite.position.x, this.orb.sprite.position.y);
};

/**
 *
 */
p.clearPhysics = function() {
  console.log('TractorBeam :: clear orb sensor Physics, and remove timers');
  this.timer.stop();
  game.time.events.remove(this.timer);
  if (this.orb.body) {
    this.orb.disposeSensor();
  }
};

/**
 * @method unlock
 */
p.unlock = function () {
  this.isLocked = false;
};

/**
 * @method lock
 */
p.lock = function () {
  this.isLocked = true;
};

/**
 * @method lockingRelease
 */
p.lockingRelease = function () {
  if (!this.isLocked) {
    this.isLocking = false;
    this.hasGrabbed = false;
    this.graphics.clear();
    sound.playSound(sound.TRACTOR_BEAM_RELEASE);
    this.timer.stop(true);
  }
};

/**
 * Attach the orb to the player
 *
 *
 * @method grab
 */
p.grab = function () {
  var player = this.player;
  this.hasGrabbed = true;
  var maxForce = 200000;
  var diffX = player.position.x - this.orb.sprite.position.x;
  var diffY = player.position.y - this.orb.sprite.position.y;
  this.constraint = game.physics.p2.createRevoluteConstraint(player, [0, 0], this.orb.sprite, [diffX, diffY], maxForce);
  this.orb.move();
  sound.playSound(sound.TRACTOR_BEAM_GRAB);
  this.clearPhysics();
};

/**
 * @method breakLink
 */
p.breakLink = function () {
  this.unlock();
  sound.playSound(sound.TRACTOR_BEAM_BREAK);
  this.lockingRelease();
  game.physics.p2.removeConstraint(this.constraint);
};

p.dispose = function() {
  console.log('TractorBeam :: dispose (graphics destroyed)');
  //this.clearPhysics(); - causes bug on connection
  this.graphics.destroy();
};

/**
 *
 */
p.respawn = function(withShip) {
  console.log('TractorBeam :: respawn', withShip);
  this.orb.respawn(withShip);
  this.initSignals();
};

/**
 * //todo are these being added too often?
 * the getNumListeners check should prevent re-adding listeners already added,
 * we could clean this up so initSignals isn't called in that case
 * @method initSignals
 */
p.initSignals = function() {
  console.log('TractorBeam:: initSignals', this.orb.sensor.body.onBeginContact.getNumListeners());
  if (!this.orb.sensor.body.onBeginContact.getNumListeners()) {
    this.orb.sensor.body.onBeginContact.add(this.contactStart, this);
    this.orb.sensor.body.onEndContact.add(this.contactLost, this);
  }
};


module.exports = TractorBeam;
