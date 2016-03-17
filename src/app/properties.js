/**
 * ## Defines essential build settings required for a "Thrust" game.
 * > Add levels by increasing the `levels` Array with more level objects
 *
 * @namespace thrust-engine
 * @class properties
 * @type {Object}
 * @static
 */
module.exports = {
  debugPhysics: false,
  debugPositions: false,
  collideWorldBounds: true,
  enableJoypad: false,
  fatalCollisions: true,
  stats: false,
  drawBackground: true,
  width: 800,
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
          title: 'Mission 2',
          desc: 'Recover the orb',
          color: "rgba(255, 0, 0, 0.7)"
        },
        mapImgUrl: 'assets/levels/level-2.png',
        mapImgKey: 'level-2',
        mapDataUrl: 'assets/levels/level-2.json',
        mapDataKey: 'level-2',
        mapScale: 2,
        world: {width: 1536, height: 1800},
        mapPosition: {x: 0, y: 400},
        startPosition: {x: 250, y: 0},
        orbPosition: {x: 730, y: 1595},
        orbHolder: {
          x: 730,
          y: 1625
        },
        enemies: [
          {
            x: 675,
            y: 1295,
            rotation: 152
          },
          {
            x: 1055,
            y: 1200,
            rotation: 207
          }
        ],
        fuels: [
          {
            x: 820,
            y: 1625
          }
        ],
        enemyFireRate: 500,
        powerStation: {
          x: 600,
          y: 715
        }
      }
    ]

  }
};
