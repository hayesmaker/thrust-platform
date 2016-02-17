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
  debugPhysics: true,
  debugPositions: true,
  collideWorldBounds: true,
  enableJoypad: false,
  fatalCollisions: true,
  stats: false,
  drawBackground: true,
  width: 700,
  height: 500,
  scale: {
    web: Phaser.ScaleManager.NO_SCALE,
    device: Phaser.ScaleManager.SHOW_ALL
  },
  dev: {
    mode: false,
    skipIntro: false,
    skipSplashScreen: false
  },
  gamePlay: {
    freeOrbLocking: false,
    autoOrbLocking: true,
    tractorBeamLength: 80,
    tractorBeamVariation: 10,
    lockingDuration: 900,
    parallax: true
  },
  mapSuffix: '-map',
  levels: {
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
        mapDataKey: 'moo',
        mapScale: 2,
        world: {
          width: 1536,
          height: 1250
        },
        mapPosition: {
          x: 0,
          y: 140
        },
        startPosition: {
          x: 250,
          y: 650
        },
        orbPosition: {x: 915, y: 1100},
        orbHolder: {
          x: 915,
          y: 1130
        },
        enemies: [
          {
            x: 705,
            y: 1110,
            rotation: 30
          }
        ],
        fuels: [
          {
            x: 550,
            y: 1055
          }
        ],
        enemyFireRate: 500,
        powerStation: {
          x: 1100,
          y: 1040
        }
      }
    ]

  }
};
