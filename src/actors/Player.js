//var game = window.game;
var properties = require('../properties');
var Turret = require('./Turret');
var utils = require('../environment/utils');

/**
 * Player description
 * calls init
 *
 * @param {Collisions} collisions - Our collisions container of collisionGroups
 * @param {Groups} groups - Our groups container
 * @class Player
 * @constructor
 */
function Player(x, y, collisions, groups) {
	/**
	 * The collisions container
	 *
	 * @property collisions
	 * @type {Collisions}
	 */
	this.collisions = collisions;

	/**
	 * The groups container
	 *
	 * @property groups
	 * @type {Groups}
	 */
	this.groups = groups;

	var bmd = game.make.bitmapData(50,50);
	bmd.ctx.strokeStyle = '#ffffff';
	bmd.ctx.lineWidth = 2;
	bmd.ctx.beginPath();
	bmd.ctx.lineTo( 20, 40);
	bmd.ctx.lineTo( 25, 40);
	bmd.ctx.arc   (  0, 40, 25, 0, game.math.degToRad(180), false);
	bmd.ctx.lineTo(-20, 40);
	bmd.ctx.lineTo(  0,  0);
	bmd.ctx.closePath();
	bmd.ctx.stroke();

	Phaser.Sprite.call(this, game, x, y, bmd);


	/*
	 var graphics = new Phaser.Graphics(game, 0,0);
	 graphics.lineStyle(4,0xffffff);
	 graphics.lineTo(20,40);
	 graphics.lineTo(25,40);
	 graphics.arc(0,40,25,game.math.degToRad(0), game.math.degToRad(180), false);
	 graphics.lineTo(-20,40);
	 graphics.lineTo(0,0);
	 this.sprite.addChild(graphics);

	 this.sprite.scale.setTo(0.3,0.3);
	 this.sprite.pivot.x = 0;
	 this.sprite.pivot.y = 40;
	 */


	/**
	 * A beam actor used by player to colect the orb
	 *
	 * @property tractorBeam
	 * @type {TractorBeam}
	 */
	this.tractorBeam = null;


	this.init();
}

var p = Player.prototype = Object.create(Phaser.Sprite.prototype);
p.constructor = Player;

/**
 *
 * @method setTractorBeam
 * @param tractorBeam
 */
p.setTractorBeam = function(tractorBeam) {
	this.tractorBeam = tractorBeam;
};

/**
 * Player initialisation
 *
 * @method init
 */
p.init = function() {

	game.physics.p2.enable(this, true);

	this.body.clearShapes();
	this.body.addRectangle(-10,-17, 0,-2);
	this.body.collideWorldBounds = properties.collideWorldBounds;
	this.body.mass = 1;
	this.body.setCollisionGroup(this.collisions.players);

	this.turret = this.createTurret();

	this.body.collides(this.collisions.terrain, this.crash, this);
};

/**
 *
 *
 * @method createTurret
 * @returns {Turret|exports|module.exports}
 */
p.createTurret = function() {
	return new Turret(this.groups, this, "TO_DIRECTION");
};

/**
 * When this is called, we'll check the distance of the player to the orb, and depending on distance,
 * either draw a tractorBeam
 *
 * @method checkOrbDistance
 */
p.checkOrbDistance = function() {
	var distance = utils.distAtoB(this.position, this.tractorBeam.orb.sprite.position);
	if (distance < this.tractorBeam.length) {
		this.tractorBeam.drawBeam(this.position);

	} else if (distance >= this.tractorBeam.length && distance < 90) {
		if (this.tractorBeam.isLocked && !this.tractorBeam.hasGrabbed) {
			this.tractorBeam.grab(this);
		}
	} else {
		if (this.tractorBeam.isLocking) {
			this.tractorBeam.lockingRelease();
		}
	}
};

/**
 * Fires the current actor's turret
 *
 * @method shoot
 */
p.shoot = function() {
	this.turret.shoot();
};

/**
 * Called on collision with terrain, enemy bullet, or some other fatal collision
 *
 * @method crash
 */
p.crash = function() {
	if (!properties.fatalCollisions) {
		return;
	}
	console.log('CRASHED');
};


module.exports = Player;
