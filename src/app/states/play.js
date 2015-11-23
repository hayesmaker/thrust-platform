'use strict';

var properties = require('../properties');
var Collisions = require('../environment/Collisions');
var Groups = require('../environment/Groups');
var ui = require('../ui/index');
var Player = require('../actors/Player');
var LimpetGun = require('../actors/LimpetGun');
var Orb = require('../actors/Orb');
var Map = require('../actors/Map');
var Background = require('../actors/Background');
var TractorBeam = require('../actors/TractorBeam');
var features = require('../utils/features');
var Camera = require('camera');
var _ = require('lodash');
var particles = require('../environment/particles');
var levelManager = require('../data/level-manager');

/**
 * The play state
 *
 * @module states
 * @namespace states
 * @submodule play
 * @class play
 * @type {Phaser.State}
 * @static
 */
module.exports = {
  /**
   * @property level
   */
  level: null,
  /**
   * @property collisions
   */
  collisions: null,
  /**
   * @property groups
   */
  groups: null,
  /**
   * @player
   */
  player: null,
  orb: null,
  tractorBeam: null,
  background: null,
  limpetGuns: [],
  buttonADown: false,
  buttonBDown: false,
  isXDown: false,
  inPlay: false,
  emitter: null,

  /**
   * Preload in game assets
   *
   * @method preload
   */
  preload: function () {

    console.log('properties:', properties);
    if (game.controls.isJoypadEnabled) {
      game.load.atlas('dpad', 'assets/images/virtualjoystick/skins/dpad.png', 'assets/images/virtualjoystick/skins/dpad.json');
    }
    game.load.image('stars', 'assets/images/starfield.png');
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
  preloadMapData: function(levelData) {
    game.load.image(levelData.mapImgKey, levelData.mapImgUrl);
    game.load.physics(levelData.mapDataKey, levelData.mapDataUrl);
  },

  /**
   * Setup the game
   *
   * @method create
   */
  create: function () {
    this.level = levelManager.currentLevel;

    this.defineWorldBounds();
    this.createActors();
    this.createUi();
    this.createGroupLayering();

    ui.missionSwipe.missionStartSwipeIn(this.missionStart, this);

    var yKey = game.input.keyboard.addKey(Phaser.Keyboard.Y);
    yKey.onUp.add(function() {
      particles.startSwirl();
    }, this);
  },

  /**
   * Start gameplay
   * * initialise mission start swipe
   *
   * @method missionStart
   */
  missionStart: function() {
    this.inPlay = true;

    this.player.start();
    _.each(this.limpetGuns, function(limpet) {
      limpet.start();
    });
    this.initControls();
    this.initEnemies();

  },

  /**
   * Gameloop
   *
   * @method update
   */
  update: function () {
    if (game.stats) {
      game.stats.end();
    }
    this.checkPlayerInput();
    this.actorsUpdate();
    this.uiUpdate();
    this.checkGameCondition();
    if (game.stats) {
      game.stats.end();
    }
  },

  /**
   * Needed for debug display
   *
   * @method render
   */
  render: function () {
    if (properties.drawStats) {
      game.debug.cameraInfo(game.camera, 500, 20);
    }
  },

  /**
   * Return early if not in play
   * Cursors &/or gamepad
   *
   * @method checkPlayerInput
   */
  checkPlayerInput: function () {
    if (!this.inPlay || !this.cursors) {
      return;
    }

    if (!this.tractorBeam.hasGrabbed) {
      if (this.isXDown || properties.gamePlay.autoOrbLocking) {
        this.player.checkOrbDistance();
      }
    } else {
      this.tractorBeam.drawBeam(this.player.position);
    }

    if (!this.player.isDead) {
      if ((this.stick && this.stick.isDown && this.stick.direction === Phaser.LEFT) || this.cursors.left.isDown) {
        this.player.rotate(-100)
      } else if ((this.stick && this.stick.isDown && this.stick.direction === Phaser.RIGHT) || this.cursors.right.isDown) {
        this.player.rotate(100);
      } else if (!game.e2e.controlOverride) {
        this.player.body.setZeroRotation();
      }
      if (this.cursors.up.isDown || this.buttonADown) {
        if (this.player.fuel >= 0) {
          this.player.body.thrust(400);
          this.player.fuel--;
        }
      }
    }
  },

  /**
   * Has the player won, lost etc
   *
   * @method checkGameCondition
   */
  checkGameCondition: function() {

    this.checkPlayerLocation();


  },

  checkPlayerLocation: function() {

    if (!this.player.isDead) {
      if (this.player.body.y < 250 && this.player.inGameArea) {

        this.player.inGameArea = false;
        //player.warp();
        console.log('checkPlayerLocation :: isUnder ', this.player.body.y);
      }
    }



  },

  /**
   * Game Over Signal handler
   *
   * @method gameOver
   * @param score
   */
  gameOver: function(score) {

    console.warn('GAME OVER score:', score);

  },

  /**
   * Filter gameloop to actors
   *
   * @method actorsUpdate
   */
  actorsUpdate: function () {
    this.player.update();
    this.groups.enemies.forEach(function (enemy) {
      enemy.update();
    });
    if (this.background && properties.gamePlay.parallax) {
      this.background.update();
    }
  },

  /**
   *
   *
   * @method uiUpdate
   */
  uiUpdate: function() {
    if (this.inPlay) {
      ui.fuel.update(this.player.fuel, true);
      ui.score.update(this.player.score, true);
    }
  },

  /**
   * Set game world parameters depending on level size
   *
   * @method defineWorldBounds
   */
  defineWorldBounds: function () {
    game.world.setBounds(0, 0, this.level.world.width, this.level.world.height);
    this.cameraGroup = new Camera(game);
    //this.cameraGroup.zoomTo(2);
  },

  /**
   * create game actors, group and collision initialisation
   * game.e2e exposes actors to window, allowing actor control in e2e tests.
   *
   * @method createActors
   */
  createActors: function () {

    this.groups = new Groups(this.cameraGroup);
    this.collisions = new Collisions();
    if (properties.drawBackground) {
      this.background = new Background();
    }
    this.player = new Player(game.width / 2, game.height / 2, this.collisions, this.groups);
    this.player.livesLost.add(this.gameOver, this);
    this.orb = new Orb(this.level.orbPosition.x, this.level.orbPosition.y, this.collisions);
    this.tractorBeam = new TractorBeam(this.orb, this.player);
    this.player.setTractorBeam(this.tractorBeam);
    _.each(this.level.enemies, this.createLimpet, this);
    this.map = new Map(this.level.mapPosition.x, this.level.mapPosition.y, this.collisions);
    game.camera.follow(this.player);
    this.collisions.set(this.orb.sprite, [this.collisions.players, this.collisions.terrain, this.collisions.enemyBullets]);
    this.collisions.set(this.map, [this.collisions.players, this.collisions.terrain, this.collisions.bullets, this.collisions.orb]);
    particles.create();
    game.e2e = {
      player: this.player,
      map: this.map,
      enemies: this.limpetGuns
    };
  },

  /**
   * Creates the user interface and touch controls
   *
   * @method createUi
   */
  createUi: function() {
    if (game.controls.isJoypadEnabled) {
      game.controls.initJoypad();
    }
    ui.init();
    ui.missionSwipe.init(0, game.height * 0.15, game.width * 0.7, 80, ui.group);
    ui.score.init(10, 10, ui.group);
    ui.score.update(this.player.score, true);
    ui.fuel.init(10, 30, ui.group);
    ui.fuel.update(this.player.fuel, true);
    ui.lives.init(10, 50, ui.group);
    ui.lives.update(this.player.lives, true);
  },

  /**
   * Create an enemy
   *
   * @method createLimpet
   * @param data
   */
  createLimpet: function(data) {
    var limpet = new LimpetGun(data.rotation, data.x, data.y, this.collisions, this.groups);
    limpet.killed.addOnce(this.limpetDestroyed, this);
    this.limpetGuns.push(limpet);
  },

  /**
   * Singal handler for when a limpet gun is destroyed, we can update score
   *
   * @method limpetDestroyed
   * @param score
   */
  limpetDestroyed: function(score) {
    this.player.score += score;
  },

  /**
   * Layer group z-index
   *
   * @method createGroupLayering
   */
  createGroupLayering: function () {
    if (this.background) {
      this.groups.terrain.add(this.background.sprite);
    }
    this.groups.terrain.add(this.map.sprite);
    this.groups.actors.add(this.player);
    this.groups.actors.add(this.orb.sprite);
    _.each(this.limpetGuns, function(limpet) {
      this.groups.enemies.add(limpet);
    }, this);
    this.groups.swapTerrain();
    game.world.add(ui.group);
  },

  /**
   * Initialises player control
   * also activates enemy
   *
   * @method initControls
   */
  initControls: function () {
    if (game.controls.isJoypadEnabled) {
      this.stick = game.controls.stick;
      game.controls.buttonA.onDown.add(this.pressButtonA, this);
      game.controls.buttonA.onUp.add(this.upButtonA, this);
      game.controls.buttonB.onDown.add(this.pressButtonB, this);
      game.controls.buttonB.onUp.add(this.upButtonB, this);
    }
    this.cursors = game.controls.cursors;
    game.controls.spacePress.onDown.add(this.player.fire, this.player);
    game.controls.xKey.onDown.add(this.xDown, this);
    game.controls.xKey.onUp.add(this.xUp, this);

    this.player.init();
  },

  /**
   * Initialises the limpet guns
   *
   * @method initEnemies
   */
  initEnemies: function() {
    _.each(this.limpetGuns, function(limpet) {
      limpet.init();
    });
  },

  /**
   * Touch control: Press A
   *
   * @method pressButtonA
   */
  pressButtonA: function () {
    this.buttonADown = true;
  },

  /**
   * Touch control: Release A
   *
   * @method upButtonA
   */
  upButtonA: function () {
    this.buttonADown = false;
  },

  /**
   * Touch control: Press B
   * * fire
   *
   * @method pressButtonB
   */
  pressButtonB: function () {
    this.buttonBDown = true;
    this.player.fire();
  },

  /**
   * Touch control: Release B
   *
   * @method upButtonB
   */
  upButtonB: function () {
    this.buttonBDown = false;
  },

  /**
   * Key control: Press X
   *
   * @method xDown
   */
  xDown: function () {
    this.isXDown = true;
    //limpet1.fire();
  },


  /**
   * Key control: Release X
   *
   * @method xUp
   */
  xUp: function () {
    this.isXDown = false;
    if (!properties.gamePlay.autoOrbLocking) {
      this.tractorBeam.lockingRelease();
    }
  }
};
