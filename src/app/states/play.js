'use strict';

var properties = require('../properties');
var Collisions = require('../environment/Collisions');
var Groups = require('../environment/Groups');
var ui = require('../ui/index');
var Player = require('../actors/Player');
var Fuel = require('../actors/Fuel');
var LimpetGun = require('../actors/LimpetGun');
var Orb = require('../actors/Orb');
var Map = require('../actors/Map');
var Background = require('../actors/Background');
var TractorBeam = require('../actors/TractorBeam');
var _ = require('lodash');
var particles = require('../environment/particles');
var levelManager = require('../data/level-manager');
var PowerStation = require('../actors/PowerStation');
var PhysicsActor = require('../actors/PhysicsActor');

/**
 * The play state
 *
 * @namespace states
 * @submodule play
 * @property play.level
 * @class play
 * @type {Phaser.State}
 * @static
 */
module.exports = {
  level: null,
  collisions: null,
  groups: null,
  player: null,
  orb: null,
  fuels: [],
  tractorBeam: null,
  background: null,
  limpetGuns: [],
  buttonADown: false,
  buttonBDown: false,
  isXDown: false,
  inPlay: false,
  emitter: null,
  crossHair: null,
  crossHairSpeed: 15,

  /**
   * Setup the game
   *
   * @method create
   */
  create: function () {
    this.setLevel();
    this.defineWorldBounds();
    this.createActors();
    this.createUi();
    this.createGroupLayering();
    this.initPlayState();
  },

  /**
   *
   * @method initPlayState
   */
  initPlayState: function() {
    if (!properties.dev.skipIntro) {
      this.startLevelIntro();
    } else if (!properties.dev.mode) {
      this.missionStart();
    } else {
      this.initialiseDevMode();
    }
  },

  /**
   * Gameloop
   *
   * @method update
   */
  update: function () {
    this.checkPlayerInput();
    this.actorsUpdate();
    this.uiUpdate();
    this.checkGameCondition();

    if (this.isDevMode) {
      this.devModeUpdate();
    }
  },

  /**
   * Needed for debug display
   *
   * @method render
   */
  render: function () {
    if (properties.debugPositions) {
      game.debug.cameraInfo(game.camera, 400, 32);
      if (this.isDevMode) {
        game.debug.spriteCoords(this.crossHair, 32, 450);
      } else {
        game.debug.spriteCoords(this.player, 32, 450);
      }
    }
  },

  /**
   * Called first thing in state.create
   * to set the level to the current level defined in levelManager.
   * When next level is called, the data is moved along and the setLevel is called
   * as part of the state restart.
   *
   * @method setLevel
   */
  setLevel: function () {
    this.level = levelManager.currentLevel;
  },

  /**
   * Moves level data to the next level, and restarts
   * the game state
   *
   * @method nextLevel
   */
  nextLevel: function () {
    ui.interstitial.clear();
    this.limpetGuns = [];
    this.fuels = [];
    this.groups.background.removeAll(true);
    this.groups.actors.removeAll(true);
    this.groups.fuels.removeAll(true);
    this.groups.enemies.removeAll(true);
    this.groups.terrain.removeAll(true);
    levelManager.nextLevel();
    game.state.restart();
  },

  /**
   * @method startLevelIntro
   */
  startLevelIntro: function () {
    ui.missionSwipe.missionStartSwipeIn(this.missionStart, this);
  },

  /**
   * * initialise mission start swipe
   *
   * @method missionStart
   */
  missionStart: function () {
    //this.inPlay = true;
    this.player.start(this.playerWarpComplete, this);
    //this.initEnemies();
  },

  /**
   * Activate player control
   * Activate enemyies
   *
   * @method playerWarpComplete
   */
  playerWarpComplete: function() {
    this.inPlay = true;
    this.initControls();
    this.initActorsStart();
  },

  initActorsStart: function() {
    _.each(this.limpetGuns, function (limpet) {
      limpet.start();
    });
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
    this.player.checkPlayerControl(this.stick, this.cursors, this.buttonADown);
    this.tractorBeam.checkDistance(this.player, this.isXDown);

  },

  /**
   * Has the player won, lost etc
   *
   * @method checkGameCondition
   */
  checkGameCondition: function () {
    this.checkPlayerLocation();
  },

  /**
   *
   *
   * @method checkPlayerLocation
   */
  checkPlayerLocation: function () {
    if (this.player.alive) {
      if (this.player.y < 100 && this.player.inGameArea) {
        this.inPlay = false;
        this.player.inGameArea = false;
        this.player.stop();
        this.orb.stop();
        particles.playerTeleport(this.player.x, this.player.y, _.bind(this.removePlayers, this));
        if (this.tractorBeam.hasGrabbed) {
          this.tractorBeam.breakLink();
          particles.orbTeleport(this.orb.sprite.x, this.orb.sprite.y);
        }
      }
    }
  },

  /**
   * @method removePlayers
   */
  removePlayers: function() {
    this.player.tweenOutAndRemove(true);
    game.time.events.add(1000, _.bind(this.levelInterstitialStart, this));
  },

  /**
   * @method levelInterstitialStart
   */
  levelInterstitialStart: function() {
    ui.interstitial.levelComplete();
    game.time.events.add(4000, _.bind(this.nextLevel, this));
  },

  /**
   * Game Over Signal handler
   *
   * @method gameOver
   * @param score
   */
  gameOver: function (score) {
    console.warn('GAME OVER score:', score);
  },

  /**
   * Filter gameloop to actors
   *
   * @method actorsUpdate
   */
  actorsUpdate: function () {
    this.player.update();
    this.checkForFuelDistance();
    this.groups.enemies.forEachAlive(function (enemy) {
      enemy.update();
    });
    if (this.background && properties.gamePlay.parallax) {
      this.background.update();
    }
  },

  /**
   * @method checkForFuelDistance
   */
  checkForFuelDistance: function() {
    _.each(this.fuels, function(fuel) {
      fuel.update();
    }, this);
  },

  /**
   *
   *
   * @method uiUpdate
   */
  uiUpdate: function () {
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
    console.warn('play :: defineWorldBounds :: this.level.world', this.level);
    game.world.setBounds(0, 0, this.level.world.width, this.level.world.height);
  },

  /**
   * create game actors, group and collision initialisation
   * game.e2e exposes actors to window, allowing actor control in e2e tests.
   *
   * @method createActors
   */
  createActors: function () {
    this.groups = new Groups();
    this.collisions = new Collisions();
    if (properties.drawBackground) {
      this.background = new Background();
    }
    particles.create();
    this.player = new Player(this.collisions, this.groups);
    this.player.livesLost.add(this.gameOver, this);
    this.orb = new Orb(this.level.orbPosition.x, this.level.orbPosition.y, this.collisions);
    this.orb.setPlayer(this.player);
    this.tractorBeam = new TractorBeam(this.orb, this.player);
    this.player.setTractorBeam(this.tractorBeam);
    _.each(this.level.enemies, this.createLimpet, this);
    _.each(this.level.fuels, this.createFuel, this);
    this.powerStation = new PowerStation(this.collisions, this.groups, 'powerStationImage', this.level.powerStation.x, this.level.powerStation.y);
    this.powerStation.initPhysics('powerStationPhysics', 'power-station');

    this.orbHolder = new PhysicsActor(this.collisions, this.groups, 'orbHolderImage', this.level.orbHolder.x, this.level.orbHolder.y);
    //this.orbHolder.initPhysics('orbHolderPhysics', 'orb-holder');

    this.map = new Map(this.collisions, this.groups);
    game.camera.follow(this.player);

    this.powerStation.body.setCollisionGroup(this.collisions.terrain);
    //this.orbHolder.body.setCollisionGroup(this.collisions.terrain);

    this.powerStation.initCollisions();

    this.collisions.set(this.powerStation, [this.collisions.players, this.collisions.bullets, this.collisions.orb]);
    this.collisions.set(this.orb.sprite, [this.collisions.players, this.collisions.terrain, this.collisions.enemyBullets]);
    this.collisions.set(this.map, [this.collisions.players, this.collisions.bullets, this.collisions.enemyBullets, this.collisions.orb]);

    this.initEnemies();
    game.e2e.player = this.player;
    game.e2e.map = this.map;
    game.e2e.enemies = this.limpetGuns;
  },

  /**
   * Creates the user interface and touch controls
   *
   * @method createUi
   */
  createUi: function () {
    if (game.controls.isJoypadEnabled) {
      game.controls.initJoypad();
    }
    ui.init();
    ui.missionSwipe.init(0, game.height * 0.35, game.width * 0.5, 80, ui.group);
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
  createLimpet: function (data) {
    var limpet = new LimpetGun(data.x, data.y, data.rotation, this.collisions, this.groups);
    limpet.killed.addOnce(this.limpetDestroyed, this);
    this.limpetGuns.push(limpet);
  },

  /**
   * Create a fuel collectible
   *
   * @method createFuel
   * @param data
   */
  createFuel: function(data) {
    var fuel = new Fuel(this.collisions, this.groups, 'fuelImage', data.x, data.y);
    fuel.player = this.player;
    this.fuels.push(fuel);
  },

  /**
   * Singal handler for when a limpet gun is destroyed, we can update score
   *
   * @method limpetDestroyed
   * @param score
   */
  limpetDestroyed: function (score) {
    this.player.score += score;
  },

  /**
   * Layer group z-index
   *
   * @method createGroupLayering
   */
  createGroupLayering: function () {
    if (this.background) {
      this.groups.background.add(this.background.sprite);
    }
    this.groups.actors.add(this.player);
    this.groups.actors.add(this.orb.sprite);
    _.each(this.limpetGuns, function (limpet) {
      this.groups.enemies.add(limpet);
    }, this);
    _.each(this.fuels, function(fuel) {
      this.groups.fuels.add(fuel);
    }, this);
    this.groups.actors.add(this.powerStation);
    this.groups.actors.add(this.orbHolder);
    this.groups.swapTerrain();
    game.world.add(ui.group);
  },

  /**
   * @method initialiseDevMode
   */
  initialiseDevMode: function() {
    this.isDevMode = true;
    this.cursors = game.controls.cursors;
    this.crossHair = new Phaser.Sprite(game, game.width/2, game.height/2, 'crossHair');
    this.crossHair.anchor.setTo(0.5);
    game.world.add(this.crossHair);
    game.camera.follow(this.crossHair);
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
  },

  /**
   * Initialises the limpet guns
   *
   * @method initEnemies
   */
  initEnemies: function () {
    _.each(this.limpetGuns, function (limpet) {
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
  },

  /**
   * ### DEVELOPMENT MODE
   *
   * @method devModeUpdate
   */
  devModeUpdate: function() {
    var slow = function(thisArg) {
      thisArg.crossHairSpeed = 5;
    };
    var fast = function(thisArg) {
      thisArg.crossHairSpeed = 15;
    };
    var point = new Phaser.Point(this.crossHair.x, this.crossHair.y);
    this.checkUp(slow, fast, point);
    this.checkDown(slow, fast, point);
    this.checkLeft(slow, fast, point);
    this.checkRight(slow, fast, point);
    TweenMax.to(this.crossHair, 0.1, {x: point.x, y: point.y, ease:Power0.easeNone});
  },

  /**
   * @method checkUp
   * @param slow
   * @param fast
   * @param point
   */
  checkUp: function(slow, fast, point) {
    if (this.cursors.up.isDown) {
      this.cursors.up.shiftKey? slow(this) : fast(this);
      point.y = this.crossHair.y - this.crossHairSpeed;
    }
  },

  /**
   * @method checkDown
   * @param slow
   * @param fast
   * @param point
   */
  checkDown: function(slow, fast, point) {
    if (this.cursors.down.isDown) {
      this.cursors.down.shiftKey? slow(this) : fast(this);
      point.y = this.crossHair.y + this.crossHairSpeed;
    }
  },

  /**
   * @method checkRight
   * @param slow
   * @param fast
   * @param point
   */
  checkRight: function(slow, fast, point) {
    if (this.cursors.right.isDown) {
      this.cursors.right.shiftKey? slow(this) : fast(this);
      point.x = this.crossHair.x + this.crossHairSpeed;
    }
  },

  /**
   * @method checkLeft
   * @param slow
   * @param fast
   * @param point
   */
  checkLeft: function(slow, fast, point) {
    if (this.cursors.left.isDown) {
      this.cursors.right.shiftKey? slow(this) : fast(this);
      point.x = this.crossHair.x - this.crossHairSpeed;
    }
  },

};
