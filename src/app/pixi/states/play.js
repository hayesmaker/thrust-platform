import p2 from 'p2';
import Camera from '../rendering/camera';
import TiledLevelMap from '../levels/TiledLevelMap';
import BulletPool from '../utils/BulletPool';
import Player from '../actors/Player';
import InputHandler from '../commands/InputHandler';

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
    this.camera = new Camera(this.stage, this.renderer);
  }

  start() {
    this.hasStarted = true;
    this.create();
  }

  create() {
    this.world = new p2.World({gravity: [0, 1]});
    this.world.setGlobalStiffness(1e18);
    this.world.defaultContactMaterial.restitution = 0.1;
    this.world.on(
      "impact", function (evt) {
        let bodyA = evt.bodyA;
        let bodyB = evt.bodyB;
        console.log('impact', bodyA.id, bodyB.id);
        if (bodyA.shapes[0].collisionGroup == global.COLLISIONS.BULLET) this.checkBulletToGround(bodyA, bodyB);
        if (bodyB.shapes[0].collisionGroup == global.COLLISIONS.BULLET) this.checkBulletToGround(bodyB, bodyA);

      }.bind(this));
    this.addDebugBg();
    //this.initKeyboardControl();
    this.map = new TiledLevelMap(this.camera, this.world);
    this.map.renderSprites();
    this.player = new Player(this.camera, this.world);
    this.player.renderSprite();
    this.inputHanlder = new InputHandler(this, this.player);
    this.inputHanlder.initPlayCommands();
    this.inputHanlder.initKeyboardControl();
    this.initStaticMemory();
  }

  checkBulletToGround(bullet, impact) {
    if (impact.shapes[0].collisionGroup === global.COLLISIONS.LAND) {
      if (bullet.parent.active) {
        this.bulletPool.release(bullet.parent);
      }
    }
  }

  initStaticMemory() {
    this.bulletPool = new BulletPool(this.world);
    this.player.setBullets(this.bulletPool);
  }

  addDebugBg() {
    let graphics = new Graphics();
    graphics.lineStyle(2, 0x00abcc, 0.5);
    let spr = new Sprite();
    this.camera.world.addChild(spr);
    spr.x = 0;
    spr.y = 0;
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
    graphics.moveTo(x, y);
    for (let i = 0; i < numRows; i++) {
      graphics.moveTo(x, 1000 - i * vSpc);
      graphics.lineTo(w, 1000 - i * vSpc);
    }
  }

  update() {
    if (this.isPaused) {
      return;
    }
    if (!this.hasStarted) {
      this.start();
    }
    this.inputHanlder.handleInput();
    if (this.player.sprite.position.y >= 600) {
      TweenLite.to(this.camera, 1, {zoomLevel: 1.5});
    } else {
      TweenLite.to(this.camera, 1, {zoomLevel: 1});
    }
    this.camera.update();
    this.world.step(1 / 60);
    if (this.player) {
      this.player.update();
    }
  }

  /**
   * @deprecated
   * @returns {number}
   */
  calculateSpeed() {
    return Math.sqrt(
      Math.pow(this.boxBody.velocity[0], 2) +
      Math.pow(this.boxBody.velocity[1], 2)
    );
  }
}
