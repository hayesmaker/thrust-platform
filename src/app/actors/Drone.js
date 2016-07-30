'use strict';

var properties = require('../properties');

/**
 * @class Drone
 * @constructor
 */
function Drone (x, y, groups, collisions) {
  this.groups = groups;
  this.collisions = collisions;
  this.drawFlags(x, y);
  this.initPhysics();
}

var p = Drone.prototype;

p.flag1 = null;
p.flag2 = null;

/**
 * @method drawFlags
 * @param x
 * @param y
 */
p.drawFlags = function(x, y) {
  this.flag1 = game.add.sprite(x - 100, y, 'drone', null, this.groups.drones);
  this.flag2 = game.add.sprite(x + 85, y - 15, 'drone', null, this.groups.drones);
};

/**
 * addRectangle(width, height, offsetX, offsetY, rotation);
 *
 * @method initPhysics
 */
p.initPhysics = function() {
  game.physics.p2.enable(this.flag1, properties.dev.debugPhysics);
  this.flag1.body.clearShapes();
  var box = this.flag1.body.addRectangle(200, 10, 100, 0, 0);
  box.sensor = true;
  this.flag1.body.motionState = 2;
  this.flag1.body.setCollisionGroup(this.collisions.drones);
  this.flag1.body.collides([this.collisions.players]);
  this.flag1.body.onBeginContact.add(this.contactStart, this);
  this.flag1.body.onEndContact.add(this.contactLost, this);
};

/**
 * @method contactLost
 */
p.contactLost = function() {
  console.log('drone contact lost!');
};

/**
 * @method contactStart
 */
p.contactStart = function() {
  console.log('drone overlap');
};

module.exports = Drone;
