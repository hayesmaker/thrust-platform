'use strict';

var FiringStrategy = require('./FiringStrategy');
var _ = require('lodash');
var properties = require('../../properties');

/**
 * ForwardsFire
 * The main firing strategy of Player
 *
 * @class ForwardsFire
 * @extends {FiringStrategy}
 * @constructor
 */
function ForwardsFire(origin, collisions, groups, bulletBmp, lifespan) {
  FiringStrategy.call(this, origin, collisions, groups, bulletBmp, lifespan);
  this.setCollisionGroup(this.collisions.bullets);
  this.setCollidesWith([this.collisions.terrain, this.collisions.enemies, this.collisions.fuels]);
}

var p = ForwardsFire.prototype = Object.create(FiringStrategy.prototype);
p.constructor = ForwardsFire;

p.halfPi = Math.PI * 0.5;

/**
 * ForwardsFire initialisation
 *
 * @method fire
 */
p.fire = function () {
  FiringStrategy.prototype.fire.call(this);
  var magnitude = properties.gamePlay.firingMagnitude;
  var angle = this.origin.body.rotation - this.halfPi;
  this.bullet.body.velocity.x = magnitude * Math.cos(angle);
  this.bullet.body.velocity.y = magnitude * Math.sin(angle);
};

module.exports = ForwardsFire;