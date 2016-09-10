var properties = require('../properties');

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
  game.physics.p2.enable(this.sprite, properties.dev.debugPhysics);
  this.body = this.sprite.body;
  this.body.setCircle(13, 0, 0);
  this.body.motionState = 2;
  this.body.setCollisionGroup(this.collisions.orb);
  this.body.collides([this.collisions.enemyBullets, this.collisions.players, this.collisions.terrain, this.collisions.bullets], this.crash, this);
};

p.orbHit = function() {

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
  this.body.motionState = 1;
  this.body.mass = 1;
  this.body.velocity = 0;
  this.body.angularVelocity = 0;
  this.body.angle = 0;
  this.killGlow();
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
 * @method crash
 */
p.crash = function () {
  if (this.player) {
    this.killGlow();
    this.player.crash();
  }
  this.body.motionState = 1;
};

p.killGlow = function() {
  this.glowSprite.visible = false;
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
  this.glowSprite.visible = true;
};


module.exports = Orb;
