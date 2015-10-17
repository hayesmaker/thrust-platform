//var game = window.game;
var properties = require('../properties');
var Turret = require('./Turret');
var utils = require('../environment/utils');
var ForwardFiring = require('./strategies/ForwardFiring');
var ShipParticle = require('./bitmaps/ShipParticle');

/**
 * Player description
 * calls init
 *
 * @param {number} x
 * @param {number} y
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

	/**
	 * A beam actor used by player to colect the orb
	 *
	 * @property tractorBeam
	 * @type {TractorBeam}
	 */
	this.tractorBeam = null;

	/**
	 * @property emitter
	 * @type {Phaser.Emitter}
	 */
	this.emitter;

	this.isDead = false;

	Phaser.Sprite.call(this, game, x, y, 'player');

	this.init();
}

var p = Player.prototype = Object.create(Phaser.Sprite.prototype, {
	constructor: Player
});

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

	game.physics.p2.enable(this, properties.debugPhysics);

	this.body.clearShapes();
	this.body.loadPolygon('playerPhysics', 'player');

	this.body.collideWorldBounds = properties.collideWorldBounds;
	this.body.mass = 1;
	this.body.setCollisionGroup(this.collisions.players);


	this.turret = this.createTurret();

	this.body.collides([this.collisions.enemyBullets, this.collisions.terrain, this.collisions.orb], this.crash, this);

	this.emitter = game.add.emitter(this.x, this.y, 100);
	this.emitter.particleClass = ShipParticle;
	this.emitter.makeParticles();
	this.emitter.gravity = 200;

	//this.scale.x = this.scale.y = 0.5;
};

p.update = function() {
	this.turret.update();
};

/**
 *
 *
 * @method createTurret
 * @returns {Turret|exports|module.exports}
 */
p.createTurret = function() {
	var bulletBitmap = game.make.bitmapData(5,5);
	bulletBitmap.ctx.fillStyle = '#ffffff';
	bulletBitmap.ctx.beginPath();
	bulletBitmap.ctx.arc(1.5,1.5,3, 0, Math.PI*2, true);
	bulletBitmap.ctx.closePath();
	bulletBitmap.ctx.fill();
	return new Turret(this.groups, this, new ForwardFiring(this, this.collisions, this.groups, bulletBitmap, 350));
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
		if (this.tractorBeam.isLocked) {
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
p.fire = function() {
	this.turret.fire();
};

/**
 * Called on collision with terrain, enemy bullet, or some other fatal collision
 *
 * @method crash
 */
p.crash = function() {
	if (!properties.fatalCollisions) {
		console.log('Hit but no effect');
		return;
	}
	this.explosion();
	this.playerDeath();
};

/**
 * @method explosion
 */
p.explosion = function() {
	this.emitter.x = this.position.x;
	this.emitter.y = this.position.y;
	this.emitter.start(true, 2000, null, 20);

};

/**
 * @method bulletEnd
 * @param bullet
 * @param group
 */
p.playerDeath = function() {
	//group.remove(bullet);
	this.isDead = true;
	//this.visible = false;
	this.tractorBeam.breakLink();


};


module.exports = Player;
