'use strict';

var properties = require('../properties');
var Collisions = require('../environment/Collisions');
var Groups = require('../environment/Groups');
var ui = require('../ui');
var Player = require('../actors/Player');
var Fuel = require('../actors/Fuel');
var Limpet = require('../actors/Limpet');
var Switch = require('../actors/GateSwitch');
var Orb = require('../actors/Orb');
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
var features = require('../utils/features');
var MapAtlas = require('../environment/levels/MapAtlas');
var options = require('../data/options-model');
var StatusBar = global.StatusBar;

/**
 * The play statem
 * - Core class for game logic
 * - Actor and Level creation
 * - User Interface
 * - Internal (non Phaser) State transitions
 *
 * @class play
 * @type {Phaser.State}
 * @static
 */
module.exports = {
  isGameOver: true,
  startDebugLevel: false,
  cleaning: false,
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
   * Call //this.debugSpawns(); to show spawn positions
   *
   * @method create
   */
  create: function () {
    this.initOptionsModel();
    this.initFullScreenHandling();
    this.level = levelManager.currentLevel;
    game.world.setBounds(0, 0, this.level.world.width, this.level.world.height);
    this.createActors();
    this.createLevelMap();
    this.createUi();
    gameState.uiCreated = true;
    this.createGroupLayering();
    this.showCurrentScreenByState(gameState.currentState);
    gameState.levelsCompleted.add(this.levelsCompleted, this);
    if (StatusBar) {
      StatusBar.hide();
    }
    console.log("Play :: gameState scaleMode", gameState.gameScale);
  },

  /**
   * @method initOptionsModel
   */
  initOptionsModel: function () {
    options.init();
    options.fxParticlesOn.add(this.fxParticlesOn, this);
    options.fxParticlesOff.add(this.fxParticlesOff, this);
    options.fxBackgroundOn.add(this.fxBackgroundOn, this);
    options.fxBackgroundOff.add(this.fxBackgroundOff, this);
    options.loadNewLevels.add(this.loadNewLevelPack, this);
    if (!options.display.fx.particles) {
      particles.disable();
    }
  },

  /**
   * @method debugSpawns
   */
  debugSpawns: function () {
    _.each(this.level.player.spawns, function (spawn) {
      var spawnBm = game.make.bitmapData(50, 50);
      spawnBm.ctx.fillStyle = '#ff93ff';
      spawnBm.ctx.beginPath();
      spawnBm.ctx.lineWidth = 1;
      spawnBm.ctx.arc(25, 25, 25, 0, Math.PI * 2, true);
      spawnBm.ctx.closePath();
      spawnBm.ctx.fill();
      var spawnSpr = game.add.sprite(spawn.x, spawn.y, spawnBm);
      spawnSpr.anchor.setTo(0.5);
      spawnSpr.alpha = 0.2;
    });
  },

  /**
   * @method fxParticlesOff
   */
  fxParticlesOff: function () {
    particles.disable();
    this.powerStation.stopParticles();
  },

  /**
   * @method fxParticlesOn
   */
  fxParticlesOn: function () {
    particles.enable();
    this.powerStation.startParticles();
  },

  /**
   * @method fxBackgroundOn
   */
  fxBackgroundOn: function () {
    if (!this.background.enabled) {
      this.background.enable();
    }
  },

  /**
   * @method fxBackgroundOff
   */
  fxBackgroundOff: function () {
    if (this.background.enabled) {
      this.background.disable();
    }
  },

  /**
   * @method initFullscreenHandling
   */
  initFullScreenHandling: function () {
    game.scale.onFullScreenChange.add(this.fullScreenChange, this);
  },

  /**
   * @method fullScreenChange
   */
  fullScreenChange: function () {
    options.display.fullscreen = game.scale.isFullScreen;
  },

  /**
   * @mehtod initStopwatch
   */
  initStopwatch: function () {
    ui.drawStopwatch();
    this.stopwatch = new Stopwatch(ui.stopwatch);
  },

  /**
   * Gameloop
   *
   * @method update
   */
  update: function () {
    if (this.cleaning) {
      return;
    }
    this.checkPlayerInput();
    this.actorsUpdate();
    this.uiUpdate();
    this.checkGameCondition();
    if (droneManager.followOrb) {
      this.updateCamera(this.orb.sprite);
    } else {
      this.updateCamera(this.player);
    }
    if (this.uiMode || this.isGameOver) {
      ui.update(this.uiMode);
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
    if (properties.dev.stats === true) {
      var color = game.device.isMobile ? '#0000ff' : '#00ff00';
      game.debug.text(game.time.fps || '--', game.width - 50, 14, color);
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
    gameState.isGameOver = false;
    this.isGameOver = false;
    //support debug level starts
    if (gameState.cheats.startDebugLevel) {
      gameState.cheats.startDebugLevel = false;
      this.cleaning = true;
      this.nextLevel();
      return;
    }
    ui.showUser();
    if (options.gameModes.speedRun.enabled || gameState.trainingMode) {
      this.initStopwatch();
    }
    if (!properties.dev.skipIntro) {
      this.startLevelIntro();
    } else if (!properties.dev.mode) {
      this.missionStart();
    } else {
      this.initialiseDevMode();
    }
  },

  /**
   * Shows the levels complete screen
   *
   * @method levelsCompleted
   */
  levelsCompleted: function () {
    //sound.stopMusic();
    sound.playMusic("thrust-in-game1", 0.7, true);
    gameState.currentState = gameState.PLAY_STATES.COMPLETE;
    this.showCurrentScreenByState(gameState.currentState);
  },

  showPauseButton: function () {
    if (this.pauseButton) {
      this.pauseButton.visible = true;
    }
  },

  hidePauseButton: function () {
    if (this.pauseButton) {
      this.pauseButton.visible = false;
    }
  },

  /**
   * @property showCurrentScreenByState
   * @param state {String} name of gameState and also name of screen to show
   */
  showCurrentScreenByState: function (state) {
    console.log('play :: showCurrentScreenByState :: ', state);
    this.uiMode = state === gameState.PLAY_STATES.MENU || state === gameState.PLAY_STATES.OPTIONS;
    if (state === gameState.PLAY_STATES.PLAY) {
      ui.showUser();
      this.playGame();
      this.showPauseButton();
      game.controls.gotoPlayMode();
    } else {
      this.hidePauseButton();
      ui.hideUser();
      // game.controls.gotoInputMode();
    }
    var shouldFadeBackground = (
      state === gameState.PLAY_STATES.COMPLETE ||
      state === gameState.PLAY_STATES.HIGH_SCORES ||
      state === gameState.PLAY_STATES.INTERSTITIAL
    );
    ui.showScreen(state, shouldFadeBackground);
    if (state === gameState.PLAY_STATES.MENU) {
      sound.playMusic("thrust-title-theme1", 0.5, true);
      game.controls.gotoInputMode();
      ui.removeGameOver();
    }
    if (state === gameState.PLAY_STATES.HIGH_SCORES && gameState.shouldEnterHighScore) {
      ui.highscores.insertNewScore();
      gameState.shouldEnterHighScore = false;
    }
  },

  /**
   * @method menuItemSelected
   * @param itemId {String}
   */
  menuItemSelected: function (itemId) {

    switch (itemId) {
      case "play" :
        //sound.stopMusic();
        sound.playMusic("thrust-in-game1", 0.7, true);
        gameState.newPlayer();
        gameState.trainingMode = false;
        this.newGame();
        /*
        if (this.level.planetBusterMode) {
          console.warn('planetBusterMode');
          gameState.planetBusterMode = true;
        }
        */
        //this.showCurrentScreenByState(gameState.PLAY_STATES.PLAY);
        break;
      /*
      case "TRAINING" :
        gameState.newPlayer();
        gameState.trainingMode = true;
        this.restartPlayState();
        this.showCurrentScreenByState(gameState.PLAY_STATES.PLAY);
        break;
      */

      case "scores":
        this.showCurrentScreenByState(gameState.PLAY_STATES.HIGH_SCORES);
        break;
      case "options" :
        this.showCurrentScreenByState(gameState.PLAY_STATES.OPTIONS);
        break;
      case "rules" :
        this.showCurrentScreenByState(itemId);
        break;
      case "modes":
        this.showCurrentScreenByState(gameState.PLAY_STATES.OPTIONS);
        break;
      default :
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
   * @method loadNewLevelPack
   */
  loadNewLevelPack: function () {
    this.clearPlayWorld();
    game.state.start('load', true, true);
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
    options.dispose();
    this.clearPlayWorld();
    gameState.nextLevelCheck();
    game.state.restart();
    //this.restartLevel();

  },

  restartLevel: function () {
    this.level = levelManager.currentLevel;
    game.world.setBounds(0, 0, this.level.world.width, this.level.world.height);
    this.createActors();
    this.createLevelMap();
    //this.createUi();
    this.createGroupLayering();
    this.playGame();
  },

  /**
   * @method clearPlayWorld
   */
  clearPlayWorld: function () {
    this.limpetGuns = [];
    this.fuels = [];
    if (this.orb) {
      this.orb.dispose();
      this.orb = null;
    }
    if (this.tractorBeam) {
      this.tractorBeam.dispose();
      this.tractorBeam = null;
      this.player.tractorBeam = null;
    }
    //game.controls.destroy();
    this.groups.background.removeAll(true);
    this.groups.actors.removeAll(true);
    this.groups.fuels.removeAll(true);
    this.groups.enemies.removeAll(true);
    this.groups.terrain.removeAll(true);
  },

  newGame: function() {
    levelManager.newGame();
    gameState.currentState = gameState.PLAY_STATES.PLAY;
    this.restartPlayState();

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
    if (gameState.trainingMode) {
      this.createMissionDialog();
    } else {
      if (options.gameModes.speedRun.enabled) {
        this.startSpeedRun();
      }
      this.playerStart();
    }
  },

  /**
   * @method startSpeedRun
   */
  startSpeedRun: function () {
    this.stopwatch.start(ui.stopwatch);
  },

  /**
   * @method playerStart
   */
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
    if (game.controls.useExternalJoypad) {
      this.player.checkPlayerControlJoypad();
    }
    this.player.checkPlayerControl(this.cursors);
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
      if (this.player.y < 150 * this.player.scale.x && this.player.inGameArea) {
        this.player.inGameArea = false;
        this.inPlay = false;
        this.player.stop();
        if (this.orb) {
          this.orb.stop();
        }
        console.log('play :: ui.countdown.stop');
        ui.countdown.stop();
        sound.playSound(sound.PLAYER_TELEPORT_OUT);
        this.player.levelExit();
        this.stopStopwatch();
        //@deprecated traningMode
        if (gameState.trainingMode) {
          droneManager.trainingComplete();
          gameState.playTime = this.stopwatch.getText();
        }
        particles.playerTeleport(this.player.x, this.player.y, this.player.scale.x, _.bind(this.levelTransition, this));
        if (this.tractorBeam && this.tractorBeam.hasGrabbed) {
          gameState.bonuses.orbRecovered = true;
          this.tractorBeam.breakLink();
          particles.orbTeleport(this.orb.sprite.x, this.orb.sprite.y, this.orb.scale);
        }
      }
    }
  },

  /**
   * @method checkGameOver
   */
  checkGameOver: function () {
    if (gameState.isGameOver && !this.isGameOver) {
      this.isGameOver = true;
      ui.showGameOver();
      sound.playSound(sound.UI_GAME_OVER);
      game.time.events.add(2000, _.bind(this.gameOver, this));
    }
  },
  /**
   * @method levelTransition
   */
  levelTransition: function () {
    var hasOrb = this.tractorBeam ? true : false;
    this.player.tweenOutAndRemove(hasOrb);
    game.time.events.add(1000, _.bind(this.levelInterstitialStart, this));
  },

  /**
   * @method levelInterstitialStart
   */
  levelInterstitialStart: function () {
    gameState.currentState = gameState.PLAY_STATES.INTERSTITIAL;
    ui.showScreen(gameState.currentState, true);
  },

  /**
   * Game Over Signal handler
   *
   * @method gameOver
   */
  gameOver: function () {
    console.warn('play :: gameOver called');
    ui.countdown.stop();
    this.stopStopwatch();
    if (gameState.trainingMode) {
      gameState.trainingMode = false;
      gameState.currentState = gameState.PLAY_STATES.MENU;
      gameState.newGame();
    } else {
      gameState.currentState = gameState.PLAY_STATES.HIGH_SCORES;
      if (gameState.isGameOver) {
        //gameState.newGame();
        gameState.doHighScoreCheck();
      }
    }
    this.restartPlayState();
  },

  /**
   * @method stopStopwatch
   */
  stopStopwatch: function () {
    if (options.gameModes.speedRun.enabled) {
      this.stopwatch.stop();
    }
  },

  /**
   * Filter gameloop to actors
   *
   * @method actorsUpdate
   */
  actorsUpdate: function () {
    this.player.update();
    if (this.tractorBeam) {
      this.tractorBeam.update();
    }
    if (this.powerStation) {
      this.powerStation.update();
    }
    this.checkForFuelDistance();
    this.groups.enemies.forEachAlive(function (enemy) {
      enemy.setPower(this.powerStation.health);
      enemy.update();
    }, this);
    if (this.background && this.background.enabled) {
      this.background.update();
    }
    if (this.map && levelManager.endlessData.blink) {
      this.map.update();
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
    ui.score.update(gameState.score, true);
    ui.fuel.update(gameState.fuel, true);
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
   * @todo refactor.
   * @todo simplify training/normal level creation
   *
   * create game actors, group and collision initialisation
   * game.e2e exposes actors to window, allowing actor control in e2e tests.
   *
   * @method createActors
   */
  createActors: function () {
    this.collisions = new Collisions();
    this.groups = new Groups(this.collisions);
    if (properties.drawBackground) {
      this.background = new Background(this.level, this.groups);
    }
    particles.create();
    this.player = new Player(this.collisions, this.groups);
    this.player.onKilled.add(this.playerKilled, this);
    this.player.earlyInterstitial.add(this.earlyInterstitial, this);

    if (this.level.orb) {
      this.orb = new Orb(this.groups, this.level.orb.x, this.level.orb.y, this.collisions, this.level.orb.scale);
      this.orb.setPlayer(this.player);
      this.tractorBeam = new TractorBeam(this.orb, this.player, this.groups);
      this.player.setTractorBeam(this.tractorBeam);
      this.orbHolder = new PhysicsActor(
        this.collisions,
        this.groups,
        'combined',
        'orb-holder.png',
        this.level.orbHolder.x,
        this.level.orbHolder.y
      );
      this.orbHolder.scale.setTo(this.level.orbHolder.scale);
    }
    if (!gameState.trainingMode) {
      _.each(this.level.enemies, _.bind(this.createLimpet, this));
      _.each(this.level.fuels, _.bind(this.createFuel, this));
      if (this.level.powerStation) {
        this.powerStation = new PowerStation(
          this.collisions,
          this.groups,
          'combined',
          'power-station_001.png',
          this.level.powerStation.x,
          this.level.powerStation.y,
          this.level.powerStation.scale
        );
        this.powerStation.initPhysics('powerStationPhysics', 'power-station');
        this.powerStation.destructionSequenceActivated.add(this.startDestructionSequence, this);
        this.powerStation.body.setCollisionGroup(this.collisions.terrain);
        this.powerStation.initCollisions();
      }
      this.createMainPhysics();
    } else {
      this.createTrainingDrones();
      this.createTrainingPhysics();
    }
    this.cameraPos.x = this.player.x;
    this.cameraPos.y = this.player.y;
    game.e2e.player = this.player;
    game.e2e.enemies = this.limpetGuns;

    this.cleaning = false;

    if (game.device.webApp) {
      var bmd = game.make.bitmapData(50, 50);
      bmd.rect(0, 0, 50, 50, 'rgba(255,0,0,1)');
      var testFlag = game.add.sprite(0, 0, bmd);
      testFlag.fixedToCamera = true;
    }

  },

  /**
   * @method createMainPhysics
   */
  createMainPhysics: function () {
    if (this.orb) {
      //this.collisions.set(this.orb.sprite, [this.collisions.players, this.collisions.terrain, this.collisions.enemyBullets]);
      if (this.powerStation) {
        this.collisions.set(this.powerStation, [this.collisions.players, this.collisions.orb]);
      }
    }
  },

  /**
   * @method createTrainingPhysics
   */
  createTrainingPhysics: function () {
    if (this.orb) {
      this.collisions.set(this.orb.sprite, [this.collisions.players, this.collisions.terrain]);
    }
  },

  createLevelMap: function () {
    this.map = new MapAtlas(this.groups.terrain, this.level, 'combined', this.level.useAtlas);
    this.map.init();
    this.map.initPhysics(this.collisions);
    _.each(this.level.switches, _.bind(this.createSwitch, this));
  },

  /**
   * @method createMissionDialog
   */
  createMissionDialog: function () {
    ui.missionDialog.render(function () {
      this.playerStart();
      //this.stopwatch = new Stopwatch(ui.stopWatch);
      this.startSpeedRun();
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
    console.log('startDestructionSequence');
    ui.countdown.start();
    gameState.bonuses.planetBuster = true;
  },

  stopDestructSequence: function () {
    console.log('stopDestructionSequence');
    //todo countdown
    ui.countdown.stop();
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
   * Removes
   *
   * @method removePlanet
   */
  removePlanet: function () {
    if (gameState.lives <= 0) {
      this.planetDeathTl.kill();
      game.camera.resetFX();
      gameState.isGameOver = true;
    }
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
  randomExplosions: function () {
    var numExplosions = 30;
    var duration = 2000;
    var pos = new Phaser.Point(
      Math.random() * (game.camera.x + game.camera.width),
      Math.random() * (game.camera.y + game.camera.height)
    );
    particles.explode(pos.x, pos.y);
    sound.playSound(sound.LIMPET_EXPLODE);
    this.explosionsTimer = game.time.events.loop(duration / numExplosions, function () {
      var pos = new Phaser.Point(
        Math.random() * (game.camera.x + game.camera.width),
        Math.random() * (game.camera.y + game.camera.height)
      );
      particles.explode(pos.x, pos.y);
      sound.playSound(sound.PLAYER_EXPLOSION);
    }, this);
  },

  /**
   * @method destroyPlayer
   */
  destroyPlayer: function () {
    if (!gameState.cheats.infiniteLives) {
      gameState.lives--;
    }
    this.player.stop();
    this.player.explosion(true);
  },

  /**
   * @method fadeToWhite
   */
  fadeToWhite: function () {
    game.time.events.remove(this.explosionsTimer);
    game.camera.fade(0xffffff, 740, true);
  },

  /**
   * Creates the user interface and touch controls
   * @todo investigate memory leak in stuff added here
   * @method createUi
   */
  createUi: function () {
    var style = {font: "16px thrust_regular", fill: "#ffffff", align: "center", backgroundColor: 'black'};

    if (this.uiPaused) {
      this.uiPaused.destroy();
    }
    this.uiPaused = game.add.text(game.width / 2, game.height / 2, "GAME PAUSED", style);
    this.uiPaused.anchor.setTo(0.5);
    this.uiPaused.fixedToCamera = true;
    this.uiPaused.visible = false;

    if (features.isTouchScreen) {
      if (this.pauseButton) {
        this.pauseButton.destroy();
      }
      this.pauseButton = game.add.button(game.width - 10, 10, "combined", this.onPauseClick, this, 'pause-button.png', 'pause-button.png');
      this.pauseButton.anchor.setTo(1, 0);
      this.pauseButton.fixedToCamera = true;
      this.pauseButton.visible = false;
    }
    ui.init(this.menuItemSelected, this);
    if (game.controls.useVirtualJoypad && !game.controls.useExternalJoypad) {
      //game.controls.initVirtualJoypad();
      game.controls.initAdvancedTouchControls();
    }
    if (gameState.trainingMode) {
      //ui.drawTrainingUi();
    }
    ui.countdown.complete.add(this.countdownComplete, this);
  },

  onPauseClick: function () {
    this.escPressed();
    this.pauseButton.onInputUp.remove(this.onPauseClick, this);
    game.input.onDown.add(this.resume, this);
  },

  resume: function () {
    this.escPressed();
    this.pauseButton.onInputUp.add(this.onPauseClick, this);
    game.input.onDown.remove(this.resume, this);
  },

  /**
   * @method createSwitch
   * @param data
   */
  createSwitch: function (data) {
    var gateSwitch = new Switch(this.collisions, this.groups, this.map, data.x, data.y, data.rotation, data.gateDuration, data.scale);
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
    var limpet = new Limpet(this.collisions, this.groups, data.x, data.y, data.rotation, this.player, data.scale);
    limpet.enemiesDestroyed.add(this.allEnemiesDestroyed, this);
    this.limpetGuns.push(limpet);
  },

  allEnemiesDestroyed: function () {
    this.map.allEnemiesDetroyed();
  },

  playerKilled: function () {
    this.stopDestructSequence();
    console.warn('play :: playerKilled lives=', gameState.lives);
    if (gameState.lives === 0 && this.stopwatch) {
      console.warn('hide stopwatch');
      this.stopStopwatch();
      ui.stopwatch.shiftDown();
      //todo tween gameover
    }
  },

  earlyInterstitial: function () {
    this.levelInterstitialStart();
  },

  /**
   * Create a fuel collectible
   *
   * @method createFuel
   * @param data
   */
  createFuel: function (data) {
    var fuel = new Fuel(this.collisions, this.groups, 'combined', 'fuel.png', data.x, data.y, this.player, data.scale);
    this.fuels.push(fuel);
  },

  /**
   * Layer group z-index
   *
   * @method createGroupLayering
   */
  createGroupLayering: function () {
    if (this.powerStation) {
      this.groups.actors.add(this.powerStation);
    }
    if (this.orbHolder) {
      this.groups.actors.add(this.orbHolder);
    }
    this.groups.swapTerrain();
    if (!gameState.trainingMode) {
      _.each(this.switches, _.bind(function (gateSwitch) {
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
   * Maybe move out control initialisation and handling to
   * tidy up play state
   *
   * @method initControls
   */
  initControls: function () {
    if (game.controls.useVirtualJoypad && !game.controls.useExternalJoypad) {
      //game.controls.buttonA.onDown.add(this.pressButtonA, this);
      //game.controls.buttonA.onUp.add(this.upButtonA, this);
      //game.controls.buttonB.onDown.add(this.pressButtonB, this);
      //game.controls.buttonB.onUp.add(this.upButtonB, this);
      //game.controls.fireButtonDown.add(this.pressButtonA, this);
      //game.controls.fireButtonUp.add(this.upButtonA, this);
    }
    if (game.controls.useKeys || game.controls.useVirtualJoypad) {
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
  escPressed: function () {
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