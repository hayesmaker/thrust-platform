'use strict';

var properties = require('../properties');
var game = window.game;
var graphics;
var timer;
var lockingDuration = properties.gamePlay.lockingDuration;

/**
 * TractorBeam description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class TractorBeam
 * @constructor
 */
function TractorBeam(orb, player) {
  this.orb = orb;
  this.player = player;
  this.isLocked = false;
  this.isLocking = false;
  this.hasGrabbed = false;
  this.length = properties.gamePlay.tractorBeamLength;
  this.variance = properties.gamePlay.tractorBeamVariation;
  this.constraint = null;
  this.init();
}

var p = TractorBeam.prototype;

/**
 * TractorBeam initialisation
 *
 * @method init
 */
p.init = function () {
  graphics = new Phaser.Graphics(game, 0, 0);
  this.sprite = game.add.sprite(0, 0);
  this.sprite.addChild(graphics);
  timer = game.time.create(false);
};

/**
 * @method checkDistance
 * @param player
 * @param isXDown {Boolean} if x button is pressed for manual locking mode
 */
p.checkDistance = function(player, isXDown) {
  if (!this.hasGrabbed) {
    if (isXDown || properties.gamePlay.autoOrbLocking) {
      player.checkOrbDistance();
    }
  } else {
    this.drawBeam(player.position);
  }
};

/**
 * @method drawBeam
 * @param posA
 */
p.drawBeam = function (posA) {
  if (!this.isLocking) {
    this.isLocking = true;
    timer.start();
    timer.add(lockingDuration, this.lock, this);
  }
  graphics.clear();
  var colour = this.hasGrabbed ? 0x00ff00 : 0xEF5696;
  var alpha = this.hasGrabbed ? 0.5 : 0.4;
  graphics.lineStyle(5, colour, alpha);
  graphics.moveTo(posA.x, posA.y);
  graphics.lineTo(this.orb.sprite.position.x, this.orb.sprite.position.y);
};

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
    graphics.clear();
    timer.stop(true);
  }
};

/**
 * @method grab
 * @param player
 */
p.grab = function (player) {
  this.hasGrabbed = true;
  var maxForce = 200000;
  var diffX = player.position.x - this.orb.sprite.position.x;
  var diffY = player.position.y - this.orb.sprite.position.y;
  this.constraint = game.physics.p2.createRevoluteConstraint(player, [0, 0], this.orb.sprite, [diffX, diffY], maxForce);
  this.orb.move();
  //this.orb.setPlayer(this.player);
};

/**
 * @method breakLink
 */
p.breakLink = function () {
  this.unlock();
  this.lockingRelease();
  this.player = null;
  game.physics.p2.removeConstraint(this.constraint);
};


module.exports = TractorBeam;
