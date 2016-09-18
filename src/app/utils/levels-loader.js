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
   * @param showProgress
   */
  loadLevelsJson: function(levelsJsonUrl, showProgress) {
    if (showProgress) {
      var style = {font: "12px thrust_regular", fill: "#ffffff", align: 'left'};
      this.loadProgressTxt = game.add.text(0, 0, '0%', style);
    }
    /*
    if (game.cache.checkKey(Phaser.Cache.IMAGE, 'combined')) {
      console.log('textureAtlas exists :: destroying texture');
      game.cache.removeImage('combined', true);
    }
    */
    game.load.json('levels-data', levelsJsonUrl);
  },

  /**
   * @method startLoad
   */
  startLoad: function() {
    this.loadAtlas(this.levelsData.atlas);
  },

  /**
   * @method loadAtlas
   * @param atlas {Object} contains key, imgUrl, dataUrl
   */
  loadAtlas: function(atlas) {
    console.log('loadAtlas :: this.levelsData.atlas', atlas);
    game.load.atlas(atlas.key, atlas.imgUrl, atlas.dataUrl);
  },

  /**
   * @method loadLevelsPack
   */
  loadLevelsPack: function() {
    console.log('levels-loader :: loadLevelsPack :', levelManager.levels);
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
    console.log('levels-loader :: loadLevelImg');
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
    console.log('levels-loader :: fileComplete cacheKey=', cacheKey);
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

  /**
   * @method loadComplete
   */
  loadComplete: function() {
    this.levelsLoadComplete();
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

  /**
   * @method levelsLoadComplete
   */
  levelsLoadComplete: function() {
    console.log('levelsJson loadComplete :: levelsData');
    this.cleanUp();

  },

  /**
   * @method finalLoadComplete
   */
  finalLoadComplete: function() {
    console.log('finalLoadComplete');

  },
  /**
   * removing the signals here but it may not be necessary
   *
   * @method cleanUp
   */
  cleanUp: function() {
    console.log('levels-loader :: cleanup');
    if (this.levelProgressTxt) {
      this.loadProgressTxt.destroy();
      this.loadProgressTxt = null;
    }
    game.load.onFileComplete.remove(this.fileComplete, this);
    game.load.onLoadComplete.remove(this.finalLoadComplete, this);
  }


};