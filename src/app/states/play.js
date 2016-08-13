'use strict';

var properties = require('../properties');
var Collisions = require('../environment/Collisions');
var Groups = require('../environment/Groups');
var ui = require('../ui/index');
var Player = require('../actors/Player');
var Fuel = require('../actors/Fuel');
var Limpet = require('../actors/Limpet');
var Switch = require('../actors/GateSwitch');
var Orb = require('../actors/Orb');
var Map = require('../actors/Map');
var Background = require('../actors/Background');
var TractorBeam = require('../actors/TractorBeam');
var _ = require('lodash');
var particles = require('../environment/particles/manager');
var levelManager = require('../data/level-manager');
var PowerStation = require('../actors/PowerStation');
var PhysicsActor = require('../actors/PhysicsActor');
var gameState = require('../data/game-state');
var sound = require('../utils/sound');
var droneManager = require('../actors/drone-manager');
var Stopwatch = require('../ui/Stopwatch');
var TimelineMax = global.TimelineMax;

/**
 * The play statem
 * - Core class for game logic
 * - Actor and Level creation
 * - User Interface
 * - Internal (non Phaser) State transitions
 *
 * @namespace states
 * @submodule play
 * @property play.level
 * @class play
 * @type {Phaser.State}
 * @static
 */
module.exports = {
  externalGamePadDetected: false,
  level: null,
  collisions: null,
  groups: null,
  player: null,
  orb: null,
  fuels: [],
  tractorBeam: null,
  background: null,
  limpetGuns: [],
  switches: [],
  buttonADown: false,
  buttonBDown: false,
  isXDown: false,
  inPlay: false,
  emitter: null,
  crossHair: null,
  crossHairSpeed: 15,
  menuMode: false,
  stopwatch: null,
  cameraPos: {
    x: 0,
    y: 0
  },
  planetDeathTl: null,
  explosionsTimer: null,

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
    this.showCurrentScreenByState(gameState.currentState);
    gameState.levelsCompleted.add(this.levelsCompleted, this);
  },

  levelsCompleted: function () {
    gameState.currentState = gameState.PLAY_STATES.COMPLETE;
    this.showCurrentScreenByState(gameState.currentState);
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
    if (droneManager.followOrb) {
      this.updateCamera(this.orb.sprite);
    } else {
      this.updateCamera(this.player);
    }
    if (this.uiMode) {
      if (game.controls.useVirtualJoypad || game.controls.useExternalJoypad) {
        ui.update();
      }
    }
    if (game.controls.useExternalJoypad &&
      gameState.trainingMode &&
      ui.missionDialog.enabled) {
      ui.missionDialog.update();
    }
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
    if (properties.dev.stats) {
      game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
    }
    if (properties.dev.debugPositions) {
      game.debug.cameraInfo(game.camera, 400, 32);
      if (this.isDevMode) {
        game.debug.spriteCoords(this.crossHair, 32, 450);
      } else {
        game.debug.spriteCoords(this.player, 32, 450);
      }
    }
  },

  /**
   *
   * @method playGame
   */
  playGame: function () {
    ui.showUser();
    if (!properties.dev.skipIntro) {
      this.startLevelIntro();
    } else if (!properties.dev.mode) {
      this.missionStart();
    } else {
      this.initialiseDevMode();
    }
  },

  /**
   * @property showCurrentScreenByState
   * @param state {String} name of gameState and also name of screen to show
   */
  showCurrentScreenByState: function (state) {
    console.warn('showCurrentScreenByState', state);
    this.uiMode = state === gameState.PLAY_STATES.MENU || state === gameState.PLAY_STATES.OPTIONS;
    if (state === gameState.PLAY_STATES.PLAY) {
      ui.showUser();
      this.playGame();
    } else {
      ui.hideUser();
    }
    var shouldFadeBackground = (
      state === gameState.PLAY_STATES.COMPLETE ||
      state === gameState.PLAY_STATES.HIGH_SCORES ||
      state === gameState.PLAY_STATES.INTERSTITIAL
    );
    ui.showScreen(state, shouldFadeBackground);

    if (state === gameState.PLAY_STATES.MENU && !sound.music) {
      sound.playMusic("thrust-title-theme1", 1, true);

    }

    if (state === gameState.PLAY_STATES.PLAY) {
      sound.stopMusic();
    }

    if (state === gameState.PLAY_STATES.HIGH_SCORES && gameState.shouldEnterHighScore) {
      ui.highscores.insertNewScore();
      gameState.shouldEnterHighScore = false;
    }
  },

  /**
   * @method menuItemSelected
   * @param item {Object}
   */
  menuItemSelected: function (item) {

    switch (item.text.text) {
      case "PLAY THRUST" :
        gameState.newPlayer();
        this.showCurrentScreenByState(gameState.PLAY_STATES.PLAY);
        break;
      case "TRAINING" :
        gameState.newPlayer();
        gameState.trainingMode = true;
        console.warn('Training Mode activated');
        this.restartPlayState();
        this.showCurrentScreenByState(gameState.PLAY_STATES.PLAY);
        break;
      case "HIGH-SCORES":
        this.showCurrentScreenByState(gameState.PLAY_STATES.HIGH_SCORES);
        break;
      case "OPTIONS" :
        this.showCurrentScreenByState(gameState.PLAY_STATES.OPTIONS);
        break;
      default :
        console.log(item.text.text + ' not implemented');
        break;
    }
  },

  /**
   * Change the lerp value to alter the amount of damping, lower values = smoother camera movement
   * @method updateCamera
   */
  updateCamera: function (target) {
    var lerp = 0.05;
    this.cameraPos.x += (target.x - this.cameraPos.x) * lerp;
    this.cameraPos.y += (target.y - this.cameraPos.y) * lerp;
    game.camera.focusOnXY(this.cameraPos.x, this.cameraPos.y);
  },

  /**
   * Moves level data to the next level, and restarts
   * the game state
   *
   * @method restartPlayState
   */
  restartPlayState: function () {
    ui.countdown.clear();
    ui.destroy();
    this.limpetGuns = [];
    this.fuels = [];
    this.groups.background.removeAll(true);
    this.groups.actors.removeAll(true);
    this.groups.fuels.removeAll(true);
    this.groups.enemies.removeAll(true);
    this.groups.terrain.removeAll(true);
    gameState.nextLevel();
    game.state.restart();
  },

  /**
   * @method nextLevel
   */
  nextLevel: function () {
    gameState.currentState = gameState.PLAY_STATES.PLAY;
    this.restartPlayState();
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
    gameState.isGameOver = false;
    if (gameState.trainingMode) {
      this.createMissionDialog();
    } else {
      this.playerStart();
    }
  },

  playerStart: function () {
    this.player.start(this.playerWarpComplete, this);
  },

  /**
   * Activate player control
   * Activate enemyies
   *
   * @method playerWarpComplete
   */
  playerWarpComplete: function () {
    this.inPlay = true;
    this.initControls();
    this.startEnemies();
    if (!gameState.trainingMode) {
      this.player.orbActivated = true;
    }
  },

  /**
   * @method startEnemies
   */
  startEnemies: function () {
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
    if (!this.inPlay) {
      return;
    }
    this.tractorBeam.checkDistance(this.player, this.isXDown);
    if (game.controls.useExternalJoypad) {
      this.player.checkPlayerControlJoypad();
    } else {
      this.player.checkPlayerControl(this.cursors, this.buttonADown);
    }
  },

  /**
   * Has the player won, lost etc
   *
   * @method checkGameCondition
   */
  checkGameCondition: function () {
    this.checkPlayerLocation();
    this.checkGameOver();
  },

  /**
   *
   *
   * @method checkPlayerLocation
   */
  checkPlayerLocation: function () {
    if (this.player.alive) {
      if (this.player.y < 100 && this.player.inGameArea) {
        this.player.inGameArea = false;
        this.inPlay = false;
        this.player.stop();
        this.orb.stop();
        ui.countdown.stop();
        sound.playSound('teleport-in3');
        this.player.levelExit();
       if (gameState.trainingMode) {
         droneManager.trainingComplete();
         gameState.playTime = this.stopwatch.getText();
       }
        particles.playerTeleport(this.player.x, this.player.y, _.bind(this.levelTransition, this));
        if (this.tractorBeam.hasGrabbed) {
          gameState.bonuses.orbRecovered = true;
          this.tractorBeam.breakLink();
          particles.orbTeleport(this.orb.sprite.x, this.orb.sprite.y);
        }
      }
    }
  },

  /**
   * @method checkGameOver
   */
  checkGameOver: function () {
    if (gameState.lives < 0 && !gameState.isGameOver) {
      gameState.isGameOver = true;
      game.time.events.add(3000, _.bind(this.gameOver, this));
    }
  },
  /**
   * @method levelTransition
   */
  levelTransition: function () {
    this.player.tweenOutAndRemove(true);
    game.time.events.add(1000, _.bind(this.levelInterstitialStart, this));
  },

  /**
   * @method levelInterstitialStart
   */
  levelInterstitialStart: function () {
    console.log('play :: levelInterstitialStart');
    gameState.currentState = gameState.PLAY_STATES.INTERSTITIAL;
    ui.showScreen(gameState.currentState, true);
  },

  /**
   * Game Over Signal handler
   *
   * @method gameOver
   */
  gameOver: function () {
    console.warn('GAME OVER score:', gameState.score);
    ui.countdown.stop();
    if (gameState.trainingMode) {
      gameState.trainingMode = false;
      gameState.currentState = gameState.PLAY_STATES.MENU;
      gameState.newGame();
    } else {
      gameState.currentState = gameState.PLAY_STATES.HIGH_SCORES;
      if (gameState.isGameOver) {
        gameState.newGame();
        gameState.doHighScoreCheck();
      }
    }
    this.restartPlayState();
  },

  /**
   * Filter gameloop to actors
   *
   * @method actorsUpdate
   */
  actorsUpdate: function () {
    this.player.update();
    this.powerStation.update();
    this.checkForFuelDistance();
    this.groups.enemies.forEachAlive(function (enemy) {
      enemy.setPower(this.powerStation.health);
      enemy.update();
    }, this);
    if (this.background && properties.gamePlay.parallax) {
      this.background.update();
    }
  },

  /**
   * @method checkForFuelDistance
   */
  checkForFuelDistance: function () {
    _.each(this.fuels, _.bind(function (fuel) {
      fuel.update();
    }, this));
  },

  /**
   *
   *
   * @method uiUpdate
   */
  uiUpdate: function () {
    ui.fuel.update(gameState.fuel, true);
    ui.score.update(gameState.score, true);
    ui.lives.update(Math.max(gameState.lives, 0), true);

    if (gameState.currentState === gameState.PLAY_STATES.HIGH_SCORES) {
      ui.highscores.update();
    }

    if (game.externalJoypad) {
      if (gameState.currentState === gameState.PLAY_STATES.INTERSTITIAL) {
        ui.interstitial.update();
      } else if (gameState.currentState === gameState.PLAY_STATES.COMPLETE) {
        ui.levelsComplete.update();
      }
    }
  },

  /**
   * Set game world parameters depending on level size
   *
   * @method defineWorldBounds
   */
  defineWorldBounds: function () {
    console.info('play :: defineWorldBounds :: this.level=', this.level);
    game.world.setBounds(0, 0, this.level.world.width, this.level.world.height);
  },

  /**
   * @todo refactor.
   * @todo simplify training/normal level creation
   *
   * create game actors, group and collision initialisation
   * game.e2e exposes actors to window, allowing actor control in e2e tests.
   *
   * @method createActors
   */
  createActors: function () {
    this.groups = new Groups();
    this.collisions = new Collisions();
    if (properties.drawBackground) {
      var bgKey = gameState.trainingMode ? 'starfield' : 'stars';
      this.background = new Background(0, 0, bgKey);
    }
    particles.create();
    this.player = new Player(this.collisions, this.groups);
    this.orb = new Orb(this.level.orbPosition.x, this.level.orbPosition.y, this.collisions);
    this.orb.setPlayer(this.player);
    this.map = new Map(this.collisions, this.groups);
    this.tractorBeam = new TractorBeam(this.orb, this.player, this.groups);
    this.player.setTractorBeam(this.tractorBeam);
    this.orbHolder = new PhysicsActor(this.collisions, this.groups, 'orbHolderImage', this.level.orbHolder.x, this.level.orbHolder.y);
    if (!gameState.trainingMode) {
      _.each(this.level.enemies, _.bind(this.createLimpet, this));
      _.each(this.level.fuels, _.bind(this.createFuel, this));
      _.each(this.level.switches, _.bind(this.createSwitch, this));
      this.powerStation = new PowerStation(this.collisions, this.groups, 'powerStationImage', this.level.powerStation.x, this.level.powerStation.y);
      this.powerStation.initPhysics('powerStationPhysics', 'power-station');
      this.powerStation.destructionSequenceActivated.add(this.startDestructionSequence, this);
      this.powerStation.body.setCollisionGroup(this.collisions.terrain);
      this.powerStation.initCollisions();
      this.collisions.set(this.powerStation, [this.collisions.players, this.collisions.orb]);
      this.collisions.set(this.map, [this.collisions.players, this.collisions.bullets, this.collisions.enemyBullets, this.collisions.orb]);
      if (this.map.gateSprite) {
        this.collisions.set(this.map.gateSprite, [this.collisions.players, this.collisions.bullets, this.collisions.enemyBullets, this.collisions.orb]);
      }
      this.collisions.set(this.orb.sprite, [this.collisions.players, this.collisions.terrain, this.collisions.enemyBullets]);
    } else {
      this.collisions.set(this.orb.sprite, [this.collisions.players, this.collisions.terrain, this.collisions.enemyBullets]);
      this.collisions.set(this.map, [this.collisions.players, this.collisions.orb]);
      this.createTrainingDrones();
    }
    this.cameraPos.x = this.player.x;
    this.cameraPos.y = this.player.y;
    game.e2e.player = this.player;
    game.e2e.map = this.map;
    game.e2e.enemies = this.limpetGuns;
  },

  /**
   * @method createMissionDialog
   */
  createMissionDialog: function () {
    ui.missionDialog.render(function() {
      this.playerStart();
      this.stopwatch = new Stopwatch();
      this.stopwatch.start(ui.stopwatch);
      droneManager.activateTimedRun(this.stopwatch);
    }.bind(this), this);
  },

  /**
   * @method createTrainingDrones
   */
  createTrainingDrones: function () {
    droneManager.init(this.player, this.groups, this.collisions);
    droneManager.newDrones();
    droneManager.newHoverDrones();
  },

  /**
   * @method startDestructionSequence
   */
  startDestructionSequence: function () {
    ui.countdown.start();
    gameState.bonuses.planetBuster = true;
  },

  /**
   * Planet destruction animation
   *
   * @method countdownComplete
   */
  countdownComplete: function () {
    //do planet destruction anims
    this.player.alive = false;
    this.player.inPlay = false;
    this.planetDeathTl = new TimelineMax();
    this.planetDeathTl.addCallback(this.randomExplosions, 0, null, this);
    this.planetDeathTl.addCallback(this.destroyPlayer, 3, null, this);
    this.planetDeathTl.addCallback(this.fadeToWhite, 3.5, null, this);
    this.planetDeathTl.addCallback(this.removePlanet, 4, null, this);
    this.planetDeathTl.addCallback(game.camera.resetFX, 5, null, game.camera);
    this.planetDeathTl.addCallback(this.levelInterstitialStart, 8, null, this);
  },

  /**
   * @method removePlanet
   */
  removePlanet: function() {
    this.groups.actors.removeAll(true);
    this.groups.fuels.removeAll(true);
    this.groups.enemies.removeAll(true);
    this.groups.terrain.removeAll(true);
  },

  /**
   *
   *
   * @method randomExplosions
   */
  randomExplosions: function() {
    var numExplosions = 30;
    var duration = 2000;
    var pos = new Phaser.Point(
      Math.random() * (game.camera.x + game.camera.width),
      Math.random() * (game.camera.y + game.camera.height)
    );
    particles.explode(pos.x, pos.y);
    sound.playSound('boom1');
    this.explosionsTimer = game.time.events.loop(duration/numExplosions, function() {
      var pos = new Phaser.Point(
        Math.random() * (game.camera.x + game.camera.width),
        Math.random() * (game.camera.y + game.camera.height)
      );
      particles.explode(pos.x, pos.y);
      sound.playSound('boom1');
    }, this);
  },

  /**
   * @method destroyPlayer
   */
  destroyPlayer: function() {
    gameState.lives--;
    this.player.stop();
    this.player.explosion(true);
  },

  /**
   * @method fadeToWhite
   */
  fadeToWhite: function() {
    game.time.events.remove(this.explosionsTimer);
    game.camera.fade(0xffffff, 740, true);
  },

  /**
   * Creates the user interface and touch controls
   *
   * @method createUi
   */
  createUi: function () {
    var style = { font: "16px thrust_regular", fill: "#ffffff", align: "center", backgroundColor: 'black' };
    this.uiPaused = game.add.text(game.width/2, game.height/2, "GAME PAUSED", style);
    this.uiPaused.anchor.setTo(0.5);
    this.uiPaused.fixedToCamera = true;
    this.uiPaused.visible = false;
    //this.uiPaused.x = game.width/2;
    //this.uiPaused.y = game.height/2;

    if (game.controls.useVirtualJoypad && !game.controls.useExternalJoypad) {
      game.controls.initVirtualJoypad();
    }

    ui.init(this.menuItemSelected, this);
    if (gameState.trainingMode) {
      ui.drawTrainingUi();
    }
    ui.countdown.complete.add(this.countdownComplete, this);
  },

  /**
   * @method createSwitch
   * @param data
   */
  createSwitch: function(data) {
    var gateSwitch = new Switch(this.collisions, this.groups, this.map, data.x, data.y, data.rotation);
    this.switches.push(gateSwitch);

  },
  /**
   * Create an enemy
   *
   * @method createLimpets
   * @param data
   *
   */
  createLimpet: function (data) {
    var limpet = new Limpet(this.collisions, this.groups, data.x, data.y, data.rotation);
    this.limpetGuns.push(limpet);
  },

  /**
   * Create a fuel collectible
   *
   * @method createFuel
   * @param data
   */
  createFuel: function (data) {
    var fuel = new Fuel(this.collisions, this.groups, 'fuelImage', data.x, data.y);
    fuel.player = this.player;
    this.fuels.push(fuel);
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
    if (this.orb) {
      this.groups.actors.add(this.orb.sprite);
    }
    if (this.powerStation) {
      this.groups.actors.add(this.powerStation);
    }
    if (this.orbHolder) {
      this.groups.actors.add(this.orbHolder);
    }
    this.groups.swapTerrain();
    if (!gameState.trainingMode) {
      _.each(this.switches, _.bind(function(gateSwitch) {
        this.groups.terrain.add(gateSwitch);
      }, this));
      _.each(this.limpetGuns, _.bind(function (limpet) {
        this.groups.enemies.add(limpet);
      }, this));
      _.each(this.fuels, _.bind(function (fuel) {
        this.groups.fuels.add(fuel);
      }, this));
    }
    game.world.add(ui.group);
  },

  /**
   * @method initialiseDevMode
   */
  initialiseDevMode: function () {
    this.isDevMode = true;
    this.cursors = game.controls.cursors;
    this.crossHair = new Phaser.Sprite(game, game.width / 2, game.height / 2, 'crossHair');
    this.crossHair.anchor.setTo(0.5);
    game.world.add(this.crossHair);
    game.camera.follow(this.crossHair);
  },

  /**
   * Initialises player control
   *
   * Maybe we can move out control initialisation and handling to
   * tidy up play state
   *
   * @method initControls
   */
  initControls: function () {
    if (game.controls.useVirtualJoypad && !game.controls.useExternalJoypad) {
      game.controls.buttonA.onDown.add(this.pressButtonA, this);
      game.controls.buttonA.onUp.add(this.upButtonA, this);
      game.controls.buttonB.onDown.add(this.pressButtonB, this);
      game.controls.buttonB.onUp.add(this.upButtonB, this);
    }
    if (game.controls.useKeys) {
      this.cursors = game.controls.cursors;
      game.controls.spacePress.onDown.add(this.player.fire, this.player);
      game.controls.xKey.onDown.add(this.xDown, this);
      game.controls.xKey.onUp.add(this.xUp, this);
      game.controls.esc.onUp.add(this.escPressed, this);
    }
  },

  /**
   * @method escPressed
   */
  escPressed: function() {
    console.log('play :: esc pressed');
    game.paused = this.uiPaused.visible = !game.paused;
  },

  /**
   *
   *
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
  devModeUpdate: function () {
    var slow = function (thisArg) {
      thisArg.crossHairSpeed = 5;
    };
    var fast = function (thisArg) {
      thisArg.crossHairSpeed = 15;
    };
    var point = new Phaser.Point(this.crossHair.x, this.crossHair.y);
    this.checkUp(slow, fast, point);
    this.checkDown(slow, fast, point);
    this.checkLeft(slow, fast, point);
    this.checkRight(slow, fast, point);
    TweenMax.to(this.crossHair, 0.1, {x: point.x, y: point.y, ease: Power0.easeNone});
  },

  /**
   * @method checkUp
   * @param slow
   * @param fast
   * @param point
   */
  checkUp: function (slow, fast, point) {
    if (this.cursors.up.isDown) {
      this.cursors.up.shiftKey ? slow(this) : fast(this);
      point.y = this.crossHair.y - this.crossHairSpeed;
    }
  },

  /**
   * @method checkDown
   * @param slow
   * @param fast
   * @param point
   */
  checkDown: function (slow, fast, point) {
    if (this.cursors.down.isDown) {
      this.cursors.down.shiftKey ? slow(this) : fast(this);
      point.y = this.crossHair.y + this.crossHairSpeed;
    }
  },

  /**
   * @method checkRight
   * @param slow
   * @param fast
   * @param point
   */
  checkRight: function (slow, fast, point) {
    if (this.cursors.right.isDown) {
      this.cursors.right.shiftKey ? slow(this) : fast(this);
      point.x = this.crossHair.x + this.crossHairSpeed;
    }
  },

  /**
   * @method checkLeft
   * @param slow
   * @param fast
   * @param point
   */
  checkLeft: function (slow, fast, point) {
    if (this.cursors.left.isDown) {
      this.cursors.right.shiftKey ? slow(this) : fast(this);
      point.x = this.crossHair.x - this.crossHairSpeed;
    }
  }
};
