import p2 from 'p2';
import * as Pixi2P2 from '../utils/Pixi2P2';
import Camera from '../rendering/camera';

const shipTurnSpeed = 5;

export default class Play {
  constructor(stage, renderer) {
    this.stage = stage;
    this.renderer = renderer;
    this.initCameraWorld();
    this.hasStarted = false;
    this.keyShoot = false;
    this.keyLeft = false;
    this.keyUp = false;
    this.keyRight = false;
    this.keyDown = false;
  }

  initCameraWorld() {

    let options = {
      screenWidth: 800,
      screenHeight: 600,
      width: 5000,
      height: 600,
      centerX: 400,
      centerY: 300
    };
    //this.pixicamWorld = new pixicam.World(options);
    //this.camera = this.pixicamWorld.camera;
    this.camera = new Camera(this.stage, this.renderer);

  }

  start() {
    this.hasStarted = true;
    this.create();
  }

  create() {
    this.meter = new FPSMeter({
      interval:  100,     // Update interval in milliseconds.
      smoothing: 10,      // Spike smoothing strength. 1 means no smoothing.
      show:      'fps',   // Whether to show 'fps', or 'ms' = frame duration in milliseconds.
      toggleOn:  'click', // Toggle between show 'fps' and 'ms' on this event.
      decimals:  1,       // Number of decimals in FPS number. 1 = 59.9, 2 = 59.94, ...
      maxFps:    60,      // Max expected FPS value.
      threshold: 100,     // Minimal tick reporting interval in milliseconds.

      // Meter position
      position: 'absolute', // Meter position.
      zIndex:   10,         // Meter Z index.
      left:     '5px',      // Meter left offset.
      top:      '5px',      // Meter top offset.
      right:    'auto',     // Meter right offset.
      bottom:   'auto',     // Meter bottom offset.
      margin:   '0 0 0 0',  // Meter margin. Helps with centering the counter when left: 50%;

      // Theme
      theme: 'colorful', // Meter theme. Build in: 'dark', 'light', 'transparent', 'colorful'.
      heat:  1,      // Allow themes to use coloring by FPS heat. 0 FPS = red, maxFps = green.

      // Graph
      graph:   1, // Whether to show history graph.
      history: 20 // How many history states to show in a graph.
    });
    this.stage.scale.y = -1;
    this.world = new p2.World({
      gravity: [0, -1]
    });

    this.initKeyboardControl();
    let combinedAtlas = loader.resources[global.ASSETS.textureAtlasPath].textures;
    this.sprite = new Sprite(combinedAtlas['player.png']);
    this.sprite.scale.set(1, -1);
    this.sprite.anchor.set(0.5, 0.5);
    let boxShape = new p2.Box({width: Pixi2P2.p2(this.sprite.width), height: Pixi2P2.p2(this.sprite.height) });
    this.boxBody = new p2.Body({
      mass: 1,
      position: [
      Pixi2P2.p2(this.renderer.width/2),
      Pixi2P2.p2(-this.renderer.height/2)
    ], 
      angularVelocity: 0
    });
    this.boxBody.addShape(boxShape);
    this.world.addBody(this.boxBody);
    this.camera.world.addChild(this.sprite);
    this.camera.follow(this.sprite);
    //this.stage.addChild(this.sprite);
    //this.camera.follow(this.sprite);
    //this.stage.addChild(this.stage);
    //this.pixicamWorld.addChild(this.sprite);
    this.addDebugGraphics();
  }

  addDebugGraphics () {
    let graphics = new Graphics();
    // set a fill and line style
    //graphics.beginFill(0xFF3300);
    graphics.lineStyle(4, 0xffd900, 1);
    graphics.moveTo(0,0);
    graphics.lineTo(250, 50);
    graphics.lineTo(100, 100);
    graphics.lineTo(50, 50);
    graphics.lineTo(-500, 0);
    graphics.lineTo(1500, 400);
    graphics.lineTo(2000, -1000);
    graphics.lineTo(-2000, 0);

    let spr = new Sprite();
    this.camera.world.addChild(spr);
    spr.x = this.renderer.width/2;
    spr.y = -this.renderer.height/2;
    spr.addChild(graphics);
  }

  initKeyboardControl() {
    // Catch key down events
    window.onkeydown = function (evt) {
      this.handleKey(evt.keyCode, true);
    }.bind(this);

    // Catch key up events
    window.onkeyup = function (evt) {
      this.handleKey(evt.keyCode, false);
    }.bind(this);

    // Handle key up or down
  }

  handleKey(code, isDown) {
    switch (code) {
      case 32:
        this.keyShoot = isDown;
        break;
      case 37:
        this.keyLeft = isDown;
        break;
      case 38:
        this.keyUp = isDown;
        break;
      case 39:
        this.keyRight = isDown;
        break;
      case 40:
        this.keyDown = isDown;
        break;
    }
  }

  update() {
    if (!this.hasStarted) {
      this.start();
    }

    if (this.keyUp) {
      this.boxBody.applyForceLocal([0, 4]);
    }
    // Set velocities
    if (this.keyLeft) {
      this.boxBody.angularVelocity = shipTurnSpeed;
    } else if (this.keyRight) {
      this.boxBody.angularVelocity = -shipTurnSpeed;
    } else {
      this.boxBody.angularVelocity = 0;
    }

    this.world.step(1 / 60);

    if (this.sprite) {
      this.sprite.position.x = Pixi2P2.pixi(this.boxBody.position[0]);
      this.sprite.position.y = Pixi2P2.pixi(this.boxBody.position[1]);
      this.sprite.rotation = this.boxBody.angle;
    }

    this.camera.update();

    //this.camera.update();
    //this.pixicamWorld.update();

    console.log('play :: update');
  }
}
