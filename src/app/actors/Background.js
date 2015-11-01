var properties = require('../properties');

/**
 *
 *
 * @type {Phaser.Graphics}
 */
var graphics;

/**
 * Background description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class Background
 * @constructor
 */
function Background(x, y) {
	this.sprite = game.make.tileSprite(x, y, 700, 500, 'stars');
	//this.sprite2 = game.make.tileSprite(0, 450, game.world.width, 512, 'stars-gradient');
	//this.sprite3 = game.make.tileSprite(0, 550, 512, 4, 'black-tile');
	this.sprite.fixedToCamera = true;
	//this.sprite3.fixedToCamera = true;

	this.init();
}

var p = Background.prototype;

/**
 * Background initialisation
 *
 * @method init
 */
p.init = function() {
	this.stars = this.sprite;
};

p.update = function() {
	this.sprite.tilePosition.set(-game.camera.x * 0.1, -game.camera.y * 0.1);
};


module.exports = Background;