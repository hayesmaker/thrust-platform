/**
 * Defines build settings for the thrust-engine
 *
 * @namespace thrust-engine
 * @module properties
 * @class
 * @static
 * @type {{enableJoypad: boolean, fatalCollisions: boolean, scale: {mode: number}, drawStats: boolean}}
 */
module.exports = {
  debugPhysics: false,
  debugPositions: false,
  collideWorldBounds: true,
  enableJoypad: false,
  fatalCollisions: true,
  scale: {
    mode: Phaser.ScaleManager.NO_SCALE
  },
  stats: false,
  drawBackground: true,
  width: 700,
  height: 500,
  gamePlay: {
    freeOrbLocking: false,
    autoOrbLocking: true,
    tractorBeamLength: 80,
    tractorBeamVariation: 10,
    lockingDuration: 900,
    parallax: true
  },
  mapSuffix: '-map',
  levels: [
    {
      mapImgUrl: 'assets/levels/level-1.png',
      mapImgKey: 'level-1',
      mapDataUrl: 'assets/levels/level-1.json',
      mapDataKey: 'moo',
      mapScale: 2,
      world: {width: 1536, height: 1250},
      startPosition: {x: 250, y: 650},
      mapPosition: {x: 0, y: 140},
      orbPosition: {x: 950, y: 1100},
      enemies: [
        {
          x: 705,
          y: 1110,
          rotation: 30
        }
      ],
      enemyFireRate: 1000
    },
    {
      mapImgUrl: 'assets/levels/level-2.png',
      mapImgKey: 'level-2',
      mapDataUrl: 'assets/levels/level-2.json',
      mapDataKey: 'level-2',
      mapScale: 2,
      world: {width: 1536, height: 1250},
      startPosition: {x: 250, y: 650},
      mapPosition: {x: 0, y: 140},
      orbPosition: {x: 950, y: 1100},
      enemies: [
        {
          x: 705,
          y: 1110,
          rotation: 30
        }
      ],
      enemyFireRate: 1000
    },
    {
      mapImgUrl: 'assets/levels/level_6_x2.png',
      mapImgKey: 'thrustmapImage',
      mapDataUrl: 'assets/levels/level_6.json',
      mapDataKey: 'thrustmap',
      world: {width: 3072, height: 4000},
      startPosition: {x: 0, y: 0},
      mapPosition: {x: 0, y: 500},
      orbPosition: {x: 1000, y: 1000},
      enemyFireRate: 1000
    }
  ]
};
