'use strict';

var properties = require('../properties');

/**
 *
 * @param x
 * @param y
 * @param width
 * @param groups
 * @param collisions
 * @class Drone
 * @constructor
 */
function HoverDrone (x, y, width, groups, collisions) {
  this.groups = groups;
  this.collisions = collisions;
  this.drawFlags(x, y, width);
  this.width = width;
  this.onTrainingComplete = new Phaser.Signal();
  //
}

var p = HoverDrone.prototype;

p.onTrainingComplete = null;
p.rotation = 0;
p.groups = null;
p.collisions = null;
p.flag1 = null;
p.flag2 = null;
p.flag3 = null;
p.flag4 = null;
p.sensor = null;
p.hasPassed = false;
p.nextDrone = null;
p.newContact = false;
p.timer = null;

/**
 * @method drawFlags
 * @param x
 * @param y
 * @param width
 */
p.drawFlags = function(x, y, width) {
  var pos1 = new Phaser.Point(x - width/2, y);
  var pos2 = new Phaser.Point(x, y - width/2);
  var pos3 = new Phaser.Point(x + width/2, y);
  var pos4 = new Phaser.Point(x, y + width/2);
  this.flag1 = game.add.sprite(pos1.x, pos1.y, 'drone', null, this.groups.drones);
  this.flag2 = game.add.sprite(pos2.x, pos2.y, 'drone', null, this.groups.drones);
  this.flag3 = game.add.sprite(pos3.x, pos3.y, 'drone', null, this.groups.drones);
  this.flag4 = game.add.sprite(pos4.x, pos4.y, 'drone', null, this.groups.drones);
  this.flag1.anchor.setTo(0.5);
  this.flag2.anchor.setTo(0.5);
  this.flag3.anchor.setTo(0.5);
  this.flag4.anchor.setTo(0.5);
  var bmd = game.make.bitmapData(1, 1);
  bmd.rect(0,0,1,1, 'rgba(255, 0, 0, 0.7)');
  this.sensor = game.add.sprite(x, y, bmd);
  this.sensor.anchor.setTo(0.5);
  this.sensor.width = this.sensor.height = width;
  this.deactivate();
  //this.flag1.tint = 0xffffff;
  //this.flag2.tint = 0x0000ff;
};

/**
 * addRectangle(width, height, offsetX, offsetY, rotation);
 *
 * @method initPhysics
 * @param width
 */
p.initPhysics = function() {
  game.physics.p2.enable(this.sensor, properties.dev.debugPhysics);
  this.sensor.body.clearShapes();
  var box = this.sensor.body.addRectangle(this.width, this.width, 0, 0, 0);
  box.sensor = true;
  this.sensor.body.motionState = 2;
  this.sensor.body.setCollisionGroup(this.collisions.drones);
  this.sensor.body.collides([this.collisions.players]);
  this.sensor.body.onBeginContact.add(this.contactStart, this);
  this.sensor.body.onEndContact.add(this.contactLost, this);
};

p.lastDrone = function() {
  this.onTrainingComplete = new Phaser.Signal();
};

p.deactivate = function(){
  this.active = false;
  this.newContact = false;
  this.flag1.alpha = 0.25;
  this.flag2.alpha = 0.25;
  this.flag3.alpha = 0.25;
  this.flag4.alpha = 0.25;
};

p.activate = function( ) {
  this.initPhysics();
  this.newContact = true;
  this.active = true;
  this.flag1.alpha = 1;
  this.flag2.alpha = 1;
  this.flag3.alpha = 1;
  this.flag4.alpha = 1;
};

p.isHovering = function() {
  this.newContact = false;
  this.flag1.tint = 0x0000ff;
  this.flag2.tint = 0x0000ff;
  this.flag3.tint = 0x0000ff;
  this.flag4.tint = 0x0000ff;
};

p.isNotHovering = function() {
  this.newContact = true;
  this.flag1.tint = 0xffffff;
  this.flag2.tint = 0xffffff;
  this.flag3.tint = 0xffffff;
  this.flag4.tint = 0xffffff;
};

/**
 * @method contactStart
 */
p.contactStart = function() {

  if (this.active && !this.hasPassed && this.newContact) {
    this.startTimer();
    this.isHovering();
  }
};

/**
 * @method contactLost
 */
p.contactLost = function() {
  if (this.hasPassed) {
    return;
  }
  this.isNotHovering();
  this.resetTimer();
};

/**
 * @method resetTimer;
 */
p.resetTimer = function() {
  game.time.events.remove(this.timer);
  this.timer = null;
};

/**
 * this.timer = game.time.events.add(Phaser.Timer.SECOND * config.features.preShow.linesDuration, callback, this);
 * game.time.events.remove(this.timer);
 *
 * @method startTimer
 */
p.startTimer = function() {
  this.timer = game.time.events.add(Phaser.Timer.SECOND * 3, this.passed, this);
};

/**
 * @method passed
 */
p.passed = function() {
  game.time.events.remove(this.timer);
  this.hasPassed = true;
  this.onTrainingComplete.dispatch();
  this.flag1.tint = 0x00ff00;
  this.flag2.tint = 0x00ff00;
  this.flag3.tint = 0x00ff00;
  this.flag4.tint = 0x00ff00;
};

module.exports = HoverDrone;
