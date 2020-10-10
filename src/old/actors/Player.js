'use strict';

var properties = require('../properties');
var utils = require('../utils');
var ShipParticle = require('./bitmaps/ShipParticle');
var particles = require('../environment/particles/manager');
var levelManager = require('../data/level-manager');
var gameState = require('../data/game-state');
var _ = require('lodash');
var sound = require('../utils/sound');
var ThrustSound = sound.PLAYER_THRUST_MID;

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
  this.rotateVal = 90;
  this.thrustVal = 400;
  /**
   * @property orbActivated
   * @type {boolean}
   * @default false
   */
  this.orbActivated = false;

  /**
   * @property debounceGamepadFire
   * @type {boolean}
   */
  p.debounceGamepadFire = true;

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
   * @deprecated
   */
  this.thrustEmitter = null;

  /**
   * @property initialPos
   * @type {Phaser.Point}
   */
  this.initialPos = new Phaser.Point();

  /**
   * @property isRefuelling
   * @type {boolean}
   */
  this.isRefuelling = false;

  /**
   * @property onKilled
   * @type {Phaser.Signal}
   */
  this.onKilled = new Phaser.Signal();
  /**
   * @property earlyInterstitial
   * @type {Phaser.Signal}
   */
  this.earlyInterstitial = new Phaser.Signal();

  /**
   * @property respawnPos
   * @type {Phaser.Point}
   */
  this.respawnPos = new Phaser.Point();
  this.initialPos.setTo(levelManager.currentLevel.player.spawns[0].x, levelManager.currentLevel.player.spawns[0].y);
  this.respawnPos.copyFrom(this.initialPos);
  Phaser.Sprite.call(this, game, this.initialPos.x, this.initialPos.y, 'combined', 'player.png');
  var scale = levelManager.currentLevel.player.scale;
  this.scale.setTo(scale);
  this.groups.actors.add(this);
  this.thrustAnim = game.add.sprite(this.x, this.y, 'combined', 'rocket_001.png', this.groups.actors);
  this.thrustAnim.scale.setTo(scale);
  this.thrustAnim.anchor.setTo(0.5, -0.6);
  this.thrustAnim.animations.add('rocket', [
    'rocket_002.png',
    'rocket_001.png'
  ], 4, true);
  this.thrustAnim.visible = false;
  this.refuelAnimSprite = game.add.sprite(this.x, this.y, 'combined', 'Fuel_PU_000.png', this.groups.actors);
  this.refuelAnimSprite.anchor.setTo(0.5);
  this.refuelAnimSprite.scale.setTo(scale);
  this.refuelAnimSprite.animations.add('refuelling', [
    'Fuel_PU_000.png',
    'Fuel_PU_002.png',
    'Fuel_PU_004.png',
    'Fuel_PU_006.png',
    'Fuel_PU_008.png',
    'Fuel_PU_010.png',
    'Fuel_PU_012.png',
    'Fuel_PU_014.png',
    'Fuel_PU_016.png',
    'Fuel_PU_018.png',
    'Fuel_PU_020.png',
    'Fuel_PU_022.png',
    'Fuel_PU_024.png'
  ], 15, true);
  this.refuelAnimSprite.visible = false;
  this.alpha = 0;
  this.init();
  if (game.sfx) {
    this.thrustSfx = game.sfx.get(ThrustSound);
  }
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
p.setStartPosition = function (x, y) {
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
  this.explodeEmitter = game.add.emitter(this.x, this.y, 20);
  this.explodeEmitter.particleClass = ShipParticle;
  this.explodeEmitter.makeParticles();
  this.explodeEmitter.gravity = 10;
};

/**
 * Reset player physics & position with a warp effect
 *
 * @method reset
 */
p.reset = function () {
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
  //todo make orb in a seperate collides if possible and do only if (this.tractorBeam)
  this.body.collides([this.collisions.enemyBullets, this.collisions.terrain, this.collisions.orb, this.collisions.fuels], this.crash, this);
  this.body.collides([this.collisions.drones]);
  this.body.motionState = 2;
  this.body.mass = 1;
  this.respawn(completeCallback, context);
};

/**
 * @method showRefuelAnim
 */
p.showRefuelAnim = function () {
  this.refuelAnimSprite.visible = true;
  this.refuelAnimSprite.play('refuelling');
  sound.playSound(sound.FUEL_REFUELLING, 1, true);
};

/**
 * @method hideRefuelAnim
 */
p.hideRefuelAnim = function () {
  this.refuelAnimSprite.animations.stop('refuelling', true);
  this.refuelAnimSprite.visible = false;
  if (game.sfx) {
    game.sfx.stop(sound.FUEL_REFUELLING);
  }

};

/**
 * @method stop
 */
p.stop = function () {
  this.alive = false;
  this.body.setZeroVelocity();
  this.body.setZeroDamping();
  this.body.setZeroForce();
  this.body.setZeroRotation();
  this.body.motionState = 2;
};

p.resume = function () {
  this.alive = true;
  this.body.motionState = 1;
};

/**
 * @method levelExit
 */
