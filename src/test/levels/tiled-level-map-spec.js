import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const {expect} = chai;
import TiledLevelMap from '../../app/pixi/levels/TiledLevelMap';

describe('TiledLevelMap Tests', function () {

  let levelMap;
  let mockStage;
  beforeEach(function () {
    //mockStage = new Container();
    //mockStage.name = 'stageMock';
    levelMap = new TiledLevelMap({
      world: {
        addChild: function() {}
      }
    });
  });

  afterEach(function () {
    //mockStage = null;
    levelMap = null;
  });

  it('LevelMap should be defined', function () {
    expect(levelMap).to.exist;
  });

});