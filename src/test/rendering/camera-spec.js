import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const {expect} = chai;
import Camera from '../../app/pixi/rendering/camera';


describe('Camera Tests', function () {
  let camera;
  let mockStage;
  beforeEach(function () {
    mockStage = new Container();
    mockStage.name = "stageMock";
    camera = new Camera(
      mockStage,
      {
        name: 'rendererMock',
        width: 1024,
        height: 768
      });
  });

  afterEach(function () {
    mockStage = null;
    camera = null;
  });

  it('Camera should be defined', function () {
    expect(camera).to.exist;
  });

  it('Camera stage should be passed as first arg', function () {
    expect(camera.stage.name).to.equal('stageMock');
  });

  it('Camera renderer should be passed as 2nd arg', function () {
    expect(camera.renderer.name).to.equal('rendererMock');
  });

  it('Camera target should be null be defualt', function () {
    expect(camera.target).to.be.null;
  });

  it('Camera world should be a new Container', function () {
    expect(camera.world).to.be.an.instanceof(Container);
  });

  it('Camera World Container should be added to display list', function () {
    expect(camera.stage.children.length).to.equal(1);
    expect(camera.stage.children[0]).to.eql(camera.world);
  });

  it('Camera World boundaries should be created with defaults', function () {
    expect(camera.worldRect.x).to.equal(0);
    expect(camera.worldRect.y).to.equal(-768 * 3);
    expect(camera.worldRect.width).to.equal(1024 * 3);
    expect(camera.worldRect.height).to.equal(0);
  });

  it('Camera Viewport should be created with defaults', function () {
    expect(camera.viewportRect.x).to.equal(0);
    expect(camera.viewportRect.y).to.equal(0);
    expect(camera.viewportRect.width).to.equal(1024);
    expect(camera.viewportRect.height).to.equal(768);
  });

  it('updateViewport makes it possible to update viewport boundaries', function () {
    camera.updateViewport(20, 40, 800, 720);
    expect(camera.viewportRect.x).to.equal(20);
    expect(camera.viewportRect.y).to.equal(40);
    expect(camera.viewportRect.width).to.equal(800);
    expect(camera.viewportRect.height).to.equal(720);
  });

  it('updateWorldSize makes it possible to update World boundaries', function () {
    camera.updateWorldSize(20, 40, 800, 720);
    expect(camera.worldRect.x).to.equal(20);
    expect(camera.worldRect.y).to.equal(40);
    expect(camera.worldRect.width).to.equal(800);
    expect(camera.worldRect.height).to.equal(720);
  });

  it('zoomTo should update the world container scale values', function () {
    camera.zoomTo(2);
    expect(camera.world.scale.x).to.equal(2);
    expect(camera.world.scale.y).to.equal(2);
  });

  xit('zoomTo should also update the worldRect boundaries', function () {
    camera.worldRect.x = 0;
    camera.worldRect.y = 1536;
    camera.worldRect.width = 2048;
    camera.worldRect.height = 0;
    camera.zoomTo(1.6);
    expect(camera.worldRect.x).to.equal(0);
    expect(camera.worldRect.y).to.equal(2457);
    expect(camera.worldRect.width).to.equal(3276);
    expect(camera.worldRect.height).to.equal(0);
  });

  it('follow should set the follow target for camera to follow', function () {
    camera.follow({
      name: 'player',
      x: 0,
      y: 10
    });
    expect(camera.target.name).to.equal('player');
  });

  it('follow checking 1 - viewport position should update according to follow target position', function () {
    camera.follow({position: {x: 250, y: 100}});
    camera.followCheck();
    expect(camera.viewportRect.x).to.equal(250);
    expect(camera.viewportRect.y).to.equal(100);
  });

  it('follow checking 2 (called twice) - viewport position should update according to follow target ' +
    'position', function () {
    camera.follow({
      position: {x: 350, y: 100}
    });
    camera.followCheck();
    camera.followCheck();
    expect(camera.viewportRect.x).to.equal(350);
    expect(camera.viewportRect.y).to.equal(100);
  });

  /*
   var rightBoundary = this.worldRect.width - (this.renderer.width * 0.5) / this.zoom;
   if (this.viewportRect.x > rightBoundary) {
   this.viewportRect.x = rightBoundary;
   }
   */

  it('xRightCheck given the viewport position x is higher than the world boundary width' +
    'ensure that viewportRect.x ' +
    'does not exceed the World boundary', function () {
    camera.viewportRect.x = 1025;
    camera.worldRect.width = 1024;
    camera.xRightCheck();
    expect(camera.viewportRect.x).to.equal(0);
  });

  it('xRightCheck given the viewport position x is lower than the world boundary width' +
    'ensure that viewportRect position is not updated', function () {
    camera.viewportRect.x = -1;
    camera.worldRect.width = 1024;
    camera.xRightCheck();
    expect(camera.viewportRect.x).to.equal(-1);
  });

  it('xLeftCheck given the viewport position x is lower than the world boundary position' +
    'ensure that viewportRect.x ' +
    'does not exceed the World boundary', function () {
    camera.viewportRect.x = -10;
    camera.worldRect.x = 0;
    camera.xLeftCheck();
    expect(camera.viewportRect.x).to.equal(0);
  });

  it('xLeft given the viewport position x is lower than the world boundary width' +
    'ensure that viewport position is not updated', function () {
    camera.viewportRect.x = 20;
    camera.worldRect.x = 0;
    camera.xLeftCheck();
    expect(camera.viewportRect.x).to.equal(20);
  });

  /*
   var topBoundary = this.worldRect.height;
   if (this.viewportRect.y > topBoundary) {
   this.viewportRect.y = topBoundary;
   }
   */

  it('yTopCheck given the viewport position y is lower than the world boundary position ensure' +
    'the viewport is not updated', function () {
    camera.viewportRect.y = 1530;
    camera.worldRect.height = 1536;
    camera.yTopCheck();
    expect(camera.viewportRect.y).to.equal(1530);
  });

  it('yTopCheck given the viewport position y is greater than the world boundary ' +
    'ensure the viewportRect.y does not exceed the world boundary', function () {
    camera.viewportRect.y = 800;
    camera.worldRect.height = 790;
    camera.yTopCheck();
    expect(camera.viewportRect.y).to.equal(790);
  });

  /*
   var bottomBoundary = this.worldRect.y + this.renderer.height;
   if (this.viewportRect.y < bottomBoundary) {
   this.viewportRect.y = bottomBoundary;
   }
   */

  it('yBottomCheck given the vieport position y is greater than the worldRect ensure the viewport is ' +
    'not updated', function () {
    camera.viewportRect.y = 700;
    camera.worldRect.height = 650;
    camera.yBottomCheck();
    expect(camera.viewportRect.y).to.equal(700);
  });

  it('yBottomCheck given the vieport position y is lower than the worldRect' +
    'height then ensure the viewport position does not exceed the world boundary', function () {
    camera.viewportRect.y = 600;
    camera.worldRect.height = 650;
    camera.yBottomCheck();
    expect(camera.viewportRect.y).to.equal(600);
  });

  it('updateView should align the stage pivot to the viewport position', function () {
    camera.viewportRect.x = 250;
    camera.viewportRect.y = 500;
    camera.updateView();
    expect(camera.stage.pivot.x).to.equal(250);
    expect(camera.stage.pivot.y).to.equal(500);
  });

  it('updateView should align the stage position to the renderer center point', function () {
    camera.renderer.width = 1024;
    camera.renderer.height = 768;
    camera.updateView();
    expect(camera.stage.position.x).to.equal(512);
    expect(camera.stage.position.y).to.equal(384);
  });

  it('given a follow target update should call all the correct checks' +
    'and update the view', function () {
    camera.target = {x: 100, y: 50};
    sinon.stub(camera, 'followCheck');
    sinon.stub(camera, 'xLeftCheck');
    sinon.stub(camera, 'xRightCheck');
    sinon.stub(camera, 'yTopCheck');
    sinon.stub(camera, 'yBottomCheck');
    sinon.stub(camera, 'updateView');
    camera.update();
    expect(camera.followCheck).to.have.been.calledOnce;
    expect(camera.xLeftCheck).to.have.been.calledOnce;
    expect(camera.xRightCheck).to.have.been.calledOnce;
    expect(camera.yTopCheck).to.have.been.calledOnce;
    expect(camera.yBottomCheck).to.have.been.calledOnce;
    expect(camera.updateView).to.have.been.calledOnce;
    camera.followCheck.restore();
    camera.xLeftCheck.restore();
    camera.xRightCheck.restore();
    camera.yTopCheck.restore();
    camera.yBottomCheck.restore();
    camera.updateView.restore();
  });

  it('given no follow target camera updates should not occur', function () {
    camera.target = null;
    sinon.stub(camera, 'followCheck');
    sinon.stub(camera, 'xLeftCheck');
    sinon.stub(camera, 'xRightCheck');
    sinon.stub(camera, 'yTopCheck');
    sinon.stub(camera, 'yBottomCheck');
    sinon.stub(camera, 'updateView');
    camera.update();
    expect(camera.followCheck).not.to.have.been.called;
    expect(camera.xLeftCheck).not.to.have.been.called;
    expect(camera.xRightCheck).not.to.have.been.called;
    expect(camera.yTopCheck).not.to.have.been.called;
    expect(camera.yBottomCheck).not.to.have.been.called;
    expect(camera.updateView).not.to.have.been.called;
    camera.followCheck.restore();
    camera.xLeftCheck.restore();
    camera.xRightCheck.restore();
    camera.yTopCheck.restore();
    camera.yBottomCheck.restore();
    camera.updateView.restore();
  });


});