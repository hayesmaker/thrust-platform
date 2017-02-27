import chai from 'chai';
chai.should();
let expect = chai.expect;
import Camera from '../../app/pixi/rendering/camera';

describe('Camera Tests', function() {
  let camera;

  beforeEach(function() {
    camera = new Camera({
      addChild: function() {}
    }, {});
  });

  it('Camera should be defined', function() {
    expect(camera).to.exist;
  });

});