var chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

var Player = require('../../src/actors/Player'),
	TractorBeam = require('../../src/actors/TractorBeam'),
	Groups = require('../../src/environment/Groups'),
	Collisions = require('../../src/environment/Collisions');

var mocks = require('../helpers/mocks');


describe("Player tests", function() {

	var player, initSpy;
	var groups, collisions, tractorBeam, turretStub;

	window.game = mocks.game;

	beforeEach(function() {

		initSpy = sinon.spy(Player.prototype, 'init');
		groups = sinon.createStubInstance(Groups);
		collisions = sinon.createStubInstance(Collisions);
		tractorBeam = sinon.createStubInstance(TractorBeam);
		turretStub = sinon.stub(Player.prototype, 'createTurret');
		player = new Player(collisions, groups);
	});

	afterEach(function() {
		Player.prototype.init.restore();
		Player.prototype.createTurret.restore();
	});

	describe("constructor: ", function() {

		it("this.collisions is set correctly", function() {
			player.collisions.should.eql(collisions);
		});

		it("this.groups is set correctly", function() {
			player.groups.should.eql(groups);
		});

		it("tractorBeam default is null", function() {
			expect(player.tractorBeam).to.be.null;
		});

		it("player sprite should be created at correct position", function() {
			expect(game.make.sprite).to.have.been.calledWith(500, 300);
		});

		it("player sprite is cached", function() {
			expect(player.sprite).to.eql(game.make.sprite());
		});

		it("init is called", function() {
			initSpy.should.be.called;
		});
	});

	describe("init:", function() {

		it("player physics are enabled", function() {
			expect(game.physics.p2.enable).to.have.been.calledWith(player.sprite);
		});

		it("player physics body is set correctly", function() {
			player.body.should.eql(player.sprite.body);
		});

		it("turret creator is called", function() {
			player.createTurret.should.have.been.called;
		});

		it("player collision with terrain is set correctly", function() {
			player.body.collides.should.have.been.calledWith(collisions.terrain, player.crash, player);
		});
	});

	describe("shoot:", function() {
		it("player shoots from turret", function() {
			player.turret = {
				shoot: sinon.stub()
			};

			player.shoot();
			player.turret.shoot.should.have.been.called;
		});
	});


});