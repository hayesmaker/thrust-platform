'use strict';

var Stats = require('Stats');

/**
 * doob stats
 *
 * @property stats
 * @type {Stats}
 * @private
 */
var stats;

/**
 * StatsModule Adds A Stats to the dom and expose the start/stop
 * methods to the game update loop.
 *
 * @class StatsModule
 * @constructor
 */
function StatsModule() {
  stats = new Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.bottom = '0px';
  document.body.appendChild(stats.domElement);
}

var p = StatsModule.prototype;

/**
 *
 * @method begin
 */
p.begin = function () {
  stats.begin();
};

/**
 * @method end
 */
p.end = function () {
  stats.end();
};


module.exports = StatsModule;
