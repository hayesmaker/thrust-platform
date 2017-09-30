import p2 from 'p2';
import * as Pixi2P2 from '../utils/Pixi2P2';
import Camera from '../rendering/camera';
import TiledLevelMap from '../levels/TiledLevelMap';

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
    this.isPaused = false;
  }

  initCameraWorld() {
    /*
     let options = {
     screenWidth: 800,
     screenHeight: 600,
     width: 5000,
     height: 600,
     centerX: 400,
     centerY: 300
     };
     */
    //this.pixicamWorld = new pixicam.World(options);
    //this.camera = this.pixicamWorld.camera;
    this.camera = new Camera(this.stage, this.renderer);

  }

  start() {
    this.hasStarted = true;
    this.create();
  }

  create() {
    this.stage.scale.y = -1;
    this.world = new p2.World({
      gravity: [0, -1]
    });

    this.addDebugBg();

    this.initKeyboardControl();

    this.map = new TiledLevelMap(this.camera);
    this.map.renderSprites();

    let combinedAtlas = loader.resources[global.ASSETS.textureAtlasPath].textures;
    this.sprite = new Sprite(combinedAtlas['player.png']);
    this.sprite.scale.set(1, -1);
    this.sprite.anchor.set(0.5, 0.5);
    let boxShape = new p2.Box({width: Pixi2P2.p2(this.sprite.width), height: Pixi2P2.p2(this.sprite.height)});
    this.boxBody = new p2.Body({
      mass: 1,
      position: [
        Pixi2P2.p2(this.renderer.width / 2),
        Pixi2P2.p2(-this.renderer.height / 2)
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
    //this.addDebugGraphics();
  }

  addDebugBg() {
    let graphics = new Graphics();
    graphics.lineStyle(2, 0x00abcc, 0.5);
    let spr = new Sprite();
    this.camera.world.addChild(spr);
    spr.x = 0;
    spr.y = -1000;
    spr.addChild(graphics);
    let x = 0,
      y = 0,
      w = 1546,
      h = 1000,
      hSpc = 100,
      vSpc = 100;
    let numCols = w / hSpc;
    let numRows = h / vSpc;
    graphics.moveTo(x, y);
    for (let i = 0; i < numCols; i++) {
      graphics.moveTo(i * hSpc, y);
      graphics.lineTo(i * hSpc, h);
    }
    graphics.moveTo(x,y);
    for (let i = 0; i < numRows; i++) {
      graphics.moveTo(x, 1000 - i * vSpc);
      graphics.lineTo(w, 1000 - i * vSpc);
    }
  }

  initKeyboardControl() {
    // Catch key down events
    window.onkeydown = (evt) => {
      this.handleKey(evt.keyCode, true);
    };

    // Catch key up events
    window.onkeyup = (evt) => {
      this.handleKey(evt.keyCode, false);
    };

    window.onkeypress = (evt) => {
      this.handleKeyPress(evt.keyCode, false);
    };
  }

  handleKeyPress(code) {
    switch(code) {
      case 27:
      case 167:
        this.isPaused = !this.isPaused;
        break;
    }
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
    if (this.isPaused) {
      return;
    }

    if (!this.hasStarted) {
      this.start();
    }
    if (this.keyUp) {
      this.boxBody.applyForceLocal([0, 4]);
    }
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
    /*
    this.playerVel = this.calculateSpeed();
    let zoomLevel = Math.abs(1/this.playerVel);
    if (zoomLevel < 0.5) zoomLevel = 0.5;
    if (zoomLevel > 2) zoomLevel = 2;
    console.log('speed %s zoomLevel %s', this.playerVel, zoomLevel);
    */
    if (this.sprite.position.y <= -600) {
      TweenLite.to(this.camera, 1, {zoomLevel: 1.6});
    } else {
      TweenLite.to(this.camera, 1, {zoomLevel: 1});
    }
    this.camera.update();
  }

  calculateSpeed() {
    return Math.sqrt(
      Math.pow(this.boxBody.velocity[0], 2) +
      Math.pow(this.boxBody.velocity[1], 2)
    );
  }
}