p.levelExit = function () {
  this.inPlay = false;
  this.stopThrustFx();
};

/**
 * Remove ship after warping out
 *
 * @method tweenOutAndRemove
 */
p.tweenOutAndRemove = function (removeWithOrb) {
  TweenMax.to(this, 0.4, {alpha: 0, ease: Quad.easeOut});
  if (removeWithOrb) {
    TweenMax.to(this.tractorBeam.orb.sprite, 0.4, {alpha: 0, ease: Quad.easeOut});
  }
};

/**
 * @method spawn
 */
p.spawn = function () {
  this.inGameArea = true;
  this.body.motionState = 1;
  this.alpha = 0;
  this.visible = true;
  this.alive = true;
  this.inPlay = true;
  TweenMax.to(this, 0.3, {alpha: 1, ease: Quad.easeOut});
};

/**
 * Called when a player needs to materialise.
 * Either at mission start, or after a death.
 *
 * @method respawn
 * @param [completeCallback]
 * @param [thisArg]
 * @param [removeShip] {boolean}
 */
p.respawn = function (completeCallback, thisArg, removeShip) {
  this.body.reset(this.respawnPos.x, this.respawnPos.y);
  this.body.setZeroVelocity();
  this.body.setZeroDamping();
  this.body.setZeroForce();
  this.body.setZeroRotation();
  this.body.motionState = 2;
  this.body.angle = 0;
  this.alpha = 0;
  if (removeShip && !gameState.cheats.infiniteLives) {
    gameState.lives--;
  }
  sound.playSound(sound.PLAYER_TELEPORT_IN);
  particles.playerTeleport(this.respawnPos.x, this.respawnPos.y, this.scale.x,
    function () {
      if (completeCallback) {
        completeCallback.call(thisArg);
      }
      this.spawn();
      if (this.spawnWithOrb) {
        this.tractorBeam.respawn(true);
      } else {
        if (this.tractorBeam) {
          this.tractorBeam.respawn(false);
        }
      }
    }.bind(this));
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
 * @method checkPlayerControl
 * @param cursors
 */
p.checkPlayerControl = function (cursors) {
  if (!this.alive || !this.inGameArea) {
    this.stopThrustFx();
    return;
  }
  this.checkVirtualFireButton();
  this.checkJoypadFire();
  this.checkRotate(game.externalJoypad.isConnected? game.externalJoypad : null, cursors);
  this.checkThrust(game.externalJoypad.isConnected? game.externalJoypad : null, cursors);
};


p.checkVirtualFireButton = function() {
  if (game.controls.fireButtonIsDown && this.canFire) {
    this.fire();
    this.canFire = false;
  } else if (!game.controls.fireButtonIsDown) {
    this.canFire = true;
  }
};

/**
 * Necessary to check onUpCallback to stop firing constantly when
 * joypad fire button is pressed down.
 * Would be nice to find a nicer way to do this.
 *
 * @method checkJoypadFire
 */
p.checkJoypadFire = function () {
  var gamepad = game.externalJoypad;
  if (gamepad.isConnected) {
    if (gamepad.fireButton.isUp) {
      this.debounceGamepadFire = false;
    } else if (gamepad.fireButton.isDown && !this.debounceGamepadFire) {
      this.debounceGamepadFire = true;
      this.fire();
    }
  }
};

/**
 * @method checkRotate
 * @param stick
 * @param cursors
 */
p.checkRotate = function (stick, cursors) {
  if ((cursors && cursors.left.isDown) ||
    stick && stick.left.isDown ||
    game.controls.moveLeftIsDown) {
    this.rotate(-this.rotateVal);
  } else if ((cursors && cursors.right.isDown) ||
    stick && stick.right.isDown ||
    game.controls.moveRightIsDown) {
    this.rotate(this.rotateVal);
  } else if (!game.e2e.controlOverride) {
    this.body.setZeroRotation();
  }
};

/**
 * @method checkThrust
 * @param stick
 * @param cursors
 */
p.checkThrust = function (stick, cursors) {
  if ((cursors && cursors.up.isDown) ||
    (stick && stick.thrustButton.isDown ||
      game.controls.thrustButtonIsDown)) {
    if (gameState.fuel >= 0) {
      if (!this.thrustStarted) {
        this.thrustStarted = true;
        this.thrustAnim.visible = true;
        this.thrustAnim.play('rocket');
        sound.playSound(ThrustSound, 0.6, true);
      }
      this.body.thrust(this.thrustVal);
      if (!this.isRefuelling && !gameState.cheats.infiniteFuel) {
        gameState.fuel--;
      }
    }
  } else {
    this.stopThrustFx();
  }
};

/**
 * @method stopThrustFx
 */
p.stopThrustFx = function () {
  this.thrustAnim.visible = false;
  this.thrustAnim.animations.stop('rocket', true);
  this.thrustStarted = false;
  if (game.sfx) {
    game.sfx.stop(ThrustSound);
  }
};

/**
 * When this is called, we'll check the ditance of the player to the orb, and depending on distance,
 * either draw a tractorBeam
 *
 * @deprecated
 * @method checkOrbDistance
 */
p.connectAttempt = function () {
  var distance = utils.distAtoB(this.position, this.tractorBeam.orb.sprite.position);
  if (distance < this.tractorBeam.length && this.alive) {
    this.tractorBeam.drawBeam(this.position);
  } else if (distance >= this.tractorBeam.length && distance < this.tractorBeam.length + this.tractorBeam.variance) {
    if (this.tractorBeam.isLocked && this.alive) {
      this.tractorBeam.grab(this);
    }
  }
};


/**
 * Player Fire!
 * Picks a free bullet from the bullet pool and fires
 *
 * @method shoot
 */
p.fire = function () {
  if (this.inPlay) {
    this.groups.playerBullets.fire(this);
    sound.playSound(sound.PLAYER_FIRE);
  }
};

/**
 * Called on collision with terrain, enemy bullet, or some other fatal collision
 *
 * @method crash
 */
p.crash = function () {
  if (!properties.fatalCollisions || !gameState.cheats.fatalCollisions) {
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
 * @param [force] {Boolean} force explosion of player even if not alive
 */
p.explosion = function (force) {
  if (this.alive || force === true) {
    var hasOrb = false;
    this.stopThrustFx();
    if (this.tractorBeam) {
      hasOrb = this.tractorBeam.isLocked;
    }
    this.explodeEmitter.x = this.position.x;
    this.explodeEmitter.y = this.position.y;
    this.explodeEmitter.start(true, 1500, null, 40);
    sound.playSound(sound.PLAYER_EXPLOSION, 3);
    if (hasOrb) {
      this.tractorBeam.breakLink();
    }
    this.visible = false;
    this.stop();
    this.setRespawnPosition(this.position, hasOrb);
  }
};

/**
 * Set the Player spawn position with a number of requirements
 *
 * The basic behaviour is for the nearest spawn point to the player to be calculated
 * and used as the respawn position.
 *
 * However this might lead you to spawn in front of an enemy
 * So each spawn Position defines a minimum number of enemies that need to be killed
 * Before that spawn position can be used.
 *
 * Also we set the spawnWithOrb to be true if the player has the orb
 * Some spawn positions allow the player to respawn with the orb attached
 *
 * @method setRespawnPosition
 * @param position {Phaser.Point}
 * @param hasOrb {Boolean}
 */
p.setRespawnPosition = function (position, hasOrb) {
  var spawns = levelManager.currentLevel.player.spawns;
  var distances = [];
  var distance;
  var enemiesKilled = _.findIndex(this.groups.enemies.children, function (limpet) {
    return limpet.exists === true;
  });
  if (enemiesKilled === -1) {
    enemiesKilled = this.groups.enemies.children.length;
  }
  console.warn('enemies killed %d group =', enemiesKilled, this.groups.enemies);
  _.each(spawns, function (spawnPosition) {
    distance = utils.distAtoB(position, spawnPosition);
    if (enemiesKilled >= spawnPosition.enemies) {
      distances.push(distance);
    }
  });

  if (distances.length > 0) {
    var minDistance = _.min(distances);
    this.respawnPos = spawns[distances.indexOf(minDistance)];
  } else {
    this.respawnPos = spawns[0];
  }

  if (this.respawnPos.orb && hasOrb) {
    this.spawnWithOrb = true;
  }
};

/**
 * @method doRefuel
 */
p.doRefuel = function () {
  this.isRefuelling = true;
  this.showRefuelAnim();
  this.frameName = 'player-refueling.png';
};

/**
 * @method clearRefuel
 */
p.clearRefuel = function () {
  this.isRefuelling = false;
  this.hideRefuelAnim();
  this.frameName = 'player.png';
};

/**
 * Maths
 * ```
 * x = cx + r * cos(a)
 * y = cy + r * sin(a)
 *
 *
 var speed = Math.abs(this.body.velocity.x) + Math.abs(this.body.velocity.y);
 var r = (this.width / 2) - speed / 60; //hardcoded position
 var oppositeAngle = this.rotation + (3 * Math.PI) / 2 - Math.PI;
 this.thrustEmitter.x = this.position.x + r * Math.cos(oppositeAngle);
 this.thrustEmitter.y = this.position.y + r * Math.sin(oppositeAngle);
 * ```
 * @method exhaustUpdate
 */
p.exhaustUpdate = function () {
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
    this.onKilled.dispatch();
    this.inPlay = false;
    this.alive = false;
    game.time.events.add(2000, _.bind(this.checkRespawn, this));
  }
};

/**
 *
 *
 * @method dispatch game over if player lives are lost
 * @param callback
 * @param context
 */
p.checkRespawn = function (callback, context) {
  if (gameState.lives - 1 < 0 || gameState.fuel <= 0) {
    console.log('game over');
    gameState.isGameOver = true;
    //game over
  } else {
    if (!gameState.bonuses.planetBuster) {
      this.respawn(callback, context, true);
    } else {
      if (!gameState.cheats.infiniteLives) {
        gameState.lives--;
      }
      this.earlyInterstitial.dispatch();
    }


  }
};
