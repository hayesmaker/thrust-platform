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
      mapPosition: {x: 0, y: 140},
      startPosition: {x: 250, y: 650},
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
      world: {width: 1536, height: 1800},
      mapPosition: {x: 0, y: 400},
      startPosition: {x: 250, y: 0},
      orbPosition: {x: 730, y: 1620},
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
      enemyFireRate: 1000
    },
    {
      mapImgUrl: 'assets/levels/level-3.png',
      mapImgKey: 'level-3',
      mapDataUrl: 'assets/levels/level-3.json',
      mapDataKey: 'level-3',
      mapScale: 2,
      world: {width: 1920, height: 3000},
      mapPosition: {x: 0, y: 500},
      startPosition: {x: 250, y: 0},
      orbPosition: {x: 730, y: 1620},
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
      enemyFireRate: 1000
    },
    {
      mapImgUrl: 'assets/levels/level-4.png',
      mapImgKey: 'level-4',
      mapDataUrl: 'assets/levels/level-4.json',
      mapDataKey: 'level-4',
      mapScale: 2,
      world: {width: 1726, height: 2466},
      mapPosition: {x: 0, y: 600},
      startPosition: {x: 250, y: 0},
      orbPosition: {x: 730, y: 1620},
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
      enemyFireRate: 1000
    },
    {
      mapImgUrl: 'assets/levels/level-5.png',
      mapImgKey: 'level-5',
      mapDataUrl: 'assets/levels/level-5.json',
      mapDataKey: 'level-5',
      mapScale: 2,
      world: {width: 1920, height: 2810},
      mapPosition: {x: 0, y: 600},
      startPosition: {x: 250, y: 0},
      orbPosition: {x: 730, y: 1620},
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
      enemyFireRate: 1000
    },
    {
      mapImgUrl: 'assets/levels/level_6_x2.png',
      mapImgKey: 'thrustmapImage',
      mapDataUrl: 'assets/levels/level_6.json',
      mapDataKey: 'thrustmap',
      world: {width: 3072, height: 4000},
      mapPosition: {x: 0, y: 500},
      startPosition: {x: 0, y: 0},
      orbPosition: {x: 1000, y: 1000},
      enemyFireRate: 1000
    }
  ]
};
