'use strict';

var properties = require('../properties');
var game = window.game;
var levelManager = require('../data/level-manager');

/**
 * Map Object
 * Contains the map sprite and applies the physics generated from PhysicsEditor data to it.
 *
 * @class Map
 * @param collisions {Collisions}
 * @param groups {Groups}
 * @constructor
 */
function Map(collisions, groups) {
	this.collisions = collisions;
  this.groups = groups;
	this.init();
}

var p = Map.prototype;

p.sprite = null;
p.gateSprite = null;
p.body = null;
p.isGateOpen = false;
p.isGateClosed = true;
p.tweenDuration = 2;

/**
 * Map initialisation
 *
 * @method init
 */
p.init = function() {
  this.setOrigin();
  this.makeMap();
  this.setPhysicsData();
};

/**
 * @method setOrigin
 */
p.setOrigin = function() {
  var level = levelManager.currentLevel;
  this.origin = new Phaser.Point(level.mapPosition.x, level.mapPosition.y);
};

/**
 * @method makeMap
 */
p.makeMap = function() {
  var level = levelManager.currentLevel;
  if (level.hasOwnProperty('gateImgKey')) {
    this.gateSprite = game.make.sprite(0,0, level.gateImgKey);
  }
  this.sprite = game.make.sprite(0,0, level.mapImgKey);
  if (level.hasOwnProperty('mapScale')) {
    this.sprite.scale.setTo(level.mapScale);
    if (level.hasOwnProperty('gateImgKey')) {
      this.gateSprite.scale.setTo(level.mapScale);
    }
  }
  if (level.hasOwnProperty('gateImgKey')) {
    this.gateSprite.position.setTo(level.gatePosition.x, level.gatePosition.y);
    this.groups.terrain.add(this.gateSprite);
  }
  this.sprite.position.setTo(this.origin.x + game.world.width/2, this.origin.y + level.world.height - this.sprite.height);
  this.groups.terrain.add(this.sprite);
};

/**
 * @method openGate
 */
p.openGate = function () {
  if (this.gateSprite) {
    var level = levelManager.currentLevel;
    var xTo = level.gateTweenTo.x;
    var yTo = level.gateTweenTo.y;
    TweenMax.to(this.gateSprite.body, this.tweenDuration, {x: xTo, y: yTo,  ease: Quad.easeOut, onComplete: this.gateOpenComplete, callbackScope: this});
  }
};

/**
 * @method gateOpenComplete
 */
p.gateOpenComplete = function() {
  this.isGateOpen = true;
  this.isGateClosed = false;
};

/**
 * @method closeGate
 */
p.closeGate = function() {
  if (this.gateSprite) {
    var level = levelManager.currentLevel;
    var xTo = level.gatePosition.x;
    var yTo = level.gatePosition.y;
    TweenMax.to(this.gateSprite.body, this.tweenDuration, {x: xTo, y: yTo,  ease: Quad.easeOut, onComplete: this.gateCloseComplete, callbackScope: this});
  }
};

/**
 * @method gateCloseComplete
 */
p.gateCloseComplete = function(){
  this.isGateClosed = true;
  this.isGateOpen = false;
};

/**
 * @method setPhsycsData
 */
p.setPhysicsData = function() {
  var level = levelManager.currentLevel;
  game.physics.p2.enable(this.sprite, properties.dev.debugPhysics);
  this.body = this.sprite.body;
  this.body.static = true;
  this.body.clearShapes();
  this.body.loadPolygon(this.levelCacheKey(), level.mapDataKey);
  this.body.setCollisionGroup(this.collisions.terrain);

  if (this.gateSprite) {
    game.physics.p2.enable(this.gateSprite, properties.dev.debugPhysics);
    this.gateSprite.body.static = true;
    this.gateSprite.body.clearShapes();
    this.gateSprite.body.loadPolygon(this.gateCacheKey(), level.gateDataKey);
    this.gateSprite.body.setCollisionGroup(this.collisions.terrain);
  }
};

/**
 * Starts a new level at the current level index
 *
 * @method reset
 */
p.reset = function() {
  this.sprite.destroy();
  if (this.gateSprite) {
    this.gateSprite.destroy();
  }
  this.setOrigin();
  this.makeMap();
  this.setPhysicsData();
};

/**
 * @method levelCacheKey
 * @return {String}
 */
p.levelCacheKey = function() {
  var level = levelManager.currentLevel;
  return level.mapDataKey + properties.mapSuffix;
};

p.gateCacheKey = function() {
  var level = levelManager.currentLevel;
  return level.gateDataKey + properties.mapSuffix;
};

module.exports = Map;
