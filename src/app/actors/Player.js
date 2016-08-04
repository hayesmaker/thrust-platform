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
var ThrustSound = 'thrust4';
var sound = require('../utils/sound');

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
   * @property orbActivated
   * @type {boolean}
   * @default false
   */
  this.orbActivated = false;

  /**
   * @property joypadFireButton
   * @type {boolean}
   * @default true
   */
  this.joypadFireButton = true;
  /**
   * @property inPlay
   * @type {boolean}
   */
  this.inPlay = false;

  /**
   * @property spawnWithOrb
   * @type {boolean}
   */
  this.spawnWithOrb = false;

  /**
   * @property thrustStarted
   * @type {boolean}
   */
  this.thrustStarted = false;
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

  /**
   * @property respawnPos
   * @type {Phaser.Point}
   */
  this.respawnPos = new Phaser.Point();

  console.log('new Player');

  this.setStartPosition(levelManager.currentLevel.spawns[0].x, levelManager.currentLevel.spawns[0].y);
  this.respawnPos.copyFrom(this.initialPos);
  Phaser.Sprite.call(this, game, this.respawnPos.x, this.respawnPos.y, 'player');
  this.anchor.setTo(0.5);
  this.alpha = 0;
  this.init();
  this.thrustSfx = game.sfx.get('thrust4');
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
  this.explodeEmitter = game.add.emitter(this.x, this.y, 20);
  this.explodeEmitter.particleClass = ShipParticle;
  this.explodeEmitter.makeParticles();
  this.explodeEmitter.gravity = 10;

  this.thrustEmitter = game.add.emitter(this.x, this.y, 10);
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
  game.physics.p2.enable(this, properties.dev.debugPhysics);
  this.body.clearShapes();
  this.body.loadPolygon('playerPhysics', 'player');
  this.body.setCollisionGroup(this.collisions.players);
  //this.body.collides([this.collisions.orb], this.orbHit, this);
  this.body.collides([this.collisions.enemyBullets, this.collisions.terrain, this.collisions.orb, this.collisions.fuels], this.crash, this);
  this.body.collides([this.collisions.drones]);
  this.body.motionState = 2;
  this.body.mass = 1;
  this.respawn(completeCallback, context);
};

p.playerDronePass = function() {
  console.log('player drone pass');
};

p.orbHit = function() {
  console.log('orb hit');
};

/**
 * @method stop
 */
p.stop = function() {
  console.log('player :: stop');
  this.alive = false;
  this.body.setZeroVelocity();
  this.body.setZeroDamping();
  this.body.setZeroForce();
  this.body.setZeroRotation();
  this.body.motionState = 2;
};

p.resume = function() {
  console.log('player :: resume');
  this.alive = true;
  this.body.motionState = 1;
};

p.levelExit = function() {
  this.inPlay = false;
  //this.thrustEmitter.on = false;
  this.thrustSfx.stop();
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
  console.log('spawn');
  this.inGameArea = true;
  this.body.motionState = 1;
  //this.body.collideWorldBounds = true;
  this.alpha = 0;
  this.visible = true;
  this.alive = true;
  this.inPlay = true;
  TweenMax.to(this, 0.3, {alpha: 1, ease: Quad.easeOut} );
};

/**
 * Called when a player needs to materialise.
 * Either at mission start, or after a death.
 *
 * @method respawn
 * @param [completeCallback]
 * @param [thisArg]
 * @param [removeShip] {Boolean}
 */
