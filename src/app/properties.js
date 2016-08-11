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
  /**
   * @deprecated
   */
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
  levels: {
    training: {
      mapImgUrl: 'assets/levels/training.png',
      mapImgKey: 'training',
      mapDataUrl: 'assets/levels/training.json',
      mapDataKey: 'training',
      mapScale: 2,
      mapPosition: {
        x: 0,
        y: 500
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
        y: 1500,
        orb: false
      }],
      orbPosition: {x: 2600, y: 1732},
      orbHolder: {x: 2600, y: 1770}
    },
    startLevel: 1,
    data: [
      {
        missionSwipe: {
          title: 'Mission 1',
          desc: 'Recover the orb',
          color: "rgba(255, 0, 0, 0.7)"
        },
        mapImgUrl: 'assets/levels/level-1.png',
        mapImgKey: 'level-1',
        mapDataUrl: 'assets/levels/level-1.json',
        mapDataKey: 'level-1',
        mapScale: 2,
        world: {
          width: 1536,
          height: 1000
        },
        mapPosition: {
          x: 0,
          y: 150
        },
        spawns: [{
          x: 500,
          y: 500,
          orb: false
        }],
        startPosition: {
          x: 0,
          y: -50
        },
        orbPosition: {x: 915, y: 852},
        orbHolder: {
          x: 915,
          y: 890
        },
        enemies: [
          {
            x: 705,
            y: 869,
            rotation: 30
          }
        ],
        fuels: [
          {
            x: 550,
            y: 816
          }
        ],
        enemyFireRate: 400,
        powerStation: {
          x: 1100,
          y: 800
        }
      }
    ]

  }
};
