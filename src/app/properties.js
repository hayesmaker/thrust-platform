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
    startLevel: 1,
    data: [
      {
        useAtlas: true,
        missionSwipe: {
          title: 'Mission 1',
          desc: 'Recover the orb',
          color: "rgba(255, 0, 0, 0.7)"
        },
        atlasData: {
          levelKey: 'level-1',
          imageKey: 'levels-atlas'
        },
        mapDataUrl: 'assets/physics/level-1.json',
        mapDataKey: 'level-1',
        mapScale: 2,
        world: {
          width: 1536,
          height: 1000
        },
        mapPosition: {
          x: 0,
          y: 730
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
      },
      {
        useAtlas: true,
        missionSwipe: {
          title: 'Mission 2',
          desc: 'Recover the orb',
          color: "rgba(62, 217, 42, 0.7)"
        },
        atlasData: {
          levelKey: 'level-2',
          imageKey: 'levels-atlas'
        },
        mapDataUrl: 'assets/physics/level-2.json',
        mapDataKey: 'level-2',
        mapScale: 2,
        world: {width: 1536, height: 2000},
        mapPosition: {x: 0, y: 740},
        spawns: [{
          x: 500,
          y: 400,
          orb: false
        }],
        startPosition: {x: 0, y: 0},
        powerStation: {
          x: 600,
          y: 825
        },
        orbPosition: {x: 730, y: 1700},
        orbHolder: {
          x: 730,
          y: 1738
        },
        enemies: [
          {
            x: 675,
            y: 1405,
            rotation: 152
          },
          {
            x: 1055,
            y: 1310,
            rotation: 207
          }
        ],
        fuels: [
          {
            x: 820,
            y: 1735
          }
        ],
        enemyFireRate: 500
      }
    ]

  }
};
