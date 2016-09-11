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
  this.initialPos.setTo(levelManager.currentLevel.spawns[0].x, levelManager.currentLevel.spawns[0].y);
  this.respawnPos.copyFrom(this.initialPos);
  Phaser.Sprite.call(this, game, this.initialPos.x, this.initialPos.y, 'combined', 'player.png');
  this.groups.actors.add(this);

  this.thrustAnim = game.add.sprite(this.x, this.y, 'combined', 'rocket_001.png', this.groups.actors);
  this.thrustAnim.anchor.setTo(0.5, -0.6);
  this.thrustAnim.animations.add('rocket', [
    'rocket_001.png',
    'rocket_002.png'
  ], 4, true);
  this.thrustAnim.visible = false;
  this.refuelAnimSprite = game.add.sprite(this.x, this.y, 'combined', 'Fuel_PU_000.png', this.groups.actors);
  this.refuelAnimSprite.anchor.setTo(0.5);
  this.refuelAnimSprite.animations.add('refuelling', [
    'Fuel_PU_000.png',
    'Fuel_PU_001.png',
    'Fuel_PU_002.png',
    'Fuel_PU_003.png',
    'Fuel_PU_004.png',
    'Fuel_PU_005.png',
    'Fuel_PU_006.png',
    'Fuel_PU_007.png',
    'Fuel_PU_008.png',
    'Fuel_PU_009.png',
    'Fuel_PU_010.png',
    'Fuel_PU_011.png',
    'Fuel_PU_012.png',
    'Fuel_PU_013.png',
    'Fuel_PU_014.png',
    'Fuel_PU_015.png',
    'Fuel_PU_016.png',
    'Fuel_PU_017.png',
    'Fuel_PU_018.png',
    'Fuel_PU_019.png',
    'Fuel_PU_020.png',
    'Fuel_PU_021.png',
    'Fuel_PU_022.png',
    'Fuel_PU_023.png',
    'Fuel_PU_024.png'
  ], 30, true);
  this.refuelAnimSprite.visible = false;
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

};

p.orbHit = function() {

};

p.showRefuelAnim = function() {
  this.refuelAnimSprite.visible = true;
  this.refuelAnimSprite.play('refuelling');
};

p.hideRefuelAnim = function() {
  this.refuelAnimSprite.animations.stop('refuelling', true);
  this.refuelAnimSprite.visible = false;
};

/**
 * @method stop
 */
p.stop = function() {
  this.alive = false;
  this.body.setZeroVelocity();
  this.body.setZeroDamping();
  this.body.setZeroForce();
  this.body.setZeroRotation();
  this.body.motionState = 2;
  this.thrustSfx.stop();
};

p.resume = function() {
  this.alive = true;
  this.body.motionState = 1;
};

p.levelExit = function() {
  this.inPlay = false;
  //this.thrustEmitter.on = false;
  this.stopThrustFx();
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
  if (this.body) {
    this.refuelAnimSprite.x = this.body.x;
    this.refuelAnimSprite.y = this.body.y;
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
        this.thrustAnim.visible = true;
        this.thrustAnim.play('rocket');
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
    this.stopThrustFx();
  }
};

p.stopThrustFx = function() {
  this.thrustAnim.visible = false;
  this.thrustAnim.animations.stop('rocket', true);
  this.thrustStarted = false;
  this.thrustSfx.stop();
  this.thrustEmitter.on = false;
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
 * @param force {Boolean] force explosion of player even if not alive
 */
p.explosion = function (force) {
  if (this.alive || force === true) {
    var hasOrb = this.tractorBeam.isLocked;
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
  this.respawnPos = spawns[distances.indexOf(minDistance)];
  if (this.respawnPos.orb && hasOrb) {
    this.spawnWithOrb = true;
  }
};

p.doRefuel = function() {
  this.showRefuelAnim();
  this.frameName = 'player-refueling.png';
};

p.clearRefuel = function() {
  this.hideRefuelAnim();
  this.frameName = 'player.png';
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
  /*
  var speed = Math.abs(this.body.velocity.x) + Math.abs(this.body.velocity.y);
  var r = (this.width / 2) - speed / 60; //hardcoded position
  var oppositeAngle = this.rotation + (3 * Math.PI) / 2 - Math.PI;
  this.thrustEmitter.x = this.position.x + r * Math.cos(oppositeAngle);
  this.thrustEmitter.y = this.position.y + r * Math.sin(oppositeAngle);
  */

  this.thrustAnim.x = this.body.x;
  this.thrustAnim.y = this.body.y;
  this.thrustAnim.rotation = this.rotation;
};

/**
 * Called when the player is killed
 *
 * @method death
 */
p.death = function () {
  if (this.inPlay) {
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
