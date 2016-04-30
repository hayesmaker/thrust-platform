'use strict';

var properties = require('../properties');
var Turret = require('./Turret');
var utils = require('../utils');
var ForwardFiring = require('./strategies/ForwardFiring');
var ShipParticle = require('./bitmaps/ShipParticle');
var particles = require('../environment/particles/manager');
var levelManager = require('../data/level-manager');
var gameState = require('../data/game-state');
var _ = require('lodash');

/**
 * A user controlled controlled spaceship
 *
 * @class Player
 * @param {Collisions} collisions - Our collisions container of collisionGroups
 * @param {Groups} groups - Our groups container
 * @extends {Phaser.Sprite}
 * @constructor
 */
function Player(collisions, groups) {
  /**
   * The collisions container
   *
   * @property collisions
   * @type {Collisions}
   */
  this.collisions = collisions;

  /**
   * The groups container
   *
   * @property groups
   * @type {Groups}
   */
  this.groups = groups;

  /**
   * @property inGameArea
   * @type {boolean}
   */
  this.inGameArea = false;
  /**
   * Dispatched when player has lost all lives
   *
   * @property livesLost
   * @type {Phaser.Signal}
   */
  this.livesLost = new Phaser.Signal();
  /**
   * A beam actor used by player to colect the orb
   *
   * @property tractorBeam
   * @type {TractorBeam}
   */
  this.tractorBeam = null;

  /**
   * @property explodeEmitter
   * @type {Phaser.Emitter}
   */
  this.explodeEmitter = null;

  /**
   * @property thrustEmitter
   * @type {Phaser.Emitter}
   */
  this.thrustEmitter = null;

  /**
   * @property initialPos
   * @type {Phaser.Point}
   */
  this.initialPos = new Phaser.Point();

  console.log('new Player');

  this.setStartPosition(game.width / 2 + levelManager.currentLevel.startPosition.x, game.height / 2 + levelManager.currentLevel.startPosition.y);
  Phaser.Sprite.call(this, game, this.initialPos.x, this.initialPos.y, 'player');
  this.anchor.setTo(0.5);
  this.alpha = 0;
  this.init();
}

var p = Player.prototype = Object.create(Phaser.Sprite.prototype, {
  constructor: Player
});
module.exports = Player;

/**
 * Sets the actor's initial position as a cached value
 *
 * @method setStartPosition
 */
p.setStartPosition = function(x, y) {
  this.initialPos.setTo(x, y);
};

/**
 * Cache the TractorBeam actor as a property of this Player for easier access
 *
 * @method setTractorBeam
 * @param tractorBeam
 */
p.setTractorBeam = function (tractorBeam) {
  this.tractorBeam = tractorBeam;
};

/**
 * Player initialisation
 *
 * @method init
 */
p.init = function () {
  this.alive = false;
  this.turret = this.createTurret();
  this.explodeEmitter = game.add.emitter(this.x, this.y, 10);
  this.explodeEmitter.particleClass = ShipParticle;
  this.explodeEmitter.makeParticles();
  this.explodeEmitter.gravity = 200;

  this.thrustEmitter = game.add.emitter(this.x, this.y, 0);
  this.thrustEmitter.particleClass = ShipParticle;
  this.thrustEmitter.minRotation = 0;
  this.thrustEmitter.maxRotation = 0;
  this.thrustEmitter.makeParticles();
};

/**
 * Reset player physics & position with a warp effect
 *
 * @method reset
 */
p.reset = function() {
  this.setStartPosition();
  this.respawn();
};

/**
 * @method start
 */
