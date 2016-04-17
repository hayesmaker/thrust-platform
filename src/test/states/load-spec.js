/*jshint expr: true*/

var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require("sinon-chai");
var expect = chai.expect;
var mocks = require('mocks');
var proxyquire = require('proxyquireify')(require);
var state = proxyquire('../../app/states/load', mocks.stubs);
chai.should();
chai.use(sinonChai);

describe("Phaser load state tests", function() {

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
      state.preload();
      expect(game.load.atlas).to.have.been.calledWith('dpad', 'assets/images/virtualjoystick/skins/dpad.png', 'assets/images/virtualjoystick/skins/dpad.json');
    });

    it('if joypad is not enabled, do not load the virtual joystick assets', function() {
      game.controls.isJoypadEnabled = false;
      state.preload();
      expect(game.load.atlas).not.to.have.been.called;
    });

    it('if background is enabled, load the starfield asset', function() {
      state.preload();
      expect(game.load.image).to.have.been.calledWith('stars', 'assets/images/space.jpg');
    });

    it('player ship image should be loaded', function() {
      state.preload();
      expect(game.load.image).to.have.been.calledWith('player', 'assets/actors/player.png');
    });

    it('player phyics data should be loaded', function() {
      state.preload();
      expect(game.load.physics).to.have.been.calledWith('playerPhysics', 'assets/actors/player.json');
    });

    it('all level map images should be loaded', function() {
      state.preload();
      expect(game.load.image).to.have.been.calledWith('mapImage', 'assets/levels/level_6_x2.png');
    });

    it('all level map physics data should be loaded', function() {
      state.preload();
      expect(game.load.physics).to.have.been.calledWith('mapPhysics-map', 'assets/levels/level_6.json');
    });

    it('fuel cell image should be loaded', function() {
      state.preload();
      expect(game.load.image).to.have.been.calledWith('fuelImage', 'assets/actors/fuel.png');
    });

  });

  describe('state.create', function() {



  });



});