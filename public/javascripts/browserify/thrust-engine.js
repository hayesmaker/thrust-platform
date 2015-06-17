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

/**
 * LimpetGun description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @param x
 * @param y
 * @param rotation
 * @param collisions
 * @param groups
 * @class LimpetGun
 * @constructor
 */
function LimpetGun(x, y, rotation, collisions, groups) {

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

	this.angle = rotation;
	//this.scale.setTo(0.25, 0.25);

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

	game.physics.p2.enable(this, true);

	this.body.clearShapes();
	this.body.addRectangle(50, 25, 0,0);
	this.body.rotation = game.math.degToRad(this.angle);
	this.body.fixedRotation = true;

	this.body.setCollisionGroup(this.collisions.enemies);

	this.body.motionState = 2;

	this.turret = this.createTurret();
};

p.createTurret = function() {
	return new Turret(this.groups, this, "RANDOM_DIRECTION");
};

p.shoot = function() {
	this.turret.shoot();
};


module.exports = LimpetGun;
},{"../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js","./Turret":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Turret.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Map.js":[function(require,module,exports){
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

},{"../environment/utils":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/utils.js","../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js","./Turret":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Turret.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/TractorBeam.js":[function(require,module,exports){
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
 * A private var description
 *
 * @property myPrivateVar
 * @type {number}
 * @private
 */
var myPrivateVar = 0;

/**
 * Turret description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class Turret
 * @constructor
 */
function Turret(groups, sprite, type) {
	/**
	 * A public var description
	 *
	 * @property myPublicVar
	 * @type {number}
	 */
	this.groups = groups;
	this.origin = sprite;
	this.type = type;

	this.init();
}

var p = Turret.prototype;

/**
 * Turret initialisation
 *
 * @method init
 */
p.init = function() {
	this.bulletBitmap = game.make.bitmapData(5,5);
	this.bulletBitmap.ctx.fillStyle = '#ffffff';
	this.bulletBitmap.ctx.beginPath();
	this.bulletBitmap.ctx.arc(1.0,1.0,2, 0, Math.PI*2, true);
	this.bulletBitmap.ctx.closePath();
	this.bulletBitmap.ctx.fill();
};

p.shoot = function() {
	var magnitue = 240;
	var bullet = game.make.sprite(this.origin.position.x, this.origin.position.y, this.bulletBitmap);
	bullet.anchor.setTo(0.5,0.5);
	game.physics.p2.enable(bullet);
	var angle = this.origin.body.rotation + (3 * Math.PI) / 2;
	bullet.body.collidesWorldBounds = false;
	bullet.body.setCollisionGroup(this.origin.collisions.bullets);
	bullet.body.collides(this.origin.collisions.terrain, this.destroyBullet, this);
	bullet.body.data.gravityScale = 0;
	bullet.body.velocity.x = magnitue * Math.cos(angle) + this.origin.body.velocity.x;
	bullet.body.velocity.y = magnitue * Math.sin(angle) + this.origin.body.velocity.y;
	this.groups.bullets.add(bullet);
};

p.detroyBullet = function(bulletBody) {
	bulletBody.sprite.kill();
	this.groups.bullets.remove(bulletBody.sprite);
};


module.exports = Turret;

},{}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/Collisions.js":[function(require,module,exports){
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
		background = new Background();
		player = new Player(game.world.centerX, 300, collisions, groups);
		orb = new Orb(collisions);
		tractorBeam = new TractorBeam(orb);
		player.setTractorBeam(tractorBeam);
		limpet1 = new LimpetGun(500, 700, 45, collisions, groups);
		map = new Map(collisions);

		game.camera.follow(player);

		collisions.set(orb, [collisions.players, collisions.terrain, collisions.bullets]);
		collisions.set(map, [collisions.players, collisions.terrain, collisions.bullets]);
	},

	createGroupLayering: function() {
		groups.terrain.add(background.sprite);
		if (background.mountains) groups.terrain.add(background.mountains);
		groups.actors.add(player);
		groups.actors.add(orb.sprite);
		groups.actors.add(limpet1);
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
		game.controls.spacePress.onDown.add(player.shoot, player);
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
		limpet1.shoot();
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYWN0b3JzL0JhY2tncm91bmQuanMiLCJzcmMvYWN0b3JzL0xpbXBldEd1bi5qcyIsInNyYy9hY3RvcnMvTWFwLmpzIiwic3JjL2FjdG9ycy9PcmIuanMiLCJzcmMvYWN0b3JzL1BsYXllci5qcyIsInNyYy9hY3RvcnMvVHJhY3RvckJlYW0uanMiLCJzcmMvYWN0b3JzL1R1cnJldC5qcyIsInNyYy9lbnZpcm9ubWVudC9Db2xsaXNpb25zLmpzIiwic3JjL2Vudmlyb25tZW50L0dyb3Vwcy5qcyIsInNyYy9lbnZpcm9ubWVudC9Vc2VyQ29udHJvbC5qcyIsInNyYy9lbnZpcm9ubWVudC91dGlscy5qcyIsInNyYy9nYW1lLmpzIiwic3JjL2xpYnMvc3RhdHMuanMvc3RhdHMubWluLmpzIiwic3JjL3Byb3BlcnRpZXMuanMiLCJzcmMvc3RhdGVzL2Jvb3QuanMiLCJzcmMvc3RhdGVzL2xvYWQuanMiLCJzcmMvc3RhdGVzL21lbnUuanMiLCJzcmMvc3RhdGVzL3BsYXkuanMiLCJzcmMvdXRpbHMvU3RhdHNNb2R1bGUuanMiLCJzcmMvdXRpbHMvZmVhdHVyZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBwcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vcHJvcGVydGllcycpO1xuXG4vKipcbiAqXG4gKlxuICogQHR5cGUge1BoYXNlci5HcmFwaGljc31cbiAqL1xudmFyIGdyYXBoaWNzO1xuXG4vKipcbiAqIEJhY2tncm91bmQgZGVzY3JpcHRpb25cbiAqXG4gKiBkZWZpbmVzIGEgcHVibGljIHZhcmlhYmxlIGFuZCBjYWxscyBpbml0IC0gY2hhbmdlIHRoaXMgY29uc3RydWN0b3IgdG8gc3VpdCB5b3VyIG5lZWRzLlxuICogbmIuIHRoZXJlJ3Mgbm8gcmVxdWlyZW1lbnQgdG8gY2FsbCBhbiBpbml0IGZ1bmN0aW9uXG4gKlxuICogQGNsYXNzIEJhY2tncm91bmRcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBCYWNrZ3JvdW5kKCkge1xuXHR0aGlzLnNwcml0ZSA9IGdhbWUubWFrZS50aWxlU3ByaXRlKDAsIDAsIDkyOCwgNjAwLCAnc3RhcnMnKTtcblx0dGhpcy5pbml0KCk7XG59XG5cbnZhciBwID0gQmFja2dyb3VuZC5wcm90b3R5cGU7XG5cbi8qKlxuICogQmFja2dyb3VuZCBpbml0aWFsaXNhdGlvblxuICpcbiAqIEBtZXRob2QgaW5pdFxuICovXG5wLmluaXQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5zdGFycyA9IHRoaXMuc3ByaXRlO1xuXG5cdGlmIChwcm9wZXJ0aWVzLmRyYXdNb3VudGFpbnMpIHtcblx0XHR0aGlzLm1vdW50YWlucyA9IGdhbWUuYWRkLnNwcml0ZSgwLCA3MDApO1xuXHRcdGdyYXBoaWNzID0gbmV3IFBoYXNlci5HcmFwaGljcyhnYW1lLCAwLDApO1xuXHRcdGdyYXBoaWNzLmxpbmVTdHlsZSgyLCAweGZmZmZmZiwgMC43KTtcblx0XHR2YXIgZ3JvdW5kV2lkdGggPSAyMDAwO1xuXHRcdHZhciBwZWFrVyA9IDIwMDtcblx0XHR2YXIgcGVha0ggPSAxMDA7XG5cdFx0dmFyIHVwID0gdHJ1ZTtcblx0XHR2YXIgaTtcblx0XHRmb3IgKGkgPSAwOyBpIDwgZ3JvdW5kV2lkdGg7IGkrKykge1xuXHRcdFx0aWYgKGkgJSBwZWFrVyA9PT0gMCkge1xuXHRcdFx0XHRncmFwaGljcy5saW5lVG8oIHBlYWtXICsgaSwgdXA/IC1NYXRoLnJhbmRvbSgpICogcGVha0ggOiAwICk7XG5cdFx0XHRcdHVwID0gIXVwO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLm1vdW50YWlucy5hZGRDaGlsZChncmFwaGljcyk7XG5cdH1cblxuXG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2dyb3VuZDsiLCJ2YXIgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL3Byb3BlcnRpZXMnKTtcbnZhciBUdXJyZXQgPSByZXF1aXJlKCcuL1R1cnJldCcpO1xuXG4vKipcbiAqIExpbXBldEd1biBkZXNjcmlwdGlvblxuICpcbiAqIGRlZmluZXMgYSBwdWJsaWMgdmFyaWFibGUgYW5kIGNhbGxzIGluaXQgLSBjaGFuZ2UgdGhpcyBjb25zdHJ1Y3RvciB0byBzdWl0IHlvdXIgbmVlZHMuXG4gKiBuYi4gdGhlcmUncyBubyByZXF1aXJlbWVudCB0byBjYWxsIGFuIGluaXQgZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0geFxuICogQHBhcmFtIHlcbiAqIEBwYXJhbSByb3RhdGlvblxuICogQHBhcmFtIGNvbGxpc2lvbnNcbiAqIEBwYXJhbSBncm91cHNcbiAqIEBjbGFzcyBMaW1wZXRHdW5cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBMaW1wZXRHdW4oeCwgeSwgcm90YXRpb24sIGNvbGxpc2lvbnMsIGdyb3Vwcykge1xuXG5cdHRoaXMuY29sbGlzaW9ucyA9IGNvbGxpc2lvbnM7XG5cblx0dGhpcy5ncm91cHMgPSBncm91cHM7XG5cblx0dmFyIGJtZCA9IGdhbWUubWFrZS5iaXRtYXBEYXRhKDUwLCAyNSk7XG5cdGJtZC5jdHguc3Ryb2tlU3R5bGUgPSAnI2ZmZmZmZic7XG5cdGJtZC5jdHgubGluZVdpZHRoID0gMjtcblx0Ym1kLmN0eC5iZWdpblBhdGgoKTtcblx0Ym1kLmN0eC5tb3ZlVG8oIDUsIDE1KTtcblx0Ym1kLmN0eC5saW5lVG8oNDUsIDE1KTtcblx0Ym1kLmN0eC5saW5lVG8oNTAsIDI1KTtcblx0Ym1kLmN0eC5saW5lVG8oNDMsIDIwKTtcblx0Ym1kLmN0eC5saW5lVG8oIDMsIDIwKTtcblx0Ym1kLmN0eC5saW5lVG8oIDAsIDI1KTtcblx0Ym1kLmN0eC5saW5lVG8oIDUsIDE1KTtcblx0Ym1kLmN0eC5hcmMoMjUsMTUsMTIsIDAsIE1hdGguUEksIHRydWUpO1xuXHRibWQuY3R4LmNsb3NlUGF0aCgpO1xuXHRibWQuY3R4LnN0cm9rZSgpO1xuXG5cdFBoYXNlci5TcHJpdGUuY2FsbCh0aGlzLCBnYW1lLCB4LCB5LCBibWQpO1xuXG5cdHRoaXMuYW5nbGUgPSByb3RhdGlvbjtcblx0Ly90aGlzLnNjYWxlLnNldFRvKDAuMjUsIDAuMjUpO1xuXG5cdHRoaXMuaW5pdCgpO1xufVxuXG52YXIgcCA9IExpbXBldEd1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBoYXNlci5TcHJpdGUucHJvdG90eXBlKTtcbnAuY29uc3RydWN0b3IgPSBMaW1wZXRHdW47XG5cbi8qKlxuICogTGltcGV0R3VuIGluaXRpYWxpc2F0aW9uXG4gKlxuICogQG1ldGhvZCBpbml0XG4gKi9cbnAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXG5cdGdhbWUucGh5c2ljcy5wMi5lbmFibGUodGhpcywgdHJ1ZSk7XG5cblx0dGhpcy5ib2R5LmNsZWFyU2hhcGVzKCk7XG5cdHRoaXMuYm9keS5hZGRSZWN0YW5nbGUoNTAsIDI1LCAwLDApO1xuXHR0aGlzLmJvZHkucm90YXRpb24gPSBnYW1lLm1hdGguZGVnVG9SYWQodGhpcy5hbmdsZSk7XG5cdHRoaXMuYm9keS5maXhlZFJvdGF0aW9uID0gdHJ1ZTtcblxuXHR0aGlzLmJvZHkuc2V0Q29sbGlzaW9uR3JvdXAodGhpcy5jb2xsaXNpb25zLmVuZW1pZXMpO1xuXG5cdHRoaXMuYm9keS5tb3Rpb25TdGF0ZSA9IDI7XG5cblx0dGhpcy50dXJyZXQgPSB0aGlzLmNyZWF0ZVR1cnJldCgpO1xufTtcblxucC5jcmVhdGVUdXJyZXQgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIG5ldyBUdXJyZXQodGhpcy5ncm91cHMsIHRoaXMsIFwiUkFORE9NX0RJUkVDVElPTlwiKTtcbn07XG5cbnAuc2hvb3QgPSBmdW5jdGlvbigpIHtcblx0dGhpcy50dXJyZXQuc2hvb3QoKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBMaW1wZXRHdW47IiwidmFyIHByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9wcm9wZXJ0aWVzJyk7XG52YXIgZ2FtZSA9IHdpbmRvdy5nYW1lO1xuXG4vKipcbiAqIE1hcCBkZXNjcmlwdGlvblxuICpcbiAqIGRlZmluZXMgYSBwdWJsaWMgdmFyaWFibGUgYW5kIGNhbGxzIGluaXQgLSBjaGFuZ2UgdGhpcyBjb25zdHJ1Y3RvciB0byBzdWl0IHlvdXIgbmVlZHMuXG4gKiBuYi4gdGhlcmUncyBubyByZXF1aXJlbWVudCB0byBjYWxsIGFuIGluaXQgZnVuY3Rpb25cbiAqXG4gKiBAY2xhc3MgTWFwXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gTWFwKGNvbGxpc2lvbnMpIHtcblx0dGhpcy5jb2xsaXNpb25zID0gY29sbGlzaW9ucztcblxuXHR0aGlzLnNwcml0ZSA9IGdhbWUuYWRkLnNwcml0ZSgwLDAsICd0aHJ1c3RtYXAnKTtcblxuXHR0aGlzLmluaXQoKTtcbn1cblxudmFyIHAgPSBNYXAucHJvdG90eXBlO1xuXG4vKipcbiAqIE1hcCBpbml0aWFsaXNhdGlvblxuICpcbiAqIEBtZXRob2QgaW5pdFxuICovXG5wLmluaXQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5zcHJpdGUucG9zaXRpb24uc2V0VG8odGhpcy5zcHJpdGUud2lkdGgvMiwgOTcwKTtcblxuXHRnYW1lLnBoeXNpY3MucDIuZW5hYmxlKHRoaXMuc3ByaXRlLCBwcm9wZXJ0aWVzLmRlYnVnUGh5c2ljcyk7XG5cblx0dGhpcy5ib2R5ID0gdGhpcy5zcHJpdGUuYm9keTtcblxuXHR0aGlzLmJvZHkuc3RhdGljID0gdHJ1ZTtcblxuXHR0aGlzLmJvZHkuY2xlYXJTaGFwZXMoKTtcblx0dGhpcy5ib2R5LmxvYWRQb2x5Z29uKCdwaHlzaWNzRGF0YScsICd0aHJ1c3RtYXAnKTtcblxuXHR0aGlzLmJvZHkuc2V0Q29sbGlzaW9uR3JvdXAodGhpcy5jb2xsaXNpb25zLnRlcnJhaW4pO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcDtcbiIsInZhciBnYW1lID0gd2luZG93LmdhbWU7XG52YXIgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL3Byb3BlcnRpZXMnKTtcbi8qKlxuICogQSBwcml2YXRlIHZhciBkZXNjcmlwdGlvblxuICpcbiAqIEBwcm9wZXJ0eSBteVByaXZhdGVWYXJcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKiBAcHJpdmF0ZVxuICovXG52YXIgbXlQcml2YXRlVmFyID0gMDtcblxuLyoqXG4gKiBPcmIgZGVzY3JpcHRpb25cbiAqIGNhbGxzIGluaXRcbiAqXG4gKiBAY2xhc3MgT3JiXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gT3JiIChjb2xsaXNpb25zKSB7XG5cdC8qKlxuXHQgKiBBIGNvbGxpc2lvbnMgY29udGFpbmVyXG5cdCAqXG5cdCAqIEBwcm9wZXJ0eSBjb2xsaXNpb25zXG5cdCAqIEB0eXBlIHtDb2xsaXNpb25zfVxuXHQgKi9cblx0dGhpcy5jb2xsaXNpb25zID0gY29sbGlzaW9ucztcblxuXHR2YXIgYm1kID0gZ2FtZS5tYWtlLmJpdG1hcERhdGEoMjIsMjIpO1xuXHRibWQuY3R4LnN0cm9rZVN0eWxlID0gJyM5OTk5OTknO1xuXHRibWQuY3R4LmxpbmVXaWR0aCA9IDI7XG5cdGJtZC5jdHguYmVnaW5QYXRoKCk7XG5cdGJtZC5jdHguYXJjKDExLCAxMSwgMTAsIDAsIE1hdGguUEkqMiwgdHJ1ZSk7XG5cdGJtZC5jdHguY2xvc2VQYXRoKCk7XG5cdGJtZC5jdHguc3Ryb2tlKCk7XG5cdC8qKlxuXHQgKiBAcHJvcGVydHkgc3ByaXRlXG5cdCAqL1xuXHR0aGlzLnNwcml0ZSA9IGdhbWUubWFrZS5zcHJpdGUoNTUwLCAxMjAwLCBibWQpO1xuXHR0aGlzLnNwcml0ZS5hbmNob3Iuc2V0VG8oMC41LDAuNSk7XG5cblx0dGhpcy5pbml0KCk7XG59XG5cbnZhciBwID0gT3JiLnByb3RvdHlwZTtcblxuLyoqXG4gKiBPcmIgaW5pdGlhbGlzYXRpb25cbiAqXG4gKiBAbWV0aG9kIGluaXRcbiAqL1xucC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cblx0Z2FtZS5waHlzaWNzLnAyLmVuYWJsZSh0aGlzLnNwcml0ZSwgcHJvcGVydGllcy5kZWJ1Z1BoeXNpY3MpO1xuXG5cdC8vbW90aW9uU3RhdGUgPSAxOyAvL2ZvciBkeW5hbWljXG5cdC8vbW90aW9uU3RhdGUgPSAyOyAvL2ZvciBzdGF0aWNcblx0Ly9tb3Rpb25TdGF0ZSA9IDQ7IC8vZm9yIGtpbmVtYXRpY1xuXG5cdHRoaXMuYm9keSA9IHRoaXMuc3ByaXRlLmJvZHk7XG5cblx0dGhpcy5ib2R5Lm1vdGlvblN0YXRlID0gMjtcblxuXHR0aGlzLmJvZHkuc2V0Q29sbGlzaW9uR3JvdXAodGhpcy5jb2xsaXNpb25zLnRlcnJhaW4pO1xuXG5cdHRoaXMuYm9keS5jb2xsaWRlV29ybGRCb3VuZHMgPSBwcm9wZXJ0aWVzLmNvbGxpZGVXb3JsZEJvdW5kcztcblxuXHQvL3RoaXMuYm9keS5jb2xsaWRlcyh0aGlzLmNvbGxpc2lvbnMuYnVsbGV0cywgdGhpcy5tb3ZlLCB0aGlzKVxufTtcblxucC5tb3ZlID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuYm9keS5tb3Rpb25TdGF0ZSA9IDE7XG5cdHRoaXMuYm9keS5tYXNzID0gMTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBPcmI7XG4iLCIvL3ZhciBnYW1lID0gd2luZG93LmdhbWU7XG52YXIgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL3Byb3BlcnRpZXMnKTtcbnZhciBUdXJyZXQgPSByZXF1aXJlKCcuL1R1cnJldCcpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vZW52aXJvbm1lbnQvdXRpbHMnKTtcblxuLyoqXG4gKiBQbGF5ZXIgZGVzY3JpcHRpb25cbiAqIGNhbGxzIGluaXRcbiAqXG4gKiBAcGFyYW0ge0NvbGxpc2lvbnN9IGNvbGxpc2lvbnMgLSBPdXIgY29sbGlzaW9ucyBjb250YWluZXIgb2YgY29sbGlzaW9uR3JvdXBzXG4gKiBAcGFyYW0ge0dyb3Vwc30gZ3JvdXBzIC0gT3VyIGdyb3VwcyBjb250YWluZXJcbiAqIEBjbGFzcyBQbGF5ZXJcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBQbGF5ZXIoeCwgeSwgY29sbGlzaW9ucywgZ3JvdXBzKSB7XG5cdC8qKlxuXHQgKiBUaGUgY29sbGlzaW9ucyBjb250YWluZXJcblx0ICpcblx0ICogQHByb3BlcnR5IGNvbGxpc2lvbnNcblx0ICogQHR5cGUge0NvbGxpc2lvbnN9XG5cdCAqL1xuXHR0aGlzLmNvbGxpc2lvbnMgPSBjb2xsaXNpb25zO1xuXG5cdC8qKlxuXHQgKiBUaGUgZ3JvdXBzIGNvbnRhaW5lclxuXHQgKlxuXHQgKiBAcHJvcGVydHkgZ3JvdXBzXG5cdCAqIEB0eXBlIHtHcm91cHN9XG5cdCAqL1xuXHR0aGlzLmdyb3VwcyA9IGdyb3VwcztcblxuXHR2YXIgYm1kID0gZ2FtZS5tYWtlLmJpdG1hcERhdGEoNTAsNTApO1xuXHRibWQuY3R4LnN0cm9rZVN0eWxlID0gJyNmZmZmZmYnO1xuXHRibWQuY3R4LmxpbmVXaWR0aCA9IDI7XG5cdGJtZC5jdHguYmVnaW5QYXRoKCk7XG5cdGJtZC5jdHgubGluZVRvKCAyMCwgNDApO1xuXHRibWQuY3R4LmxpbmVUbyggMjUsIDQwKTtcblx0Ym1kLmN0eC5hcmMgICAoICAwLCA0MCwgMjUsIDAsIGdhbWUubWF0aC5kZWdUb1JhZCgxODApLCBmYWxzZSk7XG5cdGJtZC5jdHgubGluZVRvKC0yMCwgNDApO1xuXHRibWQuY3R4LmxpbmVUbyggIDAsICAwKTtcblx0Ym1kLmN0eC5jbG9zZVBhdGgoKTtcblx0Ym1kLmN0eC5zdHJva2UoKTtcblxuXHRQaGFzZXIuU3ByaXRlLmNhbGwodGhpcywgZ2FtZSwgeCwgeSwgYm1kKTtcblxuXG5cdC8qXG5cdCB2YXIgZ3JhcGhpY3MgPSBuZXcgUGhhc2VyLkdyYXBoaWNzKGdhbWUsIDAsMCk7XG5cdCBncmFwaGljcy5saW5lU3R5bGUoNCwweGZmZmZmZik7XG5cdCBncmFwaGljcy5saW5lVG8oMjAsNDApO1xuXHQgZ3JhcGhpY3MubGluZVRvKDI1LDQwKTtcblx0IGdyYXBoaWNzLmFyYygwLDQwLDI1LGdhbWUubWF0aC5kZWdUb1JhZCgwKSwgZ2FtZS5tYXRoLmRlZ1RvUmFkKDE4MCksIGZhbHNlKTtcblx0IGdyYXBoaWNzLmxpbmVUbygtMjAsNDApO1xuXHQgZ3JhcGhpY3MubGluZVRvKDAsMCk7XG5cdCB0aGlzLnNwcml0ZS5hZGRDaGlsZChncmFwaGljcyk7XG5cblx0IHRoaXMuc3ByaXRlLnNjYWxlLnNldFRvKDAuMywwLjMpO1xuXHQgdGhpcy5zcHJpdGUucGl2b3QueCA9IDA7XG5cdCB0aGlzLnNwcml0ZS5waXZvdC55ID0gNDA7XG5cdCAqL1xuXG5cblx0LyoqXG5cdCAqIEEgYmVhbSBhY3RvciB1c2VkIGJ5IHBsYXllciB0byBjb2xlY3QgdGhlIG9yYlxuXHQgKlxuXHQgKiBAcHJvcGVydHkgdHJhY3RvckJlYW1cblx0ICogQHR5cGUge1RyYWN0b3JCZWFtfVxuXHQgKi9cblx0dGhpcy50cmFjdG9yQmVhbSA9IG51bGw7XG5cblxuXHR0aGlzLmluaXQoKTtcbn1cblxudmFyIHAgPSBQbGF5ZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQaGFzZXIuU3ByaXRlLnByb3RvdHlwZSk7XG5wLmNvbnN0cnVjdG9yID0gUGxheWVyO1xuXG4vKipcbiAqXG4gKiBAbWV0aG9kIHNldFRyYWN0b3JCZWFtXG4gKiBAcGFyYW0gdHJhY3RvckJlYW1cbiAqL1xucC5zZXRUcmFjdG9yQmVhbSA9IGZ1bmN0aW9uKHRyYWN0b3JCZWFtKSB7XG5cdHRoaXMudHJhY3RvckJlYW0gPSB0cmFjdG9yQmVhbTtcbn07XG5cbi8qKlxuICogUGxheWVyIGluaXRpYWxpc2F0aW9uXG4gKlxuICogQG1ldGhvZCBpbml0XG4gKi9cbnAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXG5cdGdhbWUucGh5c2ljcy5wMi5lbmFibGUodGhpcywgdHJ1ZSk7XG5cblx0dGhpcy5ib2R5LmNsZWFyU2hhcGVzKCk7XG5cdHRoaXMuYm9keS5hZGRSZWN0YW5nbGUoLTEwLC0xNywgMCwtMik7XG5cdHRoaXMuYm9keS5jb2xsaWRlV29ybGRCb3VuZHMgPSBwcm9wZXJ0aWVzLmNvbGxpZGVXb3JsZEJvdW5kcztcblx0dGhpcy5ib2R5Lm1hc3MgPSAxO1xuXHR0aGlzLmJvZHkuc2V0Q29sbGlzaW9uR3JvdXAodGhpcy5jb2xsaXNpb25zLnBsYXllcnMpO1xuXG5cdHRoaXMudHVycmV0ID0gdGhpcy5jcmVhdGVUdXJyZXQoKTtcblxuXHR0aGlzLmJvZHkuY29sbGlkZXModGhpcy5jb2xsaXNpb25zLnRlcnJhaW4sIHRoaXMuY3Jhc2gsIHRoaXMpO1xufTtcblxuLyoqXG4gKlxuICpcbiAqIEBtZXRob2QgY3JlYXRlVHVycmV0XG4gKiBAcmV0dXJucyB7VHVycmV0fGV4cG9ydHN8bW9kdWxlLmV4cG9ydHN9XG4gKi9cbnAuY3JlYXRlVHVycmV0ID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBuZXcgVHVycmV0KHRoaXMuZ3JvdXBzLCB0aGlzLCBcIlRPX0RJUkVDVElPTlwiKTtcbn07XG5cbi8qKlxuICogV2hlbiB0aGlzIGlzIGNhbGxlZCwgd2UnbGwgY2hlY2sgdGhlIGRpc3RhbmNlIG9mIHRoZSBwbGF5ZXIgdG8gdGhlIG9yYiwgYW5kIGRlcGVuZGluZyBvbiBkaXN0YW5jZSxcbiAqIGVpdGhlciBkcmF3IGEgdHJhY3RvckJlYW1cbiAqXG4gKiBAbWV0aG9kIGNoZWNrT3JiRGlzdGFuY2VcbiAqL1xucC5jaGVja09yYkRpc3RhbmNlID0gZnVuY3Rpb24oKSB7XG5cdHZhciBkaXN0YW5jZSA9IHV0aWxzLmRpc3RBdG9CKHRoaXMucG9zaXRpb24sIHRoaXMudHJhY3RvckJlYW0ub3JiLnNwcml0ZS5wb3NpdGlvbik7XG5cdGlmIChkaXN0YW5jZSA8IHRoaXMudHJhY3RvckJlYW0ubGVuZ3RoKSB7XG5cdFx0dGhpcy50cmFjdG9yQmVhbS5kcmF3QmVhbSh0aGlzLnBvc2l0aW9uKTtcblxuXHR9IGVsc2UgaWYgKGRpc3RhbmNlID49IHRoaXMudHJhY3RvckJlYW0ubGVuZ3RoICYmIGRpc3RhbmNlIDwgOTApIHtcblx0XHRpZiAodGhpcy50cmFjdG9yQmVhbS5pc0xvY2tlZCAmJiAhdGhpcy50cmFjdG9yQmVhbS5oYXNHcmFiYmVkKSB7XG5cdFx0XHR0aGlzLnRyYWN0b3JCZWFtLmdyYWIodGhpcyk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGlmICh0aGlzLnRyYWN0b3JCZWFtLmlzTG9ja2luZykge1xuXHRcdFx0dGhpcy50cmFjdG9yQmVhbS5sb2NraW5nUmVsZWFzZSgpO1xuXHRcdH1cblx0fVxufTtcblxuLyoqXG4gKiBGaXJlcyB0aGUgY3VycmVudCBhY3RvcidzIHR1cnJldFxuICpcbiAqIEBtZXRob2Qgc2hvb3RcbiAqL1xucC5zaG9vdCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnR1cnJldC5zaG9vdCgpO1xufTtcblxuLyoqXG4gKiBDYWxsZWQgb24gY29sbGlzaW9uIHdpdGggdGVycmFpbiwgZW5lbXkgYnVsbGV0LCBvciBzb21lIG90aGVyIGZhdGFsIGNvbGxpc2lvblxuICpcbiAqIEBtZXRob2QgY3Jhc2hcbiAqL1xucC5jcmFzaCA9IGZ1bmN0aW9uKCkge1xuXHRpZiAoIXByb3BlcnRpZXMuZmF0YWxDb2xsaXNpb25zKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGNvbnNvbGUubG9nKCdDUkFTSEVEJyk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyO1xuIiwidmFyIHByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9wcm9wZXJ0aWVzJyk7XG52YXIgZ2FtZSA9IHdpbmRvdy5nYW1lO1xudmFyIGdyYXBoaWNzO1xudmFyIHRpbWVyO1xudmFyIGxvY2tpbmdEdXJhdGlvbiA9IHByb3BlcnRpZXMuZ2FtZVBsYXkubG9ja2luZ0R1cmF0aW9uO1xuXG4vKipcbiAqIFRyYWN0b3JCZWFtIGRlc2NyaXB0aW9uXG4gKlxuICogZGVmaW5lcyBhIHB1YmxpYyB2YXJpYWJsZSBhbmQgY2FsbHMgaW5pdCAtIGNoYW5nZSB0aGlzIGNvbnN0cnVjdG9yIHRvIHN1aXQgeW91ciBuZWVkcy5cbiAqIG5iLiB0aGVyZSdzIG5vIHJlcXVpcmVtZW50IHRvIGNhbGwgYW4gaW5pdCBmdW5jdGlvblxuICpcbiAqIEBjbGFzcyBUcmFjdG9yQmVhbVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFRyYWN0b3JCZWFtKG9yYikge1xuXHR0aGlzLm9yYiA9IG9yYjtcblxuXHR0aGlzLmlzTG9ja2VkID0gZmFsc2U7XG5cblx0dGhpcy5pc0xvY2tpbmcgPSBmYWxzZTtcblxuXHR0aGlzLmhhc0dyYWJiZWQgPSBmYWxzZTtcblxuXHR0aGlzLmxlbmd0aCA9IHByb3BlcnRpZXMuZ2FtZVBsYXkudHJhY3RvckJlYW1MZW5ndGg7XG5cblx0dGhpcy52YXJpYW5jZSA9IHByb3BlcnRpZXMuZ2FtZVBsYXkudHJhY3RvckJlYW1WYXJpYXRpb247XG5cblx0dGhpcy5pbml0KCk7XG59XG5cbnZhciBwID0gVHJhY3RvckJlYW0ucHJvdG90eXBlO1xuXG4vKipcbiAqIFRyYWN0b3JCZWFtIGluaXRpYWxpc2F0aW9uXG4gKlxuICogQG1ldGhvZCBpbml0XG4gKi9cbnAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRncmFwaGljcyA9IG5ldyBQaGFzZXIuR3JhcGhpY3MoZ2FtZSwgMCwwKTtcblx0dGhpcy5zcHJpdGUgPSBnYW1lLmFkZC5zcHJpdGUoMCwwKTtcblx0dGhpcy5zcHJpdGUuYWRkQ2hpbGQoZ3JhcGhpY3MpO1xuXHR0aW1lciA9IGdhbWUudGltZS5jcmVhdGUoZmFsc2UpO1xufTtcblxucC5kcmF3QmVhbSA9IGZ1bmN0aW9uKHBvc0EpIHtcblx0aWYgKCF0aGlzLmlzTG9ja2luZykge1xuXHRcdHRoaXMuaXNMb2NraW5nID0gdHJ1ZTtcblx0XHR0aW1lci5zdGFydCgpO1xuXHRcdHRpbWVyLmFkZChsb2NraW5nRHVyYXRpb24sIHRoaXMubG9jaywgdGhpcyk7XG5cdH1cblx0Z3JhcGhpY3MuY2xlYXIoKTtcblx0dmFyIGNvbG91ciA9IHRoaXMuaGFzR3JhYmJlZD8gMHgwMGZmMDAgOiAweEVGNTY5Njtcblx0dmFyIGFscGhhID0gdGhpcy5oYXNHcmFiYmVkPyAwLjUgOiAwLjQ7XG5cdGdyYXBoaWNzLmxpbmVTdHlsZSg1LCBjb2xvdXIsIGFscGhhKTtcblx0Z3JhcGhpY3MubW92ZVRvKHBvc0EueCwgcG9zQS55KTtcblx0Z3JhcGhpY3MubGluZVRvKHRoaXMub3JiLnNwcml0ZS5wb3NpdGlvbi54LCB0aGlzLm9yYi5zcHJpdGUucG9zaXRpb24ueSk7XG59O1xuXG5wLmxvY2sgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5pc0xvY2tlZCA9IHRydWU7XG59O1xuXG5wLmxvY2tpbmdSZWxlYXNlID0gZnVuY3Rpb24oKSB7XG5cdGlmICghdGhpcy5pc0xvY2tlZCkge1xuXHRcdHRoaXMuaXNMb2NraW5nID0gZmFsc2U7XG5cdFx0dGhpcy5oYXNHcmFiYmVkID0gZmFsc2U7XG5cdFx0Z3JhcGhpY3MuY2xlYXIoKTtcblx0XHR0aW1lci5zdG9wKHRydWUpO1xuXHR9XG59O1xuXG5wLmdyYWIgPSBmdW5jdGlvbihwbGF5ZXIpIHtcblx0dGhpcy5oYXNHcmFiYmVkID0gdHJ1ZTtcblx0dmFyIG1heEZvcmNlID0gMjAwMDAwO1xuXHR2YXIgZGlmZlggPSBwbGF5ZXIucG9zaXRpb24ueCAtIHRoaXMub3JiLnNwcml0ZS5wb3NpdGlvbi54O1xuXHR2YXIgZGlmZlkgPSBwbGF5ZXIucG9zaXRpb24ueSAtIHRoaXMub3JiLnNwcml0ZS5wb3NpdGlvbi55O1xuXHRnYW1lLnBoeXNpY3MucDIuY3JlYXRlUmV2b2x1dGVDb25zdHJhaW50KHBsYXllciwgWzAsIDBdLCB0aGlzLm9yYi5zcHJpdGUsIFtkaWZmWCxkaWZmWV0sIG1heEZvcmNlKTtcblx0dGhpcy5vcmIubW92ZSgpO1xufTtcblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBUcmFjdG9yQmVhbTtcbiIsInZhciBnYW1lID0gd2luZG93LmdhbWU7XG4vKipcbiAqIEEgcHJpdmF0ZSB2YXIgZGVzY3JpcHRpb25cbiAqXG4gKiBAcHJvcGVydHkgbXlQcml2YXRlVmFyXG4gKiBAdHlwZSB7bnVtYmVyfVxuICogQHByaXZhdGVcbiAqL1xudmFyIG15UHJpdmF0ZVZhciA9IDA7XG5cbi8qKlxuICogVHVycmV0IGRlc2NyaXB0aW9uXG4gKlxuICogZGVmaW5lcyBhIHB1YmxpYyB2YXJpYWJsZSBhbmQgY2FsbHMgaW5pdCAtIGNoYW5nZSB0aGlzIGNvbnN0cnVjdG9yIHRvIHN1aXQgeW91ciBuZWVkcy5cbiAqIG5iLiB0aGVyZSdzIG5vIHJlcXVpcmVtZW50IHRvIGNhbGwgYW4gaW5pdCBmdW5jdGlvblxuICpcbiAqIEBjbGFzcyBUdXJyZXRcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBUdXJyZXQoZ3JvdXBzLCBzcHJpdGUsIHR5cGUpIHtcblx0LyoqXG5cdCAqIEEgcHVibGljIHZhciBkZXNjcmlwdGlvblxuXHQgKlxuXHQgKiBAcHJvcGVydHkgbXlQdWJsaWNWYXJcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHRoaXMuZ3JvdXBzID0gZ3JvdXBzO1xuXHR0aGlzLm9yaWdpbiA9IHNwcml0ZTtcblx0dGhpcy50eXBlID0gdHlwZTtcblxuXHR0aGlzLmluaXQoKTtcbn1cblxudmFyIHAgPSBUdXJyZXQucHJvdG90eXBlO1xuXG4vKipcbiAqIFR1cnJldCBpbml0aWFsaXNhdGlvblxuICpcbiAqIEBtZXRob2QgaW5pdFxuICovXG5wLmluaXQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5idWxsZXRCaXRtYXAgPSBnYW1lLm1ha2UuYml0bWFwRGF0YSg1LDUpO1xuXHR0aGlzLmJ1bGxldEJpdG1hcC5jdHguZmlsbFN0eWxlID0gJyNmZmZmZmYnO1xuXHR0aGlzLmJ1bGxldEJpdG1hcC5jdHguYmVnaW5QYXRoKCk7XG5cdHRoaXMuYnVsbGV0Qml0bWFwLmN0eC5hcmMoMS4wLDEuMCwyLCAwLCBNYXRoLlBJKjIsIHRydWUpO1xuXHR0aGlzLmJ1bGxldEJpdG1hcC5jdHguY2xvc2VQYXRoKCk7XG5cdHRoaXMuYnVsbGV0Qml0bWFwLmN0eC5maWxsKCk7XG59O1xuXG5wLnNob290ID0gZnVuY3Rpb24oKSB7XG5cdHZhciBtYWduaXR1ZSA9IDI0MDtcblx0dmFyIGJ1bGxldCA9IGdhbWUubWFrZS5zcHJpdGUodGhpcy5vcmlnaW4ucG9zaXRpb24ueCwgdGhpcy5vcmlnaW4ucG9zaXRpb24ueSwgdGhpcy5idWxsZXRCaXRtYXApO1xuXHRidWxsZXQuYW5jaG9yLnNldFRvKDAuNSwwLjUpO1xuXHRnYW1lLnBoeXNpY3MucDIuZW5hYmxlKGJ1bGxldCk7XG5cdHZhciBhbmdsZSA9IHRoaXMub3JpZ2luLmJvZHkucm90YXRpb24gKyAoMyAqIE1hdGguUEkpIC8gMjtcblx0YnVsbGV0LmJvZHkuY29sbGlkZXNXb3JsZEJvdW5kcyA9IGZhbHNlO1xuXHRidWxsZXQuYm9keS5zZXRDb2xsaXNpb25Hcm91cCh0aGlzLm9yaWdpbi5jb2xsaXNpb25zLmJ1bGxldHMpO1xuXHRidWxsZXQuYm9keS5jb2xsaWRlcyh0aGlzLm9yaWdpbi5jb2xsaXNpb25zLnRlcnJhaW4sIHRoaXMuZGVzdHJveUJ1bGxldCwgdGhpcyk7XG5cdGJ1bGxldC5ib2R5LmRhdGEuZ3Jhdml0eVNjYWxlID0gMDtcblx0YnVsbGV0LmJvZHkudmVsb2NpdHkueCA9IG1hZ25pdHVlICogTWF0aC5jb3MoYW5nbGUpICsgdGhpcy5vcmlnaW4uYm9keS52ZWxvY2l0eS54O1xuXHRidWxsZXQuYm9keS52ZWxvY2l0eS55ID0gbWFnbml0dWUgKiBNYXRoLnNpbihhbmdsZSkgKyB0aGlzLm9yaWdpbi5ib2R5LnZlbG9jaXR5Lnk7XG5cdHRoaXMuZ3JvdXBzLmJ1bGxldHMuYWRkKGJ1bGxldCk7XG59O1xuXG5wLmRldHJveUJ1bGxldCA9IGZ1bmN0aW9uKGJ1bGxldEJvZHkpIHtcblx0YnVsbGV0Qm9keS5zcHJpdGUua2lsbCgpO1xuXHR0aGlzLmdyb3Vwcy5idWxsZXRzLnJlbW92ZShidWxsZXRCb2R5LnNwcml0ZSk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gVHVycmV0O1xuIiwidmFyIGdhbWUgPSB3aW5kb3cuZ2FtZTtcbnZhciBwcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vcHJvcGVydGllcycpO1xuXG4vKipcbiAqIEEgcHJpdmF0ZSB2YXIgZGVzY3JpcHRpb25cbiAqXG4gKiBAcHJvcGVydHkgbXlQcml2YXRlVmFyXG4gKiBAdHlwZSB7bnVtYmVyfVxuICogQHByaXZhdGVcbiAqL1xudmFyIG15UHJpdmF0ZVZhciA9IDA7XG5cbi8qKlxuICogQ29sbGlzaW9ucyBkZXNjcmlwdGlvblxuICogY2FsbHMgaW5pdFxuICpcbiAqIEBjbGFzcyBDb2xsaXNpb25zXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gQ29sbGlzaW9ucyAoY29sbGlzaW9ucykge1xuXHQvKipcblx0ICogQSBwdWJsaWMgdmFyIGRlc2NyaXB0aW9uXG5cdCAqXG5cdCAqIEBwcm9wZXJ0eSBteVB1YmxpY1ZhclxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dGhpcy5teVB1YmxpY1ZhciA9IDE7XG5cdHRoaXMuaW5pdCgpO1xufVxuXG52YXIgcCA9IENvbGxpc2lvbnMucHJvdG90eXBlO1xuXG4vKipcbiAqIENvbGxpc2lvbnMgaW5pdGlhbGlzYXRpb25cbiAqXG4gKiBAbWV0aG9kIGluaXRcbiAqL1xucC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdGdhbWUucGh5c2ljcy5zdGFydFN5c3RlbShQaGFzZXIuUGh5c2ljcy5QMkpTKTtcblx0Z2FtZS5waHlzaWNzLnAyLnNldEltcGFjdEV2ZW50cyh0cnVlKTtcblx0Z2FtZS5waHlzaWNzLnAyLmdyYXZpdHkueSA9IDEwMDtcblxuXHR0aGlzLnBsYXllcnMgPSBnYW1lLnBoeXNpY3MucDIuY3JlYXRlQ29sbGlzaW9uR3JvdXAoKTtcblx0dGhpcy50ZXJyYWluID0gZ2FtZS5waHlzaWNzLnAyLmNyZWF0ZUNvbGxpc2lvbkdyb3VwKCk7XG5cdHRoaXMuYnVsbGV0cyA9IGdhbWUucGh5c2ljcy5wMi5jcmVhdGVDb2xsaXNpb25Hcm91cCgpO1xuXHR0aGlzLmVuZW1pZXMgPSBnYW1lLnBoeXNpY3MucDIuY3JlYXRlQ29sbGlzaW9uR3JvdXAoKTtcblxuXHRnYW1lLnBoeXNpY3MucDIudXBkYXRlQm91bmRzQ29sbGlzaW9uR3JvdXAoKTtcbn07XG5cbi8qKlxuKlxuKi9cbnAuc2V0ID0gZnVuY3Rpb24oc3ByaXRlLCBjb2xsaXNpb25Hcm91cHMpIHtcblx0c3ByaXRlLmJvZHkuY29sbGlkZXMoY29sbGlzaW9uR3JvdXBzKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBDb2xsaXNpb25zO1xuIiwiLyoqXG4gKiBBIHByaXZhdGUgdmFyIGRlc2NyaXB0aW9uXG4gKlxuICogQHByb3BlcnR5IG15UHJpdmF0ZVZhclxuICogQHR5cGUge251bWJlcn1cbiAqIEBwcml2YXRlXG4gKi9cbnZhciBteVByaXZhdGVWYXIgPSAwO1xuXG4vKipcbiAqIEdyb3VwcyBkZXNjcmlwdGlvblxuICogY2FsbHMgaW5pdFxuICpcbiAqIEBjbGFzcyBHcm91cHNcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBHcm91cHMgKCkge1xuXHQvKipcblx0ICogQSBwdWJsaWMgdmFyIGRlc2NyaXB0aW9uXG5cdCAqXG5cdCAqIEBwcm9wZXJ0eSBteVB1YmxpY1ZhclxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dGhpcy5teVB1YmxpY1ZhciA9IDE7XG5cdHRoaXMuaW5pdCgpO1xufVxuXG52YXIgcCA9IEdyb3Vwcy5wcm90b3R5cGU7XG5cbi8qKlxuICogR3JvdXBzIGluaXRpYWxpc2F0aW9uXG4gKlxuICogQG1ldGhvZCBpbml0XG4gKi9cbnAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmFjdG9ycyA9IGdhbWUuYWRkLmdyb3VwKCk7XG5cdHRoaXMudGVycmFpbiA9IGdhbWUuYWRkLmdyb3VwKCk7XG5cdHRoaXMuYnVsbGV0cyA9IGdhbWUuYWRkLmdyb3VwKCk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gR3JvdXBzOyIsInZhciBnYW1lID0gd2luZG93LmdhbWU7XG4vKipcbiAqIFVzZXJDb250cm9sIGRlc2NyaXB0aW9uXG4gKlxuICogZGVmaW5lcyBhIHB1YmxpYyB2YXJpYWJsZSBhbmQgY2FsbHMgaW5pdCAtIGNoYW5nZSB0aGlzIGNvbnN0cnVjdG9yIHRvIHN1aXQgeW91ciBuZWVkcy5cbiAqIG5iLiB0aGVyZSdzIG5vIHJlcXVpcmVtZW50IHRvIGNhbGwgYW4gaW5pdCBmdW5jdGlvblxuICpcbiAqIEBjbGFzcyBVc2VyQ29udHJvbFxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFVzZXJDb250cm9sKGVuYWJsZUpveXBhZCkge1xuXG5cblx0dGhpcy5pbml0S2V5cygpO1xuXHQvL3RoaXMuaW5pdEpveXBhZCgpO1xuXG5cdHRoaXMuaXNKb3lwYWRFbmFibGVkID0gZW5hYmxlSm95cGFkO1xufVxuXG52YXIgcCA9IFVzZXJDb250cm9sLnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VyQ29udHJvbCBpbml0aWFsaXNhdGlvblxuICpcbiAqIEBtZXRob2QgaW5pdFxuICovXG5wLmluaXRLZXlzID0gZnVuY3Rpb24oKSB7XG5cblx0dGhpcy5jdXJzb3JzIFx0ICA9IGdhbWUuaW5wdXQua2V5Ym9hcmQuY3JlYXRlQ3Vyc29yS2V5cygpO1xuXHR0aGlzLnNwYWNlUHJlc3MgPSBnYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuU1BBQ0VCQVIpO1xuXHR0aGlzLnhLZXlcdCAgICAgID0gZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLlgpO1xuXG59O1xuXG5wLmluaXRKb3lwYWQgPSBmdW5jdGlvbigpIHtcblxuXHR0aGlzLnBhZCA9IGdhbWUucGx1Z2lucy5hZGQoUGhhc2VyLlZpcnR1YWxKb3lzdGljayk7XG5cdHRoaXMuc3RpY2sgPSB0aGlzLnBhZC5hZGREUGFkKDAsIDAsIDIwMCwgJ2RwYWQnKTtcblx0dGhpcy5zdGljay5hbGlnbkJvdHRvbUxlZnQoKTtcblx0dGhpcy5zdGljay5zY2FsZSA9IDAuODtcblxuXHR0aGlzLmJ1dHRvbkEgPSB0aGlzLnBhZC5hZGRCdXR0b24oNTI1LCA0MjAsICdkcGFkJywgJ2J1dHRvbjEtdXAnLCAnYnV0dG9uMS1kb3duJyk7XG5cdHRoaXMuYnV0dG9uQS5zY2FsZSA9IDAuODtcblxuXHR0aGlzLmJ1dHRvbkIgPSB0aGlzLnBhZC5hZGRCdXR0b24oNjMwLCAzOTAsICdkcGFkJywgJ2J1dHRvbjItdXAnLCAnYnV0dG9uMi1kb3duJyk7XG5cdHRoaXMuYnV0dG9uQi5zY2FsZSA9IDAuODtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBVc2VyQ29udHJvbDtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBkaXN0QXRvQjogZnVuY3Rpb24ocG9pbnRBLCBwb2ludEIpIHtcblxuICAgIHZhciBBID0gcG9pbnRCLnggLSBwb2ludEEueDtcbiAgICB2YXIgQiA9IHBvaW50Qi55IC0gcG9pbnRBLnk7XG5cbiAgICByZXR1cm4gTWF0aC5zcXJ0KEEqQSArIEIqQik7XG4gIH1cbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHByb3BlcnRpZXMgPSByZXF1aXJlKCcuL3Byb3BlcnRpZXMnKTtcblxudmFyIGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUocHJvcGVydGllcy53aWR0aCxwcm9wZXJ0aWVzLmhlaWdodCwgUGhhc2VyLkFVVE8pO1xud2luZG93LmdhbWUgPSBnYW1lO1xuXG5nYW1lLnN0YXRlLmFkZCgncGxheScsIHJlcXVpcmUoJy4vc3RhdGVzL3BsYXknKSk7XG5nYW1lLnN0YXRlLmFkZCgnbG9hZCcsIHJlcXVpcmUoJy4vc3RhdGVzL2xvYWQnKSk7XG5nYW1lLnN0YXRlLmFkZCgnbWVudScsIHJlcXVpcmUoJy4vc3RhdGVzL21lbnUnKSk7XG5nYW1lLnN0YXRlLmFkZCgnYm9vdCcsIHJlcXVpcmUoJy4vc3RhdGVzL2Jvb3QnKSk7XG5cbmdhbWUuc3RhdGUuc3RhcnQoJ2Jvb3QnKTtcbiIsIjsgdmFyIF9fYnJvd3NlcmlmeV9zaGltX3JlcXVpcmVfXz1yZXF1aXJlOyhmdW5jdGlvbiBicm93c2VyaWZ5U2hpbShtb2R1bGUsIGV4cG9ydHMsIHJlcXVpcmUsIGRlZmluZSwgYnJvd3NlcmlmeV9zaGltX19kZWZpbmVfX21vZHVsZV9fZXhwb3J0X18pIHtcbi8vIHN0YXRzLmpzIC0gaHR0cDovL2dpdGh1Yi5jb20vbXJkb29iL3N0YXRzLmpzXG52YXIgU3RhdHM9ZnVuY3Rpb24oKXt2YXIgbD1EYXRlLm5vdygpLG09bCxnPTAsbj1JbmZpbml0eSxvPTAsaD0wLHA9SW5maW5pdHkscT0wLHI9MCxzPTAsZj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2YuaWQ9XCJzdGF0c1wiO2YuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLGZ1bmN0aW9uKGIpe2IucHJldmVudERlZmF1bHQoKTt0KCsrcyUyKX0sITEpO2Yuc3R5bGUuY3NzVGV4dD1cIndpZHRoOjgwcHg7b3BhY2l0eTowLjk7Y3Vyc29yOnBvaW50ZXJcIjt2YXIgYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2EuaWQ9XCJmcHNcIjthLnN0eWxlLmNzc1RleHQ9XCJwYWRkaW5nOjAgMCAzcHggM3B4O3RleHQtYWxpZ246bGVmdDtiYWNrZ3JvdW5kLWNvbG9yOiMwMDJcIjtmLmFwcGVuZENoaWxkKGEpO3ZhciBpPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7aS5pZD1cImZwc1RleHRcIjtpLnN0eWxlLmNzc1RleHQ9XCJjb2xvcjojMGZmO2ZvbnQtZmFtaWx5OkhlbHZldGljYSxBcmlhbCxzYW5zLXNlcmlmO2ZvbnQtc2l6ZTo5cHg7Zm9udC13ZWlnaHQ6Ym9sZDtsaW5lLWhlaWdodDoxNXB4XCI7XG5pLmlubmVySFRNTD1cIkZQU1wiO2EuYXBwZW5kQ2hpbGQoaSk7dmFyIGM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtjLmlkPVwiZnBzR3JhcGhcIjtjLnN0eWxlLmNzc1RleHQ9XCJwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDo3NHB4O2hlaWdodDozMHB4O2JhY2tncm91bmQtY29sb3I6IzBmZlwiO2ZvcihhLmFwcGVuZENoaWxkKGMpOzc0PmMuY2hpbGRyZW4ubGVuZ3RoOyl7dmFyIGo9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7ai5zdHlsZS5jc3NUZXh0PVwid2lkdGg6MXB4O2hlaWdodDozMHB4O2Zsb2F0OmxlZnQ7YmFja2dyb3VuZC1jb2xvcjojMTEzXCI7Yy5hcHBlbmRDaGlsZChqKX12YXIgZD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2QuaWQ9XCJtc1wiO2Quc3R5bGUuY3NzVGV4dD1cInBhZGRpbmc6MCAwIDNweCAzcHg7dGV4dC1hbGlnbjpsZWZ0O2JhY2tncm91bmQtY29sb3I6IzAyMDtkaXNwbGF5Om5vbmVcIjtmLmFwcGVuZENoaWxkKGQpO3ZhciBrPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5rLmlkPVwibXNUZXh0XCI7ay5zdHlsZS5jc3NUZXh0PVwiY29sb3I6IzBmMDtmb250LWZhbWlseTpIZWx2ZXRpY2EsQXJpYWwsc2Fucy1zZXJpZjtmb250LXNpemU6OXB4O2ZvbnQtd2VpZ2h0OmJvbGQ7bGluZS1oZWlnaHQ6MTVweFwiO2suaW5uZXJIVE1MPVwiTVNcIjtkLmFwcGVuZENoaWxkKGspO3ZhciBlPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7ZS5pZD1cIm1zR3JhcGhcIjtlLnN0eWxlLmNzc1RleHQ9XCJwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDo3NHB4O2hlaWdodDozMHB4O2JhY2tncm91bmQtY29sb3I6IzBmMFwiO2ZvcihkLmFwcGVuZENoaWxkKGUpOzc0PmUuY2hpbGRyZW4ubGVuZ3RoOylqPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpLGouc3R5bGUuY3NzVGV4dD1cIndpZHRoOjFweDtoZWlnaHQ6MzBweDtmbG9hdDpsZWZ0O2JhY2tncm91bmQtY29sb3I6IzEzMVwiLGUuYXBwZW5kQ2hpbGQoaik7dmFyIHQ9ZnVuY3Rpb24oYil7cz1iO3N3aXRjaChzKXtjYXNlIDA6YS5zdHlsZS5kaXNwbGF5PVxuXCJibG9ja1wiO2Quc3R5bGUuZGlzcGxheT1cIm5vbmVcIjticmVhaztjYXNlIDE6YS5zdHlsZS5kaXNwbGF5PVwibm9uZVwiLGQuc3R5bGUuZGlzcGxheT1cImJsb2NrXCJ9fTtyZXR1cm57UkVWSVNJT046MTIsZG9tRWxlbWVudDpmLHNldE1vZGU6dCxiZWdpbjpmdW5jdGlvbigpe2w9RGF0ZS5ub3coKX0sZW5kOmZ1bmN0aW9uKCl7dmFyIGI9RGF0ZS5ub3coKTtnPWItbDtuPU1hdGgubWluKG4sZyk7bz1NYXRoLm1heChvLGcpO2sudGV4dENvbnRlbnQ9ZytcIiBNUyAoXCIrbitcIi1cIitvK1wiKVwiO3ZhciBhPU1hdGgubWluKDMwLDMwLTMwKihnLzIwMCkpO2UuYXBwZW5kQ2hpbGQoZS5maXJzdENoaWxkKS5zdHlsZS5oZWlnaHQ9YStcInB4XCI7cisrO2I+bSsxRTMmJihoPU1hdGgucm91bmQoMUUzKnIvKGItbSkpLHA9TWF0aC5taW4ocCxoKSxxPU1hdGgubWF4KHEsaCksaS50ZXh0Q29udGVudD1oK1wiIEZQUyAoXCIrcCtcIi1cIitxK1wiKVwiLGE9TWF0aC5taW4oMzAsMzAtMzAqKGgvMTAwKSksYy5hcHBlbmRDaGlsZChjLmZpcnN0Q2hpbGQpLnN0eWxlLmhlaWdodD1cbmErXCJweFwiLG09YixyPTApO3JldHVybiBifSx1cGRhdGU6ZnVuY3Rpb24oKXtsPXRoaXMuZW5kKCl9fX07XCJvYmplY3RcIj09PXR5cGVvZiBtb2R1bGUmJihtb2R1bGUuZXhwb3J0cz1TdGF0cyk7XG5cbjsgYnJvd3NlcmlmeV9zaGltX19kZWZpbmVfX21vZHVsZV9fZXhwb3J0X18odHlwZW9mIFN0YXRzICE9IFwidW5kZWZpbmVkXCIgPyBTdGF0cyA6IHdpbmRvdy5TdGF0cyk7XG5cbn0pLmNhbGwoZ2xvYmFsLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGZ1bmN0aW9uIGRlZmluZUV4cG9ydChleCkgeyBtb2R1bGUuZXhwb3J0cyA9IGV4OyB9KTtcbiIsIi8qKlxuICogRGVmaW5lcyBidWlsZCBzZXR0aW5ncyBmb3IgdGhlIHRocnVzdC1lbmdpbmVcbiAqXG4gKiBAbmFtZXNwYWNlIHRocnVzdC1lbmdpbmVcbiAqIEBtb2R1bGUgcHJvcGVydGllc1xuICogQGNsYXNzXG4gKiBAc3RhdGljXG4gKiBAdHlwZSB7e2VuYWJsZUpveXBhZDogYm9vbGVhbiwgZmF0YWxDb2xsaXNpb25zOiBib29sZWFuLCBzY2FsZToge21vZGU6IG51bWJlcn0sIGRyYXdTdGF0czogYm9vbGVhbn19XG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRkZWJ1Z1BoeXNpY3M6IGZhbHNlLFxuXHRjb2xsaWRlV29ybGRCb3VuZHM6IHRydWUsXG5cdGVuYWJsZUpveXBhZDogZmFsc2UsXG5cdGZhdGFsQ29sbGlzaW9uczogdHJ1ZSxcblx0c2NhbGU6IHtcblx0XHRtb2RlOiBQaGFzZXIuU2NhbGVNYW5hZ2VyLk5PX1NDQUxFXG5cdH0sXG5cdGRyYXdTdGF0czogdHJ1ZSxcblx0ZHJhd01vbnRhaW5zOiBmYWxzZSxcblx0d2lkdGg6IDcwMCxcblx0aGVpZ2h0OiA1MDAsXG5cdGdhbWVQbGF5OiB7XG5cdFx0ZnJlZU9yYkxvY2tpbmc6IGZhbHNlLFxuXHRcdGF1dG9PcmJMb2NraW5nOiB0cnVlLFxuXHRcdHRyYWN0b3JCZWFtTGVuZ3RoOiA4MCxcblx0XHR0cmFjdG9yQmVhbVZhcmlhdGlvbjogMTAsXG5cdFx0bG9ja2luZ0R1cmF0aW9uOiA5MDBcblx0fVxufTtcbiIsInZhciBwcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vcHJvcGVydGllcycpO1xudmFyIGZlYXR1cmVzID0gcmVxdWlyZSgnLi4vdXRpbHMvZmVhdHVyZXMnKTtcbnZhciBTdGF0c01vZHVsZSA9IHJlcXVpcmUoJy4uL3V0aWxzL1N0YXRzTW9kdWxlJyk7XG52YXIgVXNlckNvbnRyb2wgPSByZXF1aXJlKCcuLi9lbnZpcm9ubWVudC9Vc2VyQ29udHJvbCcpO1xuXG52YXIgc3RhdHM7XG52YXIgdXNlckNvbnRyb2w7XG4vKipcbiAqIFRoZSBib290IHN0YXRlXG4gKlxuICogQG5hbWVzcGFjZSBzdGF0ZXNcbiAqIEBtb2R1bGUgYm9vdFxuICogQHR5cGUge3tjcmVhdGU6IEZ1bmN0aW9uLCB1cGRhdGU6IEZ1bmN0aW9ufX1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHByZWxvYWQ6IGZ1bmN0aW9uKCkge1xuXHRcdGdhbWUuc2NhbGUuc2NhbGVNb2RlID0gcHJvcGVydGllcy5zY2FsZS5tb2RlO1xuXHRcdGdhbWUuc2NhbGUuc2V0U2NyZWVuU2l6ZSgpO1xuXHR9LFxuXG5cdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cblx0XHRmZWF0dXJlcy5pbml0KCk7XG5cblx0XHRzdGF0cyA9IG5ldyBTdGF0c01vZHVsZSgpO1xuXG5cdFx0dXNlckNvbnRyb2wgPSBuZXcgVXNlckNvbnRyb2woZmVhdHVyZXMuaXNUb3VjaFNjcmVlbiB8fCBwcm9wZXJ0aWVzLmVuYWJsZUpveXBhZCk7XG5cblx0XHRjb25zb2xlLndhcm4oXCJJbnN0cnVjdGlvbnM6IFVzZSBDdXJzb3JzIHRvIG1vdmUgc2hpcCwgc3BhY2UgdG8gc2hvb3QsIGNvbGxlY3Qgb3JiIGJ5IHBhc3NpbmcgbmVhclwiKTtcblx0XHRjb25zb2xlLndhcm4oXCJUb3VjaFNjcmVlbkRldGVjdGVkOlwiLCBmZWF0dXJlcy5pc1RvdWNoU2NyZWVuKTtcblxuXHRcdGdhbWUuc3RhdHMgPSBzdGF0cztcblxuXHRcdGdhbWUuY29udHJvbHMgPSB1c2VyQ29udHJvbDtcblxuXHRcdGdhbWUuc3RhdGUuc3RhcnQoJ3BsYXknKTtcblxuXG5cblx0fSxcblx0dXBkYXRlOiBmdW5jdGlvbigpIHtcblxuXHR9XG59O1xuIiwiLyoqXG4gKiBUaGUgbG9hZCBzdGF0ZVxuICpcbiAqIEBuYW1lc3BhY2Ugc3RhdGVzXG4gKiBAbW9kdWxlIGxvYWRcbiAqIEB0eXBlIHt7Y3JlYXRlOiBGdW5jdGlvbiwgdXBkYXRlOiBGdW5jdGlvbn19XG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXG5cdH0sXG5cdHVwZGF0ZTogZnVuY3Rpb24oKSB7XG5cblx0fVxufTsiLCIvKipcbiAqIFRoZSBtZW51IHN0YXRlXG4gKlxuICogQG5hbWVzcGFjZSBzdGF0ZXNcbiAqIEBtb2R1bGUgbWVudVxuICogQHR5cGUge3tjcmVhdGU6IEZ1bmN0aW9uLCB1cGRhdGU6IEZ1bmN0aW9ufX1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cblx0fSxcblx0dXBkYXRlOiBmdW5jdGlvbigpIHtcblxuXHR9XG59OyIsIi8vaW1wb3J0c1xudmFyIHByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9wcm9wZXJ0aWVzJyk7XG52YXIgQ29sbGlzaW9ucyA9IHJlcXVpcmUoJy4uL2Vudmlyb25tZW50L0NvbGxpc2lvbnMnKTtcbnZhciBHcm91cHMgPSByZXF1aXJlKCcuLi9lbnZpcm9ubWVudC9Hcm91cHMnKTtcbnZhciBQbGF5ZXIgPSByZXF1aXJlKCcuLi9hY3RvcnMvUGxheWVyJyk7XG52YXIgTGltcGV0R3VuID0gcmVxdWlyZSgnLi4vYWN0b3JzL0xpbXBldEd1bicpO1xudmFyIE9yYiA9IHJlcXVpcmUoJy4uL2FjdG9ycy9PcmInKTtcbnZhciBNYXAgPSByZXF1aXJlKCcuLi9hY3RvcnMvTWFwJyk7XG52YXIgQmFja2dyb3VuZCA9IHJlcXVpcmUoJy4uL2FjdG9ycy9CYWNrZ3JvdW5kJyk7XG52YXIgVHJhY3RvckJlYW0gPSByZXF1aXJlKCcuLi9hY3RvcnMvVHJhY3RvckJlYW0nKTtcbnZhciBmZWF0dXJlcyA9IHJlcXVpcmUoJy4uL3V0aWxzL2ZlYXR1cmVzJyk7XG5cbi8vZW52aXJvbm1lbnRcbnZhciBjb2xsaXNpb25zO1xudmFyIGdyb3VwcztcblxuLy9hY3RvcnNcbnZhciBwbGF5ZXI7XG52YXIgb3JiO1xudmFyIHRyYWN0b3JCZWFtO1xudmFyIGJhY2tncm91bmQ7XG52YXIgbGltcGV0MTtcblxuLy9jb250cm9scztcbnZhciBidXR0b25BRG93biA9IGZhbHNlO1xudmFyIGJ1dHRvbkJEb3duID0gZmFsc2U7XG52YXIgaXNYRG93biAgICAgPSBmYWxzZTtcblxuXG5cbi8qKlxuICogVGhlIHBsYXkgc3RhdGUgLSB0aGlzIGlzIHdoZXJlIHRoZSBtYWdpYyBoYXBwZW5zXG4gKlxuICogQG5hbWVzcGFjZSBzdGF0ZXNcbiAqIEBtb2R1bGUgcGxheVxuICogQHR5cGUge3tjcmVhdGU6IEZ1bmN0aW9uLCB1cGRhdGU6IEZ1bmN0aW9ufX1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cblx0cHJlbG9hZDogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKGdhbWUuY29udHJvbHMuaXNKb3lwYWRFbmFibGVkKSB7XG5cdFx0XHRnYW1lLmxvYWQuYXRsYXMoJ2RwYWQnLCAnaW1hZ2VzL3ZpcnR1YWxqb3lzdGljay9za2lucy9kcGFkLnBuZycsICdpbWFnZXMvdmlydHVhbGpveXN0aWNrL3NraW5zL2RwYWQuanNvbicpO1xuXHRcdH1cblx0XHRnYW1lLmxvYWQuaW1hZ2UoJ3RocnVzdG1hcCcsICdpbWFnZXMvdGhydXN0LWxldmVsMi5wbmcnKTtcblx0XHRnYW1lLmxvYWQucGh5c2ljcygncGh5c2ljc0RhdGEnLCAnaW1hZ2VzL3RocnVzdC1sZXZlbDIuanNvbicpO1xuXHRcdGdhbWUubG9hZC5pbWFnZSgnc3RhcnMnLCAnaW1hZ2VzL3N0YXJmaWVsZC5wbmcnKTtcblx0fSxcblxuXHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuZGVmaW5lV29ybGRCb3VuZHMoKTtcblx0XHR0aGlzLmNyZWF0ZUFjdG9ycygpO1xuXHRcdHRoaXMuY3JlYXRlR3JvdXBMYXllcmluZygpO1xuXHRcdHRoaXMuaW5pdENvbnRyb2xzKCk7XG5cdH0sXG5cdHVwZGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5iZWdpblN0YXRzKCk7XG5cdFx0dGhpcy5jaGVja1BsYXllcklucHV0KCk7XG5cdFx0dGhpcy5lbmRTdGF0cygpO1xuXHR9LFxuXG5cdGNoZWNrUGxheWVySW5wdXQ6IGZ1bmN0aW9uKCl7XG5cdFx0aWYgKCh0aGlzLnN0aWNrICYmIHRoaXMuc3RpY2suaXNEb3duICYmIHRoaXMuc3RpY2suZGlyZWN0aW9uID09PSBQaGFzZXIuTEVGVCkgfHwgdGhpcy5jdXJzb3JzLmxlZnQuaXNEb3duKSB7XG5cdFx0XHRwbGF5ZXIuYm9keS5yb3RhdGVMZWZ0KDEwMCk7XG5cdFx0fSBlbHNlIGlmICgodGhpcy5zdGljayAmJiB0aGlzLnN0aWNrLmlzRG93biAmJiB0aGlzLnN0aWNrLmRpcmVjdGlvbiA9PT0gUGhhc2VyLlJJR0hUKSB8fCB0aGlzLmN1cnNvcnMucmlnaHQuaXNEb3duKSB7XG5cdFx0XHRwbGF5ZXIuYm9keS5yb3RhdGVSaWdodCgxMDApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwbGF5ZXIuYm9keS5zZXRaZXJvUm90YXRpb24oKTtcblx0XHR9XG5cdFx0aWYgKHRoaXMuY3Vyc29ycy51cC5pc0Rvd24gfHwgYnV0dG9uQURvd24pe1xuXHRcdFx0cGxheWVyLmJvZHkudGhydXN0KDQwMCk7XG5cdFx0fVxuXHRcdGlmICghdHJhY3RvckJlYW0uaGFzR3JhYmJlZCkge1xuXHRcdFx0aWYgKGlzWERvd24gfHwgcHJvcGVydGllcy5nYW1lUGxheS5hdXRvT3JiTG9ja2luZykge1xuXHRcdFx0XHRwbGF5ZXIuY2hlY2tPcmJEaXN0YW5jZSgpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0cmFjdG9yQmVhbS5kcmF3QmVhbShwbGF5ZXIucG9zaXRpb24pO1xuXHRcdH1cblx0fSxcblxuXHRkZWZpbmVXb3JsZEJvdW5kczogZnVuY3Rpb24oKSB7XG5cdFx0Z2FtZS53b3JsZC5zZXRCb3VuZHMoMCwgMCwgOTI4LCAxMjgwKTtcblx0fSxcblxuXHRjcmVhdGVBY3RvcnM6IGZ1bmN0aW9uKCkge1xuXHRcdGdyb3VwcyA9IG5ldyBHcm91cHMoKTtcblx0XHRjb2xsaXNpb25zID0gbmV3IENvbGxpc2lvbnMoKTtcblx0XHRiYWNrZ3JvdW5kID0gbmV3IEJhY2tncm91bmQoKTtcblx0XHRwbGF5ZXIgPSBuZXcgUGxheWVyKGdhbWUud29ybGQuY2VudGVyWCwgMzAwLCBjb2xsaXNpb25zLCBncm91cHMpO1xuXHRcdG9yYiA9IG5ldyBPcmIoY29sbGlzaW9ucyk7XG5cdFx0dHJhY3RvckJlYW0gPSBuZXcgVHJhY3RvckJlYW0ob3JiKTtcblx0XHRwbGF5ZXIuc2V0VHJhY3RvckJlYW0odHJhY3RvckJlYW0pO1xuXHRcdGxpbXBldDEgPSBuZXcgTGltcGV0R3VuKDUwMCwgNzAwLCA0NSwgY29sbGlzaW9ucywgZ3JvdXBzKTtcblx0XHRtYXAgPSBuZXcgTWFwKGNvbGxpc2lvbnMpO1xuXG5cdFx0Z2FtZS5jYW1lcmEuZm9sbG93KHBsYXllcik7XG5cblx0XHRjb2xsaXNpb25zLnNldChvcmIsIFtjb2xsaXNpb25zLnBsYXllcnMsIGNvbGxpc2lvbnMudGVycmFpbiwgY29sbGlzaW9ucy5idWxsZXRzXSk7XG5cdFx0Y29sbGlzaW9ucy5zZXQobWFwLCBbY29sbGlzaW9ucy5wbGF5ZXJzLCBjb2xsaXNpb25zLnRlcnJhaW4sIGNvbGxpc2lvbnMuYnVsbGV0c10pO1xuXHR9LFxuXG5cdGNyZWF0ZUdyb3VwTGF5ZXJpbmc6IGZ1bmN0aW9uKCkge1xuXHRcdGdyb3Vwcy50ZXJyYWluLmFkZChiYWNrZ3JvdW5kLnNwcml0ZSk7XG5cdFx0aWYgKGJhY2tncm91bmQubW91bnRhaW5zKSBncm91cHMudGVycmFpbi5hZGQoYmFja2dyb3VuZC5tb3VudGFpbnMpO1xuXHRcdGdyb3Vwcy5hY3RvcnMuYWRkKHBsYXllcik7XG5cdFx0Z3JvdXBzLmFjdG9ycy5hZGQob3JiLnNwcml0ZSk7XG5cdFx0Z3JvdXBzLmFjdG9ycy5hZGQobGltcGV0MSk7XG5cdFx0Z2FtZS53b3JsZC5zd2FwKGdyb3Vwcy50ZXJyYWluLCBncm91cHMuYWN0b3JzKTtcblx0fSxcblxuXHRpbml0Q29udHJvbHM6IGZ1bmN0aW9uKCkge1xuXHRcdGlmIChnYW1lLmNvbnRyb2xzLmlzSm95cGFkRW5hYmxlZCkge1xuXHRcdFx0Z2FtZS5jb250cm9scy5pbml0Sm95cGFkKCk7XG5cdFx0XHR0aGlzLnN0aWNrID0gZ2FtZS5jb250cm9scy5zdGljaztcblx0XHRcdGdhbWUuY29udHJvbHMuYnV0dG9uQS5vbkRvd24uYWRkKHRoaXMucHJlc3NCdXR0b25BLCB0aGlzKTtcblx0XHRcdGdhbWUuY29udHJvbHMuYnV0dG9uQS5vblVwLmFkZCh0aGlzLnVwQnV0dG9uQSwgdGhpcyk7XG5cdFx0XHRnYW1lLmNvbnRyb2xzLmJ1dHRvbkIub25Eb3duLmFkZCh0aGlzLnByZXNzQnV0dG9uQiwgdGhpcyk7XG5cdFx0XHRnYW1lLmNvbnRyb2xzLmJ1dHRvbkIub25VcC5hZGQodGhpcy51cEJ1dHRvbkIsIHRoaXMpO1xuXHRcdH1cblxuXHRcdHRoaXMuY3Vyc29ycyBcdCA9IGdhbWUuY29udHJvbHMuY3Vyc29ycztcblx0XHRnYW1lLmNvbnRyb2xzLnNwYWNlUHJlc3Mub25Eb3duLmFkZChwbGF5ZXIuc2hvb3QsIHBsYXllcik7XG5cdFx0Z2FtZS5jb250cm9scy54S2V5Lm9uRG93bi5hZGQodGhpcy54RG93biwgdGhpcyk7XG5cdFx0Z2FtZS5jb250cm9scy54S2V5Lm9uVXAuYWRkKHRoaXMueFVwLCB0aGlzKTtcblx0fSxcblxuXHRiZWdpblN0YXRzOiBmdW5jdGlvbigpIHtcblx0XHRpZiAocHJvcGVydGllcy5kcmF3U3RhdHMpIHtcblx0XHRcdGdhbWUuc3RhdHMuc3RhcnQoKTtcblx0XHR9XG5cdH0sXG5cblx0ZW5kU3RhdHM6IGZ1bmN0aW9uKCkge1xuXHRcdGlmIChwcm9wZXJ0aWVzLmRyYXdTdGF0cykge1xuXHRcdFx0Z2FtZS5zdGF0cy5lbmQoKTtcblx0XHR9XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRnYW1lLmRlYnVnLmNhbWVyYUluZm8oZ2FtZS5jYW1lcmEsIDUwMCwgMjApO1xuXHR9LFxuXG5cdHByZXNzQnV0dG9uQTogZnVuY3Rpb24oKSB7XG5cdFx0YnV0dG9uQURvd24gPSB0cnVlO1xuXHR9LFxuXG5cdHVwQnV0dG9uQTogZnVuY3Rpb24oKSB7XG5cdFx0YnV0dG9uQURvd24gPSBmYWxzZTtcblx0fSxcblxuXHRwcmVzc0J1dHRvbkI6IGZ1bmN0aW9uKCkge1xuXHRcdGJ1dHRvbkJEb3duID0gdHJ1ZTtcblx0XHRwbGF5ZXIuc2hvb3QoKTtcblx0fSxcblxuXHR1cEJ1dHRvbkI6IGZ1bmN0aW9uKCkge1xuXHRcdGJ1dHRvbkJEb3duID0gZmFsc2U7XG5cdH0sXG5cblx0eERvd246IGZ1bmN0aW9uICgpIHtcblx0XHRpc1hEb3duID0gdHJ1ZTtcblx0XHRsaW1wZXQxLnNob290KCk7XG5cdH0sXG5cblx0eFVwOiBmdW5jdGlvbigpIHtcblx0XHRpc1hEb3duID0gZmFsc2U7XG5cdFx0aWYgKCFwcm9wZXJ0aWVzLmdhbWVQbGF5LmF1dG9PcmJMb2NraW5nKSB7XG5cdFx0XHR0cmFjdG9yQmVhbS5sb2NraW5nUmVsZWFzZSgpO1xuXHRcdH1cblx0fVxufTtcbiIsInZhciBTdGF0cyA9IHJlcXVpcmUoJ1N0YXRzJyk7XG52YXIgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL3Byb3BlcnRpZXMnKTtcbi8qKlxuICogQSBwcml2YXRlIHZhciBkZXNjcmlwdGlvblxuICpcbiAqIEBwcm9wZXJ0eSBzdGF0c1xuICogQHR5cGUge1N0YXRzfVxuICogQHByaXZhdGVcbiAqL1xudmFyIHN0YXRzO1xuXG4vKipcbiAqIFN0YXRzTW9kdWxlIGRlc2NyaXB0aW9uXG4gKlxuICogZGVmaW5lcyBhIHB1YmxpYyB2YXJpYWJsZSBhbmQgY2FsbHMgaW5pdCAtIGNoYW5nZSB0aGlzIGNvbnN0cnVjdG9yIHRvIHN1aXQgeW91ciBuZWVkcy5cbiAqIG5iLiB0aGVyZSdzIG5vIHJlcXVpcmVtZW50IHRvIGNhbGwgYW4gaW5pdCBmdW5jdGlvblxuICpcbiAqIEBjbGFzcyBTdGF0c01vZHVsZVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFN0YXRzTW9kdWxlKCkge1xuXHQvKipcblx0ICogQSBwdWJsaWMgdmFyIGRlc2NyaXB0aW9uXG5cdCAqXG5cdCAqIEBwcm9wZXJ0eSBteVB1YmxpY1ZhclxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0aWYgKHByb3BlcnRpZXMuZHJhd1N0YXRzKSB7XG5cdFx0Y29uc29sZS5sb2coJ3N0YXR0bycpO1xuXHRcdHN0YXRzID0gbmV3IFN0YXRzKCk7XG5cdFx0c3RhdHMuc2V0TW9kZSgwKTtcblx0XHRzdGF0cy5kb21FbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcblx0XHRzdGF0cy5kb21FbGVtZW50LnN0eWxlLmxlZnQgPSAnMHB4Jztcblx0XHRzdGF0cy5kb21FbGVtZW50LnN0eWxlLmJvdHRvbSA9ICcwcHgnO1xuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIHN0YXRzLmRvbUVsZW1lbnQgKTtcblx0fVxufVxuXG52YXIgcCA9IFN0YXRzTW9kdWxlLnByb3RvdHlwZTtcblxuLyoqXG4gKlxuICogQG1ldGhvZCBiZWdpblxuICovXG5wLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG5cdHN0YXRzLmJlZ2luKCk7XG59O1xuXG4vKipcbiAqIEBtZXRob2QgZW5kXG4gKi9cbnAuZW5kID0gZnVuY3Rpb24oKSB7XG5cdHN0YXRzLmVuZCgpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YXRzTW9kdWxlO1xuIiwiLypcbmZ1bmN0aW9uIGlzVG91Y2hEZXZpY2UoKXtcbiAgICByZXR1cm4gdHJ1ZSA9PSAoXCJvbnRvdWNoc3RhcnRcIiBpbiB3aW5kb3cgfHwgd2luZG93LkRvY3VtZW50VG91Y2ggJiYgZG9jdW1lbnQgaW5zdGFuY2VvZiBEb2N1bWVudFRvdWNoKTtcbn1cbk5vdyBjaGVja2luZyBpZiDigJhpc1RvdWNoRGV2aWNlKCk74oCZIGlzIHJldHVybnMgdHJ1ZSBpdCBtZWFucyBpdHMgYSB0b3VjaCBkZXZpY2UuXG5cbmlmKGlzVG91Y2hEZXZpY2UoKT09PXRydWUpIHtcbiAgICBhbGVydCgnVG91Y2ggRGV2aWNlJyk7IC8veW91ciBsb2dpYyBmb3IgdG91Y2ggZGV2aWNlXG59XG5lbHNlIHtcbiAgICBhbGVydCgnTm90IGEgVG91Y2ggRGV2aWNlJyk7IC8veW91ciBsb2dpYyBmb3Igbm9uIHRvdWNoIGRldmljZVxufVxuKi9cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuaXNUb3VjaFNjcmVlbiA9ICgoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KVxuICAgICAgICB8fCAobmF2aWdhdG9yLk1heFRvdWNoUG9pbnRzID4gMClcbiAgICAgICAgfHwgKG5hdmlnYXRvci5tc01heFRvdWNoUG9pbnRzID4gMCkpO1xuICAgIGNvbnNvbGUubG9nKFwidG91Y2hTY3JlZW46XCIsIHRoaXMuaXNUb3VjaFNjcmVlbik7XG4gIH0sXG4gIGlzVG91Y2hTY3JlZW46IHRoaXMuaXNUb3VjaFNjcmVlblxufVxuIl19
