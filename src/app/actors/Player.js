//var game = window.game;
var properties = require('../properties');
var Turret = require('./Turret');
var utils = require('../environment/utils');
var ForwardFiring = require('./strategies/ForwardFiring');
var ShipParticle = require('./bitmaps/ShipParticle');
var ui = require('../ui');
var particles = require('../environment/particles');

/**
 * Player Ship
 *
 *
 * @param {number} x
 * @param {number} y
 * @param {Collisions} collisions - Our collisions container of collisionGroups
 * @param {Groups} groups - Our groups container
 * @class Player
 * @constructor
 */
function Player(x, y, collisions, groups) {
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
   *
   * @property isDead
   * @type {boolean}
   */
  this.isDead = true;

  /**
   * @property fuel
   * @type {number}
   */
  this.fuel = 500;

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

  Phaser.Sprite.call(this, game, x, y, 'player');

  this.anchor.setTo(0.5);
  this.alpha = 0;
  this.initialPos = {x: x, y: y};

  this.init();
}

var p = Player.prototype = Object.create(Phaser.Sprite.prototype, {
  constructor: Player
});

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

  this.turret = this.createTurret();
  this.emitter = game.add.emitter(this.x, this.y, 100);
  this.emitter.particleClass = ShipParticle;
  this.emitter.makeParticles();
  this.emitter.gravity = 200;

  //this.start();
  //this.stop();

};

p.stop = function() {
  this.body.removeFromWorld();
};

p.start = function () {
  console.log('Player :: start');
  game.physics.p2.enable(this, properties.debugPhysics);
  this.body.clearShapes();
  this.body.loadPolygon('playerPhysics', 'player');
  this.body.collideWorldBounds = properties.collideWorldBounds;
  this.body.collides([this.collisions.enemyBullets, this.collisions.terrain, this.collisions.orb], this.crash, this);
  this.body.setCollisionGroup(this.collisions.players);
  this.body.motionState = 2;
  this.body.mass = 1;
  this.respawn();
};

p.spawn = function() {
  this.inGameArea = true;
  this.body.motionState = 1;
  this.alpha = 1;
  this.isDead = false;
};

p.respawn = function(removeLife) {
  var self = this;
  this.body.reset(this.initialPos.x, this.initialPos.y);
  this.body.motionState = 2;
  this.alpha = 0;
  this.body.angle = 0;
  if (removeLife === true) {
    this.lives--;
  }
  ui.lives.update(this.lives, true);
  if (this.fuel < 500) {
    this.fuel = 500;
  }
  ui.fuel.update(this.fuel, true);
  this.tractorBeam.orb.respawn();
  particles.startSwirl(this.body.x, this.body.y);
  setTimeout(function() {
    self.spawn();
  }, 2500);

};

p.update = function () {
  if (!this.isDead && this.body) {
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
  if (distance < this.tractorBeam.length) {
    this.tractorBeam.drawBeam(this.position);

  } else if (distance >= this.tractorBeam.length && distance < 90) {
    if (this.tractorBeam.isLocked) {
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

p.rotate = function (val) {
  if (val < 0) {
    this.body.rotateLeft(Math.abs(val))
  } else {
    this.body.rotateRight(val);
  }
};

/**
 * @method explosion
 */
p.explosion = function () {
  this.emitter.x = this.position.x;
  this.emitter.y = this.position.y;
  this.emitter.start(true, 2000, null, 20);
  this.tractorBeam.breakLink();

};

/**
 * @method bulletEnd
 */
p.death = function () {
  if (this.isDead) {
    return;
  }
  var self = this;
  this.isDead = true;
  setTimeout(function() {
    self.checkRespawn();
  }, 5000);
};

p.checkRespawn = function() {
  if (this.lives === 0) {
    this.livesLost.dispatch(this.score);
  } else {
    this.respawn(true);
  }
};


module.exports = Player;
