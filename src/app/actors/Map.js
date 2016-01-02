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
  this.sprite = game.make.sprite(0,0, level.mapImgKey);
  if (level.hasOwnProperty('mapScale')) {
    this.sprite.scale.setTo(level.mapScale);
  }
  this.sprite.position.setTo(this.origin.x + game.world.width/2, this.origin.y + level.world.height - this.sprite.height);
  this.groups.terrain.add(this.sprite);
};

/**
 * @method setPhsycsData
 */
p.setPhysicsData = function() {
  var level = levelManager.currentLevel;
  game.physics.p2.enable(this.sprite, properties.debugPhysics);
  this.body = this.sprite.body;
  this.body.static = true;
  this.body.clearShapes();
  this.body.loadPolygon(this.levelCacheKey(), level.mapDataKey);
  this.body.setCollisionGroup(this.collisions.terrain);
};

/**
 * Starts a new level at the current level index
 *
 * @method reset
 */
p.reset = function() {
  this.sprite.destroy();
  this.setOrigin();
  this.makeMap();
  this.setPhysicsData();
};

/**
 * @method levelCacheKey
 * @returns {String}
 */
p.levelCacheKey = function() {
  var level = levelManager.currentLevel;
  return level.mapDataKey + properties.mapSuffix;
};

module.exports = Map;
