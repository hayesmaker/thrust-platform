var FiringStrategy = require('./FiringStrategy');
var _ = require('lodash');
var properties = require('../../properties');


/**
 * ForwardsFire description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class ForwardsFire
 * @constructor
 */
function ForwardsFire(origin, collisions, groups, bulletBmp, lifeSpan) {
  console.log('new ForwardFire :: origin, lifespan', origin, lifeSpan);
  FiringStrategy.call(this, origin, collisions, groups, bulletBmp, lifeSpan);
}

var p = ForwardsFire.prototype = Object.create(FiringStrategy.prototype);
p.constructor = ForwardsFire;

/**
 * ForwardsFire initialisation
 *
 * @method shoot
 */
p.fire = function () {
  console.log('fire : lifespan=', this.lifeSpan);
  var magnitude = 200;
  this.bullet = game.make.sprite(this.origin.position.x, this.origin.position.y, this.bulletBitmap);
  this.bullet.lifespan = 1000;
  this.bullet.anchor.setTo(0.5, 0.5);
  game.physics.p2.enable(this.bullet, properties.debugPhysics);
  var angle = this.origin.body.rotation + (3 * Math.PI) / 2;
  this.bullet.body.collidesWorldBounds = false;
  this.bullet.body.setCollisionGroup(this.collisions.bullets);
  this.groups.bullets.add(this.bullet);
  this.bullet.body.collides([this.collisions.terrain, this.collisions.enemies], function(bullet) {
    this.bulletEnd(bullet);
  }, this);
  this.bullet.events.onKilled.add(function(bullet) {
    this.bulletEnd(bullet);
  }, this);
  this.bullet.body.data.gravityScale = 0;
  this.bullet.body.velocity.x = magnitude * Math.cos(angle) + this.origin.body.velocity.x;
  this.bullet.body.velocity.y = magnitude * Math.sin(angle) + this.origin.body.velocity.y;
};

module.exports = ForwardsFire;