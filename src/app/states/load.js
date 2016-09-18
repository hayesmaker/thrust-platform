'use strict';

var _ = require('lodash');
var properties = require('../properties');
var levelsLoader = require('../utils/levels-loader');
var gameState = require('../data/game-state');
var optionsModel = require('../data/options-model');
/**
 * The load state 
 * - Loads in game assets
 * - Decodes Audio
 * - Starts the game when complete
 *
 * @class load
 * @namespace states
 * @module states
 * @type {Object}
 */
module.exports = {
  /**
   * Init state with boot screen for removal
   *
   * @method init
   * @param bootScreen {Phaser.Sprite}
   * @param versionTxt {Phaser.Text}
   */
  init: function(bootScreen, versionTxt) {
    console.log('load state :: init', bootScreen, versionTxt);
    levelsLoader.init();
    this.version = versionTxt;
    this.bootScreen = bootScreen;

  },

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
    levelsLoader.loadLevelsJson(optionsModel.getLevelsJsonUrl());
    game.load.atlas('dpad', 'assets/images/virtualjoystick/skins/dpad.png', 'assets/images/virtualjoystick/skins/dpad.json');
    if (properties.dev.mode) {
      game.load.image('crossHair', 'assets/images/cross-hair.png');
    }
    game.load.image('level-4-layout', 'assets/images/level-4-layout.png');
    game.load.image('coverImage', 'assets/images/thrust-cover-styled-538x422.png');
    game.load.image('pause', 'assets/images/pause-button.png');
    this.preloadTrainingMap(properties.levels.training);
    game.load.physics('playerPhysics', 'assets/physics/player.json');
    game.load.physics('powerStationPhysics', 'assets/physics/power-station.json');
    game.load.physics('orbHolderPhysics', 'assets/physics/orb-holder.json');
    this.loadSfx();
    this.loadMusic();
  },

  /**
   * @method loadSfx
   */
  loadSfx: function () {
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
   * @method loadMusic
   */
  loadMusic: function() {
    game.load.audiosprite(
      'music', [
        'assets/audiosprite/thrust-music.mp3',
        'assets/audiosprite/thrust-music.m4a',
        'assets/audiosprite/thrust-music.ogg'
      ],
      'assets/audiosprite/thrust-music.json'
    );
  },

  preloadTrainingMap: function(levelData) {
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
    console.log('load :: fileComplete', cacheKey);
    var percent = game.load.progress;
    this.loadProgressTxt.text = percent + '%';
    //var percent = game.load.progress;
    //this.loadProgressTxt.text = percent + '%';
  },

  /**
   * When everything has loaded start the game.
   * Don't clear the cache.
   *
   * @method loadComplete
   */
  loadComplete: function () {
    console.log('load :: loadComplete');
    this.decodeAudio();
  },

  /**
   * @method decodeAudio
   */
  decodeAudio: function () {
    var sfx = game.add.audioSprite('sfx');
    sfx.allowMultiple = true;
    var music = game.add.audioSprite('music');
    music.allowMultiple = true;
    game.sfx = sfx;
    game.music = music;
    game.sound.setDecodedCallback(['sfx', 'music'], this.transitionOut, this);

  },

  /**
   * @method transitionOut
   */
  transitionOut:function() {
    if (this.bootScreen) {
      TweenMax.to(this.bootScreen, 3, {alpha: 0, ease: Quad.easeOut, onComplete: this.start, callbackScope: this});
    } else {
      this.start();
    }
  },

  /**
   * @method start
   */
  start: function () {
    console.log('load :: start ', gameState);
    this.loadProgressTxt.destroy();
    gameState.init();
    if (this.version) {
      this.version.destroy();
    }
    if (this.bootScreen) {
      this.bootScreen.destroy();
    }
    game.state.start('play', true, false);
  }
};