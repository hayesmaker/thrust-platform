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
var joypad = properties.enableJoypad;

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
		if (features.isTouchScreen) {
			joypad = true;
		}

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYWN0b3JzL0JhY2tncm91bmQuanMiLCJzcmMvYWN0b3JzL01hcC5qcyIsInNyYy9hY3RvcnMvT3JiLmpzIiwic3JjL2FjdG9ycy9QbGF5ZXIuanMiLCJzcmMvYWN0b3JzL1RyYWN0b3JCZWFtLmpzIiwic3JjL2FjdG9ycy9UdXJyZXQuanMiLCJzcmMvZW52aXJvbm1lbnQvQ29sbGlzaW9ucy5qcyIsInNyYy9lbnZpcm9ubWVudC9Hcm91cHMuanMiLCJzcmMvZW52aXJvbm1lbnQvdXRpbHMuanMiLCJzcmMvZ2FtZS5qcyIsInNyYy9saWJzL3N0YXRzLmpzL3N0YXRzLm1pbi5qcyIsInNyYy9wcm9wZXJ0aWVzLmpzIiwic3JjL3N0YXRlcy9ib290LmpzIiwic3JjL3N0YXRlcy9sb2FkLmpzIiwic3JjL3N0YXRlcy9tZW51LmpzIiwic3JjL3N0YXRlcy9wbGF5LmpzIiwic3JjL3V0aWxzL2ZlYXR1cmVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL3Byb3BlcnRpZXMnKTtcblxuLyoqXG4gKlxuICpcbiAqIEB0eXBlIHtQaGFzZXIuR3JhcGhpY3N9XG4gKi9cbnZhciBncmFwaGljcztcblxuLyoqXG4gKiBCYWNrZ3JvdW5kIGRlc2NyaXB0aW9uXG4gKlxuICogZGVmaW5lcyBhIHB1YmxpYyB2YXJpYWJsZSBhbmQgY2FsbHMgaW5pdCAtIGNoYW5nZSB0aGlzIGNvbnN0cnVjdG9yIHRvIHN1aXQgeW91ciBuZWVkcy5cbiAqIG5iLiB0aGVyZSdzIG5vIHJlcXVpcmVtZW50IHRvIGNhbGwgYW4gaW5pdCBmdW5jdGlvblxuICpcbiAqIEBjbGFzcyBCYWNrZ3JvdW5kXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gQmFja2dyb3VuZCgpIHtcblx0dGhpcy5zcHJpdGUgPSBnYW1lLm1ha2UudGlsZVNwcml0ZSgwLCAwLCA5MjgsIDYwMCwgJ3N0YXJzJyk7XG5cdHRoaXMuaW5pdCgpO1xufVxuXG52YXIgcCA9IEJhY2tncm91bmQucHJvdG90eXBlO1xuXG4vKipcbiAqIEJhY2tncm91bmQgaW5pdGlhbGlzYXRpb25cbiAqXG4gKiBAbWV0aG9kIGluaXRcbiAqL1xucC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuc3RhcnMgPSB0aGlzLnNwcml0ZTtcblxuXHRpZiAocHJvcGVydGllcy5kcmF3TW91bnRhaW5zKSB7XG5cdFx0dGhpcy5tb3VudGFpbnMgPSBnYW1lLmFkZC5zcHJpdGUoMCwgNzAwKTtcblx0XHRncmFwaGljcyA9IG5ldyBQaGFzZXIuR3JhcGhpY3MoZ2FtZSwgMCwwKTtcblx0XHRncmFwaGljcy5saW5lU3R5bGUoMiwgMHhmZmZmZmYsIDAuNyk7XG5cdFx0dmFyIGdyb3VuZFdpZHRoID0gMjAwMDtcblx0XHR2YXIgcGVha1cgPSAyMDA7XG5cdFx0dmFyIHBlYWtIID0gMTAwO1xuXHRcdHZhciB1cCA9IHRydWU7XG5cdFx0dmFyIGk7XG5cdFx0Zm9yIChpID0gMDsgaSA8IGdyb3VuZFdpZHRoOyBpKyspIHtcblx0XHRcdGlmIChpICUgcGVha1cgPT09IDApIHtcblx0XHRcdFx0Z3JhcGhpY3MubGluZVRvKCBwZWFrVyArIGksIHVwPyAtTWF0aC5yYW5kb20oKSAqIHBlYWtIIDogMCApO1xuXHRcdFx0XHR1cCA9ICF1cDtcblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5tb3VudGFpbnMuYWRkQ2hpbGQoZ3JhcGhpY3MpO1xuXHR9XG5cblxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tncm91bmQ7IiwidmFyIHByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9wcm9wZXJ0aWVzJyk7XG52YXIgZ2FtZSA9IHdpbmRvdy5nYW1lO1xuXG4vKipcbiAqIEEgcHJpdmF0ZSB2YXIgZGVzY3JpcHRpb25cbiAqXG4gKiBAcHJvcGVydHkgbXlQcml2YXRlVmFyXG4gKiBAdHlwZSB7bnVtYmVyfVxuICogQHByaXZhdGVcbiAqL1xudmFyIG15UHJpdmF0ZVZhciA9IDA7XG5cbi8qKlxuICogTWFwIGRlc2NyaXB0aW9uXG4gKlxuICogZGVmaW5lcyBhIHB1YmxpYyB2YXJpYWJsZSBhbmQgY2FsbHMgaW5pdCAtIGNoYW5nZSB0aGlzIGNvbnN0cnVjdG9yIHRvIHN1aXQgeW91ciBuZWVkcy5cbiAqIG5iLiB0aGVyZSdzIG5vIHJlcXVpcmVtZW50IHRvIGNhbGwgYW4gaW5pdCBmdW5jdGlvblxuICpcbiAqIEBjbGFzcyBNYXBcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBNYXAoY29sbGlzaW9ucykge1xuXHR0aGlzLmNvbGxpc2lvbnMgPSBjb2xsaXNpb25zO1xuXG5cdHRoaXMuc3ByaXRlID0gZ2FtZS5hZGQuc3ByaXRlKDAsMCwgJ3RocnVzdG1hcCcpO1xuXG5cdHRoaXMuaW5pdCgpO1xufVxuXG52YXIgcCA9IE1hcC5wcm90b3R5cGU7XG5cbi8qKlxuICogTWFwIGluaXRpYWxpc2F0aW9uXG4gKlxuICogQG1ldGhvZCBpbml0XG4gKi9cbnAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnNwcml0ZS5wb3NpdGlvbi5zZXRUbyh0aGlzLnNwcml0ZS53aWR0aC8yLCA5NzApO1xuXG5cdGdhbWUucGh5c2ljcy5wMi5lbmFibGUodGhpcy5zcHJpdGUsIHByb3BlcnRpZXMuZGVidWdQaHlzaWNzKTtcblxuXHR0aGlzLmJvZHkgPSB0aGlzLnNwcml0ZS5ib2R5O1xuXG5cdHRoaXMuYm9keS5zdGF0aWMgPSB0cnVlO1xuXG5cdHRoaXMuYm9keS5jbGVhclNoYXBlcygpO1xuXHR0aGlzLmJvZHkubG9hZFBvbHlnb24oJ3BoeXNpY3NEYXRhJywgJ3RocnVzdG1hcCcpO1xuXG5cdHRoaXMuYm9keS5zZXRDb2xsaXNpb25Hcm91cCh0aGlzLmNvbGxpc2lvbnMudGVycmFpbik7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gTWFwO1xuIiwidmFyIGdhbWUgPSB3aW5kb3cuZ2FtZTtcbnZhciBwcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vcHJvcGVydGllcycpO1xuLyoqXG4gKiBBIHByaXZhdGUgdmFyIGRlc2NyaXB0aW9uXG4gKlxuICogQHByb3BlcnR5IG15UHJpdmF0ZVZhclxuICogQHR5cGUge251bWJlcn1cbiAqIEBwcml2YXRlXG4gKi9cbnZhciBteVByaXZhdGVWYXIgPSAwO1xuXG4vKipcbiAqIE9yYiBkZXNjcmlwdGlvblxuICogY2FsbHMgaW5pdFxuICpcbiAqIEBjbGFzcyBPcmJcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBPcmIgKGNvbGxpc2lvbnMpIHtcblx0LyoqXG5cdCAqIEEgY29sbGlzaW9ucyBjb250YWluZXJcblx0ICpcblx0ICogQHByb3BlcnR5IGNvbGxpc2lvbnNcblx0ICogQHR5cGUge0NvbGxpc2lvbnN9XG5cdCAqL1xuXHR0aGlzLmNvbGxpc2lvbnMgPSBjb2xsaXNpb25zO1xuXG5cdHZhciBibWQgPSBnYW1lLm1ha2UuYml0bWFwRGF0YSgyMiwyMik7XG5cdGJtZC5jdHguc3Ryb2tlU3R5bGUgPSAnIzk5OTk5OSc7XG5cdGJtZC5jdHgubGluZVdpZHRoID0gMjtcblx0Ym1kLmN0eC5iZWdpblBhdGgoKTtcblx0Ym1kLmN0eC5hcmMoMTEsIDExLCAxMCwgMCwgTWF0aC5QSSoyLCB0cnVlKTtcblx0Ym1kLmN0eC5jbG9zZVBhdGgoKTtcblx0Ym1kLmN0eC5zdHJva2UoKTtcblx0LyoqXG5cdCAqIEBwcm9wZXJ0eSBzcHJpdGVcblx0ICovXG5cdHRoaXMuc3ByaXRlID0gZ2FtZS5tYWtlLnNwcml0ZSg1NTAsIDEyMDAsIGJtZCk7XG5cdHRoaXMuc3ByaXRlLmFuY2hvci5zZXRUbygwLjUsMC41KTtcblxuXHR0aGlzLmluaXQoKTtcbn1cblxudmFyIHAgPSBPcmIucHJvdG90eXBlO1xuXG4vKipcbiAqIE9yYiBpbml0aWFsaXNhdGlvblxuICpcbiAqIEBtZXRob2QgaW5pdFxuICovXG5wLmluaXQgPSBmdW5jdGlvbigpIHtcblxuXHRnYW1lLnBoeXNpY3MucDIuZW5hYmxlKHRoaXMuc3ByaXRlLCBwcm9wZXJ0aWVzLmRlYnVnUGh5c2ljcyk7XG5cblx0Ly9tb3Rpb25TdGF0ZSA9IDE7IC8vZm9yIGR5bmFtaWNcblx0Ly9tb3Rpb25TdGF0ZSA9IDI7IC8vZm9yIHN0YXRpY1xuXHQvL21vdGlvblN0YXRlID0gNDsgLy9mb3Iga2luZW1hdGljXG5cblx0dGhpcy5ib2R5ID0gdGhpcy5zcHJpdGUuYm9keTtcblxuXHR0aGlzLmJvZHkubW90aW9uU3RhdGUgPSAyO1xuXG5cdHRoaXMuYm9keS5zZXRDb2xsaXNpb25Hcm91cCh0aGlzLmNvbGxpc2lvbnMudGVycmFpbik7XG5cblx0dGhpcy5ib2R5LmNvbGxpZGVXb3JsZEJvdW5kcyA9IHByb3BlcnRpZXMuY29sbGlkZVdvcmxkQm91bmRzO1xuXG5cdC8vdGhpcy5ib2R5LmNvbGxpZGVzKHRoaXMuY29sbGlzaW9ucy5idWxsZXRzLCB0aGlzLm1vdmUsIHRoaXMpXG59O1xuXG5wLm1vdmUgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5ib2R5Lm1vdGlvblN0YXRlID0gMTtcblx0dGhpcy5ib2R5Lm1hc3MgPSAxO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IE9yYjtcbiIsInZhciBnYW1lID0gd2luZG93LmdhbWU7XG52YXIgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL3Byb3BlcnRpZXMnKTtcbnZhciBUdXJyZXQgPSByZXF1aXJlKCcuL1R1cnJldCcpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vZW52aXJvbm1lbnQvdXRpbHMnKVxuXG5cbi8qKlxuICogUGxheWVyIGRlc2NyaXB0aW9uXG4gKiBjYWxscyBpbml0XG4gKlxuICogQHBhcmFtIGNvbGxpc2lvbnMge0NvbGxpc2lvbnN9IE91ciBjb2xsaXNpb25zIGNvbnRhaW5lciBvZiBjb2xsaXNpb25Hcm91cHNcbiAqIEBwYXJhbSBncm91cHMge0dyb3Vwc31cbiAqIEBjbGFzcyBQbGF5ZXJcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBQbGF5ZXIoY29sbGlzaW9ucywgZ3JvdXBzKSB7XG5cdC8qKlxuXHQgKiBUaGUgQ29sbGlzaW9ucyBPYmplY3Rcblx0ICpcblx0ICogQHByb3BlcnR5IGNvbGxpc2lvbnNcblx0ICogQHR5cGUge0NvbGxpc2lvbnN9XG5cdCAqL1xuXHR0aGlzLmNvbGxpc2lvbnMgPSBjb2xsaXNpb25zO1xuXG5cdHRoaXMuZ3JvdXBzID0gZ3JvdXBzO1xuXG5cdHRoaXMudHJhY3RvckJlYW0gPSBudWxsO1xuXHQvKipcblx0ICogQ3JlYXRlcyB0aGUgcGxheWVyIHNwcml0ZSB3aGljaCBpcyByZXR1cm5lZCBmb3IgZWFzeSByZWZlcmVuY2UgYnkgdGhlIGNvbnRhaW5pbmcgc3RhdGVcblx0ICpcblx0ICogQHByb3BlcnR5IHNwcml0ZVxuXHQgKiBAdHlwZSB7UGhhc2VyLlNwcml0ZX1cblx0ICovXG5cdHRoaXMuc3ByaXRlID0gZ2FtZS5tYWtlLnNwcml0ZShnYW1lLndvcmxkLmNlbnRlclgsIDMwMCk7XG5cblx0dGhpcy5pbml0KCk7XG59XG5cbnZhciBwID0gUGxheWVyLnByb3RvdHlwZTtcblxuLyoqXG4gKiBQbGF5ZXIgaW5pdGlhbGlzYXRpb25cbiAqXG4gKiBAbWV0aG9kIGluaXRcbiAqL1xucC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cblx0Z2FtZS5waHlzaWNzLnAyLmVuYWJsZSh0aGlzLnNwcml0ZSwgcHJvcGVydGllcy5kZWJ1Z1BoeXNpY3MpO1xuXG5cdHRoaXMuYm9keSA9IHRoaXMuc3ByaXRlLmJvZHk7XG5cblx0dmFyIGdyYXBoaWNzID0gbmV3IFBoYXNlci5HcmFwaGljcyhnYW1lLCAwLDApO1xuXHQvL2dyYXBoaWNzLmJlZ2luRmlsbCgweDAwMDAwMCk7XG5cdGdyYXBoaWNzLmxpbmVTdHlsZSg0LDB4ZmZmZmZmKTtcblx0Z3JhcGhpY3MubGluZVRvKDIwLDQwKTtcblx0Z3JhcGhpY3MubGluZVRvKDI1LDQwKTtcblx0Z3JhcGhpY3MuYXJjKDAsNDAsMjUsZ2FtZS5tYXRoLmRlZ1RvUmFkKDApLCBnYW1lLm1hdGguZGVnVG9SYWQoMTgwKSwgZmFsc2UpO1xuXHRncmFwaGljcy5saW5lVG8oLTIwLDQwKTtcblx0Z3JhcGhpY3MubGluZVRvKDAsMCk7XG5cdC8vZ3JhcGhpY3MuZW5kRmlsbCgpO1xuXHR0aGlzLnNwcml0ZS5hZGRDaGlsZChncmFwaGljcyk7XG5cblx0dGhpcy5zcHJpdGUuc2NhbGUuc2V0VG8oMC4zLDAuMyk7XG5cdHRoaXMuc3ByaXRlLnBpdm90LnggPSAwO1xuXHR0aGlzLnNwcml0ZS5waXZvdC55ID0gNDA7XG5cblx0dGhpcy5ib2R5LmNsZWFyU2hhcGVzKCk7XG5cdHRoaXMuYm9keS5hZGRSZWN0YW5nbGUoLTEwLC0xNywgMCwtMik7XG5cdHRoaXMuYm9keS5jb2xsaWRlV29ybGRCb3VuZHMgPSBwcm9wZXJ0aWVzLmNvbGxpZGVXb3JsZEJvdW5kcztcblx0dGhpcy5ib2R5Lm1hc3MgPSAxO1xuXHR0aGlzLmJvZHkuc2V0Q29sbGlzaW9uR3JvdXAodGhpcy5jb2xsaXNpb25zLnBsYXllcnMpO1xuXG5cdHRoaXMudHVycmV0ID0gbmV3IFR1cnJldCh0aGlzLmdyb3VwcywgdGhpcywgXCJGT1JXQVJEU1wiKTtcblxuXHR0aGlzLmJvZHkuY29sbGlkZXModGhpcy5jb2xsaXNpb25zLnRlcnJhaW4sIHRoaXMuY3Jhc2gsIHRoaXMpO1xufTtcblxucC5jaGVja09yYkRpc3RhbmNlID0gZnVuY3Rpb24oKSB7XG5cdHZhciBkaXN0YW5jZSA9IHV0aWxzLmRpc3RBdG9CKHRoaXMuc3ByaXRlLnBvc2l0aW9uLCB0aGlzLnRyYWN0b3JCZWFtLm9yYi5zcHJpdGUucG9zaXRpb24pO1xuXHRpZiAoZGlzdGFuY2UgPCB0aGlzLnRyYWN0b3JCZWFtLmxlbmd0aCkge1xuXHRcdHRoaXMudHJhY3RvckJlYW0uZHJhd0JlYW0odGhpcy5zcHJpdGUucG9zaXRpb24pO1xuXG5cdH0gZWxzZSBpZiAoZGlzdGFuY2UgPj0gdGhpcy50cmFjdG9yQmVhbS5sZW5ndGggJiYgZGlzdGFuY2UgPCA5MCkge1xuXHRcdC8vY29uc29sZS5sb2coJ2lzTG9ja2VkOiAnLCB0aGlzLnRyYWN0b3JCZWFtLmlzTG9ja2VkLCAnaGFzR3JhYmJlZDonLCB0aGlzLnRyYWN0b3JCZWFtLmhhc0dyYWJiZWQpO1xuXHRcdGlmICh0aGlzLnRyYWN0b3JCZWFtLmlzTG9ja2VkICYmICF0aGlzLnRyYWN0b3JCZWFtLmhhc0dyYWJiZWQpIHtcblx0XHRcdHRoaXMudHJhY3RvckJlYW0uZ3JhYih0aGlzKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0aWYgKHRoaXMudHJhY3RvckJlYW0uaXNMb2NraW5nKSB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKCdyZWxlYXNpbmcuLi4nKTtcblx0XHRcdHRoaXMudHJhY3RvckJlYW0ubG9ja2luZ1JlbGVhc2UoKTtcblx0XHR9XG5cdH1cbn07XG5wLnNob290ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMudHVycmV0LnNob290KCk7XG59LFxuXG5wLmNyYXNoID0gZnVuY3Rpb24oKSB7XG5cdGlmICghcHJvcGVydGllcy5mYXRhbENvbGxpc2lvbnMpIHtcblx0XHRyZXR1cm47XG5cdH1cblx0Y29uc29sZS5sb2coJ0NSQVNIRUQnKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXI7XG4iLCJ2YXIgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL3Byb3BlcnRpZXMnKTtcbnZhciBnYW1lID0gd2luZG93LmdhbWU7XG52YXIgZ3JhcGhpY3M7XG52YXIgdGltZXI7XG52YXIgbG9ja2luZ0R1cmF0aW9uID0gcHJvcGVydGllcy5nYW1lUGxheS5sb2NraW5nRHVyYXRpb247XG5cbi8qKlxuICogVHJhY3RvckJlYW0gZGVzY3JpcHRpb25cbiAqXG4gKiBkZWZpbmVzIGEgcHVibGljIHZhcmlhYmxlIGFuZCBjYWxscyBpbml0IC0gY2hhbmdlIHRoaXMgY29uc3RydWN0b3IgdG8gc3VpdCB5b3VyIG5lZWRzLlxuICogbmIuIHRoZXJlJ3Mgbm8gcmVxdWlyZW1lbnQgdG8gY2FsbCBhbiBpbml0IGZ1bmN0aW9uXG4gKlxuICogQGNsYXNzIFRyYWN0b3JCZWFtXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gVHJhY3RvckJlYW0ob3JiKSB7XG5cdHRoaXMub3JiID0gb3JiO1xuXG5cdHRoaXMuaXNMb2NrZWQgPSBmYWxzZTtcblxuXHR0aGlzLmlzTG9ja2luZyA9IGZhbHNlO1xuXG5cdHRoaXMuaGFzR3JhYmJlZCA9IGZhbHNlO1xuXG5cdHRoaXMubGVuZ3RoID0gcHJvcGVydGllcy5nYW1lUGxheS50cmFjdG9yQmVhbUxlbmd0aDtcblxuXHR0aGlzLnZhcmlhbmNlID0gcHJvcGVydGllcy5nYW1lUGxheS50cmFjdG9yQmVhbVZhcmlhdGlvbjtcblx0dGhpcy5pbml0KCk7XG59XG5cbnZhciBwID0gVHJhY3RvckJlYW0ucHJvdG90eXBlO1xuXG4vKipcbiAqIFRyYWN0b3JCZWFtIGluaXRpYWxpc2F0aW9uXG4gKlxuICogQG1ldGhvZCBpbml0XG4gKi9cbnAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRncmFwaGljcyA9IG5ldyBQaGFzZXIuR3JhcGhpY3MoZ2FtZSwgMCwwKTtcblx0dGhpcy5zcHJpdGUgPSBnYW1lLmFkZC5zcHJpdGUoMCwwKTtcblx0dGhpcy5zcHJpdGUuYWRkQ2hpbGQoZ3JhcGhpY3MpO1xuXHR0aW1lciA9IGdhbWUudGltZS5jcmVhdGUoZmFsc2UpO1xufTtcblxucC5kcmF3QmVhbSA9IGZ1bmN0aW9uKHBvc0EpIHtcblx0aWYgKCF0aGlzLmlzTG9ja2luZykge1xuXHRcdHRoaXMuaXNMb2NraW5nID0gdHJ1ZTtcblx0XHR0aW1lci5zdGFydCgpO1xuXHRcdHRpbWVyLmFkZChsb2NraW5nRHVyYXRpb24sIHRoaXMubG9jaywgdGhpcyk7XG5cdH1cblx0Ly9jb25zb2xlLmxvZygnZHJhd0JlYW0nLCB0aGlzLmhhc0dyYWJiZWQsIHBvc0EpO1xuXHRncmFwaGljcy5jbGVhcigpO1xuXHR2YXIgY29sb3VyID0gdGhpcy5oYXNHcmFiYmVkPyAweDAwZmYwMCA6IDB4RUY1Njk2O1xuXHR2YXIgYWxwaGEgPSB0aGlzLmhhc0dyYWJiZWQ/IDAuNSA6IDAuNDtcblx0Z3JhcGhpY3MubGluZVN0eWxlKDUsIGNvbG91ciwgYWxwaGEpO1xuXHRncmFwaGljcy5tb3ZlVG8ocG9zQS54LCBwb3NBLnkpO1xuXHRncmFwaGljcy5saW5lVG8odGhpcy5vcmIuc3ByaXRlLnBvc2l0aW9uLngsIHRoaXMub3JiLnNwcml0ZS5wb3NpdGlvbi55KTtcbn07XG5cbnAubG9jayA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmlzTG9ja2VkID0gdHJ1ZTtcbn07XG5cbnAubG9ja2luZ1JlbGVhc2UgPSBmdW5jdGlvbigpIHtcblx0Ly90aGlzLmxvY2tlZCA9IGZhbHNlO1xuXHR0aGlzLmlzTG9ja2luZyA9IGZhbHNlO1xuXHR0aGlzLmhhc0dyYWJiZWQgPSBmYWxzZTtcblx0Z3JhcGhpY3MuY2xlYXIoKTtcblx0Ly90aW1lci5yZXNldCgpO1xuXG5cdHRpbWVyLnN0b3AodHJ1ZSk7XG59O1xuXG5wLmdyYWIgPSBmdW5jdGlvbihwbGF5ZXIpIHtcblx0Ly9jb25zb2xlLmxvZygnZ3JhYmJlZCcpO1xuXHR0aGlzLmhhc0dyYWJiZWQgPSB0cnVlO1xuXHR2YXIgbWF4Rm9yY2UgPSAyMDAwMDA7XG5cdHZhciBkaWZmWCA9IHBsYXllci5zcHJpdGUucG9zaXRpb24ueCAtIHRoaXMub3JiLnNwcml0ZS5wb3NpdGlvbi54O1xuXHR2YXIgZGlmZlkgPSBwbGF5ZXIuc3ByaXRlLnBvc2l0aW9uLnkgLSB0aGlzLm9yYi5zcHJpdGUucG9zaXRpb24ueTtcblx0Z2FtZS5waHlzaWNzLnAyLmNyZWF0ZVJldm9sdXRlQ29uc3RyYWludChwbGF5ZXIuc3ByaXRlLCBbMCwgMF0sIHRoaXMub3JiLnNwcml0ZSwgW2RpZmZYLGRpZmZZXSwgbWF4Rm9yY2UpO1xuXHR0aGlzLm9yYi5tb3ZlKCk7XG59O1xuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWN0b3JCZWFtO1xuIiwidmFyIGdhbWUgPSB3aW5kb3cuZ2FtZTtcbi8qKlxuICogQSBwcml2YXRlIHZhciBkZXNjcmlwdGlvblxuICpcbiAqIEBwcm9wZXJ0eSBteVByaXZhdGVWYXJcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKiBAcHJpdmF0ZVxuICovXG52YXIgbXlQcml2YXRlVmFyID0gMDtcblxuLyoqXG4gKiBUdXJyZXQgZGVzY3JpcHRpb25cbiAqXG4gKiBkZWZpbmVzIGEgcHVibGljIHZhcmlhYmxlIGFuZCBjYWxscyBpbml0IC0gY2hhbmdlIHRoaXMgY29uc3RydWN0b3IgdG8gc3VpdCB5b3VyIG5lZWRzLlxuICogbmIuIHRoZXJlJ3Mgbm8gcmVxdWlyZW1lbnQgdG8gY2FsbCBhbiBpbml0IGZ1bmN0aW9uXG4gKlxuICogQGNsYXNzIFR1cnJldFxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFR1cnJldChncm91cHMsIG9yaWdpbiwgdHlwZSkge1xuXHQvKipcblx0ICogQSBwdWJsaWMgdmFyIGRlc2NyaXB0aW9uXG5cdCAqXG5cdCAqIEBwcm9wZXJ0eSBteVB1YmxpY1ZhclxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dGhpcy5ncm91cHMgPSBncm91cHM7XG5cdHRoaXMub3JpZ2luID0gb3JpZ2luO1xuXHR0aGlzLnR5cGUgPSB0eXBlO1xuXG5cdHRoaXMuaW5pdCgpO1xufVxuXG52YXIgcCA9IFR1cnJldC5wcm90b3R5cGU7XG5cbi8qKlxuICogVHVycmV0IGluaXRpYWxpc2F0aW9uXG4gKlxuICogQG1ldGhvZCBpbml0XG4gKi9cbnAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmJ1bGxldEJpdG1hcCA9IGdhbWUubWFrZS5iaXRtYXBEYXRhKDUsNSk7XG5cdHRoaXMuYnVsbGV0Qml0bWFwLmN0eC5maWxsU3R5bGUgPSAnI2ZmZmZmZic7XG5cdHRoaXMuYnVsbGV0Qml0bWFwLmN0eC5iZWdpblBhdGgoKTtcblx0dGhpcy5idWxsZXRCaXRtYXAuY3R4LmFyYygxLjAsMS4wLDIsIDAsIE1hdGguUEkqMiwgdHJ1ZSk7XG5cdHRoaXMuYnVsbGV0Qml0bWFwLmN0eC5jbG9zZVBhdGgoKTtcblx0dGhpcy5idWxsZXRCaXRtYXAuY3R4LmZpbGwoKTtcbn07XG5cbnAuc2hvb3QgPSBmdW5jdGlvbigpIHtcblx0dmFyIG1hZ25pdHVlID0gMjQwO1xuXHR2YXIgYnVsbGV0ID0gZ2FtZS5tYWtlLnNwcml0ZSh0aGlzLm9yaWdpbi5zcHJpdGUucG9zaXRpb24ueCwgdGhpcy5vcmlnaW4uc3ByaXRlLnBvc2l0aW9uLnksIHRoaXMuYnVsbGV0Qml0bWFwKTtcblx0YnVsbGV0LmFuY2hvci5zZXRUbygwLjUsMC41KTtcblx0Z2FtZS5waHlzaWNzLnAyLmVuYWJsZShidWxsZXQpO1xuXHR2YXIgYW5nbGUgPSB0aGlzLm9yaWdpbi5ib2R5LnJvdGF0aW9uICsgKDMgKiBNYXRoLlBJKSAvIDI7XG5cdGJ1bGxldC5ib2R5LmNvbGxpZGVzV29ybGRCb3VuZHMgPSBmYWxzZTtcblx0YnVsbGV0LmJvZHkuc2V0Q29sbGlzaW9uR3JvdXAodGhpcy5vcmlnaW4uY29sbGlzaW9ucy5idWxsZXRzKTtcblx0YnVsbGV0LmJvZHkuY29sbGlkZXModGhpcy5vcmlnaW4uY29sbGlzaW9ucy50ZXJyYWluLCB0aGlzLmRlc3Ryb3lCdWxsZXQsIHRoaXMpO1xuXHRidWxsZXQuYm9keS5kYXRhLmdyYXZpdHlTY2FsZSA9IDA7XG5cdGJ1bGxldC5ib2R5LnZlbG9jaXR5LnggPSBtYWduaXR1ZSAqIE1hdGguY29zKGFuZ2xlKSArIHRoaXMub3JpZ2luLmJvZHkudmVsb2NpdHkueDtcblx0YnVsbGV0LmJvZHkudmVsb2NpdHkueSA9IG1hZ25pdHVlICogTWF0aC5zaW4oYW5nbGUpICsgdGhpcy5vcmlnaW4uYm9keS52ZWxvY2l0eS55O1xuXHR0aGlzLmdyb3Vwcy5idWxsZXRzLmFkZChidWxsZXQpO1xufTtcblxucC5kZXRyb3lCdWxsZXQgPSBmdW5jdGlvbihidWxsZXRCb2R5KSB7XG5cdGJ1bGxldEJvZHkuc3ByaXRlLmtpbGwoKTtcblx0dGhpcy5ncm91cHMuYnVsbGV0cy5yZW1vdmUoYnVsbGV0Qm9keS5zcHJpdGUpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFR1cnJldDtcbiIsInZhciBnYW1lID0gd2luZG93LmdhbWU7XG52YXIgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL3Byb3BlcnRpZXMnKTtcblxuLyoqXG4gKiBBIHByaXZhdGUgdmFyIGRlc2NyaXB0aW9uXG4gKlxuICogQHByb3BlcnR5IG15UHJpdmF0ZVZhclxuICogQHR5cGUge251bWJlcn1cbiAqIEBwcml2YXRlXG4gKi9cbnZhciBteVByaXZhdGVWYXIgPSAwO1xuXG4vKipcbiAqIENvbGxpc2lvbnMgZGVzY3JpcHRpb25cbiAqIGNhbGxzIGluaXRcbiAqXG4gKiBAY2xhc3MgQ29sbGlzaW9uc1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIENvbGxpc2lvbnMgKGNvbGxpc2lvbnMpIHtcblx0LyoqXG5cdCAqIEEgcHVibGljIHZhciBkZXNjcmlwdGlvblxuXHQgKlxuXHQgKiBAcHJvcGVydHkgbXlQdWJsaWNWYXJcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHRoaXMubXlQdWJsaWNWYXIgPSAxO1xuXHR0aGlzLmluaXQoKTtcbn1cblxudmFyIHAgPSBDb2xsaXNpb25zLnByb3RvdHlwZTtcblxuLyoqXG4gKiBDb2xsaXNpb25zIGluaXRpYWxpc2F0aW9uXG4gKlxuICogQG1ldGhvZCBpbml0XG4gKi9cbnAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRnYW1lLnBoeXNpY3Muc3RhcnRTeXN0ZW0oUGhhc2VyLlBoeXNpY3MuUDJKUyk7XG5cdGdhbWUucGh5c2ljcy5wMi5zZXRJbXBhY3RFdmVudHModHJ1ZSk7XG5cdGdhbWUucGh5c2ljcy5wMi5ncmF2aXR5LnkgPSAxMDA7XG5cblx0dGhpcy5wbGF5ZXJzID0gZ2FtZS5waHlzaWNzLnAyLmNyZWF0ZUNvbGxpc2lvbkdyb3VwKCk7XG5cdHRoaXMudGVycmFpbiA9IGdhbWUucGh5c2ljcy5wMi5jcmVhdGVDb2xsaXNpb25Hcm91cCgpO1xuXHR0aGlzLmJ1bGxldHMgPSBnYW1lLnBoeXNpY3MucDIuY3JlYXRlQ29sbGlzaW9uR3JvdXAoKTtcblxuXHRnYW1lLnBoeXNpY3MucDIudXBkYXRlQm91bmRzQ29sbGlzaW9uR3JvdXAoKTtcbn07XG5cbi8qKlxuKlxuKi9cbnAuc2V0ID0gZnVuY3Rpb24oc3ByaXRlLCBjb2xsaXNpb25Hcm91cHMpIHtcblx0c3ByaXRlLmJvZHkuY29sbGlkZXMoY29sbGlzaW9uR3JvdXBzKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBDb2xsaXNpb25zO1xuIiwiLyoqXG4gKiBBIHByaXZhdGUgdmFyIGRlc2NyaXB0aW9uXG4gKlxuICogQHByb3BlcnR5IG15UHJpdmF0ZVZhclxuICogQHR5cGUge251bWJlcn1cbiAqIEBwcml2YXRlXG4gKi9cbnZhciBteVByaXZhdGVWYXIgPSAwO1xuXG4vKipcbiAqIEdyb3VwcyBkZXNjcmlwdGlvblxuICogY2FsbHMgaW5pdFxuICpcbiAqIEBjbGFzcyBHcm91cHNcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBHcm91cHMgKCkge1xuXHQvKipcblx0ICogQSBwdWJsaWMgdmFyIGRlc2NyaXB0aW9uXG5cdCAqXG5cdCAqIEBwcm9wZXJ0eSBteVB1YmxpY1ZhclxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dGhpcy5teVB1YmxpY1ZhciA9IDE7XG5cdHRoaXMuaW5pdCgpO1xufVxuXG52YXIgcCA9IEdyb3Vwcy5wcm90b3R5cGU7XG5cbi8qKlxuICogR3JvdXBzIGluaXRpYWxpc2F0aW9uXG4gKlxuICogQG1ldGhvZCBpbml0XG4gKi9cbnAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmFjdG9ycyA9IGdhbWUuYWRkLmdyb3VwKCk7XG5cdHRoaXMudGVycmFpbiA9IGdhbWUuYWRkLmdyb3VwKCk7XG5cdHRoaXMuYnVsbGV0cyA9IGdhbWUuYWRkLmdyb3VwKCk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gR3JvdXBzOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBkaXN0QXRvQjogZnVuY3Rpb24ocG9pbnRBLCBwb2ludEIpIHtcblxuICAgIHZhciBBID0gcG9pbnRCLnggLSBwb2ludEEueDtcbiAgICB2YXIgQiA9IHBvaW50Qi55IC0gcG9pbnRBLnk7XG5cbiAgICByZXR1cm4gTWF0aC5zcXJ0KEEqQSArIEIqQik7XG4gIH1cbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHByb3BlcnRpZXMgPSByZXF1aXJlKCcuL3Byb3BlcnRpZXMnKTtcblxudmFyIGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUocHJvcGVydGllcy53aWR0aCxwcm9wZXJ0aWVzLmhlaWdodCwgUGhhc2VyLkFVVE8pO1xud2luZG93LmdhbWUgPSBnYW1lO1xuXG5nYW1lLnN0YXRlLmFkZCgncGxheScsIHJlcXVpcmUoJy4vc3RhdGVzL3BsYXknKSk7XG5nYW1lLnN0YXRlLmFkZCgnbG9hZCcsIHJlcXVpcmUoJy4vc3RhdGVzL2xvYWQnKSk7XG5nYW1lLnN0YXRlLmFkZCgnbWVudScsIHJlcXVpcmUoJy4vc3RhdGVzL21lbnUnKSk7XG5nYW1lLnN0YXRlLmFkZCgnYm9vdCcsIHJlcXVpcmUoJy4vc3RhdGVzL2Jvb3QnKSk7XG5cbi8vZ2FtZS5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xuLy9nYW1lLnNjYWxlLnNldFNjcmVlblNpemUoKTtcblxuZ2FtZS5zdGF0ZS5zdGFydCgnYm9vdCcpO1xuIiwiOyB2YXIgX19icm93c2VyaWZ5X3NoaW1fcmVxdWlyZV9fPXJlcXVpcmU7KGZ1bmN0aW9uIGJyb3dzZXJpZnlTaGltKG1vZHVsZSwgZXhwb3J0cywgcmVxdWlyZSwgZGVmaW5lLCBicm93c2VyaWZ5X3NoaW1fX2RlZmluZV9fbW9kdWxlX19leHBvcnRfXykge1xuLy8gc3RhdHMuanMgLSBodHRwOi8vZ2l0aHViLmNvbS9tcmRvb2Ivc3RhdHMuanNcbnZhciBTdGF0cz1mdW5jdGlvbigpe3ZhciBsPURhdGUubm93KCksbT1sLGc9MCxuPUluZmluaXR5LG89MCxoPTAscD1JbmZpbml0eSxxPTAscj0wLHM9MCxmPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7Zi5pZD1cInN0YXRzXCI7Zi5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsZnVuY3Rpb24oYil7Yi5wcmV2ZW50RGVmYXVsdCgpO3QoKytzJTIpfSwhMSk7Zi5zdHlsZS5jc3NUZXh0PVwid2lkdGg6ODBweDtvcGFjaXR5OjAuOTtjdXJzb3I6cG9pbnRlclwiO3ZhciBhPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7YS5pZD1cImZwc1wiO2Euc3R5bGUuY3NzVGV4dD1cInBhZGRpbmc6MCAwIDNweCAzcHg7dGV4dC1hbGlnbjpsZWZ0O2JhY2tncm91bmQtY29sb3I6IzAwMlwiO2YuYXBwZW5kQ2hpbGQoYSk7dmFyIGk9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtpLmlkPVwiZnBzVGV4dFwiO2kuc3R5bGUuY3NzVGV4dD1cImNvbG9yOiMwZmY7Zm9udC1mYW1pbHk6SGVsdmV0aWNhLEFyaWFsLHNhbnMtc2VyaWY7Zm9udC1zaXplOjlweDtmb250LXdlaWdodDpib2xkO2xpbmUtaGVpZ2h0OjE1cHhcIjtcbmkuaW5uZXJIVE1MPVwiRlBTXCI7YS5hcHBlbmRDaGlsZChpKTt2YXIgYz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2MuaWQ9XCJmcHNHcmFwaFwiO2Muc3R5bGUuY3NzVGV4dD1cInBvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOjc0cHg7aGVpZ2h0OjMwcHg7YmFja2dyb3VuZC1jb2xvcjojMGZmXCI7Zm9yKGEuYXBwZW5kQ2hpbGQoYyk7NzQ+Yy5jaGlsZHJlbi5sZW5ndGg7KXt2YXIgaj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtqLnN0eWxlLmNzc1RleHQ9XCJ3aWR0aDoxcHg7aGVpZ2h0OjMwcHg7ZmxvYXQ6bGVmdDtiYWNrZ3JvdW5kLWNvbG9yOiMxMTNcIjtjLmFwcGVuZENoaWxkKGopfXZhciBkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7ZC5pZD1cIm1zXCI7ZC5zdHlsZS5jc3NUZXh0PVwicGFkZGluZzowIDAgM3B4IDNweDt0ZXh0LWFsaWduOmxlZnQ7YmFja2dyb3VuZC1jb2xvcjojMDIwO2Rpc3BsYXk6bm9uZVwiO2YuYXBwZW5kQ2hpbGQoZCk7dmFyIGs9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbmsuaWQ9XCJtc1RleHRcIjtrLnN0eWxlLmNzc1RleHQ9XCJjb2xvcjojMGYwO2ZvbnQtZmFtaWx5OkhlbHZldGljYSxBcmlhbCxzYW5zLXNlcmlmO2ZvbnQtc2l6ZTo5cHg7Zm9udC13ZWlnaHQ6Ym9sZDtsaW5lLWhlaWdodDoxNXB4XCI7ay5pbm5lckhUTUw9XCJNU1wiO2QuYXBwZW5kQ2hpbGQoayk7dmFyIGU9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtlLmlkPVwibXNHcmFwaFwiO2Uuc3R5bGUuY3NzVGV4dD1cInBvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOjc0cHg7aGVpZ2h0OjMwcHg7YmFja2dyb3VuZC1jb2xvcjojMGYwXCI7Zm9yKGQuYXBwZW5kQ2hpbGQoZSk7NzQ+ZS5jaGlsZHJlbi5sZW5ndGg7KWo9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIiksai5zdHlsZS5jc3NUZXh0PVwid2lkdGg6MXB4O2hlaWdodDozMHB4O2Zsb2F0OmxlZnQ7YmFja2dyb3VuZC1jb2xvcjojMTMxXCIsZS5hcHBlbmRDaGlsZChqKTt2YXIgdD1mdW5jdGlvbihiKXtzPWI7c3dpdGNoKHMpe2Nhc2UgMDphLnN0eWxlLmRpc3BsYXk9XG5cImJsb2NrXCI7ZC5zdHlsZS5kaXNwbGF5PVwibm9uZVwiO2JyZWFrO2Nhc2UgMTphLnN0eWxlLmRpc3BsYXk9XCJub25lXCIsZC5zdHlsZS5kaXNwbGF5PVwiYmxvY2tcIn19O3JldHVybntSRVZJU0lPTjoxMixkb21FbGVtZW50OmYsc2V0TW9kZTp0LGJlZ2luOmZ1bmN0aW9uKCl7bD1EYXRlLm5vdygpfSxlbmQ6ZnVuY3Rpb24oKXt2YXIgYj1EYXRlLm5vdygpO2c9Yi1sO249TWF0aC5taW4obixnKTtvPU1hdGgubWF4KG8sZyk7ay50ZXh0Q29udGVudD1nK1wiIE1TIChcIituK1wiLVwiK28rXCIpXCI7dmFyIGE9TWF0aC5taW4oMzAsMzAtMzAqKGcvMjAwKSk7ZS5hcHBlbmRDaGlsZChlLmZpcnN0Q2hpbGQpLnN0eWxlLmhlaWdodD1hK1wicHhcIjtyKys7Yj5tKzFFMyYmKGg9TWF0aC5yb3VuZCgxRTMqci8oYi1tKSkscD1NYXRoLm1pbihwLGgpLHE9TWF0aC5tYXgocSxoKSxpLnRleHRDb250ZW50PWgrXCIgRlBTIChcIitwK1wiLVwiK3ErXCIpXCIsYT1NYXRoLm1pbigzMCwzMC0zMCooaC8xMDApKSxjLmFwcGVuZENoaWxkKGMuZmlyc3RDaGlsZCkuc3R5bGUuaGVpZ2h0PVxuYStcInB4XCIsbT1iLHI9MCk7cmV0dXJuIGJ9LHVwZGF0ZTpmdW5jdGlvbigpe2w9dGhpcy5lbmQoKX19fTtcIm9iamVjdFwiPT09dHlwZW9mIG1vZHVsZSYmKG1vZHVsZS5leHBvcnRzPVN0YXRzKTtcblxuOyBicm93c2VyaWZ5X3NoaW1fX2RlZmluZV9fbW9kdWxlX19leHBvcnRfXyh0eXBlb2YgU3RhdHMgIT0gXCJ1bmRlZmluZWRcIiA/IFN0YXRzIDogd2luZG93LlN0YXRzKTtcblxufSkuY2FsbChnbG9iYWwsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZnVuY3Rpb24gZGVmaW5lRXhwb3J0KGV4KSB7IG1vZHVsZS5leHBvcnRzID0gZXg7IH0pO1xuIiwiLyoqXG4gKiBEZWZpbmVzIGJ1aWxkIHNldHRpbmdzIGZvciB0aGUgdGhydXN0LWVuZ2luZVxuICpcbiAqIEBuYW1lc3BhY2UgdGhydXN0LWVuZ2luZVxuICogQG1vZHVsZSBwcm9wZXJ0aWVzXG4gKiBAY2xhc3NcbiAqIEBzdGF0aWNcbiAqIEB0eXBlIHt7ZW5hYmxlSm95cGFkOiBib29sZWFuLCBmYXRhbENvbGxpc2lvbnM6IGJvb2xlYW4sIHNjYWxlOiB7bW9kZTogbnVtYmVyfSwgZHJhd1N0YXRzOiBib29sZWFufX1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGRlYnVnUGh5c2ljczogZmFsc2UsXG5cdGNvbGxpZGVXb3JsZEJvdW5kczogdHJ1ZSxcblx0ZW5hYmxlSm95cGFkOiBmYWxzZSxcblx0ZmF0YWxDb2xsaXNpb25zOiB0cnVlLFxuXHRzY2FsZToge1xuXHRcdG1vZGU6IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTExcblx0fSxcblx0ZHJhd1N0YXRzOiBmYWxzZSxcblx0ZHJhd01vbnRhaW5zOiBmYWxzZSxcblx0d2lkdGg6IDcwMCxcblx0aGVpZ2h0OiA1MDAsXG5cdGdhbWVQbGF5OiB7XG5cdFx0ZnJlZU9yYkxvY2tpbmc6IGZhbHNlLFxuXHRcdGF1dG9PcmJMb2NraW5nOiB0cnVlLFxuXHRcdHRyYWN0b3JCZWFtTGVuZ3RoOiA4MCxcblx0XHR0cmFjdG9yQmVhbVZhcmlhdGlvbjogMTAsXG5cdFx0bG9ja2luZ0R1cmF0aW9uOiA5MDBcblx0fVxufTtcbiIsInZhciBTdGF0cyA9IHJlcXVpcmUoJ1N0YXRzJyk7XG52YXIgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL3Byb3BlcnRpZXMnKTtcbnZhciBmZWF0dXJlcyA9IHJlcXVpcmUoJy4uL3V0aWxzL2ZlYXR1cmVzJyk7XG5cbi8qKlxuICogVGhlIGJvb3Qgc3RhdGVcbiAqXG4gKiBAbmFtZXNwYWNlIHN0YXRlc1xuICogQG1vZHVsZSBib290XG4gKiBAdHlwZSB7e2NyZWF0ZTogRnVuY3Rpb24sIHVwZGF0ZTogRnVuY3Rpb259fVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cHJlbG9hZDogZnVuY3Rpb24oKSB7XG5cdFx0Ly9nYW1lLmxvYWQuc2NyaXB0KCdqb3lzdGljaycsICdqYXZhc2NyaXB0cy9icm93c2VyaWZ5L3BoYXNlci12aXJ0dWFsLWpveXN0aWNrLm1pbi5qcycpO1xuXHRcdGdhbWUuc2NhbGUuc2NhbGVNb2RlID0gcHJvcGVydGllcy5zY2FsZS5tb2RlO1xuXHRcdGdhbWUuc2NhbGUuc2V0U2NyZWVuU2l6ZSgpO1xuXHR9LFxuXG5cdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHByb3BlcnRpZXMuZHJhd1N0YXRzKSB7XG5cdFx0XHR3aW5kb3cuc3RhdHMgPSBuZXcgU3RhdHMoKTtcblx0XHRcdHN0YXRzLnNldE1vZGUoMCk7XG5cdFx0XHRzdGF0cy5kb21FbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcblx0XHRcdHN0YXRzLmRvbUVsZW1lbnQuc3R5bGUubGVmdCA9ICcwcHgnO1xuXHRcdFx0c3RhdHMuZG9tRWxlbWVudC5zdHlsZS50b3AgPSAnMHB4JztcblxuXHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggc3RhdHMuZG9tRWxlbWVudCApO1xuXG5cdFx0XHRzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHN0YXRzLmJlZ2luKCk7XG5cdFx0XHRcdHN0YXRzLmVuZCgpO1xuXHRcdFx0fSwgMTAwMCAvIDYwKTtcblx0XHR9XG5cblx0XHRmZWF0dXJlcy5pbml0KCk7XG5cblx0XHRjb25zb2xlLndhcm4oXCJJbnN0cnVjdGlvbnM6IFVzZSBDdXJzb3JzIHRvIG1vdmUgc2hpcCwgc3BhY2UgdG8gc2hvb3QsIGNvbGxlY3Qgb3JiIGJ5IHBhc3NpbmcgbmVhclwiKTtcblx0XHRjb25zb2xlLndhcm4oXCJUb3VjaFNjcmVlbkRldGVjdGVkOlwiLCBmZWF0dXJlcy5pc1RvdWNoU2NyZWVuKTtcblxuXHRcdGdhbWUuc3RhdGUuc3RhcnQoJ3BsYXknKTtcblxuXHR9LFxuXHR1cGRhdGU6IGZ1bmN0aW9uKCkge1xuXG5cdH1cbn07XG4iLCIvKipcbiAqIFRoZSBsb2FkIHN0YXRlXG4gKlxuICogQG5hbWVzcGFjZSBzdGF0ZXNcbiAqIEBtb2R1bGUgbG9hZFxuICogQHR5cGUge3tjcmVhdGU6IEZ1bmN0aW9uLCB1cGRhdGU6IEZ1bmN0aW9ufX1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cblx0fSxcblx0dXBkYXRlOiBmdW5jdGlvbigpIHtcblxuXHR9XG59OyIsIi8qKlxuICogVGhlIG1lbnUgc3RhdGVcbiAqXG4gKiBAbmFtZXNwYWNlIHN0YXRlc1xuICogQG1vZHVsZSBtZW51XG4gKiBAdHlwZSB7e2NyZWF0ZTogRnVuY3Rpb24sIHVwZGF0ZTogRnVuY3Rpb259fVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblxuXHR9LFxuXHR1cGRhdGU6IGZ1bmN0aW9uKCkge1xuXG5cdH1cbn07IiwiLy9pbXBvcnRzXG52YXIgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL3Byb3BlcnRpZXMnKTtcbnZhciBDb2xsaXNpb25zID0gcmVxdWlyZSgnLi4vZW52aXJvbm1lbnQvQ29sbGlzaW9ucycpO1xudmFyIEdyb3VwcyA9IHJlcXVpcmUoJy4uL2Vudmlyb25tZW50L0dyb3VwcycpO1xudmFyIFBsYXllciA9IHJlcXVpcmUoJy4uL2FjdG9ycy9QbGF5ZXInKTtcbnZhciBPcmIgPSByZXF1aXJlKCcuLi9hY3RvcnMvT3JiJyk7XG52YXIgTWFwID0gcmVxdWlyZSgnLi4vYWN0b3JzL01hcCcpO1xudmFyIEJhY2tncm91bmQgPSByZXF1aXJlKCcuLi9hY3RvcnMvQmFja2dyb3VuZCcpO1xudmFyIFRyYWN0b3JCZWFtID0gcmVxdWlyZSgnLi4vYWN0b3JzL1RyYWN0b3JCZWFtJyk7XG52YXIgZmVhdHVyZXMgPSByZXF1aXJlKCcuLi91dGlscy9mZWF0dXJlcycpO1xuXG4vL3ByaXZhdGVzXG52YXIgZ2FtZSA9IHdpbmRvdy5nYW1lO1xudmFyIHBsYXllcjtcbnZhciBvcmI7XG52YXIgdHJhY3RvckJlYW07XG52YXIgY3Vyc29ycztcbnZhciBncm91bmQ7XG52YXIgYWN0b3JzO1xudmFyIHRlcnJhaW47XG52YXIgbWFwO1xudmFyIGJhY2tncm91bmQ7XG5cbi8vY29udHJvbHM7XG52YXIgcGFkO1xudmFyIGJ1dHRvbkE7XG52YXIgYnV0dG9uQjtcbnZhciBidXR0b25BRG93biA9IGZhbHNlO1xudmFyIGJ1dHRvbkJEb3duID0gZmFsc2U7XG52YXIgaXNYRG93biAgICAgPSBmYWxzZTtcbnZhciBqb3lwYWQgPSBwcm9wZXJ0aWVzLmVuYWJsZUpveXBhZDtcblxuLy9tb2R1bGVzXG52YXIgY29sbGlzaW9ucztcbnZhciBncm91cHM7XG5cbi8qKlxuICogVGhlIHBsYXkgc3RhdGUgLSB0aGlzIGlzIHdoZXJlIHRoZSBtYWdpYyBoYXBwZW5zXG4gKlxuICogQG5hbWVzcGFjZSBzdGF0ZXNcbiAqIEBtb2R1bGUgcGxheVxuICogQHR5cGUge3tjcmVhdGU6IEZ1bmN0aW9uLCB1cGRhdGU6IEZ1bmN0aW9ufX1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cblx0cHJlbG9hZDogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKGZlYXR1cmVzLmlzVG91Y2hTY3JlZW4pIHtcblx0XHRcdGpveXBhZCA9IHRydWU7XG5cdFx0fVxuXG5cdFx0Z2FtZS5sb2FkLmltYWdlKCd0aHJ1c3RtYXAnLCAnaW1hZ2VzL3RocnVzdC1sZXZlbDIucG5nJyk7XG5cdFx0Z2FtZS5sb2FkLnBoeXNpY3MoJ3BoeXNpY3NEYXRhJywgJ2ltYWdlcy90aHJ1c3QtbGV2ZWwyLmpzb24nKTtcblx0XHRnYW1lLmxvYWQuaW1hZ2UoJ3N0YXJzJywgJ2ltYWdlcy9zdGFyZmllbGQucG5nJyk7XG5cdFx0aWYgKGpveXBhZCkge1xuXHRcdFx0Z2FtZS5sb2FkLmF0bGFzKCdkcGFkJywgJ2ltYWdlcy92aXJ0dWFsam95c3RpY2svc2tpbnMvZHBhZC5wbmcnLCAnaW1hZ2VzL3ZpcnR1YWxqb3lzdGljay9za2lucy9kcGFkLmpzb24nKTtcblx0XHR9XG5cdH0sXG5cblx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRnYW1lLndvcmxkLnNldEJvdW5kcygwLCAwLCA5MjgsIDEyODApO1xuXG5cdFx0Z3JvdXBzID0gbmV3IEdyb3VwcygpO1xuXHRcdGNvbGxpc2lvbnMgPSBuZXcgQ29sbGlzaW9ucygpO1xuXHRcdGJhY2tncm91bmQgPSBuZXcgQmFja2dyb3VuZCgpO1xuXHRcdHBsYXllciA9IG5ldyBQbGF5ZXIoY29sbGlzaW9ucywgZ3JvdXBzKTtcblx0XHRvcmIgPSBuZXcgT3JiKGNvbGxpc2lvbnMpO1xuXHRcdG1hcCA9IG5ldyBNYXAoY29sbGlzaW9ucyk7XG5cdFx0dHJhY3RvckJlYW0gPSBuZXcgVHJhY3RvckJlYW0ob3JiKTtcblx0XHRwbGF5ZXIudHJhY3RvckJlYW0gPSB0cmFjdG9yQmVhbTtcblxuXHRcdGNvbGxpc2lvbnMuc2V0KG9yYiwgW2NvbGxpc2lvbnMucGxheWVycywgY29sbGlzaW9ucy50ZXJyYWluLCBjb2xsaXNpb25zLmJ1bGxldHNdKTtcblx0XHRjb2xsaXNpb25zLnNldChtYXAsIFtjb2xsaXNpb25zLnBsYXllcnMsIGNvbGxpc2lvbnMudGVycmFpbiwgY29sbGlzaW9ucy5idWxsZXRzXSk7XG5cblx0XHRncm91cHMudGVycmFpbi5hZGQoYmFja2dyb3VuZC5zcHJpdGUpO1xuXHRcdGlmIChiYWNrZ3JvdW5kLm1vdW50YWlucykgZ3JvdXBzLnRlcnJhaW4uYWRkKGJhY2tncm91bmQubW91bnRhaW5zKTtcblx0XHRncm91cHMuYWN0b3JzLmFkZChwbGF5ZXIuc3ByaXRlKTtcblx0XHRncm91cHMuYWN0b3JzLmFkZChvcmIuc3ByaXRlKTtcblx0XHRnYW1lLndvcmxkLnN3YXAoZ3JvdXBzLnRlcnJhaW4sIGdyb3Vwcy5hY3RvcnMpO1xuXHRcdGdhbWUuY2FtZXJhLmZvbGxvdyhwbGF5ZXIuc3ByaXRlKTtcblxuXHRcdGlmIChqb3lwYWQpIHtcblx0XHRcdHBhZCA9IGdhbWUucGx1Z2lucy5hZGQoUGhhc2VyLlZpcnR1YWxKb3lzdGljayk7XG5cdFx0XHR0aGlzLnN0aWNrID0gcGFkLmFkZERQYWQoMCwgMCwgMjAwLCAnZHBhZCcpO1xuXHRcdFx0dGhpcy5zdGljay5hbGlnbkJvdHRvbUxlZnQoKTtcblxuXHRcdFx0YnV0dG9uQSA9IHBhZC5hZGRCdXR0b24oNTE1LCAzMzAsICdkcGFkJywgJ2J1dHRvbjEtdXAnLCAnYnV0dG9uMS1kb3duJyk7XG5cdFx0XHRidXR0b25BLm9uRG93bi5hZGQodGhpcy5wcmVzc0J1dHRvbkEsIHRoaXMpO1xuXHRcdFx0YnV0dG9uQS5vblVwLmFkZCh0aGlzLnVwQnV0dG9uQSwgdGhpcyk7XG5cblx0XHRcdGJ1dHRvbkIgPSBwYWQuYWRkQnV0dG9uKDYyMCwgMjkwLCAnZHBhZCcsICdidXR0b24yLXVwJywgJ2J1dHRvbjItZG93bicpO1xuXHRcdFx0YnV0dG9uQi5vbkRvd24uYWRkKHRoaXMucHJlc3NCdXR0b25CLCB0aGlzKTtcblx0XHRcdGJ1dHRvbkIub25VcC5hZGQodGhpcy51cEJ1dHRvbkIsIHRoaXMpO1xuXHRcdH1cblxuXHRcdGN1cnNvcnMgXHRcdFx0ID0gZ2FtZS5pbnB1dC5rZXlib2FyZC5jcmVhdGVDdXJzb3JLZXlzKCk7XG5cdFx0dmFyIHNwYWNlUHJlc3MgPSBnYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuU1BBQ0VCQVIpO1xuXHRcdHZhciB4S2V5XHQgICAgID0gZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLlgpO1xuXHRcdHNwYWNlUHJlc3Mub25Eb3duLmFkZChwbGF5ZXIuc2hvb3QsIHBsYXllcik7XG5cdFx0eEtleS5vbkRvd24uYWRkKHRoaXMueERvd24sIHRoaXMpO1xuXHRcdHhLZXkub25VcC5hZGQodGhpcy54VXAsIHRoaXMpO1xuXHR9LFxuXHR1cGRhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdGlmIChjdXJzb3JzLmxlZnQuaXNEb3duKSB7XG5cdFx0XHRwbGF5ZXIuYm9keS5yb3RhdGVMZWZ0KDEwMCk7XG5cdFx0fSBlbHNlIGlmIChjdXJzb3JzLnJpZ2h0LmlzRG93bikge1xuXHRcdFx0cGxheWVyLmJvZHkucm90YXRlUmlnaHQoMTAwKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cGxheWVyLmJvZHkuc2V0WmVyb1JvdGF0aW9uKCk7XG5cdFx0fVxuXHRcdGlmIChjdXJzb3JzLnVwLmlzRG93biB8fCBidXR0b25BRG93bil7XG5cdFx0XHRwbGF5ZXIuYm9keS50aHJ1c3QoNDAwKTtcblx0XHR9XG5cdFx0aWYgKCF0cmFjdG9yQmVhbS5oYXNHcmFiYmVkKSB7XG5cdFx0XHRpZiAoaXNYRG93biB8fCBwcm9wZXJ0aWVzLmdhbWVQbGF5LmF1dG9PcmJMb2NraW5nKSB7XG5cdFx0XHRcdHBsYXllci5jaGVja09yYkRpc3RhbmNlKCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRyYWN0b3JCZWFtLmRyYXdCZWFtKHBsYXllci5zcHJpdGUucG9zaXRpb24pO1xuXHRcdH1cblx0XHRpZiAoam95cGFkKSB7XG5cdFx0XHRpZiAodGhpcy5zdGljay5pc0Rvd24pIHtcblx0XHRcdFx0aWYgKHRoaXMuc3RpY2suZGlyZWN0aW9uID09PSBQaGFzZXIuTEVGVCkge1xuXHRcdFx0XHRcdHBsYXllci5ib2R5LnJvdGF0ZUxlZnQoMTAwKTtcblx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLnN0aWNrLmRpcmVjdGlvbiA9PT0gUGhhc2VyLlJJR0hUKSB7XG5cdFx0XHRcdFx0cGxheWVyLmJvZHkucm90YXRlUmlnaHQoMTAwKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHQvL2dhbWUud29ybGQud3JhcChwbGF5ZXIuYm9keSwgMCwgZmFsc2UpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0Z2FtZS5kZWJ1Zy5jYW1lcmFJbmZvKGdhbWUuY2FtZXJhLCA1MDAsIDIwKTtcblx0fSxcblxuXHRwcmVzc0J1dHRvbkE6IGZ1bmN0aW9uKCkge1xuXHRcdGJ1dHRvbkFEb3duID0gdHJ1ZTtcblx0fSxcblxuXHR1cEJ1dHRvbkE6IGZ1bmN0aW9uKCkge1xuXHRcdGJ1dHRvbkFEb3duID0gZmFsc2U7XG5cdH0sXG5cblx0cHJlc3NCdXR0b25COiBmdW5jdGlvbigpIHtcblx0XHRidXR0b25CRG93biA9IHRydWU7XG5cdFx0cGxheWVyLnNob290KCk7XG5cdH0sXG5cblx0dXBCdXR0b25COiBmdW5jdGlvbigpIHtcblx0XHRidXR0b25CRG93biA9IGZhbHNlO1xuXHR9LFxuXG5cdHhEb3duOiBmdW5jdGlvbiAoKSB7XG5cdFx0aXNYRG93biA9IHRydWU7XG5cdH0sXG5cblx0eFVwOiBmdW5jdGlvbigpIHtcblx0XHRpc1hEb3duID0gZmFsc2U7XG5cdFx0aWYgKCFwcm9wZXJ0aWVzLmdhbWVQbGF5LmF1dG9PcmJMb2NraW5nKSB7XG5cdFx0XHR0aGlzLnJlbGVhc2VUcmFjdG9yQmVhbSgpO1xuXHRcdH1cblx0fVxufTtcbiIsIi8qXG5mdW5jdGlvbiBpc1RvdWNoRGV2aWNlKCl7XG4gICAgcmV0dXJuIHRydWUgPT0gKFwib250b3VjaHN0YXJ0XCIgaW4gd2luZG93IHx8IHdpbmRvdy5Eb2N1bWVudFRvdWNoICYmIGRvY3VtZW50IGluc3RhbmNlb2YgRG9jdW1lbnRUb3VjaCk7XG59XG5Ob3cgY2hlY2tpbmcgaWYg4oCYaXNUb3VjaERldmljZSgpO+KAmSBpcyByZXR1cm5zIHRydWUgaXQgbWVhbnMgaXRzIGEgdG91Y2ggZGV2aWNlLlxuXG5pZihpc1RvdWNoRGV2aWNlKCk9PT10cnVlKSB7XG4gICAgYWxlcnQoJ1RvdWNoIERldmljZScpOyAvL3lvdXIgbG9naWMgZm9yIHRvdWNoIGRldmljZVxufVxuZWxzZSB7XG4gICAgYWxlcnQoJ05vdCBhIFRvdWNoIERldmljZScpOyAvL3lvdXIgbG9naWMgZm9yIG5vbiB0b3VjaCBkZXZpY2Vcbn1cbiovXG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmlzVG91Y2hTY3JlZW4gPSAoKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdylcbiAgICAgICAgfHwgKG5hdmlnYXRvci5NYXhUb3VjaFBvaW50cyA+IDApXG4gICAgICAgIHx8IChuYXZpZ2F0b3IubXNNYXhUb3VjaFBvaW50cyA+IDApKTtcbiAgICBjb25zb2xlLmxvZyhcInRvdWNoU2NyZWVuOlwiLCB0aGlzLmlzVG91Y2hTY3JlZW4pO1xuICB9LFxuICBpc1RvdWNoU2NyZWVuOiB0aGlzLmlzVG91Y2hTY3JlZW5cbn1cbiJdfQ==
