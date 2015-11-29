var _ = require('lodash');
var properties = require('../properties');//stubbed
var levelManager = require('../data/level-manager');//stubbed

/**
 * The load state - Loads in game assets
 * and starts the game when complete
 *
 * @class load
 * @namespace states
 * @module states
 * @type {Object}
 */
module.exports = {

  loadProgressTxt: null,
  /**
   * Preload all in game assets
   *
   * @method preload
   */
  preload: function () {
    var style = {font: "12px thrust_regular", fill: "#ffffff", align: 'left'};
    this.loadProgressTxt = game.add.text(0, 0, '0.00%', style);

    game.load.onLoadStart.add(this.loadStart, this);
    game.load.onFileComplete.add(this.fileComplete, this);
    game.load.onLoadComplete.add(this.loadComplete, this);

    if (game.controls.isJoypadEnabled) {
      game.load.atlas('dpad', 'assets/images/virtualjoystick/skins/dpad.png', 'assets/images/virtualjoystick/skins/dpad.json');
    }
    if (properties.drawBackground) {
      game.load.image('stars', 'assets/images/starfield.png');
    }
    game.load.image('smoke_r', 'assets/images/smoke_colors.png');
    _.each(levelManager.levels, this.preloadMapData, this);
    game.load.image('player', 'assets/actors/player.png');
    game.load.physics('playerPhysics', 'assets/actors/player.json');
  },

  /**
   * Load all maps in defined in the levelManager
   *
   * @method loadMap Data
   * @param levelData {Object} defines a map key and url, and the physics data key and url
   */
  preloadMapData: function (levelData) {
    console.warn('load :: physics data [cacheKey %s]', levelData.mapDataKey);
    game.load.image(levelData.mapImgKey, levelData.mapImgUrl);
    game.load.physics(levelData.mapDataKey + properties.mapSuffix, levelData.mapDataUrl);
  },

  /**
   * Start the game when assets have preloaded
   *
   * @method create
   */
  create: function () {

  },

  loadStart: function () {
    this.loadProgressTxt.text = '0%';
  },

  fileComplete: function (progress, cacheKey, success, totalLoaded, totalFiles) {
    var percent = game.load.progress;
    this.loadProgressTxt.text = percent + '%';
    if (this.isLevelData(cacheKey)) {
      var levelPhysics = game.cache.getItem(cacheKey, Phaser.Cache.PHYSICS);
      var level = this.getLevelByCacheKey(cacheKey);
      if (level.hasOwnProperty('mapScale')) {
        this.scaleMapData(levelPhysics.data, level);
      }
    }
  },

  isLevelData: function (cacheKey) {
    return cacheKey.indexOf(properties.mapSuffix) >= 0 && game.cache.getItem(cacheKey, Phaser.Cache.PHYSICS)
  },

  getLevelByCacheKey: function (cacheKey) {
    return _.find(properties.levels, function (levelData) {
      return levelData.mapDataKey + properties.mapSuffix === cacheKey;
    }, this);
  },

  scaleMapData: function (levelPhysics, level) {
    console.log('load :: scaleMapData :: [levelPhysics : level]', levelPhysics, level);
    _.each(levelPhysics[level.mapDataKey], function (node) {
      _.each(node.shape, function (value, n) {
        node.shape[n] = value * level.mapScale;
      });
    });
  },

  loadComplete: function () {
    game.state.start('play', true, false);
  },

  /**
   * Preloader info assets can be updated here
   *
   * @method update
   */
  update: function () {

  }
};