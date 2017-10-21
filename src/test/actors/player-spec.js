import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const {expect} = chai;
import Player from '../../app/pixi/actors/Player';


describe('Player Actor Tests', function () {
  let player;
  //let mockStage;
  beforeEach(function () {
    player = new Player();
  });

  afterEach(function () {
    //mockStage = null;
    player = null;
  });

  it('Camera should be defined', function () {
    expect(player).to.exist;
  });
});