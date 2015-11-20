//Dependencies
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

//levels
var levelManager = require('../data/level-manager');
var level;

//environment
var collisions;
var groups;

//actors
var player;
var orb;
var tractorBeam;
var background;
var limpetGuns = [];

//controls;
var buttonADown = false;
var buttonBDown = false;
var isXDown = false;

var inPlay = false;

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

  emitter: null,
  /**
   * Preload in game assets
   *
   * @method preload
   */
  preload: function () {
    level = levelManager.currentLevel;
    console.warn('Preloading level:', levelManager.levelIndex + 1, levelManager.currentLevel);
    if (game.controls.isJoypadEnabled) {
      game.load.atlas('dpad', 'assets/images/virtualjoystick/skins/dpad.png', 'assets/images/virtualjoystick/skins/dpad.json');
    }
    game.load.image('stars', 'assets/images/starfield.png');
    game.load.image('smoke_r', 'assets/images/smoke_colors.png');
    _.each(levelManager.levels, this.loadMapData, this);
    game.load.image('player', 'assets/actors/player.png');
    game.load.physics('playerPhysics', 'assets/actors/player.json');
  },

  /**
   * Load all maps in defined in the levelManager
   *
   * @method loadMap Data
   * @param level
   */
  loadMapData: function(level) {
    game.load.image(level.mapImgKey, level.mapImgUrl);
    game.load.physics(level.mapDataKey, level.mapDataUrl);
  },

  /**
   * Setup the game
   *
   * @method create
   */
  create: function () {
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
    inPlay = true;

    player.start();
    _.each(limpetGuns, function(limpet) {
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
   * Cursors &/or gamepad
   *
   * @method checkPlayerInput
   */
  checkPlayerInput: function () {
    if (player.isDead || !this.cursors) {
      return;
    }
    if ((this.stick && this.stick.isDown && this.stick.direction === Phaser.LEFT) || this.cursors.left.isDown) {
      player.rotate(-100)
    } else if ((this.stick && this.stick.isDown && this.stick.direction === Phaser.RIGHT) || this.cursors.right.isDown) {
      player.rotate(100);
    } else if (!game.e2e.controlOverride) {
      player.body.setZeroRotation();
    }
    if (this.cursors.up.isDown || buttonADown) {
      if (player.fuel >= 0) {
        player.body.thrust(400);
        ui.fuel.update(player.fuel--, true);
      }
    }
    if (!tractorBeam.hasGrabbed) {
      if (isXDown || properties.gamePlay.autoOrbLocking) {
        player.checkOrbDistance();
      }
    } else {
      tractorBeam.drawBeam(player.position);
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

    if (!player.isDead) {
      if (player.body.y < 250 && player.inGameArea) {

        player.inGameArea = false;
        //player.warp();
        console.log('checkPlayerLocation :: isUnder ', player.body.y);
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
    player.update();
    groups.enemies.forEach(function (enemy) {
      enemy.update();
    });
    if (background && properties.gamePlay.parallax) {
      background.update();
    }
  },

  /**
   *
   *
   * @method uiUpdate
   */
  uiUpdate: function() {
    if (inPlay) {

    }
  },

  /**
   * Set game world parameters depending on level size
   *
   * @method defineWorldBounds
   */
  defineWorldBounds: function () {
    game.world.setBounds(0, 0, level.world.width, level.world.height);
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

    groups = new Groups(this.cameraGroup);
    collisions = new Collisions();
    if (properties.drawBackground) {
      background = new Background();
    }
    player = new Player(game.width / 2, game.height / 2, collisions, groups);
    player.livesLost.add(this.gameOver, this);
    orb = new Orb(level.orbPosition.x, level.orbPosition.y, collisions);
    tractorBeam = new TractorBeam(orb, player);
    player.setTractorBeam(tractorBeam);
    _.each(level.enemies, this.createLimpet, this);
    map = new Map(level.mapPosition.x, level.mapPosition.y, collisions);
    game.camera.follow(player);

    collisions.set(orb.sprite, [collisions.players, collisions.terrain, collisions.enemyBullets]);
    collisions.set(map, [collisions.players, collisions.terrain, collisions.bullets, collisions.orb]);

    particles.create();

    //expose key elements to window for e2e testing
    game.e2e = {
      player: player,
      map: map,
      enemies: limpetGuns
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
    ui.score.update(player.score, true);
    ui.fuel.init(10, 30, ui.group);
    ui.fuel.update(player.fuel, true);
    ui.lives.init(10, 50, ui.group);
    ui.lives.update(player.lives, true);
  },

  /**
   * Create an enemy
   *
   * @method createLimpet
   * @param data
   */
  createLimpet: function(data) {
    var limpet = new LimpetGun(data.rotation, data.x, data.y, collisions, groups);
    limpetGuns.push(limpet);
    limpet.killed.addOnce(this.limpetDestroyed, this);
  },

  /**
   * Singal handler for when a limpet gun is destroyed, we can update score
   *
   * @method limpetDestroyed
   * @param score
   */
  limpetDestroyed: function(score) {
    player.score += score;
    ui.score.update(score, false);
  },

  /**
   * Layer group z-index
   *
   * @method createGroupLayering
   */
  createGroupLayering: function () {
    if (background) {
      groups.terrain.add(background.sprite);
    }
    groups.terrain.add(map.sprite);
    groups.actors.add(player);
    groups.actors.add(orb.sprite);
    _.each(limpetGuns, function(limpet) {
      groups.enemies.add(limpet);
    });
    groups.swapTerrain();
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
    game.controls.spacePress.onDown.add(player.fire, player);
    game.controls.xKey.onDown.add(this.xDown, this);
    game.controls.xKey.onUp.add(this.xUp, this);

    player.init();
  },

  /**
   * Initialises the limpet guns
   *
   * @method initEnemies
   */
  initEnemies: function() {
    _.each(limpetGuns, function(limpet) {
      limpet.init();
    });
  },

  /**
   * Touch control: Press A
   *
   * @method pressButtonA
   */
  pressButtonA: function () {
    buttonADown = true;
  },

  /**
   * Touch control: Release A
   *
   * @method upButtonA
   */
  upButtonA: function () {
    buttonADown = false;
  },

  /**
   * Touch control: Press B
   * * fire
   *
   * @method pressButtonB
   */
  pressButtonB: function () {
    buttonBDown = true;
    player.fire();
  },

  /**
   * Touch control: Release B
   *
   * @method upButtonB
   */
  upButtonB: function () {
    buttonBDown = false;
  },

  /**
   * Key control: Press X
   *
   * @method xDown
   */
  xDown: function () {
    isXDown = true;
    //limpet1.fire();
  },


  /**
   * Key control: Release X
   *
   * @method xUp
   */
  xUp: function () {
    isXDown = false;
    if (!properties.gamePlay.autoOrbLocking) {
      tractorBeam.lockingRelease();
    }
  }
};
