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
function Background() {
	this.sprite = game.make.tileSprite(0, 0, 700, 500, 'stars');
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

	if (properties.drawMountains) {
		this.mountains = game.add.sprite(0, 700);
		graphics = new Phaser.Graphics(game, 0,0);
		graphics.lineStyle(2, 0xffffff, 0.7);
		var groundWidth = 2000;
		var peakW = 200;
		var peakH = 100;
		var up = true;
		var i;
		for (i = 0; i < groundWidth; i++) {
			if (i % peakW === 0) {
				graphics.lineTo( peakW + i, up? -Math.random() * peakH : 0 );
				up = !up;
			}
		}
		this.mountains.addChild(graphics);
	}
};

p.update = function() {
	this.sprite.tilePosition.set(-game.camera.x * 0.1, -game.camera.y * 0.1);
	//this.sprite2.tilePosition.x -= game.camera.x;
};


module.exports = Background;