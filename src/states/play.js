/**
 * The play state - this is where the magic happens
 *
 * @namespace states
 * @module play
 * @type {{create: Function, update: Function}}
 */
var player;
var currentSpeed = 0;
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

module.exports = {

	preload: function() {
		game.load.image('thrustmap', 'images/thrust-level2.png');
		game.load.physics('physicsData', 'images/thrust-level2.json');
		game.load.image('stars', 'images/starfield.png');
		game.load.atlas('dpad', 'images/virtualjoystick/skins/dpad.png', 'images/virtualjoystick/skins/dpad.json')
	},

	create: function() {
		//game.touchControl = this.game.plugins.add(Phaser.Plugin.TouchControl);
		//game.touchControl.inputEnable();

		pad = game.plugins.add(Phaser.VirtualJoystick);
		this.stick = pad.addDPad(0, 0, 200, 'dpad');
		this.stick.alignBottomLeft();

		buttonA = pad.addButton(615, 400, 'dpad', 'button1-up', 'button1-down');
		buttonA.onDown.add(this.pressButtonA, this);
		buttonA.onUp.add(this.upButtonA, this);

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
		player.body.collideWorldBounds = true;



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

		game.camera.follow(player);

		cursors = game.input.keyboard.createCursorKeys();

		var pad = game.plugins.add(Phaser.VirtualJoystick);
		var stick = pad.addStick(x, y, distance, 'arcade');

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

		if (this.stick.isDown) {
			if (this.stick.direction === Phaser.LEFT) {
				player.body.rotateLeft(100);
			} else if (this.stick.direction === Phaser.RIGHT) {
				player.body.rotateRight(100);
			}
		}




		game.world.wrap(player.body, 0, false);
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
	}

};