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