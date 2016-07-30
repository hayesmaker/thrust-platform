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
  collideWorldBounds: true,
  enableTouchPad: false,
  enableJoyPad: false,
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
    debugPhysics: true,
    debugPositions: true,
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
    training: {
      missionSwipe: {
        title: 'Flight Training',
        desc: 'Fly through the highlighted training pods',
        color: "rgba(255, 0, 0, 0.7)"
      },
      world: {
        width: 1920,
        height: 1200
      },
      spawns: [{
        x: 500,
        y: 500,
        orb: false
      }],
      orbPosition: {x: 915, y: 852}
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
