var _ = require('lodash');
var properties = require('../../properties');

/**
 * game.load.atlas(
 * 'level-atlas',
 * 'assets/levels/slices/atlas/level-1-atlas.png',
 * 'assets/levels/slices/atlas/level-1-atlas.json'
 * );
 *
 * @class MapAtlas
 * @constructor
 * @param parentGroup
 * @param levelData
 * @param key
 * @param isAtlas
 */
function MapAtlas(parentGroup, levelData, key, isAtlas) {
  this.isAtlas = isAtlas;
  this.x = levelData.mapPosition.x;
  this.y = levelData.mapPosition.y;
  this.key = key;
  this.data = game.cache.getFrameData(this.key);
  this.group = game.add.group(parentGroup);
  this.parent = parentGroup;
  this.levelData = levelData;
}

var p = MapAtlas.prototype;

/**
 * An empty sprite is created and used to attach the physics body
 *
 * @property physicsSprite
 * @type {Phaser.Sprite}
 * @default null
 */
p.physicsSprite = null;

/**
 *
 * @type {number}
 */
p.tweenDuration = 1.75;

/**
 * @method init
 */
p.init = function() {
  this.spriteBatch = game.add.spriteBatch(this.group, 'level-map');
  this.physicsSprite = new Phaser.Sprite(game, 0, 0, null, null);
  game.world.add(this.physicsSprite);

  //debug positions
  //this.layoutSprite = game.add.sprite(0, 0, 'level-4-layout', null, this.group);
  //this.layoutSprite.alpha = 0.3;


  this.group.x = this.x;
  this.group.y = this.y;
  if (this.isAtlas) {
    this.renderAtlas();
  } else {
    this.renderImage();
  }
  this.renderGate();
};

/**
 * Tile layout calculations courtesy of
 * The Essential Guide to Flash Games - Jeff Fulton
 * https://www.amazon.co.uk/Essential-Guide-Flash-Games-Entertainment/dp/1430226145
 *
 * @method renderAtlas
 */
p.renderAtlas = function() {
  var frames = this.data.getFrames();
  var tile, x, y;
  var tileWidth = 96 * this.levelData.mapScale;
  var tileHeight = 96 * this.levelData.mapScale;
  var numTilesWide = this.levelData.world.width / tileWidth;
  frames = _.filter(frames, function(frame) {
    return frame.name.indexOf(this.levelData.atlasData.levelKey) >= 0;
  }.bind(this));
  _.each(frames, function(frame, index) {
    x = Math.floor(index % numTilesWide) * tileWidth;
    y = Math.floor(index / numTilesWide) * tileHeight;
    tile = game.add.sprite(x, y, this.key, frame.index, this.spriteBatch);
    tile.scale.setTo(this.levelData.mapScale);
  }.bind(this));
};

p.renderImage = function() {
  this.sprite = game.add.sprite(0,0, this.levelData.mapImgKey, null, this.group);
  this.sprite.scale.setTo(this.levelData.mapScale);
};

/**
 *
 */
p.renderGate = function () {
  if (this.levelData.hasOwnProperty('gateImgKey')) {
    console.log('renderGate');
    this.gateSprite = game.make.sprite(0,0, this.levelData.gateImgKey);
    this.gateSprite.scale.setTo(this.levelData.mapScale);
    this.gateSprite.position.setTo(this.levelData.gatePosition.x,this.levelData.gatePosition.y);
    this.parent.add(this.gateSprite);
  }
};

/**
 * @method initPhysics
 * @param collisions {Collisions}
 */
p.initPhysics = function(collisions) {
  this.physicsSprite.width = this.group.width;
  this.physicsSprite.height = this.group.height;
  this.physicsSprite.x = this.x;
  this.physicsSprite.y = this.y;
  game.physics.p2.enable(this.physicsSprite, properties.dev.debugPhysics);
  this.body = this.physicsSprite.body;
  this.body.static = true;
  this.body.clearShapes();
  this.body.loadPolygon(this.levelCacheKey(), this.levelData.mapDataKey);
  this.body.setCollisionGroup(collisions.terrain);
  collisions.set(this.physicsSprite, [collisions.players, collisions.orb, collisions.bullets, collisions.enemyBullets]);
  this.body.x = this.group.x + this.group.width/2;
  this.body.y = this.group.y + this.group.height/2;
  if (this.gateSprite) {
    game.physics.p2.enable(this.gateSprite, properties.dev.debugPhysics);
    this.gateSprite.body.static = true;
    this.gateSprite.body.clearShapes();
    this.gateSprite.body.loadPolygon(this.gateCacheKey(), this.levelData.gateDataKey);
    this.gateSprite.body.setCollisionGroup(collisions.terrain);
    collisions.set(this.gateSprite, [collisions.players, collisions.orb, collisions.bullets, collisions.enemyBullets]);
  }
};

/**
 * @method levelCacheKey
 * @return {String}
 */
p.levelCacheKey = function() {
  return this.levelData.mapDataKey + properties.mapSuffix;
};

/**
 * @method gateCacheKey
 * @returns {string}
 */
p.gateCacheKey = function() {
  return this.levelData.gateDataKey + properties.mapSuffix;
};


/**
 * @method openGate
 */
p.openGate = function () {
  if (this.gateSprite) {
    var xTo = this.levelData.gateTweenTo.x;
    var yTo = this.levelData.gateTweenTo.y;
    TweenMax.to(this.gateSprite.body, this.tweenDuration, {x: xTo, y: yTo,  ease: Quad.easeOut});
  }
};

/**
 * @method closeGate
 */
p.closeGate = function() {
  if (this.gateSprite) {
    var xTo = this.levelData.gatePosition.x;
    var yTo = this.levelData.gatePosition.y;
    TweenMax.to(this.gateSprite.body, this.tweenDuration, {x: xTo, y: yTo,  ease: Quad.easeOut});
  }
};



module.exports = MapAtlas;