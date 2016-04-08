var game = window.game;

/**
 * Collisions description
 *
 * @class Collisions
 * @constructor
 */
function Collisions() {
  this.startSystem();
  this.init();
}

var p = Collisions.prototype;

/**
 * Start the P2 Physics system, set some defaults.
 *
 * @method startSystem
 */
p.startSystem = function () {
  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.setImpactEvents(true);
  game.physics.p2.gravity.y = 100;
};

/**
 * Collisions initialisation
 * Sets the main collision groups and adds them to the physics system.
 *
 * @method init
 */
p.init = function () {
  this.players = game.physics.p2.createCollisionGroup();
  this.terrain = game.physics.p2.createCollisionGroup();
  this.orb = game.physics.p2.createCollisionGroup();
  this.bullets = game.physics.p2.createCollisionGroup();
  this.enemyBullets = game.physics.p2.createCollisionGroup();
  this.enemies = game.physics.p2.createCollisionGroup();
  this.fuels = game.physics.p2.createCollisionGroup();

  game.physics.p2.updateBoundsCollisionGroup();
};

/**
 * Add a sprite to the collidable groups array
 *
 * @method set
 */
p.set = function (sprite, collisionGroups) {
  sprite.body.collides(collisionGroups);
};

module.exports = Collisions;
