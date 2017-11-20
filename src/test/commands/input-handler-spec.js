import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const {expect} = chai;
import InputHandler from '../../app/pixi/commands/InputHandler';
import PlayerStub from '../stubs/PlayerStub';
import StateStub from '../stubs/StateStub';
import NullCommand from '../../app/pixi/commands/NullCommand';
import PlayerFireCommand from '../../app/pixi/commands/FireCommand';
import ThrustCommand from '../../app/pixi/commands/ThrustCommand';
import RotateRightCommand from '../../app/pixi/commands/RotateRightCommand';
import RotateLeftCommand from '../../app/pixi/commands/RotateLeftCommand';
import PlayerLoadCommand from '../../app/pixi/commands/PlayerLoadCommand';
import RotateResetCommand from '../../app/pixi/commands/RotateResetCommand';

describe('InputHandler Tests', function () {
  let inputHandler;
  let mockState = new StateStub();
  let mockPlayer = new PlayerStub();

  beforeEach(function () {
    inputHandler = new InputHandler(mockState, mockPlayer);
  });

  afterEach(function () {
    inputHandler = null;
  });

  it('InputHandler should be defined', function () {
    expect(inputHandler).to.exist;
  });

  describe(':: constructor', function() {

    it('should set the state', function() {
      expect(inputHandler.state instanceof StateStub).to.equal(true);
    });

    it('should set the player actor', function() {
      expect(inputHandler.player instanceof PlayerStub).to.equal(true);
    });

    it('should correct set a null command', function() {
      expect(inputHandler.nullCommand instanceof NullCommand).to.equal(true);
    });

    it ('should set keyLeft is down default', function() {
      expect(inputHandler.keyLeft).to.equal(false);
    });

    it ('should set keyRight is down default', function() {
      expect(inputHandler.keyRight).to.equal(false);
    });

    it ('should set keyDown is down default', function() {
      expect(inputHandler.keyDown).to.equal(false);
    });

    it ('should set keyUp is down default', function() {
      expect(inputHandler.keyUp).to.equal(false);
    });

    it ('should set keySpace is down default', function() {
      expect(inputHandler.keySpace).to.equal(false);
    });

    it ('should set keySpace is up default', function() {
      expect(inputHandler.keySpaceUp).to.equal(true);
    });
  });

  describe(':: initPlayCommands', function() {

    beforeEach(function() {
      inputHandler.initPlayCommands();
    });

    afterEach(function() {

    });

    it('should set button X to PlayerFire', function() {
      expect(inputHandler.buttonX instanceof PlayerFireCommand).to.equal(true);
      expect(inputHandler.buttonX.player).to.eql(mockPlayer);
    });

    it('should set button Y to ThrustCommand', function() {
      expect(inputHandler.buttonY instanceof ThrustCommand).to.equal(true);
      expect(inputHandler.buttonY.player).to.eql(mockPlayer);
    });

    it('should set button A to PlayerFire', function() {
      expect(inputHandler.buttonA instanceof PlayerFireCommand).to.equal(true);
      expect(inputHandler.buttonA.player).to.eql(mockPlayer);
    });

    it('should set button B to ThrustCommand', function() {
      expect(inputHandler.buttonB instanceof ThrustCommand).to.equal(true);
      expect(inputHandler.buttonB.player).to.eql(mockPlayer);
    });

    it('should set padRight to RotateRightCommand', function() {
      expect(inputHandler.padRight instanceof RotateRightCommand).to.equal(true);
      expect(inputHandler.padRight.player).to.eql(mockPlayer);
    });

    it('should set padLeft to RotateLeftCommand', function() {
      expect(inputHandler.padLeft instanceof RotateLeftCommand).to.equal(true);
      expect(inputHandler.padLeft.player).to.eql(mockPlayer);
    });


    it('should set fireUp to PlayerLoadCommand', function() {
      expect(inputHandler.fireUp instanceof PlayerLoadCommand).to.equal(true);
      expect(inputHandler.fireUp.player).to.eql(mockPlayer);
    });

    it('should reset to RotateResetCommand', function() {
      expect(inputHandler.reset instanceof RotateResetCommand).to.equal(true);
      expect(inputHandler.reset.player).to.eql(mockPlayer);
    });

    it('should padUp to NullCommand', function() {
      expect(inputHandler.padUp instanceof NullCommand).to.equal(true);
    });

    it('should padDown to NullCommand', function() {
      expect(inputHandler.padDown instanceof NullCommand).to.equal(true);
    });


  });


});