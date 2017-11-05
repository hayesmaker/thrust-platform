import p2 from 'p2';
import Camera from '../rendering/camera';
import TiledLevelMap from '../levels/TiledLevelMap';
import BulletPool from '../utils/BulletPool';
import Player from '../actors/Player';

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
    this.initKeyboardControl();
    this.map = new TiledLevelMap(this.camera, this.world);
    this.map.renderSprites();
    this.player = new Player(this.camera, this.world);
    this.player.renderSprite();
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

  initKeyboardControl() {
    window.onkeydown = (evt) => {
      this.handleKey(evt.keyCode, true);
    };
    window.onkeyup = (evt) => {
      this.handleKey(evt.keyCode, false);
    };
    window.onkeypress = (evt) => {
      this.handleKeyPress(evt.keyCode, false);
    };
  }

  handleKeyPress(code) {
    switch (code) {
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
        if (!isDown) {
          this.player.loadGun();
        }
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
      this.player.thrust();
    }
    if (this.keyShoot) {
      this.player.fire();
    }
    if (this.keyLeft) {
      this.player.rotateLeft();
    } else if (this.keyRight) {
      this.player.rotateRight();
    } else {
      this.player.resetAngularForces();
    }
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
