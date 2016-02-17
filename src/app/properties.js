/**
 * > Defines some build settings and the level data
 * required for a game of Thrust.
 * > add levels by increasing the levels Array with more level objects
 *
 * @namespace thrust-engine
 * @module properties
 * @class
 * @static
 * @type {Object}
 */
module.exports = {
  debugPhysics: false,
  debugPositions: false,
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
    skipIntro: true,
    skipSplashScreen: true
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
        mapImgUrl: 'assets/levels/thrust-level2.png',
        mapImgKey: 'level2map',
        mapDataUrl: 'assets/levels/thrust-level2.json',
        mapDataKey: 'thrustmap',
        mapScale: 2,
        world: {
          width: 1856,
          height: 2000
        },
        mapPosition: {
          x: 0,
          y: 660
        },
        startPosition: {
          x: 250,
          y: 300
        },
        orbPosition: {
          x: 930,
          y: 1895
        },
        orbHolder: {
          x: 930,
          y: 1930
        },
        enemies: [
          {
            x: 880,
            y: 1620,
            rotation: 150
          },
          {
            x: 1455,
            y: 1550,
            rotation: 210
          }
        ],
        fuels: [
          {
            x: 1178,
            y: 1930
          }
        ],
        enemyFireRate: 500,
        powerStation: {
          x: 660,
          y: 875
        }
      }
    ]

  }
};
