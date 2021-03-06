'use strict';

//var PIXI = global.PIXI;

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
  width: 1024,
  height: 600,
  dev: {
    mode: 0,
    debugPhysics: 0,
    debugPositions: 0,
    stats: false,
    skipIntro: 0
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
    demo: true,
    startLevel: 1
  }
};
