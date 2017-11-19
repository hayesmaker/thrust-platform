import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const {expect} = chai;
import InputHandler from '../../app/pixi/commands/InputHandler';
import PlayerStub from '../stubs/PlayerStub';
import StateStub from '../stubs/StateStub';
import NullCommand from '../../app/pixi/commands/NullCommand';


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

  describe(';; initPlayCommands', function() {

  });


});