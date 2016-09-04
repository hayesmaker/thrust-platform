/*jshint expr: true*/

var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require("sinon-chai");
var expect = chai.expect;
var mocks = require('mocks');

var stubs = {
  '../properties': require('../mocks/properties-mock'),
  '../data/level-manager': require('../mocks/data/level-manager')
};


var proxyquire = require('proxyquireify')(require);
var state = proxyquire('../../app/states/load', stubs);
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

    it('should load the virtual joystick assets', function() {
      game.controls.isJoypadEnabled = true;
      state.preload();
      expect(game.load.atlas).to.have.been.calledWith('dpad', 'assets/images/virtualjoystick/skins/dpad.png', 'assets/images/virtualjoystick/skins/dpad.json');
    });

    it('combined levels and actors texture atlas should be loaded', function() {
      state.preload();
      expect(game.load.atlas).to.have.been.calledWith('combined', 'assets/atlas/combined.png', 'assets/atlas/combined.json');
    });

    it('player phyics data should be loaded', function() {
      state.preload();
      expect(game.load.physics).to.have.been.calledWith('playerPhysics', 'assets/physics/player.json');
    });

    it('all level map physics data should be loaded', function() {
      state.preload();
      expect(game.load.physics).to.have.been.calledWith('mapPhysics-map', 'assets/levels/level_6.json');
    });

  });

  describe('state.create', function() {



  });



});