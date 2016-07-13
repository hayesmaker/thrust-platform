/*jshint expr: true*/

var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require("sinon-chai");
var expect = chai.expect;
var mocks = require('mocks');

var stubs = {
  '../properties': require('../mocks/properties-mock'),
  '../data/level-manager': require('../mocks/data/level-manager'),
  '../data/game-state': require('../mocks/data/game-state')
};

var proxyquire = require('proxyquireify')(require);
var play = proxyquire('../../app/states/play', stubs);

chai.should();
chai.use(sinonChai);

describe("Phaser play state tests", function () {

  describe('play.create', function () {

    beforeEach(function () {
      sinon.stub(play, 'setLevel');
      sinon.stub(play, 'defineWorldBounds');
      sinon.stub(play, 'createActors');
      sinon.stub(play, 'createUi');
      sinon.stub(play, 'createGroupLayering');
      sinon.stub(play, 'startLevelIntro');
      sinon.stub(play, 'missionStart');
      sinon.stub(play, 'showCurrentScreenByState');
    });

    afterEach(function () {
      play.setLevel.restore();
      play.defineWorldBounds.restore();
      play.createActors.restore();
      play.createUi.restore();
      play.createGroupLayering.restore();
      play.startLevelIntro.restore();
      play.missionStart.restore();
      play.showCurrentScreenByState.restore();
    });

    it('should set current level', function () {
      play.create();
      expect(play.setLevel).to.have.been.calledOnce;
    });

    it('should define world bounds', function () {
      play.create();
      expect(play.defineWorldBounds).to.have.been.calledOnce;
    });

    it('should create actors', function () {
      play.create();
      expect(play.createActors).to.have.been.calledOnce;
    });

    it('should create the in-game ui', function () {
      play.create();
      expect(play.createUi).to.have.been.calledOnce;
    });

    it('should create group layering', function () {
      play.create();
      expect(play.createGroupLayering).to.have.been.calledOnce;
    });

    it('if not in dev mode should start main menu', function () {
      //properties.dev.skipIntro
      play.create();
      expect(play.showCurrentScreenByState).to.have.been.calledOnce;
    });

    //todo test create methods

  });

  describe('play.update', function () {

    beforeEach(function () {
      sinon.stub(game.stats, 'begin');
      sinon.stub(game.stats, 'end');
      sinon.stub(play, 'checkPlayerInput');
      sinon.stub(play, 'actorsUpdate'); 
      sinon.stub(play, 'uiUpdate');
      sinon.stub(play, 'checkGameCondition');
      sinon.stub(play, 'updateCamera');
    });

    afterEach(function () {
      game.stats.begin.restore();
      game.stats.end.restore();
      play.checkPlayerInput.restore();
      play.actorsUpdate.restore();
      play.uiUpdate.restore();
      play.checkGameCondition.restore();
      play.updateCamera.restore();
    });

    it('should check for user input', function () {
      play.update();
      expect(play.checkPlayerInput).to.have.been.calledOnce;
    });

    it('should update game actors', function () {
      play.update();
      expect(play.actorsUpdate).to.have.been.calledOnce;
    });

    it('should update the ui', function () {
      play.update();
      expect(play.uiUpdate).to.have.been.calledOnce;
    });

    it('should check game condition', function () {
      play.update();
      expect(play.checkGameCondition).to.have.been.calledOnce;
    });

    it('should update camera for derp scrolling', function(){
      play.update();
      expect(play.updateCamera).to.have.been.calledOnce;
    });

    //todo test update methods

  });


});