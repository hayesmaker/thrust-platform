var properties = require('../../properties');

/**
 * FiringStrategy description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class FiringStrategy
 * @param origin
 * @param collisions
 * @param groups
 * @param bulletBmp
 * @param lifespan {Number} bullet lifespan in millis
 * @constructor
 */
function FiringStrategy(origin, collisions, groups, bulletBmp, lifespan) {
  this.origin = origin;
  this.collisions = collisions;
  this.groups = groups;
  this.bulletBitmap = bulletBmp;
  this.lifespan = lifespan;
}

var p = FiringStrategy.prototype;

/**
 * FiringStrategy initialisation
 *
 * @method fire
 */
p.fire = function () {
  this.bullet = game.make.sprite(this.origin.position.x, this.origin.position.y, this.bulletBitmap);
  this.bullet.lifespan = this.lifespan;
  this.bullet.anchor.setTo(0.5, 0.5);
  game.physics.p2.enable(this.bullet, properties.debugPhysics);
  this.bullet.body.collidesWorldBounds = false;
  this.bullet.body.setCollisionGroup(this.collisionGroup);
  this.groups.bullets.add(this.bullet);
  this.bullet.body.collides(this.collisionGroups, function(bullet) {
    this.bulletEnd(bullet, true);
  }, this);
  this.bullet.events.onKilled.add(function(bullet) {
    this.bulletEnd(bullet);
  }, this);
  this.bullet.body.data.gravityScale = 0;
};

/**
 * @method update
 */
p.update = function () {

};

/**
 * @method setCollisionGroup
 * @param collisionGroup
 */
p.setCollisionGroup = function(collisionGroup) {
  this.collisionGroup = collisionGroup;
};

/**
 * @method setCollidesWith
 * @param collisionGroups
 */
p.setCollidesWith = function(collisionGroups) {
  this.collisionGroups = collisionGroups;
};

/**
 * @method bulletEnd
 * @param bullet
 * @param removeSprite
 */
p.bulletEnd = function (bullet, removeSprite) {
  if (bullet) {
    if (removeSprite) {
      bullet.sprite.kill();
    }
    bullet.destroy();
  }
};


module.exports = FiringStrategy;