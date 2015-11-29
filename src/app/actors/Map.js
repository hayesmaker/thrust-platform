var properties = require('../properties');
var game = window.game;
var levelManager = require('../data/level-manager');

/**
 * Map Object
 * Contains the map sprite and applies the physics generated from PhysicsEditor data to it.
 *
 * @class Map
 * @param x {Number}
 * @param y {Number}
 * @param collisions {Collisions}
 * @constructor
 */
function Map(x, y, collisions) {
	this.originX = x;
	this.originY = y;
	this.collisions = collisions;
  this.level = levelManager.currentLevel;
	this.sprite = game.make.sprite(0,0, levelManager.currentLevel.mapImgKey);
  if (this.level.hasOwnProperty('mapScale')) {
    this.sprite.scale.setTo(this.level.mapScale);
  }
  this.sprite.position.setTo(this.originX + game.world.width/2, this.originY + this.level.world.height - this.sprite.height);
	this.init();
}

var p = Map.prototype;

/**
 * Map initialisation
 *
 * @method init
 */
p.init = function() {
  var level = this.level;
	game.physics.p2.enable(this.sprite, properties.debugPhysics);
	this.body = this.sprite.body;
	this.body.static = true;
	this.body.clearShapes();
	this.body.loadPolygon(level.mapDataKey + properties.mapSuffix, level.mapDataKey);
	this.body.setCollisionGroup(this.collisions.terrain);
};

module.exports = Map;
