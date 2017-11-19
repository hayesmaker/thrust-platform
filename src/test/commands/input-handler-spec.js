import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const {expect} = chai;
import InputHandler from '../../app/pixi/commands/InputHandler';


describe('InputHandler Tests', function () {
  let inputHandler;
  //let mockStage;
  beforeEach(function () {
    inputHandler = new InputHandler({}, {});
  });

  afterEach(function () {
    //mockStage = null;
    inputHandler = null;
  });

  it('InputHandler should be defined', function () {
    expect(inputHandler).to.exist;
  });
});