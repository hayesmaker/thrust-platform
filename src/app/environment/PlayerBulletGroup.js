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
p.bulletSpeed = 400;

/**
 * @property lifespan
 * @type {number}
 */
p.lifespan = 2500;

/**
 * @property halfPi
 * @type {number}
 */
p.halfPi = Math.PI * 0.5;

/**
 * @method fire
 * @param player
 */
p.fire = function(player) {
  var x = player.position.x;
  var y = player.position.y;
  var angle = player.body.rotation - this.halfPi;
  this.getFirstExists(false).fire(x, y, angle, this.bulletSpeed, this.lifespan, true);
};


module.exports = BulletGroup;