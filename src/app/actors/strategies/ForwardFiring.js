'use strict';

var FiringStrategy = require('./FiringStrategy');
var _ = require('lodash');

/**
 * ForwardsFire
 * The main firing strategy of Player
 *
 * @class ForwardsFire
 * @extends {FiringStrategy}
 * @constructor
 */
function ForwardsFire(origin, collisions, groups, bulletBmp, lifespan) {
  console.log('new ForwardFire :: origin, lifespan', origin, lifespan);
  FiringStrategy.call(this, origin, collisions, groups, bulletBmp, lifespan);
  this.setCollisionGroup(this.collisions.bullets);
  this.setCollidesWith([this.collisions.terrain, this.collisions.enemies, this.collisions.fuels]);
}

var p = ForwardsFire.prototype = Object.create(FiringStrategy.prototype);
p.constructor = ForwardsFire;

/**
 * ForwardsFire initialisation
 *
 * @method fire
 */
p.fire = function () {
  console.log('ForwardFire :: fire : lifespan=', this.lifespan);
  FiringStrategy.prototype.fire.call(this);
  var magnitude = 220;
  var angle = this.origin.body.rotation + (3 * Math.PI) / 2;
  this.bullet.body.velocity.x = magnitude * Math.cos(angle) + this.origin.body.velocity.x;
  this.bullet.body.velocity.y = magnitude * Math.sin(angle) + this.origin.body.velocity.y;
};

module.exports = ForwardsFire;