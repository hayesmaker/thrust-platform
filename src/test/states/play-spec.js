/*jshint expr: true*/

var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require("sinon-chai");
var expect = chai.expect;
var mocks = require('mocks');

var proxyquire = require('proxyquireify')(require);
var play = proxyquire('../../app/states/play', mocks.stubs);

chai.should();
chai.use(sinonChai);

describe("Phaser Play State Tests", function() {

  describe('state.preload', function() {

    beforeEach(function() {
      sinon.stub(game.load, 'atlas');
      sinon.stub(game.load, 'image');
      sinon.stub(game.load, 'physics');
    });

    afterEach(function() {
      game.load.atlas.restore();
      game.load.image.restore();
      game.load.physics.restore();
    });

    it('if joypad is enabled, load the virtual joystick assets', function() {
      game.controls.isJoypadEnabled = true;
      play.preload();
      expect(game.load.atlas).to.have.been.calledWith('dpad', 'assets/images/virtualjoystick/skins/dpad.png', 'assets/images/virtualjoystick/skins/dpad.json');
    });

    it('if joypad is not enabled, do not load the virtual joystick assets', function() {
      game.controls.isJoypadEnabled = false;
      play.preload();
      expect(game.load.atlas).not.to.have.been.called;
    });

    it('if background is enabled, load the starfield asset', function() {
      play.preload();
      expect(game.load.image).to.have.been.calledWith('stars', 'assets/images/starfield.png');
    });

    it('smoke particle image should be loaded', function() {
      play.preload();
      expect(game.load.image).to.have.been.calledWith('smoke_r', 'assets/images/smoke_colors.png');
    });

    it('player ship image should be loaded', function() {
      play.preload();
      expect(game.load.image).to.have.been.calledWith('player', 'assets/actors/player.png');
    });

    it('player phyics data should be loaded', function() {
      play.preload();
      expect(game.load.physics).to.have.been.calledWith('playerPhysics', 'assets/actors/player.json');
    });

    it('all level map images should be loaded', function() {
      play.preload();
      expect(game.load.image).to.have.been.calledWith('mapImage', 'assets/levels/level_6_x2.png');
    });

    it('all level map physics data should be loaded', function() {
      play.preload();
      expect(game.load.physics).to.have.been.calledWith('mapPhysics', 'assets/levels/level_6.json');
    });
  });

  describe('state.create', function() {

    beforeEach(function() {
      sinon.stub(play, 'defineWorldBounds');
      sinon.stub(play, 'createActors');
      sinon.stub(play, 'createUi');
      sinon.stub(play, 'createGroupLayering');
      sinon.stub(play, 'startLevelIntro');
    });

    afterEach(function() {
      play.defineWorldBounds.restore();
      play.createActors.restore();
      play.createUi.restore();
      play.createGroupLayering.restore();
      play.startLevelIntro.restore();
    });

    it('should define world bounds', function() {
      play.create();
      expect(play.defineWorldBounds).to.have.been.calledOnce;
    });

    it('should create actors', function() {
      play.create();
      expect(play.createActors).to.have.been.calledOnce;
    });

    it('should create the in-game ui', function() {
      play.create();
      expect(play.createUi).to.have.been.calledOnce;
    });

    it('should create group layering', function() {
      play.create();
      expect(play.createGroupLayering).to.have.been.calledOnce;
    });

    it('should start the level intro', function() {
      play.create();
      expect(play.startLevelIntro).to.have.been.calledOnce;
    });

    //todo test create methods

  });

  describe('state.update', function() {

    beforeEach(function() {
      sinon.stub(game.stats, 'begin');
      sinon.stub(game.stats, 'end');
      sinon.stub(play, 'checkPlayerInput');
      sinon.stub(play, 'actorsUpdate');
      sinon.stub(play, 'uiUpdate');
      sinon.stub(play, 'checkGameCondition');
    });

    afterEach(function() {
      game.stats.begin.restore();
      game.stats.end.restore();
      play.checkPlayerInput.restore();
      play.actorsUpdate.restore();
      play.uiUpdate.restore();
      play.checkGameCondition.restore();
    });

    it('should check for user input', function() {
      play.update();
      expect(play.checkPlayerInput).to.have.been.calledOnce;
    });

    it('should update game actors', function() {
      play.update();
      expect(play.actorsUpdate).to.have.been.calledOnce;
    });

    it('should update the ui', function() {
      play.update();
      expect(play.uiUpdate).to.have.been.calledOnce;
    });

    it('should check game condition', function() {
      play.update();
      expect(play.checkGameCondition).to.have.been.calledOnce;
    });

    //todo test update methods

  });


});