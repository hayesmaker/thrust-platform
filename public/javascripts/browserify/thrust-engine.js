(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/game.js":[function(require,module,exports){
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
var bullets;


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
		game.physics.startSystem(Phaser.Physics.P2JS);

		game.physics.p2.setImpactEvents(true);
		game.physics.p2.gravity.y = 100;

		actors = game.add.group();
		terrain = game.add.group();

		stars = game.add.tileSprite(0, 0, 928, 600, 'stars');

		//game.physics.p2.enable(stars);
		//stars.body.static = true;
		//stars.body.clearShapes();

		player = game.make.sprite(game.world.centerX, 300);
		game.physics.p2.enable(player, false);


		graphics = new Phaser.Graphics(game, 0,0);
		//graphics.beginFill(0x000000);
		graphics.lineStyle(4,0xffffff);
		graphics.lineTo(20,40);
		graphics.lineTo(25,40);
		graphics.arc(0,40,25,game.math.degToRad(0), game.math.degToRad(180), false);
		graphics.lineTo(-20,40);
		graphics.lineTo(0,0);
		//graphics.endFill();
		player.addChild(graphics);


		player.scale.setTo(0.3,0.3);
		player.pivot.x = 0;
		player.pivot.y = 40;

		player.body.clearShapes();
		player.body.addRectangle(-10,-17, 0,-2);
		player.body.collideWorldBounds = false;



		map = game.add.sprite(0,0, 'thrustmap');
		//map.scale.setTo(2,2);
		map.position.setTo(map.width/2, 970);

		game.physics.p2.enable(map, false);


		map.body.clearShapes();
		map.body.loadPolygon('physicsData', 'thrustmap');
		map.body.static = true;
		//player.body.setCollisionGroup(playerColGroup);
		//player.body.collides(terrainColGroup, this.crash, true);
		//console.log('player dimension:', player.getBounds());

		ground = game.add.sprite(0, 700);
		//ground.body.setCollisionGroup(terrainColGroup);

		graphics = new Phaser.Graphics(game, 0,0);
		graphics.lineStyle(2, 0xffffff, 0.7);
		//graphics.lineTo(2000, 0);

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

		terrain.add(stars);
		terrain.add(ground);
		actors.add(player);

		game.world.swap(terrain, actors);

		game.physics.p2.enable(ground);
		ground.body.static = true;

		ground.addChild(graphics);


		bulletBitmap = game.make.bitmapData(5,5);
		bulletBitmap.ctx.fillStyle = '#ffffff';
		bulletBitmap.ctx.beginPath();
		bulletBitmap.ctx.arc(1.5,1.5,3, 0, Math.PI*2, true);
		bulletBitmap.ctx.closePath();
		bulletBitmap.ctx.fill();

		var sprite = game.add.sprite(100,100, bulletBitmap);
		sprite.fixedToCamera = true;

		bullets = [];

		game.camera.follow(player);

		cursors = game.input.keyboard.createCursorKeys();

		spacePress = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
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
		var magnitue = 225;
		var bullet = this.add.sprite(player.position.x, player.position.y, bulletBitmap);
		bullet.anchor.setTo(0.5,0.5);
		game.physics.p2.enable(bullet);
		var angle = player.body.rotation + (3 * Math.PI) / 2;
		bullet.body.data.gravityScale = 0;
		bullet.body.velocity.x = magnitue * Math.cos(angle) + player.body.velocity.x;
		bullet.body.velocity.y = magnitue * Math.sin(angle) + player.body.velocity.y;
		bullets.push(0);
	},

	render: function() {
		game.debug.cameraInfo(game.camera, 500, 20);
	},

	crash: function() {
		console.log('crashy crashy');
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
},{"../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js"}]},{},["/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/game.js"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZ2FtZS5qcyIsInNyYy9saWJzL3N0YXRzLmpzL3N0YXRzLm1pbi5qcyIsInNyYy9wcm9wZXJ0aWVzLmpzIiwic3JjL3N0YXRlcy9ib290LmpzIiwic3JjL3N0YXRlcy9sb2FkLmpzIiwic3JjL3N0YXRlcy9tZW51LmpzIiwic3JjL3N0YXRlcy9wbGF5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBnYW1lID0gbmV3IFBoYXNlci5HYW1lKDcwMCw1MDAsIFBoYXNlci5BVVRPKTtcbndpbmRvdy5nYW1lID0gZ2FtZTtcblxuZ2FtZS5zdGF0ZS5hZGQoJ3BsYXknLCByZXF1aXJlKCcuL3N0YXRlcy9wbGF5JykpO1xuZ2FtZS5zdGF0ZS5hZGQoJ2xvYWQnLCByZXF1aXJlKCcuL3N0YXRlcy9sb2FkJykpO1xuZ2FtZS5zdGF0ZS5hZGQoJ21lbnUnLCByZXF1aXJlKCcuL3N0YXRlcy9tZW51JykpO1xuZ2FtZS5zdGF0ZS5hZGQoJ2Jvb3QnLCByZXF1aXJlKCcuL3N0YXRlcy9ib290JykpO1xuXG4vL2dhbWUuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTDtcbi8vZ2FtZS5zY2FsZS5zZXRTY3JlZW5TaXplKCk7XG5cbmdhbWUuc3RhdGUuc3RhcnQoJ2Jvb3QnKTsiLCI7IHZhciBfX2Jyb3dzZXJpZnlfc2hpbV9yZXF1aXJlX189cmVxdWlyZTsoZnVuY3Rpb24gYnJvd3NlcmlmeVNoaW0obW9kdWxlLCBleHBvcnRzLCByZXF1aXJlLCBkZWZpbmUsIGJyb3dzZXJpZnlfc2hpbV9fZGVmaW5lX19tb2R1bGVfX2V4cG9ydF9fKSB7XG4vLyBzdGF0cy5qcyAtIGh0dHA6Ly9naXRodWIuY29tL21yZG9vYi9zdGF0cy5qc1xudmFyIFN0YXRzPWZ1bmN0aW9uKCl7dmFyIGw9RGF0ZS5ub3coKSxtPWwsZz0wLG49SW5maW5pdHksbz0wLGg9MCxwPUluZmluaXR5LHE9MCxyPTAscz0wLGY9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtmLmlkPVwic3RhdHNcIjtmLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIixmdW5jdGlvbihiKXtiLnByZXZlbnREZWZhdWx0KCk7dCgrK3MlMil9LCExKTtmLnN0eWxlLmNzc1RleHQ9XCJ3aWR0aDo4MHB4O29wYWNpdHk6MC45O2N1cnNvcjpwb2ludGVyXCI7dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTthLmlkPVwiZnBzXCI7YS5zdHlsZS5jc3NUZXh0PVwicGFkZGluZzowIDAgM3B4IDNweDt0ZXh0LWFsaWduOmxlZnQ7YmFja2dyb3VuZC1jb2xvcjojMDAyXCI7Zi5hcHBlbmRDaGlsZChhKTt2YXIgaT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2kuaWQ9XCJmcHNUZXh0XCI7aS5zdHlsZS5jc3NUZXh0PVwiY29sb3I6IzBmZjtmb250LWZhbWlseTpIZWx2ZXRpY2EsQXJpYWwsc2Fucy1zZXJpZjtmb250LXNpemU6OXB4O2ZvbnQtd2VpZ2h0OmJvbGQ7bGluZS1oZWlnaHQ6MTVweFwiO1xuaS5pbm5lckhUTUw9XCJGUFNcIjthLmFwcGVuZENoaWxkKGkpO3ZhciBjPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7Yy5pZD1cImZwc0dyYXBoXCI7Yy5zdHlsZS5jc3NUZXh0PVwicG9zaXRpb246cmVsYXRpdmU7d2lkdGg6NzRweDtoZWlnaHQ6MzBweDtiYWNrZ3JvdW5kLWNvbG9yOiMwZmZcIjtmb3IoYS5hcHBlbmRDaGlsZChjKTs3ND5jLmNoaWxkcmVuLmxlbmd0aDspe3ZhciBqPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO2ouc3R5bGUuY3NzVGV4dD1cIndpZHRoOjFweDtoZWlnaHQ6MzBweDtmbG9hdDpsZWZ0O2JhY2tncm91bmQtY29sb3I6IzExM1wiO2MuYXBwZW5kQ2hpbGQoail9dmFyIGQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtkLmlkPVwibXNcIjtkLnN0eWxlLmNzc1RleHQ9XCJwYWRkaW5nOjAgMCAzcHggM3B4O3RleHQtYWxpZ246bGVmdDtiYWNrZ3JvdW5kLWNvbG9yOiMwMjA7ZGlzcGxheTpub25lXCI7Zi5hcHBlbmRDaGlsZChkKTt2YXIgaz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuay5pZD1cIm1zVGV4dFwiO2suc3R5bGUuY3NzVGV4dD1cImNvbG9yOiMwZjA7Zm9udC1mYW1pbHk6SGVsdmV0aWNhLEFyaWFsLHNhbnMtc2VyaWY7Zm9udC1zaXplOjlweDtmb250LXdlaWdodDpib2xkO2xpbmUtaGVpZ2h0OjE1cHhcIjtrLmlubmVySFRNTD1cIk1TXCI7ZC5hcHBlbmRDaGlsZChrKTt2YXIgZT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2UuaWQ9XCJtc0dyYXBoXCI7ZS5zdHlsZS5jc3NUZXh0PVwicG9zaXRpb246cmVsYXRpdmU7d2lkdGg6NzRweDtoZWlnaHQ6MzBweDtiYWNrZ3JvdW5kLWNvbG9yOiMwZjBcIjtmb3IoZC5hcHBlbmRDaGlsZChlKTs3ND5lLmNoaWxkcmVuLmxlbmd0aDspaj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKSxqLnN0eWxlLmNzc1RleHQ9XCJ3aWR0aDoxcHg7aGVpZ2h0OjMwcHg7ZmxvYXQ6bGVmdDtiYWNrZ3JvdW5kLWNvbG9yOiMxMzFcIixlLmFwcGVuZENoaWxkKGopO3ZhciB0PWZ1bmN0aW9uKGIpe3M9Yjtzd2l0Y2gocyl7Y2FzZSAwOmEuc3R5bGUuZGlzcGxheT1cblwiYmxvY2tcIjtkLnN0eWxlLmRpc3BsYXk9XCJub25lXCI7YnJlYWs7Y2FzZSAxOmEuc3R5bGUuZGlzcGxheT1cIm5vbmVcIixkLnN0eWxlLmRpc3BsYXk9XCJibG9ja1wifX07cmV0dXJue1JFVklTSU9OOjEyLGRvbUVsZW1lbnQ6ZixzZXRNb2RlOnQsYmVnaW46ZnVuY3Rpb24oKXtsPURhdGUubm93KCl9LGVuZDpmdW5jdGlvbigpe3ZhciBiPURhdGUubm93KCk7Zz1iLWw7bj1NYXRoLm1pbihuLGcpO289TWF0aC5tYXgobyxnKTtrLnRleHRDb250ZW50PWcrXCIgTVMgKFwiK24rXCItXCIrbytcIilcIjt2YXIgYT1NYXRoLm1pbigzMCwzMC0zMCooZy8yMDApKTtlLmFwcGVuZENoaWxkKGUuZmlyc3RDaGlsZCkuc3R5bGUuaGVpZ2h0PWErXCJweFwiO3IrKztiPm0rMUUzJiYoaD1NYXRoLnJvdW5kKDFFMypyLyhiLW0pKSxwPU1hdGgubWluKHAsaCkscT1NYXRoLm1heChxLGgpLGkudGV4dENvbnRlbnQ9aCtcIiBGUFMgKFwiK3ArXCItXCIrcStcIilcIixhPU1hdGgubWluKDMwLDMwLTMwKihoLzEwMCkpLGMuYXBwZW5kQ2hpbGQoYy5maXJzdENoaWxkKS5zdHlsZS5oZWlnaHQ9XG5hK1wicHhcIixtPWIscj0wKTtyZXR1cm4gYn0sdXBkYXRlOmZ1bmN0aW9uKCl7bD10aGlzLmVuZCgpfX19O1wib2JqZWN0XCI9PT10eXBlb2YgbW9kdWxlJiYobW9kdWxlLmV4cG9ydHM9U3RhdHMpO1xuXG47IGJyb3dzZXJpZnlfc2hpbV9fZGVmaW5lX19tb2R1bGVfX2V4cG9ydF9fKHR5cGVvZiBTdGF0cyAhPSBcInVuZGVmaW5lZFwiID8gU3RhdHMgOiB3aW5kb3cuU3RhdHMpO1xuXG59KS5jYWxsKGdsb2JhbCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBmdW5jdGlvbiBkZWZpbmVFeHBvcnQoZXgpIHsgbW9kdWxlLmV4cG9ydHMgPSBleDsgfSk7XG4iLCIvKipcbiAqIEBuYW1lc3BhY2UgdGhydXN0LWVuZ2luZVxuICogQG1vZHVsZSBwcm9wZXJ0aWVzXG4gKiBAY2xhc3NcbiAqIEBzdGF0aWNcbiAqIEB0eXBlIHt7ZW5hYmxlSm95cGFkOiBib29sZWFufX1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGVuYWJsZUpveXBhZDogZmFsc2UsXG5cdHNjYWxlOiB7XG5cdFx0bW9kZTogUGhhc2VyLlNjYWxlTWFuYWdlci5OT19TQ0FMRVxuXHR9XG59OyIsInZhciBTdGF0cyA9IHJlcXVpcmUoJ1N0YXRzJyk7XG52YXIgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL3Byb3BlcnRpZXMnKTtcblxuLyoqXG4gKiBUaGUgYm9vdCBzdGF0ZVxuICpcbiAqIEBuYW1lc3BhY2Ugc3RhdGVzXG4gKiBAbW9kdWxlIGJvb3RcbiAqIEB0eXBlIHt7Y3JlYXRlOiBGdW5jdGlvbiwgdXBkYXRlOiBGdW5jdGlvbn19XG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRwcmVsb2FkOiBmdW5jdGlvbigpIHtcblx0XHQvL2dhbWUubG9hZC5zY3JpcHQoJ2pveXN0aWNrJywgJ2phdmFzY3JpcHRzL2Jyb3dzZXJpZnkvcGhhc2VyLXZpcnR1YWwtam95c3RpY2subWluLmpzJyk7XG5cdFx0Z2FtZS5zY2FsZS5zY2FsZU1vZGUgPSBwcm9wZXJ0aWVzLnNjYWxlLm1vZGU7XG5cdFx0Z2FtZS5zY2FsZS5zZXRTY3JlZW5TaXplKCk7XG5cdH0sXG5cblx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHR3aW5kb3cuc3RhdHMgPSBuZXcgU3RhdHMoKTtcblx0XHRzdGF0cy5zZXRNb2RlKDApO1xuXHRcdHN0YXRzLmRvbUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuXHRcdHN0YXRzLmRvbUVsZW1lbnQuc3R5bGUubGVmdCA9ICcwcHgnO1xuXHRcdHN0YXRzLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gJzBweCc7XG5cblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBzdGF0cy5kb21FbGVtZW50ICk7XG5cblx0XHRnYW1lLnN0YXRlLnN0YXJ0KCdwbGF5Jyk7XG5cblx0XHRzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cdFx0XHRzdGF0cy5iZWdpbigpO1xuXHRcdFx0c3RhdHMuZW5kKCk7XG5cdFx0fSwgMTAwMCAvIDYwKTtcblx0fSxcblx0dXBkYXRlOiBmdW5jdGlvbigpIHtcblxuXHR9XG59OyIsIi8qKlxuICogVGhlIGxvYWQgc3RhdGVcbiAqXG4gKiBAbmFtZXNwYWNlIHN0YXRlc1xuICogQG1vZHVsZSBsb2FkXG4gKiBAdHlwZSB7e2NyZWF0ZTogRnVuY3Rpb24sIHVwZGF0ZTogRnVuY3Rpb259fVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblxuXHR9LFxuXHR1cGRhdGU6IGZ1bmN0aW9uKCkge1xuXG5cdH1cbn07IiwiLyoqXG4gKiBUaGUgbWVudSBzdGF0ZVxuICpcbiAqIEBuYW1lc3BhY2Ugc3RhdGVzXG4gKiBAbW9kdWxlIG1lbnVcbiAqIEB0eXBlIHt7Y3JlYXRlOiBGdW5jdGlvbiwgdXBkYXRlOiBGdW5jdGlvbn19XG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXG5cdH0sXG5cdHVwZGF0ZTogZnVuY3Rpb24oKSB7XG5cblx0fVxufTsiLCJ2YXIgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL3Byb3BlcnRpZXMnKTtcblxuLyoqXG4gKiBUaGUgcGxheSBzdGF0ZSAtIHRoaXMgaXMgd2hlcmUgdGhlIG1hZ2ljIGhhcHBlbnNcbiAqXG4gKiBAbmFtZXNwYWNlIHN0YXRlc1xuICogQG1vZHVsZSBwbGF5XG4gKiBAdHlwZSB7e2NyZWF0ZTogRnVuY3Rpb24sIHVwZGF0ZTogRnVuY3Rpb259fVxuICovXG52YXIgcGxheWVyO1xudmFyIGN1cnNvcnM7XG52YXIgZ2FtZSA9IHdpbmRvdy5nYW1lO1xudmFyIGdyb3VuZDtcbnZhciBncmFwaGljcztcbnZhciBhY3RvcnM7XG52YXIgdGVycmFpbjtcbnZhciBzdGFycztcbnZhciBwYWQ7XG4vL3ZhciBzdGljaztcbnZhciBtYXA7XG52YXIgYnV0dG9uQTtcbnZhciBidXR0b25BRG93biA9IGZhbHNlO1xudmFyIGpveXBhZCA9IHByb3BlcnRpZXMuZW5hYmxlSm95cGFkO1xuXG52YXIgYnVsbGV0Qml0bWFwO1xudmFyIGJ1bGxldHM7XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cblx0cHJlbG9hZDogZnVuY3Rpb24oKSB7XG5cdFx0Z2FtZS5sb2FkLmltYWdlKCd0aHJ1c3RtYXAnLCAnaW1hZ2VzL3RocnVzdC1sZXZlbDIucG5nJyk7XG5cdFx0Z2FtZS5sb2FkLnBoeXNpY3MoJ3BoeXNpY3NEYXRhJywgJ2ltYWdlcy90aHJ1c3QtbGV2ZWwyLmpzb24nKTtcblx0XHRnYW1lLmxvYWQuaW1hZ2UoJ3N0YXJzJywgJ2ltYWdlcy9zdGFyZmllbGQucG5nJyk7XG5cdFx0aWYgKGpveXBhZCkge1xuXHRcdFx0Z2FtZS5sb2FkLmF0bGFzKCdkcGFkJywgJ2ltYWdlcy92aXJ0dWFsam95c3RpY2svc2tpbnMvZHBhZC5wbmcnLCAnaW1hZ2VzL3ZpcnR1YWxqb3lzdGljay9za2lucy9kcGFkLmpzb24nKTtcblx0XHR9XG5cdH0sXG5cblx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRpZiAoam95cGFkKSB7XG5cdFx0XHRwYWQgPSBnYW1lLnBsdWdpbnMuYWRkKFBoYXNlci5WaXJ0dWFsSm95c3RpY2spO1xuXHRcdFx0dGhpcy5zdGljayA9IHBhZC5hZGREUGFkKDAsIDAsIDIwMCwgJ2RwYWQnKTtcblx0XHRcdHRoaXMuc3RpY2suYWxpZ25Cb3R0b21MZWZ0KCk7XG5cblx0XHRcdGJ1dHRvbkEgPSBwYWQuYWRkQnV0dG9uKDYxNSwgNDAwLCAnZHBhZCcsICdidXR0b24xLXVwJywgJ2J1dHRvbjEtZG93bicpO1xuXHRcdFx0YnV0dG9uQS5vbkRvd24uYWRkKHRoaXMucHJlc3NCdXR0b25BLCB0aGlzKTtcblx0XHRcdGJ1dHRvbkEub25VcC5hZGQodGhpcy51cEJ1dHRvbkEsIHRoaXMpO1xuXHRcdH1cblxuXHRcdGdhbWUud29ybGQuc2V0Qm91bmRzKDAsIDAsIDkyOCwgMTI4MCk7XG5cdFx0Z2FtZS5waHlzaWNzLnN0YXJ0U3lzdGVtKFBoYXNlci5QaHlzaWNzLlAySlMpO1xuXG5cdFx0Z2FtZS5waHlzaWNzLnAyLnNldEltcGFjdEV2ZW50cyh0cnVlKTtcblx0XHRnYW1lLnBoeXNpY3MucDIuZ3Jhdml0eS55ID0gMTAwO1xuXG5cdFx0YWN0b3JzID0gZ2FtZS5hZGQuZ3JvdXAoKTtcblx0XHR0ZXJyYWluID0gZ2FtZS5hZGQuZ3JvdXAoKTtcblxuXHRcdHN0YXJzID0gZ2FtZS5hZGQudGlsZVNwcml0ZSgwLCAwLCA5MjgsIDYwMCwgJ3N0YXJzJyk7XG5cblx0XHQvL2dhbWUucGh5c2ljcy5wMi5lbmFibGUoc3RhcnMpO1xuXHRcdC8vc3RhcnMuYm9keS5zdGF0aWMgPSB0cnVlO1xuXHRcdC8vc3RhcnMuYm9keS5jbGVhclNoYXBlcygpO1xuXG5cdFx0cGxheWVyID0gZ2FtZS5tYWtlLnNwcml0ZShnYW1lLndvcmxkLmNlbnRlclgsIDMwMCk7XG5cdFx0Z2FtZS5waHlzaWNzLnAyLmVuYWJsZShwbGF5ZXIsIGZhbHNlKTtcblxuXG5cdFx0Z3JhcGhpY3MgPSBuZXcgUGhhc2VyLkdyYXBoaWNzKGdhbWUsIDAsMCk7XG5cdFx0Ly9ncmFwaGljcy5iZWdpbkZpbGwoMHgwMDAwMDApO1xuXHRcdGdyYXBoaWNzLmxpbmVTdHlsZSg0LDB4ZmZmZmZmKTtcblx0XHRncmFwaGljcy5saW5lVG8oMjAsNDApO1xuXHRcdGdyYXBoaWNzLmxpbmVUbygyNSw0MCk7XG5cdFx0Z3JhcGhpY3MuYXJjKDAsNDAsMjUsZ2FtZS5tYXRoLmRlZ1RvUmFkKDApLCBnYW1lLm1hdGguZGVnVG9SYWQoMTgwKSwgZmFsc2UpO1xuXHRcdGdyYXBoaWNzLmxpbmVUbygtMjAsNDApO1xuXHRcdGdyYXBoaWNzLmxpbmVUbygwLDApO1xuXHRcdC8vZ3JhcGhpY3MuZW5kRmlsbCgpO1xuXHRcdHBsYXllci5hZGRDaGlsZChncmFwaGljcyk7XG5cblxuXHRcdHBsYXllci5zY2FsZS5zZXRUbygwLjMsMC4zKTtcblx0XHRwbGF5ZXIucGl2b3QueCA9IDA7XG5cdFx0cGxheWVyLnBpdm90LnkgPSA0MDtcblxuXHRcdHBsYXllci5ib2R5LmNsZWFyU2hhcGVzKCk7XG5cdFx0cGxheWVyLmJvZHkuYWRkUmVjdGFuZ2xlKC0xMCwtMTcsIDAsLTIpO1xuXHRcdHBsYXllci5ib2R5LmNvbGxpZGVXb3JsZEJvdW5kcyA9IGZhbHNlO1xuXG5cblxuXHRcdG1hcCA9IGdhbWUuYWRkLnNwcml0ZSgwLDAsICd0aHJ1c3RtYXAnKTtcblx0XHQvL21hcC5zY2FsZS5zZXRUbygyLDIpO1xuXHRcdG1hcC5wb3NpdGlvbi5zZXRUbyhtYXAud2lkdGgvMiwgOTcwKTtcblxuXHRcdGdhbWUucGh5c2ljcy5wMi5lbmFibGUobWFwLCBmYWxzZSk7XG5cblxuXHRcdG1hcC5ib2R5LmNsZWFyU2hhcGVzKCk7XG5cdFx0bWFwLmJvZHkubG9hZFBvbHlnb24oJ3BoeXNpY3NEYXRhJywgJ3RocnVzdG1hcCcpO1xuXHRcdG1hcC5ib2R5LnN0YXRpYyA9IHRydWU7XG5cdFx0Ly9wbGF5ZXIuYm9keS5zZXRDb2xsaXNpb25Hcm91cChwbGF5ZXJDb2xHcm91cCk7XG5cdFx0Ly9wbGF5ZXIuYm9keS5jb2xsaWRlcyh0ZXJyYWluQ29sR3JvdXAsIHRoaXMuY3Jhc2gsIHRydWUpO1xuXHRcdC8vY29uc29sZS5sb2coJ3BsYXllciBkaW1lbnNpb246JywgcGxheWVyLmdldEJvdW5kcygpKTtcblxuXHRcdGdyb3VuZCA9IGdhbWUuYWRkLnNwcml0ZSgwLCA3MDApO1xuXHRcdC8vZ3JvdW5kLmJvZHkuc2V0Q29sbGlzaW9uR3JvdXAodGVycmFpbkNvbEdyb3VwKTtcblxuXHRcdGdyYXBoaWNzID0gbmV3IFBoYXNlci5HcmFwaGljcyhnYW1lLCAwLDApO1xuXHRcdGdyYXBoaWNzLmxpbmVTdHlsZSgyLCAweGZmZmZmZiwgMC43KTtcblx0XHQvL2dyYXBoaWNzLmxpbmVUbygyMDAwLCAwKTtcblxuXHRcdHZhciBncm91bmRXaWR0aCA9IDIwMDA7XG5cdFx0dmFyIHBlYWtXID0gMjAwO1xuXHRcdHZhciBwZWFrSCA9IDEwMDtcblxuXHRcdHZhciB1cCA9IHRydWU7XG5cdFx0Zm9yIChpID0gMDsgaSA8IGdyb3VuZFdpZHRoOyBpKyspIHtcblx0XHRcdGlmIChpICUgcGVha1cgPT09IDApIHtcblx0XHRcdFx0Z3JhcGhpY3MubGluZVRvKCBwZWFrVyArIGksIHVwPyAtTWF0aC5yYW5kb20oKSAqIHBlYWtIIDogMCApO1xuXHRcdFx0XHR1cCA9ICF1cDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0ZXJyYWluLmFkZChzdGFycyk7XG5cdFx0dGVycmFpbi5hZGQoZ3JvdW5kKTtcblx0XHRhY3RvcnMuYWRkKHBsYXllcik7XG5cblx0XHRnYW1lLndvcmxkLnN3YXAodGVycmFpbiwgYWN0b3JzKTtcblxuXHRcdGdhbWUucGh5c2ljcy5wMi5lbmFibGUoZ3JvdW5kKTtcblx0XHRncm91bmQuYm9keS5zdGF0aWMgPSB0cnVlO1xuXG5cdFx0Z3JvdW5kLmFkZENoaWxkKGdyYXBoaWNzKTtcblxuXG5cdFx0YnVsbGV0Qml0bWFwID0gZ2FtZS5tYWtlLmJpdG1hcERhdGEoNSw1KTtcblx0XHRidWxsZXRCaXRtYXAuY3R4LmZpbGxTdHlsZSA9ICcjZmZmZmZmJztcblx0XHRidWxsZXRCaXRtYXAuY3R4LmJlZ2luUGF0aCgpO1xuXHRcdGJ1bGxldEJpdG1hcC5jdHguYXJjKDEuNSwxLjUsMywgMCwgTWF0aC5QSSoyLCB0cnVlKTtcblx0XHRidWxsZXRCaXRtYXAuY3R4LmNsb3NlUGF0aCgpO1xuXHRcdGJ1bGxldEJpdG1hcC5jdHguZmlsbCgpO1xuXG5cdFx0dmFyIHNwcml0ZSA9IGdhbWUuYWRkLnNwcml0ZSgxMDAsMTAwLCBidWxsZXRCaXRtYXApO1xuXHRcdHNwcml0ZS5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcblxuXHRcdGJ1bGxldHMgPSBbXTtcblxuXHRcdGdhbWUuY2FtZXJhLmZvbGxvdyhwbGF5ZXIpO1xuXG5cdFx0Y3Vyc29ycyA9IGdhbWUuaW5wdXQua2V5Ym9hcmQuY3JlYXRlQ3Vyc29yS2V5cygpO1xuXG5cdFx0c3BhY2VQcmVzcyA9IGdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5TUEFDRUJBUik7XG5cdFx0c3BhY2VQcmVzcy5vbkRvd24uYWRkKHRoaXMuZmlyZSwgdGhpcyk7XG5cblxuXG5cdH0sXG5cdHVwZGF0ZTogZnVuY3Rpb24oKSB7XG5cblx0XHRpZiAoY3Vyc29ycy5sZWZ0LmlzRG93bikge1xuXHRcdFx0cGxheWVyLmJvZHkucm90YXRlTGVmdCgxMDApO1xuXHRcdH0gZWxzZSBpZiAoY3Vyc29ycy5yaWdodC5pc0Rvd24pIHtcblx0XHRcdHBsYXllci5ib2R5LnJvdGF0ZVJpZ2h0KDEwMCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBsYXllci5ib2R5LnNldFplcm9Sb3RhdGlvbigpO1xuXHRcdH1cblx0XHRpZiAoY3Vyc29ycy51cC5pc0Rvd24gfHwgYnV0dG9uQURvd24pe1xuXHRcdFx0cGxheWVyLmJvZHkudGhydXN0KDMwMCk7XG5cdFx0fVxuXG5cdFx0aWYgKGpveXBhZCkge1xuXHRcdFx0aWYgKHRoaXMuc3RpY2suaXNEb3duKSB7XG5cdFx0XHRcdGlmICh0aGlzLnN0aWNrLmRpcmVjdGlvbiA9PT0gUGhhc2VyLkxFRlQpIHtcblx0XHRcdFx0XHRwbGF5ZXIuYm9keS5yb3RhdGVMZWZ0KDEwMCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5zdGljay5kaXJlY3Rpb24gPT09IFBoYXNlci5SSUdIVCkge1xuXHRcdFx0XHRcdHBsYXllci5ib2R5LnJvdGF0ZVJpZ2h0KDEwMCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRnYW1lLndvcmxkLndyYXAocGxheWVyLmJvZHksIDAsIGZhbHNlKTtcblx0fSxcblxuXHRmaXJlOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgbWFnbml0dWUgPSAyMjU7XG5cdFx0dmFyIGJ1bGxldCA9IHRoaXMuYWRkLnNwcml0ZShwbGF5ZXIucG9zaXRpb24ueCwgcGxheWVyLnBvc2l0aW9uLnksIGJ1bGxldEJpdG1hcCk7XG5cdFx0YnVsbGV0LmFuY2hvci5zZXRUbygwLjUsMC41KTtcblx0XHRnYW1lLnBoeXNpY3MucDIuZW5hYmxlKGJ1bGxldCk7XG5cdFx0dmFyIGFuZ2xlID0gcGxheWVyLmJvZHkucm90YXRpb24gKyAoMyAqIE1hdGguUEkpIC8gMjtcblx0XHRidWxsZXQuYm9keS5kYXRhLmdyYXZpdHlTY2FsZSA9IDA7XG5cdFx0YnVsbGV0LmJvZHkudmVsb2NpdHkueCA9IG1hZ25pdHVlICogTWF0aC5jb3MoYW5nbGUpICsgcGxheWVyLmJvZHkudmVsb2NpdHkueDtcblx0XHRidWxsZXQuYm9keS52ZWxvY2l0eS55ID0gbWFnbml0dWUgKiBNYXRoLnNpbihhbmdsZSkgKyBwbGF5ZXIuYm9keS52ZWxvY2l0eS55O1xuXHRcdGJ1bGxldHMucHVzaCgwKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdGdhbWUuZGVidWcuY2FtZXJhSW5mbyhnYW1lLmNhbWVyYSwgNTAwLCAyMCk7XG5cdH0sXG5cblx0Y3Jhc2g6IGZ1bmN0aW9uKCkge1xuXHRcdGNvbnNvbGUubG9nKCdjcmFzaHkgY3Jhc2h5Jyk7XG5cdH0sXG5cblx0cHJlc3NCdXR0b25BOiBmdW5jdGlvbigpIHtcblx0XHRidXR0b25BRG93biA9IHRydWU7XG5cdH0sXG5cblx0dXBCdXR0b25BOiBmdW5jdGlvbigpIHtcblx0XHRidXR0b25BRG93biA9IGZhbHNlO1xuXHR9LFxuXG5cdHByZXNzQnV0dG9uQjogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5maXJlKCk7XG5cdH1cblxufTsiXX0=
