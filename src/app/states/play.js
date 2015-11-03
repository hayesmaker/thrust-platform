//imports
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
/**
 * The play state - this is where the magic happens
 *
 * @namespace states
 * @module play
 * @type {Phaser.State}
 */
module.exports = {

  preload: function () {
    level = levelManager.currentLevel;
    console.warn('Preloading level:', levelManager.levelIndex + 1, levelManager.currentLevel);
    if (game.controls.isJoypadEnabled) {
      game.load.atlas('dpad', 'assets/images/virtualjoystick/skins/dpad.png', 'assets/images/virtualjoystick/skins/dpad.json');
    }
    game.load.image('stars', 'assets/images/starfield.png');
    _.each(levelManager.levels, this.loadMapData, this);
    game.load.image('player', 'assets/actors/player.png');
    game.load.physics('playerPhysics', 'assets/actors/player.json');
  },

  loadMapData: function(level) {
    game.load.image(level.mapImgKey, level.mapImgUrl);
    game.load.physics(level.mapDataKey, level.mapDataUrl);
  },

  create: function () {
    this.defineWorldBounds();
    this.createActors();
    this.createUi();
    this.createGroupLayering();

    ui.missionSwipe.missionStartSwipeIn(this.missionStart, this);
  },

  missionStart: function() {
    player.start();
    _.each(limpetGuns, function(limpet) {
      limpet.start();
    });
    this.initControls();

  },

  update: function () {
    if (game.stats) {
      game.stats.end();
    }
    this.checkPlayerInput();
    this.actorsUpdate();
    this.checkGameCondition();
    if (game.stats) {
      game.stats.end();
    }
  },

  render: function () {
    if (properties.drawStats) {
      game.debug.cameraInfo(game.camera, 500, 20);
    }
  },

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
      player.body.thrust(400);
    }
    if (!tractorBeam.hasGrabbed) {
      if (isXDown || properties.gamePlay.autoOrbLocking) {
        player.checkOrbDistance();
      }
    } else {
      tractorBeam.drawBeam(player.position);
    }
  },

  checkGameCondition: function() {

  },

  actorsUpdate: function () {
    if (!player.isDead) {
      player.update();
      //console.log('player.y', player.y);
      groups.enemies.forEach(function (enemy) {
        enemy.update();
      });
    }
    if (background && properties.gamePlay.parallax) {
      background.update();
    }
  },

  defineWorldBounds: function () {
    game.world.setBounds(0, 0, level.world.width, level.world.height);
    this.cameraGroup = new Camera(game);
    //this.cameraGroup.zoomTo(2);
  },

  createActors: function () {

    groups = new Groups(this.cameraGroup);
    collisions = new Collisions();
    if (properties.drawBackground) {
      background = new Background();
    }
    player = new Player(game.width / 2, game.height /   2, collisions, groups);
    orb = new Orb(level.orbPosition.x, level.orbPosition.y, collisions);
    tractorBeam = new TractorBeam(orb, player);
    player.setTractorBeam(tractorBeam);
    _.each(level.enemies, this.createLimpet, this);
    map = new Map(level.mapPosition.x, level.mapPosition.y, collisions);
    game.camera.follow(player);

    collisions.set(orb.sprite, [collisions.players, collisions.terrain, collisions.enemyBullets]);
    collisions.set(map, [collisions.players, collisions.terrain, collisions.bullets, collisions.orb]);

    //expose key elements to window for e2e testing
    game.e2e = {
      player: player,
      map: map,
      enemies: limpetGuns
    };
  },

  createUi: function() {
    game.controls.initJoypad();
    ui.init();
    ui.missionSwipe.init(0, game.height * 0.15, game.width * 0.7, 80, ui.group);



  },

  createLimpet: function(data) {
    var limpet = new LimpetGun(data.rotation, data.x, data.y, collisions, groups);
    limpetGuns.push(limpet);
  },

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
    _.each(limpetGuns, function(limpet) {
      limpet.init();
    });
  },

  pressButtonA: function () {
    buttonADown = true;
  },

  upButtonA: function () {
    buttonADown = false;
  },

  pressButtonB: function () {
    buttonBDown = true;
    player.fire();
  },

  upButtonB: function () {
    buttonBDown = false;
  },

  xDown: function () {
    isXDown = true;
    //limpet1.fire();
  },

  xUp: function () {
    isXDown = false;
    if (!properties.gamePlay.autoOrbLocking) {
      tractorBeam.lockingRelease();
    }
  }
};
