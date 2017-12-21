var _ = require('lodash');
var properties = require('../../properties');
var sound = require('../../utils/sound');

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
  this.hasBitmapGate = false;
  this.x = levelData.mapPosition.x;
  this.y = levelData.mapPosition.y;
  this.key = key;
  this.data = game.cache.getFrameData(this.key);
  this.group = game.add.group(parentGroup);
  this.parent = parentGroup;
  this.levelData = levelData;
  this.counter = 0;
  this.defaultTileSize = 96;
}

var p = MapAtlas.prototype;

/**
 * @property hasBitmapGate
 * @type {boolean}
 */
p.hasBitmapGate = false;
/**
 * @property counter
 * @type {number}
 */
p.counter = 0;

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
  //check gate data
  if (this.levelData.hasOwnProperty('gateImgKey')) {
    this.renderGate();
  } else if (this.levelData.hasOwnProperty('gateBitmap')) {
    this.renderBitmapGate();
  }

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
  var standardTileSize = this.levelData.tileSize || this.defaultTileSize;
  var tileWidth = standardTileSize * this.levelData.mapScale;
  var tileHeight = standardTileSize * this.levelData.mapScale;
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
 * @method renderGate
 */
p.renderGate = function () {
  console.log('renderGate');
  this.gateSprite = game.make.sprite(0,0, this.levelData.gateImgKey);
  this.gateSprite.scale.setTo(this.levelData.mapScale);
  this.gateSprite.position.setTo(this.levelData.gatePosition.x,this.levelData.gatePosition.y);
  //this.gateSprite.scale.setTo(this.levelData.gatePosition.scale);
  this.parent.add(this.gateSprite);
  //this.gateSprite.visible = false;
  if (this.levelData.linkSwitchToGate) {
    this.linkSwitchToGate();
  }
};

p.linkSwitchToGate = function() {
  var xTo = this.levelData.switches[0].x;
  var yTo = this.levelData.switches[0].y;
  var w = Math.abs(xTo - this.gateSprite.x);
  var h = Math.abs(yTo - this.gateSprite.y);
  console.warn('link switch to gate', w + 2000, h + 2000);
  var selector = game.make.bitmapData(2000 , 2000);
  selector.ctx.beginPath();
  selector.ctx.strokeStyle =  '#ffffff';
  selector.ctx.lineWidth = 2;
  selector.ctx.setLineDash([3,2]);
  selector.ctx.moveTo(1, 1);
  var part1 = {x: w * 0.5, y: 0};
  var part2 = {x: w * 0.5, y: h};
  var part3 = {x: w - this.gateSprite.width/2, y: h};
  selector.ctx.lineTo(part1.x,part1.y);
  selector.ctx.lineTo(part2.x,part2.y);
  selector.ctx.lineTo(part3.x,part3.y);
  selector.ctx.stroke();
  this.linkSprite = game.make.sprite(0,0, selector);
  this.linkSprite.position.setTo(this.levelData.gatePosition.x + this.gateSprite.width / 2, this.gateSprite.y);
  this.parent.add(this.linkSprite);
};

/**
 * @method renderBitmapGate
 */
p.renderBitmapGate = function() {
  this.hasBitmapGate = true;
  var w = this.levelData.gateBitmap.size.w;
  var h = this.levelData.gateBitmap.size.h;
  var x = this.levelData.gateBitmap.position.x;
  var y = this.levelData.gateBitmap.position.y;
  var selector = game.make.bitmapData(w , h);
  selector.ctx.beginPath();
  selector.ctx.strokeStyle =  '#c8048a';
  selector.ctx.lineWidth = 2;
  selector.ctx.setLineDash([3,2]);
  selector.ctx.moveTo(0, 0);
  selector.ctx.lineTo(0, h);
  selector.ctx.stroke();
  this.gateSprite = game.make.sprite(x + w/2, y + h/2, selector);
  this.parent.add(this.gateSprite);
};

/**
 * addRectangle(width, height, offsetX, offsetY, rotation) → {p2.Box}
 *
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

  if (this.levelData.hasOwnProperty('gateImgKey')) {
    game.physics.p2.enable(this.gateSprite, properties.dev.debugPhysics);
    this.gateSprite.body.static = true;
    this.gateSprite.body.clearShapes();
    this.gateSprite.body.loadPolygon(this.gateCacheKey(), this.levelData.gateDataKey);
    this.gateSprite.body.setCollisionGroup(collisions.terrain);
    collisions.set(this.gateSprite, [collisions.players, collisions.orb, collisions.bullets, collisions.enemyBullets]);
  } else if (this.levelData.hasOwnProperty('gateBitmap')) {
    game.physics.p2.enable(this.gateSprite, properties.dev.debugPhysics);
    this.gateSprite.body.static = true;
    this.gateSprite.body.clearShapes();
    this.gateSprite.body.addRectangle(20, this.gateSprite.height, 0, 0, 0);
    //this.gateSprite.body.loadPolygon(this.gateCacheKey(), this.levelData.gateDataKey);
    this.gateSprite.body.setCollisionGroup(collisions.terrain);
    collisions.set(this.gateSprite, [collisions.players, collisions.orb, collisions.bullets, collisions.enemyBullets]);
  }
};

/**
 * Required to be called if map blinking mode is on
 *
 * @method update
 */
p.update = function() {
  if (this.counter++ % 120 === 0) {
    this.blink();
  }
};

/**
 * @method blink
 */
p.blink = function() {
  this.spriteBatch.visible = !this.spriteBatch.visible;
  if (this.gateSprite) {
    this.gateSprite.visible = this.spriteBatch.visible;
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
 * @return {string}
 */
p.gateCacheKey = function() {
  return this.levelData.gateDataKey + properties.mapSuffix;
};


/**
 * Improve this for bitmap gates
 *
 * @method openGate
 */
p.openGate = function () {
  if (this.gateSprite && !this.hasBitmapGate) {
    sound.playSound(sound.GATE_OPEN, 1, false);
    var xTo = this.levelData.gateTweenTo.x;
    var yTo = this.levelData.gateTweenTo.y;
    TweenMax.to(this.gateSprite.body, this.tweenDuration, {x: xTo, y: yTo,  ease: Quad.easeOut});
  }
  if (this.linkSprite) {
    this.linkSprite.visible = false;
  }
};

p.allEnemiesDetroyed = function() {
  if (this.hasBitmapGate) {
    sound.playSound(sound.GATE_OPEN, 1, false);
    this.gateSprite.body.destroy();
    this.gateSprite.destroy();
  }
};

/**
 * @method closeGate
 */
p.closeGate = function() {
  if (this.gateSprite) {
    sound.playSound(sound.GATE_CLOSE, 1, false);
    var xTo = this.levelData.gatePosition.x;
    var yTo = this.levelData.gatePosition.y;
    TweenMax.to(this.gateSprite.body, this.tweenDuration, {x: xTo, y: yTo,  ease: Quad.easeOut});
  }
};



module.exports = MapAtlas;