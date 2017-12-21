var levelManager = require('../data/level-manager');
var properties = require('../properties');
var _ = require('lodash');
var mobileOverrides = require('../data/mobile-overrides');
var tabletOverrides = require('../data/tablet-overrides');


module.exports = {
  /**
   * @property levelsData
   */
  levelsData: {},

  levelProgressTxt: null,

  /**
   * @method init
   */
  init: function () {
    game.load.onFileComplete.add(this.fileComplete, this);
    game.load.onLoadComplete.add(this.loadComplete, this);
  },

  /**
   * @method loadLevelsJson
   * @param levelsJsonUrl
   */
  loadLevelsJson: function (levelsJsonUrl) {
    game.load.json('levels-data', levelsJsonUrl);
  },

  /**
   * @method loadLevelsPack
   */
  loadLevelsPack: function () {
    _.each(levelManager.levels, _.bind(this.loadLevel, this));
    game.load.image(levelManager.training.mapImgKey, levelManager.training.mapImgUrl);
    game.load.physics(levelManager.training.mapDataKey + properties.mapSuffix, levelManager.training.mapDataUrl);
  },

  /**
   * @method loadLevel
   * @param levelData {Object} defines a map key and url, and the physics data key and url
   */
  loadLevel: function (levelData) {
    this.loadLevelImg(levelData);
    this.loadLevelPhysics(levelData);
  },

  /**
   * @method loadLevelImage
   * @param levelData
   */
  loadLevelImg: function (levelData) {
    if (!levelData.useAtlas) {
      game.load.image(levelData.mapImgKey, levelData.mapImgUrl);
    }
  },

  /**
   * @method loadLevelPhysics
   */
  loadLevelPhysics: function (levelData) {
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
   * @method isLevelPhysicsData
   * @param cacheKey
   * @return {boolean}
   */
  isLevelPhysicsData: function (cacheKey) {
    return cacheKey.indexOf(properties.mapSuffix) >= 0 && game.cache.getItem(cacheKey, Phaser.Cache.PHYSICS);
  },

  /**
   * Checks the physics data in the game cache and ensures it's the player physics data json
   *
   * @method isPlayerPhysicsData
   * @param cacheKey
   * @returns {boolean}
   */
  isPlayerPhysicsData: function(cacheKey) {
    return cacheKey.indexOf('playerPhysics') >= 0 && game.cache.getItem(cacheKey, Phaser.Cache.PHYSICS);
  },

  /**
   * @method isPowerPhysicsData
   * @param cacheKey
   * @returns {*}
   */
  isPowerPhysicsData: function(cacheKey) {
    return cacheKey.indexOf('powerStationPhysics') >= 0 && game.cache.getItem(cacheKey, Phaser.Cache.PHYSICS);
  },

  /**
   * @method isOrbHolderPhysicsData
   * @param cacheKey
   * @returns {*}
   */
  isOrbHolderPhysicsData: function(cacheKey) {
    return cacheKey.indexOf('orbHolderPhysics') && game.cache.getItem(cacheKey, Phaser.Cache.PHYSICS);
  },

  /**
   * @method isLevelsJson
   * @param cacheKey
   * @returns {boolean}
   */
  isLevelsJson: function (cacheKey) {
    return cacheKey === 'levels-data';
  },

  /**
   * @method isLevelsAtlas
   * @param cacheKey
   * @returns {boolean}
   */
  isLevelsAtlas: function (cacheKey) {
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
      myLevel = _.find(levelManager.levels, function (levelData) {
        return levelData.gateDataKey + properties.mapSuffix === cacheKey;
      });
    }
    return myLevel;
  },

  isTablet: function() {
    return game.device.iPad || window.outerWidth > 1000;
  },

  isMobile: function() {
    return game.device.iOS || game.device.android || game.device.windowsPhone;
  },

  /**
   * Cascading device type checking activates mobile or tablet overrides on game settings json file
   *
   * @method setLevelsData
   */
  setLevelsData: function() {
    var levelsData =  game.cache.getJSON('levels-data');
    if (game.device.desktop) {
      //no op
    } else if (this.isTablet()) {
      _.merge(levelsData, tabletOverrides);
    } else if (this.isMobile()) {
      _.merge(levelsData, mobileOverrides);
    } else {
      //no op
    }
    levelManager.init(levelsData);
    return levelsData;
  },

  /**
   * @method fileComplete
   * @param progress
   * @param cacheKey
   */
  fileComplete: function (progress, cacheKey) {
    var percent;
    var levelPhysics;
    var level;
    var playerPhysics;
    var orbHolderPhysics;
    var powerStationPhysics;
    if (this.levelProgressTxt) {
      percent = game.load.progress;
      this.loadProgressTxt.text = percent + '%';
    }
    if (this.isLevelsJson(cacheKey)) {
      this.levelsData = this.setLevelsData();
      game.load.atlas(this.levelsData.atlas.key, this.levelsData.atlas.imgUrl, this.levelsData.atlas.dataUrl);
    }
    if (this.isLevelsAtlas(cacheKey)) {
      this.loadLevelsPack();
    }
    if (this.isPlayerPhysicsData(cacheKey)) {
      playerPhysics = game.cache.getItem(cacheKey, Phaser.Cache.PHYSICS);
      this.scalePhysicsData(playerPhysics.data['player'], this.levelsData.actorsScale);
    }
    if (this.isOrbHolderPhysicsData(cacheKey)) {
      orbHolderPhysics = game.cache.getItem(cacheKey, Phaser.Cache.PHYSICS);
      this.scalePhysicsData(orbHolderPhysics.data['orb-holder'],  this.levelsData.actorsScale);
    }
    if (this.isPowerPhysicsData(cacheKey)) {
      powerStationPhysics = game.cache.getItem(cacheKey, Phaser.Cache.PHYSICS);
      this.scalePhysicsData(powerStationPhysics.data['power-station'],  this.levelsData.actorsScale);
    }
    if (this.isLevelPhysicsData(cacheKey)) {
      level = this.getLevelByCacheKey(cacheKey);
      levelPhysics = game.cache.getItem(cacheKey, Phaser.Cache.PHYSICS);
      if (!level) {
        level = this.levelsData.training;
      }
      if (level.hasOwnProperty('mapScale')) {
        if (cacheKey.indexOf('gate') >= 0) {
          this.scalePhysicsData(levelPhysics.data[level.gateDataKey], level.mapScale);
        } else {
          console.log('levels-loader :: fileComplete : scaleMap=', level.mapScale);
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
  levelsLoadComplete: function () {
    console.log('levelsJson loadComplete :: levelsData');
    this.cleanUp();
  },

  /**
   * @method loadComplete
   */
  loadComplete: function () {
    this.levelsLoadComplete();
  },


  /**
   * removing the signals here but it may not be necessary
   *
   * @method cleanUp
   */
  cleanUp: function () {
    game.load.onFileComplete.remove(this.fileComplete, this);
    game.load.onLoadComplete.remove(this.loadComplete, this);
  }


};