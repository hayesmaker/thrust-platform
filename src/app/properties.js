/**
 * Defines build settings for the thrust-engine
 *
 * @namespace thrust-engine
 * @module properties
 * @class
 * @static
 * @type {Object}
 */
module.exports = {
  collideWorldBounds: true,
  enableTouchPad: false,
  enableJoyPad: false,
  /**
   * @deprecated
   */
  fatalCollisions: true,
  /**
   * @deprecated
   */
  drawBackground: true,
  width: 800,
  height: 500,
  scale: {
    /**
     * @deprecated
     */
    bestFit: true,
    hires: true,
    web: Phaser.ScaleManager.NO_SCALE,
    device: Phaser.ScaleManager.NO_SCALE
  },
  dev: {
    debugPhysics: false,
    debugPositions: false,
    stats: true,
    mode: false,
    skipIntro: false,
    skipSplashScreen: false
  },
  gamePlay: {
    firingMagnitude: 350,
    tractorBeamLength: 85,
    tractorBeamVariation: 10,
    lockingDuration: 800,
    parallax: true,
    freeOrbLocking: false,
    autoOrbLocking: true
  },
  mapSuffix: '-map',
  levels: {
    startLevel: 1  ,
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
        missionSwipe: {
          title: 'Mission 2',
          desc: 'Recover the orb',
          color: "rgba(62, 217, 42, 0.7)"
        },
        mapImgUrl: 'assets/levels/level-2.png',
        mapImgKey: 'level-2',
        mapDataUrl: 'assets/levels/level-2.json',
        mapDataKey: 'level-2',
        mapScale: 2,
        world: {width: 1536, height: 2000},
        mapPosition: {x: 0, y: 600},
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
      },
      {
        missionSwipe: {
          title: 'Mission 3',
          desc: 'Recover the orb',
          color: "rgba(29, 192, 222, 0.7)"
        },
        mapImgUrl: 'assets/levels/level-3.png',
        mapImgKey: 'level-3',
        mapDataUrl: 'assets/levels/level-3.json',
        mapDataKey: 'level-3',
        mapScale: 2,
        world: {width: 1920, height: 3000},
        mapPosition: {x: 0, y: 600},
        startPosition: {x: 250, y: 0},
        powerStation: {
          x: 1440,
          y: 700
        },
        orbPosition: {x: 408, y: 2220},
        orbHolder: {
          x: 408,
          y: 2255
        },
        enemies: [
          {
            x: 1030,
            y: 1200,
            rotation: 155
          },
          {
            x: 1635,
            y: 1255,
            rotation: 327
          },
          {
            x: 550,
            y: 1488,
            rotation: 150
          },
          {
            x: 357,
            y: 1678,
            rotation: 152
          },
          {
            x: 600,
            y: 1840,
            rotation: 327
          }
        ],
        fuels: [
          {
            x: 912,
            y: 569
          },
          {
            x: 1370,
            y: 1265
          },
          {
            x: 1440,
            y: 1265
          },
          {
            x: 1510,
            y: 1265
          },
          {
            x: 1080,
            y: 1602
          },
          {
            x: 745,
            y: 1791
          }
        ],
        enemyFireRate: 600
      }
    ]

  }
};
