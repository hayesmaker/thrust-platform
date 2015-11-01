//imports
var properties = require('../properties');
var Collisions = require('../environment/Collisions');
var Groups = require('../environment/Groups');
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
    console.log('currentLevel::', level);
    this.defineWorldBounds();
    this.createActors();
    this.createGroupLayering();
    this.initControls();
  },

  update: function () {
    this.beginStats();
    this.checkPlayerInput();
    this.actorsUpdate();
    this.checkGameCondition();
    this.endStats();
  },

  render: function () {
    if (properties.drawStats) {
      game.debug.cameraInfo(game.camera, 500, 20);
    }
  },

  checkPlayerInput: function () {
    if (player.isDead) {
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
    player.update();
    //console.log('player.y', player.y);
    groups.enemies.forEach(function (enemy) {
      enemy.update();
    });
    if (background && properties.gamePlay.parallax) {
      background.update();
    }
  },

  defineWorldBounds: function () {
    var gameWorld = {width: 3072, height: 4000};
    game.world.setBounds(0, 0, gameWorld.width, gameWorld.height);
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
  },

  initControls: function () {
    if (game.controls.isJoypadEnabled) {
      game.controls.initJoypad();
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
  },

  beginStats: function () {
    if (properties.drawStats) {
      game.stats.start();
    }
  },

  endStats: function () {
    if (properties.drawStats) {
      game.stats.end();
    }
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
