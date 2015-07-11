var properties = require('../properties');
var Turret = require('./Turret');
var SpreadFiring = require('./strategies/SpreadFiring');
/**
 * LimpetGun description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @param x
 * @param y
 * @param angleDeg
 * @param collisions
 * @param groups
 * @class LimpetGun
 * @constructor
 */
function LimpetGun(x, y, angleDeg, collisions, groups) {

	this.collisions = collisions;

	this.groups = groups;

	var bmd = game.make.bitmapData(50, 25);
	bmd.ctx.strokeStyle = '#ffffff';
	bmd.ctx.lineWidth = 2;
	bmd.ctx.beginPath();
	bmd.ctx.moveTo( 5, 15);
	bmd.ctx.lineTo(45, 15);
	bmd.ctx.lineTo(50, 25);
	bmd.ctx.lineTo(43, 20);
	bmd.ctx.lineTo( 3, 20);
	bmd.ctx.lineTo( 0, 25);
	bmd.ctx.lineTo( 5, 15);
	bmd.ctx.arc(25,15,12, 0, Math.PI, true);
	bmd.ctx.closePath();
	bmd.ctx.stroke();

	Phaser.Sprite.call(this, game, x, y, bmd);

	this.angle = angleDeg;

	this.fireRate = 10 / 1800;

	this.init();
}

var p = LimpetGun.prototype = Object.create(Phaser.Sprite.prototype);
p.constructor = LimpetGun;

/**
 * LimpetGun initialisation
 *
 * @method init
 */
p.init = function() {

	game.physics.p2.enable(this, properties.debugPhysics);

	this.body.clearShapes();
	this.body.addRectangle(50, 25, 0,0);
	this.body.rotation = game.math.degToRad(this.angle);
	this.body.fixedRotation = true;

	this.body.setCollisionGroup(this.collisions.enemies);

	this.body.motionState = 2;

	this.turret = this.createTurret();
};

p.createTurret = function() {
	var bulletBitmap = game.make.bitmapData(5,5);
	bulletBitmap.ctx.fillStyle = '#ffffff';
	bulletBitmap.ctx.beginPath();
	bulletBitmap.ctx.arc(0, 0, 5, 0, Math.PI*2, true);
	bulletBitmap.ctx.closePath();
	bulletBitmap.ctx.fill();

	return new Turret(this.groups, this, new SpreadFiring(this, this.collisions, this.groups, bulletBitmap, 350));
};

p.fire = function() {
	this.turret.fire();
};

p.update = function() {
	if (Math.random() < this.fireRate) {
		this.fire();
	}
	this.turret.update();
};


module.exports = LimpetGun;