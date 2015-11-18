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
  collideWorldBounds: true,
  enableJoypad: false,
  fatalCollisions: true,
  scale: {
    mode: Phaser.ScaleManager.NO_SCALE
  },
  stats: true,
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
  levels: [
    {
      mapImgUrl: 'assets/levels/level_6_x2.png',
      mapImgKey: 'thrustmap',
      mapDataUrl: 'assets/levels/level_6.json',
      mapDataKey: 'physicsData',
      world: {width: 3072, height: 4000},
      mapPosition: {x: 0, y: 2000},
      orbPosition: {x: 1000, y: 1000},
      enemies: [
        {x: 1200, y: 1200, rotation: 100},
        {x: 500, y: 500, rotation: 100}
      ],
      enemyFireRate: 1000
    }
  ]
};
