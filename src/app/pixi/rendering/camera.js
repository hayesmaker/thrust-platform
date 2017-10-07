export default class Camera {

  set zoomLevel(val) {
    if (val != this.zoom) {
      this.zoomTo(val);
    }
    this.zoom = val;
  }

  get zoomLevel() {
    return this.zoom;
  }

  /**
   * @constructor
   * @param stage
   * @param renderer
   * @param x
   * @param y
   * @param w
   * @param h
   */
  constructor(stage, renderer,x,y,w,h) {
    this.stage = stage;
    this.renderer = renderer;
    this.target = null;
    this.world = new Container();
    this.stage.addChild(this.world);
    this.zoom = 1;

    /*
     "world": {
     "width": 1536,
     "height": 1000
     },
     "mapPosition": {
     "x": 0,
     "y": 730
     },
     */

    x = x || 0;
    y = y || 0;
    w = w || 1546;
    h = h || 1000;

    this.defaultWorld(x,y,w,h);
    this.defaultView();
    this.addDebugShiz();
  }

  addDebugShiz() {
    var graphics = new Graphics();
    graphics.lineStyle(14, 0x00ffff, 0.8);
    graphics.drawRect(0,0,this.worldRect.width,this.worldRect.height);
    let border = new Sprite();
    this.world.addChild(border);
    border.x = 0;
    border.y = 0;
    border.addChild(graphics);

    graphics = new Graphics();
    graphics.lineStyle(5, 0xff0000, 0.25);
    graphics.drawRect(this.renderer.width/2, this.renderer.height/2, this.world.width - this.renderer.width, this.world.height - this.renderer.height);
    let innerBorder = new Sprite();
    this.world.addChild(innerBorder);
    innerBorder.x = 0;
    innerBorder.y = 0;
    innerBorder.addChild(graphics);

  }

  defaultView() {
    this.viewportRect = new Rectangle(0, 0, this.renderer.width, this.renderer.height);
  }

  defaultWorld(x,y,w,h) {
    //this.worldRect = new Rectangle(0, -this.renderer.height*3, this.renderer.width*3, 0);
    this.worldRect = new Rectangle(x,y,w,h);
  }

  updateViewport(x, y, width, height) {
    this.viewportRect.x = x;
    this.viewportRect.y = y;
    this.viewportRect.width = width;
    this.viewportRect.height = height;
  }

  updateWorldSize(x, y, width, height) {
    this.worldRect.x = Math.floor(x);
    this.worldRect.y = Math.floor(y);
    this.worldRect.width = Math.floor(width);
    this.worldRect.height = Math.floor(height);
  }

  zoomTo(val) {
    if (val !== this.zoom) {
      this.zoom = val;
      this.world.scale.set(val, val);
      this.updateWorldSize(
        this.worldRect.x,
        this.worldRect.y,
        this.worldRect.width,
        this.worldRect.height
      );
    }
    /*
     this.updateViewport(
     this.viewportRect.x * val,
     this.viewportRect.y * val,
     this.viewportRect.width * val,
     this.viewportRect.height * val
     );
     */

  }

  follow(sprite) {
    this.target = sprite;
  }

  followCheck() {
    this.viewportRect.x = this.target.position.x;
    this.viewportRect.y = this.target.position.y;
  }

  xRightCheck() {
    var rightBoundary = this.worldRect.width - (this.renderer.width * 0.5) / this.zoom;
    if (this.viewportRect.x > rightBoundary) {
      this.viewportRect.x = rightBoundary;
    }
  }

  xLeftCheck() {
    var leftBoundary = this.worldRect.x + (this.renderer.width * 0.5) / this.zoom;
    if (this.viewportRect.x < leftBoundary) {
      this.viewportRect.x = leftBoundary;
    }
  }

  yBottomCheck() {
    var bottomBandary = this.worldRect.height - (this.renderer.height/2) / this.zoom;
    if (this.viewportRect.y > bottomBandary) {
      this.viewportRect.y = bottomBandary;
    }
  }

  yTopCheck() {
    var topBoundary = (this.renderer.height/2) / this.zoom;
    if (this.viewportRect.y < topBoundary) {
      this.viewportRect.y = topBoundary;
    }
  }

  updateView() {
    this.stage.pivot.x = Math.floor(this.viewportRect.x * this.zoom);
    this.stage.pivot.y = Math.floor(this.viewportRect.y * this.zoom);
    this.stage.position.x = Math.floor(this.renderer.width * 0.5);
    this.stage.position.y = Math.floor(this.renderer.height * 0.5);
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
