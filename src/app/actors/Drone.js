'use strict';

var properties = require('../properties');
var sound = require('../utils/sound');

/**
 *
 * @param x
 * @param y
 * @param width
 * @param rotation
 * @param groups
 * @param collisions
 * @class Drone
 * @constructor
 */
function Drone (x, y, width, rotation, groups, collisions) {
  this.groups = groups;
  this.collisions = collisions;
  this.rotation = rotation;
  this.drawFlags(x, y, width, rotation);
  this.initPhysics(width, rotation);
}

var p = Drone.prototype;

p.onTrainingComplete = null;
p.rotation = 0;
p.groups = null;
p.collisions = null;
p.flag1 = null;
p.flag2 = null;
p.sensor = null;
p.hasPassed = false;
p.nextDrone = null;

/**
 * @method drawFlags
 * @param x
 * @param y
 * @param width
 * @param rotation {Number} Angle in radians
 */
p.drawFlags = function(x, y, width, rotation) {
  var pos = new Phaser.Point();
  pos.x = Math.cos(rotation) * width;
  pos.y = Math.sin(rotation) * width;
  this.flag1 = game.add.sprite(x - pos.x, y + pos.y, 'drone', null, this.groups.drones);
  this.flag2 = game.add.sprite(x + pos.x, y - pos.y, 'drone', null, this.groups.drones);
  var bmd = game.make.bitmapData(1, 1);
  bmd.rect(0,0,1,1, 'rgba(0, 255, 0, 0)');
  this.sensor = game.add.sprite(x + this.flag1.width/2, y, bmd);
  this.sensor.width = width * 2 - this.flag1.width;
  this.sensor.height = 10;
  this.deactivate();
};

/**
 * addRectangle(width, height, offsetX, offsetY, rotation);
 *
 * @method initPhysics
 */
p.initPhysics = function(width, rotation) {
  game.physics.p2.enable(this.sensor, properties.dev.debugPhysics);
  this.sensor.body.clearShapes();
  var box = this.sensor.body.addRectangle(this.sensor.width, 10, 0, 0, 0);
  box.sensor = true;
  this.sensor.body.rotation = -rotation;
  this.sensor.body.motionState = 2;
  this.sensor.body.setCollisionGroup(this.collisions.drones);
  this.sensor.body.collides([this.collisions.players]);
  this.sensor.body.onBeginContact.add(this.contactStart, this);
  this.sensor.body.onEndContact.add(this.contactLost, this);
};

p.lastDrone = function() {
  this.onTrainingComplete = new Phaser.Signal();
};

/**
 * @method contactLost
 */
p.contactLost = function() {
  //console.log('drone contact lost!');
};

p.deactivate = function(){
  this.active = false;
  this.flag1.alpha = 0.25;
  this.flag2.alpha = 0.25;
};

p.activate = function( ) {
  this.active = true;
  this.flag1.alpha = 1;
  this.flag2.alpha = 1;
};

/**
 * @method contactStart
 */
p.contactStart = function() {

  if (!this.hasPassed && this.active) {
    this.hasPassed = true;
    this.flag1.tint = 0x00ff00;
    this.flag2.tint = 0x00ff00;
    if (this.nextDrone) {
      this.nextDrone.activate();
      sound.playSound('collect1', 1, false);
    } else {
      this.onTrainingComplete.dispatch();
    }
  }


};

module.exports = Drone;
