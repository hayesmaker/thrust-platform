'use strict';

var Phaser = global.Phaser;

/**
 * Defines build settings for the thrust-platform
 * - Includes Level Data
 *
 * @namespace thrust-platform
 * @class properties
 * @static
 * @type {Object}
 */
module.exports = {
  backgroundColour: 0x000817,
  collideWorldBounds: true,
  enableTouchPad: false,
  enableJoyPad: false,
  fatalCollisions: true,
  drawBackground: true,
  width: 800,
  height: 500,
  scale: {
    bestFit: true,
    hires: true,
    web: Phaser.ScaleManager.NO_SCALE,
    device: Phaser.ScaleManager.NO_SCALE
  },
  dev: {
    mode: false,
    debugPhysics: false,
    debugPositions: false,
    stats: true,
    skipIntro: false,
    skipSplashScreen: true
  },
  gamePlay: {
    firingMagnitude: 350,
    tractorBeamLength: 100,
    tractorBeamVariation: 10,
    lockingDuration: 800,
    parallax: true,
    freeOrbLocking: false,
    autoOrbLocking: true
  },
  mapSuffix: '-map',
  actors: {
    key: 'combined'
  },
  levels: {
    training: {
      mapImgUrl: 'assets/levels/training.png',
      mapImgKey: 'training',
      mapDataUrl: 'assets/physics/training.json',
      mapDataKey: 'training',
      mapScale: 2,
      useAtlas: false,
      mapPosition: {
        x: 0,
        y: 1700
      },
      missionSwipe: {
        title: 'Flight Training',
        desc: 'Welcome to flight training pilot',
        color: "rgba(124, 255, 0, 0.7)"
      },
      world: {
        width: 3000,
        height: 3000
      },
      spawns: [{
        x: 1500,
        y: 1550,
        orb: false
      }],
      orbPosition: {x: 2600, y: 1732},
      orbHolder: {x: 2600, y: 1770}
    },
    startLevel: 1
  }
};
