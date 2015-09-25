/**
 * A private var description
 *
 * @property myPrivateVar
 * @type {number}
 * @private
 */
var myPrivateVar = 0;

/**
 * Groups description
 * calls init
 *
 * @class Groups
 * @constructor
 */
function Groups (cameraGroup) {
	/**
	 * A public var description
	 *
	 * @property myPublicVar
	 * @type {number}
	 */
	this.myPublicVar = 1;

	this.cameraGroup = cameraGroup;

	this.init();


}

var p = Groups.prototype;

/**
 * Groups initialisation
 *
 * @method init
 */
p.init = function() {


	this.actors = game.make.group();
	this.enemies = game.make.group();
	this.terrain = game.make.group();
	this.bullets = game.make.group();

	this.cameraGroup.add(this.actors);
	this.cameraGroup.add(this.enemies);
	this.cameraGroup.add(this.terrain);
	this.cameraGroup.add(this.bullets);

};

p.swapTerrain = function() {
	this.cameraGroup.swap(this.terrain, this.actors);
};


module.exports = Groups;