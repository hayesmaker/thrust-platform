export default class Camera {

  constructor(stage, renderer) {
    this.stage = stage;
    this.renderer = renderer;
    this.target = null;
    this.world = new Container();
    this.stage.addChild(this.world);
    this.worldSize();
    this.viewSize();
  }

  viewSize() {
    this.viewportRect = new Rectangle(0,0, this.renderer.width, this.renderer.height);
  }

  worldSize() {
    this.worldRect = new Rectangle(0,-this.renderer.height*2, this.renderer.width*2, 0);
  }

  updateViewPort(x, y, width, height) {
    this.viewportRect.x = x;
    this.viewportRect.y = y;
    this.viewportRect.width = width;
    this.viewportRect.height = height;
  }

  updateWorldSize(x, y, width, height) {
    this.worldRect.x = x;
    this.worldRect.y = y;
    this.worldRect.width = width;
    this.worldRect.height = height;
  }

  follow(sprite) {
    this.target = sprite;
  }

  followCheck() {
    this.viewportRect.x = this.target.position.x;
    this.viewportRect.y = this.target.position.y;
  }

  xRightCheck() {
    if (this.viewportRect.x > this.worldRect.width) {
      this.viewportRect.x = this.worldRect.width;
    }
  }

  xLeftCheck() {
    if (this.viewportRect.x < this.worldRect.x) {
      this.viewportRect.x = this.worldRect.x;
    }
  }

  yTopCheck() {
    if (this.viewportRect.y < this.worldRect.y) {
      this.viewportRect.y = this.worldRect.y;
    }
  }

  yBottomCheck() {
    if (this.viewportRect.y > this.worldRect.height) {
      this.viewportRect.y = this.worldRect.height;
    }
  }

  updateView () {
    this.stage.pivot.x = this.viewportRect.x;
    this.stage.pivot.y = this.viewportRect.y;
    this.stage.position.x = this.renderer.width/2;
    this.stage.position.y = this.renderer.height/2;
  }

  update() {
    if (this.target) {
      this.followCheck();
      this.xLeftCheck();
      this.xRightCheck();
      this.yTopCheck();
      this.yBottomCheck();
      this.updateView();
    }
  }
}
