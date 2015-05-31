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
	this.sprite = game.make.sprite(300, 670, bmd);
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
	this.body.mass = 0.55;
	this.body.fixedRotation = true;
};


module.exports = Orb;

},{"../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Player.js":[function(require,module,exports){
var game = window.game;
var properties = require('../properties');


/**
 * Player description
 * calls init
 *
 * @param collisions {Collisions} Our collisions container of collisionGroups
 * @class Player
 * @constructor
 */
function Player(collisions) {
	/**
	 * The Collisions Object
	 *
	 * @property collisions
	 * @type {Collisions}
	 */
	this.collisions = collisions;

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
};

p.crash = function() {
	return "moo moo land";
};


module.exports = Player;

},{"../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/Collisions.js":[function(require,module,exports){
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
},{}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/Physics.js":[function(require,module,exports){
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
 * Physics description
 * calls init
 *
 * @class Physics
 * @constructor
 */
function Physics () {
	/**
	 * A public var description
	 *
	 * @property myPublicVar
	 * @type {number}
	 */
	this.myPublicVar = 1;
	this.init();
}

var p = Physics.prototype;

/**
 * Physics initialisation
 *
 * @method init
 */
p.init = function() {
	game.physics.startSystem(Phaser.Physics.P2JS);
	game.physics.p2.setImpactEvents(true);
	game.physics.p2.gravity.y = 100;
};


module.exports = Physics;
},{}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/game.js":[function(require,module,exports){
"use strict";

var game = new Phaser.Game(700,500, Phaser.AUTO);
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
	freeOrbLocking: false,
	enableJoypad: true,
	fatalCollisions: true,
	scale: {
		mode: Phaser.ScaleManager.SHOW_ALL
	},
	drawStats: false,
	drawMontains: false
};

},{}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/states/boot.js":[function(require,module,exports){
var Stats = require('Stats');
var properties = require('../properties');

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

		game.state.start('play');

	},
	update: function() {

	}
};
},{"../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js","Stats":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/libs/stats.js/stats.min.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/states/load.js":[function(require,module,exports){
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
var Physics = require('../environment/Physics');
var Collisions = require('../environment/Collisions');
var Groups = require('../environment/Groups');
var Player = require('../actors/Player');
var Orb = require('../actors/Orb');
var Map = require('../actors/Map');
var Background = require('../actors/Background');

//privates
var game = window.game;
/**
 * Prevent fatal collisions by setting this value to false in properties
 *
 * @property fatalCollisions
 * @type {boolean}
 */
var fatalCollisions = properties.fatalCollisions;
var player;
var orb;
var cursors;
var ground;
var graphics;
var actors;
var terrain;
var stars;
var bulletBitmap;
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
var physics;
var collisions;
var groups;

//tractorBeam
var tractorBeam;
var beamGfx;
var tractorBeamTimer;
var isTractorBeamActive = false;
var orbLockEnabled = false;
var isOrbLocked = false;
var tractorBeamLength = 80;


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
		if (joypad) {
			pad = game.plugins.add(Phaser.VirtualJoystick);
			this.stick = pad.addDPad(0, 0, 200, 'dpad');
			this.stick.alignBottomLeft();

			buttonA = pad.addButton(505, 420, 'dpad', 'button1-up', 'button1-down');
			buttonA.onDown.add(this.pressButtonA, this);
			buttonA.onUp.add(this.upButtonA, this);

			buttonB = pad.addButton(615, 370, 'dpad', 'button2-up', 'button2-down');
			buttonB.onDown.add(this.pressButtonB, this);
			buttonB.onUp.add(this.upButtonB, this);
		}

		game.world.setBounds(0, 0, 928, 1280);

		physics = new Physics();
		groups = new Groups();
		collisions = new Collisions();
		background = new Background();
		player = new Player(collisions);
		orb = new Orb(collisions);
		map = new Map(collisions);

		collisions.set(orb, [collisions.players, collisions.terrain, collisions.bullets]);
		collisions.set(map, [collisions.players, collisions.terrain, collisions.bullets]);
		player.body.collides(collisions.terrain, this.crash, this);

		beamGfx = new Phaser.Graphics(game, 0,0);
		tractorBeam = game.add.sprite(0,0);
		tractorBeam.addChild(beamGfx);

		groups.terrain.add(background.sprite);
		if (background.mountains) groups.terrain.add(background.mountains);
		groups.actors.add(player.sprite);
		groups.actors.add(orb.sprite);

		game.world.swap(groups.terrain, groups.actors);

		bulletBitmap = game.make.bitmapData(5,5);
		bulletBitmap.ctx.fillStyle = '#ffffff';
		bulletBitmap.ctx.beginPath();
		bulletBitmap.ctx.arc(1.0,1.0,2, 0, Math.PI*2, true);
		bulletBitmap.ctx.closePath();
		bulletBitmap.ctx.fill();

		game.camera.follow(player.sprite);

		cursors 			 = game.input.keyboard.createCursorKeys();
		var spacePress = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		var xKey	     = game.input.keyboard.addKey(Phaser.Keyboard.X);
		var cKey       = game.input.keyboard.addKey(Phaser.Keyboard.C);
		spacePress.onDown.add(this.fire, this);
		cKey.onDown.add(this.lockOrb, this);
		xKey.onDown.add(this.xDown, this);
		xKey.onUp.add(this.xUp, this);

		tractorBeamTimer = game.time.create(false);

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
		if (isXDown || buttonADown) {
			this.checkDistance();
		}

		if (isOrbLocked) {
			this.drawTractorBeam();
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

		game.world.wrap(player.body, 0, false);
	},

	fire: function() {
		var magnitue = 240;
		var bullet = game.make.sprite(player.sprite.position.x, player.sprite.position.y, bulletBitmap);
		bullet.anchor.setTo(0.5,0.5);
		game.physics.p2.enable(bullet);
		var angle = player.body.rotation + (3 * Math.PI) / 2;
		bullet.body.collidesWorldBounds = false;
		bullet.body.setCollisionGroup(collisions.bullets);
		bullet.body.collides(collisions.terrain, this.bulletDeath, this);
		bullet.body.data.gravityScale = 0;
		bullet.body.velocity.x = magnitue * Math.cos(angle) + player.body.velocity.x;
		bullet.body.velocity.y = magnitue * Math.sin(angle) + player.body.velocity.y;
		groups.bullets.add(bullet);
	},

	enableOrbLock: function() {
		orbLockEnabled = true;
	},

	releaseTractorBeam: function() {
		orbLockEnabled = false;
		isTractorBeamActive = false;
		beamGfx.clear();
		tractorBeamTimer.stop(true);
	},

	drawTractorBeam: function() {
		beamGfx.clear();
		var colour = isOrbLocked? 0xEF5696 : 0x00ff00;
		var alpha = isOrbLocked? 0.5 : 0.5;
		beamGfx.lineStyle(5, colour, alpha);
		beamGfx.moveTo(player.sprite.position.x, player.sprite.position.y);
		beamGfx.lineTo(orb.sprite.position.x, orb.sprite.position.y);
	},

	checkDistance: function() {
		var distance = this.distAtoB(player.sprite.position, orb.sprite.position);
		if (distance < tractorBeamLength) {
			this.drawTractorBeam();
			if (!isTractorBeamActive) {
				isTractorBeamActive = true;
				tractorBeamTimer.start();
				tractorBeamTimer.add(1500, this.enableOrbLock);
			}
		} else if (distance >= tractorBeamLength && distance < tractorBeamLength + 10) {
			if (orbLockEnabled) {
				this.lockOrb();
			}
		} else {
			if (isTractorBeamActive) {
				this.releaseTractorBeam();
			}
		}

	},

	lockOrb: function() {
		if (isOrbLocked) {
			return;
		}
		var maxForce = 20000;
		var beamSpr = game.add.sprite(orb.sprite.x, orb.sprite.y);
		game.physics.p2.enable(beamSpr, properties.debugPhysics);
		var diffX = player.sprite.position.x - orb.sprite.position.x;
		var diffY = player.sprite.position.y - orb.sprite.position.y;
		beamSpr.body.collideWorldBounds = properties.collideWorldBounds;
		beamSpr.body.mass = 0.5;
		beamSpr.body.clearShapes();
		game.physics.p2.createRevoluteConstraint(beamSpr, [0, 0], orb.sprite, [0,0], maxForce);
		game.physics.p2.createRevoluteConstraint(beamSpr, [diffX,diffY], player.sprite, [0,0], maxForce);
		orb.move();
		isOrbLocked = true;

	},

	render: function() {
		game.debug.cameraInfo(game.camera, 500, 20);
	},

	crash: function(playerBody) {
		if (fatalCollisions) {
			console.log('die!', player.crash());
		}
	},

	bulletDeath: function(bulletBody) {
		bulletBody.sprite.kill();
		groups.bullets.remove(bulletBody.sprite);
	},

	pressButtonA: function() {
		buttonADown = true;
	},

	upButtonA: function() {
		buttonADown = false;
	},

	pressButtonB: function() {
		buttonBDown = true;
	},

	upButtonB: function() {
		buttonBDown = false;
	},

	xDown: function () {
		isXDown = true;
	},

	xUp: function() {
		isXDown = false;
		this.releaseTractorBeam();
	},

	distAtoB: function(pointA, pointB) {

		var A = pointB.x - pointA.x;
		var B = pointB.y - pointA.y;

		return Math.sqrt(A*A + B*B);

	}
};

},{"../actors/Background":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Background.js","../actors/Map":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Map.js","../actors/Orb":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Orb.js","../actors/Player":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Player.js","../environment/Collisions":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/Collisions.js","../environment/Groups":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/Groups.js","../environment/Physics":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/Physics.js","../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js"}]},{},["/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/game.js"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYWN0b3JzL0JhY2tncm91bmQuanMiLCJzcmMvYWN0b3JzL01hcC5qcyIsInNyYy9hY3RvcnMvT3JiLmpzIiwic3JjL2FjdG9ycy9QbGF5ZXIuanMiLCJzcmMvZW52aXJvbm1lbnQvQ29sbGlzaW9ucy5qcyIsInNyYy9lbnZpcm9ubWVudC9Hcm91cHMuanMiLCJzcmMvZW52aXJvbm1lbnQvUGh5c2ljcy5qcyIsInNyYy9nYW1lLmpzIiwic3JjL2xpYnMvc3RhdHMuanMvc3RhdHMubWluLmpzIiwic3JjL3Byb3BlcnRpZXMuanMiLCJzcmMvc3RhdGVzL2Jvb3QuanMiLCJzcmMvc3RhdGVzL2xvYWQuanMiLCJzcmMvc3RhdGVzL21lbnUuanMiLCJzcmMvc3RhdGVzL3BsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBwcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vcHJvcGVydGllcycpO1xuXG4vKipcbiAqXG4gKlxuICogQHR5cGUge1BoYXNlci5HcmFwaGljc31cbiAqL1xudmFyIGdyYXBoaWNzO1xuXG4vKipcbiAqIEJhY2tncm91bmQgZGVzY3JpcHRpb25cbiAqXG4gKiBkZWZpbmVzIGEgcHVibGljIHZhcmlhYmxlIGFuZCBjYWxscyBpbml0IC0gY2hhbmdlIHRoaXMgY29uc3RydWN0b3IgdG8gc3VpdCB5b3VyIG5lZWRzLlxuICogbmIuIHRoZXJlJ3Mgbm8gcmVxdWlyZW1lbnQgdG8gY2FsbCBhbiBpbml0IGZ1bmN0aW9uXG4gKlxuICogQGNsYXNzIEJhY2tncm91bmRcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBCYWNrZ3JvdW5kKCkge1xuXHR0aGlzLnNwcml0ZSA9IGdhbWUubWFrZS50aWxlU3ByaXRlKDAsIDAsIDkyOCwgNjAwLCAnc3RhcnMnKTtcblx0dGhpcy5pbml0KCk7XG59XG5cbnZhciBwID0gQmFja2dyb3VuZC5wcm90b3R5cGU7XG5cbi8qKlxuICogQmFja2dyb3VuZCBpbml0aWFsaXNhdGlvblxuICpcbiAqIEBtZXRob2QgaW5pdFxuICovXG5wLmluaXQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5zdGFycyA9IHRoaXMuc3ByaXRlO1xuXG5cdGlmIChwcm9wZXJ0aWVzLmRyYXdNb3VudGFpbnMpIHtcblx0XHR0aGlzLm1vdW50YWlucyA9IGdhbWUuYWRkLnNwcml0ZSgwLCA3MDApO1xuXHRcdGdyYXBoaWNzID0gbmV3IFBoYXNlci5HcmFwaGljcyhnYW1lLCAwLDApO1xuXHRcdGdyYXBoaWNzLmxpbmVTdHlsZSgyLCAweGZmZmZmZiwgMC43KTtcblx0XHR2YXIgZ3JvdW5kV2lkdGggPSAyMDAwO1xuXHRcdHZhciBwZWFrVyA9IDIwMDtcblx0XHR2YXIgcGVha0ggPSAxMDA7XG5cdFx0dmFyIHVwID0gdHJ1ZTtcblx0XHR2YXIgaTtcblx0XHRmb3IgKGkgPSAwOyBpIDwgZ3JvdW5kV2lkdGg7IGkrKykge1xuXHRcdFx0aWYgKGkgJSBwZWFrVyA9PT0gMCkge1xuXHRcdFx0XHRncmFwaGljcy5saW5lVG8oIHBlYWtXICsgaSwgdXA/IC1NYXRoLnJhbmRvbSgpICogcGVha0ggOiAwICk7XG5cdFx0XHRcdHVwID0gIXVwO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLm1vdW50YWlucy5hZGRDaGlsZChncmFwaGljcyk7XG5cdH1cblxuXG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2dyb3VuZDsiLCJ2YXIgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL3Byb3BlcnRpZXMnKTtcbnZhciBnYW1lID0gd2luZG93LmdhbWU7XG5cbi8qKlxuICogQSBwcml2YXRlIHZhciBkZXNjcmlwdGlvblxuICpcbiAqIEBwcm9wZXJ0eSBteVByaXZhdGVWYXJcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKiBAcHJpdmF0ZVxuICovXG52YXIgbXlQcml2YXRlVmFyID0gMDtcblxuLyoqXG4gKiBNYXAgZGVzY3JpcHRpb25cbiAqXG4gKiBkZWZpbmVzIGEgcHVibGljIHZhcmlhYmxlIGFuZCBjYWxscyBpbml0IC0gY2hhbmdlIHRoaXMgY29uc3RydWN0b3IgdG8gc3VpdCB5b3VyIG5lZWRzLlxuICogbmIuIHRoZXJlJ3Mgbm8gcmVxdWlyZW1lbnQgdG8gY2FsbCBhbiBpbml0IGZ1bmN0aW9uXG4gKlxuICogQGNsYXNzIE1hcFxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIE1hcChjb2xsaXNpb25zKSB7XG5cdHRoaXMuY29sbGlzaW9ucyA9IGNvbGxpc2lvbnM7XG5cblx0dGhpcy5zcHJpdGUgPSBnYW1lLmFkZC5zcHJpdGUoMCwwLCAndGhydXN0bWFwJyk7XG5cblx0dGhpcy5pbml0KCk7XG59XG5cbnZhciBwID0gTWFwLnByb3RvdHlwZTtcblxuLyoqXG4gKiBNYXAgaW5pdGlhbGlzYXRpb25cbiAqXG4gKiBAbWV0aG9kIGluaXRcbiAqL1xucC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuc3ByaXRlLnBvc2l0aW9uLnNldFRvKHRoaXMuc3ByaXRlLndpZHRoLzIsIDk3MCk7XG5cblx0Z2FtZS5waHlzaWNzLnAyLmVuYWJsZSh0aGlzLnNwcml0ZSwgcHJvcGVydGllcy5kZWJ1Z1BoeXNpY3MpO1xuXG5cdHRoaXMuYm9keSA9IHRoaXMuc3ByaXRlLmJvZHk7XG5cblx0dGhpcy5ib2R5LnN0YXRpYyA9IHRydWU7XG5cblx0dGhpcy5ib2R5LmNsZWFyU2hhcGVzKCk7XG5cdHRoaXMuYm9keS5sb2FkUG9seWdvbigncGh5c2ljc0RhdGEnLCAndGhydXN0bWFwJyk7XG5cblx0dGhpcy5ib2R5LnNldENvbGxpc2lvbkdyb3VwKHRoaXMuY29sbGlzaW9ucy50ZXJyYWluKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBNYXA7XG4iLCJ2YXIgZ2FtZSA9IHdpbmRvdy5nYW1lO1xudmFyIHByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9wcm9wZXJ0aWVzJyk7XG4vKipcbiAqIEEgcHJpdmF0ZSB2YXIgZGVzY3JpcHRpb25cbiAqXG4gKiBAcHJvcGVydHkgbXlQcml2YXRlVmFyXG4gKiBAdHlwZSB7bnVtYmVyfVxuICogQHByaXZhdGVcbiAqL1xudmFyIG15UHJpdmF0ZVZhciA9IDA7XG5cbi8qKlxuICogT3JiIGRlc2NyaXB0aW9uXG4gKiBjYWxscyBpbml0XG4gKlxuICogQGNsYXNzIE9yYlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIE9yYiAoY29sbGlzaW9ucykge1xuXHQvKipcblx0ICogQSBjb2xsaXNpb25zIGNvbnRhaW5lclxuXHQgKlxuXHQgKiBAcHJvcGVydHkgY29sbGlzaW9uc1xuXHQgKiBAdHlwZSB7Q29sbGlzaW9uc31cblx0ICovXG5cdHRoaXMuY29sbGlzaW9ucyA9IGNvbGxpc2lvbnM7XG5cblx0dmFyIGJtZCA9IGdhbWUubWFrZS5iaXRtYXBEYXRhKDIyLDIyKTtcblx0Ym1kLmN0eC5zdHJva2VTdHlsZSA9ICcjOTk5OTk5Jztcblx0Ym1kLmN0eC5saW5lV2lkdGggPSAyO1xuXHRibWQuY3R4LmJlZ2luUGF0aCgpO1xuXHRibWQuY3R4LmFyYygxMSwgMTEsIDEwLCAwLCBNYXRoLlBJKjIsIHRydWUpO1xuXHRibWQuY3R4LmNsb3NlUGF0aCgpO1xuXHRibWQuY3R4LnN0cm9rZSgpO1xuXHQvKipcblx0ICogQHByb3BlcnR5IHNwcml0ZVxuXHQgKi9cblx0dGhpcy5zcHJpdGUgPSBnYW1lLm1ha2Uuc3ByaXRlKDMwMCwgNjcwLCBibWQpO1xuXHR0aGlzLnNwcml0ZS5hbmNob3Iuc2V0VG8oMC41LDAuNSk7XG5cblx0dGhpcy5pbml0KCk7XG59XG5cbnZhciBwID0gT3JiLnByb3RvdHlwZTtcblxuLyoqXG4gKiBPcmIgaW5pdGlhbGlzYXRpb25cbiAqXG4gKiBAbWV0aG9kIGluaXRcbiAqL1xucC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cblx0Z2FtZS5waHlzaWNzLnAyLmVuYWJsZSh0aGlzLnNwcml0ZSwgcHJvcGVydGllcy5kZWJ1Z1BoeXNpY3MpO1xuXG5cdC8vbW90aW9uU3RhdGUgPSAxOyAvL2ZvciBkeW5hbWljXG5cdC8vbW90aW9uU3RhdGUgPSAyOyAvL2ZvciBzdGF0aWNcblx0Ly9tb3Rpb25TdGF0ZSA9IDQ7IC8vZm9yIGtpbmVtYXRpY1xuXG5cdHRoaXMuYm9keSA9IHRoaXMuc3ByaXRlLmJvZHk7XG5cblx0dGhpcy5ib2R5Lm1vdGlvblN0YXRlID0gMjtcblxuXHR0aGlzLmJvZHkuc2V0Q29sbGlzaW9uR3JvdXAodGhpcy5jb2xsaXNpb25zLnRlcnJhaW4pO1xuXG5cdHRoaXMuYm9keS5jb2xsaWRlV29ybGRCb3VuZHMgPSBwcm9wZXJ0aWVzLmNvbGxpZGVXb3JsZEJvdW5kcztcblxuXHQvL3RoaXMuYm9keS5jb2xsaWRlcyh0aGlzLmNvbGxpc2lvbnMuYnVsbGV0cywgdGhpcy5tb3ZlLCB0aGlzKVxufTtcblxucC5tb3ZlID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuYm9keS5tb3Rpb25TdGF0ZSA9IDE7XG5cdHRoaXMuYm9keS5tYXNzID0gMC41NTtcblx0dGhpcy5ib2R5LmZpeGVkUm90YXRpb24gPSB0cnVlO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IE9yYjtcbiIsInZhciBnYW1lID0gd2luZG93LmdhbWU7XG52YXIgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL3Byb3BlcnRpZXMnKTtcblxuXG4vKipcbiAqIFBsYXllciBkZXNjcmlwdGlvblxuICogY2FsbHMgaW5pdFxuICpcbiAqIEBwYXJhbSBjb2xsaXNpb25zIHtDb2xsaXNpb25zfSBPdXIgY29sbGlzaW9ucyBjb250YWluZXIgb2YgY29sbGlzaW9uR3JvdXBzXG4gKiBAY2xhc3MgUGxheWVyXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gUGxheWVyKGNvbGxpc2lvbnMpIHtcblx0LyoqXG5cdCAqIFRoZSBDb2xsaXNpb25zIE9iamVjdFxuXHQgKlxuXHQgKiBAcHJvcGVydHkgY29sbGlzaW9uc1xuXHQgKiBAdHlwZSB7Q29sbGlzaW9uc31cblx0ICovXG5cdHRoaXMuY29sbGlzaW9ucyA9IGNvbGxpc2lvbnM7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgdGhlIHBsYXllciBzcHJpdGUgd2hpY2ggaXMgcmV0dXJuZWQgZm9yIGVhc3kgcmVmZXJlbmNlIGJ5IHRoZSBjb250YWluaW5nIHN0YXRlXG5cdCAqXG5cdCAqIEBwcm9wZXJ0eSBzcHJpdGVcblx0ICogQHR5cGUge1BoYXNlci5TcHJpdGV9XG5cdCAqL1xuXHR0aGlzLnNwcml0ZSA9IGdhbWUubWFrZS5zcHJpdGUoZ2FtZS53b3JsZC5jZW50ZXJYLCAzMDApO1xuXG5cdHRoaXMuaW5pdCgpO1xufVxuXG52YXIgcCA9IFBsYXllci5wcm90b3R5cGU7XG5cbi8qKlxuICogUGxheWVyIGluaXRpYWxpc2F0aW9uXG4gKlxuICogQG1ldGhvZCBpbml0XG4gKi9cbnAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXG5cdGdhbWUucGh5c2ljcy5wMi5lbmFibGUodGhpcy5zcHJpdGUsIHByb3BlcnRpZXMuZGVidWdQaHlzaWNzKTtcblxuXHR0aGlzLmJvZHkgPSB0aGlzLnNwcml0ZS5ib2R5O1xuXG5cdHZhciBncmFwaGljcyA9IG5ldyBQaGFzZXIuR3JhcGhpY3MoZ2FtZSwgMCwwKTtcblx0Ly9ncmFwaGljcy5iZWdpbkZpbGwoMHgwMDAwMDApO1xuXHRncmFwaGljcy5saW5lU3R5bGUoNCwweGZmZmZmZik7XG5cdGdyYXBoaWNzLmxpbmVUbygyMCw0MCk7XG5cdGdyYXBoaWNzLmxpbmVUbygyNSw0MCk7XG5cdGdyYXBoaWNzLmFyYygwLDQwLDI1LGdhbWUubWF0aC5kZWdUb1JhZCgwKSwgZ2FtZS5tYXRoLmRlZ1RvUmFkKDE4MCksIGZhbHNlKTtcblx0Z3JhcGhpY3MubGluZVRvKC0yMCw0MCk7XG5cdGdyYXBoaWNzLmxpbmVUbygwLDApO1xuXHQvL2dyYXBoaWNzLmVuZEZpbGwoKTtcblx0dGhpcy5zcHJpdGUuYWRkQ2hpbGQoZ3JhcGhpY3MpO1xuXG5cdHRoaXMuc3ByaXRlLnNjYWxlLnNldFRvKDAuMywwLjMpO1xuXHR0aGlzLnNwcml0ZS5waXZvdC54ID0gMDtcblx0dGhpcy5zcHJpdGUucGl2b3QueSA9IDQwO1xuXG5cdHRoaXMuYm9keS5jbGVhclNoYXBlcygpO1xuXHR0aGlzLmJvZHkuYWRkUmVjdGFuZ2xlKC0xMCwtMTcsIDAsLTIpO1xuXHR0aGlzLmJvZHkuY29sbGlkZVdvcmxkQm91bmRzID0gcHJvcGVydGllcy5jb2xsaWRlV29ybGRCb3VuZHM7XG5cdHRoaXMuYm9keS5tYXNzID0gMTtcblx0dGhpcy5ib2R5LnNldENvbGxpc2lvbkdyb3VwKHRoaXMuY29sbGlzaW9ucy5wbGF5ZXJzKTtcbn07XG5cbnAuY3Jhc2ggPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIFwibW9vIG1vbyBsYW5kXCI7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyO1xuIiwidmFyIGdhbWUgPSB3aW5kb3cuZ2FtZTtcbnZhciBwcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vcHJvcGVydGllcycpO1xuXG4vKipcbiAqIEEgcHJpdmF0ZSB2YXIgZGVzY3JpcHRpb25cbiAqXG4gKiBAcHJvcGVydHkgbXlQcml2YXRlVmFyXG4gKiBAdHlwZSB7bnVtYmVyfVxuICogQHByaXZhdGVcbiAqL1xudmFyIG15UHJpdmF0ZVZhciA9IDA7XG5cbi8qKlxuICogQ29sbGlzaW9ucyBkZXNjcmlwdGlvblxuICogY2FsbHMgaW5pdFxuICpcbiAqIEBjbGFzcyBDb2xsaXNpb25zXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gQ29sbGlzaW9ucyAoY29sbGlzaW9ucykge1xuXHQvKipcblx0ICogQSBwdWJsaWMgdmFyIGRlc2NyaXB0aW9uXG5cdCAqXG5cdCAqIEBwcm9wZXJ0eSBteVB1YmxpY1ZhclxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dGhpcy5teVB1YmxpY1ZhciA9IDE7XG5cdHRoaXMuaW5pdCgpO1xufVxuXG52YXIgcCA9IENvbGxpc2lvbnMucHJvdG90eXBlO1xuXG4vKipcbiAqIENvbGxpc2lvbnMgaW5pdGlhbGlzYXRpb25cbiAqXG4gKiBAbWV0aG9kIGluaXRcbiAqL1xucC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMucGxheWVycyA9IGdhbWUucGh5c2ljcy5wMi5jcmVhdGVDb2xsaXNpb25Hcm91cCgpO1xuXHR0aGlzLnRlcnJhaW4gPSBnYW1lLnBoeXNpY3MucDIuY3JlYXRlQ29sbGlzaW9uR3JvdXAoKTtcblx0dGhpcy5idWxsZXRzID0gZ2FtZS5waHlzaWNzLnAyLmNyZWF0ZUNvbGxpc2lvbkdyb3VwKCk7XG5cblx0Z2FtZS5waHlzaWNzLnAyLnVwZGF0ZUJvdW5kc0NvbGxpc2lvbkdyb3VwKCk7XG59O1xuXG4vKipcbipcbiovXG5wLnNldCA9IGZ1bmN0aW9uKHNwcml0ZSwgY29sbGlzaW9uR3JvdXBzKSB7XG5cdHNwcml0ZS5ib2R5LmNvbGxpZGVzKGNvbGxpc2lvbkdyb3Vwcyk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29sbGlzaW9ucztcbiIsIi8qKlxuICogQSBwcml2YXRlIHZhciBkZXNjcmlwdGlvblxuICpcbiAqIEBwcm9wZXJ0eSBteVByaXZhdGVWYXJcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKiBAcHJpdmF0ZVxuICovXG52YXIgbXlQcml2YXRlVmFyID0gMDtcblxuLyoqXG4gKiBHcm91cHMgZGVzY3JpcHRpb25cbiAqIGNhbGxzIGluaXRcbiAqXG4gKiBAY2xhc3MgR3JvdXBzXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gR3JvdXBzICgpIHtcblx0LyoqXG5cdCAqIEEgcHVibGljIHZhciBkZXNjcmlwdGlvblxuXHQgKlxuXHQgKiBAcHJvcGVydHkgbXlQdWJsaWNWYXJcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHRoaXMubXlQdWJsaWNWYXIgPSAxO1xuXHR0aGlzLmluaXQoKTtcbn1cblxudmFyIHAgPSBHcm91cHMucHJvdG90eXBlO1xuXG4vKipcbiAqIEdyb3VwcyBpbml0aWFsaXNhdGlvblxuICpcbiAqIEBtZXRob2QgaW5pdFxuICovXG5wLmluaXQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5hY3RvcnMgPSBnYW1lLmFkZC5ncm91cCgpO1xuXHR0aGlzLnRlcnJhaW4gPSBnYW1lLmFkZC5ncm91cCgpO1xuXHR0aGlzLmJ1bGxldHMgPSBnYW1lLmFkZC5ncm91cCgpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEdyb3VwczsiLCJ2YXIgZ2FtZSA9IHdpbmRvdy5nYW1lO1xuXG4vKipcbiAqIEEgcHJpdmF0ZSB2YXIgZGVzY3JpcHRpb25cbiAqXG4gKiBAcHJvcGVydHkgbXlQcml2YXRlVmFyXG4gKiBAdHlwZSB7bnVtYmVyfVxuICogQHByaXZhdGVcbiAqL1xudmFyIG15UHJpdmF0ZVZhciA9IDA7XG5cbi8qKlxuICogUGh5c2ljcyBkZXNjcmlwdGlvblxuICogY2FsbHMgaW5pdFxuICpcbiAqIEBjbGFzcyBQaHlzaWNzXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gUGh5c2ljcyAoKSB7XG5cdC8qKlxuXHQgKiBBIHB1YmxpYyB2YXIgZGVzY3JpcHRpb25cblx0ICpcblx0ICogQHByb3BlcnR5IG15UHVibGljVmFyXG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR0aGlzLm15UHVibGljVmFyID0gMTtcblx0dGhpcy5pbml0KCk7XG59XG5cbnZhciBwID0gUGh5c2ljcy5wcm90b3R5cGU7XG5cbi8qKlxuICogUGh5c2ljcyBpbml0aWFsaXNhdGlvblxuICpcbiAqIEBtZXRob2QgaW5pdFxuICovXG5wLmluaXQgPSBmdW5jdGlvbigpIHtcblx0Z2FtZS5waHlzaWNzLnN0YXJ0U3lzdGVtKFBoYXNlci5QaHlzaWNzLlAySlMpO1xuXHRnYW1lLnBoeXNpY3MucDIuc2V0SW1wYWN0RXZlbnRzKHRydWUpO1xuXHRnYW1lLnBoeXNpY3MucDIuZ3Jhdml0eS55ID0gMTAwO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFBoeXNpY3M7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBnYW1lID0gbmV3IFBoYXNlci5HYW1lKDcwMCw1MDAsIFBoYXNlci5BVVRPKTtcbndpbmRvdy5nYW1lID0gZ2FtZTtcblxuZ2FtZS5zdGF0ZS5hZGQoJ3BsYXknLCByZXF1aXJlKCcuL3N0YXRlcy9wbGF5JykpO1xuZ2FtZS5zdGF0ZS5hZGQoJ2xvYWQnLCByZXF1aXJlKCcuL3N0YXRlcy9sb2FkJykpO1xuZ2FtZS5zdGF0ZS5hZGQoJ21lbnUnLCByZXF1aXJlKCcuL3N0YXRlcy9tZW51JykpO1xuZ2FtZS5zdGF0ZS5hZGQoJ2Jvb3QnLCByZXF1aXJlKCcuL3N0YXRlcy9ib290JykpO1xuXG4vL2dhbWUuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTDtcbi8vZ2FtZS5zY2FsZS5zZXRTY3JlZW5TaXplKCk7XG5cbmdhbWUuc3RhdGUuc3RhcnQoJ2Jvb3QnKTsiLCI7IHZhciBfX2Jyb3dzZXJpZnlfc2hpbV9yZXF1aXJlX189cmVxdWlyZTsoZnVuY3Rpb24gYnJvd3NlcmlmeVNoaW0obW9kdWxlLCBleHBvcnRzLCByZXF1aXJlLCBkZWZpbmUsIGJyb3dzZXJpZnlfc2hpbV9fZGVmaW5lX19tb2R1bGVfX2V4cG9ydF9fKSB7XG4vLyBzdGF0cy5qcyAtIGh0dHA6Ly9naXRodWIuY29tL21yZG9vYi9zdGF0cy5qc1xudmFyIFN0YXRzPWZ1bmN0aW9uKCl7dmFyIGw9RGF0ZS5ub3coKSxtPWwsZz0wLG49SW5maW5pdHksbz0wLGg9MCxwPUluZmluaXR5LHE9MCxyPTAscz0wLGY9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtmLmlkPVwic3RhdHNcIjtmLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIixmdW5jdGlvbihiKXtiLnByZXZlbnREZWZhdWx0KCk7dCgrK3MlMil9LCExKTtmLnN0eWxlLmNzc1RleHQ9XCJ3aWR0aDo4MHB4O29wYWNpdHk6MC45O2N1cnNvcjpwb2ludGVyXCI7dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTthLmlkPVwiZnBzXCI7YS5zdHlsZS5jc3NUZXh0PVwicGFkZGluZzowIDAgM3B4IDNweDt0ZXh0LWFsaWduOmxlZnQ7YmFja2dyb3VuZC1jb2xvcjojMDAyXCI7Zi5hcHBlbmRDaGlsZChhKTt2YXIgaT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2kuaWQ9XCJmcHNUZXh0XCI7aS5zdHlsZS5jc3NUZXh0PVwiY29sb3I6IzBmZjtmb250LWZhbWlseTpIZWx2ZXRpY2EsQXJpYWwsc2Fucy1zZXJpZjtmb250LXNpemU6OXB4O2ZvbnQtd2VpZ2h0OmJvbGQ7bGluZS1oZWlnaHQ6MTVweFwiO1xuaS5pbm5lckhUTUw9XCJGUFNcIjthLmFwcGVuZENoaWxkKGkpO3ZhciBjPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7Yy5pZD1cImZwc0dyYXBoXCI7Yy5zdHlsZS5jc3NUZXh0PVwicG9zaXRpb246cmVsYXRpdmU7d2lkdGg6NzRweDtoZWlnaHQ6MzBweDtiYWNrZ3JvdW5kLWNvbG9yOiMwZmZcIjtmb3IoYS5hcHBlbmRDaGlsZChjKTs3ND5jLmNoaWxkcmVuLmxlbmd0aDspe3ZhciBqPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO2ouc3R5bGUuY3NzVGV4dD1cIndpZHRoOjFweDtoZWlnaHQ6MzBweDtmbG9hdDpsZWZ0O2JhY2tncm91bmQtY29sb3I6IzExM1wiO2MuYXBwZW5kQ2hpbGQoail9dmFyIGQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtkLmlkPVwibXNcIjtkLnN0eWxlLmNzc1RleHQ9XCJwYWRkaW5nOjAgMCAzcHggM3B4O3RleHQtYWxpZ246bGVmdDtiYWNrZ3JvdW5kLWNvbG9yOiMwMjA7ZGlzcGxheTpub25lXCI7Zi5hcHBlbmRDaGlsZChkKTt2YXIgaz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuay5pZD1cIm1zVGV4dFwiO2suc3R5bGUuY3NzVGV4dD1cImNvbG9yOiMwZjA7Zm9udC1mYW1pbHk6SGVsdmV0aWNhLEFyaWFsLHNhbnMtc2VyaWY7Zm9udC1zaXplOjlweDtmb250LXdlaWdodDpib2xkO2xpbmUtaGVpZ2h0OjE1cHhcIjtrLmlubmVySFRNTD1cIk1TXCI7ZC5hcHBlbmRDaGlsZChrKTt2YXIgZT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2UuaWQ9XCJtc0dyYXBoXCI7ZS5zdHlsZS5jc3NUZXh0PVwicG9zaXRpb246cmVsYXRpdmU7d2lkdGg6NzRweDtoZWlnaHQ6MzBweDtiYWNrZ3JvdW5kLWNvbG9yOiMwZjBcIjtmb3IoZC5hcHBlbmRDaGlsZChlKTs3ND5lLmNoaWxkcmVuLmxlbmd0aDspaj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKSxqLnN0eWxlLmNzc1RleHQ9XCJ3aWR0aDoxcHg7aGVpZ2h0OjMwcHg7ZmxvYXQ6bGVmdDtiYWNrZ3JvdW5kLWNvbG9yOiMxMzFcIixlLmFwcGVuZENoaWxkKGopO3ZhciB0PWZ1bmN0aW9uKGIpe3M9Yjtzd2l0Y2gocyl7Y2FzZSAwOmEuc3R5bGUuZGlzcGxheT1cblwiYmxvY2tcIjtkLnN0eWxlLmRpc3BsYXk9XCJub25lXCI7YnJlYWs7Y2FzZSAxOmEuc3R5bGUuZGlzcGxheT1cIm5vbmVcIixkLnN0eWxlLmRpc3BsYXk9XCJibG9ja1wifX07cmV0dXJue1JFVklTSU9OOjEyLGRvbUVsZW1lbnQ6ZixzZXRNb2RlOnQsYmVnaW46ZnVuY3Rpb24oKXtsPURhdGUubm93KCl9LGVuZDpmdW5jdGlvbigpe3ZhciBiPURhdGUubm93KCk7Zz1iLWw7bj1NYXRoLm1pbihuLGcpO289TWF0aC5tYXgobyxnKTtrLnRleHRDb250ZW50PWcrXCIgTVMgKFwiK24rXCItXCIrbytcIilcIjt2YXIgYT1NYXRoLm1pbigzMCwzMC0zMCooZy8yMDApKTtlLmFwcGVuZENoaWxkKGUuZmlyc3RDaGlsZCkuc3R5bGUuaGVpZ2h0PWErXCJweFwiO3IrKztiPm0rMUUzJiYoaD1NYXRoLnJvdW5kKDFFMypyLyhiLW0pKSxwPU1hdGgubWluKHAsaCkscT1NYXRoLm1heChxLGgpLGkudGV4dENvbnRlbnQ9aCtcIiBGUFMgKFwiK3ArXCItXCIrcStcIilcIixhPU1hdGgubWluKDMwLDMwLTMwKihoLzEwMCkpLGMuYXBwZW5kQ2hpbGQoYy5maXJzdENoaWxkKS5zdHlsZS5oZWlnaHQ9XG5hK1wicHhcIixtPWIscj0wKTtyZXR1cm4gYn0sdXBkYXRlOmZ1bmN0aW9uKCl7bD10aGlzLmVuZCgpfX19O1wib2JqZWN0XCI9PT10eXBlb2YgbW9kdWxlJiYobW9kdWxlLmV4cG9ydHM9U3RhdHMpO1xuXG47IGJyb3dzZXJpZnlfc2hpbV9fZGVmaW5lX19tb2R1bGVfX2V4cG9ydF9fKHR5cGVvZiBTdGF0cyAhPSBcInVuZGVmaW5lZFwiID8gU3RhdHMgOiB3aW5kb3cuU3RhdHMpO1xuXG59KS5jYWxsKGdsb2JhbCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBmdW5jdGlvbiBkZWZpbmVFeHBvcnQoZXgpIHsgbW9kdWxlLmV4cG9ydHMgPSBleDsgfSk7XG4iLCIvKipcbiAqIERlZmluZXMgYnVpbGQgc2V0dGluZ3MgZm9yIHRoZSB0aHJ1c3QtZW5naW5lXG4gKlxuICogQG5hbWVzcGFjZSB0aHJ1c3QtZW5naW5lXG4gKiBAbW9kdWxlIHByb3BlcnRpZXNcbiAqIEBjbGFzc1xuICogQHN0YXRpY1xuICogQHR5cGUge3tlbmFibGVKb3lwYWQ6IGJvb2xlYW4sIGZhdGFsQ29sbGlzaW9uczogYm9vbGVhbiwgc2NhbGU6IHttb2RlOiBudW1iZXJ9LCBkcmF3U3RhdHM6IGJvb2xlYW59fVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0ZGVidWdQaHlzaWNzOiBmYWxzZSxcblx0Y29sbGlkZVdvcmxkQm91bmRzOiB0cnVlLFxuXHRmcmVlT3JiTG9ja2luZzogZmFsc2UsXG5cdGVuYWJsZUpveXBhZDogdHJ1ZSxcblx0ZmF0YWxDb2xsaXNpb25zOiB0cnVlLFxuXHRzY2FsZToge1xuXHRcdG1vZGU6IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTExcblx0fSxcblx0ZHJhd1N0YXRzOiBmYWxzZSxcblx0ZHJhd01vbnRhaW5zOiBmYWxzZVxufTtcbiIsInZhciBTdGF0cyA9IHJlcXVpcmUoJ1N0YXRzJyk7XG52YXIgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL3Byb3BlcnRpZXMnKTtcblxuLyoqXG4gKiBUaGUgYm9vdCBzdGF0ZVxuICpcbiAqIEBuYW1lc3BhY2Ugc3RhdGVzXG4gKiBAbW9kdWxlIGJvb3RcbiAqIEB0eXBlIHt7Y3JlYXRlOiBGdW5jdGlvbiwgdXBkYXRlOiBGdW5jdGlvbn19XG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRwcmVsb2FkOiBmdW5jdGlvbigpIHtcblx0XHQvL2dhbWUubG9hZC5zY3JpcHQoJ2pveXN0aWNrJywgJ2phdmFzY3JpcHRzL2Jyb3dzZXJpZnkvcGhhc2VyLXZpcnR1YWwtam95c3RpY2subWluLmpzJyk7XG5cdFx0Z2FtZS5zY2FsZS5zY2FsZU1vZGUgPSBwcm9wZXJ0aWVzLnNjYWxlLm1vZGU7XG5cdFx0Z2FtZS5zY2FsZS5zZXRTY3JlZW5TaXplKCk7XG5cdH0sXG5cblx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRpZiAocHJvcGVydGllcy5kcmF3U3RhdHMpIHtcblx0XHRcdHdpbmRvdy5zdGF0cyA9IG5ldyBTdGF0cygpO1xuXHRcdFx0c3RhdHMuc2V0TW9kZSgwKTtcblx0XHRcdHN0YXRzLmRvbUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuXHRcdFx0c3RhdHMuZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gJzBweCc7XG5cdFx0XHRzdGF0cy5kb21FbGVtZW50LnN0eWxlLnRvcCA9ICcwcHgnO1xuXG5cdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBzdGF0cy5kb21FbGVtZW50ICk7XG5cblx0XHRcdHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0c3RhdHMuYmVnaW4oKTtcblx0XHRcdFx0c3RhdHMuZW5kKCk7XG5cdFx0XHR9LCAxMDAwIC8gNjApO1xuXHRcdH1cblxuXHRcdGdhbWUuc3RhdGUuc3RhcnQoJ3BsYXknKTtcblxuXHR9LFxuXHR1cGRhdGU6IGZ1bmN0aW9uKCkge1xuXG5cdH1cbn07IiwiLyoqXG4gKiBUaGUgbG9hZCBzdGF0ZVxuICpcbiAqIEBuYW1lc3BhY2Ugc3RhdGVzXG4gKiBAbW9kdWxlIGxvYWRcbiAqIEB0eXBlIHt7Y3JlYXRlOiBGdW5jdGlvbiwgdXBkYXRlOiBGdW5jdGlvbn19XG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXG5cdH0sXG5cdHVwZGF0ZTogZnVuY3Rpb24oKSB7XG5cblx0fVxufTsiLCIvKipcbiAqIFRoZSBtZW51IHN0YXRlXG4gKlxuICogQG5hbWVzcGFjZSBzdGF0ZXNcbiAqIEBtb2R1bGUgbWVudVxuICogQHR5cGUge3tjcmVhdGU6IEZ1bmN0aW9uLCB1cGRhdGU6IEZ1bmN0aW9ufX1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cblx0fSxcblx0dXBkYXRlOiBmdW5jdGlvbigpIHtcblxuXHR9XG59OyIsIi8vaW1wb3J0c1xudmFyIHByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9wcm9wZXJ0aWVzJyk7XG52YXIgUGh5c2ljcyA9IHJlcXVpcmUoJy4uL2Vudmlyb25tZW50L1BoeXNpY3MnKTtcbnZhciBDb2xsaXNpb25zID0gcmVxdWlyZSgnLi4vZW52aXJvbm1lbnQvQ29sbGlzaW9ucycpO1xudmFyIEdyb3VwcyA9IHJlcXVpcmUoJy4uL2Vudmlyb25tZW50L0dyb3VwcycpO1xudmFyIFBsYXllciA9IHJlcXVpcmUoJy4uL2FjdG9ycy9QbGF5ZXInKTtcbnZhciBPcmIgPSByZXF1aXJlKCcuLi9hY3RvcnMvT3JiJyk7XG52YXIgTWFwID0gcmVxdWlyZSgnLi4vYWN0b3JzL01hcCcpO1xudmFyIEJhY2tncm91bmQgPSByZXF1aXJlKCcuLi9hY3RvcnMvQmFja2dyb3VuZCcpO1xuXG4vL3ByaXZhdGVzXG52YXIgZ2FtZSA9IHdpbmRvdy5nYW1lO1xuLyoqXG4gKiBQcmV2ZW50IGZhdGFsIGNvbGxpc2lvbnMgYnkgc2V0dGluZyB0aGlzIHZhbHVlIHRvIGZhbHNlIGluIHByb3BlcnRpZXNcbiAqXG4gKiBAcHJvcGVydHkgZmF0YWxDb2xsaXNpb25zXG4gKiBAdHlwZSB7Ym9vbGVhbn1cbiAqL1xudmFyIGZhdGFsQ29sbGlzaW9ucyA9IHByb3BlcnRpZXMuZmF0YWxDb2xsaXNpb25zO1xudmFyIHBsYXllcjtcbnZhciBvcmI7XG52YXIgY3Vyc29ycztcbnZhciBncm91bmQ7XG52YXIgZ3JhcGhpY3M7XG52YXIgYWN0b3JzO1xudmFyIHRlcnJhaW47XG52YXIgc3RhcnM7XG52YXIgYnVsbGV0Qml0bWFwO1xudmFyIG1hcDtcbnZhciBiYWNrZ3JvdW5kO1xuXG4vL2NvbnRyb2xzO1xudmFyIHBhZDtcbnZhciBidXR0b25BO1xudmFyIGJ1dHRvbkI7XG52YXIgYnV0dG9uQURvd24gPSBmYWxzZTtcbnZhciBidXR0b25CRG93biA9IGZhbHNlO1xudmFyIGlzWERvd24gICAgID0gZmFsc2U7XG52YXIgam95cGFkID0gcHJvcGVydGllcy5lbmFibGVKb3lwYWQ7XG5cbi8vbW9kdWxlc1xudmFyIHBoeXNpY3M7XG52YXIgY29sbGlzaW9ucztcbnZhciBncm91cHM7XG5cbi8vdHJhY3RvckJlYW1cbnZhciB0cmFjdG9yQmVhbTtcbnZhciBiZWFtR2Z4O1xudmFyIHRyYWN0b3JCZWFtVGltZXI7XG52YXIgaXNUcmFjdG9yQmVhbUFjdGl2ZSA9IGZhbHNlO1xudmFyIG9yYkxvY2tFbmFibGVkID0gZmFsc2U7XG52YXIgaXNPcmJMb2NrZWQgPSBmYWxzZTtcbnZhciB0cmFjdG9yQmVhbUxlbmd0aCA9IDgwO1xuXG5cbi8qKlxuICogVGhlIHBsYXkgc3RhdGUgLSB0aGlzIGlzIHdoZXJlIHRoZSBtYWdpYyBoYXBwZW5zXG4gKlxuICogQG5hbWVzcGFjZSBzdGF0ZXNcbiAqIEBtb2R1bGUgcGxheVxuICogQHR5cGUge3tjcmVhdGU6IEZ1bmN0aW9uLCB1cGRhdGU6IEZ1bmN0aW9ufX1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cblx0cHJlbG9hZDogZnVuY3Rpb24oKSB7XG5cdFx0Z2FtZS5sb2FkLmltYWdlKCd0aHJ1c3RtYXAnLCAnaW1hZ2VzL3RocnVzdC1sZXZlbDIucG5nJyk7XG5cdFx0Z2FtZS5sb2FkLnBoeXNpY3MoJ3BoeXNpY3NEYXRhJywgJ2ltYWdlcy90aHJ1c3QtbGV2ZWwyLmpzb24nKTtcblx0XHRnYW1lLmxvYWQuaW1hZ2UoJ3N0YXJzJywgJ2ltYWdlcy9zdGFyZmllbGQucG5nJyk7XG5cdFx0aWYgKGpveXBhZCkge1xuXHRcdFx0Z2FtZS5sb2FkLmF0bGFzKCdkcGFkJywgJ2ltYWdlcy92aXJ0dWFsam95c3RpY2svc2tpbnMvZHBhZC5wbmcnLCAnaW1hZ2VzL3ZpcnR1YWxqb3lzdGljay9za2lucy9kcGFkLmpzb24nKTtcblx0XHR9XG5cdH0sXG5cblx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRpZiAoam95cGFkKSB7XG5cdFx0XHRwYWQgPSBnYW1lLnBsdWdpbnMuYWRkKFBoYXNlci5WaXJ0dWFsSm95c3RpY2spO1xuXHRcdFx0dGhpcy5zdGljayA9IHBhZC5hZGREUGFkKDAsIDAsIDIwMCwgJ2RwYWQnKTtcblx0XHRcdHRoaXMuc3RpY2suYWxpZ25Cb3R0b21MZWZ0KCk7XG5cblx0XHRcdGJ1dHRvbkEgPSBwYWQuYWRkQnV0dG9uKDUwNSwgNDIwLCAnZHBhZCcsICdidXR0b24xLXVwJywgJ2J1dHRvbjEtZG93bicpO1xuXHRcdFx0YnV0dG9uQS5vbkRvd24uYWRkKHRoaXMucHJlc3NCdXR0b25BLCB0aGlzKTtcblx0XHRcdGJ1dHRvbkEub25VcC5hZGQodGhpcy51cEJ1dHRvbkEsIHRoaXMpO1xuXG5cdFx0XHRidXR0b25CID0gcGFkLmFkZEJ1dHRvbig2MTUsIDM3MCwgJ2RwYWQnLCAnYnV0dG9uMi11cCcsICdidXR0b24yLWRvd24nKTtcblx0XHRcdGJ1dHRvbkIub25Eb3duLmFkZCh0aGlzLnByZXNzQnV0dG9uQiwgdGhpcyk7XG5cdFx0XHRidXR0b25CLm9uVXAuYWRkKHRoaXMudXBCdXR0b25CLCB0aGlzKTtcblx0XHR9XG5cblx0XHRnYW1lLndvcmxkLnNldEJvdW5kcygwLCAwLCA5MjgsIDEyODApO1xuXG5cdFx0cGh5c2ljcyA9IG5ldyBQaHlzaWNzKCk7XG5cdFx0Z3JvdXBzID0gbmV3IEdyb3VwcygpO1xuXHRcdGNvbGxpc2lvbnMgPSBuZXcgQ29sbGlzaW9ucygpO1xuXHRcdGJhY2tncm91bmQgPSBuZXcgQmFja2dyb3VuZCgpO1xuXHRcdHBsYXllciA9IG5ldyBQbGF5ZXIoY29sbGlzaW9ucyk7XG5cdFx0b3JiID0gbmV3IE9yYihjb2xsaXNpb25zKTtcblx0XHRtYXAgPSBuZXcgTWFwKGNvbGxpc2lvbnMpO1xuXG5cdFx0Y29sbGlzaW9ucy5zZXQob3JiLCBbY29sbGlzaW9ucy5wbGF5ZXJzLCBjb2xsaXNpb25zLnRlcnJhaW4sIGNvbGxpc2lvbnMuYnVsbGV0c10pO1xuXHRcdGNvbGxpc2lvbnMuc2V0KG1hcCwgW2NvbGxpc2lvbnMucGxheWVycywgY29sbGlzaW9ucy50ZXJyYWluLCBjb2xsaXNpb25zLmJ1bGxldHNdKTtcblx0XHRwbGF5ZXIuYm9keS5jb2xsaWRlcyhjb2xsaXNpb25zLnRlcnJhaW4sIHRoaXMuY3Jhc2gsIHRoaXMpO1xuXG5cdFx0YmVhbUdmeCA9IG5ldyBQaGFzZXIuR3JhcGhpY3MoZ2FtZSwgMCwwKTtcblx0XHR0cmFjdG9yQmVhbSA9IGdhbWUuYWRkLnNwcml0ZSgwLDApO1xuXHRcdHRyYWN0b3JCZWFtLmFkZENoaWxkKGJlYW1HZngpO1xuXG5cdFx0Z3JvdXBzLnRlcnJhaW4uYWRkKGJhY2tncm91bmQuc3ByaXRlKTtcblx0XHRpZiAoYmFja2dyb3VuZC5tb3VudGFpbnMpIGdyb3Vwcy50ZXJyYWluLmFkZChiYWNrZ3JvdW5kLm1vdW50YWlucyk7XG5cdFx0Z3JvdXBzLmFjdG9ycy5hZGQocGxheWVyLnNwcml0ZSk7XG5cdFx0Z3JvdXBzLmFjdG9ycy5hZGQob3JiLnNwcml0ZSk7XG5cblx0XHRnYW1lLndvcmxkLnN3YXAoZ3JvdXBzLnRlcnJhaW4sIGdyb3Vwcy5hY3RvcnMpO1xuXG5cdFx0YnVsbGV0Qml0bWFwID0gZ2FtZS5tYWtlLmJpdG1hcERhdGEoNSw1KTtcblx0XHRidWxsZXRCaXRtYXAuY3R4LmZpbGxTdHlsZSA9ICcjZmZmZmZmJztcblx0XHRidWxsZXRCaXRtYXAuY3R4LmJlZ2luUGF0aCgpO1xuXHRcdGJ1bGxldEJpdG1hcC5jdHguYXJjKDEuMCwxLjAsMiwgMCwgTWF0aC5QSSoyLCB0cnVlKTtcblx0XHRidWxsZXRCaXRtYXAuY3R4LmNsb3NlUGF0aCgpO1xuXHRcdGJ1bGxldEJpdG1hcC5jdHguZmlsbCgpO1xuXG5cdFx0Z2FtZS5jYW1lcmEuZm9sbG93KHBsYXllci5zcHJpdGUpO1xuXG5cdFx0Y3Vyc29ycyBcdFx0XHQgPSBnYW1lLmlucHV0LmtleWJvYXJkLmNyZWF0ZUN1cnNvcktleXMoKTtcblx0XHR2YXIgc3BhY2VQcmVzcyA9IGdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5TUEFDRUJBUik7XG5cdFx0dmFyIHhLZXlcdCAgICAgPSBnYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuWCk7XG5cdFx0dmFyIGNLZXkgICAgICAgPSBnYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuQyk7XG5cdFx0c3BhY2VQcmVzcy5vbkRvd24uYWRkKHRoaXMuZmlyZSwgdGhpcyk7XG5cdFx0Y0tleS5vbkRvd24uYWRkKHRoaXMubG9ja09yYiwgdGhpcyk7XG5cdFx0eEtleS5vbkRvd24uYWRkKHRoaXMueERvd24sIHRoaXMpO1xuXHRcdHhLZXkub25VcC5hZGQodGhpcy54VXAsIHRoaXMpO1xuXG5cdFx0dHJhY3RvckJlYW1UaW1lciA9IGdhbWUudGltZS5jcmVhdGUoZmFsc2UpO1xuXG5cdH0sXG5cdHVwZGF0ZTogZnVuY3Rpb24oKSB7XG5cblx0XHRpZiAoY3Vyc29ycy5sZWZ0LmlzRG93bikge1xuXHRcdFx0cGxheWVyLmJvZHkucm90YXRlTGVmdCgxMDApO1xuXHRcdH0gZWxzZSBpZiAoY3Vyc29ycy5yaWdodC5pc0Rvd24pIHtcblx0XHRcdHBsYXllci5ib2R5LnJvdGF0ZVJpZ2h0KDEwMCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBsYXllci5ib2R5LnNldFplcm9Sb3RhdGlvbigpO1xuXHRcdH1cblx0XHRpZiAoY3Vyc29ycy51cC5pc0Rvd24gfHwgYnV0dG9uQURvd24pe1xuXHRcdFx0cGxheWVyLmJvZHkudGhydXN0KDQwMCk7XG5cdFx0fVxuXHRcdGlmIChpc1hEb3duIHx8IGJ1dHRvbkFEb3duKSB7XG5cdFx0XHR0aGlzLmNoZWNrRGlzdGFuY2UoKTtcblx0XHR9XG5cblx0XHRpZiAoaXNPcmJMb2NrZWQpIHtcblx0XHRcdHRoaXMuZHJhd1RyYWN0b3JCZWFtKCk7XG5cdFx0fVxuXG5cblxuXHRcdGlmIChqb3lwYWQpIHtcblx0XHRcdGlmICh0aGlzLnN0aWNrLmlzRG93bikge1xuXHRcdFx0XHRpZiAodGhpcy5zdGljay5kaXJlY3Rpb24gPT09IFBoYXNlci5MRUZUKSB7XG5cdFx0XHRcdFx0cGxheWVyLmJvZHkucm90YXRlTGVmdCgxMDApO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMuc3RpY2suZGlyZWN0aW9uID09PSBQaGFzZXIuUklHSFQpIHtcblx0XHRcdFx0XHRwbGF5ZXIuYm9keS5yb3RhdGVSaWdodCgxMDApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRnYW1lLndvcmxkLndyYXAocGxheWVyLmJvZHksIDAsIGZhbHNlKTtcblx0fSxcblxuXHRmaXJlOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgbWFnbml0dWUgPSAyNDA7XG5cdFx0dmFyIGJ1bGxldCA9IGdhbWUubWFrZS5zcHJpdGUocGxheWVyLnNwcml0ZS5wb3NpdGlvbi54LCBwbGF5ZXIuc3ByaXRlLnBvc2l0aW9uLnksIGJ1bGxldEJpdG1hcCk7XG5cdFx0YnVsbGV0LmFuY2hvci5zZXRUbygwLjUsMC41KTtcblx0XHRnYW1lLnBoeXNpY3MucDIuZW5hYmxlKGJ1bGxldCk7XG5cdFx0dmFyIGFuZ2xlID0gcGxheWVyLmJvZHkucm90YXRpb24gKyAoMyAqIE1hdGguUEkpIC8gMjtcblx0XHRidWxsZXQuYm9keS5jb2xsaWRlc1dvcmxkQm91bmRzID0gZmFsc2U7XG5cdFx0YnVsbGV0LmJvZHkuc2V0Q29sbGlzaW9uR3JvdXAoY29sbGlzaW9ucy5idWxsZXRzKTtcblx0XHRidWxsZXQuYm9keS5jb2xsaWRlcyhjb2xsaXNpb25zLnRlcnJhaW4sIHRoaXMuYnVsbGV0RGVhdGgsIHRoaXMpO1xuXHRcdGJ1bGxldC5ib2R5LmRhdGEuZ3Jhdml0eVNjYWxlID0gMDtcblx0XHRidWxsZXQuYm9keS52ZWxvY2l0eS54ID0gbWFnbml0dWUgKiBNYXRoLmNvcyhhbmdsZSkgKyBwbGF5ZXIuYm9keS52ZWxvY2l0eS54O1xuXHRcdGJ1bGxldC5ib2R5LnZlbG9jaXR5LnkgPSBtYWduaXR1ZSAqIE1hdGguc2luKGFuZ2xlKSArIHBsYXllci5ib2R5LnZlbG9jaXR5Lnk7XG5cdFx0Z3JvdXBzLmJ1bGxldHMuYWRkKGJ1bGxldCk7XG5cdH0sXG5cblx0ZW5hYmxlT3JiTG9jazogZnVuY3Rpb24oKSB7XG5cdFx0b3JiTG9ja0VuYWJsZWQgPSB0cnVlO1xuXHR9LFxuXG5cdHJlbGVhc2VUcmFjdG9yQmVhbTogZnVuY3Rpb24oKSB7XG5cdFx0b3JiTG9ja0VuYWJsZWQgPSBmYWxzZTtcblx0XHRpc1RyYWN0b3JCZWFtQWN0aXZlID0gZmFsc2U7XG5cdFx0YmVhbUdmeC5jbGVhcigpO1xuXHRcdHRyYWN0b3JCZWFtVGltZXIuc3RvcCh0cnVlKTtcblx0fSxcblxuXHRkcmF3VHJhY3RvckJlYW06IGZ1bmN0aW9uKCkge1xuXHRcdGJlYW1HZnguY2xlYXIoKTtcblx0XHR2YXIgY29sb3VyID0gaXNPcmJMb2NrZWQ/IDB4RUY1Njk2IDogMHgwMGZmMDA7XG5cdFx0dmFyIGFscGhhID0gaXNPcmJMb2NrZWQ/IDAuNSA6IDAuNTtcblx0XHRiZWFtR2Z4LmxpbmVTdHlsZSg1LCBjb2xvdXIsIGFscGhhKTtcblx0XHRiZWFtR2Z4Lm1vdmVUbyhwbGF5ZXIuc3ByaXRlLnBvc2l0aW9uLngsIHBsYXllci5zcHJpdGUucG9zaXRpb24ueSk7XG5cdFx0YmVhbUdmeC5saW5lVG8ob3JiLnNwcml0ZS5wb3NpdGlvbi54LCBvcmIuc3ByaXRlLnBvc2l0aW9uLnkpO1xuXHR9LFxuXG5cdGNoZWNrRGlzdGFuY2U6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBkaXN0YW5jZSA9IHRoaXMuZGlzdEF0b0IocGxheWVyLnNwcml0ZS5wb3NpdGlvbiwgb3JiLnNwcml0ZS5wb3NpdGlvbik7XG5cdFx0aWYgKGRpc3RhbmNlIDwgdHJhY3RvckJlYW1MZW5ndGgpIHtcblx0XHRcdHRoaXMuZHJhd1RyYWN0b3JCZWFtKCk7XG5cdFx0XHRpZiAoIWlzVHJhY3RvckJlYW1BY3RpdmUpIHtcblx0XHRcdFx0aXNUcmFjdG9yQmVhbUFjdGl2ZSA9IHRydWU7XG5cdFx0XHRcdHRyYWN0b3JCZWFtVGltZXIuc3RhcnQoKTtcblx0XHRcdFx0dHJhY3RvckJlYW1UaW1lci5hZGQoMTUwMCwgdGhpcy5lbmFibGVPcmJMb2NrKTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKGRpc3RhbmNlID49IHRyYWN0b3JCZWFtTGVuZ3RoICYmIGRpc3RhbmNlIDwgdHJhY3RvckJlYW1MZW5ndGggKyAxMCkge1xuXHRcdFx0aWYgKG9yYkxvY2tFbmFibGVkKSB7XG5cdFx0XHRcdHRoaXMubG9ja09yYigpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoaXNUcmFjdG9yQmVhbUFjdGl2ZSkge1xuXHRcdFx0XHR0aGlzLnJlbGVhc2VUcmFjdG9yQmVhbSgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9LFxuXG5cdGxvY2tPcmI6IGZ1bmN0aW9uKCkge1xuXHRcdGlmIChpc09yYkxvY2tlZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR2YXIgbWF4Rm9yY2UgPSAyMDAwMDtcblx0XHR2YXIgYmVhbVNwciA9IGdhbWUuYWRkLnNwcml0ZShvcmIuc3ByaXRlLngsIG9yYi5zcHJpdGUueSk7XG5cdFx0Z2FtZS5waHlzaWNzLnAyLmVuYWJsZShiZWFtU3ByLCBwcm9wZXJ0aWVzLmRlYnVnUGh5c2ljcyk7XG5cdFx0dmFyIGRpZmZYID0gcGxheWVyLnNwcml0ZS5wb3NpdGlvbi54IC0gb3JiLnNwcml0ZS5wb3NpdGlvbi54O1xuXHRcdHZhciBkaWZmWSA9IHBsYXllci5zcHJpdGUucG9zaXRpb24ueSAtIG9yYi5zcHJpdGUucG9zaXRpb24ueTtcblx0XHRiZWFtU3ByLmJvZHkuY29sbGlkZVdvcmxkQm91bmRzID0gcHJvcGVydGllcy5jb2xsaWRlV29ybGRCb3VuZHM7XG5cdFx0YmVhbVNwci5ib2R5Lm1hc3MgPSAwLjU7XG5cdFx0YmVhbVNwci5ib2R5LmNsZWFyU2hhcGVzKCk7XG5cdFx0Z2FtZS5waHlzaWNzLnAyLmNyZWF0ZVJldm9sdXRlQ29uc3RyYWludChiZWFtU3ByLCBbMCwgMF0sIG9yYi5zcHJpdGUsIFswLDBdLCBtYXhGb3JjZSk7XG5cdFx0Z2FtZS5waHlzaWNzLnAyLmNyZWF0ZVJldm9sdXRlQ29uc3RyYWludChiZWFtU3ByLCBbZGlmZlgsZGlmZlldLCBwbGF5ZXIuc3ByaXRlLCBbMCwwXSwgbWF4Rm9yY2UpO1xuXHRcdG9yYi5tb3ZlKCk7XG5cdFx0aXNPcmJMb2NrZWQgPSB0cnVlO1xuXG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRnYW1lLmRlYnVnLmNhbWVyYUluZm8oZ2FtZS5jYW1lcmEsIDUwMCwgMjApO1xuXHR9LFxuXG5cdGNyYXNoOiBmdW5jdGlvbihwbGF5ZXJCb2R5KSB7XG5cdFx0aWYgKGZhdGFsQ29sbGlzaW9ucykge1xuXHRcdFx0Y29uc29sZS5sb2coJ2RpZSEnLCBwbGF5ZXIuY3Jhc2goKSk7XG5cdFx0fVxuXHR9LFxuXG5cdGJ1bGxldERlYXRoOiBmdW5jdGlvbihidWxsZXRCb2R5KSB7XG5cdFx0YnVsbGV0Qm9keS5zcHJpdGUua2lsbCgpO1xuXHRcdGdyb3Vwcy5idWxsZXRzLnJlbW92ZShidWxsZXRCb2R5LnNwcml0ZSk7XG5cdH0sXG5cblx0cHJlc3NCdXR0b25BOiBmdW5jdGlvbigpIHtcblx0XHRidXR0b25BRG93biA9IHRydWU7XG5cdH0sXG5cblx0dXBCdXR0b25BOiBmdW5jdGlvbigpIHtcblx0XHRidXR0b25BRG93biA9IGZhbHNlO1xuXHR9LFxuXG5cdHByZXNzQnV0dG9uQjogZnVuY3Rpb24oKSB7XG5cdFx0YnV0dG9uQkRvd24gPSB0cnVlO1xuXHR9LFxuXG5cdHVwQnV0dG9uQjogZnVuY3Rpb24oKSB7XG5cdFx0YnV0dG9uQkRvd24gPSBmYWxzZTtcblx0fSxcblxuXHR4RG93bjogZnVuY3Rpb24gKCkge1xuXHRcdGlzWERvd24gPSB0cnVlO1xuXHR9LFxuXG5cdHhVcDogZnVuY3Rpb24oKSB7XG5cdFx0aXNYRG93biA9IGZhbHNlO1xuXHRcdHRoaXMucmVsZWFzZVRyYWN0b3JCZWFtKCk7XG5cdH0sXG5cblx0ZGlzdEF0b0I6IGZ1bmN0aW9uKHBvaW50QSwgcG9pbnRCKSB7XG5cblx0XHR2YXIgQSA9IHBvaW50Qi54IC0gcG9pbnRBLng7XG5cdFx0dmFyIEIgPSBwb2ludEIueSAtIHBvaW50QS55O1xuXG5cdFx0cmV0dXJuIE1hdGguc3FydChBKkEgKyBCKkIpO1xuXG5cdH1cbn07XG4iXX0=
