(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Background.js":[function(require,module,exports){
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
	this.sprite = game.make.tileSprite(0, 0, 928, 600, 'stars');
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


module.exports = Background;
},{"../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/LimpetGun.js":[function(require,module,exports){
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
	bulletBitmap.ctx.arc(3.0,2.0,4, 0, Math.PI*2, true);
	bulletBitmap.ctx.closePath();
	bulletBitmap.ctx.fill();

	return new Turret(this.groups, this, new SpreadFiring(this, this.collisions, this.groups, bulletBitmap));
};

p.fire = function() {
	this.turret.fire();
};


module.exports = LimpetGun;
},{"../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js","./Turret":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Turret.js","./strategies/SpreadFiring":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/strategies/SpreadFiring.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Map.js":[function(require,module,exports){
var properties = require('../properties');
var game = window.game;

/**
 * Map description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class Map
 * @constructor
 */
function Map(collisions) {
	this.collisions = collisions;

	this.sprite = game.add.sprite(0,0, 'thrustmap');

	this.init();
}

var p = Map.prototype;

/**
 * Map initialisation
 *
 * @method init
 */
p.init = function() {
	this.sprite.position.setTo(this.sprite.width/2, 970);

	game.physics.p2.enable(this.sprite, properties.debugPhysics);

	this.body = this.sprite.body;

	this.body.static = true;

	this.body.clearShapes();
	this.body.loadPolygon('physicsData', 'thrustmap');

	this.body.setCollisionGroup(this.collisions.terrain);
};


module.exports = Map;

},{"../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Orb.js":[function(require,module,exports){
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
function Orb (collisions) {
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
	this.sprite = game.make.sprite(550, 1200, bmd);
	this.sprite.anchor.setTo(0.5,0.5);

	this.init();
}

var p = Orb.prototype;

/**
 * Orb initialisation
 *
 * @method init
 */
p.init = function() {

	game.physics.p2.enable(this.sprite, properties.debugPhysics);

	//motionState = 1; //for dynamic
	//motionState = 2; //for static
	//motionState = 4; //for kinematic

	this.body = this.sprite.body;

	this.body.motionState = 2;

	this.body.setCollisionGroup(this.collisions.terrain);

	this.body.collideWorldBounds = properties.collideWorldBounds;

	//this.body.collides(this.collisions.bullets, this.move, this)
};

p.move = function() {
	this.body.motionState = 1;
	this.body.mass = 1;
};


module.exports = Orb;

},{"../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Player.js":[function(require,module,exports){
//var game = window.game;
var properties = require('../properties');
var Turret = require('./Turret');
var utils = require('../environment/utils');
var ForwardFiring = require('./strategies/ForwardFiring');

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

	Phaser.Sprite.call(this, game, x, y, 'player');

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

	game.physics.p2.enable(this, properties.debugPhysics);

	this.body.clearShapes();
	this.body.loadPolygon('playerPhysics', 'player');

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
	var bulletBitmap = game.make.bitmapData(5,5);
	bulletBitmap.ctx.fillStyle = '#ffffff';
	bulletBitmap.ctx.beginPath();
	bulletBitmap.ctx.arc(1.0,1.0,2, 0, Math.PI*2, true);
	bulletBitmap.ctx.closePath();
	bulletBitmap.ctx.fill();

	return new Turret(this.groups, this, new ForwardFiring(this, this.collisions, this.groups, bulletBitmap));
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
p.fire = function() {
	console.log('player fire', this.turret);
	this.turret.fire();
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

},{"../environment/utils":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/utils.js","../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js","./Turret":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Turret.js","./strategies/ForwardFiring":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/strategies/ForwardFiring.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/TractorBeam.js":[function(require,module,exports){
var properties = require('../properties');
var game = window.game;
var graphics;
var timer;
var lockingDuration = properties.gamePlay.lockingDuration;

/**
 * TractorBeam description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class TractorBeam
 * @constructor
 */
function TractorBeam(orb) {
	this.orb = orb;

	this.isLocked = false;

	this.isLocking = false;

	this.hasGrabbed = false;

	this.length = properties.gamePlay.tractorBeamLength;

	this.variance = properties.gamePlay.tractorBeamVariation;

	this.init();
}

var p = TractorBeam.prototype;

/**
 * TractorBeam initialisation
 *
 * @method init
 */
p.init = function() {
	graphics = new Phaser.Graphics(game, 0,0);
	this.sprite = game.add.sprite(0,0);
	this.sprite.addChild(graphics);
	timer = game.time.create(false);
};

p.drawBeam = function(posA) {
	if (!this.isLocking) {
		this.isLocking = true;
		timer.start();
		timer.add(lockingDuration, this.lock, this);
	}
	graphics.clear();
	var colour = this.hasGrabbed? 0x00ff00 : 0xEF5696;
	var alpha = this.hasGrabbed? 0.5 : 0.4;
	graphics.lineStyle(5, colour, alpha);
	graphics.moveTo(posA.x, posA.y);
	graphics.lineTo(this.orb.sprite.position.x, this.orb.sprite.position.y);
};

p.lock = function() {
	this.isLocked = true;
};

p.lockingRelease = function() {
	if (!this.isLocked) {
		this.isLocking = false;
		this.hasGrabbed = false;
		graphics.clear();
		timer.stop(true);
	}
};

p.grab = function(player) {
	this.hasGrabbed = true;
	var maxForce = 200000;
	var diffX = player.position.x - this.orb.sprite.position.x;
	var diffY = player.position.y - this.orb.sprite.position.y;
	game.physics.p2.createRevoluteConstraint(player, [0, 0], this.orb.sprite, [diffX,diffY], maxForce);
	this.orb.move();
};




module.exports = TractorBeam;

},{"../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Turret.js":[function(require,module,exports){
var game = window.game;

/**
 * @method _firingStrategy
 * @type {FiringStrategy}
 * @private
 */
var _firingStrategy;

/**
 * Turret description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class Turret
 * @constructor
 */
function Turret(groups, sprite, strategy) {

	this.groups = groups;
	this.origin = sprite;

	this.firingStrategy = strategy;
}

var p = Turret.prototype;

/**
 * FiringStrategy initialisation
 *
 * @method setStrategy
 * @param {FiringStrategy} firingStrategy
 */
p.setStrategy = function(firingStrategy) {
	_firingStrategy = firingStrategy;
};

p.fire = function() {
	console.log('Fire!', _firingStrategy);
	this.firingStrategy.fire();
};



module.exports = Turret;

},{}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/strategies/FiringStrategy.js":[function(require,module,exports){
/**
 * FiringStrategy description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class FiringStrategy
 * @constructor
 */
function FiringStrategy(origin, collisions, groups, bulletBmp) {
	this.origin = origin;

	this.collisions = collisions;

	this.groups = groups;

	this.bulletBitmap = bulletBmp;
}

var p = FiringStrategy.prototype;

/**
 * FiringStrategy initialisation
 *
 * @method fire
 */
p.fire = function() {
	console.log('Abstract Fire');
};


module.exports = FiringStrategy;
},{}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/strategies/ForwardFiring.js":[function(require,module,exports){
var FiringStrategy = require('./FiringStrategy');

/**
 * @method bulletEnd
 * @param bulletBody
 * @private
 */
function bulletEnd(bulletBody) {
	bulletBody.sprite.kill();
	this.groups.bullets.remove(bulletBody.sprite);
}

/**
 * ForwardsFire description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class ForwardsFire
 * @constructor
 */
function ForwardsFire(origin, collisions, groups, bulletBmp) {
	FiringStrategy.call(this, origin, collisions, groups, bulletBmp);
}

var p = ForwardsFire.prototype = Object.create(FiringStrategy.prototype);
p.constructor = ForwardsFire;

/**
 * ForwardsFire initialisation
 *
 * @method shoot
 */
p.fire = function() {
	console.log('fire');
	var magnitue = 240;
	var bullet = game.make.sprite(this.origin.position.x, this.origin.position.y, this.bulletBitmap);
	bullet.anchor.setTo(0.5,0.5);
	game.physics.p2.enable(bullet);
	var angle = this.origin.body.rotation + (3 * Math.PI) / 2;
	bullet.body.collidesWorldBounds = false;
	bullet.body.setCollisionGroup(this.collisions.bullets);
	bullet.body.collides(this.collisions.terrain, bulletEnd, this);
	bullet.body.data.gravityScale = 0;
	bullet.body.velocity.x = magnitue * Math.cos(angle) + this.origin.body.velocity.x;
	bullet.body.velocity.y = magnitue * Math.sin(angle) + this.origin.body.velocity.y;
	this.groups.bullets.add(bullet);
};

module.exports = ForwardsFire;
},{"./FiringStrategy":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/strategies/FiringStrategy.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/strategies/SpreadFiring.js":[function(require,module,exports){
var FiringStrategy = require('./FiringStrategy');

/**
 * @method bulletEnd
 * @param bulletBody
 * @private
 */
function bulletEnd(bulletBody) {
	bulletBody.sprite.kill();
	this.groups.bullets.remove(bulletBody.sprite);
}

/**
 * ForwardsFire description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class ForwardsFire
 * @constructor
 */
function SpreadFiring(origin, collisions, groups, bulletBmp) {
	FiringStrategy.call(this, origin, collisions, groups, bulletBmp);
}

var p = SpreadFiring.prototype = Object.create(FiringStrategy.prototype);
p.constructor = SpreadFiring;

/**
 * ForwardsFire initialisation
 *
 * @method shoot
 */
p.fire = function() {
	var magnitue = 240;
	var bullet = game.make.sprite(this.origin.position.x, this.origin.position.y, this.bulletBitmap);
	bullet.anchor.setTo(0.5,0.5);
	game.physics.p2.enable(bullet);

	var angle = this.origin.body.rotation + Math.PI + Math.random()*Math.PI;
	bullet.body.collidesWorldBounds = false;
	bullet.body.setCollisionGroup(this.collisions.bullets);
	bullet.body.collides(this.collisions.terrain, bulletEnd, this);
	bullet.body.data.gravityScale = 0;
	bullet.body.velocity.x = magnitue * Math.cos(angle) + this.origin.body.velocity.x;
	bullet.body.velocity.y = magnitue * Math.sin(angle) + this.origin.body.velocity.y;
	this.groups.bullets.add(bullet);
};

module.exports = SpreadFiring;
},{"./FiringStrategy":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/strategies/FiringStrategy.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/Collisions.js":[function(require,module,exports){
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
 * Collisions description
 * calls init
 *
 * @class Collisions
 * @constructor
 */
function Collisions (collisions) {
	/**
	 * A public var description
	 *
	 * @property myPublicVar
	 * @type {number}
	 */
	this.myPublicVar = 1;
	this.init();
}

var p = Collisions.prototype;

/**
 * Collisions initialisation
 *
 * @method init
 */
p.init = function() {
	game.physics.startSystem(Phaser.Physics.P2JS);
	game.physics.p2.setImpactEvents(true);
	game.physics.p2.gravity.y = 100;

	this.players = game.physics.p2.createCollisionGroup();
	this.terrain = game.physics.p2.createCollisionGroup();
	this.bullets = game.physics.p2.createCollisionGroup();
	this.enemies = game.physics.p2.createCollisionGroup();

	game.physics.p2.updateBoundsCollisionGroup();
};

/**
*
*/
p.set = function(sprite, collisionGroups) {
	sprite.body.collides(collisionGroups);
};


module.exports = Collisions;

},{"../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/Groups.js":[function(require,module,exports){
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
function Groups () {
	/**
	 * A public var description
	 *
	 * @property myPublicVar
	 * @type {number}
	 */
	this.myPublicVar = 1;
	this.init();
}

var p = Groups.prototype;

/**
 * Groups initialisation
 *
 * @method init
 */
p.init = function() {
	this.actors = game.add.group();
	this.terrain = game.add.group();
	this.bullets = game.add.group();
};


module.exports = Groups;
},{}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/UserControl.js":[function(require,module,exports){
var game = window.game;
/**
 * UserControl description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class UserControl
 * @constructor
 */
function UserControl(enableJoypad) {


	this.initKeys();
	//this.initJoypad();

	this.isJoypadEnabled = enableJoypad;
}

var p = UserControl.prototype;

/**
 * UserControl initialisation
 *
 * @method init
 */
p.initKeys = function() {

	this.cursors 	  = game.input.keyboard.createCursorKeys();
	this.spacePress = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	this.xKey	      = game.input.keyboard.addKey(Phaser.Keyboard.X);

};

p.initJoypad = function() {

	this.pad = game.plugins.add(Phaser.VirtualJoystick);
	this.stick = this.pad.addDPad(0, 0, 200, 'dpad');
	this.stick.alignBottomLeft();
	this.stick.scale = 0.8;

	this.buttonA = this.pad.addButton(525, 420, 'dpad', 'button1-up', 'button1-down');
	this.buttonA.scale = 0.8;

	this.buttonB = this.pad.addButton(630, 390, 'dpad', 'button2-up', 'button2-down');
	this.buttonB.scale = 0.8;
};


module.exports = UserControl;

},{}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/utils.js":[function(require,module,exports){
module.exports = {
  distAtoB: function(pointA, pointB) {

    var A = pointB.x - pointA.x;
    var B = pointB.y - pointA.y;

    return Math.sqrt(A*A + B*B);
  }
};

},{}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/game.js":[function(require,module,exports){
"use strict";

var properties = require('./properties');

var game = new Phaser.Game(properties.width,properties.height, Phaser.AUTO);
window.game = game;

game.state.add('play', require('./states/play'));
game.state.add('load', require('./states/load'));
game.state.add('menu', require('./states/menu'));
game.state.add('boot', require('./states/boot'));

game.state.start('boot');

},{"./properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js","./states/boot":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/states/boot.js","./states/load":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/states/load.js","./states/menu":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/states/menu.js","./states/play":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/states/play.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/libs/stats.js/stats.min.js":[function(require,module,exports){
(function (global){
; var __browserify_shim_require__=require;(function browserifyShim(module, exports, require, define, browserify_shim__define__module__export__) {
// stats.js - http://github.com/mrdoob/stats.js
var Stats=function(){var l=Date.now(),m=l,g=0,n=Infinity,o=0,h=0,p=Infinity,q=0,r=0,s=0,f=document.createElement("div");f.id="stats";f.addEventListener("mousedown",function(b){b.preventDefault();t(++s%2)},!1);f.style.cssText="width:80px;opacity:0.9;cursor:pointer";var a=document.createElement("div");a.id="fps";a.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#002";f.appendChild(a);var i=document.createElement("div");i.id="fpsText";i.style.cssText="color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";
i.innerHTML="FPS";a.appendChild(i);var c=document.createElement("div");c.id="fpsGraph";c.style.cssText="position:relative;width:74px;height:30px;background-color:#0ff";for(a.appendChild(c);74>c.children.length;){var j=document.createElement("span");j.style.cssText="width:1px;height:30px;float:left;background-color:#113";c.appendChild(j)}var d=document.createElement("div");d.id="ms";d.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#020;display:none";f.appendChild(d);var k=document.createElement("div");
k.id="msText";k.style.cssText="color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";k.innerHTML="MS";d.appendChild(k);var e=document.createElement("div");e.id="msGraph";e.style.cssText="position:relative;width:74px;height:30px;background-color:#0f0";for(d.appendChild(e);74>e.children.length;)j=document.createElement("span"),j.style.cssText="width:1px;height:30px;float:left;background-color:#131",e.appendChild(j);var t=function(b){s=b;switch(s){case 0:a.style.display=
"block";d.style.display="none";break;case 1:a.style.display="none",d.style.display="block"}};return{REVISION:12,domElement:f,setMode:t,begin:function(){l=Date.now()},end:function(){var b=Date.now();g=b-l;n=Math.min(n,g);o=Math.max(o,g);k.textContent=g+" MS ("+n+"-"+o+")";var a=Math.min(30,30-30*(g/200));e.appendChild(e.firstChild).style.height=a+"px";r++;b>m+1E3&&(h=Math.round(1E3*r/(b-m)),p=Math.min(p,h),q=Math.max(q,h),i.textContent=h+" FPS ("+p+"-"+q+")",a=Math.min(30,30-30*(h/100)),c.appendChild(c.firstChild).style.height=
a+"px",m=b,r=0);return b},update:function(){l=this.end()}}};"object"===typeof module&&(module.exports=Stats);

; browserify_shim__define__module__export__(typeof Stats != "undefined" ? Stats : window.Stats);

}).call(global, undefined, undefined, undefined, undefined, function defineExport(ex) { module.exports = ex; });

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js":[function(require,module,exports){
/**
 * Defines build settings for the thrust-engine
 *
 * @namespace thrust-engine
 * @module properties
 * @class
 * @static
 * @type {{enableJoypad: boolean, fatalCollisions: boolean, scale: {mode: number}, drawStats: boolean}}
 */
module.exports = {
	debugPhysics: false,
	collideWorldBounds: true,
	enableJoypad: false,
	fatalCollisions: true,
	scale: {
		mode: Phaser.ScaleManager.NO_SCALE
	},
	drawStats: true,
	drawMontains: false,
	drawBackground: false,
	width: 700,
	height: 500,
	gamePlay: {
		freeOrbLocking: false,
		autoOrbLocking: true,
		tractorBeamLength: 80,
		tractorBeamVariation: 10,
		lockingDuration: 900
	}
};

},{}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/states/boot.js":[function(require,module,exports){
var properties = require('../properties');
var features = require('../utils/features');
var StatsModule = require('../utils/StatsModule');
var UserControl = require('../environment/UserControl');

var stats;
var userControl;
/**
 * The boot state
 *
 * @namespace states
 * @module boot
 * @type {{create: Function, update: Function}}
 */
module.exports = {
	preload: function() {
		game.scale.scaleMode = properties.scale.mode;
		game.scale.setScreenSize();
	},

	create: function() {

		features.init();

		stats = new StatsModule();

		userControl = new UserControl(features.isTouchScreen || properties.enableJoypad);

		console.warn("Instructions: Use Cursors to move ship, space to shoot, collect orb by passing near");
		console.warn("TouchScreenDetected:", features.isTouchScreen);

		game.stats = stats;

		game.controls = userControl;

		game.state.start('play');



	},
	update: function() {

	}
};

},{"../environment/UserControl":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/UserControl.js","../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js","../utils/StatsModule":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/utils/StatsModule.js","../utils/features":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/utils/features.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/states/load.js":[function(require,module,exports){
/**
 * The load state
 *
 * @namespace states
 * @module load
 * @type {{create: Function, update: Function}}
 */
module.exports = {
	create: function() {

	},
	update: function() {

	}
};
},{}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/states/menu.js":[function(require,module,exports){
/**
 * The menu state
 *
 * @namespace states
 * @module menu
 * @type {{create: Function, update: Function}}
 */
module.exports = {
	create: function() {

	},
	update: function() {

	}
};
},{}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/states/play.js":[function(require,module,exports){
//imports
var properties = require('../properties');
var Collisions = require('../environment/Collisions');
var Groups = require('../environment/Groups');
var Player = require('../actors/Player');
var LimpetGun = require('../actors/LimpetGun');
var Orb = require('../actors/Orb');
var Map = require('../actors/Map');
var Background = require('../actors/Background');
var TractorBeam = require('../actors/TractorBeam');
var features = require('../utils/features');

//environment
var collisions;
var groups;

//actors
var player;
var orb;
var tractorBeam;
var background;
var limpet1;
var limpet2;

//controls;
var buttonADown = false;
var buttonBDown = false;
var isXDown     = false;



/**
 * The play state - this is where the magic happens
 *
 * @namespace states
 * @module play
 * @type {{create: Function, update: Function}}
 */
module.exports = {

	preload: function() {
		if (game.controls.isJoypadEnabled) {
			game.load.atlas('dpad', 'images/virtualjoystick/skins/dpad.png', 'images/virtualjoystick/skins/dpad.json');
		}
		game.load.image('thrustmap', 'images/thrust-level2.png');
		game.load.physics('physicsData', 'images/thrust-level2.json');
		game.load.image('stars', 'images/starfield.png');
		game.load.image('player', 'images/player_30x37.png');
		game.load.physics('playerPhysics', 'images/player_30x37.json');
	},

	create: function() {
		this.defineWorldBounds();
		this.createActors();
		this.createGroupLayering();
		this.initControls();
	},
	update: function() {
		this.beginStats();
		this.checkPlayerInput();
		this.endStats();
	},

	checkPlayerInput: function(){
		if ((this.stick && this.stick.isDown && this.stick.direction === Phaser.LEFT) || this.cursors.left.isDown) {
			player.body.rotateLeft(100);
		} else if ((this.stick && this.stick.isDown && this.stick.direction === Phaser.RIGHT) || this.cursors.right.isDown) {
			player.body.rotateRight(100);
		} else {
			player.body.setZeroRotation();
		}
		if (this.cursors.up.isDown || buttonADown){
			player.body.thrust(400);
		}
		if (!tractorBeam.hasGrabbed) {
			if (isXDown || properties.gamePlay.autoOrbLocking) {
				player.checkOrbDistance();
			}
		} else {
			tractorBeam.drawBeam(player.position);
		}
	},

	defineWorldBounds: function() {
		game.world.setBounds(0, 0, 928, 1280);
	},

	createActors: function() {
		groups = new Groups();
		collisions = new Collisions();
		if (properties.drawBackground) {
			background = new Background();
		}
		player = new Player(game.world.centerX, 300, collisions, groups);
		orb = new Orb(collisions);
		tractorBeam = new TractorBeam(orb);
		player.setTractorBeam(tractorBeam);
		limpet1 = new LimpetGun(428, 1103, 153, collisions, groups);
		limpet2 = new LimpetGun(710, 1053, 206, collisions, groups);
		map = new Map(collisions);

		game.camera.follow(player);

		collisions.set(orb, [collisions.players, collisions.terrain, collisions.bullets]);
		collisions.set(map, [collisions.players, collisions.terrain, collisions.bullets]);
	},

	createGroupLayering: function() {
		if (background) {
			groups.terrain.add(background.sprite);
			if (background.mountains) {
				groups.terrain.add(background.mountains);
			}
		}
		groups.actors.add(player);
		groups.actors.add(orb.sprite);
		groups.actors.add(limpet1);
		groups.actors.add(limpet2);
		game.world.swap(groups.terrain, groups.actors);
	},

	initControls: function() {
		if (game.controls.isJoypadEnabled) {
			game.controls.initJoypad();
			this.stick = game.controls.stick;
			game.controls.buttonA.onDown.add(this.pressButtonA, this);
			game.controls.buttonA.onUp.add(this.upButtonA, this);
			game.controls.buttonB.onDown.add(this.pressButtonB, this);
			game.controls.buttonB.onUp.add(this.upButtonB, this);
		}

		this.cursors 	 = game.controls.cursors;
		game.controls.spacePress.onDown.add(player.fire, player);
		game.controls.xKey.onDown.add(this.xDown, this);
		game.controls.xKey.onUp.add(this.xUp, this);
	},

	beginStats: function() {
		if (properties.drawStats) {
			game.stats.start();
		}
	},

	endStats: function() {
		if (properties.drawStats) {
			game.stats.end();
		}
	},

	render: function() {
		game.debug.cameraInfo(game.camera, 500, 20);
	},

	pressButtonA: function() {
		buttonADown = true;
	},

	upButtonA: function() {
		buttonADown = false;
	},

	pressButtonB: function() {
		buttonBDown = true;
		player.shoot();
	},

	upButtonB: function() {
		buttonBDown = false;
	},

	xDown: function () {
		isXDown = true;
		//limpet1.fire();
	},

	xUp: function() {
		isXDown = false;
		if (!properties.gamePlay.autoOrbLocking) {
			tractorBeam.lockingRelease();
		}
	}
};

},{"../actors/Background":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Background.js","../actors/LimpetGun":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/LimpetGun.js","../actors/Map":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Map.js","../actors/Orb":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Orb.js","../actors/Player":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Player.js","../actors/TractorBeam":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/TractorBeam.js","../environment/Collisions":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/Collisions.js","../environment/Groups":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/Groups.js","../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js","../utils/features":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/utils/features.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/utils/StatsModule.js":[function(require,module,exports){
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
		stats.domElement.style.left = '0px';
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
	stats.begin();
};

/**
 * @method end
 */
p.end = function() {
	stats.end();
};


module.exports = StatsModule;

},{"../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js","Stats":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/libs/stats.js/stats.min.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/utils/features.js":[function(require,module,exports){
/*
function isTouchDevice(){
    return true == ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
}
Now checking if ‘isTouchDevice();’ is returns true it means its a touch device.

if(isTouchDevice()===true) {
    alert('Touch Device'); //your logic for touch device
}
else {
    alert('Not a Touch Device'); //your logic for non touch device
}
*/





module.exports = {
  init: function () {
    this.isTouchScreen = (('ontouchstart' in window)
        || (navigator.MaxTouchPoints > 0)
        || (navigator.msMaxTouchPoints > 0));
    console.log("touchScreen:", this.isTouchScreen);
  },
  isTouchScreen: this.isTouchScreen
}

},{}]},{},["/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/game.js"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYWN0b3JzL0JhY2tncm91bmQuanMiLCJzcmMvYWN0b3JzL0xpbXBldEd1bi5qcyIsInNyYy9hY3RvcnMvTWFwLmpzIiwic3JjL2FjdG9ycy9PcmIuanMiLCJzcmMvYWN0b3JzL1BsYXllci5qcyIsInNyYy9hY3RvcnMvVHJhY3RvckJlYW0uanMiLCJzcmMvYWN0b3JzL1R1cnJldC5qcyIsInNyYy9hY3RvcnMvc3RyYXRlZ2llcy9GaXJpbmdTdHJhdGVneS5qcyIsInNyYy9hY3RvcnMvc3RyYXRlZ2llcy9Gb3J3YXJkRmlyaW5nLmpzIiwic3JjL2FjdG9ycy9zdHJhdGVnaWVzL1NwcmVhZEZpcmluZy5qcyIsInNyYy9lbnZpcm9ubWVudC9Db2xsaXNpb25zLmpzIiwic3JjL2Vudmlyb25tZW50L0dyb3Vwcy5qcyIsInNyYy9lbnZpcm9ubWVudC9Vc2VyQ29udHJvbC5qcyIsInNyYy9lbnZpcm9ubWVudC91dGlscy5qcyIsInNyYy9nYW1lLmpzIiwic3JjL2xpYnMvc3RhdHMuanMvc3RhdHMubWluLmpzIiwic3JjL3Byb3BlcnRpZXMuanMiLCJzcmMvc3RhdGVzL2Jvb3QuanMiLCJzcmMvc3RhdGVzL2xvYWQuanMiLCJzcmMvc3RhdGVzL21lbnUuanMiLCJzcmMvc3RhdGVzL3BsYXkuanMiLCJzcmMvdXRpbHMvU3RhdHNNb2R1bGUuanMiLCJzcmMvdXRpbHMvZmVhdHVyZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL3Byb3BlcnRpZXMnKTtcblxuLyoqXG4gKlxuICpcbiAqIEB0eXBlIHtQaGFzZXIuR3JhcGhpY3N9XG4gKi9cbnZhciBncmFwaGljcztcblxuLyoqXG4gKiBCYWNrZ3JvdW5kIGRlc2NyaXB0aW9uXG4gKlxuICogZGVmaW5lcyBhIHB1YmxpYyB2YXJpYWJsZSBhbmQgY2FsbHMgaW5pdCAtIGNoYW5nZSB0aGlzIGNvbnN0cnVjdG9yIHRvIHN1aXQgeW91ciBuZWVkcy5cbiAqIG5iLiB0aGVyZSdzIG5vIHJlcXVpcmVtZW50IHRvIGNhbGwgYW4gaW5pdCBmdW5jdGlvblxuICpcbiAqIEBjbGFzcyBCYWNrZ3JvdW5kXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gQmFja2dyb3VuZCgpIHtcblx0dGhpcy5zcHJpdGUgPSBnYW1lLm1ha2UudGlsZVNwcml0ZSgwLCAwLCA5MjgsIDYwMCwgJ3N0YXJzJyk7XG5cdHRoaXMuaW5pdCgpO1xufVxuXG52YXIgcCA9IEJhY2tncm91bmQucHJvdG90eXBlO1xuXG4vKipcbiAqIEJhY2tncm91bmQgaW5pdGlhbGlzYXRpb25cbiAqXG4gKiBAbWV0aG9kIGluaXRcbiAqL1xucC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuc3RhcnMgPSB0aGlzLnNwcml0ZTtcblxuXHRpZiAocHJvcGVydGllcy5kcmF3TW91bnRhaW5zKSB7XG5cdFx0dGhpcy5tb3VudGFpbnMgPSBnYW1lLmFkZC5zcHJpdGUoMCwgNzAwKTtcblx0XHRncmFwaGljcyA9IG5ldyBQaGFzZXIuR3JhcGhpY3MoZ2FtZSwgMCwwKTtcblx0XHRncmFwaGljcy5saW5lU3R5bGUoMiwgMHhmZmZmZmYsIDAuNyk7XG5cdFx0dmFyIGdyb3VuZFdpZHRoID0gMjAwMDtcblx0XHR2YXIgcGVha1cgPSAyMDA7XG5cdFx0dmFyIHBlYWtIID0gMTAwO1xuXHRcdHZhciB1cCA9IHRydWU7XG5cdFx0dmFyIGk7XG5cdFx0Zm9yIChpID0gMDsgaSA8IGdyb3VuZFdpZHRoOyBpKyspIHtcblx0XHRcdGlmIChpICUgcGVha1cgPT09IDApIHtcblx0XHRcdFx0Z3JhcGhpY3MubGluZVRvKCBwZWFrVyArIGksIHVwPyAtTWF0aC5yYW5kb20oKSAqIHBlYWtIIDogMCApO1xuXHRcdFx0XHR1cCA9ICF1cDtcblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5tb3VudGFpbnMuYWRkQ2hpbGQoZ3JhcGhpY3MpO1xuXHR9XG5cblxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tncm91bmQ7IiwidmFyIHByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9wcm9wZXJ0aWVzJyk7XG52YXIgVHVycmV0ID0gcmVxdWlyZSgnLi9UdXJyZXQnKTtcbnZhciBTcHJlYWRGaXJpbmcgPSByZXF1aXJlKCcuL3N0cmF0ZWdpZXMvU3ByZWFkRmlyaW5nJyk7XG4vKipcbiAqIExpbXBldEd1biBkZXNjcmlwdGlvblxuICpcbiAqIGRlZmluZXMgYSBwdWJsaWMgdmFyaWFibGUgYW5kIGNhbGxzIGluaXQgLSBjaGFuZ2UgdGhpcyBjb25zdHJ1Y3RvciB0byBzdWl0IHlvdXIgbmVlZHMuXG4gKiBuYi4gdGhlcmUncyBubyByZXF1aXJlbWVudCB0byBjYWxsIGFuIGluaXQgZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0geFxuICogQHBhcmFtIHlcbiAqIEBwYXJhbSBhbmdsZURlZ1xuICogQHBhcmFtIGNvbGxpc2lvbnNcbiAqIEBwYXJhbSBncm91cHNcbiAqIEBjbGFzcyBMaW1wZXRHdW5cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBMaW1wZXRHdW4oeCwgeSwgYW5nbGVEZWcsIGNvbGxpc2lvbnMsIGdyb3Vwcykge1xuXG5cdHRoaXMuY29sbGlzaW9ucyA9IGNvbGxpc2lvbnM7XG5cblx0dGhpcy5ncm91cHMgPSBncm91cHM7XG5cblx0dmFyIGJtZCA9IGdhbWUubWFrZS5iaXRtYXBEYXRhKDUwLCAyNSk7XG5cdGJtZC5jdHguc3Ryb2tlU3R5bGUgPSAnI2ZmZmZmZic7XG5cdGJtZC5jdHgubGluZVdpZHRoID0gMjtcblx0Ym1kLmN0eC5iZWdpblBhdGgoKTtcblx0Ym1kLmN0eC5tb3ZlVG8oIDUsIDE1KTtcblx0Ym1kLmN0eC5saW5lVG8oNDUsIDE1KTtcblx0Ym1kLmN0eC5saW5lVG8oNTAsIDI1KTtcblx0Ym1kLmN0eC5saW5lVG8oNDMsIDIwKTtcblx0Ym1kLmN0eC5saW5lVG8oIDMsIDIwKTtcblx0Ym1kLmN0eC5saW5lVG8oIDAsIDI1KTtcblx0Ym1kLmN0eC5saW5lVG8oIDUsIDE1KTtcblx0Ym1kLmN0eC5hcmMoMjUsMTUsMTIsIDAsIE1hdGguUEksIHRydWUpO1xuXHRibWQuY3R4LmNsb3NlUGF0aCgpO1xuXHRibWQuY3R4LnN0cm9rZSgpO1xuXG5cdFBoYXNlci5TcHJpdGUuY2FsbCh0aGlzLCBnYW1lLCB4LCB5LCBibWQpO1xuXG5cdHRoaXMuYW5nbGUgPSBhbmdsZURlZztcblxuXHR0aGlzLmluaXQoKTtcbn1cblxudmFyIHAgPSBMaW1wZXRHdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQaGFzZXIuU3ByaXRlLnByb3RvdHlwZSk7XG5wLmNvbnN0cnVjdG9yID0gTGltcGV0R3VuO1xuXG4vKipcbiAqIExpbXBldEd1biBpbml0aWFsaXNhdGlvblxuICpcbiAqIEBtZXRob2QgaW5pdFxuICovXG5wLmluaXQgPSBmdW5jdGlvbigpIHtcblxuXHRnYW1lLnBoeXNpY3MucDIuZW5hYmxlKHRoaXMsIHByb3BlcnRpZXMuZGVidWdQaHlzaWNzKTtcblxuXHR0aGlzLmJvZHkuY2xlYXJTaGFwZXMoKTtcblx0dGhpcy5ib2R5LmFkZFJlY3RhbmdsZSg1MCwgMjUsIDAsMCk7XG5cdHRoaXMuYm9keS5yb3RhdGlvbiA9IGdhbWUubWF0aC5kZWdUb1JhZCh0aGlzLmFuZ2xlKTtcblx0dGhpcy5ib2R5LmZpeGVkUm90YXRpb24gPSB0cnVlO1xuXG5cdHRoaXMuYm9keS5zZXRDb2xsaXNpb25Hcm91cCh0aGlzLmNvbGxpc2lvbnMuZW5lbWllcyk7XG5cblx0dGhpcy5ib2R5Lm1vdGlvblN0YXRlID0gMjtcblxuXHR0aGlzLnR1cnJldCA9IHRoaXMuY3JlYXRlVHVycmV0KCk7XG59O1xuXG5wLmNyZWF0ZVR1cnJldCA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgYnVsbGV0Qml0bWFwID0gZ2FtZS5tYWtlLmJpdG1hcERhdGEoNSw1KTtcblx0YnVsbGV0Qml0bWFwLmN0eC5maWxsU3R5bGUgPSAnI2ZmZmZmZic7XG5cdGJ1bGxldEJpdG1hcC5jdHguYmVnaW5QYXRoKCk7XG5cdGJ1bGxldEJpdG1hcC5jdHguYXJjKDMuMCwyLjAsNCwgMCwgTWF0aC5QSSoyLCB0cnVlKTtcblx0YnVsbGV0Qml0bWFwLmN0eC5jbG9zZVBhdGgoKTtcblx0YnVsbGV0Qml0bWFwLmN0eC5maWxsKCk7XG5cblx0cmV0dXJuIG5ldyBUdXJyZXQodGhpcy5ncm91cHMsIHRoaXMsIG5ldyBTcHJlYWRGaXJpbmcodGhpcywgdGhpcy5jb2xsaXNpb25zLCB0aGlzLmdyb3VwcywgYnVsbGV0Qml0bWFwKSk7XG59O1xuXG5wLmZpcmUgPSBmdW5jdGlvbigpIHtcblx0dGhpcy50dXJyZXQuZmlyZSgpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IExpbXBldEd1bjsiLCJ2YXIgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL3Byb3BlcnRpZXMnKTtcbnZhciBnYW1lID0gd2luZG93LmdhbWU7XG5cbi8qKlxuICogTWFwIGRlc2NyaXB0aW9uXG4gKlxuICogZGVmaW5lcyBhIHB1YmxpYyB2YXJpYWJsZSBhbmQgY2FsbHMgaW5pdCAtIGNoYW5nZSB0aGlzIGNvbnN0cnVjdG9yIHRvIHN1aXQgeW91ciBuZWVkcy5cbiAqIG5iLiB0aGVyZSdzIG5vIHJlcXVpcmVtZW50IHRvIGNhbGwgYW4gaW5pdCBmdW5jdGlvblxuICpcbiAqIEBjbGFzcyBNYXBcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBNYXAoY29sbGlzaW9ucykge1xuXHR0aGlzLmNvbGxpc2lvbnMgPSBjb2xsaXNpb25zO1xuXG5cdHRoaXMuc3ByaXRlID0gZ2FtZS5hZGQuc3ByaXRlKDAsMCwgJ3RocnVzdG1hcCcpO1xuXG5cdHRoaXMuaW5pdCgpO1xufVxuXG52YXIgcCA9IE1hcC5wcm90b3R5cGU7XG5cbi8qKlxuICogTWFwIGluaXRpYWxpc2F0aW9uXG4gKlxuICogQG1ldGhvZCBpbml0XG4gKi9cbnAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnNwcml0ZS5wb3NpdGlvbi5zZXRUbyh0aGlzLnNwcml0ZS53aWR0aC8yLCA5NzApO1xuXG5cdGdhbWUucGh5c2ljcy5wMi5lbmFibGUodGhpcy5zcHJpdGUsIHByb3BlcnRpZXMuZGVidWdQaHlzaWNzKTtcblxuXHR0aGlzLmJvZHkgPSB0aGlzLnNwcml0ZS5ib2R5O1xuXG5cdHRoaXMuYm9keS5zdGF0aWMgPSB0cnVlO1xuXG5cdHRoaXMuYm9keS5jbGVhclNoYXBlcygpO1xuXHR0aGlzLmJvZHkubG9hZFBvbHlnb24oJ3BoeXNpY3NEYXRhJywgJ3RocnVzdG1hcCcpO1xuXG5cdHRoaXMuYm9keS5zZXRDb2xsaXNpb25Hcm91cCh0aGlzLmNvbGxpc2lvbnMudGVycmFpbik7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gTWFwO1xuIiwidmFyIGdhbWUgPSB3aW5kb3cuZ2FtZTtcbnZhciBwcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vcHJvcGVydGllcycpO1xuLyoqXG4gKiBBIHByaXZhdGUgdmFyIGRlc2NyaXB0aW9uXG4gKlxuICogQHByb3BlcnR5IG15UHJpdmF0ZVZhclxuICogQHR5cGUge251bWJlcn1cbiAqIEBwcml2YXRlXG4gKi9cbnZhciBteVByaXZhdGVWYXIgPSAwO1xuXG4vKipcbiAqIE9yYiBkZXNjcmlwdGlvblxuICogY2FsbHMgaW5pdFxuICpcbiAqIEBjbGFzcyBPcmJcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBPcmIgKGNvbGxpc2lvbnMpIHtcblx0LyoqXG5cdCAqIEEgY29sbGlzaW9ucyBjb250YWluZXJcblx0ICpcblx0ICogQHByb3BlcnR5IGNvbGxpc2lvbnNcblx0ICogQHR5cGUge0NvbGxpc2lvbnN9XG5cdCAqL1xuXHR0aGlzLmNvbGxpc2lvbnMgPSBjb2xsaXNpb25zO1xuXG5cdHZhciBibWQgPSBnYW1lLm1ha2UuYml0bWFwRGF0YSgyMiwyMik7XG5cdGJtZC5jdHguc3Ryb2tlU3R5bGUgPSAnIzk5OTk5OSc7XG5cdGJtZC5jdHgubGluZVdpZHRoID0gMjtcblx0Ym1kLmN0eC5iZWdpblBhdGgoKTtcblx0Ym1kLmN0eC5hcmMoMTEsIDExLCAxMCwgMCwgTWF0aC5QSSoyLCB0cnVlKTtcblx0Ym1kLmN0eC5jbG9zZVBhdGgoKTtcblx0Ym1kLmN0eC5zdHJva2UoKTtcblx0LyoqXG5cdCAqIEBwcm9wZXJ0eSBzcHJpdGVcblx0ICovXG5cdHRoaXMuc3ByaXRlID0gZ2FtZS5tYWtlLnNwcml0ZSg1NTAsIDEyMDAsIGJtZCk7XG5cdHRoaXMuc3ByaXRlLmFuY2hvci5zZXRUbygwLjUsMC41KTtcblxuXHR0aGlzLmluaXQoKTtcbn1cblxudmFyIHAgPSBPcmIucHJvdG90eXBlO1xuXG4vKipcbiAqIE9yYiBpbml0aWFsaXNhdGlvblxuICpcbiAqIEBtZXRob2QgaW5pdFxuICovXG5wLmluaXQgPSBmdW5jdGlvbigpIHtcblxuXHRnYW1lLnBoeXNpY3MucDIuZW5hYmxlKHRoaXMuc3ByaXRlLCBwcm9wZXJ0aWVzLmRlYnVnUGh5c2ljcyk7XG5cblx0Ly9tb3Rpb25TdGF0ZSA9IDE7IC8vZm9yIGR5bmFtaWNcblx0Ly9tb3Rpb25TdGF0ZSA9IDI7IC8vZm9yIHN0YXRpY1xuXHQvL21vdGlvblN0YXRlID0gNDsgLy9mb3Iga2luZW1hdGljXG5cblx0dGhpcy5ib2R5ID0gdGhpcy5zcHJpdGUuYm9keTtcblxuXHR0aGlzLmJvZHkubW90aW9uU3RhdGUgPSAyO1xuXG5cdHRoaXMuYm9keS5zZXRDb2xsaXNpb25Hcm91cCh0aGlzLmNvbGxpc2lvbnMudGVycmFpbik7XG5cblx0dGhpcy5ib2R5LmNvbGxpZGVXb3JsZEJvdW5kcyA9IHByb3BlcnRpZXMuY29sbGlkZVdvcmxkQm91bmRzO1xuXG5cdC8vdGhpcy5ib2R5LmNvbGxpZGVzKHRoaXMuY29sbGlzaW9ucy5idWxsZXRzLCB0aGlzLm1vdmUsIHRoaXMpXG59O1xuXG5wLm1vdmUgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5ib2R5Lm1vdGlvblN0YXRlID0gMTtcblx0dGhpcy5ib2R5Lm1hc3MgPSAxO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IE9yYjtcbiIsIi8vdmFyIGdhbWUgPSB3aW5kb3cuZ2FtZTtcbnZhciBwcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vcHJvcGVydGllcycpO1xudmFyIFR1cnJldCA9IHJlcXVpcmUoJy4vVHVycmV0Jyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi9lbnZpcm9ubWVudC91dGlscycpO1xudmFyIEZvcndhcmRGaXJpbmcgPSByZXF1aXJlKCcuL3N0cmF0ZWdpZXMvRm9yd2FyZEZpcmluZycpO1xuXG4vKipcbiAqIFBsYXllciBkZXNjcmlwdGlvblxuICogY2FsbHMgaW5pdFxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSB4XG4gKiBAcGFyYW0ge251bWJlcn0geVxuICogQHBhcmFtIHtDb2xsaXNpb25zfSBjb2xsaXNpb25zIC0gT3VyIGNvbGxpc2lvbnMgY29udGFpbmVyIG9mIGNvbGxpc2lvbkdyb3Vwc1xuICogQHBhcmFtIHtHcm91cHN9IGdyb3VwcyAtIE91ciBncm91cHMgY29udGFpbmVyXG4gKiBAY2xhc3MgUGxheWVyXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gUGxheWVyKHgsIHksIGNvbGxpc2lvbnMsIGdyb3Vwcykge1xuXHQvKipcblx0ICogVGhlIGNvbGxpc2lvbnMgY29udGFpbmVyXG5cdCAqXG5cdCAqIEBwcm9wZXJ0eSBjb2xsaXNpb25zXG5cdCAqIEB0eXBlIHtDb2xsaXNpb25zfVxuXHQgKi9cblx0dGhpcy5jb2xsaXNpb25zID0gY29sbGlzaW9ucztcblxuXHQvKipcblx0ICogVGhlIGdyb3VwcyBjb250YWluZXJcblx0ICpcblx0ICogQHByb3BlcnR5IGdyb3Vwc1xuXHQgKiBAdHlwZSB7R3JvdXBzfVxuXHQgKi9cblx0dGhpcy5ncm91cHMgPSBncm91cHM7XG5cblx0LyoqXG5cdCAqIEEgYmVhbSBhY3RvciB1c2VkIGJ5IHBsYXllciB0byBjb2xlY3QgdGhlIG9yYlxuXHQgKlxuXHQgKiBAcHJvcGVydHkgdHJhY3RvckJlYW1cblx0ICogQHR5cGUge1RyYWN0b3JCZWFtfVxuXHQgKi9cblx0dGhpcy50cmFjdG9yQmVhbSA9IG51bGw7XG5cblx0UGhhc2VyLlNwcml0ZS5jYWxsKHRoaXMsIGdhbWUsIHgsIHksICdwbGF5ZXInKTtcblxuXHR0aGlzLmluaXQoKTtcbn1cblxudmFyIHAgPSBQbGF5ZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQaGFzZXIuU3ByaXRlLnByb3RvdHlwZSk7XG5wLmNvbnN0cnVjdG9yID0gUGxheWVyO1xuXG4vKipcbiAqXG4gKiBAbWV0aG9kIHNldFRyYWN0b3JCZWFtXG4gKiBAcGFyYW0gdHJhY3RvckJlYW1cbiAqL1xucC5zZXRUcmFjdG9yQmVhbSA9IGZ1bmN0aW9uKHRyYWN0b3JCZWFtKSB7XG5cdHRoaXMudHJhY3RvckJlYW0gPSB0cmFjdG9yQmVhbTtcbn07XG5cbi8qKlxuICogUGxheWVyIGluaXRpYWxpc2F0aW9uXG4gKlxuICogQG1ldGhvZCBpbml0XG4gKi9cbnAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXG5cdGdhbWUucGh5c2ljcy5wMi5lbmFibGUodGhpcywgcHJvcGVydGllcy5kZWJ1Z1BoeXNpY3MpO1xuXG5cdHRoaXMuYm9keS5jbGVhclNoYXBlcygpO1xuXHR0aGlzLmJvZHkubG9hZFBvbHlnb24oJ3BsYXllclBoeXNpY3MnLCAncGxheWVyJyk7XG5cblx0dGhpcy5ib2R5LmNvbGxpZGVXb3JsZEJvdW5kcyA9IHByb3BlcnRpZXMuY29sbGlkZVdvcmxkQm91bmRzO1xuXHR0aGlzLmJvZHkubWFzcyA9IDE7XG5cdHRoaXMuYm9keS5zZXRDb2xsaXNpb25Hcm91cCh0aGlzLmNvbGxpc2lvbnMucGxheWVycyk7XG5cblx0dGhpcy50dXJyZXQgPSB0aGlzLmNyZWF0ZVR1cnJldCgpO1xuXG5cdHRoaXMuYm9keS5jb2xsaWRlcyh0aGlzLmNvbGxpc2lvbnMudGVycmFpbiwgdGhpcy5jcmFzaCwgdGhpcyk7XG59O1xuXG4vKipcbiAqXG4gKlxuICogQG1ldGhvZCBjcmVhdGVUdXJyZXRcbiAqIEByZXR1cm5zIHtUdXJyZXR8ZXhwb3J0c3xtb2R1bGUuZXhwb3J0c31cbiAqL1xucC5jcmVhdGVUdXJyZXQgPSBmdW5jdGlvbigpIHtcblx0dmFyIGJ1bGxldEJpdG1hcCA9IGdhbWUubWFrZS5iaXRtYXBEYXRhKDUsNSk7XG5cdGJ1bGxldEJpdG1hcC5jdHguZmlsbFN0eWxlID0gJyNmZmZmZmYnO1xuXHRidWxsZXRCaXRtYXAuY3R4LmJlZ2luUGF0aCgpO1xuXHRidWxsZXRCaXRtYXAuY3R4LmFyYygxLjAsMS4wLDIsIDAsIE1hdGguUEkqMiwgdHJ1ZSk7XG5cdGJ1bGxldEJpdG1hcC5jdHguY2xvc2VQYXRoKCk7XG5cdGJ1bGxldEJpdG1hcC5jdHguZmlsbCgpO1xuXG5cdHJldHVybiBuZXcgVHVycmV0KHRoaXMuZ3JvdXBzLCB0aGlzLCBuZXcgRm9yd2FyZEZpcmluZyh0aGlzLCB0aGlzLmNvbGxpc2lvbnMsIHRoaXMuZ3JvdXBzLCBidWxsZXRCaXRtYXApKTtcbn07XG5cbi8qKlxuICogV2hlbiB0aGlzIGlzIGNhbGxlZCwgd2UnbGwgY2hlY2sgdGhlIGRpc3RhbmNlIG9mIHRoZSBwbGF5ZXIgdG8gdGhlIG9yYiwgYW5kIGRlcGVuZGluZyBvbiBkaXN0YW5jZSxcbiAqIGVpdGhlciBkcmF3IGEgdHJhY3RvckJlYW1cbiAqXG4gKiBAbWV0aG9kIGNoZWNrT3JiRGlzdGFuY2VcbiAqL1xucC5jaGVja09yYkRpc3RhbmNlID0gZnVuY3Rpb24oKSB7XG5cdHZhciBkaXN0YW5jZSA9IHV0aWxzLmRpc3RBdG9CKHRoaXMucG9zaXRpb24sIHRoaXMudHJhY3RvckJlYW0ub3JiLnNwcml0ZS5wb3NpdGlvbik7XG5cdGlmIChkaXN0YW5jZSA8IHRoaXMudHJhY3RvckJlYW0ubGVuZ3RoKSB7XG5cdFx0dGhpcy50cmFjdG9yQmVhbS5kcmF3QmVhbSh0aGlzLnBvc2l0aW9uKTtcblxuXHR9IGVsc2UgaWYgKGRpc3RhbmNlID49IHRoaXMudHJhY3RvckJlYW0ubGVuZ3RoICYmIGRpc3RhbmNlIDwgOTApIHtcblx0XHRpZiAodGhpcy50cmFjdG9yQmVhbS5pc0xvY2tlZCAmJiAhdGhpcy50cmFjdG9yQmVhbS5oYXNHcmFiYmVkKSB7XG5cdFx0XHR0aGlzLnRyYWN0b3JCZWFtLmdyYWIodGhpcyk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGlmICh0aGlzLnRyYWN0b3JCZWFtLmlzTG9ja2luZykge1xuXHRcdFx0dGhpcy50cmFjdG9yQmVhbS5sb2NraW5nUmVsZWFzZSgpO1xuXHRcdH1cblx0fVxufTtcblxuLyoqXG4gKiBGaXJlcyB0aGUgY3VycmVudCBhY3RvcidzIHR1cnJldFxuICpcbiAqIEBtZXRob2Qgc2hvb3RcbiAqL1xucC5maXJlID0gZnVuY3Rpb24oKSB7XG5cdGNvbnNvbGUubG9nKCdwbGF5ZXIgZmlyZScsIHRoaXMudHVycmV0KTtcblx0dGhpcy50dXJyZXQuZmlyZSgpO1xufTtcblxuLyoqXG4gKiBDYWxsZWQgb24gY29sbGlzaW9uIHdpdGggdGVycmFpbiwgZW5lbXkgYnVsbGV0LCBvciBzb21lIG90aGVyIGZhdGFsIGNvbGxpc2lvblxuICpcbiAqIEBtZXRob2QgY3Jhc2hcbiAqL1xucC5jcmFzaCA9IGZ1bmN0aW9uKCkge1xuXHRpZiAoIXByb3BlcnRpZXMuZmF0YWxDb2xsaXNpb25zKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGNvbnNvbGUubG9nKCdDUkFTSEVEJyk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyO1xuIiwidmFyIHByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9wcm9wZXJ0aWVzJyk7XG52YXIgZ2FtZSA9IHdpbmRvdy5nYW1lO1xudmFyIGdyYXBoaWNzO1xudmFyIHRpbWVyO1xudmFyIGxvY2tpbmdEdXJhdGlvbiA9IHByb3BlcnRpZXMuZ2FtZVBsYXkubG9ja2luZ0R1cmF0aW9uO1xuXG4vKipcbiAqIFRyYWN0b3JCZWFtIGRlc2NyaXB0aW9uXG4gKlxuICogZGVmaW5lcyBhIHB1YmxpYyB2YXJpYWJsZSBhbmQgY2FsbHMgaW5pdCAtIGNoYW5nZSB0aGlzIGNvbnN0cnVjdG9yIHRvIHN1aXQgeW91ciBuZWVkcy5cbiAqIG5iLiB0aGVyZSdzIG5vIHJlcXVpcmVtZW50IHRvIGNhbGwgYW4gaW5pdCBmdW5jdGlvblxuICpcbiAqIEBjbGFzcyBUcmFjdG9yQmVhbVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFRyYWN0b3JCZWFtKG9yYikge1xuXHR0aGlzLm9yYiA9IG9yYjtcblxuXHR0aGlzLmlzTG9ja2VkID0gZmFsc2U7XG5cblx0dGhpcy5pc0xvY2tpbmcgPSBmYWxzZTtcblxuXHR0aGlzLmhhc0dyYWJiZWQgPSBmYWxzZTtcblxuXHR0aGlzLmxlbmd0aCA9IHByb3BlcnRpZXMuZ2FtZVBsYXkudHJhY3RvckJlYW1MZW5ndGg7XG5cblx0dGhpcy52YXJpYW5jZSA9IHByb3BlcnRpZXMuZ2FtZVBsYXkudHJhY3RvckJlYW1WYXJpYXRpb247XG5cblx0dGhpcy5pbml0KCk7XG59XG5cbnZhciBwID0gVHJhY3RvckJlYW0ucHJvdG90eXBlO1xuXG4vKipcbiAqIFRyYWN0b3JCZWFtIGluaXRpYWxpc2F0aW9uXG4gKlxuICogQG1ldGhvZCBpbml0XG4gKi9cbnAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRncmFwaGljcyA9IG5ldyBQaGFzZXIuR3JhcGhpY3MoZ2FtZSwgMCwwKTtcblx0dGhpcy5zcHJpdGUgPSBnYW1lLmFkZC5zcHJpdGUoMCwwKTtcblx0dGhpcy5zcHJpdGUuYWRkQ2hpbGQoZ3JhcGhpY3MpO1xuXHR0aW1lciA9IGdhbWUudGltZS5jcmVhdGUoZmFsc2UpO1xufTtcblxucC5kcmF3QmVhbSA9IGZ1bmN0aW9uKHBvc0EpIHtcblx0aWYgKCF0aGlzLmlzTG9ja2luZykge1xuXHRcdHRoaXMuaXNMb2NraW5nID0gdHJ1ZTtcblx0XHR0aW1lci5zdGFydCgpO1xuXHRcdHRpbWVyLmFkZChsb2NraW5nRHVyYXRpb24sIHRoaXMubG9jaywgdGhpcyk7XG5cdH1cblx0Z3JhcGhpY3MuY2xlYXIoKTtcblx0dmFyIGNvbG91ciA9IHRoaXMuaGFzR3JhYmJlZD8gMHgwMGZmMDAgOiAweEVGNTY5Njtcblx0dmFyIGFscGhhID0gdGhpcy5oYXNHcmFiYmVkPyAwLjUgOiAwLjQ7XG5cdGdyYXBoaWNzLmxpbmVTdHlsZSg1LCBjb2xvdXIsIGFscGhhKTtcblx0Z3JhcGhpY3MubW92ZVRvKHBvc0EueCwgcG9zQS55KTtcblx0Z3JhcGhpY3MubGluZVRvKHRoaXMub3JiLnNwcml0ZS5wb3NpdGlvbi54LCB0aGlzLm9yYi5zcHJpdGUucG9zaXRpb24ueSk7XG59O1xuXG5wLmxvY2sgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5pc0xvY2tlZCA9IHRydWU7XG59O1xuXG5wLmxvY2tpbmdSZWxlYXNlID0gZnVuY3Rpb24oKSB7XG5cdGlmICghdGhpcy5pc0xvY2tlZCkge1xuXHRcdHRoaXMuaXNMb2NraW5nID0gZmFsc2U7XG5cdFx0dGhpcy5oYXNHcmFiYmVkID0gZmFsc2U7XG5cdFx0Z3JhcGhpY3MuY2xlYXIoKTtcblx0XHR0aW1lci5zdG9wKHRydWUpO1xuXHR9XG59O1xuXG5wLmdyYWIgPSBmdW5jdGlvbihwbGF5ZXIpIHtcblx0dGhpcy5oYXNHcmFiYmVkID0gdHJ1ZTtcblx0dmFyIG1heEZvcmNlID0gMjAwMDAwO1xuXHR2YXIgZGlmZlggPSBwbGF5ZXIucG9zaXRpb24ueCAtIHRoaXMub3JiLnNwcml0ZS5wb3NpdGlvbi54O1xuXHR2YXIgZGlmZlkgPSBwbGF5ZXIucG9zaXRpb24ueSAtIHRoaXMub3JiLnNwcml0ZS5wb3NpdGlvbi55O1xuXHRnYW1lLnBoeXNpY3MucDIuY3JlYXRlUmV2b2x1dGVDb25zdHJhaW50KHBsYXllciwgWzAsIDBdLCB0aGlzLm9yYi5zcHJpdGUsIFtkaWZmWCxkaWZmWV0sIG1heEZvcmNlKTtcblx0dGhpcy5vcmIubW92ZSgpO1xufTtcblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBUcmFjdG9yQmVhbTtcbiIsInZhciBnYW1lID0gd2luZG93LmdhbWU7XG5cbi8qKlxuICogQG1ldGhvZCBfZmlyaW5nU3RyYXRlZ3lcbiAqIEB0eXBlIHtGaXJpbmdTdHJhdGVneX1cbiAqIEBwcml2YXRlXG4gKi9cbnZhciBfZmlyaW5nU3RyYXRlZ3k7XG5cbi8qKlxuICogVHVycmV0IGRlc2NyaXB0aW9uXG4gKlxuICogZGVmaW5lcyBhIHB1YmxpYyB2YXJpYWJsZSBhbmQgY2FsbHMgaW5pdCAtIGNoYW5nZSB0aGlzIGNvbnN0cnVjdG9yIHRvIHN1aXQgeW91ciBuZWVkcy5cbiAqIG5iLiB0aGVyZSdzIG5vIHJlcXVpcmVtZW50IHRvIGNhbGwgYW4gaW5pdCBmdW5jdGlvblxuICpcbiAqIEBjbGFzcyBUdXJyZXRcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBUdXJyZXQoZ3JvdXBzLCBzcHJpdGUsIHN0cmF0ZWd5KSB7XG5cblx0dGhpcy5ncm91cHMgPSBncm91cHM7XG5cdHRoaXMub3JpZ2luID0gc3ByaXRlO1xuXG5cdHRoaXMuZmlyaW5nU3RyYXRlZ3kgPSBzdHJhdGVneTtcbn1cblxudmFyIHAgPSBUdXJyZXQucHJvdG90eXBlO1xuXG4vKipcbiAqIEZpcmluZ1N0cmF0ZWd5IGluaXRpYWxpc2F0aW9uXG4gKlxuICogQG1ldGhvZCBzZXRTdHJhdGVneVxuICogQHBhcmFtIHtGaXJpbmdTdHJhdGVneX0gZmlyaW5nU3RyYXRlZ3lcbiAqL1xucC5zZXRTdHJhdGVneSA9IGZ1bmN0aW9uKGZpcmluZ1N0cmF0ZWd5KSB7XG5cdF9maXJpbmdTdHJhdGVneSA9IGZpcmluZ1N0cmF0ZWd5O1xufTtcblxucC5maXJlID0gZnVuY3Rpb24oKSB7XG5cdGNvbnNvbGUubG9nKCdGaXJlIScsIF9maXJpbmdTdHJhdGVneSk7XG5cdHRoaXMuZmlyaW5nU3RyYXRlZ3kuZmlyZSgpO1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gVHVycmV0O1xuIiwiLyoqXG4gKiBGaXJpbmdTdHJhdGVneSBkZXNjcmlwdGlvblxuICpcbiAqIGRlZmluZXMgYSBwdWJsaWMgdmFyaWFibGUgYW5kIGNhbGxzIGluaXQgLSBjaGFuZ2UgdGhpcyBjb25zdHJ1Y3RvciB0byBzdWl0IHlvdXIgbmVlZHMuXG4gKiBuYi4gdGhlcmUncyBubyByZXF1aXJlbWVudCB0byBjYWxsIGFuIGluaXQgZnVuY3Rpb25cbiAqXG4gKiBAY2xhc3MgRmlyaW5nU3RyYXRlZ3lcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBGaXJpbmdTdHJhdGVneShvcmlnaW4sIGNvbGxpc2lvbnMsIGdyb3VwcywgYnVsbGV0Qm1wKSB7XG5cdHRoaXMub3JpZ2luID0gb3JpZ2luO1xuXG5cdHRoaXMuY29sbGlzaW9ucyA9IGNvbGxpc2lvbnM7XG5cblx0dGhpcy5ncm91cHMgPSBncm91cHM7XG5cblx0dGhpcy5idWxsZXRCaXRtYXAgPSBidWxsZXRCbXA7XG59XG5cbnZhciBwID0gRmlyaW5nU3RyYXRlZ3kucHJvdG90eXBlO1xuXG4vKipcbiAqIEZpcmluZ1N0cmF0ZWd5IGluaXRpYWxpc2F0aW9uXG4gKlxuICogQG1ldGhvZCBmaXJlXG4gKi9cbnAuZmlyZSA9IGZ1bmN0aW9uKCkge1xuXHRjb25zb2xlLmxvZygnQWJzdHJhY3QgRmlyZScpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEZpcmluZ1N0cmF0ZWd5OyIsInZhciBGaXJpbmdTdHJhdGVneSA9IHJlcXVpcmUoJy4vRmlyaW5nU3RyYXRlZ3knKTtcblxuLyoqXG4gKiBAbWV0aG9kIGJ1bGxldEVuZFxuICogQHBhcmFtIGJ1bGxldEJvZHlcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGJ1bGxldEVuZChidWxsZXRCb2R5KSB7XG5cdGJ1bGxldEJvZHkuc3ByaXRlLmtpbGwoKTtcblx0dGhpcy5ncm91cHMuYnVsbGV0cy5yZW1vdmUoYnVsbGV0Qm9keS5zcHJpdGUpO1xufVxuXG4vKipcbiAqIEZvcndhcmRzRmlyZSBkZXNjcmlwdGlvblxuICpcbiAqIGRlZmluZXMgYSBwdWJsaWMgdmFyaWFibGUgYW5kIGNhbGxzIGluaXQgLSBjaGFuZ2UgdGhpcyBjb25zdHJ1Y3RvciB0byBzdWl0IHlvdXIgbmVlZHMuXG4gKiBuYi4gdGhlcmUncyBubyByZXF1aXJlbWVudCB0byBjYWxsIGFuIGluaXQgZnVuY3Rpb25cbiAqXG4gKiBAY2xhc3MgRm9yd2FyZHNGaXJlXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gRm9yd2FyZHNGaXJlKG9yaWdpbiwgY29sbGlzaW9ucywgZ3JvdXBzLCBidWxsZXRCbXApIHtcblx0RmlyaW5nU3RyYXRlZ3kuY2FsbCh0aGlzLCBvcmlnaW4sIGNvbGxpc2lvbnMsIGdyb3VwcywgYnVsbGV0Qm1wKTtcbn1cblxudmFyIHAgPSBGb3J3YXJkc0ZpcmUucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShGaXJpbmdTdHJhdGVneS5wcm90b3R5cGUpO1xucC5jb25zdHJ1Y3RvciA9IEZvcndhcmRzRmlyZTtcblxuLyoqXG4gKiBGb3J3YXJkc0ZpcmUgaW5pdGlhbGlzYXRpb25cbiAqXG4gKiBAbWV0aG9kIHNob290XG4gKi9cbnAuZmlyZSA9IGZ1bmN0aW9uKCkge1xuXHRjb25zb2xlLmxvZygnZmlyZScpO1xuXHR2YXIgbWFnbml0dWUgPSAyNDA7XG5cdHZhciBidWxsZXQgPSBnYW1lLm1ha2Uuc3ByaXRlKHRoaXMub3JpZ2luLnBvc2l0aW9uLngsIHRoaXMub3JpZ2luLnBvc2l0aW9uLnksIHRoaXMuYnVsbGV0Qml0bWFwKTtcblx0YnVsbGV0LmFuY2hvci5zZXRUbygwLjUsMC41KTtcblx0Z2FtZS5waHlzaWNzLnAyLmVuYWJsZShidWxsZXQpO1xuXHR2YXIgYW5nbGUgPSB0aGlzLm9yaWdpbi5ib2R5LnJvdGF0aW9uICsgKDMgKiBNYXRoLlBJKSAvIDI7XG5cdGJ1bGxldC5ib2R5LmNvbGxpZGVzV29ybGRCb3VuZHMgPSBmYWxzZTtcblx0YnVsbGV0LmJvZHkuc2V0Q29sbGlzaW9uR3JvdXAodGhpcy5jb2xsaXNpb25zLmJ1bGxldHMpO1xuXHRidWxsZXQuYm9keS5jb2xsaWRlcyh0aGlzLmNvbGxpc2lvbnMudGVycmFpbiwgYnVsbGV0RW5kLCB0aGlzKTtcblx0YnVsbGV0LmJvZHkuZGF0YS5ncmF2aXR5U2NhbGUgPSAwO1xuXHRidWxsZXQuYm9keS52ZWxvY2l0eS54ID0gbWFnbml0dWUgKiBNYXRoLmNvcyhhbmdsZSkgKyB0aGlzLm9yaWdpbi5ib2R5LnZlbG9jaXR5Lng7XG5cdGJ1bGxldC5ib2R5LnZlbG9jaXR5LnkgPSBtYWduaXR1ZSAqIE1hdGguc2luKGFuZ2xlKSArIHRoaXMub3JpZ2luLmJvZHkudmVsb2NpdHkueTtcblx0dGhpcy5ncm91cHMuYnVsbGV0cy5hZGQoYnVsbGV0KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRm9yd2FyZHNGaXJlOyIsInZhciBGaXJpbmdTdHJhdGVneSA9IHJlcXVpcmUoJy4vRmlyaW5nU3RyYXRlZ3knKTtcblxuLyoqXG4gKiBAbWV0aG9kIGJ1bGxldEVuZFxuICogQHBhcmFtIGJ1bGxldEJvZHlcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGJ1bGxldEVuZChidWxsZXRCb2R5KSB7XG5cdGJ1bGxldEJvZHkuc3ByaXRlLmtpbGwoKTtcblx0dGhpcy5ncm91cHMuYnVsbGV0cy5yZW1vdmUoYnVsbGV0Qm9keS5zcHJpdGUpO1xufVxuXG4vKipcbiAqIEZvcndhcmRzRmlyZSBkZXNjcmlwdGlvblxuICpcbiAqIGRlZmluZXMgYSBwdWJsaWMgdmFyaWFibGUgYW5kIGNhbGxzIGluaXQgLSBjaGFuZ2UgdGhpcyBjb25zdHJ1Y3RvciB0byBzdWl0IHlvdXIgbmVlZHMuXG4gKiBuYi4gdGhlcmUncyBubyByZXF1aXJlbWVudCB0byBjYWxsIGFuIGluaXQgZnVuY3Rpb25cbiAqXG4gKiBAY2xhc3MgRm9yd2FyZHNGaXJlXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gU3ByZWFkRmlyaW5nKG9yaWdpbiwgY29sbGlzaW9ucywgZ3JvdXBzLCBidWxsZXRCbXApIHtcblx0RmlyaW5nU3RyYXRlZ3kuY2FsbCh0aGlzLCBvcmlnaW4sIGNvbGxpc2lvbnMsIGdyb3VwcywgYnVsbGV0Qm1wKTtcbn1cblxudmFyIHAgPSBTcHJlYWRGaXJpbmcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShGaXJpbmdTdHJhdGVneS5wcm90b3R5cGUpO1xucC5jb25zdHJ1Y3RvciA9IFNwcmVhZEZpcmluZztcblxuLyoqXG4gKiBGb3J3YXJkc0ZpcmUgaW5pdGlhbGlzYXRpb25cbiAqXG4gKiBAbWV0aG9kIHNob290XG4gKi9cbnAuZmlyZSA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgbWFnbml0dWUgPSAyNDA7XG5cdHZhciBidWxsZXQgPSBnYW1lLm1ha2Uuc3ByaXRlKHRoaXMub3JpZ2luLnBvc2l0aW9uLngsIHRoaXMub3JpZ2luLnBvc2l0aW9uLnksIHRoaXMuYnVsbGV0Qml0bWFwKTtcblx0YnVsbGV0LmFuY2hvci5zZXRUbygwLjUsMC41KTtcblx0Z2FtZS5waHlzaWNzLnAyLmVuYWJsZShidWxsZXQpO1xuXG5cdHZhciBhbmdsZSA9IHRoaXMub3JpZ2luLmJvZHkucm90YXRpb24gKyBNYXRoLlBJICsgTWF0aC5yYW5kb20oKSpNYXRoLlBJO1xuXHRidWxsZXQuYm9keS5jb2xsaWRlc1dvcmxkQm91bmRzID0gZmFsc2U7XG5cdGJ1bGxldC5ib2R5LnNldENvbGxpc2lvbkdyb3VwKHRoaXMuY29sbGlzaW9ucy5idWxsZXRzKTtcblx0YnVsbGV0LmJvZHkuY29sbGlkZXModGhpcy5jb2xsaXNpb25zLnRlcnJhaW4sIGJ1bGxldEVuZCwgdGhpcyk7XG5cdGJ1bGxldC5ib2R5LmRhdGEuZ3Jhdml0eVNjYWxlID0gMDtcblx0YnVsbGV0LmJvZHkudmVsb2NpdHkueCA9IG1hZ25pdHVlICogTWF0aC5jb3MoYW5nbGUpICsgdGhpcy5vcmlnaW4uYm9keS52ZWxvY2l0eS54O1xuXHRidWxsZXQuYm9keS52ZWxvY2l0eS55ID0gbWFnbml0dWUgKiBNYXRoLnNpbihhbmdsZSkgKyB0aGlzLm9yaWdpbi5ib2R5LnZlbG9jaXR5Lnk7XG5cdHRoaXMuZ3JvdXBzLmJ1bGxldHMuYWRkKGJ1bGxldCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNwcmVhZEZpcmluZzsiLCJ2YXIgZ2FtZSA9IHdpbmRvdy5nYW1lO1xudmFyIHByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9wcm9wZXJ0aWVzJyk7XG5cbi8qKlxuICogQSBwcml2YXRlIHZhciBkZXNjcmlwdGlvblxuICpcbiAqIEBwcm9wZXJ0eSBteVByaXZhdGVWYXJcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKiBAcHJpdmF0ZVxuICovXG52YXIgbXlQcml2YXRlVmFyID0gMDtcblxuLyoqXG4gKiBDb2xsaXNpb25zIGRlc2NyaXB0aW9uXG4gKiBjYWxscyBpbml0XG4gKlxuICogQGNsYXNzIENvbGxpc2lvbnNcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBDb2xsaXNpb25zIChjb2xsaXNpb25zKSB7XG5cdC8qKlxuXHQgKiBBIHB1YmxpYyB2YXIgZGVzY3JpcHRpb25cblx0ICpcblx0ICogQHByb3BlcnR5IG15UHVibGljVmFyXG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR0aGlzLm15UHVibGljVmFyID0gMTtcblx0dGhpcy5pbml0KCk7XG59XG5cbnZhciBwID0gQ29sbGlzaW9ucy5wcm90b3R5cGU7XG5cbi8qKlxuICogQ29sbGlzaW9ucyBpbml0aWFsaXNhdGlvblxuICpcbiAqIEBtZXRob2QgaW5pdFxuICovXG5wLmluaXQgPSBmdW5jdGlvbigpIHtcblx0Z2FtZS5waHlzaWNzLnN0YXJ0U3lzdGVtKFBoYXNlci5QaHlzaWNzLlAySlMpO1xuXHRnYW1lLnBoeXNpY3MucDIuc2V0SW1wYWN0RXZlbnRzKHRydWUpO1xuXHRnYW1lLnBoeXNpY3MucDIuZ3Jhdml0eS55ID0gMTAwO1xuXG5cdHRoaXMucGxheWVycyA9IGdhbWUucGh5c2ljcy5wMi5jcmVhdGVDb2xsaXNpb25Hcm91cCgpO1xuXHR0aGlzLnRlcnJhaW4gPSBnYW1lLnBoeXNpY3MucDIuY3JlYXRlQ29sbGlzaW9uR3JvdXAoKTtcblx0dGhpcy5idWxsZXRzID0gZ2FtZS5waHlzaWNzLnAyLmNyZWF0ZUNvbGxpc2lvbkdyb3VwKCk7XG5cdHRoaXMuZW5lbWllcyA9IGdhbWUucGh5c2ljcy5wMi5jcmVhdGVDb2xsaXNpb25Hcm91cCgpO1xuXG5cdGdhbWUucGh5c2ljcy5wMi51cGRhdGVCb3VuZHNDb2xsaXNpb25Hcm91cCgpO1xufTtcblxuLyoqXG4qXG4qL1xucC5zZXQgPSBmdW5jdGlvbihzcHJpdGUsIGNvbGxpc2lvbkdyb3Vwcykge1xuXHRzcHJpdGUuYm9keS5jb2xsaWRlcyhjb2xsaXNpb25Hcm91cHMpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxpc2lvbnM7XG4iLCIvKipcbiAqIEEgcHJpdmF0ZSB2YXIgZGVzY3JpcHRpb25cbiAqXG4gKiBAcHJvcGVydHkgbXlQcml2YXRlVmFyXG4gKiBAdHlwZSB7bnVtYmVyfVxuICogQHByaXZhdGVcbiAqL1xudmFyIG15UHJpdmF0ZVZhciA9IDA7XG5cbi8qKlxuICogR3JvdXBzIGRlc2NyaXB0aW9uXG4gKiBjYWxscyBpbml0XG4gKlxuICogQGNsYXNzIEdyb3Vwc1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIEdyb3VwcyAoKSB7XG5cdC8qKlxuXHQgKiBBIHB1YmxpYyB2YXIgZGVzY3JpcHRpb25cblx0ICpcblx0ICogQHByb3BlcnR5IG15UHVibGljVmFyXG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR0aGlzLm15UHVibGljVmFyID0gMTtcblx0dGhpcy5pbml0KCk7XG59XG5cbnZhciBwID0gR3JvdXBzLnByb3RvdHlwZTtcblxuLyoqXG4gKiBHcm91cHMgaW5pdGlhbGlzYXRpb25cbiAqXG4gKiBAbWV0aG9kIGluaXRcbiAqL1xucC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuYWN0b3JzID0gZ2FtZS5hZGQuZ3JvdXAoKTtcblx0dGhpcy50ZXJyYWluID0gZ2FtZS5hZGQuZ3JvdXAoKTtcblx0dGhpcy5idWxsZXRzID0gZ2FtZS5hZGQuZ3JvdXAoKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBHcm91cHM7IiwidmFyIGdhbWUgPSB3aW5kb3cuZ2FtZTtcbi8qKlxuICogVXNlckNvbnRyb2wgZGVzY3JpcHRpb25cbiAqXG4gKiBkZWZpbmVzIGEgcHVibGljIHZhcmlhYmxlIGFuZCBjYWxscyBpbml0IC0gY2hhbmdlIHRoaXMgY29uc3RydWN0b3IgdG8gc3VpdCB5b3VyIG5lZWRzLlxuICogbmIuIHRoZXJlJ3Mgbm8gcmVxdWlyZW1lbnQgdG8gY2FsbCBhbiBpbml0IGZ1bmN0aW9uXG4gKlxuICogQGNsYXNzIFVzZXJDb250cm9sXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gVXNlckNvbnRyb2woZW5hYmxlSm95cGFkKSB7XG5cblxuXHR0aGlzLmluaXRLZXlzKCk7XG5cdC8vdGhpcy5pbml0Sm95cGFkKCk7XG5cblx0dGhpcy5pc0pveXBhZEVuYWJsZWQgPSBlbmFibGVKb3lwYWQ7XG59XG5cbnZhciBwID0gVXNlckNvbnRyb2wucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZXJDb250cm9sIGluaXRpYWxpc2F0aW9uXG4gKlxuICogQG1ldGhvZCBpbml0XG4gKi9cbnAuaW5pdEtleXMgPSBmdW5jdGlvbigpIHtcblxuXHR0aGlzLmN1cnNvcnMgXHQgID0gZ2FtZS5pbnB1dC5rZXlib2FyZC5jcmVhdGVDdXJzb3JLZXlzKCk7XG5cdHRoaXMuc3BhY2VQcmVzcyA9IGdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5TUEFDRUJBUik7XG5cdHRoaXMueEtleVx0ICAgICAgPSBnYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuWCk7XG5cbn07XG5cbnAuaW5pdEpveXBhZCA9IGZ1bmN0aW9uKCkge1xuXG5cdHRoaXMucGFkID0gZ2FtZS5wbHVnaW5zLmFkZChQaGFzZXIuVmlydHVhbEpveXN0aWNrKTtcblx0dGhpcy5zdGljayA9IHRoaXMucGFkLmFkZERQYWQoMCwgMCwgMjAwLCAnZHBhZCcpO1xuXHR0aGlzLnN0aWNrLmFsaWduQm90dG9tTGVmdCgpO1xuXHR0aGlzLnN0aWNrLnNjYWxlID0gMC44O1xuXG5cdHRoaXMuYnV0dG9uQSA9IHRoaXMucGFkLmFkZEJ1dHRvbig1MjUsIDQyMCwgJ2RwYWQnLCAnYnV0dG9uMS11cCcsICdidXR0b24xLWRvd24nKTtcblx0dGhpcy5idXR0b25BLnNjYWxlID0gMC44O1xuXG5cdHRoaXMuYnV0dG9uQiA9IHRoaXMucGFkLmFkZEJ1dHRvbig2MzAsIDM5MCwgJ2RwYWQnLCAnYnV0dG9uMi11cCcsICdidXR0b24yLWRvd24nKTtcblx0dGhpcy5idXR0b25CLnNjYWxlID0gMC44O1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXJDb250cm9sO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRpc3RBdG9COiBmdW5jdGlvbihwb2ludEEsIHBvaW50Qikge1xuXG4gICAgdmFyIEEgPSBwb2ludEIueCAtIHBvaW50QS54O1xuICAgIHZhciBCID0gcG9pbnRCLnkgLSBwb2ludEEueTtcblxuICAgIHJldHVybiBNYXRoLnNxcnQoQSpBICsgQipCKTtcbiAgfVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4vcHJvcGVydGllcycpO1xuXG52YXIgZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZShwcm9wZXJ0aWVzLndpZHRoLHByb3BlcnRpZXMuaGVpZ2h0LCBQaGFzZXIuQVVUTyk7XG53aW5kb3cuZ2FtZSA9IGdhbWU7XG5cbmdhbWUuc3RhdGUuYWRkKCdwbGF5JywgcmVxdWlyZSgnLi9zdGF0ZXMvcGxheScpKTtcbmdhbWUuc3RhdGUuYWRkKCdsb2FkJywgcmVxdWlyZSgnLi9zdGF0ZXMvbG9hZCcpKTtcbmdhbWUuc3RhdGUuYWRkKCdtZW51JywgcmVxdWlyZSgnLi9zdGF0ZXMvbWVudScpKTtcbmdhbWUuc3RhdGUuYWRkKCdib290JywgcmVxdWlyZSgnLi9zdGF0ZXMvYm9vdCcpKTtcblxuZ2FtZS5zdGF0ZS5zdGFydCgnYm9vdCcpO1xuIiwiOyB2YXIgX19icm93c2VyaWZ5X3NoaW1fcmVxdWlyZV9fPXJlcXVpcmU7KGZ1bmN0aW9uIGJyb3dzZXJpZnlTaGltKG1vZHVsZSwgZXhwb3J0cywgcmVxdWlyZSwgZGVmaW5lLCBicm93c2VyaWZ5X3NoaW1fX2RlZmluZV9fbW9kdWxlX19leHBvcnRfXykge1xuLy8gc3RhdHMuanMgLSBodHRwOi8vZ2l0aHViLmNvbS9tcmRvb2Ivc3RhdHMuanNcbnZhciBTdGF0cz1mdW5jdGlvbigpe3ZhciBsPURhdGUubm93KCksbT1sLGc9MCxuPUluZmluaXR5LG89MCxoPTAscD1JbmZpbml0eSxxPTAscj0wLHM9MCxmPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7Zi5pZD1cInN0YXRzXCI7Zi5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsZnVuY3Rpb24oYil7Yi5wcmV2ZW50RGVmYXVsdCgpO3QoKytzJTIpfSwhMSk7Zi5zdHlsZS5jc3NUZXh0PVwid2lkdGg6ODBweDtvcGFjaXR5OjAuOTtjdXJzb3I6cG9pbnRlclwiO3ZhciBhPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7YS5pZD1cImZwc1wiO2Euc3R5bGUuY3NzVGV4dD1cInBhZGRpbmc6MCAwIDNweCAzcHg7dGV4dC1hbGlnbjpsZWZ0O2JhY2tncm91bmQtY29sb3I6IzAwMlwiO2YuYXBwZW5kQ2hpbGQoYSk7dmFyIGk9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtpLmlkPVwiZnBzVGV4dFwiO2kuc3R5bGUuY3NzVGV4dD1cImNvbG9yOiMwZmY7Zm9udC1mYW1pbHk6SGVsdmV0aWNhLEFyaWFsLHNhbnMtc2VyaWY7Zm9udC1zaXplOjlweDtmb250LXdlaWdodDpib2xkO2xpbmUtaGVpZ2h0OjE1cHhcIjtcbmkuaW5uZXJIVE1MPVwiRlBTXCI7YS5hcHBlbmRDaGlsZChpKTt2YXIgYz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2MuaWQ9XCJmcHNHcmFwaFwiO2Muc3R5bGUuY3NzVGV4dD1cInBvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOjc0cHg7aGVpZ2h0OjMwcHg7YmFja2dyb3VuZC1jb2xvcjojMGZmXCI7Zm9yKGEuYXBwZW5kQ2hpbGQoYyk7NzQ+Yy5jaGlsZHJlbi5sZW5ndGg7KXt2YXIgaj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtqLnN0eWxlLmNzc1RleHQ9XCJ3aWR0aDoxcHg7aGVpZ2h0OjMwcHg7ZmxvYXQ6bGVmdDtiYWNrZ3JvdW5kLWNvbG9yOiMxMTNcIjtjLmFwcGVuZENoaWxkKGopfXZhciBkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7ZC5pZD1cIm1zXCI7ZC5zdHlsZS5jc3NUZXh0PVwicGFkZGluZzowIDAgM3B4IDNweDt0ZXh0LWFsaWduOmxlZnQ7YmFja2dyb3VuZC1jb2xvcjojMDIwO2Rpc3BsYXk6bm9uZVwiO2YuYXBwZW5kQ2hpbGQoZCk7dmFyIGs9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbmsuaWQ9XCJtc1RleHRcIjtrLnN0eWxlLmNzc1RleHQ9XCJjb2xvcjojMGYwO2ZvbnQtZmFtaWx5OkhlbHZldGljYSxBcmlhbCxzYW5zLXNlcmlmO2ZvbnQtc2l6ZTo5cHg7Zm9udC13ZWlnaHQ6Ym9sZDtsaW5lLWhlaWdodDoxNXB4XCI7ay5pbm5lckhUTUw9XCJNU1wiO2QuYXBwZW5kQ2hpbGQoayk7dmFyIGU9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtlLmlkPVwibXNHcmFwaFwiO2Uuc3R5bGUuY3NzVGV4dD1cInBvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOjc0cHg7aGVpZ2h0OjMwcHg7YmFja2dyb3VuZC1jb2xvcjojMGYwXCI7Zm9yKGQuYXBwZW5kQ2hpbGQoZSk7NzQ+ZS5jaGlsZHJlbi5sZW5ndGg7KWo9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIiksai5zdHlsZS5jc3NUZXh0PVwid2lkdGg6MXB4O2hlaWdodDozMHB4O2Zsb2F0OmxlZnQ7YmFja2dyb3VuZC1jb2xvcjojMTMxXCIsZS5hcHBlbmRDaGlsZChqKTt2YXIgdD1mdW5jdGlvbihiKXtzPWI7c3dpdGNoKHMpe2Nhc2UgMDphLnN0eWxlLmRpc3BsYXk9XG5cImJsb2NrXCI7ZC5zdHlsZS5kaXNwbGF5PVwibm9uZVwiO2JyZWFrO2Nhc2UgMTphLnN0eWxlLmRpc3BsYXk9XCJub25lXCIsZC5zdHlsZS5kaXNwbGF5PVwiYmxvY2tcIn19O3JldHVybntSRVZJU0lPTjoxMixkb21FbGVtZW50OmYsc2V0TW9kZTp0LGJlZ2luOmZ1bmN0aW9uKCl7bD1EYXRlLm5vdygpfSxlbmQ6ZnVuY3Rpb24oKXt2YXIgYj1EYXRlLm5vdygpO2c9Yi1sO249TWF0aC5taW4obixnKTtvPU1hdGgubWF4KG8sZyk7ay50ZXh0Q29udGVudD1nK1wiIE1TIChcIituK1wiLVwiK28rXCIpXCI7dmFyIGE9TWF0aC5taW4oMzAsMzAtMzAqKGcvMjAwKSk7ZS5hcHBlbmRDaGlsZChlLmZpcnN0Q2hpbGQpLnN0eWxlLmhlaWdodD1hK1wicHhcIjtyKys7Yj5tKzFFMyYmKGg9TWF0aC5yb3VuZCgxRTMqci8oYi1tKSkscD1NYXRoLm1pbihwLGgpLHE9TWF0aC5tYXgocSxoKSxpLnRleHRDb250ZW50PWgrXCIgRlBTIChcIitwK1wiLVwiK3ErXCIpXCIsYT1NYXRoLm1pbigzMCwzMC0zMCooaC8xMDApKSxjLmFwcGVuZENoaWxkKGMuZmlyc3RDaGlsZCkuc3R5bGUuaGVpZ2h0PVxuYStcInB4XCIsbT1iLHI9MCk7cmV0dXJuIGJ9LHVwZGF0ZTpmdW5jdGlvbigpe2w9dGhpcy5lbmQoKX19fTtcIm9iamVjdFwiPT09dHlwZW9mIG1vZHVsZSYmKG1vZHVsZS5leHBvcnRzPVN0YXRzKTtcblxuOyBicm93c2VyaWZ5X3NoaW1fX2RlZmluZV9fbW9kdWxlX19leHBvcnRfXyh0eXBlb2YgU3RhdHMgIT0gXCJ1bmRlZmluZWRcIiA/IFN0YXRzIDogd2luZG93LlN0YXRzKTtcblxufSkuY2FsbChnbG9iYWwsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZnVuY3Rpb24gZGVmaW5lRXhwb3J0KGV4KSB7IG1vZHVsZS5leHBvcnRzID0gZXg7IH0pO1xuIiwiLyoqXG4gKiBEZWZpbmVzIGJ1aWxkIHNldHRpbmdzIGZvciB0aGUgdGhydXN0LWVuZ2luZVxuICpcbiAqIEBuYW1lc3BhY2UgdGhydXN0LWVuZ2luZVxuICogQG1vZHVsZSBwcm9wZXJ0aWVzXG4gKiBAY2xhc3NcbiAqIEBzdGF0aWNcbiAqIEB0eXBlIHt7ZW5hYmxlSm95cGFkOiBib29sZWFuLCBmYXRhbENvbGxpc2lvbnM6IGJvb2xlYW4sIHNjYWxlOiB7bW9kZTogbnVtYmVyfSwgZHJhd1N0YXRzOiBib29sZWFufX1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGRlYnVnUGh5c2ljczogZmFsc2UsXG5cdGNvbGxpZGVXb3JsZEJvdW5kczogdHJ1ZSxcblx0ZW5hYmxlSm95cGFkOiBmYWxzZSxcblx0ZmF0YWxDb2xsaXNpb25zOiB0cnVlLFxuXHRzY2FsZToge1xuXHRcdG1vZGU6IFBoYXNlci5TY2FsZU1hbmFnZXIuTk9fU0NBTEVcblx0fSxcblx0ZHJhd1N0YXRzOiB0cnVlLFxuXHRkcmF3TW9udGFpbnM6IGZhbHNlLFxuXHRkcmF3QmFja2dyb3VuZDogZmFsc2UsXG5cdHdpZHRoOiA3MDAsXG5cdGhlaWdodDogNTAwLFxuXHRnYW1lUGxheToge1xuXHRcdGZyZWVPcmJMb2NraW5nOiBmYWxzZSxcblx0XHRhdXRvT3JiTG9ja2luZzogdHJ1ZSxcblx0XHR0cmFjdG9yQmVhbUxlbmd0aDogODAsXG5cdFx0dHJhY3RvckJlYW1WYXJpYXRpb246IDEwLFxuXHRcdGxvY2tpbmdEdXJhdGlvbjogOTAwXG5cdH1cbn07XG4iLCJ2YXIgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL3Byb3BlcnRpZXMnKTtcbnZhciBmZWF0dXJlcyA9IHJlcXVpcmUoJy4uL3V0aWxzL2ZlYXR1cmVzJyk7XG52YXIgU3RhdHNNb2R1bGUgPSByZXF1aXJlKCcuLi91dGlscy9TdGF0c01vZHVsZScpO1xudmFyIFVzZXJDb250cm9sID0gcmVxdWlyZSgnLi4vZW52aXJvbm1lbnQvVXNlckNvbnRyb2wnKTtcblxudmFyIHN0YXRzO1xudmFyIHVzZXJDb250cm9sO1xuLyoqXG4gKiBUaGUgYm9vdCBzdGF0ZVxuICpcbiAqIEBuYW1lc3BhY2Ugc3RhdGVzXG4gKiBAbW9kdWxlIGJvb3RcbiAqIEB0eXBlIHt7Y3JlYXRlOiBGdW5jdGlvbiwgdXBkYXRlOiBGdW5jdGlvbn19XG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRwcmVsb2FkOiBmdW5jdGlvbigpIHtcblx0XHRnYW1lLnNjYWxlLnNjYWxlTW9kZSA9IHByb3BlcnRpZXMuc2NhbGUubW9kZTtcblx0XHRnYW1lLnNjYWxlLnNldFNjcmVlblNpemUoKTtcblx0fSxcblxuXHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXG5cdFx0ZmVhdHVyZXMuaW5pdCgpO1xuXG5cdFx0c3RhdHMgPSBuZXcgU3RhdHNNb2R1bGUoKTtcblxuXHRcdHVzZXJDb250cm9sID0gbmV3IFVzZXJDb250cm9sKGZlYXR1cmVzLmlzVG91Y2hTY3JlZW4gfHwgcHJvcGVydGllcy5lbmFibGVKb3lwYWQpO1xuXG5cdFx0Y29uc29sZS53YXJuKFwiSW5zdHJ1Y3Rpb25zOiBVc2UgQ3Vyc29ycyB0byBtb3ZlIHNoaXAsIHNwYWNlIHRvIHNob290LCBjb2xsZWN0IG9yYiBieSBwYXNzaW5nIG5lYXJcIik7XG5cdFx0Y29uc29sZS53YXJuKFwiVG91Y2hTY3JlZW5EZXRlY3RlZDpcIiwgZmVhdHVyZXMuaXNUb3VjaFNjcmVlbik7XG5cblx0XHRnYW1lLnN0YXRzID0gc3RhdHM7XG5cblx0XHRnYW1lLmNvbnRyb2xzID0gdXNlckNvbnRyb2w7XG5cblx0XHRnYW1lLnN0YXRlLnN0YXJ0KCdwbGF5Jyk7XG5cblxuXG5cdH0sXG5cdHVwZGF0ZTogZnVuY3Rpb24oKSB7XG5cblx0fVxufTtcbiIsIi8qKlxuICogVGhlIGxvYWQgc3RhdGVcbiAqXG4gKiBAbmFtZXNwYWNlIHN0YXRlc1xuICogQG1vZHVsZSBsb2FkXG4gKiBAdHlwZSB7e2NyZWF0ZTogRnVuY3Rpb24sIHVwZGF0ZTogRnVuY3Rpb259fVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblxuXHR9LFxuXHR1cGRhdGU6IGZ1bmN0aW9uKCkge1xuXG5cdH1cbn07IiwiLyoqXG4gKiBUaGUgbWVudSBzdGF0ZVxuICpcbiAqIEBuYW1lc3BhY2Ugc3RhdGVzXG4gKiBAbW9kdWxlIG1lbnVcbiAqIEB0eXBlIHt7Y3JlYXRlOiBGdW5jdGlvbiwgdXBkYXRlOiBGdW5jdGlvbn19XG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXG5cdH0sXG5cdHVwZGF0ZTogZnVuY3Rpb24oKSB7XG5cblx0fVxufTsiLCIvL2ltcG9ydHNcbnZhciBwcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vcHJvcGVydGllcycpO1xudmFyIENvbGxpc2lvbnMgPSByZXF1aXJlKCcuLi9lbnZpcm9ubWVudC9Db2xsaXNpb25zJyk7XG52YXIgR3JvdXBzID0gcmVxdWlyZSgnLi4vZW52aXJvbm1lbnQvR3JvdXBzJyk7XG52YXIgUGxheWVyID0gcmVxdWlyZSgnLi4vYWN0b3JzL1BsYXllcicpO1xudmFyIExpbXBldEd1biA9IHJlcXVpcmUoJy4uL2FjdG9ycy9MaW1wZXRHdW4nKTtcbnZhciBPcmIgPSByZXF1aXJlKCcuLi9hY3RvcnMvT3JiJyk7XG52YXIgTWFwID0gcmVxdWlyZSgnLi4vYWN0b3JzL01hcCcpO1xudmFyIEJhY2tncm91bmQgPSByZXF1aXJlKCcuLi9hY3RvcnMvQmFja2dyb3VuZCcpO1xudmFyIFRyYWN0b3JCZWFtID0gcmVxdWlyZSgnLi4vYWN0b3JzL1RyYWN0b3JCZWFtJyk7XG52YXIgZmVhdHVyZXMgPSByZXF1aXJlKCcuLi91dGlscy9mZWF0dXJlcycpO1xuXG4vL2Vudmlyb25tZW50XG52YXIgY29sbGlzaW9ucztcbnZhciBncm91cHM7XG5cbi8vYWN0b3JzXG52YXIgcGxheWVyO1xudmFyIG9yYjtcbnZhciB0cmFjdG9yQmVhbTtcbnZhciBiYWNrZ3JvdW5kO1xudmFyIGxpbXBldDE7XG52YXIgbGltcGV0MjtcblxuLy9jb250cm9scztcbnZhciBidXR0b25BRG93biA9IGZhbHNlO1xudmFyIGJ1dHRvbkJEb3duID0gZmFsc2U7XG52YXIgaXNYRG93biAgICAgPSBmYWxzZTtcblxuXG5cbi8qKlxuICogVGhlIHBsYXkgc3RhdGUgLSB0aGlzIGlzIHdoZXJlIHRoZSBtYWdpYyBoYXBwZW5zXG4gKlxuICogQG5hbWVzcGFjZSBzdGF0ZXNcbiAqIEBtb2R1bGUgcGxheVxuICogQHR5cGUge3tjcmVhdGU6IEZ1bmN0aW9uLCB1cGRhdGU6IEZ1bmN0aW9ufX1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cblx0cHJlbG9hZDogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKGdhbWUuY29udHJvbHMuaXNKb3lwYWRFbmFibGVkKSB7XG5cdFx0XHRnYW1lLmxvYWQuYXRsYXMoJ2RwYWQnLCAnaW1hZ2VzL3ZpcnR1YWxqb3lzdGljay9za2lucy9kcGFkLnBuZycsICdpbWFnZXMvdmlydHVhbGpveXN0aWNrL3NraW5zL2RwYWQuanNvbicpO1xuXHRcdH1cblx0XHRnYW1lLmxvYWQuaW1hZ2UoJ3RocnVzdG1hcCcsICdpbWFnZXMvdGhydXN0LWxldmVsMi5wbmcnKTtcblx0XHRnYW1lLmxvYWQucGh5c2ljcygncGh5c2ljc0RhdGEnLCAnaW1hZ2VzL3RocnVzdC1sZXZlbDIuanNvbicpO1xuXHRcdGdhbWUubG9hZC5pbWFnZSgnc3RhcnMnLCAnaW1hZ2VzL3N0YXJmaWVsZC5wbmcnKTtcblx0XHRnYW1lLmxvYWQuaW1hZ2UoJ3BsYXllcicsICdpbWFnZXMvcGxheWVyXzMweDM3LnBuZycpO1xuXHRcdGdhbWUubG9hZC5waHlzaWNzKCdwbGF5ZXJQaHlzaWNzJywgJ2ltYWdlcy9wbGF5ZXJfMzB4MzcuanNvbicpO1xuXHR9LFxuXG5cdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5kZWZpbmVXb3JsZEJvdW5kcygpO1xuXHRcdHRoaXMuY3JlYXRlQWN0b3JzKCk7XG5cdFx0dGhpcy5jcmVhdGVHcm91cExheWVyaW5nKCk7XG5cdFx0dGhpcy5pbml0Q29udHJvbHMoKTtcblx0fSxcblx0dXBkYXRlOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmJlZ2luU3RhdHMoKTtcblx0XHR0aGlzLmNoZWNrUGxheWVySW5wdXQoKTtcblx0XHR0aGlzLmVuZFN0YXRzKCk7XG5cdH0sXG5cblx0Y2hlY2tQbGF5ZXJJbnB1dDogZnVuY3Rpb24oKXtcblx0XHRpZiAoKHRoaXMuc3RpY2sgJiYgdGhpcy5zdGljay5pc0Rvd24gJiYgdGhpcy5zdGljay5kaXJlY3Rpb24gPT09IFBoYXNlci5MRUZUKSB8fCB0aGlzLmN1cnNvcnMubGVmdC5pc0Rvd24pIHtcblx0XHRcdHBsYXllci5ib2R5LnJvdGF0ZUxlZnQoMTAwKTtcblx0XHR9IGVsc2UgaWYgKCh0aGlzLnN0aWNrICYmIHRoaXMuc3RpY2suaXNEb3duICYmIHRoaXMuc3RpY2suZGlyZWN0aW9uID09PSBQaGFzZXIuUklHSFQpIHx8IHRoaXMuY3Vyc29ycy5yaWdodC5pc0Rvd24pIHtcblx0XHRcdHBsYXllci5ib2R5LnJvdGF0ZVJpZ2h0KDEwMCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBsYXllci5ib2R5LnNldFplcm9Sb3RhdGlvbigpO1xuXHRcdH1cblx0XHRpZiAodGhpcy5jdXJzb3JzLnVwLmlzRG93biB8fCBidXR0b25BRG93bil7XG5cdFx0XHRwbGF5ZXIuYm9keS50aHJ1c3QoNDAwKTtcblx0XHR9XG5cdFx0aWYgKCF0cmFjdG9yQmVhbS5oYXNHcmFiYmVkKSB7XG5cdFx0XHRpZiAoaXNYRG93biB8fCBwcm9wZXJ0aWVzLmdhbWVQbGF5LmF1dG9PcmJMb2NraW5nKSB7XG5cdFx0XHRcdHBsYXllci5jaGVja09yYkRpc3RhbmNlKCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRyYWN0b3JCZWFtLmRyYXdCZWFtKHBsYXllci5wb3NpdGlvbik7XG5cdFx0fVxuXHR9LFxuXG5cdGRlZmluZVdvcmxkQm91bmRzOiBmdW5jdGlvbigpIHtcblx0XHRnYW1lLndvcmxkLnNldEJvdW5kcygwLCAwLCA5MjgsIDEyODApO1xuXHR9LFxuXG5cdGNyZWF0ZUFjdG9yczogZnVuY3Rpb24oKSB7XG5cdFx0Z3JvdXBzID0gbmV3IEdyb3VwcygpO1xuXHRcdGNvbGxpc2lvbnMgPSBuZXcgQ29sbGlzaW9ucygpO1xuXHRcdGlmIChwcm9wZXJ0aWVzLmRyYXdCYWNrZ3JvdW5kKSB7XG5cdFx0XHRiYWNrZ3JvdW5kID0gbmV3IEJhY2tncm91bmQoKTtcblx0XHR9XG5cdFx0cGxheWVyID0gbmV3IFBsYXllcihnYW1lLndvcmxkLmNlbnRlclgsIDMwMCwgY29sbGlzaW9ucywgZ3JvdXBzKTtcblx0XHRvcmIgPSBuZXcgT3JiKGNvbGxpc2lvbnMpO1xuXHRcdHRyYWN0b3JCZWFtID0gbmV3IFRyYWN0b3JCZWFtKG9yYik7XG5cdFx0cGxheWVyLnNldFRyYWN0b3JCZWFtKHRyYWN0b3JCZWFtKTtcblx0XHRsaW1wZXQxID0gbmV3IExpbXBldEd1big0MjgsIDExMDMsIDE1MywgY29sbGlzaW9ucywgZ3JvdXBzKTtcblx0XHRsaW1wZXQyID0gbmV3IExpbXBldEd1big3MTAsIDEwNTMsIDIwNiwgY29sbGlzaW9ucywgZ3JvdXBzKTtcblx0XHRtYXAgPSBuZXcgTWFwKGNvbGxpc2lvbnMpO1xuXG5cdFx0Z2FtZS5jYW1lcmEuZm9sbG93KHBsYXllcik7XG5cblx0XHRjb2xsaXNpb25zLnNldChvcmIsIFtjb2xsaXNpb25zLnBsYXllcnMsIGNvbGxpc2lvbnMudGVycmFpbiwgY29sbGlzaW9ucy5idWxsZXRzXSk7XG5cdFx0Y29sbGlzaW9ucy5zZXQobWFwLCBbY29sbGlzaW9ucy5wbGF5ZXJzLCBjb2xsaXNpb25zLnRlcnJhaW4sIGNvbGxpc2lvbnMuYnVsbGV0c10pO1xuXHR9LFxuXG5cdGNyZWF0ZUdyb3VwTGF5ZXJpbmc6IGZ1bmN0aW9uKCkge1xuXHRcdGlmIChiYWNrZ3JvdW5kKSB7XG5cdFx0XHRncm91cHMudGVycmFpbi5hZGQoYmFja2dyb3VuZC5zcHJpdGUpO1xuXHRcdFx0aWYgKGJhY2tncm91bmQubW91bnRhaW5zKSB7XG5cdFx0XHRcdGdyb3Vwcy50ZXJyYWluLmFkZChiYWNrZ3JvdW5kLm1vdW50YWlucyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGdyb3Vwcy5hY3RvcnMuYWRkKHBsYXllcik7XG5cdFx0Z3JvdXBzLmFjdG9ycy5hZGQob3JiLnNwcml0ZSk7XG5cdFx0Z3JvdXBzLmFjdG9ycy5hZGQobGltcGV0MSk7XG5cdFx0Z3JvdXBzLmFjdG9ycy5hZGQobGltcGV0Mik7XG5cdFx0Z2FtZS53b3JsZC5zd2FwKGdyb3Vwcy50ZXJyYWluLCBncm91cHMuYWN0b3JzKTtcblx0fSxcblxuXHRpbml0Q29udHJvbHM6IGZ1bmN0aW9uKCkge1xuXHRcdGlmIChnYW1lLmNvbnRyb2xzLmlzSm95cGFkRW5hYmxlZCkge1xuXHRcdFx0Z2FtZS5jb250cm9scy5pbml0Sm95cGFkKCk7XG5cdFx0XHR0aGlzLnN0aWNrID0gZ2FtZS5jb250cm9scy5zdGljaztcblx0XHRcdGdhbWUuY29udHJvbHMuYnV0dG9uQS5vbkRvd24uYWRkKHRoaXMucHJlc3NCdXR0b25BLCB0aGlzKTtcblx0XHRcdGdhbWUuY29udHJvbHMuYnV0dG9uQS5vblVwLmFkZCh0aGlzLnVwQnV0dG9uQSwgdGhpcyk7XG5cdFx0XHRnYW1lLmNvbnRyb2xzLmJ1dHRvbkIub25Eb3duLmFkZCh0aGlzLnByZXNzQnV0dG9uQiwgdGhpcyk7XG5cdFx0XHRnYW1lLmNvbnRyb2xzLmJ1dHRvbkIub25VcC5hZGQodGhpcy51cEJ1dHRvbkIsIHRoaXMpO1xuXHRcdH1cblxuXHRcdHRoaXMuY3Vyc29ycyBcdCA9IGdhbWUuY29udHJvbHMuY3Vyc29ycztcblx0XHRnYW1lLmNvbnRyb2xzLnNwYWNlUHJlc3Mub25Eb3duLmFkZChwbGF5ZXIuZmlyZSwgcGxheWVyKTtcblx0XHRnYW1lLmNvbnRyb2xzLnhLZXkub25Eb3duLmFkZCh0aGlzLnhEb3duLCB0aGlzKTtcblx0XHRnYW1lLmNvbnRyb2xzLnhLZXkub25VcC5hZGQodGhpcy54VXAsIHRoaXMpO1xuXHR9LFxuXG5cdGJlZ2luU3RhdHM6IGZ1bmN0aW9uKCkge1xuXHRcdGlmIChwcm9wZXJ0aWVzLmRyYXdTdGF0cykge1xuXHRcdFx0Z2FtZS5zdGF0cy5zdGFydCgpO1xuXHRcdH1cblx0fSxcblxuXHRlbmRTdGF0czogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHByb3BlcnRpZXMuZHJhd1N0YXRzKSB7XG5cdFx0XHRnYW1lLnN0YXRzLmVuZCgpO1xuXHRcdH1cblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdGdhbWUuZGVidWcuY2FtZXJhSW5mbyhnYW1lLmNhbWVyYSwgNTAwLCAyMCk7XG5cdH0sXG5cblx0cHJlc3NCdXR0b25BOiBmdW5jdGlvbigpIHtcblx0XHRidXR0b25BRG93biA9IHRydWU7XG5cdH0sXG5cblx0dXBCdXR0b25BOiBmdW5jdGlvbigpIHtcblx0XHRidXR0b25BRG93biA9IGZhbHNlO1xuXHR9LFxuXG5cdHByZXNzQnV0dG9uQjogZnVuY3Rpb24oKSB7XG5cdFx0YnV0dG9uQkRvd24gPSB0cnVlO1xuXHRcdHBsYXllci5zaG9vdCgpO1xuXHR9LFxuXG5cdHVwQnV0dG9uQjogZnVuY3Rpb24oKSB7XG5cdFx0YnV0dG9uQkRvd24gPSBmYWxzZTtcblx0fSxcblxuXHR4RG93bjogZnVuY3Rpb24gKCkge1xuXHRcdGlzWERvd24gPSB0cnVlO1xuXHRcdC8vbGltcGV0MS5maXJlKCk7XG5cdH0sXG5cblx0eFVwOiBmdW5jdGlvbigpIHtcblx0XHRpc1hEb3duID0gZmFsc2U7XG5cdFx0aWYgKCFwcm9wZXJ0aWVzLmdhbWVQbGF5LmF1dG9PcmJMb2NraW5nKSB7XG5cdFx0XHR0cmFjdG9yQmVhbS5sb2NraW5nUmVsZWFzZSgpO1xuXHRcdH1cblx0fVxufTtcbiIsInZhciBTdGF0cyA9IHJlcXVpcmUoJ1N0YXRzJyk7XG52YXIgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL3Byb3BlcnRpZXMnKTtcbi8qKlxuICogQSBwcml2YXRlIHZhciBkZXNjcmlwdGlvblxuICpcbiAqIEBwcm9wZXJ0eSBzdGF0c1xuICogQHR5cGUge1N0YXRzfVxuICogQHByaXZhdGVcbiAqL1xudmFyIHN0YXRzO1xuXG4vKipcbiAqIFN0YXRzTW9kdWxlIGRlc2NyaXB0aW9uXG4gKlxuICogZGVmaW5lcyBhIHB1YmxpYyB2YXJpYWJsZSBhbmQgY2FsbHMgaW5pdCAtIGNoYW5nZSB0aGlzIGNvbnN0cnVjdG9yIHRvIHN1aXQgeW91ciBuZWVkcy5cbiAqIG5iLiB0aGVyZSdzIG5vIHJlcXVpcmVtZW50IHRvIGNhbGwgYW4gaW5pdCBmdW5jdGlvblxuICpcbiAqIEBjbGFzcyBTdGF0c01vZHVsZVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFN0YXRzTW9kdWxlKCkge1xuXHQvKipcblx0ICogQSBwdWJsaWMgdmFyIGRlc2NyaXB0aW9uXG5cdCAqXG5cdCAqIEBwcm9wZXJ0eSBteVB1YmxpY1ZhclxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0aWYgKHByb3BlcnRpZXMuZHJhd1N0YXRzKSB7XG5cdFx0Y29uc29sZS5sb2coJ3N0YXR0bycpO1xuXHRcdHN0YXRzID0gbmV3IFN0YXRzKCk7XG5cdFx0c3RhdHMuc2V0TW9kZSgwKTtcblx0XHRzdGF0cy5kb21FbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcblx0XHRzdGF0cy5kb21FbGVtZW50LnN0eWxlLmxlZnQgPSAnMHB4Jztcblx0XHRzdGF0cy5kb21FbGVtZW50LnN0eWxlLmJvdHRvbSA9ICcwcHgnO1xuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIHN0YXRzLmRvbUVsZW1lbnQgKTtcblx0fVxufVxuXG52YXIgcCA9IFN0YXRzTW9kdWxlLnByb3RvdHlwZTtcblxuLyoqXG4gKlxuICogQG1ldGhvZCBiZWdpblxuICovXG5wLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG5cdHN0YXRzLmJlZ2luKCk7XG59O1xuXG4vKipcbiAqIEBtZXRob2QgZW5kXG4gKi9cbnAuZW5kID0gZnVuY3Rpb24oKSB7XG5cdHN0YXRzLmVuZCgpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YXRzTW9kdWxlO1xuIiwiLypcbmZ1bmN0aW9uIGlzVG91Y2hEZXZpY2UoKXtcbiAgICByZXR1cm4gdHJ1ZSA9PSAoXCJvbnRvdWNoc3RhcnRcIiBpbiB3aW5kb3cgfHwgd2luZG93LkRvY3VtZW50VG91Y2ggJiYgZG9jdW1lbnQgaW5zdGFuY2VvZiBEb2N1bWVudFRvdWNoKTtcbn1cbk5vdyBjaGVja2luZyBpZiDigJhpc1RvdWNoRGV2aWNlKCk74oCZIGlzIHJldHVybnMgdHJ1ZSBpdCBtZWFucyBpdHMgYSB0b3VjaCBkZXZpY2UuXG5cbmlmKGlzVG91Y2hEZXZpY2UoKT09PXRydWUpIHtcbiAgICBhbGVydCgnVG91Y2ggRGV2aWNlJyk7IC8veW91ciBsb2dpYyBmb3IgdG91Y2ggZGV2aWNlXG59XG5lbHNlIHtcbiAgICBhbGVydCgnTm90IGEgVG91Y2ggRGV2aWNlJyk7IC8veW91ciBsb2dpYyBmb3Igbm9uIHRvdWNoIGRldmljZVxufVxuKi9cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuaXNUb3VjaFNjcmVlbiA9ICgoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KVxuICAgICAgICB8fCAobmF2aWdhdG9yLk1heFRvdWNoUG9pbnRzID4gMClcbiAgICAgICAgfHwgKG5hdmlnYXRvci5tc01heFRvdWNoUG9pbnRzID4gMCkpO1xuICAgIGNvbnNvbGUubG9nKFwidG91Y2hTY3JlZW46XCIsIHRoaXMuaXNUb3VjaFNjcmVlbik7XG4gIH0sXG4gIGlzVG91Y2hTY3JlZW46IHRoaXMuaXNUb3VjaFNjcmVlblxufVxuIl19
