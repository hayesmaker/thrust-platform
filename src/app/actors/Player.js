'use strict';

var properties = require('../properties');
var Turret = require('./Turret');
var utils = require('../environment/utils');
var ForwardFiring = require('./strategies/ForwardFiring');
var ShipParticle = require('./bitmaps/ShipParticle');
var ui = require('../ui');
var particles = require('../environment/particles');
var levelManager = require('../data/level-manager');

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
   * A beam actor used by player to colect the orb
   *
   * @property tractorBeam
   * @type {TractorBeam}
   */
  this.tractorBeam = null;

  /**
   * @property emitter
   * @type {Phaser.Emitter}
   */
  this.emitter;

  /**
   * Player has been destroyed
   * - Use this.alive instead
   *
   * @deprecated
   * @property isDead
   * @type {boolean}
   */
  this.isDead = true;

  /**
   * @property fuel
   * @type {number}
   */
  this.fuel = 25000;

  /**
   * @property lives
   * @type {number}
   */
  this.lives = 5;

  /**
   * @property score
   * @type {number}
   */
  this.score = 0;

  /**
   * @property initialPos
   * @type {Phaser.Point}
   */
  this.initialPos = new Phaser.Point();

  this.setStartPosition();

  Phaser.Sprite.call(this, game, this.initialPos.x, this.initialPos.y, 'player');

  this.anchor.setTo(0.5);
  this.alpha = 0;

  this.init();
}

var p = Player.prototype = Object.create(Phaser.Sprite.prototype, {
  constructor: Player
});

/**
 * @method setStartPosition
 */
p.setStartPosition = function() {
  this.initialPos.x = game.width / 2 + levelManager.currentLevel.startPosition.x;
  this.initialPos.y = game.height / 2 + levelManager.currentLevel.startPosition.y;
};

/**
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
  this.emitter = game.add.emitter(this.x, this.y, 100);
  this.emitter.particleClass = ShipParticle;
  this.emitter.makeParticles();
  this.emitter.gravity = 200;

};

/**
 *
 */
/*
p.stop = function() {
  this.body.removeFromWorld();
};
*/
p.reset = function() {
  this.setStartPosition();
  this.respawn();
};

/**
 * @method start
 */
p.start = function () {
  console.log('Player :: start');
  game.physics.p2.enable(this, properties.debugPhysics);
  this.body.clearShapes();
  this.body.loadPolygon('playerPhysics', 'player');
  this.body.collides([this.collisions.enemyBullets, this.collisions.terrain, this.collisions.orb], this.crash, this);
  this.body.setCollisionGroup(this.collisions.players);
  this.body.motionState = 2;
  this.body.mass = 1;
  this.respawn();
};

/**
 * @method spawn
 */
p.spawn = function() {
  this.inGameArea = true;
  this.body.motionState = 1;
  this.alpha = 1;
  this.isDead = false;
  this.alive = true;
};

/**
 * Called when a player needs to materialise.
 * Either at mission start, or after a death.
 *
 * @method respawn
 * @param removeShip {Boolean}
 */
p.respawn = function(removeShip) {
  var self = this;
  console.warn('player :: respawn :: this.initialPos', this.initialPos);
  this.body.reset(this.initialPos.x, this.initialPos.y);
  this.body.motionState = 2;
  this.alpha = 0;
  this.body.angle = 0;
  if (removeShip === true) {
    this.lives--;
  }
  ui.lives.update(this.lives, true);
  ui.fuel.update(this.fuel, true);
  this.tractorBeam.orb.respawn();
  particles.startSwirl(this.body.x, this.body.y);
  setTimeout(function() {
    self.spawn();
  }, 2500);
};

/**
 * Player Update Loop
 * Called from Play.State
 *
 *
 * @method update
 */
p.update = function () {
  if (this.alive && this.body) {
    this.turret.update();
  }
};

/**
 *
 * @method createTurret
 * @returns {Turret|exports|module.exports}
 */
p.createTurret = function () {
  var bulletBitmap = game.make.bitmapData(5, 5);
  bulletBitmap.ctx.fillStyle = '#ffffff';
  bulletBitmap.ctx.beginPath();
  bulletBitmap.ctx.arc(1.5, 1.5, 3, 0, Math.PI * 2, true);
  bulletBitmap.ctx.closePath();
  bulletBitmap.ctx.fill();
  return new Turret(this.groups, this, new ForwardFiring(this, this.collisions, this.groups, bulletBitmap, 350));
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
    this.body.rotateLeft(Math.abs(val))
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
  this.emitter.x = this.position.x;
  this.emitter.y = this.position.y;
  this.emitter.start(true, 2000, null, 20);
  this.tractorBeam.breakLink();

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
  this.isDead = true;
  this.alive = false;
  setTimeout(function() {
    self.checkRespawn(true);
  }, 5000);
};

/**
 * @method dispatch game over if player lives are lost
 * @param [removeShip] {Boolean} If resulting from a fatal collision re-spawn and lose a ship
 */
p.checkRespawn = function(removeShip) {
  if (this.lives === 0) {
    alert('game over! refresh');
    this.livesLost.dispatch(this.score);
  } else {
    this.respawn(removeShip);
  }
};


module.exports = Player;
