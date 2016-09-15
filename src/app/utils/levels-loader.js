var levelManager = require('../data/level-manager');
var properties = require('../properties');
var _ = require('lodash');

module.exports = {

  init: function() {
    game.load.onFileComplete.add(this.fileComplete, this);
    game.load.onLoadComplete.add(this.loadComplete, this);
  },

  startLoad: function() {
    this.loadAtlas();
    this.loadLevelsPack();
  },

  loadLevelsPack: function() {
    _.each(levelManager.levels, this.loadLevel, this);
  },

  loadLevelsJson: function() {
    game.load.json('levels-data', 'assets/levels/classic.json');
  },

  loadAtlas: function() {
    game.load.atlas('combined', 'assets/atlas/combined.png', 'assets/atlas/combined.json');
  },

  /**
   * @method loadLevel
   * @param levelData {Object} defines a map key and url, and the physics data key and url
   */
  loadLevel: function(levelData) {
    if (!levelData.useAtlas) {
      game.load.image(levelData.mapImgKey, levelData.mapImgUrl);
    }
    game.load.physics(levelData.mapDataKey + properties.mapSuffix, levelData.mapDataUrl);
    if (levelData.gateImgKey) {
      game.load.image(levelData.gateImgKey, levelData.gateImgUrl);
      game.load.physics(levelData.gateDataKey + properties.mapSuffix, levelData.gateDataUrl);
    }
  },

  loadLevelPhysics: function() {

  },

  /**
   * Checks the physics data in the game cache, and ensures it's a level map. (It uses the mapSuffix in the
   * json object to tell).
   *
   * @method isLevelData
   * @param cacheKey
   * @return {boolean|*|Object|any}
   */
  isLevelData: function (cacheKey) {
    return cacheKey.indexOf(properties.mapSuffix) >= 0 && game.cache.getItem(cacheKey, Phaser.Cache.PHYSICS);
  },

  isLevelsJson: function(cacheKey) {
    return game.cache.getItem(cacheKey, Phaser.Cache.JSON);
  },

  /**
   * Takes a phaser cache key, and returns a level, based on that key and the level's mapDataKey value.
   * Required to know what scale should be applied to the level's physics data
   *
   * @method getLevelByCacheKey
   * @param cacheKey
   * @return {*}
   * @todo test this
   */
  getLevelByCacheKey: function (cacheKey) {
    var myLevel = _.find(levelManager.levels, function (levelData) {
      return levelData.mapDataKey + properties.mapSuffix === cacheKey;
    }, this);
    if (!myLevel) {
      myLevel = _.find(properties.levels.data, function(levelData) {
        return levelData.gateDataKey + properties.mapSuffix === cacheKey;
      });
    }
    return myLevel;
  },

  fileComplete: function(progress, cacheKey) {
    if (cacheKey === 'levels-data') {
      var levels = game.cache.getJSON('levels-data');
      console.log('fileComplete: levels=', levels);
      levelManager.init(levels);
      this.startLoad();
    }

    if (this.isLevelData(cacheKey)) {
      console.log('levels-loader :: this.isLevelData loadPhysics');
      var levelPhysics = game.cache.getItem(cacheKey, Phaser.Cache.PHYSICS);
      var level = this.getLevelByCacheKey(cacheKey);
      if (!level) {
        level = properties.levels.training;
      }
      if (level.hasOwnProperty('mapScale')) {
        if (cacheKey.indexOf('gate') >= 0) {
          this.scaleMapData(levelPhysics.data, level, level.gateDataKey);
        } else {
          this.scaleMapData(levelPhysics.data, level, level.mapDataKey);
        }
      }
    }
  },

  loadComplete: function() {
    this.levelsLoadComplete();
    //this.cleanUp();
  },

  /**
   * Take's a Phaser Physics data and scales it by level.mapScale
   *
   * @method scaleMapData
   * @param physicsData
   * @param level
   * @param key {String}
   */
  scaleMapData: function (physicsData, level, key) {
    console.log('scaleMapData::', level);
    _.each(physicsData[key], function (node) {
      _.each(node.shape, function (value, n) {
        node.shape[n] = value * level.mapScale;
      });
    });
  },

  levelsLoadComplete: function() {
    console.log('levelsJson loadComplete :: levelsData');
  },

  finalLoadComplete: function() {
    console.log('finalLoadComplete');
    this.cleanUp();
  },
  /**
   * removing the signals here but it may not be necessary
   *
   * @method cleanUp
   */
  cleanUp: function() {
    game.load.onFileComplete.remove(this.fileComplete, this);
    game.load.onLoadComplete.remove(this.finalLoadComplete, this);
  }


};