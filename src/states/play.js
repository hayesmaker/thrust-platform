/**
 * The play state - this is where the magic happens
 *
 * @namespace states
 * @module play
 * @type {{create: Function, update: Function}}
 */
var player;
var rotateSpeed = 3.5;
var currentSpeed = 0;
var cursors;
var game = window.game;
var ground;
var graphics;
var actors;
var terrain;
var playerColGroup;
var terrainColGroup;
var graphics;

var map;

module.exports = {

	preload: function() {
		game.load.image('thrustmap', 'images/thrust-level2.png');
		game.load.physics('physicsData', 'images/thrust-level2.json');
	},

	create: function() {

		game.world.setBounds(0, 0, 928, 1280);
		game.physics.startSystem(Phaser.Physics.P2JS);

		game.physics.p2.setImpactEvents(true);
		game.physics.p2.gravity.y = 100;

		actors = game.add.group();
		terrain = game.add.group();


		player = game.add.sprite(game.world.centerX, 300);
		actors.add(player);

		game.physics.p2.enable(player, true);


		graphics = new Phaser.Graphics(game, 0,0);
		graphics.lineStyle(4,0xffd900);
		graphics.lineTo(20,40);
		graphics.lineTo(25,40);
		graphics.arc(0,40,25,game.math.degToRad(0), game.math.degToRad(180), false);
		graphics.lineTo(-20,40);
		graphics.lineTo(0,0);
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

		game.physics.p2.enable(map, true);


		map.body.clearShapes();
		map.body.loadPolygon('physicsData', 'thrustmap');
		map.body.static = true;
		//player.body.setCollisionGroup(playerColGroup);
		//player.body.collides(terrainColGroup, this.crash, true);



		//console.log('player dimension:', player.getBounds());

		ground = game.add.sprite(0, 1700);
		//ground.body.setCollisionGroup(terrainColGroup);

		graphics = new Phaser.Graphics(game, 0,0);
		graphics.lineStyle(4, 0xffffff);
		//graphics.lineTo(2000, 0);

		var groundWidth = 2000;
		var peak = 200;
		var up = true;
		for (i = 0; i < groundWidth; i++) {
			if (i % peak === 0) {
				graphics.lineTo( peak + i, up? -Math.random() * peak : 0 );
				up = !up;
			}
		}

		terrain.add(ground);
		game.physics.p2.enable(ground);
		ground.body.static = true;

		ground.addChild(graphics);

		game.camera.follow(player);

		cursors = game.input.keyboard.createCursorKeys();

	},
	update: function() {
		currentSpeed = 0;

		if (cursors.left.isDown) {
			player.body.rotateLeft(100);
		} else if (cursors.right.isDown) {
			player.body.rotateRight(100);
		} else {
			player.body.setZeroRotation();
		}
		if (cursors.up.isDown){
			player.body.thrust(300);
		}

		game.world.wrap(player.body, 0, false);
	},

	render: function() {
		game.debug.cameraInfo(game.camera, 500, 20);
	},

	crash: function() {
		console.log('crashy crashy');
	}
};