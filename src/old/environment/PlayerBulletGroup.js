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
    this.add(new Bullet(collisions, true));
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
p.bulletSpeed = 800;

/**
 * @property lifespan
 * @type {number}
 */
p.lifespan = 1500;

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
  var angle = player.body.rotation - this.halfPi;
  var r = player.width * 0.5;
  var x = player.x + Math.cos(angle) * r;
  var y = player.y + Math.sin(angle) * r;
  this.getFirstExists(false).fire(x, y, angle, this.bulletSpeed, this.lifespan);
};


module.exports = BulletGroup;