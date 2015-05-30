var game = window.game;
var properties = require('../properties');
/**
 * A private var description
 *
 * @property myPrivateVar
 * @type {number}
 * @private
 */
var myPrivateVar = 0;

/**
 * Orb description
 * calls init
 *
 * @class Orb
 * @constructor
 */
var Orb = function(collisions) {
	/**
	 * A collisions container
	 *
	 * @property collisions
	 * @type {Collisions}
	 */
	this.collisions = collisions;

	var bmd = game.make.bitmapData(22,22);
	bmd.ctx.strokeStyle = '#999999';
	bmd.ctx.lineWidth = 2;
	bmd.ctx.beginPath();
	bmd.ctx.arc(11, 11, 10, 0, Math.PI*2, true);
	bmd.ctx.closePath();
	bmd.ctx.stroke();
	/**
	 * @property sprite
	 */
	this.sprite = game.make.sprite(300, 670, bmd);
	this.sprite.anchor.setTo(0.5,0.5);

	this.init();

	return this.sprite;
};

var p = Orb.prototype;

/**
 * Orb initialisation
 *
 * @method init
 */
p.init = function() {

	game.physics.p2.enable(this.sprite, true);

	//this.body.data.motionState = 1; //for dynamic
	//this.sprite.body.data.motionState = 2; //for static
	//this.body.data.motionState = 4; //for kinematic
	this.sprite.body.static = true;

	this.sprite.body.setCollisionGroup(this.collisions.terrain);

	this.body = this.sprite.body;

	this.body.collides(this.collisions.bullets, this.move, this)


};

p.move = function() {
	console.log('moveee');
	this.body.data.motionState = 1; //for dynamic
	//this.sprite.body.static = false;
};


module.exports = Orb;