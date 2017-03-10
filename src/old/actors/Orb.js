var properties = require('../properties');
var gameState = require('./game-state');

/**
 * Orb description
 * calls init
 *
 * @class Orb
 * @constructor
 * @param groups
 * @param x
 * @param y
 * @param collisions
 * @constructor
 */
function Orb(groups, x, y, collisions) {
  this.groups = groups;
  this.collisions = collisions;
  this.player = null;
  this.sprite = game.add.sprite(x, y, 'combined', 'orb.png', this.groups.actors);
  this.glowSprite = game.make.sprite(x, y, 'combined', 'orb-shine.png');
  this.glowSprite.anchor.setTo(0.5);
  this.groups.actors.add(this.glowSprite);
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
  this.initPhysics();
  this.drawSensor();
  this.initSensorPhysics();
};

p.initPhysics = function () {
  game.physics.p2.enable(this.sprite, properties.dev.debugPhysics);
  this.body = this.sprite.body;
  this.body.setCircle(13, 0, 0);
  this.body.motionState = 2;
  this.body.setCollisionGroup(this.collisions.orb);
  this.body.collides([this.collisions.players, this.collisions.terrain, this.collisions.fuels], this.crash, this);
};

/**
 * @method drawSensor
 */
p.drawSensor = function () {
  var bmd = game.make.bitmapData(60, 60);
  bmd.ctx.beginPath();
  bmd.ctx.fillStyle = "rgba(255,0,0, 0)";
  bmd.ctx.arc(30, 30, 30, 0, Math.PI * 2, true);
  bmd.ctx.fill();
  bmd.ctx.closePath();
  this.sensor = game.add.sprite(this.body.x, this.body.y, bmd, this.groups.actors);
  this.sensor.width = 190;
  this.sensor.height = 190;
};


/**
 * addCircle(radius, offsetX, offsetY, rotation) → {p2.Circle}
 *
 * @method initSensorPhysics
 */
p.initSensorPhysics = function () {
  game.physics.p2.enable(this.sensor, properties.dev.debugPhysics);
  this.sensor.body.clearShapes();
  var box = this.sensor.body.addCircle(this.sensor.width / 2, 0, 0, 0);
  box.sensor = true;
  this.sensor.body.motionState = 2;
  this.sensor.body.setCollisionGroup(this.collisions.orb);
  this.sensor.body.collides([this.collisions.players]);
};

p.disposeSensor = function () {
  this.sensor.body.onBeginContact.removeAll();
  this.sensor.body.onEndContact.removeAll();
  this.sensor.body.removeFromWorld();
  this.sensor.body.destroy();
  this.sensor.destroy();
  this.sensor = null;
  //this.glowSprite.destroy();
  //this.glowSprite = null;
};

p.dispose = function () {
  if (this.sprite && this.sprite.body) {
    this.sprite.body.removeFromWorld();
    this.sprite.destroy();
    this.sprite.body = null;
    this.sprite = null;
  }
  if (this.sensor) {
    this.disposeSensor();
  }
  this.glowSprite.destroy();
  this.glowSprite = null;
};


p.bulletHit = function () {
  console.log('bulletHit');
  if (!this.sensor && !gameState.cheats.infiniteLives &&
    gameState.cheats.fatalCollisions) {
    this.player.crash();
    this.body.motionState = 1;
    this.sprite.alpha = 0;
  }
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
  console.log('move');
  this.body.motionState = 1;
  this.body.mass = 1;
  this.body.velocity = 0;
  this.body.angularVelocity = 0;
  this.body.angle = 0;
  this.body.collides([this.collisions.bullets, this.collisions.enemyBullets], this.bulletHit, this);
  this.glowSprite.visible = false;
};

/**
 * @method stop
 */
p.stop = function () {
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
  console.warn('this.crash', this.player);
  if (gameState.cheats.fatalCollisions) {
    if (this.player) {
      this.player.crash();
    }
    this.glowSprite.visible = false;
    this.body.motionState = 1;
  }

};

p.removeBulletCollisions = function () {
  this.body.removeCollisionGroup([this.collisions.bullets, this.collisions.enemyBullets]);
};

/**
 * Stop the orb and reset location to starting position
 * Or if Player crashed with orb, and near an orb spawn location, spawn the orb near the player
 *
 * @method respawn
 */
p.respawn = function (withShip) {
  var orbSpawnPosition = new Phaser.Point();
  if (withShip) {
    orbSpawnPosition.copyFrom(this.player.position);
    orbSpawnPosition.y = orbSpawnPosition.y + properties.gamePlay.tractorBeamLength;
  } else {
    orbSpawnPosition.copyFrom(this.initialPosition);
  }
  this.body.reset(orbSpawnPosition.x, orbSpawnPosition.y, true, true);
  this.body.motionState = 2;
  this.sprite.alpha = 1;
  this.removeBulletCollisions();
  this.glowSprite.visible = true;
  if (!this.sensor) {
    this.drawSensor();
    this.initSensorPhysics();
  }
};


module.exports = Orb;
