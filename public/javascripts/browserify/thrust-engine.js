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

var properties = require('./properties');

var game = new Phaser.Game(properties.width,properties.height, Phaser.AUTO);
window.game = game;

game.state.add('play', require('./states/play'));
game.state.add('load', require('./states/load'));
game.state.add('menu', require('./states/menu'));
game.state.add('boot', require('./states/boot'));

//game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
//game.scale.setScreenSize();

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
		mode: Phaser.ScaleManager.SHOW_ALL
	},
	drawStats: false,
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
		console.warn("TouchScreenDetected:", features.isTouchScreen);

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYWN0b3JzL0JhY2tncm91bmQuanMiLCJzcmMvYWN0b3JzL01hcC5qcyIsInNyYy9hY3RvcnMvT3JiLmpzIiwic3JjL2FjdG9ycy9QbGF5ZXIuanMiLCJzcmMvYWN0b3JzL1RyYWN0b3JCZWFtLmpzIiwic3JjL2FjdG9ycy9UdXJyZXQuanMiLCJzcmMvZW52aXJvbm1lbnQvQ29sbGlzaW9ucy5qcyIsInNyYy9lbnZpcm9ubWVudC9Hcm91cHMuanMiLCJzcmMvZW52aXJvbm1lbnQvdXRpbHMuanMiLCJzcmMvZ2FtZS5qcyIsInNyYy9saWJzL3N0YXRzLmpzL3N0YXRzLm1pbi5qcyIsInNyYy9wcm9wZXJ0aWVzLmpzIiwic3JjL3N0YXRlcy9ib290LmpzIiwic3JjL3N0YXRlcy9sb2FkLmpzIiwic3JjL3N0YXRlcy9tZW51LmpzIiwic3JjL3N0YXRlcy9wbGF5LmpzIiwic3JjL3V0aWxzL2ZlYXR1cmVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9wcm9wZXJ0aWVzJyk7XG5cbi8qKlxuICpcbiAqXG4gKiBAdHlwZSB7UGhhc2VyLkdyYXBoaWNzfVxuICovXG52YXIgZ3JhcGhpY3M7XG5cbi8qKlxuICogQmFja2dyb3VuZCBkZXNjcmlwdGlvblxuICpcbiAqIGRlZmluZXMgYSBwdWJsaWMgdmFyaWFibGUgYW5kIGNhbGxzIGluaXQgLSBjaGFuZ2UgdGhpcyBjb25zdHJ1Y3RvciB0byBzdWl0IHlvdXIgbmVlZHMuXG4gKiBuYi4gdGhlcmUncyBubyByZXF1aXJlbWVudCB0byBjYWxsIGFuIGluaXQgZnVuY3Rpb25cbiAqXG4gKiBAY2xhc3MgQmFja2dyb3VuZFxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIEJhY2tncm91bmQoKSB7XG5cdHRoaXMuc3ByaXRlID0gZ2FtZS5tYWtlLnRpbGVTcHJpdGUoMCwgMCwgOTI4LCA2MDAsICdzdGFycycpO1xuXHR0aGlzLmluaXQoKTtcbn1cblxudmFyIHAgPSBCYWNrZ3JvdW5kLnByb3RvdHlwZTtcblxuLyoqXG4gKiBCYWNrZ3JvdW5kIGluaXRpYWxpc2F0aW9uXG4gKlxuICogQG1ldGhvZCBpbml0XG4gKi9cbnAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnN0YXJzID0gdGhpcy5zcHJpdGU7XG5cblx0aWYgKHByb3BlcnRpZXMuZHJhd01vdW50YWlucykge1xuXHRcdHRoaXMubW91bnRhaW5zID0gZ2FtZS5hZGQuc3ByaXRlKDAsIDcwMCk7XG5cdFx0Z3JhcGhpY3MgPSBuZXcgUGhhc2VyLkdyYXBoaWNzKGdhbWUsIDAsMCk7XG5cdFx0Z3JhcGhpY3MubGluZVN0eWxlKDIsIDB4ZmZmZmZmLCAwLjcpO1xuXHRcdHZhciBncm91bmRXaWR0aCA9IDIwMDA7XG5cdFx0dmFyIHBlYWtXID0gMjAwO1xuXHRcdHZhciBwZWFrSCA9IDEwMDtcblx0XHR2YXIgdXAgPSB0cnVlO1xuXHRcdHZhciBpO1xuXHRcdGZvciAoaSA9IDA7IGkgPCBncm91bmRXaWR0aDsgaSsrKSB7XG5cdFx0XHRpZiAoaSAlIHBlYWtXID09PSAwKSB7XG5cdFx0XHRcdGdyYXBoaWNzLmxpbmVUbyggcGVha1cgKyBpLCB1cD8gLU1hdGgucmFuZG9tKCkgKiBwZWFrSCA6IDAgKTtcblx0XHRcdFx0dXAgPSAhdXA7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHRoaXMubW91bnRhaW5zLmFkZENoaWxkKGdyYXBoaWNzKTtcblx0fVxuXG5cbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrZ3JvdW5kOyIsInZhciBwcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vcHJvcGVydGllcycpO1xudmFyIGdhbWUgPSB3aW5kb3cuZ2FtZTtcblxuLyoqXG4gKiBBIHByaXZhdGUgdmFyIGRlc2NyaXB0aW9uXG4gKlxuICogQHByb3BlcnR5IG15UHJpdmF0ZVZhclxuICogQHR5cGUge251bWJlcn1cbiAqIEBwcml2YXRlXG4gKi9cbnZhciBteVByaXZhdGVWYXIgPSAwO1xuXG4vKipcbiAqIE1hcCBkZXNjcmlwdGlvblxuICpcbiAqIGRlZmluZXMgYSBwdWJsaWMgdmFyaWFibGUgYW5kIGNhbGxzIGluaXQgLSBjaGFuZ2UgdGhpcyBjb25zdHJ1Y3RvciB0byBzdWl0IHlvdXIgbmVlZHMuXG4gKiBuYi4gdGhlcmUncyBubyByZXF1aXJlbWVudCB0byBjYWxsIGFuIGluaXQgZnVuY3Rpb25cbiAqXG4gKiBAY2xhc3MgTWFwXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gTWFwKGNvbGxpc2lvbnMpIHtcblx0dGhpcy5jb2xsaXNpb25zID0gY29sbGlzaW9ucztcblxuXHR0aGlzLnNwcml0ZSA9IGdhbWUuYWRkLnNwcml0ZSgwLDAsICd0aHJ1c3RtYXAnKTtcblxuXHR0aGlzLmluaXQoKTtcbn1cblxudmFyIHAgPSBNYXAucHJvdG90eXBlO1xuXG4vKipcbiAqIE1hcCBpbml0aWFsaXNhdGlvblxuICpcbiAqIEBtZXRob2QgaW5pdFxuICovXG5wLmluaXQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5zcHJpdGUucG9zaXRpb24uc2V0VG8odGhpcy5zcHJpdGUud2lkdGgvMiwgOTcwKTtcblxuXHRnYW1lLnBoeXNpY3MucDIuZW5hYmxlKHRoaXMuc3ByaXRlLCBwcm9wZXJ0aWVzLmRlYnVnUGh5c2ljcyk7XG5cblx0dGhpcy5ib2R5ID0gdGhpcy5zcHJpdGUuYm9keTtcblxuXHR0aGlzLmJvZHkuc3RhdGljID0gdHJ1ZTtcblxuXHR0aGlzLmJvZHkuY2xlYXJTaGFwZXMoKTtcblx0dGhpcy5ib2R5LmxvYWRQb2x5Z29uKCdwaHlzaWNzRGF0YScsICd0aHJ1c3RtYXAnKTtcblxuXHR0aGlzLmJvZHkuc2V0Q29sbGlzaW9uR3JvdXAodGhpcy5jb2xsaXNpb25zLnRlcnJhaW4pO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcDtcbiIsInZhciBnYW1lID0gd2luZG93LmdhbWU7XG52YXIgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL3Byb3BlcnRpZXMnKTtcbi8qKlxuICogQSBwcml2YXRlIHZhciBkZXNjcmlwdGlvblxuICpcbiAqIEBwcm9wZXJ0eSBteVByaXZhdGVWYXJcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKiBAcHJpdmF0ZVxuICovXG52YXIgbXlQcml2YXRlVmFyID0gMDtcblxuLyoqXG4gKiBPcmIgZGVzY3JpcHRpb25cbiAqIGNhbGxzIGluaXRcbiAqXG4gKiBAY2xhc3MgT3JiXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gT3JiIChjb2xsaXNpb25zKSB7XG5cdC8qKlxuXHQgKiBBIGNvbGxpc2lvbnMgY29udGFpbmVyXG5cdCAqXG5cdCAqIEBwcm9wZXJ0eSBjb2xsaXNpb25zXG5cdCAqIEB0eXBlIHtDb2xsaXNpb25zfVxuXHQgKi9cblx0dGhpcy5jb2xsaXNpb25zID0gY29sbGlzaW9ucztcblxuXHR2YXIgYm1kID0gZ2FtZS5tYWtlLmJpdG1hcERhdGEoMjIsMjIpO1xuXHRibWQuY3R4LnN0cm9rZVN0eWxlID0gJyM5OTk5OTknO1xuXHRibWQuY3R4LmxpbmVXaWR0aCA9IDI7XG5cdGJtZC5jdHguYmVnaW5QYXRoKCk7XG5cdGJtZC5jdHguYXJjKDExLCAxMSwgMTAsIDAsIE1hdGguUEkqMiwgdHJ1ZSk7XG5cdGJtZC5jdHguY2xvc2VQYXRoKCk7XG5cdGJtZC5jdHguc3Ryb2tlKCk7XG5cdC8qKlxuXHQgKiBAcHJvcGVydHkgc3ByaXRlXG5cdCAqL1xuXHR0aGlzLnNwcml0ZSA9IGdhbWUubWFrZS5zcHJpdGUoNTUwLCAxMjAwLCBibWQpO1xuXHR0aGlzLnNwcml0ZS5hbmNob3Iuc2V0VG8oMC41LDAuNSk7XG5cblx0dGhpcy5pbml0KCk7XG59XG5cbnZhciBwID0gT3JiLnByb3RvdHlwZTtcblxuLyoqXG4gKiBPcmIgaW5pdGlhbGlzYXRpb25cbiAqXG4gKiBAbWV0aG9kIGluaXRcbiAqL1xucC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cblx0Z2FtZS5waHlzaWNzLnAyLmVuYWJsZSh0aGlzLnNwcml0ZSwgcHJvcGVydGllcy5kZWJ1Z1BoeXNpY3MpO1xuXG5cdC8vbW90aW9uU3RhdGUgPSAxOyAvL2ZvciBkeW5hbWljXG5cdC8vbW90aW9uU3RhdGUgPSAyOyAvL2ZvciBzdGF0aWNcblx0Ly9tb3Rpb25TdGF0ZSA9IDQ7IC8vZm9yIGtpbmVtYXRpY1xuXG5cdHRoaXMuYm9keSA9IHRoaXMuc3ByaXRlLmJvZHk7XG5cblx0dGhpcy5ib2R5Lm1vdGlvblN0YXRlID0gMjtcblxuXHR0aGlzLmJvZHkuc2V0Q29sbGlzaW9uR3JvdXAodGhpcy5jb2xsaXNpb25zLnRlcnJhaW4pO1xuXG5cdHRoaXMuYm9keS5jb2xsaWRlV29ybGRCb3VuZHMgPSBwcm9wZXJ0aWVzLmNvbGxpZGVXb3JsZEJvdW5kcztcblxuXHQvL3RoaXMuYm9keS5jb2xsaWRlcyh0aGlzLmNvbGxpc2lvbnMuYnVsbGV0cywgdGhpcy5tb3ZlLCB0aGlzKVxufTtcblxucC5tb3ZlID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuYm9keS5tb3Rpb25TdGF0ZSA9IDE7XG5cdHRoaXMuYm9keS5tYXNzID0gMTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBPcmI7XG4iLCJ2YXIgZ2FtZSA9IHdpbmRvdy5nYW1lO1xudmFyIHByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9wcm9wZXJ0aWVzJyk7XG52YXIgVHVycmV0ID0gcmVxdWlyZSgnLi9UdXJyZXQnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL2Vudmlyb25tZW50L3V0aWxzJylcblxuXG4vKipcbiAqIFBsYXllciBkZXNjcmlwdGlvblxuICogY2FsbHMgaW5pdFxuICpcbiAqIEBwYXJhbSBjb2xsaXNpb25zIHtDb2xsaXNpb25zfSBPdXIgY29sbGlzaW9ucyBjb250YWluZXIgb2YgY29sbGlzaW9uR3JvdXBzXG4gKiBAcGFyYW0gZ3JvdXBzIHtHcm91cHN9XG4gKiBAY2xhc3MgUGxheWVyXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gUGxheWVyKGNvbGxpc2lvbnMsIGdyb3Vwcykge1xuXHQvKipcblx0ICogVGhlIENvbGxpc2lvbnMgT2JqZWN0XG5cdCAqXG5cdCAqIEBwcm9wZXJ0eSBjb2xsaXNpb25zXG5cdCAqIEB0eXBlIHtDb2xsaXNpb25zfVxuXHQgKi9cblx0dGhpcy5jb2xsaXNpb25zID0gY29sbGlzaW9ucztcblxuXHR0aGlzLmdyb3VwcyA9IGdyb3VwcztcblxuXHR0aGlzLnRyYWN0b3JCZWFtID0gbnVsbDtcblx0LyoqXG5cdCAqIENyZWF0ZXMgdGhlIHBsYXllciBzcHJpdGUgd2hpY2ggaXMgcmV0dXJuZWQgZm9yIGVhc3kgcmVmZXJlbmNlIGJ5IHRoZSBjb250YWluaW5nIHN0YXRlXG5cdCAqXG5cdCAqIEBwcm9wZXJ0eSBzcHJpdGVcblx0ICogQHR5cGUge1BoYXNlci5TcHJpdGV9XG5cdCAqL1xuXHR0aGlzLnNwcml0ZSA9IGdhbWUubWFrZS5zcHJpdGUoZ2FtZS53b3JsZC5jZW50ZXJYLCAzMDApO1xuXG5cdHRoaXMuaW5pdCgpO1xufVxuXG52YXIgcCA9IFBsYXllci5wcm90b3R5cGU7XG5cbi8qKlxuICogUGxheWVyIGluaXRpYWxpc2F0aW9uXG4gKlxuICogQG1ldGhvZCBpbml0XG4gKi9cbnAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXG5cdGdhbWUucGh5c2ljcy5wMi5lbmFibGUodGhpcy5zcHJpdGUsIHByb3BlcnRpZXMuZGVidWdQaHlzaWNzKTtcblxuXHR0aGlzLmJvZHkgPSB0aGlzLnNwcml0ZS5ib2R5O1xuXG5cdHZhciBncmFwaGljcyA9IG5ldyBQaGFzZXIuR3JhcGhpY3MoZ2FtZSwgMCwwKTtcblx0Ly9ncmFwaGljcy5iZWdpbkZpbGwoMHgwMDAwMDApO1xuXHRncmFwaGljcy5saW5lU3R5bGUoNCwweGZmZmZmZik7XG5cdGdyYXBoaWNzLmxpbmVUbygyMCw0MCk7XG5cdGdyYXBoaWNzLmxpbmVUbygyNSw0MCk7XG5cdGdyYXBoaWNzLmFyYygwLDQwLDI1LGdhbWUubWF0aC5kZWdUb1JhZCgwKSwgZ2FtZS5tYXRoLmRlZ1RvUmFkKDE4MCksIGZhbHNlKTtcblx0Z3JhcGhpY3MubGluZVRvKC0yMCw0MCk7XG5cdGdyYXBoaWNzLmxpbmVUbygwLDApO1xuXHQvL2dyYXBoaWNzLmVuZEZpbGwoKTtcblx0dGhpcy5zcHJpdGUuYWRkQ2hpbGQoZ3JhcGhpY3MpO1xuXG5cdHRoaXMuc3ByaXRlLnNjYWxlLnNldFRvKDAuMywwLjMpO1xuXHR0aGlzLnNwcml0ZS5waXZvdC54ID0gMDtcblx0dGhpcy5zcHJpdGUucGl2b3QueSA9IDQwO1xuXG5cdHRoaXMuYm9keS5jbGVhclNoYXBlcygpO1xuXHR0aGlzLmJvZHkuYWRkUmVjdGFuZ2xlKC0xMCwtMTcsIDAsLTIpO1xuXHR0aGlzLmJvZHkuY29sbGlkZVdvcmxkQm91bmRzID0gcHJvcGVydGllcy5jb2xsaWRlV29ybGRCb3VuZHM7XG5cdHRoaXMuYm9keS5tYXNzID0gMTtcblx0dGhpcy5ib2R5LnNldENvbGxpc2lvbkdyb3VwKHRoaXMuY29sbGlzaW9ucy5wbGF5ZXJzKTtcblxuXHR0aGlzLnR1cnJldCA9IG5ldyBUdXJyZXQodGhpcy5ncm91cHMsIHRoaXMsIFwiRk9SV0FSRFNcIik7XG5cblx0dGhpcy5ib2R5LmNvbGxpZGVzKHRoaXMuY29sbGlzaW9ucy50ZXJyYWluLCB0aGlzLmNyYXNoLCB0aGlzKTtcbn07XG5cbnAuY2hlY2tPcmJEaXN0YW5jZSA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgZGlzdGFuY2UgPSB1dGlscy5kaXN0QXRvQih0aGlzLnNwcml0ZS5wb3NpdGlvbiwgdGhpcy50cmFjdG9yQmVhbS5vcmIuc3ByaXRlLnBvc2l0aW9uKTtcblx0aWYgKGRpc3RhbmNlIDwgdGhpcy50cmFjdG9yQmVhbS5sZW5ndGgpIHtcblx0XHR0aGlzLnRyYWN0b3JCZWFtLmRyYXdCZWFtKHRoaXMuc3ByaXRlLnBvc2l0aW9uKTtcblxuXHR9IGVsc2UgaWYgKGRpc3RhbmNlID49IHRoaXMudHJhY3RvckJlYW0ubGVuZ3RoICYmIGRpc3RhbmNlIDwgOTApIHtcblx0XHQvL2NvbnNvbGUubG9nKCdpc0xvY2tlZDogJywgdGhpcy50cmFjdG9yQmVhbS5pc0xvY2tlZCwgJ2hhc0dyYWJiZWQ6JywgdGhpcy50cmFjdG9yQmVhbS5oYXNHcmFiYmVkKTtcblx0XHRpZiAodGhpcy50cmFjdG9yQmVhbS5pc0xvY2tlZCAmJiAhdGhpcy50cmFjdG9yQmVhbS5oYXNHcmFiYmVkKSB7XG5cdFx0XHR0aGlzLnRyYWN0b3JCZWFtLmdyYWIodGhpcyk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGlmICh0aGlzLnRyYWN0b3JCZWFtLmlzTG9ja2luZykge1xuXHRcdFx0Ly9jb25zb2xlLmxvZygncmVsZWFzaW5nLi4uJyk7XG5cdFx0XHR0aGlzLnRyYWN0b3JCZWFtLmxvY2tpbmdSZWxlYXNlKCk7XG5cdFx0fVxuXHR9XG59O1xucC5zaG9vdCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnR1cnJldC5zaG9vdCgpO1xufSxcblxucC5jcmFzaCA9IGZ1bmN0aW9uKCkge1xuXHRpZiAoIXByb3BlcnRpZXMuZmF0YWxDb2xsaXNpb25zKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGNvbnNvbGUubG9nKCdDUkFTSEVEJyk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyO1xuIiwidmFyIHByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9wcm9wZXJ0aWVzJyk7XG52YXIgZ2FtZSA9IHdpbmRvdy5nYW1lO1xudmFyIGdyYXBoaWNzO1xudmFyIHRpbWVyO1xudmFyIGxvY2tpbmdEdXJhdGlvbiA9IHByb3BlcnRpZXMuZ2FtZVBsYXkubG9ja2luZ0R1cmF0aW9uO1xuXG4vKipcbiAqIFRyYWN0b3JCZWFtIGRlc2NyaXB0aW9uXG4gKlxuICogZGVmaW5lcyBhIHB1YmxpYyB2YXJpYWJsZSBhbmQgY2FsbHMgaW5pdCAtIGNoYW5nZSB0aGlzIGNvbnN0cnVjdG9yIHRvIHN1aXQgeW91ciBuZWVkcy5cbiAqIG5iLiB0aGVyZSdzIG5vIHJlcXVpcmVtZW50IHRvIGNhbGwgYW4gaW5pdCBmdW5jdGlvblxuICpcbiAqIEBjbGFzcyBUcmFjdG9yQmVhbVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFRyYWN0b3JCZWFtKG9yYikge1xuXHR0aGlzLm9yYiA9IG9yYjtcblxuXHR0aGlzLmlzTG9ja2VkID0gZmFsc2U7XG5cblx0dGhpcy5pc0xvY2tpbmcgPSBmYWxzZTtcblxuXHR0aGlzLmhhc0dyYWJiZWQgPSBmYWxzZTtcblxuXHR0aGlzLmxlbmd0aCA9IHByb3BlcnRpZXMuZ2FtZVBsYXkudHJhY3RvckJlYW1MZW5ndGg7XG5cblx0dGhpcy52YXJpYW5jZSA9IHByb3BlcnRpZXMuZ2FtZVBsYXkudHJhY3RvckJlYW1WYXJpYXRpb247XG5cdHRoaXMuaW5pdCgpO1xufVxuXG52YXIgcCA9IFRyYWN0b3JCZWFtLnByb3RvdHlwZTtcblxuLyoqXG4gKiBUcmFjdG9yQmVhbSBpbml0aWFsaXNhdGlvblxuICpcbiAqIEBtZXRob2QgaW5pdFxuICovXG5wLmluaXQgPSBmdW5jdGlvbigpIHtcblx0Z3JhcGhpY3MgPSBuZXcgUGhhc2VyLkdyYXBoaWNzKGdhbWUsIDAsMCk7XG5cdHRoaXMuc3ByaXRlID0gZ2FtZS5hZGQuc3ByaXRlKDAsMCk7XG5cdHRoaXMuc3ByaXRlLmFkZENoaWxkKGdyYXBoaWNzKTtcblx0dGltZXIgPSBnYW1lLnRpbWUuY3JlYXRlKGZhbHNlKTtcbn07XG5cbnAuZHJhd0JlYW0gPSBmdW5jdGlvbihwb3NBKSB7XG5cdGlmICghdGhpcy5pc0xvY2tpbmcpIHtcblx0XHR0aGlzLmlzTG9ja2luZyA9IHRydWU7XG5cdFx0dGltZXIuc3RhcnQoKTtcblx0XHR0aW1lci5hZGQobG9ja2luZ0R1cmF0aW9uLCB0aGlzLmxvY2ssIHRoaXMpO1xuXHR9XG5cdC8vY29uc29sZS5sb2coJ2RyYXdCZWFtJywgdGhpcy5oYXNHcmFiYmVkLCBwb3NBKTtcblx0Z3JhcGhpY3MuY2xlYXIoKTtcblx0dmFyIGNvbG91ciA9IHRoaXMuaGFzR3JhYmJlZD8gMHgwMGZmMDAgOiAweEVGNTY5Njtcblx0dmFyIGFscGhhID0gdGhpcy5oYXNHcmFiYmVkPyAwLjUgOiAwLjQ7XG5cdGdyYXBoaWNzLmxpbmVTdHlsZSg1LCBjb2xvdXIsIGFscGhhKTtcblx0Z3JhcGhpY3MubW92ZVRvKHBvc0EueCwgcG9zQS55KTtcblx0Z3JhcGhpY3MubGluZVRvKHRoaXMub3JiLnNwcml0ZS5wb3NpdGlvbi54LCB0aGlzLm9yYi5zcHJpdGUucG9zaXRpb24ueSk7XG59O1xuXG5wLmxvY2sgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5pc0xvY2tlZCA9IHRydWU7XG59O1xuXG5wLmxvY2tpbmdSZWxlYXNlID0gZnVuY3Rpb24oKSB7XG5cdC8vdGhpcy5sb2NrZWQgPSBmYWxzZTtcblx0dGhpcy5pc0xvY2tpbmcgPSBmYWxzZTtcblx0dGhpcy5oYXNHcmFiYmVkID0gZmFsc2U7XG5cdGdyYXBoaWNzLmNsZWFyKCk7XG5cdC8vdGltZXIucmVzZXQoKTtcblxuXHR0aW1lci5zdG9wKHRydWUpO1xufTtcblxucC5ncmFiID0gZnVuY3Rpb24ocGxheWVyKSB7XG5cdC8vY29uc29sZS5sb2coJ2dyYWJiZWQnKTtcblx0dGhpcy5oYXNHcmFiYmVkID0gdHJ1ZTtcblx0dmFyIG1heEZvcmNlID0gMjAwMDAwO1xuXHR2YXIgZGlmZlggPSBwbGF5ZXIuc3ByaXRlLnBvc2l0aW9uLnggLSB0aGlzLm9yYi5zcHJpdGUucG9zaXRpb24ueDtcblx0dmFyIGRpZmZZID0gcGxheWVyLnNwcml0ZS5wb3NpdGlvbi55IC0gdGhpcy5vcmIuc3ByaXRlLnBvc2l0aW9uLnk7XG5cdGdhbWUucGh5c2ljcy5wMi5jcmVhdGVSZXZvbHV0ZUNvbnN0cmFpbnQocGxheWVyLnNwcml0ZSwgWzAsIDBdLCB0aGlzLm9yYi5zcHJpdGUsIFtkaWZmWCxkaWZmWV0sIG1heEZvcmNlKTtcblx0dGhpcy5vcmIubW92ZSgpO1xufTtcblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBUcmFjdG9yQmVhbTtcbiIsInZhciBnYW1lID0gd2luZG93LmdhbWU7XG4vKipcbiAqIEEgcHJpdmF0ZSB2YXIgZGVzY3JpcHRpb25cbiAqXG4gKiBAcHJvcGVydHkgbXlQcml2YXRlVmFyXG4gKiBAdHlwZSB7bnVtYmVyfVxuICogQHByaXZhdGVcbiAqL1xudmFyIG15UHJpdmF0ZVZhciA9IDA7XG5cbi8qKlxuICogVHVycmV0IGRlc2NyaXB0aW9uXG4gKlxuICogZGVmaW5lcyBhIHB1YmxpYyB2YXJpYWJsZSBhbmQgY2FsbHMgaW5pdCAtIGNoYW5nZSB0aGlzIGNvbnN0cnVjdG9yIHRvIHN1aXQgeW91ciBuZWVkcy5cbiAqIG5iLiB0aGVyZSdzIG5vIHJlcXVpcmVtZW50IHRvIGNhbGwgYW4gaW5pdCBmdW5jdGlvblxuICpcbiAqIEBjbGFzcyBUdXJyZXRcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBUdXJyZXQoZ3JvdXBzLCBvcmlnaW4sIHR5cGUpIHtcblx0LyoqXG5cdCAqIEEgcHVibGljIHZhciBkZXNjcmlwdGlvblxuXHQgKlxuXHQgKiBAcHJvcGVydHkgbXlQdWJsaWNWYXJcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHRoaXMuZ3JvdXBzID0gZ3JvdXBzO1xuXHR0aGlzLm9yaWdpbiA9IG9yaWdpbjtcblx0dGhpcy50eXBlID0gdHlwZTtcblxuXHR0aGlzLmluaXQoKTtcbn1cblxudmFyIHAgPSBUdXJyZXQucHJvdG90eXBlO1xuXG4vKipcbiAqIFR1cnJldCBpbml0aWFsaXNhdGlvblxuICpcbiAqIEBtZXRob2QgaW5pdFxuICovXG5wLmluaXQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5idWxsZXRCaXRtYXAgPSBnYW1lLm1ha2UuYml0bWFwRGF0YSg1LDUpO1xuXHR0aGlzLmJ1bGxldEJpdG1hcC5jdHguZmlsbFN0eWxlID0gJyNmZmZmZmYnO1xuXHR0aGlzLmJ1bGxldEJpdG1hcC5jdHguYmVnaW5QYXRoKCk7XG5cdHRoaXMuYnVsbGV0Qml0bWFwLmN0eC5hcmMoMS4wLDEuMCwyLCAwLCBNYXRoLlBJKjIsIHRydWUpO1xuXHR0aGlzLmJ1bGxldEJpdG1hcC5jdHguY2xvc2VQYXRoKCk7XG5cdHRoaXMuYnVsbGV0Qml0bWFwLmN0eC5maWxsKCk7XG59O1xuXG5wLnNob290ID0gZnVuY3Rpb24oKSB7XG5cdHZhciBtYWduaXR1ZSA9IDI0MDtcblx0dmFyIGJ1bGxldCA9IGdhbWUubWFrZS5zcHJpdGUodGhpcy5vcmlnaW4uc3ByaXRlLnBvc2l0aW9uLngsIHRoaXMub3JpZ2luLnNwcml0ZS5wb3NpdGlvbi55LCB0aGlzLmJ1bGxldEJpdG1hcCk7XG5cdGJ1bGxldC5hbmNob3Iuc2V0VG8oMC41LDAuNSk7XG5cdGdhbWUucGh5c2ljcy5wMi5lbmFibGUoYnVsbGV0KTtcblx0dmFyIGFuZ2xlID0gdGhpcy5vcmlnaW4uYm9keS5yb3RhdGlvbiArICgzICogTWF0aC5QSSkgLyAyO1xuXHRidWxsZXQuYm9keS5jb2xsaWRlc1dvcmxkQm91bmRzID0gZmFsc2U7XG5cdGJ1bGxldC5ib2R5LnNldENvbGxpc2lvbkdyb3VwKHRoaXMub3JpZ2luLmNvbGxpc2lvbnMuYnVsbGV0cyk7XG5cdGJ1bGxldC5ib2R5LmNvbGxpZGVzKHRoaXMub3JpZ2luLmNvbGxpc2lvbnMudGVycmFpbiwgdGhpcy5kZXN0cm95QnVsbGV0LCB0aGlzKTtcblx0YnVsbGV0LmJvZHkuZGF0YS5ncmF2aXR5U2NhbGUgPSAwO1xuXHRidWxsZXQuYm9keS52ZWxvY2l0eS54ID0gbWFnbml0dWUgKiBNYXRoLmNvcyhhbmdsZSkgKyB0aGlzLm9yaWdpbi5ib2R5LnZlbG9jaXR5Lng7XG5cdGJ1bGxldC5ib2R5LnZlbG9jaXR5LnkgPSBtYWduaXR1ZSAqIE1hdGguc2luKGFuZ2xlKSArIHRoaXMub3JpZ2luLmJvZHkudmVsb2NpdHkueTtcblx0dGhpcy5ncm91cHMuYnVsbGV0cy5hZGQoYnVsbGV0KTtcbn07XG5cbnAuZGV0cm95QnVsbGV0ID0gZnVuY3Rpb24oYnVsbGV0Qm9keSkge1xuXHRidWxsZXRCb2R5LnNwcml0ZS5raWxsKCk7XG5cdHRoaXMuZ3JvdXBzLmJ1bGxldHMucmVtb3ZlKGJ1bGxldEJvZHkuc3ByaXRlKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBUdXJyZXQ7XG4iLCJ2YXIgZ2FtZSA9IHdpbmRvdy5nYW1lO1xudmFyIHByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9wcm9wZXJ0aWVzJyk7XG5cbi8qKlxuICogQSBwcml2YXRlIHZhciBkZXNjcmlwdGlvblxuICpcbiAqIEBwcm9wZXJ0eSBteVByaXZhdGVWYXJcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKiBAcHJpdmF0ZVxuICovXG52YXIgbXlQcml2YXRlVmFyID0gMDtcblxuLyoqXG4gKiBDb2xsaXNpb25zIGRlc2NyaXB0aW9uXG4gKiBjYWxscyBpbml0XG4gKlxuICogQGNsYXNzIENvbGxpc2lvbnNcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBDb2xsaXNpb25zIChjb2xsaXNpb25zKSB7XG5cdC8qKlxuXHQgKiBBIHB1YmxpYyB2YXIgZGVzY3JpcHRpb25cblx0ICpcblx0ICogQHByb3BlcnR5IG15UHVibGljVmFyXG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR0aGlzLm15UHVibGljVmFyID0gMTtcblx0dGhpcy5pbml0KCk7XG59XG5cbnZhciBwID0gQ29sbGlzaW9ucy5wcm90b3R5cGU7XG5cbi8qKlxuICogQ29sbGlzaW9ucyBpbml0aWFsaXNhdGlvblxuICpcbiAqIEBtZXRob2QgaW5pdFxuICovXG5wLmluaXQgPSBmdW5jdGlvbigpIHtcblx0Z2FtZS5waHlzaWNzLnN0YXJ0U3lzdGVtKFBoYXNlci5QaHlzaWNzLlAySlMpO1xuXHRnYW1lLnBoeXNpY3MucDIuc2V0SW1wYWN0RXZlbnRzKHRydWUpO1xuXHRnYW1lLnBoeXNpY3MucDIuZ3Jhdml0eS55ID0gMTAwO1xuXG5cdHRoaXMucGxheWVycyA9IGdhbWUucGh5c2ljcy5wMi5jcmVhdGVDb2xsaXNpb25Hcm91cCgpO1xuXHR0aGlzLnRlcnJhaW4gPSBnYW1lLnBoeXNpY3MucDIuY3JlYXRlQ29sbGlzaW9uR3JvdXAoKTtcblx0dGhpcy5idWxsZXRzID0gZ2FtZS5waHlzaWNzLnAyLmNyZWF0ZUNvbGxpc2lvbkdyb3VwKCk7XG5cblx0Z2FtZS5waHlzaWNzLnAyLnVwZGF0ZUJvdW5kc0NvbGxpc2lvbkdyb3VwKCk7XG59O1xuXG4vKipcbipcbiovXG5wLnNldCA9IGZ1bmN0aW9uKHNwcml0ZSwgY29sbGlzaW9uR3JvdXBzKSB7XG5cdHNwcml0ZS5ib2R5LmNvbGxpZGVzKGNvbGxpc2lvbkdyb3Vwcyk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29sbGlzaW9ucztcbiIsIi8qKlxuICogQSBwcml2YXRlIHZhciBkZXNjcmlwdGlvblxuICpcbiAqIEBwcm9wZXJ0eSBteVByaXZhdGVWYXJcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKiBAcHJpdmF0ZVxuICovXG52YXIgbXlQcml2YXRlVmFyID0gMDtcblxuLyoqXG4gKiBHcm91cHMgZGVzY3JpcHRpb25cbiAqIGNhbGxzIGluaXRcbiAqXG4gKiBAY2xhc3MgR3JvdXBzXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gR3JvdXBzICgpIHtcblx0LyoqXG5cdCAqIEEgcHVibGljIHZhciBkZXNjcmlwdGlvblxuXHQgKlxuXHQgKiBAcHJvcGVydHkgbXlQdWJsaWNWYXJcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHRoaXMubXlQdWJsaWNWYXIgPSAxO1xuXHR0aGlzLmluaXQoKTtcbn1cblxudmFyIHAgPSBHcm91cHMucHJvdG90eXBlO1xuXG4vKipcbiAqIEdyb3VwcyBpbml0aWFsaXNhdGlvblxuICpcbiAqIEBtZXRob2QgaW5pdFxuICovXG5wLmluaXQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5hY3RvcnMgPSBnYW1lLmFkZC5ncm91cCgpO1xuXHR0aGlzLnRlcnJhaW4gPSBnYW1lLmFkZC5ncm91cCgpO1xuXHR0aGlzLmJ1bGxldHMgPSBnYW1lLmFkZC5ncm91cCgpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEdyb3VwczsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgZGlzdEF0b0I6IGZ1bmN0aW9uKHBvaW50QSwgcG9pbnRCKSB7XG5cbiAgICB2YXIgQSA9IHBvaW50Qi54IC0gcG9pbnRBLng7XG4gICAgdmFyIEIgPSBwb2ludEIueSAtIHBvaW50QS55O1xuXG4gICAgcmV0dXJuIE1hdGguc3FydChBKkEgKyBCKkIpO1xuICB9XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBwcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi9wcm9wZXJ0aWVzJyk7XG5cbnZhciBnYW1lID0gbmV3IFBoYXNlci5HYW1lKHByb3BlcnRpZXMud2lkdGgscHJvcGVydGllcy5oZWlnaHQsIFBoYXNlci5BVVRPKTtcbndpbmRvdy5nYW1lID0gZ2FtZTtcblxuZ2FtZS5zdGF0ZS5hZGQoJ3BsYXknLCByZXF1aXJlKCcuL3N0YXRlcy9wbGF5JykpO1xuZ2FtZS5zdGF0ZS5hZGQoJ2xvYWQnLCByZXF1aXJlKCcuL3N0YXRlcy9sb2FkJykpO1xuZ2FtZS5zdGF0ZS5hZGQoJ21lbnUnLCByZXF1aXJlKCcuL3N0YXRlcy9tZW51JykpO1xuZ2FtZS5zdGF0ZS5hZGQoJ2Jvb3QnLCByZXF1aXJlKCcuL3N0YXRlcy9ib290JykpO1xuXG4vL2dhbWUuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTDtcbi8vZ2FtZS5zY2FsZS5zZXRTY3JlZW5TaXplKCk7XG5cbmdhbWUuc3RhdGUuc3RhcnQoJ2Jvb3QnKTtcbiIsIjsgdmFyIF9fYnJvd3NlcmlmeV9zaGltX3JlcXVpcmVfXz1yZXF1aXJlOyhmdW5jdGlvbiBicm93c2VyaWZ5U2hpbShtb2R1bGUsIGV4cG9ydHMsIHJlcXVpcmUsIGRlZmluZSwgYnJvd3NlcmlmeV9zaGltX19kZWZpbmVfX21vZHVsZV9fZXhwb3J0X18pIHtcbi8vIHN0YXRzLmpzIC0gaHR0cDovL2dpdGh1Yi5jb20vbXJkb29iL3N0YXRzLmpzXG52YXIgU3RhdHM9ZnVuY3Rpb24oKXt2YXIgbD1EYXRlLm5vdygpLG09bCxnPTAsbj1JbmZpbml0eSxvPTAsaD0wLHA9SW5maW5pdHkscT0wLHI9MCxzPTAsZj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2YuaWQ9XCJzdGF0c1wiO2YuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLGZ1bmN0aW9uKGIpe2IucHJldmVudERlZmF1bHQoKTt0KCsrcyUyKX0sITEpO2Yuc3R5bGUuY3NzVGV4dD1cIndpZHRoOjgwcHg7b3BhY2l0eTowLjk7Y3Vyc29yOnBvaW50ZXJcIjt2YXIgYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2EuaWQ9XCJmcHNcIjthLnN0eWxlLmNzc1RleHQ9XCJwYWRkaW5nOjAgMCAzcHggM3B4O3RleHQtYWxpZ246bGVmdDtiYWNrZ3JvdW5kLWNvbG9yOiMwMDJcIjtmLmFwcGVuZENoaWxkKGEpO3ZhciBpPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7aS5pZD1cImZwc1RleHRcIjtpLnN0eWxlLmNzc1RleHQ9XCJjb2xvcjojMGZmO2ZvbnQtZmFtaWx5OkhlbHZldGljYSxBcmlhbCxzYW5zLXNlcmlmO2ZvbnQtc2l6ZTo5cHg7Zm9udC13ZWlnaHQ6Ym9sZDtsaW5lLWhlaWdodDoxNXB4XCI7XG5pLmlubmVySFRNTD1cIkZQU1wiO2EuYXBwZW5kQ2hpbGQoaSk7dmFyIGM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtjLmlkPVwiZnBzR3JhcGhcIjtjLnN0eWxlLmNzc1RleHQ9XCJwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDo3NHB4O2hlaWdodDozMHB4O2JhY2tncm91bmQtY29sb3I6IzBmZlwiO2ZvcihhLmFwcGVuZENoaWxkKGMpOzc0PmMuY2hpbGRyZW4ubGVuZ3RoOyl7dmFyIGo9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7ai5zdHlsZS5jc3NUZXh0PVwid2lkdGg6MXB4O2hlaWdodDozMHB4O2Zsb2F0OmxlZnQ7YmFja2dyb3VuZC1jb2xvcjojMTEzXCI7Yy5hcHBlbmRDaGlsZChqKX12YXIgZD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2QuaWQ9XCJtc1wiO2Quc3R5bGUuY3NzVGV4dD1cInBhZGRpbmc6MCAwIDNweCAzcHg7dGV4dC1hbGlnbjpsZWZ0O2JhY2tncm91bmQtY29sb3I6IzAyMDtkaXNwbGF5Om5vbmVcIjtmLmFwcGVuZENoaWxkKGQpO3ZhciBrPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5rLmlkPVwibXNUZXh0XCI7ay5zdHlsZS5jc3NUZXh0PVwiY29sb3I6IzBmMDtmb250LWZhbWlseTpIZWx2ZXRpY2EsQXJpYWwsc2Fucy1zZXJpZjtmb250LXNpemU6OXB4O2ZvbnQtd2VpZ2h0OmJvbGQ7bGluZS1oZWlnaHQ6MTVweFwiO2suaW5uZXJIVE1MPVwiTVNcIjtkLmFwcGVuZENoaWxkKGspO3ZhciBlPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7ZS5pZD1cIm1zR3JhcGhcIjtlLnN0eWxlLmNzc1RleHQ9XCJwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDo3NHB4O2hlaWdodDozMHB4O2JhY2tncm91bmQtY29sb3I6IzBmMFwiO2ZvcihkLmFwcGVuZENoaWxkKGUpOzc0PmUuY2hpbGRyZW4ubGVuZ3RoOylqPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpLGouc3R5bGUuY3NzVGV4dD1cIndpZHRoOjFweDtoZWlnaHQ6MzBweDtmbG9hdDpsZWZ0O2JhY2tncm91bmQtY29sb3I6IzEzMVwiLGUuYXBwZW5kQ2hpbGQoaik7dmFyIHQ9ZnVuY3Rpb24oYil7cz1iO3N3aXRjaChzKXtjYXNlIDA6YS5zdHlsZS5kaXNwbGF5PVxuXCJibG9ja1wiO2Quc3R5bGUuZGlzcGxheT1cIm5vbmVcIjticmVhaztjYXNlIDE6YS5zdHlsZS5kaXNwbGF5PVwibm9uZVwiLGQuc3R5bGUuZGlzcGxheT1cImJsb2NrXCJ9fTtyZXR1cm57UkVWSVNJT046MTIsZG9tRWxlbWVudDpmLHNldE1vZGU6dCxiZWdpbjpmdW5jdGlvbigpe2w9RGF0ZS5ub3coKX0sZW5kOmZ1bmN0aW9uKCl7dmFyIGI9RGF0ZS5ub3coKTtnPWItbDtuPU1hdGgubWluKG4sZyk7bz1NYXRoLm1heChvLGcpO2sudGV4dENvbnRlbnQ9ZytcIiBNUyAoXCIrbitcIi1cIitvK1wiKVwiO3ZhciBhPU1hdGgubWluKDMwLDMwLTMwKihnLzIwMCkpO2UuYXBwZW5kQ2hpbGQoZS5maXJzdENoaWxkKS5zdHlsZS5oZWlnaHQ9YStcInB4XCI7cisrO2I+bSsxRTMmJihoPU1hdGgucm91bmQoMUUzKnIvKGItbSkpLHA9TWF0aC5taW4ocCxoKSxxPU1hdGgubWF4KHEsaCksaS50ZXh0Q29udGVudD1oK1wiIEZQUyAoXCIrcCtcIi1cIitxK1wiKVwiLGE9TWF0aC5taW4oMzAsMzAtMzAqKGgvMTAwKSksYy5hcHBlbmRDaGlsZChjLmZpcnN0Q2hpbGQpLnN0eWxlLmhlaWdodD1cbmErXCJweFwiLG09YixyPTApO3JldHVybiBifSx1cGRhdGU6ZnVuY3Rpb24oKXtsPXRoaXMuZW5kKCl9fX07XCJvYmplY3RcIj09PXR5cGVvZiBtb2R1bGUmJihtb2R1bGUuZXhwb3J0cz1TdGF0cyk7XG5cbjsgYnJvd3NlcmlmeV9zaGltX19kZWZpbmVfX21vZHVsZV9fZXhwb3J0X18odHlwZW9mIFN0YXRzICE9IFwidW5kZWZpbmVkXCIgPyBTdGF0cyA6IHdpbmRvdy5TdGF0cyk7XG5cbn0pLmNhbGwoZ2xvYmFsLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGZ1bmN0aW9uIGRlZmluZUV4cG9ydChleCkgeyBtb2R1bGUuZXhwb3J0cyA9IGV4OyB9KTtcbiIsIi8qKlxuICogRGVmaW5lcyBidWlsZCBzZXR0aW5ncyBmb3IgdGhlIHRocnVzdC1lbmdpbmVcbiAqXG4gKiBAbmFtZXNwYWNlIHRocnVzdC1lbmdpbmVcbiAqIEBtb2R1bGUgcHJvcGVydGllc1xuICogQGNsYXNzXG4gKiBAc3RhdGljXG4gKiBAdHlwZSB7e2VuYWJsZUpveXBhZDogYm9vbGVhbiwgZmF0YWxDb2xsaXNpb25zOiBib29sZWFuLCBzY2FsZToge21vZGU6IG51bWJlcn0sIGRyYXdTdGF0czogYm9vbGVhbn19XG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRkZWJ1Z1BoeXNpY3M6IGZhbHNlLFxuXHRjb2xsaWRlV29ybGRCb3VuZHM6IHRydWUsXG5cdGVuYWJsZUpveXBhZDogZmFsc2UsXG5cdGZhdGFsQ29sbGlzaW9uczogdHJ1ZSxcblx0c2NhbGU6IHtcblx0XHRtb2RlOiBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMXG5cdH0sXG5cdGRyYXdTdGF0czogZmFsc2UsXG5cdGRyYXdNb250YWluczogZmFsc2UsXG5cdHdpZHRoOiA3MDAsXG5cdGhlaWdodDogNTAwLFxuXHRnYW1lUGxheToge1xuXHRcdGZyZWVPcmJMb2NraW5nOiBmYWxzZSxcblx0XHRhdXRvT3JiTG9ja2luZzogdHJ1ZSxcblx0XHR0cmFjdG9yQmVhbUxlbmd0aDogODAsXG5cdFx0dHJhY3RvckJlYW1WYXJpYXRpb246IDEwLFxuXHRcdGxvY2tpbmdEdXJhdGlvbjogOTAwXG5cdH1cbn07XG4iLCJ2YXIgU3RhdHMgPSByZXF1aXJlKCdTdGF0cycpO1xudmFyIHByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9wcm9wZXJ0aWVzJyk7XG52YXIgZmVhdHVyZXMgPSByZXF1aXJlKCcuLi91dGlscy9mZWF0dXJlcycpO1xuXG4vKipcbiAqIFRoZSBib290IHN0YXRlXG4gKlxuICogQG5hbWVzcGFjZSBzdGF0ZXNcbiAqIEBtb2R1bGUgYm9vdFxuICogQHR5cGUge3tjcmVhdGU6IEZ1bmN0aW9uLCB1cGRhdGU6IEZ1bmN0aW9ufX1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHByZWxvYWQ6IGZ1bmN0aW9uKCkge1xuXHRcdC8vZ2FtZS5sb2FkLnNjcmlwdCgnam95c3RpY2snLCAnamF2YXNjcmlwdHMvYnJvd3NlcmlmeS9waGFzZXItdmlydHVhbC1qb3lzdGljay5taW4uanMnKTtcblx0XHRnYW1lLnNjYWxlLnNjYWxlTW9kZSA9IHByb3BlcnRpZXMuc2NhbGUubW9kZTtcblx0XHRnYW1lLnNjYWxlLnNldFNjcmVlblNpemUoKTtcblx0fSxcblxuXHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdGlmIChwcm9wZXJ0aWVzLmRyYXdTdGF0cykge1xuXHRcdFx0d2luZG93LnN0YXRzID0gbmV3IFN0YXRzKCk7XG5cdFx0XHRzdGF0cy5zZXRNb2RlKDApO1xuXHRcdFx0c3RhdHMuZG9tRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG5cdFx0XHRzdGF0cy5kb21FbGVtZW50LnN0eWxlLmxlZnQgPSAnMHB4Jztcblx0XHRcdHN0YXRzLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gJzBweCc7XG5cblx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIHN0YXRzLmRvbUVsZW1lbnQgKTtcblxuXHRcdFx0c2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRzdGF0cy5iZWdpbigpO1xuXHRcdFx0XHRzdGF0cy5lbmQoKTtcblx0XHRcdH0sIDEwMDAgLyA2MCk7XG5cdFx0fVxuXG5cdFx0ZmVhdHVyZXMuaW5pdCgpO1xuXG5cdFx0Y29uc29sZS53YXJuKFwiSW5zdHJ1Y3Rpb25zOiBVc2UgQ3Vyc29ycyB0byBtb3ZlIHNoaXAsIHNwYWNlIHRvIHNob290LCBjb2xsZWN0IG9yYiBieSBwYXNzaW5nIG5lYXJcIik7XG5cdFx0Y29uc29sZS53YXJuKFwiVG91Y2hTY3JlZW5EZXRlY3RlZDpcIiwgZmVhdHVyZXMuaXNUb3VjaFNjcmVlbik7XG5cblx0XHRnYW1lLnN0YXRlLnN0YXJ0KCdwbGF5Jyk7XG5cblx0fSxcblx0dXBkYXRlOiBmdW5jdGlvbigpIHtcblxuXHR9XG59O1xuIiwiLyoqXG4gKiBUaGUgbG9hZCBzdGF0ZVxuICpcbiAqIEBuYW1lc3BhY2Ugc3RhdGVzXG4gKiBAbW9kdWxlIGxvYWRcbiAqIEB0eXBlIHt7Y3JlYXRlOiBGdW5jdGlvbiwgdXBkYXRlOiBGdW5jdGlvbn19XG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXG5cdH0sXG5cdHVwZGF0ZTogZnVuY3Rpb24oKSB7XG5cblx0fVxufTsiLCIvKipcbiAqIFRoZSBtZW51IHN0YXRlXG4gKlxuICogQG5hbWVzcGFjZSBzdGF0ZXNcbiAqIEBtb2R1bGUgbWVudVxuICogQHR5cGUge3tjcmVhdGU6IEZ1bmN0aW9uLCB1cGRhdGU6IEZ1bmN0aW9ufX1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cblx0fSxcblx0dXBkYXRlOiBmdW5jdGlvbigpIHtcblxuXHR9XG59OyIsIi8vaW1wb3J0c1xudmFyIHByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9wcm9wZXJ0aWVzJyk7XG52YXIgQ29sbGlzaW9ucyA9IHJlcXVpcmUoJy4uL2Vudmlyb25tZW50L0NvbGxpc2lvbnMnKTtcbnZhciBHcm91cHMgPSByZXF1aXJlKCcuLi9lbnZpcm9ubWVudC9Hcm91cHMnKTtcbnZhciBQbGF5ZXIgPSByZXF1aXJlKCcuLi9hY3RvcnMvUGxheWVyJyk7XG52YXIgT3JiID0gcmVxdWlyZSgnLi4vYWN0b3JzL09yYicpO1xudmFyIE1hcCA9IHJlcXVpcmUoJy4uL2FjdG9ycy9NYXAnKTtcbnZhciBCYWNrZ3JvdW5kID0gcmVxdWlyZSgnLi4vYWN0b3JzL0JhY2tncm91bmQnKTtcbnZhciBUcmFjdG9yQmVhbSA9IHJlcXVpcmUoJy4uL2FjdG9ycy9UcmFjdG9yQmVhbScpO1xudmFyIGZlYXR1cmVzID0gcmVxdWlyZSgnLi4vdXRpbHMvZmVhdHVyZXMnKTtcblxuLy9wcml2YXRlc1xudmFyIGdhbWUgPSB3aW5kb3cuZ2FtZTtcbnZhciBwbGF5ZXI7XG52YXIgb3JiO1xudmFyIHRyYWN0b3JCZWFtO1xudmFyIGN1cnNvcnM7XG52YXIgZ3JvdW5kO1xudmFyIGFjdG9ycztcbnZhciB0ZXJyYWluO1xudmFyIG1hcDtcbnZhciBiYWNrZ3JvdW5kO1xuXG4vL2NvbnRyb2xzO1xudmFyIHBhZDtcbnZhciBidXR0b25BO1xudmFyIGJ1dHRvbkI7XG52YXIgYnV0dG9uQURvd24gPSBmYWxzZTtcbnZhciBidXR0b25CRG93biA9IGZhbHNlO1xudmFyIGlzWERvd24gICAgID0gZmFsc2U7XG52YXIgam95cGFkID0gcHJvcGVydGllcy5lbmFibGVKb3lwYWQgfHwgZmVhdHVyZXMuaXNUb3VjaFNjcmVlbjtcblxuLy9tb2R1bGVzXG52YXIgY29sbGlzaW9ucztcbnZhciBncm91cHM7XG5cbi8qKlxuICogVGhlIHBsYXkgc3RhdGUgLSB0aGlzIGlzIHdoZXJlIHRoZSBtYWdpYyBoYXBwZW5zXG4gKlxuICogQG5hbWVzcGFjZSBzdGF0ZXNcbiAqIEBtb2R1bGUgcGxheVxuICogQHR5cGUge3tjcmVhdGU6IEZ1bmN0aW9uLCB1cGRhdGU6IEZ1bmN0aW9ufX1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cblx0cHJlbG9hZDogZnVuY3Rpb24oKSB7XG5cdFx0Z2FtZS5sb2FkLmltYWdlKCd0aHJ1c3RtYXAnLCAnaW1hZ2VzL3RocnVzdC1sZXZlbDIucG5nJyk7XG5cdFx0Z2FtZS5sb2FkLnBoeXNpY3MoJ3BoeXNpY3NEYXRhJywgJ2ltYWdlcy90aHJ1c3QtbGV2ZWwyLmpzb24nKTtcblx0XHRnYW1lLmxvYWQuaW1hZ2UoJ3N0YXJzJywgJ2ltYWdlcy9zdGFyZmllbGQucG5nJyk7XG5cdFx0aWYgKGpveXBhZCkge1xuXHRcdFx0Z2FtZS5sb2FkLmF0bGFzKCdkcGFkJywgJ2ltYWdlcy92aXJ0dWFsam95c3RpY2svc2tpbnMvZHBhZC5wbmcnLCAnaW1hZ2VzL3ZpcnR1YWxqb3lzdGljay9za2lucy9kcGFkLmpzb24nKTtcblx0XHR9XG5cdH0sXG5cblx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRnYW1lLndvcmxkLnNldEJvdW5kcygwLCAwLCA5MjgsIDEyODApO1xuXG5cdFx0Z3JvdXBzID0gbmV3IEdyb3VwcygpO1xuXHRcdGNvbGxpc2lvbnMgPSBuZXcgQ29sbGlzaW9ucygpO1xuXHRcdGJhY2tncm91bmQgPSBuZXcgQmFja2dyb3VuZCgpO1xuXHRcdHBsYXllciA9IG5ldyBQbGF5ZXIoY29sbGlzaW9ucywgZ3JvdXBzKTtcblx0XHRvcmIgPSBuZXcgT3JiKGNvbGxpc2lvbnMpO1xuXHRcdG1hcCA9IG5ldyBNYXAoY29sbGlzaW9ucyk7XG5cdFx0dHJhY3RvckJlYW0gPSBuZXcgVHJhY3RvckJlYW0ob3JiKTtcblx0XHRwbGF5ZXIudHJhY3RvckJlYW0gPSB0cmFjdG9yQmVhbTtcblxuXHRcdGNvbGxpc2lvbnMuc2V0KG9yYiwgW2NvbGxpc2lvbnMucGxheWVycywgY29sbGlzaW9ucy50ZXJyYWluLCBjb2xsaXNpb25zLmJ1bGxldHNdKTtcblx0XHRjb2xsaXNpb25zLnNldChtYXAsIFtjb2xsaXNpb25zLnBsYXllcnMsIGNvbGxpc2lvbnMudGVycmFpbiwgY29sbGlzaW9ucy5idWxsZXRzXSk7XG5cblx0XHRncm91cHMudGVycmFpbi5hZGQoYmFja2dyb3VuZC5zcHJpdGUpO1xuXHRcdGlmIChiYWNrZ3JvdW5kLm1vdW50YWlucykgZ3JvdXBzLnRlcnJhaW4uYWRkKGJhY2tncm91bmQubW91bnRhaW5zKTtcblx0XHRncm91cHMuYWN0b3JzLmFkZChwbGF5ZXIuc3ByaXRlKTtcblx0XHRncm91cHMuYWN0b3JzLmFkZChvcmIuc3ByaXRlKTtcblx0XHRnYW1lLndvcmxkLnN3YXAoZ3JvdXBzLnRlcnJhaW4sIGdyb3Vwcy5hY3RvcnMpO1xuXHRcdGdhbWUuY2FtZXJhLmZvbGxvdyhwbGF5ZXIuc3ByaXRlKTtcblxuXHRcdGlmIChqb3lwYWQpIHtcblx0XHRcdHBhZCA9IGdhbWUucGx1Z2lucy5hZGQoUGhhc2VyLlZpcnR1YWxKb3lzdGljayk7XG5cdFx0XHR0aGlzLnN0aWNrID0gcGFkLmFkZERQYWQoMCwgMCwgMjAwLCAnZHBhZCcpO1xuXHRcdFx0dGhpcy5zdGljay5hbGlnbkJvdHRvbUxlZnQoKTtcblxuXHRcdFx0YnV0dG9uQSA9IHBhZC5hZGRCdXR0b24oNTE1LCAzMzAsICdkcGFkJywgJ2J1dHRvbjEtdXAnLCAnYnV0dG9uMS1kb3duJyk7XG5cdFx0XHRidXR0b25BLm9uRG93bi5hZGQodGhpcy5wcmVzc0J1dHRvbkEsIHRoaXMpO1xuXHRcdFx0YnV0dG9uQS5vblVwLmFkZCh0aGlzLnVwQnV0dG9uQSwgdGhpcyk7XG5cblx0XHRcdGJ1dHRvbkIgPSBwYWQuYWRkQnV0dG9uKDYyMCwgMjkwLCAnZHBhZCcsICdidXR0b24yLXVwJywgJ2J1dHRvbjItZG93bicpO1xuXHRcdFx0YnV0dG9uQi5vbkRvd24uYWRkKHRoaXMucHJlc3NCdXR0b25CLCB0aGlzKTtcblx0XHRcdGJ1dHRvbkIub25VcC5hZGQodGhpcy51cEJ1dHRvbkIsIHRoaXMpO1xuXHRcdH1cblxuXHRcdGN1cnNvcnMgXHRcdFx0ID0gZ2FtZS5pbnB1dC5rZXlib2FyZC5jcmVhdGVDdXJzb3JLZXlzKCk7XG5cdFx0dmFyIHNwYWNlUHJlc3MgPSBnYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuU1BBQ0VCQVIpO1xuXHRcdHZhciB4S2V5XHQgICAgID0gZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLlgpO1xuXHRcdHNwYWNlUHJlc3Mub25Eb3duLmFkZChwbGF5ZXIuc2hvb3QsIHBsYXllcik7XG5cdFx0eEtleS5vbkRvd24uYWRkKHRoaXMueERvd24sIHRoaXMpO1xuXHRcdHhLZXkub25VcC5hZGQodGhpcy54VXAsIHRoaXMpO1xuXHR9LFxuXHR1cGRhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdGlmIChjdXJzb3JzLmxlZnQuaXNEb3duKSB7XG5cdFx0XHRwbGF5ZXIuYm9keS5yb3RhdGVMZWZ0KDEwMCk7XG5cdFx0fSBlbHNlIGlmIChjdXJzb3JzLnJpZ2h0LmlzRG93bikge1xuXHRcdFx0cGxheWVyLmJvZHkucm90YXRlUmlnaHQoMTAwKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cGxheWVyLmJvZHkuc2V0WmVyb1JvdGF0aW9uKCk7XG5cdFx0fVxuXHRcdGlmIChjdXJzb3JzLnVwLmlzRG93biB8fCBidXR0b25BRG93bil7XG5cdFx0XHRwbGF5ZXIuYm9keS50aHJ1c3QoNDAwKTtcblx0XHR9XG5cdFx0aWYgKCF0cmFjdG9yQmVhbS5oYXNHcmFiYmVkKSB7XG5cdFx0XHRpZiAoaXNYRG93biB8fCBwcm9wZXJ0aWVzLmdhbWVQbGF5LmF1dG9PcmJMb2NraW5nKSB7XG5cdFx0XHRcdHBsYXllci5jaGVja09yYkRpc3RhbmNlKCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRyYWN0b3JCZWFtLmRyYXdCZWFtKHBsYXllci5zcHJpdGUucG9zaXRpb24pO1xuXHRcdH1cblx0XHRpZiAoam95cGFkKSB7XG5cdFx0XHRpZiAodGhpcy5zdGljay5pc0Rvd24pIHtcblx0XHRcdFx0aWYgKHRoaXMuc3RpY2suZGlyZWN0aW9uID09PSBQaGFzZXIuTEVGVCkge1xuXHRcdFx0XHRcdHBsYXllci5ib2R5LnJvdGF0ZUxlZnQoMTAwKTtcblx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLnN0aWNrLmRpcmVjdGlvbiA9PT0gUGhhc2VyLlJJR0hUKSB7XG5cdFx0XHRcdFx0cGxheWVyLmJvZHkucm90YXRlUmlnaHQoMTAwKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHQvL2dhbWUud29ybGQud3JhcChwbGF5ZXIuYm9keSwgMCwgZmFsc2UpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0Z2FtZS5kZWJ1Zy5jYW1lcmFJbmZvKGdhbWUuY2FtZXJhLCA1MDAsIDIwKTtcblx0fSxcblxuXHRwcmVzc0J1dHRvbkE6IGZ1bmN0aW9uKCkge1xuXHRcdGJ1dHRvbkFEb3duID0gdHJ1ZTtcblx0fSxcblxuXHR1cEJ1dHRvbkE6IGZ1bmN0aW9uKCkge1xuXHRcdGJ1dHRvbkFEb3duID0gZmFsc2U7XG5cdH0sXG5cblx0cHJlc3NCdXR0b25COiBmdW5jdGlvbigpIHtcblx0XHRidXR0b25CRG93biA9IHRydWU7XG5cdFx0cGxheWVyLnNob290KCk7XG5cdH0sXG5cblx0dXBCdXR0b25COiBmdW5jdGlvbigpIHtcblx0XHRidXR0b25CRG93biA9IGZhbHNlO1xuXHR9LFxuXG5cdHhEb3duOiBmdW5jdGlvbiAoKSB7XG5cdFx0aXNYRG93biA9IHRydWU7XG5cdH0sXG5cblx0eFVwOiBmdW5jdGlvbigpIHtcblx0XHRpc1hEb3duID0gZmFsc2U7XG5cdFx0aWYgKCFwcm9wZXJ0aWVzLmdhbWVQbGF5LmF1dG9PcmJMb2NraW5nKSB7XG5cdFx0XHR0aGlzLnJlbGVhc2VUcmFjdG9yQmVhbSgpO1xuXHRcdH1cblx0fVxufTtcbiIsIi8qXG5mdW5jdGlvbiBpc1RvdWNoRGV2aWNlKCl7XG4gICAgcmV0dXJuIHRydWUgPT0gKFwib250b3VjaHN0YXJ0XCIgaW4gd2luZG93IHx8IHdpbmRvdy5Eb2N1bWVudFRvdWNoICYmIGRvY3VtZW50IGluc3RhbmNlb2YgRG9jdW1lbnRUb3VjaCk7XG59XG5Ob3cgY2hlY2tpbmcgaWYg4oCYaXNUb3VjaERldmljZSgpO+KAmSBpcyByZXR1cm5zIHRydWUgaXQgbWVhbnMgaXRzIGEgdG91Y2ggZGV2aWNlLlxuXG5pZihpc1RvdWNoRGV2aWNlKCk9PT10cnVlKSB7XG4gICAgYWxlcnQoJ1RvdWNoIERldmljZScpOyAvL3lvdXIgbG9naWMgZm9yIHRvdWNoIGRldmljZVxufVxuZWxzZSB7XG4gICAgYWxlcnQoJ05vdCBhIFRvdWNoIERldmljZScpOyAvL3lvdXIgbG9naWMgZm9yIG5vbiB0b3VjaCBkZXZpY2Vcbn1cbiovXG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmlzVG91Y2hTY3JlZW4gPSAoKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdylcbiAgICAgICAgfHwgKG5hdmlnYXRvci5NYXhUb3VjaFBvaW50cyA+IDApXG4gICAgICAgIHx8IChuYXZpZ2F0b3IubXNNYXhUb3VjaFBvaW50cyA+IDApKTtcbiAgICBjb25zb2xlLmxvZyhcInRvdWNoU2NyZWVuOlwiLCB0aGlzLmlzVG91Y2hTY3JlZW4pO1xuICB9LFxuICBpc1RvdWNoU2NyZWVuOiB0aGlzLmlzVG91Y2hTY3JlZW5cbn1cbiJdfQ==
