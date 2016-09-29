var Bullet = require('../actors/Bullet');

/**
 * @class BulletGroup
 * @constructor
 */
function BulletGroup(maxEntities, collisions) {
  Phaser.Group.call(this, game, game.world, 'bullets', false, true, Phaser.Physics.P2JS);
  var i;
  this.collisions = collisions;
  for (i = 0; i < maxEntities; i++) {
    this.add(new Bullet(collisions));
  }
  return this;
}

var p = BulletGroup.prototype = Object.create(Phaser.Group.prototype, {
  constructor: BulletGroup
});

/**
 * 350 is the previous firing magnitude default
 * trying 400 now to see if it plays better
 *
 * @property bulletSpeed
 * @type {number}
 * @default 350
 */
p.bulletSpeed = 350;

/**
 * @property lifespan
 * @type {number}
 */
p.lifespan = 2000;

/**
 * @property playerBulletSpeed
 * @type {number}
 */
p.playerBulletSpeed = 400;

/**
 * @property playerBulletLifespan
 * @type {number}
 */
p.playerBulletLifespan = 2500;

/**
 * @property halfPi
 * @type {number}
 */
p.halfPi = Math.PI * 0.5;

/**
 * @method fire
 * @param position
 * @param body
 */
p.fire = function(position, body) {
  var x = position.x;
  var y = position.y;
  var angle = body.rotation + Math.PI + Math.random() * Math.PI;
  this.getFirstExists(false).fire(x, y, angle, this.bulletSpeed, this.lifespan);
};

/**
 * @method playerFire
 * @param player {Player}
 */
p.playerFire = function(player) {
  var x = player.position.x;
  var y = player.position.y;
  var angle = player.body.rotation - this.halfPi;
  this.getFirstExists(false).fire(x, y, angle, this.playerBulletSpeed, this.playerBulletLifespan, true);
};



module.exports = BulletGroup;