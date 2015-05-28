(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Player.js":[function(require,module,exports){
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
 * Prevent fatal collisions by setting this value to false in properties
 *
 * @property fatalCollisions
 * @type {boolean}
 */
var fatalCollisions = properties.fatalCollisions;

/**
 * Player description
 * calls init
 *
 * @param collisions {Collisions} Our collisions container of collisionGroups
 * @class Player
 * @constructor
 */
var Player = function(collisions) {
	/**
	 * The Collisions Object
	 *
	 * @property collisions
	 * @type {Collisions}
	 */
	this.collisions = collisions;
	this.init();
};

var p = Player.prototype;

/**
 * Player initialisation
 *
 * @method init
 */
p.init = function() {
	this.sprite = game.make.sprite(game.world.centerX, 300);

	game.physics.p2.enable(this.sprite, false);

	this.body = this.sprite.body;
	this.position = this.sprite.position;

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
	this.body.collideWorldBounds = false;
	this.body.setCollisionGroup(this.collisions.players);

	this.body.collides(this.collisions.terrain, this.crash, this);
};



p.crash = function() {
	if (fatalCollisions) {
		console.log('die!');
	}
};


module.exports = Player;
},{"../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/Collisions.js":[function(require,module,exports){
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
var Collisions = function() {
	/**
	 * A public var description
	 *
	 * @property myPublicVar
	 * @type {number}
	 */
	this.myPublicVar = 1;
	this.init();
};

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
};


module.exports = Collisions;
},{}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/Groups.js":[function(require,module,exports){
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
var Groups = function() {
	/**
	 * A public var description
	 *
	 * @property myPublicVar
	 * @type {number}
	 */
	this.myPublicVar = 1;
	this.init();
};

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
var Physics = function() {
	/**
	 * A public var description
	 *
	 * @property myPublicVar
	 * @type {number}
	 */
	this.myPublicVar = 1;
	this.init();
};

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
 * @namespace thrust-engine
 * @module properties
 * @class
 * @static
 * @type {{enableJoypad: boolean}}
 */
module.exports = {
	enableJoypad: false,
	fatalCollisions: true,
	scale: {
		mode: Phaser.ScaleManager.NO_SCALE
	}
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
		window.stats = new Stats();
		stats.setMode(0);
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';

		document.body.appendChild( stats.domElement );

		game.state.start('play');

		setInterval(function () {
			stats.begin();
			stats.end();
		}, 1000 / 60);
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
var properties = require('../properties');
var Physics = require('../environment/Physics');
var Collisions = require('../environment/Collisions');
var Groups = require('../environment/Groups');
var Player = require('../actors/Player');

/**
 * The play state - this is where the magic happens
 *
 * @namespace states
 * @module play
 * @type {{create: Function, update: Function}}
 */
var player;
var cursors;
var game = window.game;
var ground;
var graphics;
var actors;
var terrain;
var stars;
var pad;
//var stick;
var map;
var buttonA;
var buttonADown = false;
var joypad = properties.enableJoypad;
var bulletBitmap;

//modules
var physics;
var collisions;
var groups;

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

			buttonA = pad.addButton(615, 400, 'dpad', 'button1-up', 'button1-down');
			buttonA.onDown.add(this.pressButtonA, this);
			buttonA.onUp.add(this.upButtonA, this);
		}

		game.world.setBounds(0, 0, 928, 1280);

		physics = new Physics();
		groups = new Groups();

		stars = game.add.tileSprite(0, 0, 928, 600, 'stars');

		collisions = new Collisions();

		game.physics.p2.updateBoundsCollisionGroup();

		player = new Player(collisions);

		map = game.add.sprite(0,0, 'thrustmap');
		map.position.setTo(map.width/2, 970);

		game.physics.p2.enable(map, false);

		map.body.clearShapes();
		map.body.loadPolygon('physicsData', 'thrustmap');
		map.body.static = true;
		map.body.setCollisionGroup(collisions.terrain);
		map.body.collides([collisions.players, collisions.terrain, collisions.bullets]);

		ground = game.add.sprite(0, 700);
		graphics = new Phaser.Graphics(game, 0,0);
		graphics.lineStyle(2, 0xffffff, 0.7);
		var groundWidth = 2000;
		var peakW = 200;
		var peakH = 100;
		var up = true;
		for (i = 0; i < groundWidth; i++) {
			if (i % peakW === 0) {
				graphics.lineTo( peakW + i, up? -Math.random() * peakH : 0 );
				up = !up;
			}
		}
		ground.addChild(graphics);

		groups.terrain.add(stars);
		groups.terrain.add(ground);
		groups.actors.add(player.sprite);

		game.world.swap(groups.terrain, groups.actors);

		//game.physics.p2.enable(ground);
		//ground.body.static = true;



		bulletBitmap = game.make.bitmapData(5,5);
		bulletBitmap.ctx.fillStyle = '#ffffff';
		bulletBitmap.ctx.beginPath();
		bulletBitmap.ctx.arc(1.0,1.0,2, 0, Math.PI*2, true);
		bulletBitmap.ctx.closePath();
		bulletBitmap.ctx.fill();


		bullets = [];

		game.camera.follow(player.sprite);

		cursors = game.input.keyboard.createCursorKeys();

		var spacePress = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spacePress.onDown.add(this.fire, this);



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
			player.body.thrust(300);
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
		var bullet = game.make.sprite(player.position.x, player.position.y, bulletBitmap);
		bullet.anchor.setTo(0.5,0.5);
		game.physics.p2.enable(bullet);
		var angle = player.body.rotation + (3 * Math.PI) / 2;
		bullet.body.collidesWorldBounds = false;
		bullet.body.setCollisionGroup(collisions.bullets);
		bullet.body.collides(collisions.terrain, this.bulletDeath, this);
		bullet.body.data.gravityScale = 0;
		bullet.body.velocity.x = magnitue * Math.cos(angle) + player.body.velocity.x;
		bullet.body.velocity.y = magnitue * Math.sin(angle) + player.body.velocity.y;
		bullet.body.bulletsIndex = bullets.length;
		groups.bullets.add(bullet);
	},

	render: function() {
		game.debug.cameraInfo(game.camera, 500, 20);
	},

	bulletDeath: function(bulletBody) {
		bulletBody.sprite.kill();
		//bullets.splice(bulletBody.bulletsIndex, 1);
		groups.bullets.remove(bulletBody.sprite);
	},

	pressButtonA: function() {
		buttonADown = true;
	},

	upButtonA: function() {
		buttonADown = false;
	},

	pressButtonB: function() {
		this.fire();
	}

};
},{"../actors/Player":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Player.js","../environment/Collisions":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/Collisions.js","../environment/Groups":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/Groups.js","../environment/Physics":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/Physics.js","../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js"}]},{},["/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/game.js"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYWN0b3JzL1BsYXllci5qcyIsInNyYy9lbnZpcm9ubWVudC9Db2xsaXNpb25zLmpzIiwic3JjL2Vudmlyb25tZW50L0dyb3Vwcy5qcyIsInNyYy9lbnZpcm9ubWVudC9QaHlzaWNzLmpzIiwic3JjL2dhbWUuanMiLCJzcmMvbGlicy9zdGF0cy5qcy9zdGF0cy5taW4uanMiLCJzcmMvcHJvcGVydGllcy5qcyIsInNyYy9zdGF0ZXMvYm9vdC5qcyIsInNyYy9zdGF0ZXMvbG9hZC5qcyIsInNyYy9zdGF0ZXMvbWVudS5qcyIsInNyYy9zdGF0ZXMvcGxheS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBnYW1lID0gd2luZG93LmdhbWU7XG52YXIgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL3Byb3BlcnRpZXMnKTtcblxuXG4vKipcbiAqIEEgcHJpdmF0ZSB2YXIgZGVzY3JpcHRpb25cbiAqXG4gKiBAcHJvcGVydHkgbXlQcml2YXRlVmFyXG4gKiBAdHlwZSB7bnVtYmVyfVxuICogQHByaXZhdGVcbiAqL1xudmFyIG15UHJpdmF0ZVZhciA9IDA7XG5cbi8qKlxuICogUHJldmVudCBmYXRhbCBjb2xsaXNpb25zIGJ5IHNldHRpbmcgdGhpcyB2YWx1ZSB0byBmYWxzZSBpbiBwcm9wZXJ0aWVzXG4gKlxuICogQHByb3BlcnR5IGZhdGFsQ29sbGlzaW9uc1xuICogQHR5cGUge2Jvb2xlYW59XG4gKi9cbnZhciBmYXRhbENvbGxpc2lvbnMgPSBwcm9wZXJ0aWVzLmZhdGFsQ29sbGlzaW9ucztcblxuLyoqXG4gKiBQbGF5ZXIgZGVzY3JpcHRpb25cbiAqIGNhbGxzIGluaXRcbiAqXG4gKiBAcGFyYW0gY29sbGlzaW9ucyB7Q29sbGlzaW9uc30gT3VyIGNvbGxpc2lvbnMgY29udGFpbmVyIG9mIGNvbGxpc2lvbkdyb3Vwc1xuICogQGNsYXNzIFBsYXllclxuICogQGNvbnN0cnVjdG9yXG4gKi9cbnZhciBQbGF5ZXIgPSBmdW5jdGlvbihjb2xsaXNpb25zKSB7XG5cdC8qKlxuXHQgKiBUaGUgQ29sbGlzaW9ucyBPYmplY3Rcblx0ICpcblx0ICogQHByb3BlcnR5IGNvbGxpc2lvbnNcblx0ICogQHR5cGUge0NvbGxpc2lvbnN9XG5cdCAqL1xuXHR0aGlzLmNvbGxpc2lvbnMgPSBjb2xsaXNpb25zO1xuXHR0aGlzLmluaXQoKTtcbn07XG5cbnZhciBwID0gUGxheWVyLnByb3RvdHlwZTtcblxuLyoqXG4gKiBQbGF5ZXIgaW5pdGlhbGlzYXRpb25cbiAqXG4gKiBAbWV0aG9kIGluaXRcbiAqL1xucC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuc3ByaXRlID0gZ2FtZS5tYWtlLnNwcml0ZShnYW1lLndvcmxkLmNlbnRlclgsIDMwMCk7XG5cblx0Z2FtZS5waHlzaWNzLnAyLmVuYWJsZSh0aGlzLnNwcml0ZSwgZmFsc2UpO1xuXG5cdHRoaXMuYm9keSA9IHRoaXMuc3ByaXRlLmJvZHk7XG5cdHRoaXMucG9zaXRpb24gPSB0aGlzLnNwcml0ZS5wb3NpdGlvbjtcblxuXHR2YXIgZ3JhcGhpY3MgPSBuZXcgUGhhc2VyLkdyYXBoaWNzKGdhbWUsIDAsMCk7XG5cdC8vZ3JhcGhpY3MuYmVnaW5GaWxsKDB4MDAwMDAwKTtcblx0Z3JhcGhpY3MubGluZVN0eWxlKDQsMHhmZmZmZmYpO1xuXHRncmFwaGljcy5saW5lVG8oMjAsNDApO1xuXHRncmFwaGljcy5saW5lVG8oMjUsNDApO1xuXHRncmFwaGljcy5hcmMoMCw0MCwyNSxnYW1lLm1hdGguZGVnVG9SYWQoMCksIGdhbWUubWF0aC5kZWdUb1JhZCgxODApLCBmYWxzZSk7XG5cdGdyYXBoaWNzLmxpbmVUbygtMjAsNDApO1xuXHRncmFwaGljcy5saW5lVG8oMCwwKTtcblx0Ly9ncmFwaGljcy5lbmRGaWxsKCk7XG5cdHRoaXMuc3ByaXRlLmFkZENoaWxkKGdyYXBoaWNzKTtcblxuXHR0aGlzLnNwcml0ZS5zY2FsZS5zZXRUbygwLjMsMC4zKTtcblx0dGhpcy5zcHJpdGUucGl2b3QueCA9IDA7XG5cdHRoaXMuc3ByaXRlLnBpdm90LnkgPSA0MDtcblxuXHR0aGlzLmJvZHkuY2xlYXJTaGFwZXMoKTtcblx0dGhpcy5ib2R5LmFkZFJlY3RhbmdsZSgtMTAsLTE3LCAwLC0yKTtcblx0dGhpcy5ib2R5LmNvbGxpZGVXb3JsZEJvdW5kcyA9IGZhbHNlO1xuXHR0aGlzLmJvZHkuc2V0Q29sbGlzaW9uR3JvdXAodGhpcy5jb2xsaXNpb25zLnBsYXllcnMpO1xuXG5cdHRoaXMuYm9keS5jb2xsaWRlcyh0aGlzLmNvbGxpc2lvbnMudGVycmFpbiwgdGhpcy5jcmFzaCwgdGhpcyk7XG59O1xuXG5cblxucC5jcmFzaCA9IGZ1bmN0aW9uKCkge1xuXHRpZiAoZmF0YWxDb2xsaXNpb25zKSB7XG5cdFx0Y29uc29sZS5sb2coJ2RpZSEnKTtcblx0fVxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjsiLCIvKipcbiAqIEEgcHJpdmF0ZSB2YXIgZGVzY3JpcHRpb25cbiAqXG4gKiBAcHJvcGVydHkgbXlQcml2YXRlVmFyXG4gKiBAdHlwZSB7bnVtYmVyfVxuICogQHByaXZhdGVcbiAqL1xudmFyIG15UHJpdmF0ZVZhciA9IDA7XG5cbi8qKlxuICogQ29sbGlzaW9ucyBkZXNjcmlwdGlvblxuICogY2FsbHMgaW5pdFxuICpcbiAqIEBjbGFzcyBDb2xsaXNpb25zXG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIENvbGxpc2lvbnMgPSBmdW5jdGlvbigpIHtcblx0LyoqXG5cdCAqIEEgcHVibGljIHZhciBkZXNjcmlwdGlvblxuXHQgKlxuXHQgKiBAcHJvcGVydHkgbXlQdWJsaWNWYXJcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHRoaXMubXlQdWJsaWNWYXIgPSAxO1xuXHR0aGlzLmluaXQoKTtcbn07XG5cbnZhciBwID0gQ29sbGlzaW9ucy5wcm90b3R5cGU7XG5cbi8qKlxuICogQ29sbGlzaW9ucyBpbml0aWFsaXNhdGlvblxuICpcbiAqIEBtZXRob2QgaW5pdFxuICovXG5wLmluaXQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5wbGF5ZXJzID0gZ2FtZS5waHlzaWNzLnAyLmNyZWF0ZUNvbGxpc2lvbkdyb3VwKCk7XG5cdHRoaXMudGVycmFpbiA9IGdhbWUucGh5c2ljcy5wMi5jcmVhdGVDb2xsaXNpb25Hcm91cCgpO1xuXHR0aGlzLmJ1bGxldHMgPSBnYW1lLnBoeXNpY3MucDIuY3JlYXRlQ29sbGlzaW9uR3JvdXAoKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBDb2xsaXNpb25zOyIsIi8qKlxuICogQSBwcml2YXRlIHZhciBkZXNjcmlwdGlvblxuICpcbiAqIEBwcm9wZXJ0eSBteVByaXZhdGVWYXJcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKiBAcHJpdmF0ZVxuICovXG52YXIgbXlQcml2YXRlVmFyID0gMDtcblxuLyoqXG4gKiBHcm91cHMgZGVzY3JpcHRpb25cbiAqIGNhbGxzIGluaXRcbiAqXG4gKiBAY2xhc3MgR3JvdXBzXG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIEdyb3VwcyA9IGZ1bmN0aW9uKCkge1xuXHQvKipcblx0ICogQSBwdWJsaWMgdmFyIGRlc2NyaXB0aW9uXG5cdCAqXG5cdCAqIEBwcm9wZXJ0eSBteVB1YmxpY1ZhclxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dGhpcy5teVB1YmxpY1ZhciA9IDE7XG5cdHRoaXMuaW5pdCgpO1xufTtcblxudmFyIHAgPSBHcm91cHMucHJvdG90eXBlO1xuXG4vKipcbiAqIEdyb3VwcyBpbml0aWFsaXNhdGlvblxuICpcbiAqIEBtZXRob2QgaW5pdFxuICovXG5wLmluaXQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5hY3RvcnMgPSBnYW1lLmFkZC5ncm91cCgpO1xuXHR0aGlzLnRlcnJhaW4gPSBnYW1lLmFkZC5ncm91cCgpO1xuXHR0aGlzLmJ1bGxldHMgPSBnYW1lLmFkZC5ncm91cCgpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEdyb3VwczsiLCJ2YXIgZ2FtZSA9IHdpbmRvdy5nYW1lO1xuXG4vKipcbiAqIEEgcHJpdmF0ZSB2YXIgZGVzY3JpcHRpb25cbiAqXG4gKiBAcHJvcGVydHkgbXlQcml2YXRlVmFyXG4gKiBAdHlwZSB7bnVtYmVyfVxuICogQHByaXZhdGVcbiAqL1xudmFyIG15UHJpdmF0ZVZhciA9IDA7XG5cbi8qKlxuICogUGh5c2ljcyBkZXNjcmlwdGlvblxuICogY2FsbHMgaW5pdFxuICpcbiAqIEBjbGFzcyBQaHlzaWNzXG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIFBoeXNpY3MgPSBmdW5jdGlvbigpIHtcblx0LyoqXG5cdCAqIEEgcHVibGljIHZhciBkZXNjcmlwdGlvblxuXHQgKlxuXHQgKiBAcHJvcGVydHkgbXlQdWJsaWNWYXJcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHRoaXMubXlQdWJsaWNWYXIgPSAxO1xuXHR0aGlzLmluaXQoKTtcbn07XG5cbnZhciBwID0gUGh5c2ljcy5wcm90b3R5cGU7XG5cbi8qKlxuICogUGh5c2ljcyBpbml0aWFsaXNhdGlvblxuICpcbiAqIEBtZXRob2QgaW5pdFxuICovXG5wLmluaXQgPSBmdW5jdGlvbigpIHtcblx0Z2FtZS5waHlzaWNzLnN0YXJ0U3lzdGVtKFBoYXNlci5QaHlzaWNzLlAySlMpO1xuXHRnYW1lLnBoeXNpY3MucDIuc2V0SW1wYWN0RXZlbnRzKHRydWUpO1xuXHRnYW1lLnBoeXNpY3MucDIuZ3Jhdml0eS55ID0gMTAwO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFBoeXNpY3M7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBnYW1lID0gbmV3IFBoYXNlci5HYW1lKDcwMCw1MDAsIFBoYXNlci5BVVRPKTtcbndpbmRvdy5nYW1lID0gZ2FtZTtcblxuZ2FtZS5zdGF0ZS5hZGQoJ3BsYXknLCByZXF1aXJlKCcuL3N0YXRlcy9wbGF5JykpO1xuZ2FtZS5zdGF0ZS5hZGQoJ2xvYWQnLCByZXF1aXJlKCcuL3N0YXRlcy9sb2FkJykpO1xuZ2FtZS5zdGF0ZS5hZGQoJ21lbnUnLCByZXF1aXJlKCcuL3N0YXRlcy9tZW51JykpO1xuZ2FtZS5zdGF0ZS5hZGQoJ2Jvb3QnLCByZXF1aXJlKCcuL3N0YXRlcy9ib290JykpO1xuXG4vL2dhbWUuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTDtcbi8vZ2FtZS5zY2FsZS5zZXRTY3JlZW5TaXplKCk7XG5cbmdhbWUuc3RhdGUuc3RhcnQoJ2Jvb3QnKTsiLCI7IHZhciBfX2Jyb3dzZXJpZnlfc2hpbV9yZXF1aXJlX189cmVxdWlyZTsoZnVuY3Rpb24gYnJvd3NlcmlmeVNoaW0obW9kdWxlLCBleHBvcnRzLCByZXF1aXJlLCBkZWZpbmUsIGJyb3dzZXJpZnlfc2hpbV9fZGVmaW5lX19tb2R1bGVfX2V4cG9ydF9fKSB7XG4vLyBzdGF0cy5qcyAtIGh0dHA6Ly9naXRodWIuY29tL21yZG9vYi9zdGF0cy5qc1xudmFyIFN0YXRzPWZ1bmN0aW9uKCl7dmFyIGw9RGF0ZS5ub3coKSxtPWwsZz0wLG49SW5maW5pdHksbz0wLGg9MCxwPUluZmluaXR5LHE9MCxyPTAscz0wLGY9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtmLmlkPVwic3RhdHNcIjtmLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIixmdW5jdGlvbihiKXtiLnByZXZlbnREZWZhdWx0KCk7dCgrK3MlMil9LCExKTtmLnN0eWxlLmNzc1RleHQ9XCJ3aWR0aDo4MHB4O29wYWNpdHk6MC45O2N1cnNvcjpwb2ludGVyXCI7dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTthLmlkPVwiZnBzXCI7YS5zdHlsZS5jc3NUZXh0PVwicGFkZGluZzowIDAgM3B4IDNweDt0ZXh0LWFsaWduOmxlZnQ7YmFja2dyb3VuZC1jb2xvcjojMDAyXCI7Zi5hcHBlbmRDaGlsZChhKTt2YXIgaT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2kuaWQ9XCJmcHNUZXh0XCI7aS5zdHlsZS5jc3NUZXh0PVwiY29sb3I6IzBmZjtmb250LWZhbWlseTpIZWx2ZXRpY2EsQXJpYWwsc2Fucy1zZXJpZjtmb250LXNpemU6OXB4O2ZvbnQtd2VpZ2h0OmJvbGQ7bGluZS1oZWlnaHQ6MTVweFwiO1xuaS5pbm5lckhUTUw9XCJGUFNcIjthLmFwcGVuZENoaWxkKGkpO3ZhciBjPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7Yy5pZD1cImZwc0dyYXBoXCI7Yy5zdHlsZS5jc3NUZXh0PVwicG9zaXRpb246cmVsYXRpdmU7d2lkdGg6NzRweDtoZWlnaHQ6MzBweDtiYWNrZ3JvdW5kLWNvbG9yOiMwZmZcIjtmb3IoYS5hcHBlbmRDaGlsZChjKTs3ND5jLmNoaWxkcmVuLmxlbmd0aDspe3ZhciBqPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO2ouc3R5bGUuY3NzVGV4dD1cIndpZHRoOjFweDtoZWlnaHQ6MzBweDtmbG9hdDpsZWZ0O2JhY2tncm91bmQtY29sb3I6IzExM1wiO2MuYXBwZW5kQ2hpbGQoail9dmFyIGQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtkLmlkPVwibXNcIjtkLnN0eWxlLmNzc1RleHQ9XCJwYWRkaW5nOjAgMCAzcHggM3B4O3RleHQtYWxpZ246bGVmdDtiYWNrZ3JvdW5kLWNvbG9yOiMwMjA7ZGlzcGxheTpub25lXCI7Zi5hcHBlbmRDaGlsZChkKTt2YXIgaz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuay5pZD1cIm1zVGV4dFwiO2suc3R5bGUuY3NzVGV4dD1cImNvbG9yOiMwZjA7Zm9udC1mYW1pbHk6SGVsdmV0aWNhLEFyaWFsLHNhbnMtc2VyaWY7Zm9udC1zaXplOjlweDtmb250LXdlaWdodDpib2xkO2xpbmUtaGVpZ2h0OjE1cHhcIjtrLmlubmVySFRNTD1cIk1TXCI7ZC5hcHBlbmRDaGlsZChrKTt2YXIgZT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2UuaWQ9XCJtc0dyYXBoXCI7ZS5zdHlsZS5jc3NUZXh0PVwicG9zaXRpb246cmVsYXRpdmU7d2lkdGg6NzRweDtoZWlnaHQ6MzBweDtiYWNrZ3JvdW5kLWNvbG9yOiMwZjBcIjtmb3IoZC5hcHBlbmRDaGlsZChlKTs3ND5lLmNoaWxkcmVuLmxlbmd0aDspaj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKSxqLnN0eWxlLmNzc1RleHQ9XCJ3aWR0aDoxcHg7aGVpZ2h0OjMwcHg7ZmxvYXQ6bGVmdDtiYWNrZ3JvdW5kLWNvbG9yOiMxMzFcIixlLmFwcGVuZENoaWxkKGopO3ZhciB0PWZ1bmN0aW9uKGIpe3M9Yjtzd2l0Y2gocyl7Y2FzZSAwOmEuc3R5bGUuZGlzcGxheT1cblwiYmxvY2tcIjtkLnN0eWxlLmRpc3BsYXk9XCJub25lXCI7YnJlYWs7Y2FzZSAxOmEuc3R5bGUuZGlzcGxheT1cIm5vbmVcIixkLnN0eWxlLmRpc3BsYXk9XCJibG9ja1wifX07cmV0dXJue1JFVklTSU9OOjEyLGRvbUVsZW1lbnQ6ZixzZXRNb2RlOnQsYmVnaW46ZnVuY3Rpb24oKXtsPURhdGUubm93KCl9LGVuZDpmdW5jdGlvbigpe3ZhciBiPURhdGUubm93KCk7Zz1iLWw7bj1NYXRoLm1pbihuLGcpO289TWF0aC5tYXgobyxnKTtrLnRleHRDb250ZW50PWcrXCIgTVMgKFwiK24rXCItXCIrbytcIilcIjt2YXIgYT1NYXRoLm1pbigzMCwzMC0zMCooZy8yMDApKTtlLmFwcGVuZENoaWxkKGUuZmlyc3RDaGlsZCkuc3R5bGUuaGVpZ2h0PWErXCJweFwiO3IrKztiPm0rMUUzJiYoaD1NYXRoLnJvdW5kKDFFMypyLyhiLW0pKSxwPU1hdGgubWluKHAsaCkscT1NYXRoLm1heChxLGgpLGkudGV4dENvbnRlbnQ9aCtcIiBGUFMgKFwiK3ArXCItXCIrcStcIilcIixhPU1hdGgubWluKDMwLDMwLTMwKihoLzEwMCkpLGMuYXBwZW5kQ2hpbGQoYy5maXJzdENoaWxkKS5zdHlsZS5oZWlnaHQ9XG5hK1wicHhcIixtPWIscj0wKTtyZXR1cm4gYn0sdXBkYXRlOmZ1bmN0aW9uKCl7bD10aGlzLmVuZCgpfX19O1wib2JqZWN0XCI9PT10eXBlb2YgbW9kdWxlJiYobW9kdWxlLmV4cG9ydHM9U3RhdHMpO1xuXG47IGJyb3dzZXJpZnlfc2hpbV9fZGVmaW5lX19tb2R1bGVfX2V4cG9ydF9fKHR5cGVvZiBTdGF0cyAhPSBcInVuZGVmaW5lZFwiID8gU3RhdHMgOiB3aW5kb3cuU3RhdHMpO1xuXG59KS5jYWxsKGdsb2JhbCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBmdW5jdGlvbiBkZWZpbmVFeHBvcnQoZXgpIHsgbW9kdWxlLmV4cG9ydHMgPSBleDsgfSk7XG4iLCIvKipcbiAqIEBuYW1lc3BhY2UgdGhydXN0LWVuZ2luZVxuICogQG1vZHVsZSBwcm9wZXJ0aWVzXG4gKiBAY2xhc3NcbiAqIEBzdGF0aWNcbiAqIEB0eXBlIHt7ZW5hYmxlSm95cGFkOiBib29sZWFufX1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGVuYWJsZUpveXBhZDogZmFsc2UsXG5cdGZhdGFsQ29sbGlzaW9uczogdHJ1ZSxcblx0c2NhbGU6IHtcblx0XHRtb2RlOiBQaGFzZXIuU2NhbGVNYW5hZ2VyLk5PX1NDQUxFXG5cdH1cbn07IiwidmFyIFN0YXRzID0gcmVxdWlyZSgnU3RhdHMnKTtcbnZhciBwcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vcHJvcGVydGllcycpO1xuXG4vKipcbiAqIFRoZSBib290IHN0YXRlXG4gKlxuICogQG5hbWVzcGFjZSBzdGF0ZXNcbiAqIEBtb2R1bGUgYm9vdFxuICogQHR5cGUge3tjcmVhdGU6IEZ1bmN0aW9uLCB1cGRhdGU6IEZ1bmN0aW9ufX1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHByZWxvYWQ6IGZ1bmN0aW9uKCkge1xuXHRcdC8vZ2FtZS5sb2FkLnNjcmlwdCgnam95c3RpY2snLCAnamF2YXNjcmlwdHMvYnJvd3NlcmlmeS9waGFzZXItdmlydHVhbC1qb3lzdGljay5taW4uanMnKTtcblx0XHRnYW1lLnNjYWxlLnNjYWxlTW9kZSA9IHByb3BlcnRpZXMuc2NhbGUubW9kZTtcblx0XHRnYW1lLnNjYWxlLnNldFNjcmVlblNpemUoKTtcblx0fSxcblxuXHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHdpbmRvdy5zdGF0cyA9IG5ldyBTdGF0cygpO1xuXHRcdHN0YXRzLnNldE1vZGUoMCk7XG5cdFx0c3RhdHMuZG9tRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG5cdFx0c3RhdHMuZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gJzBweCc7XG5cdFx0c3RhdHMuZG9tRWxlbWVudC5zdHlsZS50b3AgPSAnMHB4JztcblxuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIHN0YXRzLmRvbUVsZW1lbnQgKTtcblxuXHRcdGdhbWUuc3RhdGUuc3RhcnQoJ3BsYXknKTtcblxuXHRcdHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHRcdHN0YXRzLmJlZ2luKCk7XG5cdFx0XHRzdGF0cy5lbmQoKTtcblx0XHR9LCAxMDAwIC8gNjApO1xuXHR9LFxuXHR1cGRhdGU6IGZ1bmN0aW9uKCkge1xuXG5cdH1cbn07IiwiLyoqXG4gKiBUaGUgbG9hZCBzdGF0ZVxuICpcbiAqIEBuYW1lc3BhY2Ugc3RhdGVzXG4gKiBAbW9kdWxlIGxvYWRcbiAqIEB0eXBlIHt7Y3JlYXRlOiBGdW5jdGlvbiwgdXBkYXRlOiBGdW5jdGlvbn19XG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXG5cdH0sXG5cdHVwZGF0ZTogZnVuY3Rpb24oKSB7XG5cblx0fVxufTsiLCIvKipcbiAqIFRoZSBtZW51IHN0YXRlXG4gKlxuICogQG5hbWVzcGFjZSBzdGF0ZXNcbiAqIEBtb2R1bGUgbWVudVxuICogQHR5cGUge3tjcmVhdGU6IEZ1bmN0aW9uLCB1cGRhdGU6IEZ1bmN0aW9ufX1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cblx0fSxcblx0dXBkYXRlOiBmdW5jdGlvbigpIHtcblxuXHR9XG59OyIsInZhciBwcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vcHJvcGVydGllcycpO1xudmFyIFBoeXNpY3MgPSByZXF1aXJlKCcuLi9lbnZpcm9ubWVudC9QaHlzaWNzJyk7XG52YXIgQ29sbGlzaW9ucyA9IHJlcXVpcmUoJy4uL2Vudmlyb25tZW50L0NvbGxpc2lvbnMnKTtcbnZhciBHcm91cHMgPSByZXF1aXJlKCcuLi9lbnZpcm9ubWVudC9Hcm91cHMnKTtcbnZhciBQbGF5ZXIgPSByZXF1aXJlKCcuLi9hY3RvcnMvUGxheWVyJyk7XG5cbi8qKlxuICogVGhlIHBsYXkgc3RhdGUgLSB0aGlzIGlzIHdoZXJlIHRoZSBtYWdpYyBoYXBwZW5zXG4gKlxuICogQG5hbWVzcGFjZSBzdGF0ZXNcbiAqIEBtb2R1bGUgcGxheVxuICogQHR5cGUge3tjcmVhdGU6IEZ1bmN0aW9uLCB1cGRhdGU6IEZ1bmN0aW9ufX1cbiAqL1xudmFyIHBsYXllcjtcbnZhciBjdXJzb3JzO1xudmFyIGdhbWUgPSB3aW5kb3cuZ2FtZTtcbnZhciBncm91bmQ7XG52YXIgZ3JhcGhpY3M7XG52YXIgYWN0b3JzO1xudmFyIHRlcnJhaW47XG52YXIgc3RhcnM7XG52YXIgcGFkO1xuLy92YXIgc3RpY2s7XG52YXIgbWFwO1xudmFyIGJ1dHRvbkE7XG52YXIgYnV0dG9uQURvd24gPSBmYWxzZTtcbnZhciBqb3lwYWQgPSBwcm9wZXJ0aWVzLmVuYWJsZUpveXBhZDtcbnZhciBidWxsZXRCaXRtYXA7XG5cbi8vbW9kdWxlc1xudmFyIHBoeXNpY3M7XG52YXIgY29sbGlzaW9ucztcbnZhciBncm91cHM7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG5cdHByZWxvYWQ6IGZ1bmN0aW9uKCkge1xuXHRcdGdhbWUubG9hZC5pbWFnZSgndGhydXN0bWFwJywgJ2ltYWdlcy90aHJ1c3QtbGV2ZWwyLnBuZycpO1xuXHRcdGdhbWUubG9hZC5waHlzaWNzKCdwaHlzaWNzRGF0YScsICdpbWFnZXMvdGhydXN0LWxldmVsMi5qc29uJyk7XG5cdFx0Z2FtZS5sb2FkLmltYWdlKCdzdGFycycsICdpbWFnZXMvc3RhcmZpZWxkLnBuZycpO1xuXHRcdGlmIChqb3lwYWQpIHtcblx0XHRcdGdhbWUubG9hZC5hdGxhcygnZHBhZCcsICdpbWFnZXMvdmlydHVhbGpveXN0aWNrL3NraW5zL2RwYWQucG5nJywgJ2ltYWdlcy92aXJ0dWFsam95c3RpY2svc2tpbnMvZHBhZC5qc29uJyk7XG5cdFx0fVxuXHR9LFxuXG5cdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKGpveXBhZCkge1xuXHRcdFx0cGFkID0gZ2FtZS5wbHVnaW5zLmFkZChQaGFzZXIuVmlydHVhbEpveXN0aWNrKTtcblx0XHRcdHRoaXMuc3RpY2sgPSBwYWQuYWRkRFBhZCgwLCAwLCAyMDAsICdkcGFkJyk7XG5cdFx0XHR0aGlzLnN0aWNrLmFsaWduQm90dG9tTGVmdCgpO1xuXG5cdFx0XHRidXR0b25BID0gcGFkLmFkZEJ1dHRvbig2MTUsIDQwMCwgJ2RwYWQnLCAnYnV0dG9uMS11cCcsICdidXR0b24xLWRvd24nKTtcblx0XHRcdGJ1dHRvbkEub25Eb3duLmFkZCh0aGlzLnByZXNzQnV0dG9uQSwgdGhpcyk7XG5cdFx0XHRidXR0b25BLm9uVXAuYWRkKHRoaXMudXBCdXR0b25BLCB0aGlzKTtcblx0XHR9XG5cblx0XHRnYW1lLndvcmxkLnNldEJvdW5kcygwLCAwLCA5MjgsIDEyODApO1xuXG5cdFx0cGh5c2ljcyA9IG5ldyBQaHlzaWNzKCk7XG5cdFx0Z3JvdXBzID0gbmV3IEdyb3VwcygpO1xuXG5cdFx0c3RhcnMgPSBnYW1lLmFkZC50aWxlU3ByaXRlKDAsIDAsIDkyOCwgNjAwLCAnc3RhcnMnKTtcblxuXHRcdGNvbGxpc2lvbnMgPSBuZXcgQ29sbGlzaW9ucygpO1xuXG5cdFx0Z2FtZS5waHlzaWNzLnAyLnVwZGF0ZUJvdW5kc0NvbGxpc2lvbkdyb3VwKCk7XG5cblx0XHRwbGF5ZXIgPSBuZXcgUGxheWVyKGNvbGxpc2lvbnMpO1xuXG5cdFx0bWFwID0gZ2FtZS5hZGQuc3ByaXRlKDAsMCwgJ3RocnVzdG1hcCcpO1xuXHRcdG1hcC5wb3NpdGlvbi5zZXRUbyhtYXAud2lkdGgvMiwgOTcwKTtcblxuXHRcdGdhbWUucGh5c2ljcy5wMi5lbmFibGUobWFwLCBmYWxzZSk7XG5cblx0XHRtYXAuYm9keS5jbGVhclNoYXBlcygpO1xuXHRcdG1hcC5ib2R5LmxvYWRQb2x5Z29uKCdwaHlzaWNzRGF0YScsICd0aHJ1c3RtYXAnKTtcblx0XHRtYXAuYm9keS5zdGF0aWMgPSB0cnVlO1xuXHRcdG1hcC5ib2R5LnNldENvbGxpc2lvbkdyb3VwKGNvbGxpc2lvbnMudGVycmFpbik7XG5cdFx0bWFwLmJvZHkuY29sbGlkZXMoW2NvbGxpc2lvbnMucGxheWVycywgY29sbGlzaW9ucy50ZXJyYWluLCBjb2xsaXNpb25zLmJ1bGxldHNdKTtcblxuXHRcdGdyb3VuZCA9IGdhbWUuYWRkLnNwcml0ZSgwLCA3MDApO1xuXHRcdGdyYXBoaWNzID0gbmV3IFBoYXNlci5HcmFwaGljcyhnYW1lLCAwLDApO1xuXHRcdGdyYXBoaWNzLmxpbmVTdHlsZSgyLCAweGZmZmZmZiwgMC43KTtcblx0XHR2YXIgZ3JvdW5kV2lkdGggPSAyMDAwO1xuXHRcdHZhciBwZWFrVyA9IDIwMDtcblx0XHR2YXIgcGVha0ggPSAxMDA7XG5cdFx0dmFyIHVwID0gdHJ1ZTtcblx0XHRmb3IgKGkgPSAwOyBpIDwgZ3JvdW5kV2lkdGg7IGkrKykge1xuXHRcdFx0aWYgKGkgJSBwZWFrVyA9PT0gMCkge1xuXHRcdFx0XHRncmFwaGljcy5saW5lVG8oIHBlYWtXICsgaSwgdXA/IC1NYXRoLnJhbmRvbSgpICogcGVha0ggOiAwICk7XG5cdFx0XHRcdHVwID0gIXVwO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRncm91bmQuYWRkQ2hpbGQoZ3JhcGhpY3MpO1xuXG5cdFx0Z3JvdXBzLnRlcnJhaW4uYWRkKHN0YXJzKTtcblx0XHRncm91cHMudGVycmFpbi5hZGQoZ3JvdW5kKTtcblx0XHRncm91cHMuYWN0b3JzLmFkZChwbGF5ZXIuc3ByaXRlKTtcblxuXHRcdGdhbWUud29ybGQuc3dhcChncm91cHMudGVycmFpbiwgZ3JvdXBzLmFjdG9ycyk7XG5cblx0XHQvL2dhbWUucGh5c2ljcy5wMi5lbmFibGUoZ3JvdW5kKTtcblx0XHQvL2dyb3VuZC5ib2R5LnN0YXRpYyA9IHRydWU7XG5cblxuXG5cdFx0YnVsbGV0Qml0bWFwID0gZ2FtZS5tYWtlLmJpdG1hcERhdGEoNSw1KTtcblx0XHRidWxsZXRCaXRtYXAuY3R4LmZpbGxTdHlsZSA9ICcjZmZmZmZmJztcblx0XHRidWxsZXRCaXRtYXAuY3R4LmJlZ2luUGF0aCgpO1xuXHRcdGJ1bGxldEJpdG1hcC5jdHguYXJjKDEuMCwxLjAsMiwgMCwgTWF0aC5QSSoyLCB0cnVlKTtcblx0XHRidWxsZXRCaXRtYXAuY3R4LmNsb3NlUGF0aCgpO1xuXHRcdGJ1bGxldEJpdG1hcC5jdHguZmlsbCgpO1xuXG5cblx0XHRidWxsZXRzID0gW107XG5cblx0XHRnYW1lLmNhbWVyYS5mb2xsb3cocGxheWVyLnNwcml0ZSk7XG5cblx0XHRjdXJzb3JzID0gZ2FtZS5pbnB1dC5rZXlib2FyZC5jcmVhdGVDdXJzb3JLZXlzKCk7XG5cblx0XHR2YXIgc3BhY2VQcmVzcyA9IGdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5TUEFDRUJBUik7XG5cdFx0c3BhY2VQcmVzcy5vbkRvd24uYWRkKHRoaXMuZmlyZSwgdGhpcyk7XG5cblxuXG5cdH0sXG5cdHVwZGF0ZTogZnVuY3Rpb24oKSB7XG5cblx0XHRpZiAoY3Vyc29ycy5sZWZ0LmlzRG93bikge1xuXHRcdFx0cGxheWVyLmJvZHkucm90YXRlTGVmdCgxMDApO1xuXHRcdH0gZWxzZSBpZiAoY3Vyc29ycy5yaWdodC5pc0Rvd24pIHtcblx0XHRcdHBsYXllci5ib2R5LnJvdGF0ZVJpZ2h0KDEwMCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBsYXllci5ib2R5LnNldFplcm9Sb3RhdGlvbigpO1xuXHRcdH1cblx0XHRpZiAoY3Vyc29ycy51cC5pc0Rvd24gfHwgYnV0dG9uQURvd24pe1xuXHRcdFx0cGxheWVyLmJvZHkudGhydXN0KDMwMCk7XG5cdFx0fVxuXG5cdFx0aWYgKGpveXBhZCkge1xuXHRcdFx0aWYgKHRoaXMuc3RpY2suaXNEb3duKSB7XG5cdFx0XHRcdGlmICh0aGlzLnN0aWNrLmRpcmVjdGlvbiA9PT0gUGhhc2VyLkxFRlQpIHtcblx0XHRcdFx0XHRwbGF5ZXIuYm9keS5yb3RhdGVMZWZ0KDEwMCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5zdGljay5kaXJlY3Rpb24gPT09IFBoYXNlci5SSUdIVCkge1xuXHRcdFx0XHRcdHBsYXllci5ib2R5LnJvdGF0ZVJpZ2h0KDEwMCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRnYW1lLndvcmxkLndyYXAocGxheWVyLmJvZHksIDAsIGZhbHNlKTtcblx0fSxcblxuXHRmaXJlOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgbWFnbml0dWUgPSAyNDA7XG5cdFx0dmFyIGJ1bGxldCA9IGdhbWUubWFrZS5zcHJpdGUocGxheWVyLnBvc2l0aW9uLngsIHBsYXllci5wb3NpdGlvbi55LCBidWxsZXRCaXRtYXApO1xuXHRcdGJ1bGxldC5hbmNob3Iuc2V0VG8oMC41LDAuNSk7XG5cdFx0Z2FtZS5waHlzaWNzLnAyLmVuYWJsZShidWxsZXQpO1xuXHRcdHZhciBhbmdsZSA9IHBsYXllci5ib2R5LnJvdGF0aW9uICsgKDMgKiBNYXRoLlBJKSAvIDI7XG5cdFx0YnVsbGV0LmJvZHkuY29sbGlkZXNXb3JsZEJvdW5kcyA9IGZhbHNlO1xuXHRcdGJ1bGxldC5ib2R5LnNldENvbGxpc2lvbkdyb3VwKGNvbGxpc2lvbnMuYnVsbGV0cyk7XG5cdFx0YnVsbGV0LmJvZHkuY29sbGlkZXMoY29sbGlzaW9ucy50ZXJyYWluLCB0aGlzLmJ1bGxldERlYXRoLCB0aGlzKTtcblx0XHRidWxsZXQuYm9keS5kYXRhLmdyYXZpdHlTY2FsZSA9IDA7XG5cdFx0YnVsbGV0LmJvZHkudmVsb2NpdHkueCA9IG1hZ25pdHVlICogTWF0aC5jb3MoYW5nbGUpICsgcGxheWVyLmJvZHkudmVsb2NpdHkueDtcblx0XHRidWxsZXQuYm9keS52ZWxvY2l0eS55ID0gbWFnbml0dWUgKiBNYXRoLnNpbihhbmdsZSkgKyBwbGF5ZXIuYm9keS52ZWxvY2l0eS55O1xuXHRcdGJ1bGxldC5ib2R5LmJ1bGxldHNJbmRleCA9IGJ1bGxldHMubGVuZ3RoO1xuXHRcdGdyb3Vwcy5idWxsZXRzLmFkZChidWxsZXQpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0Z2FtZS5kZWJ1Zy5jYW1lcmFJbmZvKGdhbWUuY2FtZXJhLCA1MDAsIDIwKTtcblx0fSxcblxuXHRidWxsZXREZWF0aDogZnVuY3Rpb24oYnVsbGV0Qm9keSkge1xuXHRcdGJ1bGxldEJvZHkuc3ByaXRlLmtpbGwoKTtcblx0XHQvL2J1bGxldHMuc3BsaWNlKGJ1bGxldEJvZHkuYnVsbGV0c0luZGV4LCAxKTtcblx0XHRncm91cHMuYnVsbGV0cy5yZW1vdmUoYnVsbGV0Qm9keS5zcHJpdGUpO1xuXHR9LFxuXG5cdHByZXNzQnV0dG9uQTogZnVuY3Rpb24oKSB7XG5cdFx0YnV0dG9uQURvd24gPSB0cnVlO1xuXHR9LFxuXG5cdHVwQnV0dG9uQTogZnVuY3Rpb24oKSB7XG5cdFx0YnV0dG9uQURvd24gPSBmYWxzZTtcblx0fSxcblxuXHRwcmVzc0J1dHRvbkI6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuZmlyZSgpO1xuXHR9XG5cbn07Il19