p.start = function (completeCallback, context) {
  console.log('Player :: start');
  game.physics.p2.enable(this, properties.debugPhysics);
  this.body.clearShapes();
  this.body.loadPolygon('playerPhysics', 'player');
  this.body.collides([this.collisions.enemyBullets, this.collisions.terrain, this.collisions.orb, this.collisions.fuels], this.crash, this);
  this.body.setCollisionGroup(this.collisions.players);
  this.body.motionState = 2;
  this.body.mass = 1;
  this.respawn(completeCallback, context);
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
 * Remove ship after warping out
 *
 * @method tweenOutAndRemove
 */
p.tweenOutAndRemove = function(removeWithOrb) {
  TweenMax.to(this, 0.4, {alpha: 0, ease: Quad.easeOut} );
  if (removeWithOrb) {
    TweenMax.to(this.tractorBeam.orb.sprite, 0.4, {alpha: 0, ease: Quad.easeOut});
  }
};

/**
 * @method spawn
 */
p.spawn = function() {
  this.inGameArea = true;
  this.body.motionState = 1;
  this.alpha = 0;
  this.alive = true;
  TweenMax.to(this, 0.4, {alpha: 1, ease: Quad.easeOut} );
};

/**
 * Called when a player needs to materialise.
 * Either at mission start, or after a death.
 *
 * @method respawn
 * @param completeCallback
 * @param thisArg
 * @param removeShip {Boolean}
 */
p.respawn = function(completeCallback, thisArg, removeShip) {
  var self = this;
  console.warn('player :: respawn :: this.initialPos', this.initialPos);
  this.body.reset(this.initialPos.x, this.initialPos.y);
  this.body.setZeroVelocity();
  this.body.setZeroDamping();
  this.body.setZeroForce();
  this.body.setZeroRotation();
  this.body.motionState = 2;
  this.body.angle = 0;
  this.alpha = 0;
  if (removeShip === true) {
    gameState.lives--;
  }
  this.tractorBeam.orb.respawn();
  particles.playerTeleport(this.body.x, this.body.y, function() {
    if (completeCallback) {
      completeCallback.call(thisArg);
    }
    self.spawn();
  });
};

/**§
 * Player Update Loop
 * Called from Play.State
 *
 *
 * @method update§
 */
p.update = function () {
  if (this.alive ) {
    this.exhaustUpdate();
  }
};

/**
 * @method createTurret
 * @return {Turret|exports|module.exports}
 */
p.createTurret = function () {
  var bulletBitmap = game.make.bitmapData(5, 5);
  bulletBitmap.ctx.fillStyle = '#ffffff';
  bulletBitmap.ctx.beginPath();
  bulletBitmap.ctx.arc(1.5, 1.5, 3, 0, Math.PI * 2, true);
  bulletBitmap.ctx.closePath();
  bulletBitmap.ctx.fill();
  return new Turret(this.groups, this, new ForwardFiring(this, this.collisions, this.groups, bulletBitmap, gameState.PLAYER_BULLET_DURATION));
};

/**
 * @method checkPlayerControl
 * @param stick
 * @param cursors
 * @param buttonAPressed
 */
p.checkPlayerControl = function(stick, cursors, buttonAPressed) {
  if (!this.alive || !this.inGameArea) {
    return;
  }
  this.checkRotate(stick, cursors);
  this.checkThrust(buttonAPressed, cursors);
};

/**
 * @method checkRotate
 * @param stick
 * @param cursors
 */
p.checkRotate = function(stick, cursors) {
  if ((stick && stick.isDown && stick.direction === Phaser.LEFT) || cursors.left.isDown) {
    this.rotate(-90);
  } else if ((stick && stick.isDown && stick.direction === Phaser.RIGHT) || cursors.right.isDown) {
    this.rotate(90);
  } else if (!game.e2e.controlOverride) {
    this.body.setZeroRotation();
  }
};

/**
 * @method checkThrust
 * @param buttonAPressed
 * @param cursors
 */
p.checkThrust = function(buttonAPressed, cursors) {
  if (cursors.up.isDown || buttonAPressed) {
    if (gameState.fuel >= 0) {
      if (gameState.fuel % 5 === 0) {
        this.thrustStart();
      }
      this.body.thrust(400);
      gameState.fuel--;
    }
  } else {
    this.cutEngine();
  }
};

/**
 * When this is called, we'll check the distance of the player to the orb, and depending on distance,
 * either draw a tractorBeam
 *
 * @method checkOrbDistance
 */
p.checkOrbDistance = function () {
  var distance = utils.distAtoB(this.position, this.tractorBeam.orb.sprite.position);
  if (distance < this.tractorBeam.length && this.alive) {
    this.tractorBeam.drawBeam(this.position);
  } else if (distance >= this.tractorBeam.length && distance < 90) {
    if (this.tractorBeam.isLocked && this.alive) {
      this.tractorBeam.grab(this);
    }
  } else {
    if (this.tractorBeam.isLocking) {
      this.tractorBeam.lockingRelease();
    }
  }
};

/**
 * Fires the current actor's turret
 *
 * @method shoot
 */
p.fire = function () {
  this.turret.fire();
};

/**
 * Called on collision with terrain, enemy bullet, or some other fatal collision
 *
 * @method crash
 */
p.crash = function () {
  if (!properties.fatalCollisions) {
    console.log('Hit but no effect');
    return;
  }
  this.explosion();
  this.death();
};

/**
 * Rotates the player body by a positive degree rotation or a negative degree rotation
 *
 * @method rotate
 * @param val
 */
p.rotate = function (val) {
  if (val < 0) {
    this.body.rotateLeft(Math.abs(val));
  } else {
    this.body.rotateRight(val);
  }
};

/**
 * Called when the player collides with something.
 *
 * @method explosion
 */
p.explosion = function () {
  this.explodeEmitter.x = this.position.x;
  this.explodeEmitter.y = this.position.y;
  this.explodeEmitter.start(true, 500, null, 1);
  this.cutEngine();
  this.tractorBeam.breakLink();
};

/**
 * @method thrustStart
 */
p.thrustStart = function() {
  if (!this.thrustEmitter.on) {
    this.thrustEmitter.start(false, 200, 1, 1, 1);
  }
};

/**
 * Maths
 * ```
 * x = cx + r * cos(a)
 * y = cy + r * sin(a)
 * ```
 * @method exhaustUpdate
 */
p.exhaustUpdate = function() {
  var speed = Math.abs(this.body.velocity.x) + Math.abs(this.body.velocity.y);
  var r = (this.width / 2) - speed / 60;
  var oppositeAngle = this.rotation + (3 * Math.PI) / 2 - Math.PI;
  this.thrustEmitter.x = this.position.x + r * Math.cos(oppositeAngle);
  this.thrustEmitter.y = this.position.y + r * Math.sin(oppositeAngle);
};

/**
 * @method cutEngine
 */
p.cutEngine = function() {
  this.exhaustUpdate();
  this.thrustEmitter.on = false;
};

/**
 * Called when the player is killed
 *
 * @method death
 */
p.death = function () {
  if (!this.alive) {
    return;
  }
  var self = this;
  this.alive = false;
  game.time.events.add(3000, _.bind(self.checkRespawn, this));
};

/**
 * @method dispatch game over if player lives are lost
 * @param callback
 * @param context
 * @param [removeShip] {Boolean} If resulting from a fatal collision re-spawn and lose a ship
 */
p.checkRespawn = function(callback, context, removeShip) {
  if (--gameState.lives < 0) {
    gameState.lives = -1;
    //this.livesLost.dispatch();
  } else {
    this.respawn(callback, context, removeShip);
  }
};