p.respawn = function(completeCallback, thisArg, removeShip) {
  var self = this;
  console.warn('player :: respawn :: this.initialPos', this.initialPos);
  this.body.reset(this.respawnPos.x, this.respawnPos.y);
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

  sound.playSound('teleport-in3');
  particles.playerTeleport(this.respawnPos.x, this.respawnPos.y, function() {
    if (completeCallback) {
      completeCallback.call(thisArg);
    }
    self.spawn();
    if (self.spawnWithOrb) {
      self.tractorBeam.orb.respawn(true);
      self.tractorBeam.lock();
    }
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
  //if (this.alive ) {
    //this.exhaustUpdate();
  //}
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
 * @param cursors
 * @param buttonAPressed
 */
p.checkPlayerControl = function(cursors, buttonAPressed) {
  if (!this.alive || !this.inGameArea) {
    return;
  }
  this.checkRotate(game.controls.stick, cursors);
  this.checkThrust(buttonAPressed, cursors);
};

/**
 * Called by play update method, only when an external joypad
 * is connected.
 *
 * @method checkPlayerControlJoypad
 */
p.checkPlayerControlJoypad = function() {
  if (!this.alive || !this.inGameArea) {
    return;
  }
  this.checkJoypadFire();
  this.checkThrust(game.externalJoypad.thrustButton.isDown);
  this.checkRotate(null, game.externalJoypad);
};

/**
 * Necessary to check onUpCallback to stop firing constantly when
 * joypad fire button is pressed down.
 * Would be nice to find a nicer way to do this.
 *
 * @method checkJoypadFire
 */
p.checkJoypadFire = function() {
  game.input.gamepad.pad1.onUpCallback = function(buttonCode) {
    if (buttonCode === Phaser.Gamepad.BUTTON_1) {
      this.joypadFireButton = true;
    }
  }.bind(this);
  game.input.gamepad.pad1.onDownCallback = function(buttonCode) {
    if (buttonCode === Phaser.Gamepad.BUTTON_1 && this.joypadFireButton) {
      this.joypadFireButton = false;
      this.fire();
    }
  }.bind(this);
};

/**
 * @method checkRotate
 * @param stick
 * @param cursors
 */
p.checkRotate = function(stick, cursors) {
  if ((stick && stick.isDown && stick.direction === Phaser.LEFT) || cursors && cursors.left.isDown) {
    this.rotate(-90);
  } else if ((stick && stick.isDown && stick.direction === Phaser.RIGHT) || cursors && cursors.right.isDown) {
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
  if (cursors && cursors.up.isDown || buttonAPressed) {
    if (gameState.fuel >= 0) {
      if (!this.thrustStarted) {
        this.thrustStarted = true;
        if (sound.shouldPlaySfx()) {
          this.thrustSfx.play(ThrustSound, 0, 0.3, true);
        }
        //flow(lifespan, frequency, quantity, total, immediate)
        //this.thrustEmitter.flow(200, 10, 2, -1, true);
      }
      if (gameState.fuel % 5 === 0) {

      }
      this.body.thrust(400);
      gameState.fuel--;
    }
  } else {
    this.thrustStarted = false;
    this.thrustSfx.stop();
    this.thrustEmitter.on = false;
  }
};

/**
 * When this is called, we'll check the ditance of the player to the orb, and depending on distance,
 * either draw a tractorBeam
 *
 * @method checkOrbDistance
 */
p.checkOrbDistance = function () {
  var distance = utils.distAtoB(this.position, this.tractorBeam.orb.sprite.position);
  if (distance < this.tractorBeam.length && this.alive) {
    this.tractorBeam.drawBeam(this.position);
  } else if (distance >= this.tractorBeam.length && distance < this.tractorBeam.length + this.tractorBeam.variance) {
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
  if (this.inPlay) {
    this.turret.fire();
    sound.playSound('zap1');
  }
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
  if (this.alive) {
    var hasOrb = this.tractorBeam.isLocked;
    console.warn('explosion');
    this.explodeEmitter.x = this.position.x;
    this.explodeEmitter.y = this.position.y;
    this.explodeEmitter.start(true, 1500, null, 40);
    sound.playSound('boom1');
    this.thrustSfx.stop();
    if (hasOrb) {
      this.tractorBeam.breakLink();
    }
    this.visible = false;
    this.stop();
    this.setRespawnPosition(this.position, hasOrb);
  }
};

/**
 *
 *
 * @method setRespawnPosition
 * @param position {Phaser.Point}
 * @param hasOrb {Boolean}
 */
p.setRespawnPosition = function(position, hasOrb) {
  var spawns = levelManager.currentLevel.spawns;
  var distances = [];
  var distance;
  _.each(spawns, function(spawnPosition) {
    distance = utils.distAtoB(position, spawnPosition);
    distances.push(distance);
  });
  var minDistance = _.min(distances);
  console.log('setRespawnPosition :: distances / spawns:', distances, spawns);
  this.respawnPos = spawns[distances.indexOf(minDistance)];
  if (this.respawnPos.orb && hasOrb) {
    this.spawnWithOrb = true;
  }
  console.log('respawnPos=', this.respawnPos, this.spawnWithOrb);
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
  var r = (this.width / 2) - speed / 60; //hardcoded position
  var oppositeAngle = this.rotation + (3 * Math.PI) / 2 - Math.PI;
  this.thrustEmitter.x = this.position.x + r * Math.cos(oppositeAngle);
  this.thrustEmitter.y = this.position.y + r * Math.sin(oppositeAngle);
};

/**
 * Called when the player is killed
 *
 * @method death
 */
p.death = function () {
  if (this.inPlay) {
    console.log('player :: death');
    this.thrustEmitter.on = false;
    this.inPlay = false;
    this.alive = false;
    game.time.events.add(2000, _.bind(this.checkRespawn, this));
  }

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
