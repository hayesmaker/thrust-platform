var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require("sinon-chai");
var expect = chai.expect;
var play = require('states').play;

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