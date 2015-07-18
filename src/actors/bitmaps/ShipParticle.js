

function ShipParticle (game, x, y) {
	var bmd = game.add.bitmapData(4,4);
	bmd.context.fillStyle = "#ffffff";
	bmd.context.fillRect(0,0,4,4);
	game.cache.addBitmapData('shipParticle', bmd);
	Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData('shipParticle'));
}

var p = ShipParticle.prototype = Object.create(Phaser.Particle.prototype);
module.exports = p.constructor = ShipParticle;