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
},{"../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Map.js":[function(require,module,exports){
var properties = require('../properties');
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
var game = window.game;
var properties = require('../properties');
var Turret = require('./Turret');
var utils = require('../environment/utils')


/**
 * Player description
 * calls init
 *
 * @param collisions {Collisions} Our collisions container of collisionGroups
 * @param groups {Groups}
 * @class Player
 * @constructor
 */
function Player(collisions, groups) {
	/**
	 * The Collisions Object
	 *
	 * @property collisions
	 * @type {Collisions}
	 */
	this.collisions = collisions;

	this.groups = groups;

	this.tractorBeam = null;
	/**
	 * Creates the player sprite which is returned for easy reference by the containing state
	 *
	 * @property sprite
	 * @type {Phaser.Sprite}
	 */
	this.sprite = game.make.sprite(game.world.centerX, 300);

	this.init();
}

var p = Player.prototype;

/**
 * Player initialisation
 *
 * @method init
 */
p.init = function() {

	game.physics.p2.enable(this.sprite, properties.debugPhysics);

	this.body = this.sprite.body;

	var graphics = new Phaser.Graphics(game, 0,0);
	//graphics.beginFill(0x000000);
	graphics.lineStyle(4,0xffffff);
	graphics.lineTo(20,40);
	graphics.lineTo(25,40);
	graphics.arc(0,40,25,game.math.degToRad(0), game.math.degToRad(180), false);
	graphics.lineTo(-20,40);
	graphics.lineTo(0,0);
	//graphics.endFill();
	this.sprite.addChild(graphics);

	this.sprite.scale.setTo(0.3,0.3);
	this.sprite.pivot.x = 0;
	this.sprite.pivot.y = 40;

	this.body.clearShapes();
	this.body.addRectangle(-10,-17, 0,-2);
	this.body.collideWorldBounds = properties.collideWorldBounds;
	this.body.mass = 1;
	this.body.setCollisionGroup(this.collisions.players);

	this.turret = new Turret(this.groups, this, "FORWARDS");

	this.body.collides(this.collisions.terrain, this.crash, this);
};

p.checkOrbDistance = function() {
	var distance = utils.distAtoB(this.sprite.position, this.tractorBeam.orb.sprite.position);
	if (distance < this.tractorBeam.length) {
		this.tractorBeam.drawBeam(this.sprite.position);

	} else if (distance >= this.tractorBeam.length && distance < 90) {
		//console.log('isLocked: ', this.tractorBeam.isLocked, 'hasGrabbed:', this.tractorBeam.hasGrabbed);
		if (this.tractorBeam.isLocked && !this.tractorBeam.hasGrabbed) {
			this.tractorBeam.grab(this);
		}
	} else {
		if (this.tractorBeam.isLocking) {
			//console.log('releasing...');
			this.tractorBeam.lockingRelease();
		}
	}
};
p.shoot = function() {
	this.turret.shoot();
},

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
	//console.log('drawBeam', this.hasGrabbed, posA);
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
	//this.locked = false;
	this.isLocking = false;
	this.hasGrabbed = false;
	graphics.clear();
	//timer.reset();

	timer.stop(true);
};

p.grab = function(player) {
	//console.log('grabbed');
	this.hasGrabbed = true;
	var maxForce = 200000;
	var diffX = player.sprite.position.x - this.orb.sprite.position.x;
	var diffY = player.sprite.position.y - this.orb.sprite.position.y;
	game.physics.p2.createRevoluteConstraint(player.sprite, [0, 0], this.orb.sprite, [diffX,diffY], maxForce);
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
function Turret(groups, origin, type) {
	/**
	 * A public var description
	 *
	 * @property myPublicVar
	 * @type {number}
	 */
	this.groups = groups;
	this.origin = origin;
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
	var bullet = game.make.sprite(this.origin.sprite.position.x, this.origin.sprite.position.y, this.bulletBitmap);
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

var game = new Phaser.Game(700,400, Phaser.AUTO);
window.game = game;

game.state.add('play', require('./states/play'));
game.state.add('load', require('./states/load'));
game.state.add('menu', require('./states/menu'));
game.state.add('boot', require('./states/boot'));

//game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
//game.scale.setScreenSize();

game.state.start('boot');

},{"./states/boot":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/states/boot.js","./states/load":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/states/load.js","./states/menu":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/states/menu.js","./states/play":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/states/play.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/libs/stats.js/stats.min.js":[function(require,module,exports){
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
		mode: Phaser.ScaleManager.SHOW_ALL
	},
	drawStats: false,
	drawMontains: false,
	gamePlay: {
		freeOrbLocking: false,
		autoOrbLocking: true,
		tractorBeamLength: 80,
		tractorBeamVariation: 10,
		lockingDuration: 900
	}
};

},{}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/states/boot.js":[function(require,module,exports){
var Stats = require('Stats');
var properties = require('../properties');
var features = require('../utils/features');

/**
 * The boot state
 *
 * @namespace states
 * @module boot
 * @type {{create: Function, update: Function}}
 */
module.exports = {
	preload: function() {
		//game.load.script('joystick', 'javascripts/browserify/phaser-virtual-joystick.min.js');
		game.scale.scaleMode = properties.scale.mode;
		game.scale.setScreenSize();
	},

	create: function() {
		if (properties.drawStats) {
			window.stats = new Stats();
			stats.setMode(0);
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.left = '0px';
			stats.domElement.style.top = '0px';

			document.body.appendChild( stats.domElement );

			setInterval(function () {
				stats.begin();
				stats.end();
			}, 1000 / 60);
		}

		features.init();

		console.warn("Instructions: Use Cursors to move ship, space to shoot, collect orb by passing near");

		game.state.start('play');

	},
	update: function() {

	}
};

},{"../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js","../utils/features":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/utils/features.js","Stats":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/libs/stats.js/stats.min.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/states/load.js":[function(require,module,exports){
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
var Orb = require('../actors/Orb');
var Map = require('../actors/Map');
var Background = require('../actors/Background');
var TractorBeam = require('../actors/TractorBeam');
var features = require('../utils/features');

//privates
var game = window.game;
var player;
var orb;
var tractorBeam;
var cursors;
var ground;
var actors;
var terrain;
var map;
var background;

//controls;
var pad;
var buttonA;
var buttonB;
var buttonADown = false;
var buttonBDown = false;
var isXDown     = false;
var joypad = properties.enableJoypad || features.isTouchScreen;

//modules
var collisions;
var groups;

/**
 * The play state - this is where the magic happens
 *
 * @namespace states
 * @module play
 * @type {{create: Function, update: Function}}
 */
module.exports = {

	preload: function() {
		game.load.image('thrustmap', 'images/thrust-level2.png');
		game.load.physics('physicsData', 'images/thrust-level2.json');
		game.load.image('stars', 'images/starfield.png');
		if (joypad) {
			game.load.atlas('dpad', 'images/virtualjoystick/skins/dpad.png', 'images/virtualjoystick/skins/dpad.json');
		}
	},

	create: function() {
		game.world.setBounds(0, 0, 928, 1280);

		groups = new Groups();
		collisions = new Collisions();
		background = new Background();
		player = new Player(collisions, groups);
		orb = new Orb(collisions);
		map = new Map(collisions);
		tractorBeam = new TractorBeam(orb);
		player.tractorBeam = tractorBeam;

		collisions.set(orb, [collisions.players, collisions.terrain, collisions.bullets]);
		collisions.set(map, [collisions.players, collisions.terrain, collisions.bullets]);

		groups.terrain.add(background.sprite);
		if (background.mountains) groups.terrain.add(background.mountains);
		groups.actors.add(player.sprite);
		groups.actors.add(orb.sprite);
		game.world.swap(groups.terrain, groups.actors);
		game.camera.follow(player.sprite);

		if (joypad) {
			pad = game.plugins.add(Phaser.VirtualJoystick);
			this.stick = pad.addDPad(0, 0, 200, 'dpad');
			this.stick.alignBottomLeft();

			buttonA = pad.addButton(515, 330, 'dpad', 'button1-up', 'button1-down');
			buttonA.onDown.add(this.pressButtonA, this);
			buttonA.onUp.add(this.upButtonA, this);

			buttonB = pad.addButton(620, 290, 'dpad', 'button2-up', 'button2-down');
			buttonB.onDown.add(this.pressButtonB, this);
			buttonB.onUp.add(this.upButtonB, this);
		}

		cursors 			 = game.input.keyboard.createCursorKeys();
		var spacePress = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		var xKey	     = game.input.keyboard.addKey(Phaser.Keyboard.X);
		spacePress.onDown.add(player.shoot, player);
		xKey.onDown.add(this.xDown, this);
		xKey.onUp.add(this.xUp, this);
	},
	update: function() {
		if (cursors.left.isDown) {
			player.body.rotateLeft(100);
		} else if (cursors.right.isDown) {
			player.body.rotateRight(100);
		} else {
			player.body.setZeroRotation();
		}
		if (cursors.up.isDown || buttonADown){
			player.body.thrust(400);
		}
		if (!tractorBeam.hasGrabbed) {
			if (isXDown || properties.gamePlay.autoOrbLocking) {
				player.checkOrbDistance();
			}
		} else {
			tractorBeam.drawBeam(player.sprite.position);
		}
		if (joypad) {
			if (this.stick.isDown) {
				if (this.stick.direction === Phaser.LEFT) {
					player.body.rotateLeft(100);
				} else if (this.stick.direction === Phaser.RIGHT) {
					player.body.rotateRight(100);
				}
			}
		}
		//game.world.wrap(player.body, 0, false);
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
	},

	xUp: function() {
		isXDown = false;
		if (!properties.gamePlay.autoOrbLocking) {
			this.releaseTractorBeam();
		}
	}
};

},{"../actors/Background":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Background.js","../actors/Map":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Map.js","../actors/Orb":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Orb.js","../actors/Player":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Player.js","../actors/TractorBeam":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/TractorBeam.js","../environment/Collisions":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/Collisions.js","../environment/Groups":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/Groups.js","../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js","../utils/features":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/utils/features.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/utils/features.js":[function(require,module,exports){
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

var isTouchScreen;

function init () {
  isTouchScreen = (('ontouchstart' in window)
      || (navigator.MaxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
}


module.exports = {
  init: init,
  isTouchScreen: isTouchScreen
}

},{}]},{},["/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/game.js"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYWN0b3JzL0JhY2tncm91bmQuanMiLCJzcmMvYWN0b3JzL01hcC5qcyIsInNyYy9hY3RvcnMvT3JiLmpzIiwic3JjL2FjdG9ycy9QbGF5ZXIuanMiLCJzcmMvYWN0b3JzL1RyYWN0b3JCZWFtLmpzIiwic3JjL2FjdG9ycy9UdXJyZXQuanMiLCJzcmMvZW52aXJvbm1lbnQvQ29sbGlzaW9ucy5qcyIsInNyYy9lbnZpcm9ubWVudC9Hcm91cHMuanMiLCJzcmMvZW52aXJvbm1lbnQvdXRpbHMuanMiLCJzcmMvZ2FtZS5qcyIsInNyYy9saWJzL3N0YXRzLmpzL3N0YXRzLm1pbi5qcyIsInNyYy9wcm9wZXJ0aWVzLmpzIiwic3JjL3N0YXRlcy9ib290LmpzIiwic3JjL3N0YXRlcy9sb2FkLmpzIiwic3JjL3N0YXRlcy9tZW51LmpzIiwic3JjL3N0YXRlcy9wbGF5LmpzIiwic3JjL3V0aWxzL2ZlYXR1cmVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBwcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vcHJvcGVydGllcycpO1xuXG4vKipcbiAqXG4gKlxuICogQHR5cGUge1BoYXNlci5HcmFwaGljc31cbiAqL1xudmFyIGdyYXBoaWNzO1xuXG4vKipcbiAqIEJhY2tncm91bmQgZGVzY3JpcHRpb25cbiAqXG4gKiBkZWZpbmVzIGEgcHVibGljIHZhcmlhYmxlIGFuZCBjYWxscyBpbml0IC0gY2hhbmdlIHRoaXMgY29uc3RydWN0b3IgdG8gc3VpdCB5b3VyIG5lZWRzLlxuICogbmIuIHRoZXJlJ3Mgbm8gcmVxdWlyZW1lbnQgdG8gY2FsbCBhbiBpbml0IGZ1bmN0aW9uXG4gKlxuICogQGNsYXNzIEJhY2tncm91bmRcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBCYWNrZ3JvdW5kKCkge1xuXHR0aGlzLnNwcml0ZSA9IGdhbWUubWFrZS50aWxlU3ByaXRlKDAsIDAsIDkyOCwgNjAwLCAnc3RhcnMnKTtcblx0dGhpcy5pbml0KCk7XG59XG5cbnZhciBwID0gQmFja2dyb3VuZC5wcm90b3R5cGU7XG5cbi8qKlxuICogQmFja2dyb3VuZCBpbml0aWFsaXNhdGlvblxuICpcbiAqIEBtZXRob2QgaW5pdFxuICovXG5wLmluaXQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5zdGFycyA9IHRoaXMuc3ByaXRlO1xuXG5cdGlmIChwcm9wZXJ0aWVzLmRyYXdNb3VudGFpbnMpIHtcblx0XHR0aGlzLm1vdW50YWlucyA9IGdhbWUuYWRkLnNwcml0ZSgwLCA3MDApO1xuXHRcdGdyYXBoaWNzID0gbmV3IFBoYXNlci5HcmFwaGljcyhnYW1lLCAwLDApO1xuXHRcdGdyYXBoaWNzLmxpbmVTdHlsZSgyLCAweGZmZmZmZiwgMC43KTtcblx0XHR2YXIgZ3JvdW5kV2lkdGggPSAyMDAwO1xuXHRcdHZhciBwZWFrVyA9IDIwMDtcblx0XHR2YXIgcGVha0ggPSAxMDA7XG5cdFx0dmFyIHVwID0gdHJ1ZTtcblx0XHR2YXIgaTtcblx0XHRmb3IgKGkgPSAwOyBpIDwgZ3JvdW5kV2lkdGg7IGkrKykge1xuXHRcdFx0aWYgKGkgJSBwZWFrVyA9PT0gMCkge1xuXHRcdFx0XHRncmFwaGljcy5saW5lVG8oIHBlYWtXICsgaSwgdXA/IC1NYXRoLnJhbmRvbSgpICogcGVha0ggOiAwICk7XG5cdFx0XHRcdHVwID0gIXVwO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLm1vdW50YWlucy5hZGRDaGlsZChncmFwaGljcyk7XG5cdH1cblxuXG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2dyb3VuZDsiLCJ2YXIgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL3Byb3BlcnRpZXMnKTtcbnZhciBnYW1lID0gd2luZG93LmdhbWU7XG5cbi8qKlxuICogQSBwcml2YXRlIHZhciBkZXNjcmlwdGlvblxuICpcbiAqIEBwcm9wZXJ0eSBteVByaXZhdGVWYXJcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKiBAcHJpdmF0ZVxuICovXG52YXIgbXlQcml2YXRlVmFyID0gMDtcblxuLyoqXG4gKiBNYXAgZGVzY3JpcHRpb25cbiAqXG4gKiBkZWZpbmVzIGEgcHVibGljIHZhcmlhYmxlIGFuZCBjYWxscyBpbml0IC0gY2hhbmdlIHRoaXMgY29uc3RydWN0b3IgdG8gc3VpdCB5b3VyIG5lZWRzLlxuICogbmIuIHRoZXJlJ3Mgbm8gcmVxdWlyZW1lbnQgdG8gY2FsbCBhbiBpbml0IGZ1bmN0aW9uXG4gKlxuICogQGNsYXNzIE1hcFxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIE1hcChjb2xsaXNpb25zKSB7XG5cdHRoaXMuY29sbGlzaW9ucyA9IGNvbGxpc2lvbnM7XG5cblx0dGhpcy5zcHJpdGUgPSBnYW1lLmFkZC5zcHJpdGUoMCwwLCAndGhydXN0bWFwJyk7XG5cblx0dGhpcy5pbml0KCk7XG59XG5cbnZhciBwID0gTWFwLnByb3RvdHlwZTtcblxuLyoqXG4gKiBNYXAgaW5pdGlhbGlzYXRpb25cbiAqXG4gKiBAbWV0aG9kIGluaXRcbiAqL1xucC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuc3ByaXRlLnBvc2l0aW9uLnNldFRvKHRoaXMuc3ByaXRlLndpZHRoLzIsIDk3MCk7XG5cblx0Z2FtZS5waHlzaWNzLnAyLmVuYWJsZSh0aGlzLnNwcml0ZSwgcHJvcGVydGllcy5kZWJ1Z1BoeXNpY3MpO1xuXG5cdHRoaXMuYm9keSA9IHRoaXMuc3ByaXRlLmJvZHk7XG5cblx0dGhpcy5ib2R5LnN0YXRpYyA9IHRydWU7XG5cblx0dGhpcy5ib2R5LmNsZWFyU2hhcGVzKCk7XG5cdHRoaXMuYm9keS5sb2FkUG9seWdvbigncGh5c2ljc0RhdGEnLCAndGhydXN0bWFwJyk7XG5cblx0dGhpcy5ib2R5LnNldENvbGxpc2lvbkdyb3VwKHRoaXMuY29sbGlzaW9ucy50ZXJyYWluKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBNYXA7XG4iLCJ2YXIgZ2FtZSA9IHdpbmRvdy5nYW1lO1xudmFyIHByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9wcm9wZXJ0aWVzJyk7XG4vKipcbiAqIEEgcHJpdmF0ZSB2YXIgZGVzY3JpcHRpb25cbiAqXG4gKiBAcHJvcGVydHkgbXlQcml2YXRlVmFyXG4gKiBAdHlwZSB7bnVtYmVyfVxuICogQHByaXZhdGVcbiAqL1xudmFyIG15UHJpdmF0ZVZhciA9IDA7XG5cbi8qKlxuICogT3JiIGRlc2NyaXB0aW9uXG4gKiBjYWxscyBpbml0XG4gKlxuICogQGNsYXNzIE9yYlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIE9yYiAoY29sbGlzaW9ucykge1xuXHQvKipcblx0ICogQSBjb2xsaXNpb25zIGNvbnRhaW5lclxuXHQgKlxuXHQgKiBAcHJvcGVydHkgY29sbGlzaW9uc1xuXHQgKiBAdHlwZSB7Q29sbGlzaW9uc31cblx0ICovXG5cdHRoaXMuY29sbGlzaW9ucyA9IGNvbGxpc2lvbnM7XG5cblx0dmFyIGJtZCA9IGdhbWUubWFrZS5iaXRtYXBEYXRhKDIyLDIyKTtcblx0Ym1kLmN0eC5zdHJva2VTdHlsZSA9ICcjOTk5OTk5Jztcblx0Ym1kLmN0eC5saW5lV2lkdGggPSAyO1xuXHRibWQuY3R4LmJlZ2luUGF0aCgpO1xuXHRibWQuY3R4LmFyYygxMSwgMTEsIDEwLCAwLCBNYXRoLlBJKjIsIHRydWUpO1xuXHRibWQuY3R4LmNsb3NlUGF0aCgpO1xuXHRibWQuY3R4LnN0cm9rZSgpO1xuXHQvKipcblx0ICogQHByb3BlcnR5IHNwcml0ZVxuXHQgKi9cblx0dGhpcy5zcHJpdGUgPSBnYW1lLm1ha2Uuc3ByaXRlKDU1MCwgMTIwMCwgYm1kKTtcblx0dGhpcy5zcHJpdGUuYW5jaG9yLnNldFRvKDAuNSwwLjUpO1xuXG5cdHRoaXMuaW5pdCgpO1xufVxuXG52YXIgcCA9IE9yYi5wcm90b3R5cGU7XG5cbi8qKlxuICogT3JiIGluaXRpYWxpc2F0aW9uXG4gKlxuICogQG1ldGhvZCBpbml0XG4gKi9cbnAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXG5cdGdhbWUucGh5c2ljcy5wMi5lbmFibGUodGhpcy5zcHJpdGUsIHByb3BlcnRpZXMuZGVidWdQaHlzaWNzKTtcblxuXHQvL21vdGlvblN0YXRlID0gMTsgLy9mb3IgZHluYW1pY1xuXHQvL21vdGlvblN0YXRlID0gMjsgLy9mb3Igc3RhdGljXG5cdC8vbW90aW9uU3RhdGUgPSA0OyAvL2ZvciBraW5lbWF0aWNcblxuXHR0aGlzLmJvZHkgPSB0aGlzLnNwcml0ZS5ib2R5O1xuXG5cdHRoaXMuYm9keS5tb3Rpb25TdGF0ZSA9IDI7XG5cblx0dGhpcy5ib2R5LnNldENvbGxpc2lvbkdyb3VwKHRoaXMuY29sbGlzaW9ucy50ZXJyYWluKTtcblxuXHR0aGlzLmJvZHkuY29sbGlkZVdvcmxkQm91bmRzID0gcHJvcGVydGllcy5jb2xsaWRlV29ybGRCb3VuZHM7XG5cblx0Ly90aGlzLmJvZHkuY29sbGlkZXModGhpcy5jb2xsaXNpb25zLmJ1bGxldHMsIHRoaXMubW92ZSwgdGhpcylcbn07XG5cbnAubW92ZSA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmJvZHkubW90aW9uU3RhdGUgPSAxO1xuXHR0aGlzLmJvZHkubWFzcyA9IDE7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gT3JiO1xuIiwidmFyIGdhbWUgPSB3aW5kb3cuZ2FtZTtcbnZhciBwcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vcHJvcGVydGllcycpO1xudmFyIFR1cnJldCA9IHJlcXVpcmUoJy4vVHVycmV0Jyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi9lbnZpcm9ubWVudC91dGlscycpXG5cblxuLyoqXG4gKiBQbGF5ZXIgZGVzY3JpcHRpb25cbiAqIGNhbGxzIGluaXRcbiAqXG4gKiBAcGFyYW0gY29sbGlzaW9ucyB7Q29sbGlzaW9uc30gT3VyIGNvbGxpc2lvbnMgY29udGFpbmVyIG9mIGNvbGxpc2lvbkdyb3Vwc1xuICogQHBhcmFtIGdyb3VwcyB7R3JvdXBzfVxuICogQGNsYXNzIFBsYXllclxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFBsYXllcihjb2xsaXNpb25zLCBncm91cHMpIHtcblx0LyoqXG5cdCAqIFRoZSBDb2xsaXNpb25zIE9iamVjdFxuXHQgKlxuXHQgKiBAcHJvcGVydHkgY29sbGlzaW9uc1xuXHQgKiBAdHlwZSB7Q29sbGlzaW9uc31cblx0ICovXG5cdHRoaXMuY29sbGlzaW9ucyA9IGNvbGxpc2lvbnM7XG5cblx0dGhpcy5ncm91cHMgPSBncm91cHM7XG5cblx0dGhpcy50cmFjdG9yQmVhbSA9IG51bGw7XG5cdC8qKlxuXHQgKiBDcmVhdGVzIHRoZSBwbGF5ZXIgc3ByaXRlIHdoaWNoIGlzIHJldHVybmVkIGZvciBlYXN5IHJlZmVyZW5jZSBieSB0aGUgY29udGFpbmluZyBzdGF0ZVxuXHQgKlxuXHQgKiBAcHJvcGVydHkgc3ByaXRlXG5cdCAqIEB0eXBlIHtQaGFzZXIuU3ByaXRlfVxuXHQgKi9cblx0dGhpcy5zcHJpdGUgPSBnYW1lLm1ha2Uuc3ByaXRlKGdhbWUud29ybGQuY2VudGVyWCwgMzAwKTtcblxuXHR0aGlzLmluaXQoKTtcbn1cblxudmFyIHAgPSBQbGF5ZXIucHJvdG90eXBlO1xuXG4vKipcbiAqIFBsYXllciBpbml0aWFsaXNhdGlvblxuICpcbiAqIEBtZXRob2QgaW5pdFxuICovXG5wLmluaXQgPSBmdW5jdGlvbigpIHtcblxuXHRnYW1lLnBoeXNpY3MucDIuZW5hYmxlKHRoaXMuc3ByaXRlLCBwcm9wZXJ0aWVzLmRlYnVnUGh5c2ljcyk7XG5cblx0dGhpcy5ib2R5ID0gdGhpcy5zcHJpdGUuYm9keTtcblxuXHR2YXIgZ3JhcGhpY3MgPSBuZXcgUGhhc2VyLkdyYXBoaWNzKGdhbWUsIDAsMCk7XG5cdC8vZ3JhcGhpY3MuYmVnaW5GaWxsKDB4MDAwMDAwKTtcblx0Z3JhcGhpY3MubGluZVN0eWxlKDQsMHhmZmZmZmYpO1xuXHRncmFwaGljcy5saW5lVG8oMjAsNDApO1xuXHRncmFwaGljcy5saW5lVG8oMjUsNDApO1xuXHRncmFwaGljcy5hcmMoMCw0MCwyNSxnYW1lLm1hdGguZGVnVG9SYWQoMCksIGdhbWUubWF0aC5kZWdUb1JhZCgxODApLCBmYWxzZSk7XG5cdGdyYXBoaWNzLmxpbmVUbygtMjAsNDApO1xuXHRncmFwaGljcy5saW5lVG8oMCwwKTtcblx0Ly9ncmFwaGljcy5lbmRGaWxsKCk7XG5cdHRoaXMuc3ByaXRlLmFkZENoaWxkKGdyYXBoaWNzKTtcblxuXHR0aGlzLnNwcml0ZS5zY2FsZS5zZXRUbygwLjMsMC4zKTtcblx0dGhpcy5zcHJpdGUucGl2b3QueCA9IDA7XG5cdHRoaXMuc3ByaXRlLnBpdm90LnkgPSA0MDtcblxuXHR0aGlzLmJvZHkuY2xlYXJTaGFwZXMoKTtcblx0dGhpcy5ib2R5LmFkZFJlY3RhbmdsZSgtMTAsLTE3LCAwLC0yKTtcblx0dGhpcy5ib2R5LmNvbGxpZGVXb3JsZEJvdW5kcyA9IHByb3BlcnRpZXMuY29sbGlkZVdvcmxkQm91bmRzO1xuXHR0aGlzLmJvZHkubWFzcyA9IDE7XG5cdHRoaXMuYm9keS5zZXRDb2xsaXNpb25Hcm91cCh0aGlzLmNvbGxpc2lvbnMucGxheWVycyk7XG5cblx0dGhpcy50dXJyZXQgPSBuZXcgVHVycmV0KHRoaXMuZ3JvdXBzLCB0aGlzLCBcIkZPUldBUkRTXCIpO1xuXG5cdHRoaXMuYm9keS5jb2xsaWRlcyh0aGlzLmNvbGxpc2lvbnMudGVycmFpbiwgdGhpcy5jcmFzaCwgdGhpcyk7XG59O1xuXG5wLmNoZWNrT3JiRGlzdGFuY2UgPSBmdW5jdGlvbigpIHtcblx0dmFyIGRpc3RhbmNlID0gdXRpbHMuZGlzdEF0b0IodGhpcy5zcHJpdGUucG9zaXRpb24sIHRoaXMudHJhY3RvckJlYW0ub3JiLnNwcml0ZS5wb3NpdGlvbik7XG5cdGlmIChkaXN0YW5jZSA8IHRoaXMudHJhY3RvckJlYW0ubGVuZ3RoKSB7XG5cdFx0dGhpcy50cmFjdG9yQmVhbS5kcmF3QmVhbSh0aGlzLnNwcml0ZS5wb3NpdGlvbik7XG5cblx0fSBlbHNlIGlmIChkaXN0YW5jZSA+PSB0aGlzLnRyYWN0b3JCZWFtLmxlbmd0aCAmJiBkaXN0YW5jZSA8IDkwKSB7XG5cdFx0Ly9jb25zb2xlLmxvZygnaXNMb2NrZWQ6ICcsIHRoaXMudHJhY3RvckJlYW0uaXNMb2NrZWQsICdoYXNHcmFiYmVkOicsIHRoaXMudHJhY3RvckJlYW0uaGFzR3JhYmJlZCk7XG5cdFx0aWYgKHRoaXMudHJhY3RvckJlYW0uaXNMb2NrZWQgJiYgIXRoaXMudHJhY3RvckJlYW0uaGFzR3JhYmJlZCkge1xuXHRcdFx0dGhpcy50cmFjdG9yQmVhbS5ncmFiKHRoaXMpO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRpZiAodGhpcy50cmFjdG9yQmVhbS5pc0xvY2tpbmcpIHtcblx0XHRcdC8vY29uc29sZS5sb2coJ3JlbGVhc2luZy4uLicpO1xuXHRcdFx0dGhpcy50cmFjdG9yQmVhbS5sb2NraW5nUmVsZWFzZSgpO1xuXHRcdH1cblx0fVxufTtcbnAuc2hvb3QgPSBmdW5jdGlvbigpIHtcblx0dGhpcy50dXJyZXQuc2hvb3QoKTtcbn0sXG5cbnAuY3Jhc2ggPSBmdW5jdGlvbigpIHtcblx0aWYgKCFwcm9wZXJ0aWVzLmZhdGFsQ29sbGlzaW9ucykge1xuXHRcdHJldHVybjtcblx0fVxuXHRjb25zb2xlLmxvZygnQ1JBU0hFRCcpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjtcbiIsInZhciBwcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vcHJvcGVydGllcycpO1xudmFyIGdhbWUgPSB3aW5kb3cuZ2FtZTtcbnZhciBncmFwaGljcztcbnZhciB0aW1lcjtcbnZhciBsb2NraW5nRHVyYXRpb24gPSBwcm9wZXJ0aWVzLmdhbWVQbGF5LmxvY2tpbmdEdXJhdGlvbjtcblxuLyoqXG4gKiBUcmFjdG9yQmVhbSBkZXNjcmlwdGlvblxuICpcbiAqIGRlZmluZXMgYSBwdWJsaWMgdmFyaWFibGUgYW5kIGNhbGxzIGluaXQgLSBjaGFuZ2UgdGhpcyBjb25zdHJ1Y3RvciB0byBzdWl0IHlvdXIgbmVlZHMuXG4gKiBuYi4gdGhlcmUncyBubyByZXF1aXJlbWVudCB0byBjYWxsIGFuIGluaXQgZnVuY3Rpb25cbiAqXG4gKiBAY2xhc3MgVHJhY3RvckJlYW1cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBUcmFjdG9yQmVhbShvcmIpIHtcblx0dGhpcy5vcmIgPSBvcmI7XG5cblx0dGhpcy5pc0xvY2tlZCA9IGZhbHNlO1xuXG5cdHRoaXMuaXNMb2NraW5nID0gZmFsc2U7XG5cblx0dGhpcy5oYXNHcmFiYmVkID0gZmFsc2U7XG5cblx0dGhpcy5sZW5ndGggPSBwcm9wZXJ0aWVzLmdhbWVQbGF5LnRyYWN0b3JCZWFtTGVuZ3RoO1xuXG5cdHRoaXMudmFyaWFuY2UgPSBwcm9wZXJ0aWVzLmdhbWVQbGF5LnRyYWN0b3JCZWFtVmFyaWF0aW9uO1xuXHR0aGlzLmluaXQoKTtcbn1cblxudmFyIHAgPSBUcmFjdG9yQmVhbS5wcm90b3R5cGU7XG5cbi8qKlxuICogVHJhY3RvckJlYW0gaW5pdGlhbGlzYXRpb25cbiAqXG4gKiBAbWV0aG9kIGluaXRcbiAqL1xucC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdGdyYXBoaWNzID0gbmV3IFBoYXNlci5HcmFwaGljcyhnYW1lLCAwLDApO1xuXHR0aGlzLnNwcml0ZSA9IGdhbWUuYWRkLnNwcml0ZSgwLDApO1xuXHR0aGlzLnNwcml0ZS5hZGRDaGlsZChncmFwaGljcyk7XG5cdHRpbWVyID0gZ2FtZS50aW1lLmNyZWF0ZShmYWxzZSk7XG59O1xuXG5wLmRyYXdCZWFtID0gZnVuY3Rpb24ocG9zQSkge1xuXHRpZiAoIXRoaXMuaXNMb2NraW5nKSB7XG5cdFx0dGhpcy5pc0xvY2tpbmcgPSB0cnVlO1xuXHRcdHRpbWVyLnN0YXJ0KCk7XG5cdFx0dGltZXIuYWRkKGxvY2tpbmdEdXJhdGlvbiwgdGhpcy5sb2NrLCB0aGlzKTtcblx0fVxuXHQvL2NvbnNvbGUubG9nKCdkcmF3QmVhbScsIHRoaXMuaGFzR3JhYmJlZCwgcG9zQSk7XG5cdGdyYXBoaWNzLmNsZWFyKCk7XG5cdHZhciBjb2xvdXIgPSB0aGlzLmhhc0dyYWJiZWQ/IDB4MDBmZjAwIDogMHhFRjU2OTY7XG5cdHZhciBhbHBoYSA9IHRoaXMuaGFzR3JhYmJlZD8gMC41IDogMC40O1xuXHRncmFwaGljcy5saW5lU3R5bGUoNSwgY29sb3VyLCBhbHBoYSk7XG5cdGdyYXBoaWNzLm1vdmVUbyhwb3NBLngsIHBvc0EueSk7XG5cdGdyYXBoaWNzLmxpbmVUbyh0aGlzLm9yYi5zcHJpdGUucG9zaXRpb24ueCwgdGhpcy5vcmIuc3ByaXRlLnBvc2l0aW9uLnkpO1xufTtcblxucC5sb2NrID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuaXNMb2NrZWQgPSB0cnVlO1xufTtcblxucC5sb2NraW5nUmVsZWFzZSA9IGZ1bmN0aW9uKCkge1xuXHQvL3RoaXMubG9ja2VkID0gZmFsc2U7XG5cdHRoaXMuaXNMb2NraW5nID0gZmFsc2U7XG5cdHRoaXMuaGFzR3JhYmJlZCA9IGZhbHNlO1xuXHRncmFwaGljcy5jbGVhcigpO1xuXHQvL3RpbWVyLnJlc2V0KCk7XG5cblx0dGltZXIuc3RvcCh0cnVlKTtcbn07XG5cbnAuZ3JhYiA9IGZ1bmN0aW9uKHBsYXllcikge1xuXHQvL2NvbnNvbGUubG9nKCdncmFiYmVkJyk7XG5cdHRoaXMuaGFzR3JhYmJlZCA9IHRydWU7XG5cdHZhciBtYXhGb3JjZSA9IDIwMDAwMDtcblx0dmFyIGRpZmZYID0gcGxheWVyLnNwcml0ZS5wb3NpdGlvbi54IC0gdGhpcy5vcmIuc3ByaXRlLnBvc2l0aW9uLng7XG5cdHZhciBkaWZmWSA9IHBsYXllci5zcHJpdGUucG9zaXRpb24ueSAtIHRoaXMub3JiLnNwcml0ZS5wb3NpdGlvbi55O1xuXHRnYW1lLnBoeXNpY3MucDIuY3JlYXRlUmV2b2x1dGVDb25zdHJhaW50KHBsYXllci5zcHJpdGUsIFswLCAwXSwgdGhpcy5vcmIuc3ByaXRlLCBbZGlmZlgsZGlmZlldLCBtYXhGb3JjZSk7XG5cdHRoaXMub3JiLm1vdmUoKTtcbn07XG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gVHJhY3RvckJlYW07XG4iLCJ2YXIgZ2FtZSA9IHdpbmRvdy5nYW1lO1xuLyoqXG4gKiBBIHByaXZhdGUgdmFyIGRlc2NyaXB0aW9uXG4gKlxuICogQHByb3BlcnR5IG15UHJpdmF0ZVZhclxuICogQHR5cGUge251bWJlcn1cbiAqIEBwcml2YXRlXG4gKi9cbnZhciBteVByaXZhdGVWYXIgPSAwO1xuXG4vKipcbiAqIFR1cnJldCBkZXNjcmlwdGlvblxuICpcbiAqIGRlZmluZXMgYSBwdWJsaWMgdmFyaWFibGUgYW5kIGNhbGxzIGluaXQgLSBjaGFuZ2UgdGhpcyBjb25zdHJ1Y3RvciB0byBzdWl0IHlvdXIgbmVlZHMuXG4gKiBuYi4gdGhlcmUncyBubyByZXF1aXJlbWVudCB0byBjYWxsIGFuIGluaXQgZnVuY3Rpb25cbiAqXG4gKiBAY2xhc3MgVHVycmV0XG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gVHVycmV0KGdyb3Vwcywgb3JpZ2luLCB0eXBlKSB7XG5cdC8qKlxuXHQgKiBBIHB1YmxpYyB2YXIgZGVzY3JpcHRpb25cblx0ICpcblx0ICogQHByb3BlcnR5IG15UHVibGljVmFyXG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR0aGlzLmdyb3VwcyA9IGdyb3Vwcztcblx0dGhpcy5vcmlnaW4gPSBvcmlnaW47XG5cdHRoaXMudHlwZSA9IHR5cGU7XG5cblx0dGhpcy5pbml0KCk7XG59XG5cbnZhciBwID0gVHVycmV0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBUdXJyZXQgaW5pdGlhbGlzYXRpb25cbiAqXG4gKiBAbWV0aG9kIGluaXRcbiAqL1xucC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuYnVsbGV0Qml0bWFwID0gZ2FtZS5tYWtlLmJpdG1hcERhdGEoNSw1KTtcblx0dGhpcy5idWxsZXRCaXRtYXAuY3R4LmZpbGxTdHlsZSA9ICcjZmZmZmZmJztcblx0dGhpcy5idWxsZXRCaXRtYXAuY3R4LmJlZ2luUGF0aCgpO1xuXHR0aGlzLmJ1bGxldEJpdG1hcC5jdHguYXJjKDEuMCwxLjAsMiwgMCwgTWF0aC5QSSoyLCB0cnVlKTtcblx0dGhpcy5idWxsZXRCaXRtYXAuY3R4LmNsb3NlUGF0aCgpO1xuXHR0aGlzLmJ1bGxldEJpdG1hcC5jdHguZmlsbCgpO1xufTtcblxucC5zaG9vdCA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgbWFnbml0dWUgPSAyNDA7XG5cdHZhciBidWxsZXQgPSBnYW1lLm1ha2Uuc3ByaXRlKHRoaXMub3JpZ2luLnNwcml0ZS5wb3NpdGlvbi54LCB0aGlzLm9yaWdpbi5zcHJpdGUucG9zaXRpb24ueSwgdGhpcy5idWxsZXRCaXRtYXApO1xuXHRidWxsZXQuYW5jaG9yLnNldFRvKDAuNSwwLjUpO1xuXHRnYW1lLnBoeXNpY3MucDIuZW5hYmxlKGJ1bGxldCk7XG5cdHZhciBhbmdsZSA9IHRoaXMub3JpZ2luLmJvZHkucm90YXRpb24gKyAoMyAqIE1hdGguUEkpIC8gMjtcblx0YnVsbGV0LmJvZHkuY29sbGlkZXNXb3JsZEJvdW5kcyA9IGZhbHNlO1xuXHRidWxsZXQuYm9keS5zZXRDb2xsaXNpb25Hcm91cCh0aGlzLm9yaWdpbi5jb2xsaXNpb25zLmJ1bGxldHMpO1xuXHRidWxsZXQuYm9keS5jb2xsaWRlcyh0aGlzLm9yaWdpbi5jb2xsaXNpb25zLnRlcnJhaW4sIHRoaXMuZGVzdHJveUJ1bGxldCwgdGhpcyk7XG5cdGJ1bGxldC5ib2R5LmRhdGEuZ3Jhdml0eVNjYWxlID0gMDtcblx0YnVsbGV0LmJvZHkudmVsb2NpdHkueCA9IG1hZ25pdHVlICogTWF0aC5jb3MoYW5nbGUpICsgdGhpcy5vcmlnaW4uYm9keS52ZWxvY2l0eS54O1xuXHRidWxsZXQuYm9keS52ZWxvY2l0eS55ID0gbWFnbml0dWUgKiBNYXRoLnNpbihhbmdsZSkgKyB0aGlzLm9yaWdpbi5ib2R5LnZlbG9jaXR5Lnk7XG5cdHRoaXMuZ3JvdXBzLmJ1bGxldHMuYWRkKGJ1bGxldCk7XG59O1xuXG5wLmRldHJveUJ1bGxldCA9IGZ1bmN0aW9uKGJ1bGxldEJvZHkpIHtcblx0YnVsbGV0Qm9keS5zcHJpdGUua2lsbCgpO1xuXHR0aGlzLmdyb3Vwcy5idWxsZXRzLnJlbW92ZShidWxsZXRCb2R5LnNwcml0ZSk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gVHVycmV0O1xuIiwidmFyIGdhbWUgPSB3aW5kb3cuZ2FtZTtcbnZhciBwcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vcHJvcGVydGllcycpO1xuXG4vKipcbiAqIEEgcHJpdmF0ZSB2YXIgZGVzY3JpcHRpb25cbiAqXG4gKiBAcHJvcGVydHkgbXlQcml2YXRlVmFyXG4gKiBAdHlwZSB7bnVtYmVyfVxuICogQHByaXZhdGVcbiAqL1xudmFyIG15UHJpdmF0ZVZhciA9IDA7XG5cbi8qKlxuICogQ29sbGlzaW9ucyBkZXNjcmlwdGlvblxuICogY2FsbHMgaW5pdFxuICpcbiAqIEBjbGFzcyBDb2xsaXNpb25zXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gQ29sbGlzaW9ucyAoY29sbGlzaW9ucykge1xuXHQvKipcblx0ICogQSBwdWJsaWMgdmFyIGRlc2NyaXB0aW9uXG5cdCAqXG5cdCAqIEBwcm9wZXJ0eSBteVB1YmxpY1ZhclxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dGhpcy5teVB1YmxpY1ZhciA9IDE7XG5cdHRoaXMuaW5pdCgpO1xufVxuXG52YXIgcCA9IENvbGxpc2lvbnMucHJvdG90eXBlO1xuXG4vKipcbiAqIENvbGxpc2lvbnMgaW5pdGlhbGlzYXRpb25cbiAqXG4gKiBAbWV0aG9kIGluaXRcbiAqL1xucC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdGdhbWUucGh5c2ljcy5zdGFydFN5c3RlbShQaGFzZXIuUGh5c2ljcy5QMkpTKTtcblx0Z2FtZS5waHlzaWNzLnAyLnNldEltcGFjdEV2ZW50cyh0cnVlKTtcblx0Z2FtZS5waHlzaWNzLnAyLmdyYXZpdHkueSA9IDEwMDtcblxuXHR0aGlzLnBsYXllcnMgPSBnYW1lLnBoeXNpY3MucDIuY3JlYXRlQ29sbGlzaW9uR3JvdXAoKTtcblx0dGhpcy50ZXJyYWluID0gZ2FtZS5waHlzaWNzLnAyLmNyZWF0ZUNvbGxpc2lvbkdyb3VwKCk7XG5cdHRoaXMuYnVsbGV0cyA9IGdhbWUucGh5c2ljcy5wMi5jcmVhdGVDb2xsaXNpb25Hcm91cCgpO1xuXG5cdGdhbWUucGh5c2ljcy5wMi51cGRhdGVCb3VuZHNDb2xsaXNpb25Hcm91cCgpO1xufTtcblxuLyoqXG4qXG4qL1xucC5zZXQgPSBmdW5jdGlvbihzcHJpdGUsIGNvbGxpc2lvbkdyb3Vwcykge1xuXHRzcHJpdGUuYm9keS5jb2xsaWRlcyhjb2xsaXNpb25Hcm91cHMpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxpc2lvbnM7XG4iLCIvKipcbiAqIEEgcHJpdmF0ZSB2YXIgZGVzY3JpcHRpb25cbiAqXG4gKiBAcHJvcGVydHkgbXlQcml2YXRlVmFyXG4gKiBAdHlwZSB7bnVtYmVyfVxuICogQHByaXZhdGVcbiAqL1xudmFyIG15UHJpdmF0ZVZhciA9IDA7XG5cbi8qKlxuICogR3JvdXBzIGRlc2NyaXB0aW9uXG4gKiBjYWxscyBpbml0XG4gKlxuICogQGNsYXNzIEdyb3Vwc1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIEdyb3VwcyAoKSB7XG5cdC8qKlxuXHQgKiBBIHB1YmxpYyB2YXIgZGVzY3JpcHRpb25cblx0ICpcblx0ICogQHByb3BlcnR5IG15UHVibGljVmFyXG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR0aGlzLm15UHVibGljVmFyID0gMTtcblx0dGhpcy5pbml0KCk7XG59XG5cbnZhciBwID0gR3JvdXBzLnByb3RvdHlwZTtcblxuLyoqXG4gKiBHcm91cHMgaW5pdGlhbGlzYXRpb25cbiAqXG4gKiBAbWV0aG9kIGluaXRcbiAqL1xucC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuYWN0b3JzID0gZ2FtZS5hZGQuZ3JvdXAoKTtcblx0dGhpcy50ZXJyYWluID0gZ2FtZS5hZGQuZ3JvdXAoKTtcblx0dGhpcy5idWxsZXRzID0gZ2FtZS5hZGQuZ3JvdXAoKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBHcm91cHM7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRpc3RBdG9COiBmdW5jdGlvbihwb2ludEEsIHBvaW50Qikge1xuXG4gICAgdmFyIEEgPSBwb2ludEIueCAtIHBvaW50QS54O1xuICAgIHZhciBCID0gcG9pbnRCLnkgLSBwb2ludEEueTtcblxuICAgIHJldHVybiBNYXRoLnNxcnQoQSpBICsgQipCKTtcbiAgfVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZSg3MDAsNDAwLCBQaGFzZXIuQVVUTyk7XG53aW5kb3cuZ2FtZSA9IGdhbWU7XG5cbmdhbWUuc3RhdGUuYWRkKCdwbGF5JywgcmVxdWlyZSgnLi9zdGF0ZXMvcGxheScpKTtcbmdhbWUuc3RhdGUuYWRkKCdsb2FkJywgcmVxdWlyZSgnLi9zdGF0ZXMvbG9hZCcpKTtcbmdhbWUuc3RhdGUuYWRkKCdtZW51JywgcmVxdWlyZSgnLi9zdGF0ZXMvbWVudScpKTtcbmdhbWUuc3RhdGUuYWRkKCdib290JywgcmVxdWlyZSgnLi9zdGF0ZXMvYm9vdCcpKTtcblxuLy9nYW1lLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTEw7XG4vL2dhbWUuc2NhbGUuc2V0U2NyZWVuU2l6ZSgpO1xuXG5nYW1lLnN0YXRlLnN0YXJ0KCdib290Jyk7XG4iLCI7IHZhciBfX2Jyb3dzZXJpZnlfc2hpbV9yZXF1aXJlX189cmVxdWlyZTsoZnVuY3Rpb24gYnJvd3NlcmlmeVNoaW0obW9kdWxlLCBleHBvcnRzLCByZXF1aXJlLCBkZWZpbmUsIGJyb3dzZXJpZnlfc2hpbV9fZGVmaW5lX19tb2R1bGVfX2V4cG9ydF9fKSB7XG4vLyBzdGF0cy5qcyAtIGh0dHA6Ly9naXRodWIuY29tL21yZG9vYi9zdGF0cy5qc1xudmFyIFN0YXRzPWZ1bmN0aW9uKCl7dmFyIGw9RGF0ZS5ub3coKSxtPWwsZz0wLG49SW5maW5pdHksbz0wLGg9MCxwPUluZmluaXR5LHE9MCxyPTAscz0wLGY9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtmLmlkPVwic3RhdHNcIjtmLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIixmdW5jdGlvbihiKXtiLnByZXZlbnREZWZhdWx0KCk7dCgrK3MlMil9LCExKTtmLnN0eWxlLmNzc1RleHQ9XCJ3aWR0aDo4MHB4O29wYWNpdHk6MC45O2N1cnNvcjpwb2ludGVyXCI7dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTthLmlkPVwiZnBzXCI7YS5zdHlsZS5jc3NUZXh0PVwicGFkZGluZzowIDAgM3B4IDNweDt0ZXh0LWFsaWduOmxlZnQ7YmFja2dyb3VuZC1jb2xvcjojMDAyXCI7Zi5hcHBlbmRDaGlsZChhKTt2YXIgaT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2kuaWQ9XCJmcHNUZXh0XCI7aS5zdHlsZS5jc3NUZXh0PVwiY29sb3I6IzBmZjtmb250LWZhbWlseTpIZWx2ZXRpY2EsQXJpYWwsc2Fucy1zZXJpZjtmb250LXNpemU6OXB4O2ZvbnQtd2VpZ2h0OmJvbGQ7bGluZS1oZWlnaHQ6MTVweFwiO1xuaS5pbm5lckhUTUw9XCJGUFNcIjthLmFwcGVuZENoaWxkKGkpO3ZhciBjPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7Yy5pZD1cImZwc0dyYXBoXCI7Yy5zdHlsZS5jc3NUZXh0PVwicG9zaXRpb246cmVsYXRpdmU7d2lkdGg6NzRweDtoZWlnaHQ6MzBweDtiYWNrZ3JvdW5kLWNvbG9yOiMwZmZcIjtmb3IoYS5hcHBlbmRDaGlsZChjKTs3ND5jLmNoaWxkcmVuLmxlbmd0aDspe3ZhciBqPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO2ouc3R5bGUuY3NzVGV4dD1cIndpZHRoOjFweDtoZWlnaHQ6MzBweDtmbG9hdDpsZWZ0O2JhY2tncm91bmQtY29sb3I6IzExM1wiO2MuYXBwZW5kQ2hpbGQoail9dmFyIGQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtkLmlkPVwibXNcIjtkLnN0eWxlLmNzc1RleHQ9XCJwYWRkaW5nOjAgMCAzcHggM3B4O3RleHQtYWxpZ246bGVmdDtiYWNrZ3JvdW5kLWNvbG9yOiMwMjA7ZGlzcGxheTpub25lXCI7Zi5hcHBlbmRDaGlsZChkKTt2YXIgaz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuay5pZD1cIm1zVGV4dFwiO2suc3R5bGUuY3NzVGV4dD1cImNvbG9yOiMwZjA7Zm9udC1mYW1pbHk6SGVsdmV0aWNhLEFyaWFsLHNhbnMtc2VyaWY7Zm9udC1zaXplOjlweDtmb250LXdlaWdodDpib2xkO2xpbmUtaGVpZ2h0OjE1cHhcIjtrLmlubmVySFRNTD1cIk1TXCI7ZC5hcHBlbmRDaGlsZChrKTt2YXIgZT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2UuaWQ9XCJtc0dyYXBoXCI7ZS5zdHlsZS5jc3NUZXh0PVwicG9zaXRpb246cmVsYXRpdmU7d2lkdGg6NzRweDtoZWlnaHQ6MzBweDtiYWNrZ3JvdW5kLWNvbG9yOiMwZjBcIjtmb3IoZC5hcHBlbmRDaGlsZChlKTs3ND5lLmNoaWxkcmVuLmxlbmd0aDspaj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKSxqLnN0eWxlLmNzc1RleHQ9XCJ3aWR0aDoxcHg7aGVpZ2h0OjMwcHg7ZmxvYXQ6bGVmdDtiYWNrZ3JvdW5kLWNvbG9yOiMxMzFcIixlLmFwcGVuZENoaWxkKGopO3ZhciB0PWZ1bmN0aW9uKGIpe3M9Yjtzd2l0Y2gocyl7Y2FzZSAwOmEuc3R5bGUuZGlzcGxheT1cblwiYmxvY2tcIjtkLnN0eWxlLmRpc3BsYXk9XCJub25lXCI7YnJlYWs7Y2FzZSAxOmEuc3R5bGUuZGlzcGxheT1cIm5vbmVcIixkLnN0eWxlLmRpc3BsYXk9XCJibG9ja1wifX07cmV0dXJue1JFVklTSU9OOjEyLGRvbUVsZW1lbnQ6ZixzZXRNb2RlOnQsYmVnaW46ZnVuY3Rpb24oKXtsPURhdGUubm93KCl9LGVuZDpmdW5jdGlvbigpe3ZhciBiPURhdGUubm93KCk7Zz1iLWw7bj1NYXRoLm1pbihuLGcpO289TWF0aC5tYXgobyxnKTtrLnRleHRDb250ZW50PWcrXCIgTVMgKFwiK24rXCItXCIrbytcIilcIjt2YXIgYT1NYXRoLm1pbigzMCwzMC0zMCooZy8yMDApKTtlLmFwcGVuZENoaWxkKGUuZmlyc3RDaGlsZCkuc3R5bGUuaGVpZ2h0PWErXCJweFwiO3IrKztiPm0rMUUzJiYoaD1NYXRoLnJvdW5kKDFFMypyLyhiLW0pKSxwPU1hdGgubWluKHAsaCkscT1NYXRoLm1heChxLGgpLGkudGV4dENvbnRlbnQ9aCtcIiBGUFMgKFwiK3ArXCItXCIrcStcIilcIixhPU1hdGgubWluKDMwLDMwLTMwKihoLzEwMCkpLGMuYXBwZW5kQ2hpbGQoYy5maXJzdENoaWxkKS5zdHlsZS5oZWlnaHQ9XG5hK1wicHhcIixtPWIscj0wKTtyZXR1cm4gYn0sdXBkYXRlOmZ1bmN0aW9uKCl7bD10aGlzLmVuZCgpfX19O1wib2JqZWN0XCI9PT10eXBlb2YgbW9kdWxlJiYobW9kdWxlLmV4cG9ydHM9U3RhdHMpO1xuXG47IGJyb3dzZXJpZnlfc2hpbV9fZGVmaW5lX19tb2R1bGVfX2V4cG9ydF9fKHR5cGVvZiBTdGF0cyAhPSBcInVuZGVmaW5lZFwiID8gU3RhdHMgOiB3aW5kb3cuU3RhdHMpO1xuXG59KS5jYWxsKGdsb2JhbCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBmdW5jdGlvbiBkZWZpbmVFeHBvcnQoZXgpIHsgbW9kdWxlLmV4cG9ydHMgPSBleDsgfSk7XG4iLCIvKipcbiAqIERlZmluZXMgYnVpbGQgc2V0dGluZ3MgZm9yIHRoZSB0aHJ1c3QtZW5naW5lXG4gKlxuICogQG5hbWVzcGFjZSB0aHJ1c3QtZW5naW5lXG4gKiBAbW9kdWxlIHByb3BlcnRpZXNcbiAqIEBjbGFzc1xuICogQHN0YXRpY1xuICogQHR5cGUge3tlbmFibGVKb3lwYWQ6IGJvb2xlYW4sIGZhdGFsQ29sbGlzaW9uczogYm9vbGVhbiwgc2NhbGU6IHttb2RlOiBudW1iZXJ9LCBkcmF3U3RhdHM6IGJvb2xlYW59fVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0ZGVidWdQaHlzaWNzOiBmYWxzZSxcblx0Y29sbGlkZVdvcmxkQm91bmRzOiB0cnVlLFxuXHRlbmFibGVKb3lwYWQ6IGZhbHNlLFxuXHRmYXRhbENvbGxpc2lvbnM6IHRydWUsXG5cdHNjYWxlOiB7XG5cdFx0bW9kZTogUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTFxuXHR9LFxuXHRkcmF3U3RhdHM6IGZhbHNlLFxuXHRkcmF3TW9udGFpbnM6IGZhbHNlLFxuXHRnYW1lUGxheToge1xuXHRcdGZyZWVPcmJMb2NraW5nOiBmYWxzZSxcblx0XHRhdXRvT3JiTG9ja2luZzogdHJ1ZSxcblx0XHR0cmFjdG9yQmVhbUxlbmd0aDogODAsXG5cdFx0dHJhY3RvckJlYW1WYXJpYXRpb246IDEwLFxuXHRcdGxvY2tpbmdEdXJhdGlvbjogOTAwXG5cdH1cbn07XG4iLCJ2YXIgU3RhdHMgPSByZXF1aXJlKCdTdGF0cycpO1xudmFyIHByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9wcm9wZXJ0aWVzJyk7XG52YXIgZmVhdHVyZXMgPSByZXF1aXJlKCcuLi91dGlscy9mZWF0dXJlcycpO1xuXG4vKipcbiAqIFRoZSBib290IHN0YXRlXG4gKlxuICogQG5hbWVzcGFjZSBzdGF0ZXNcbiAqIEBtb2R1bGUgYm9vdFxuICogQHR5cGUge3tjcmVhdGU6IEZ1bmN0aW9uLCB1cGRhdGU6IEZ1bmN0aW9ufX1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHByZWxvYWQ6IGZ1bmN0aW9uKCkge1xuXHRcdC8vZ2FtZS5sb2FkLnNjcmlwdCgnam95c3RpY2snLCAnamF2YXNjcmlwdHMvYnJvd3NlcmlmeS9waGFzZXItdmlydHVhbC1qb3lzdGljay5taW4uanMnKTtcblx0XHRnYW1lLnNjYWxlLnNjYWxlTW9kZSA9IHByb3BlcnRpZXMuc2NhbGUubW9kZTtcblx0XHRnYW1lLnNjYWxlLnNldFNjcmVlblNpemUoKTtcblx0fSxcblxuXHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdGlmIChwcm9wZXJ0aWVzLmRyYXdTdGF0cykge1xuXHRcdFx0d2luZG93LnN0YXRzID0gbmV3IFN0YXRzKCk7XG5cdFx0XHRzdGF0cy5zZXRNb2RlKDApO1xuXHRcdFx0c3RhdHMuZG9tRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG5cdFx0XHRzdGF0cy5kb21FbGVtZW50LnN0eWxlLmxlZnQgPSAnMHB4Jztcblx0XHRcdHN0YXRzLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gJzBweCc7XG5cblx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIHN0YXRzLmRvbUVsZW1lbnQgKTtcblxuXHRcdFx0c2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRzdGF0cy5iZWdpbigpO1xuXHRcdFx0XHRzdGF0cy5lbmQoKTtcblx0XHRcdH0sIDEwMDAgLyA2MCk7XG5cdFx0fVxuXG5cdFx0ZmVhdHVyZXMuaW5pdCgpO1xuXG5cdFx0Y29uc29sZS53YXJuKFwiSW5zdHJ1Y3Rpb25zOiBVc2UgQ3Vyc29ycyB0byBtb3ZlIHNoaXAsIHNwYWNlIHRvIHNob290LCBjb2xsZWN0IG9yYiBieSBwYXNzaW5nIG5lYXJcIik7XG5cblx0XHRnYW1lLnN0YXRlLnN0YXJ0KCdwbGF5Jyk7XG5cblx0fSxcblx0dXBkYXRlOiBmdW5jdGlvbigpIHtcblxuXHR9XG59O1xuIiwiLyoqXG4gKiBUaGUgbG9hZCBzdGF0ZVxuICpcbiAqIEBuYW1lc3BhY2Ugc3RhdGVzXG4gKiBAbW9kdWxlIGxvYWRcbiAqIEB0eXBlIHt7Y3JlYXRlOiBGdW5jdGlvbiwgdXBkYXRlOiBGdW5jdGlvbn19XG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXG5cdH0sXG5cdHVwZGF0ZTogZnVuY3Rpb24oKSB7XG5cblx0fVxufTsiLCIvKipcbiAqIFRoZSBtZW51IHN0YXRlXG4gKlxuICogQG5hbWVzcGFjZSBzdGF0ZXNcbiAqIEBtb2R1bGUgbWVudVxuICogQHR5cGUge3tjcmVhdGU6IEZ1bmN0aW9uLCB1cGRhdGU6IEZ1bmN0aW9ufX1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cblx0fSxcblx0dXBkYXRlOiBmdW5jdGlvbigpIHtcblxuXHR9XG59OyIsIi8vaW1wb3J0c1xudmFyIHByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9wcm9wZXJ0aWVzJyk7XG52YXIgQ29sbGlzaW9ucyA9IHJlcXVpcmUoJy4uL2Vudmlyb25tZW50L0NvbGxpc2lvbnMnKTtcbnZhciBHcm91cHMgPSByZXF1aXJlKCcuLi9lbnZpcm9ubWVudC9Hcm91cHMnKTtcbnZhciBQbGF5ZXIgPSByZXF1aXJlKCcuLi9hY3RvcnMvUGxheWVyJyk7XG52YXIgT3JiID0gcmVxdWlyZSgnLi4vYWN0b3JzL09yYicpO1xudmFyIE1hcCA9IHJlcXVpcmUoJy4uL2FjdG9ycy9NYXAnKTtcbnZhciBCYWNrZ3JvdW5kID0gcmVxdWlyZSgnLi4vYWN0b3JzL0JhY2tncm91bmQnKTtcbnZhciBUcmFjdG9yQmVhbSA9IHJlcXVpcmUoJy4uL2FjdG9ycy9UcmFjdG9yQmVhbScpO1xudmFyIGZlYXR1cmVzID0gcmVxdWlyZSgnLi4vdXRpbHMvZmVhdHVyZXMnKTtcblxuLy9wcml2YXRlc1xudmFyIGdhbWUgPSB3aW5kb3cuZ2FtZTtcbnZhciBwbGF5ZXI7XG52YXIgb3JiO1xudmFyIHRyYWN0b3JCZWFtO1xudmFyIGN1cnNvcnM7XG52YXIgZ3JvdW5kO1xudmFyIGFjdG9ycztcbnZhciB0ZXJyYWluO1xudmFyIG1hcDtcbnZhciBiYWNrZ3JvdW5kO1xuXG4vL2NvbnRyb2xzO1xudmFyIHBhZDtcbnZhciBidXR0b25BO1xudmFyIGJ1dHRvbkI7XG52YXIgYnV0dG9uQURvd24gPSBmYWxzZTtcbnZhciBidXR0b25CRG93biA9IGZhbHNlO1xudmFyIGlzWERvd24gICAgID0gZmFsc2U7XG52YXIgam95cGFkID0gcHJvcGVydGllcy5lbmFibGVKb3lwYWQgfHwgZmVhdHVyZXMuaXNUb3VjaFNjcmVlbjtcblxuLy9tb2R1bGVzXG52YXIgY29sbGlzaW9ucztcbnZhciBncm91cHM7XG5cbi8qKlxuICogVGhlIHBsYXkgc3RhdGUgLSB0aGlzIGlzIHdoZXJlIHRoZSBtYWdpYyBoYXBwZW5zXG4gKlxuICogQG5hbWVzcGFjZSBzdGF0ZXNcbiAqIEBtb2R1bGUgcGxheVxuICogQHR5cGUge3tjcmVhdGU6IEZ1bmN0aW9uLCB1cGRhdGU6IEZ1bmN0aW9ufX1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cblx0cHJlbG9hZDogZnVuY3Rpb24oKSB7XG5cdFx0Z2FtZS5sb2FkLmltYWdlKCd0aHJ1c3RtYXAnLCAnaW1hZ2VzL3RocnVzdC1sZXZlbDIucG5nJyk7XG5cdFx0Z2FtZS5sb2FkLnBoeXNpY3MoJ3BoeXNpY3NEYXRhJywgJ2ltYWdlcy90aHJ1c3QtbGV2ZWwyLmpzb24nKTtcblx0XHRnYW1lLmxvYWQuaW1hZ2UoJ3N0YXJzJywgJ2ltYWdlcy9zdGFyZmllbGQucG5nJyk7XG5cdFx0aWYgKGpveXBhZCkge1xuXHRcdFx0Z2FtZS5sb2FkLmF0bGFzKCdkcGFkJywgJ2ltYWdlcy92aXJ0dWFsam95c3RpY2svc2tpbnMvZHBhZC5wbmcnLCAnaW1hZ2VzL3ZpcnR1YWxqb3lzdGljay9za2lucy9kcGFkLmpzb24nKTtcblx0XHR9XG5cdH0sXG5cblx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRnYW1lLndvcmxkLnNldEJvdW5kcygwLCAwLCA5MjgsIDEyODApO1xuXG5cdFx0Z3JvdXBzID0gbmV3IEdyb3VwcygpO1xuXHRcdGNvbGxpc2lvbnMgPSBuZXcgQ29sbGlzaW9ucygpO1xuXHRcdGJhY2tncm91bmQgPSBuZXcgQmFja2dyb3VuZCgpO1xuXHRcdHBsYXllciA9IG5ldyBQbGF5ZXIoY29sbGlzaW9ucywgZ3JvdXBzKTtcblx0XHRvcmIgPSBuZXcgT3JiKGNvbGxpc2lvbnMpO1xuXHRcdG1hcCA9IG5ldyBNYXAoY29sbGlzaW9ucyk7XG5cdFx0dHJhY3RvckJlYW0gPSBuZXcgVHJhY3RvckJlYW0ob3JiKTtcblx0XHRwbGF5ZXIudHJhY3RvckJlYW0gPSB0cmFjdG9yQmVhbTtcblxuXHRcdGNvbGxpc2lvbnMuc2V0KG9yYiwgW2NvbGxpc2lvbnMucGxheWVycywgY29sbGlzaW9ucy50ZXJyYWluLCBjb2xsaXNpb25zLmJ1bGxldHNdKTtcblx0XHRjb2xsaXNpb25zLnNldChtYXAsIFtjb2xsaXNpb25zLnBsYXllcnMsIGNvbGxpc2lvbnMudGVycmFpbiwgY29sbGlzaW9ucy5idWxsZXRzXSk7XG5cblx0XHRncm91cHMudGVycmFpbi5hZGQoYmFja2dyb3VuZC5zcHJpdGUpO1xuXHRcdGlmIChiYWNrZ3JvdW5kLm1vdW50YWlucykgZ3JvdXBzLnRlcnJhaW4uYWRkKGJhY2tncm91bmQubW91bnRhaW5zKTtcblx0XHRncm91cHMuYWN0b3JzLmFkZChwbGF5ZXIuc3ByaXRlKTtcblx0XHRncm91cHMuYWN0b3JzLmFkZChvcmIuc3ByaXRlKTtcblx0XHRnYW1lLndvcmxkLnN3YXAoZ3JvdXBzLnRlcnJhaW4sIGdyb3Vwcy5hY3RvcnMpO1xuXHRcdGdhbWUuY2FtZXJhLmZvbGxvdyhwbGF5ZXIuc3ByaXRlKTtcblxuXHRcdGlmIChqb3lwYWQpIHtcblx0XHRcdHBhZCA9IGdhbWUucGx1Z2lucy5hZGQoUGhhc2VyLlZpcnR1YWxKb3lzdGljayk7XG5cdFx0XHR0aGlzLnN0aWNrID0gcGFkLmFkZERQYWQoMCwgMCwgMjAwLCAnZHBhZCcpO1xuXHRcdFx0dGhpcy5zdGljay5hbGlnbkJvdHRvbUxlZnQoKTtcblxuXHRcdFx0YnV0dG9uQSA9IHBhZC5hZGRCdXR0b24oNTE1LCAzMzAsICdkcGFkJywgJ2J1dHRvbjEtdXAnLCAnYnV0dG9uMS1kb3duJyk7XG5cdFx0XHRidXR0b25BLm9uRG93bi5hZGQodGhpcy5wcmVzc0J1dHRvbkEsIHRoaXMpO1xuXHRcdFx0YnV0dG9uQS5vblVwLmFkZCh0aGlzLnVwQnV0dG9uQSwgdGhpcyk7XG5cblx0XHRcdGJ1dHRvbkIgPSBwYWQuYWRkQnV0dG9uKDYyMCwgMjkwLCAnZHBhZCcsICdidXR0b24yLXVwJywgJ2J1dHRvbjItZG93bicpO1xuXHRcdFx0YnV0dG9uQi5vbkRvd24uYWRkKHRoaXMucHJlc3NCdXR0b25CLCB0aGlzKTtcblx0XHRcdGJ1dHRvbkIub25VcC5hZGQodGhpcy51cEJ1dHRvbkIsIHRoaXMpO1xuXHRcdH1cblxuXHRcdGN1cnNvcnMgXHRcdFx0ID0gZ2FtZS5pbnB1dC5rZXlib2FyZC5jcmVhdGVDdXJzb3JLZXlzKCk7XG5cdFx0dmFyIHNwYWNlUHJlc3MgPSBnYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuU1BBQ0VCQVIpO1xuXHRcdHZhciB4S2V5XHQgICAgID0gZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLlgpO1xuXHRcdHNwYWNlUHJlc3Mub25Eb3duLmFkZChwbGF5ZXIuc2hvb3QsIHBsYXllcik7XG5cdFx0eEtleS5vbkRvd24uYWRkKHRoaXMueERvd24sIHRoaXMpO1xuXHRcdHhLZXkub25VcC5hZGQodGhpcy54VXAsIHRoaXMpO1xuXHR9LFxuXHR1cGRhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdGlmIChjdXJzb3JzLmxlZnQuaXNEb3duKSB7XG5cdFx0XHRwbGF5ZXIuYm9keS5yb3RhdGVMZWZ0KDEwMCk7XG5cdFx0fSBlbHNlIGlmIChjdXJzb3JzLnJpZ2h0LmlzRG93bikge1xuXHRcdFx0cGxheWVyLmJvZHkucm90YXRlUmlnaHQoMTAwKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cGxheWVyLmJvZHkuc2V0WmVyb1JvdGF0aW9uKCk7XG5cdFx0fVxuXHRcdGlmIChjdXJzb3JzLnVwLmlzRG93biB8fCBidXR0b25BRG93bil7XG5cdFx0XHRwbGF5ZXIuYm9keS50aHJ1c3QoNDAwKTtcblx0XHR9XG5cdFx0aWYgKCF0cmFjdG9yQmVhbS5oYXNHcmFiYmVkKSB7XG5cdFx0XHRpZiAoaXNYRG93biB8fCBwcm9wZXJ0aWVzLmdhbWVQbGF5LmF1dG9PcmJMb2NraW5nKSB7XG5cdFx0XHRcdHBsYXllci5jaGVja09yYkRpc3RhbmNlKCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRyYWN0b3JCZWFtLmRyYXdCZWFtKHBsYXllci5zcHJpdGUucG9zaXRpb24pO1xuXHRcdH1cblx0XHRpZiAoam95cGFkKSB7XG5cdFx0XHRpZiAodGhpcy5zdGljay5pc0Rvd24pIHtcblx0XHRcdFx0aWYgKHRoaXMuc3RpY2suZGlyZWN0aW9uID09PSBQaGFzZXIuTEVGVCkge1xuXHRcdFx0XHRcdHBsYXllci5ib2R5LnJvdGF0ZUxlZnQoMTAwKTtcblx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLnN0aWNrLmRpcmVjdGlvbiA9PT0gUGhhc2VyLlJJR0hUKSB7XG5cdFx0XHRcdFx0cGxheWVyLmJvZHkucm90YXRlUmlnaHQoMTAwKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHQvL2dhbWUud29ybGQud3JhcChwbGF5ZXIuYm9keSwgMCwgZmFsc2UpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0Z2FtZS5kZWJ1Zy5jYW1lcmFJbmZvKGdhbWUuY2FtZXJhLCA1MDAsIDIwKTtcblx0fSxcblxuXHRwcmVzc0J1dHRvbkE6IGZ1bmN0aW9uKCkge1xuXHRcdGJ1dHRvbkFEb3duID0gdHJ1ZTtcblx0fSxcblxuXHR1cEJ1dHRvbkE6IGZ1bmN0aW9uKCkge1xuXHRcdGJ1dHRvbkFEb3duID0gZmFsc2U7XG5cdH0sXG5cblx0cHJlc3NCdXR0b25COiBmdW5jdGlvbigpIHtcblx0XHRidXR0b25CRG93biA9IHRydWU7XG5cdFx0cGxheWVyLnNob290KCk7XG5cdH0sXG5cblx0dXBCdXR0b25COiBmdW5jdGlvbigpIHtcblx0XHRidXR0b25CRG93biA9IGZhbHNlO1xuXHR9LFxuXG5cdHhEb3duOiBmdW5jdGlvbiAoKSB7XG5cdFx0aXNYRG93biA9IHRydWU7XG5cdH0sXG5cblx0eFVwOiBmdW5jdGlvbigpIHtcblx0XHRpc1hEb3duID0gZmFsc2U7XG5cdFx0aWYgKCFwcm9wZXJ0aWVzLmdhbWVQbGF5LmF1dG9PcmJMb2NraW5nKSB7XG5cdFx0XHR0aGlzLnJlbGVhc2VUcmFjdG9yQmVhbSgpO1xuXHRcdH1cblx0fVxufTtcbiIsIi8qXG5mdW5jdGlvbiBpc1RvdWNoRGV2aWNlKCl7XG4gICAgcmV0dXJuIHRydWUgPT0gKFwib250b3VjaHN0YXJ0XCIgaW4gd2luZG93IHx8IHdpbmRvdy5Eb2N1bWVudFRvdWNoICYmIGRvY3VtZW50IGluc3RhbmNlb2YgRG9jdW1lbnRUb3VjaCk7XG59XG5Ob3cgY2hlY2tpbmcgaWYg4oCYaXNUb3VjaERldmljZSgpO+KAmSBpcyByZXR1cm5zIHRydWUgaXQgbWVhbnMgaXRzIGEgdG91Y2ggZGV2aWNlLlxuXG5pZihpc1RvdWNoRGV2aWNlKCk9PT10cnVlKSB7XG4gICAgYWxlcnQoJ1RvdWNoIERldmljZScpOyAvL3lvdXIgbG9naWMgZm9yIHRvdWNoIGRldmljZVxufVxuZWxzZSB7XG4gICAgYWxlcnQoJ05vdCBhIFRvdWNoIERldmljZScpOyAvL3lvdXIgbG9naWMgZm9yIG5vbiB0b3VjaCBkZXZpY2Vcbn1cbiovXG5cbnZhciBpc1RvdWNoU2NyZWVuO1xuXG5mdW5jdGlvbiBpbml0ICgpIHtcbiAgaXNUb3VjaFNjcmVlbiA9ICgoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KVxuICAgICAgfHwgKG5hdmlnYXRvci5NYXhUb3VjaFBvaW50cyA+IDApXG4gICAgICB8fCAobmF2aWdhdG9yLm1zTWF4VG91Y2hQb2ludHMgPiAwKSk7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGluaXQ6IGluaXQsXG4gIGlzVG91Y2hTY3JlZW46IGlzVG91Y2hTY3JlZW5cbn1cbiJdfQ==
