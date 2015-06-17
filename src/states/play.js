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
