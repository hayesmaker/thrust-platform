var Bullet = require('../actors/Bullet');

/**
 * @class BulletGroup
 * @constructor
 */
function BulletGroup(maxEntities, collionGroup) {
  Phaser.Group.call(this, game, game.world, 'bullets', false, true, Phaser.Physics.P2JS);
  var i;
  this.collisionGroup = collionGroup;
  for (i = 0; i < maxEntities; i++) {
    this.add(new Bullet());
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
p.lifespan = 2000;

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



module.exports = BulletGroup;