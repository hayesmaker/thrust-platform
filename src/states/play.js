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
		if (isXDown) {
			this.checkDistance();
		}

		if (isOrbLocked) {
			this.drawTractorBeam();
		}

		if (buttonBDown) {
				player.body.thrust(200);
				this.checkDistance();
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

	checkDistance: function() {
		var distance = this.distAtoB(player.sprite.position, orb.sprite.position);
		if (distance < tractorBeamLength) {
			this.drawTractorBeam();
			if (!isTractorBeamActive) {
				isTractorBeamActive = true;
				tractorBeamTimer.start();
				tractorBeamTimer.add(1000, this.enableOrbLock);
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

	drawTractorBeam: function() {
		beamGfx.clear();
		var colour = isOrbLocked? 0xEF5696 : 0x00ff00;
		var alpha = isOrbLocked? 0.5 : 0.5;
		beamGfx.lineStyle(5, colour, alpha);
		beamGfx.moveTo(player.sprite.position.x, player.sprite.position.y);
		beamGfx.lineTo(orb.sprite.position.x, orb.sprite.position.y);
	},

	lockOrb: function() {
		if (isOrbLocked) {
			return;
		}
		isOrbLocked = true;
		var maxForce = 100000;
		var beamSpr = game.add.sprite(orb.sprite.x, orb.sprite.y);
		game.physics.p2.enable(beamSpr, properties.debugPhysics);
		var diffX = player.sprite.position.x - orb.sprite.position.x;
		var diffY = player.sprite.position.y - orb.sprite.position.y;
		beamSpr.body.collideWorldBounds = properties.collideWorldBounds;
		beamSpr.body.mass = 0.5;
	//	beamSpr.body.clearShapes();
		game.physics.p2.createRevoluteConstraint(beamSpr, [0, 0], orb.sprite, [0,0], maxForce);
		game.physics.p2.createRevoluteConstraint(beamSpr, [diffX,diffY], player.sprite, [0,0], maxForce);
		orb.move();
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
		this.releaseTractorBeam();
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
