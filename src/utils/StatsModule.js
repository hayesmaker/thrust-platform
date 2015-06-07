var Stats = require('Stats');
var properties = require('../properties');
/**
 * A private var description
 *
 * @property stats
 * @type {Stats}
 * @private
 */
var stats;

/**
 * StatsModule description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class StatsModule
 * @constructor
 */
function StatsModule() {
	/**
	 * A public var description
	 *
	 * @property myPublicVar
	 * @type {number}
	 */
	if (properties.drawStats) {
		console.log('statto');
		stats = new Stats();
		stats.setMode(0);
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.right = '0px';
		stats.domElement.style.bottom = '0px';
		document.body.appendChild( stats.domElement );
	}
}

var p = StatsModule.prototype;

/**
 *
 * @method begin
 */
p.start = function() {
	//console.log('stats.begin');
	stats.begin();
};

/**
 * @method end
 */
p.end = function() {
	//console.log('stats.end');
	stats.end();
};


module.exports = StatsModule;
