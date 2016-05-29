'use strict';

var _ = require('lodash');
var properties = require('../properties');
var levelManager = require('../data/level-manager');

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
   * it('fuel cell image should be loaded', function() {
      state.preload();
      expect(game.load.image).to.have.been.calledWith('fuelImage', 'assets/actors/fuel.png');
    });

   it('fuel physics data should be loaded', function() {
      state.preload();
      expect(game.load.physics).to.have.been.calledWith('fuelPhysics', 'assets/actors/fuel.json');
    });
   *
   * @method preload
   */
  preload: function () {
    var style = {font: "12px thrust_regular", fill: "#ffffff", align: 'left'};
    this.loadProgressTxt = game.add.text(0, 0, '0%', style);
    game.load.onFileComplete.add(this.fileComplete, this);
    game.load.onLoadComplete.add(this.loadComplete, this);
    if (game.controls.isJoypadEnabled) {
      game.load.atlas('dpad', 'assets/images/virtualjoystick/skins/dpad.png', 'assets/images/virtualjoystick/skins/dpad.json');
    }
    if (properties.drawBackground) {
      game.load.image('stars', 'assets/images/space.jpg');
    }
    if (properties.dev.mode) {
      game.load.image('crossHair', 'assets/images/cross-hair.png');
    }
    _.each(levelManager.levels, this.preloadMapData, this);
    game.load.image('player', 'assets/actors/player.png');
    game.load.physics('playerPhysics', 'assets/actors/player.json');
    game.load.image('fuelImage', 'assets/actors/fuel.png');
    game.load.image('powerStationImage', 'assets/actors/power-station.png');
    game.load.physics('powerStationPhysics', 'assets/actors/power-station.json');
    game.load.image('orbHolderImage', 'assets/actors/orb-holder.png');
    game.load.physics('orbHolderPhysics', 'assets/actors/orb-holder.json');
    this.loadAudio();
  },

  loadAudio: function () {

    game.load.audiosprite(
      'sfx', [
        'assets/audiosprite/thrust-sfx.mp3',
        'assets/audiosprite/thrust-sfx.m4a',
        'assets/audiosprite/thrust-sfx.ogg'
      ],
      'assets/audiosprite/thrust-sfx.json'
    );
  },

  /**
   * Load all maps in defined in the levelManager
   *
   * @method loadMap Data
   * @param levelData {Object} defines a map key and url, and the physics data key and url
   */
  preloadMapData: function (levelData) {
    game.load.image(levelData.mapImgKey, levelData.mapImgUrl);
    game.load.physics(levelData.mapDataKey + properties.mapSuffix, levelData.mapDataUrl);
  },

  /**
   * SignalHandler for loaded files.
   * - Updates the loader progress
   * - Checks if a loaded file was some level map Physics data.
   * If so, and if the level has a 'mapScale' property, then apply that scale to the Physics data.
   *
   * @property fileComplete
   * @param progress
   * @param cacheKey
   */
  fileComplete: function (progress, cacheKey) {
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
   * Takes a phaser cache key, and returns a level, based on that key and the level's mapDataKey value.
   * Required to know what scale should be applied to the level's physics data
   *
   * @method getLevelByCacheKey
   * @param cacheKey
   * @return {*}
   * @todo test this
   */
  getLevelByCacheKey: function (cacheKey) {
    return _.find(properties.levels.data, function (levelData) {
      return levelData.mapDataKey + properties.mapSuffix === cacheKey;
    }, this);
  },

  /**
   * Take's a Phaser Physics data and scales it by level.mapScale
   *
   * @method scaleMapData
   * @param physicsData
   * @param level
   */
  scaleMapData: function (physicsData, level) {
    _.each(physicsData[level.mapDataKey], function (node) {
      _.each(node.shape, function (value, n) {
        node.shape[n] = value * level.mapScale;
      });
    });
  },

  /**
   * When everything has loaded start the game.
   * Don't clear the cache.
   *
   * @method loadComplete
   */
  loadComplete: function () {
    this.decodeAudio();
  },

  decodeAudio: function () {
    console.log('decoding audio');

    var sfx = game.add.audioSprite('sfx');
    sfx.allowMultiple = true;

    /*
    var zap1 = game.add.audio('zap1');
    var hurt1 = game.add.audio('hurt1');
    var hurt2 = game.add.audio('hurt2');
    var boom1 = game.add.audio('boom1');
    var boom2 = game.add.audio('boom2');
    var exit1 = game.add.audio('exit1');
    var planetDeath1 = game.add.audio('planetDeath1');
    var connect1 = game.add.audio('connect1');
    var teleportIn1 = game.add.audio('teleportIn1');
    */

    /**
     *
     * @type {{zap1: *, hurt1: *, hurt2: *, boom1: *, boom2: *, exit1: *, planetDeath1: *, connect1: *, teleportIn1: *}}
     */
    game.sfx = game.audiosprite = sfx;
    //  Being mp3 files these take time to decode, so we can't play them instantly
    //  Using setDecodedCallback we can be notified when they're ALL ready for use.
    //  The audio files could decode in ANY order, we can never be sure which it'll be.

    game.sound.setDecodedCallback('sfx', this.start, this);
  },

  start: function () {
    this.loadProgressTxt.destroy();
    game.state.start('play', true, false);
  }
};