import {mpx, pxm, mpxi, pxmi} from '../utils/Pixi2P2';
import p2  from 'p2';
import BodyDebug from '../rendering/body-debug';

const shipTurnSpeed = 5;

export default class Player {

  constructor(camera, world) {
    this.camera = camera;
    this.world = world;
    this.bullets = null;
    this.isLoaded = true;
    this.activeBullets = [];
  }

  setBullets(bulletPool) {
    this.bullets = bulletPool;
  }

  renderSprite() {
    let combinedAtlas = loader.resources[global.ASSETS.textureAtlasPath].textures;
    this.sprite = new Sprite(combinedAtlas['player.png']);
    this.sprite.scale.set(1,1);
    this.sprite.anchor.set(0.5, 0.5);

    let shape = new p2.Box({width: pxm(this.sprite.width), height: pxm(this.sprite.height)});
    shape.collisionGroup = global.COLLISIONS.SHIP;
    shape.collisionMask = global.COLLISIONS.LAND;
    this.body = new p2.Body({mass: 1, position: [pxm(400), pxm(400)]});
    this.body.addShape(shape);
    this.world.addBody(this.body);

    this.camera.world.addChild(this.sprite);
    this.camera.follow(this.sprite);

    /*
    let dubugSpr = new Sprite();
    let graphics = new Graphics();
    this.playerDebug = new BodyDebug(dubugSpr, graphics, this.body, {});
    this.camera.world.addChild(dubugSpr);
    dubugSpr.addChild(graphics);
    */
  }

  update() {
    this.sprite.position.x = mpx(this.body.position[0]);
    this.sprite.position.y = mpx(this.body.position[1]);
    this.sprite.rotation = this.body.angle;
    //this.playerDebug.updateSpriteTransform();
    let i = this.activeBullets.length;
    let activeBullet;
    while (i--) {
      activeBullet = this.activeBullets[i];
      activeBullet.update();
    }
  }

  thrust() {
    this.body.applyForceLocal([0, -4]);
  }

  rotateLeft() {
    this.body.angularVelocity = -shipTurnSpeed;
  }

  rotateRight() {
    this.body.angularVelocity = shipTurnSpeed;
  }

  fire() {
    if (this.isLoaded) {
      this.isLoaded = false;
      let bullet = this.bullets.get();
      bullet.fire(this.camera, this);
      this.activeBullets.push(bullet);
    }
  }

  loadGun() {
    this.isLoaded = true;
  }

  resetAngularForces() {
    this.body.angularVelocity = 0;
  }
}