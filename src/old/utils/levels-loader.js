var levelManager = require('../data/level-manager');
var properties = require('../properties');
var _ = require('lodash');


module.exports = {
  /**
   * @property levelsData
   */
  levelsData: {},

  levelProgressTxt: null,

  /**
   * @method init
   */
  init: function() {
    game.load.onFileComplete.add(this.fileComplete, this);
    game.load.onLoadComplete.add(this.loadComplete, this);
  },

  /**
   * @method loadLevelsJson
   * @param levelsJsonUrl
   */
  loadLevelsJson: function(levelsJsonUrl) {
    game.load.json('levels-data', levelsJsonUrl);
  },

  /**
   * @method startLoad
   */
  startLoad: function() {
    game.load.atlas(this.levelsData.atlas.key, this.levelsData.atlas.imgUrl, this.levelsData.atlas.dataUrl);
  },

  /**
   * @method loadLevelsPack
   */
  loadLevelsPack: function() {
    _.each(levelManager.levels, _.bind(this.loadLevel, this));
  },

  /**
   * @method loadLevel
   * @param levelData {Object} defines a map key and url, and the physics data key and url
   */
  loadLevel: function(levelData) {
    this.loadLevelImg(levelData);
    this.loadLevelPhysics(levelData);
  },

  /**
   * @method loadLevelImage
   * @param levelData
   */
  loadLevelImg: function(levelData) {
    if (!levelData.useAtlas) {
      game.load.image(levelData.mapImgKey, levelData.mapImgUrl);
    }
  },

  /**
   * @method loadLevelPhysics
   */
  loadLevelPhysics: function(levelData) {
    game.load.physics(levelData.mapDataKey + properties.mapSuffix, levelData.mapDataUrl);
    if (levelData.gateImgKey) {
      game.load.image(levelData.gateImgKey, levelData.gateImgUrl);
      game.load.physics(levelData.gateDataKey + properties.mapSuffix, levelData.gateDataUrl);
    }
    game.load.physics('playerPhysics', 'assets/physics/player.json');
    game.load.physics('powerStationPhysics', 'assets/physics/power-station.json');
    game.load.physics('orbHolderPhysics', 'assets/physics/orb-holder.json');
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

  /**
   * @method isLevelsJson
   * @param cacheKey
   * @returns {boolean}
   */
  isLevelsJson: function(cacheKey) {
    return cacheKey === 'levels-data';
  },

  /**
   * @method isLevelsAtlas
   * @param cacheKey
   * @returns {boolean}
   */
  isLevelsAtlas: function(cacheKey) {
    return cacheKey === 'combined';
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
      //isPhysicsGate data?
      myLevel = _.find(levelManager.levels, function(levelData) {
        return levelData.gateDataKey + properties.mapSuffix === cacheKey;
      });
    }
    return myLevel;
  },

  /**
   * @method fileComplete
   * @param progress
   * @param cacheKey
   */
  fileComplete: function(progress, cacheKey) {
    if (this.levelProgressTxt) {
      var percent = game.load.progress;
      this.loadProgressTxt.text = percent + '%';
    }
    if (this.isLevelsJson(cacheKey)) {
      this.levelsData = game.cache.getJSON('levels-data');
      levelManager.init(this.levelsData);
      this.startLoad();
    }
    if (this.isLevelsAtlas(cacheKey)) {
      this.loadLevelsPack();
    }
    if (this.isLevelData(cacheKey)) {
      var levelPhysics = game.cache.getItem(cacheKey, Phaser.Cache.PHYSICS);
      var level = this.getLevelByCacheKey(cacheKey);
      if (!level) {
        level = properties.levels.training;
      }
      if (level.hasOwnProperty('mapScale')) {
        if (cacheKey.indexOf('gate') >= 0) {
          this.scalePhysicsData(levelPhysics.data[level.gateDataKey], level.mapScale);
        } else {
          this.scalePhysicsData(levelPhysics.data[level.mapDataKey], level.mapScale);
        }
      }
    }
  },

  /**
   * Take's a Phaser Physics data and scales it by scale val
   *
   * @method scalePhysicsData
   * @param data {array}
   * @param scale {number}
   */
  scalePhysicsData: function (data, scale) {
    _.each(data, function (node) {
      _.each(node.shape, function (value, n) {
        node.shape[n] = value * scale;
      });
    });
  },

  /**
   * @method levelsLoadComplete
   */
  levelsLoadComplete: function() {
    console.log('levelsJson loadComplete :: levelsData');
    this.cleanUp();
  },

  /**
   * @method loadComplete
   */
  loadComplete: function() {
    this.levelsLoadComplete();
  },


  /**
   * removing the signals here but it may not be necessary
   *
   * @method cleanUp
   */
  cleanUp: function() {
    game.load.onFileComplete.remove(this.fileComplete, this);
    game.load.onLoadComplete.remove(this.loadComplete, this);
  }


};