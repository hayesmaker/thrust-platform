var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require("sinon-chai");
var expect = chai.expect;

var stubs = {
  '../properties': {
    debugPhysics: true,
    collideWorldBounds: true,
    enableJoypad: false,
    fatalCollisions: true,
    scale: {
      mode: Phaser.ScaleManager.NO_SCALE
    },
    stats: true,
    drawBackground: true,
    width: 700,
    height: 500,
    gamePlay: {
      freeOrbLocking: false,
      autoOrbLocking: true,
      tractorBeamLength: 80,
      tractorBeamVariation: 10,
      lockingDuration: 900,
      parallax: true
    },
    levels: [
      {
        mapImgUrl: 'assets/levels/level_6_x2.png',
        mapImgKey: 'thrustmap',
        mapDataUrl: 'assets/levels/level_6.json',
        mapDataKey: 'physicsData',
        world: {width: 3072, height: 4000},
        mapPosition: {x: 0, y: 2000},
        orbPosition: {x: 1000, y: 1000},
        enemies: [
          {x: 1200, y: 1200, rotation: 100},
          {x: 500, y: 500, rotation: 100}
        ],
        enemyFireRate: 1000
      }
    ]
  }
};

var proxyquire = require('proxyquireify')(require);
var play = proxyquire('../../app/states/play', stubs);

chai.should();
chai.use(sinonChai);

describe("Phaser Play State Tests", function() {

  describe('state.preload', function() {

    beforeEach(function() {

      sinon.stub(game.load, 'atlas');

    });

    afterEach(function() {

      game.load.atlas.restore();

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



  });

  it('play play play', function() {
    //expect(mocks.game).to.eql({});
  });



});