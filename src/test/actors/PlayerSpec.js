var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require("sinon-chai");
var expect = chai.expect;
var mocks = require('mocks');

chai.should();
chai.use(sinonChai);

var Player = require('../../app/actors/Player');
var TractorBeam = require('../../app/actors/TractorBeam');
var Groups = require('../../app/environment/Groups');
var Collisions = require('../../app/environment/Collisions');


describe("Player tests", function () {
  var sandbox;
  var player;
  var groups;
  var collisions;
  var tractorBeam;
  var x = 500;
  var y = 300;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    groups = sinon.createStubInstance(Groups);
    collisions = mocks.collisions();
    tractorBeam = sinon.createStubInstance(TractorBeam);
    sandbox.stub(Player.prototype, 'createTurret');
    sandbox.stub(Player.prototype, 'init');
    sandbox.stub(Phaser.Sprite, 'call');
    player = new Player(x, y, collisions, groups);
  });

  afterEach(function () {
    sandbox.restore();
    player =  null;
  });

  describe("constructor: ", function () {
    beforeEach(function() {

    });

    afterEach(function() {

    });

    it("this.collisions is set correctly", function () {
      player.collisions.should.eql(collisions);
    });

    it("this.groups is set correctly", function () {
      player.groups.should.eql(groups);
    });

    it("tractorBeam default is null", function () {
      expect(player.tractorBeam).to.be.null;
    });

    it("player sprite should be created at correct position", function () {
      expect(Phaser.Sprite.call).to.have.been.calledWith(player, game, 500, 300);
    });

    it("init is called", function () {
      Player.prototype.init.should.be.called;
    });
  });

  describe("init:", function () {

    beforeEach(function() {
      player.init.restore();
      player.body = mocks.body;
      player.position = {
        x: x,
        y: y
      }
    });

    afterEach(function() {
      sandbox.stub(player, 'init');
    });

    it("player physics are enabled", function () {
      player.init();
      expect(game.physics.p2.enable).to.have.been.calledWith(player);
    });

    it("player physics body is set correctly", function () {
      player.init();
      player.body.should.eql(mocks.body);
    });

    it("turret creator is called", function () {
      player.init();
      player.createTurret.should.have.been.called;
    });

    it("player collision with terrain is set correctly", function () {
      player.init();
      player.body.collides.should.have.been.calledWith([collisions.enemyBullets, collisions.terrain, collisions.orb], player.crash, player);
    });
  });

  describe("shoot:", function () {
    it("player shoots from turret", function () {
      player.turret = {
        fire: sinon.stub()
      };

      player.fire();
      player.turret.fire.should.have.been.called;
    });
  });


});