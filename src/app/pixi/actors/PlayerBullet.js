import {mpx, pxm, mpxi, pxmi} from '../utils/Pixi2P2';
import p2  from 'p2';
import BodyDebug from '../rendering/body-debug';

export default class PlayerBullet {
  constructor() {
    /**
     * 350 is the previous firing magnitude default
     * trying 400 now to see if it plays better
     *
     * @property bulletSpeed
     * @type {number}
     * @default 350
     */
    this.bulletSpeed = 10;
    /**
     * @property lifespan
     * @type {number}
     */
    this.lifespan = 2000;
    /**
     * @property halfPi
     * @type {number}
     */
    this.halfPi = Math.PI * 0.5;
    this.active = false;
    this.sprite = null;
    this.createSprite();
    this.createBody();
    this.w = 15;
    this.h = 2;
  }

  createSprite() {
    let graphics = new Graphics();
    graphics.lineStyle(1, 0x4affff, 1);
    graphics.drawRect(-7.5,-0.5, 15, 1);
    this.sprite = new Sprite();
    this.sprite.addChild(graphics);
    this.sprite.anchor.set(0.5,0.5);
  }

  createBody() {
    let shape = new p2.Box({
      width: pxm(15), height: pxm(2)
    });
    this.body = new p2.Body({
      mass: 1,
      angularVelocity: 0
    });
    this.body.addShape(shape);
  }

  initDebug(camera) {
    let spr = new Sprite();
    let graphics = new Graphics();
    this.debug = new BodyDebug(spr, graphics, this.body, {});
    camera.world.addChild(spr);
    spr.addChild(graphics);
  }

  update() {
    this.sprite.position.x = mpx(this.body.position[0]);
    this.sprite.position.y = mpx(this.body.position[1]);
    this.sprite.rotation = this.body.angle;
    //this.debug.updateSpriteTransform();
  }

  fire(camera, world, player) {

    this.active = true;
    camera.world.addChild(this.sprite);
    world.addBody(this.body);
    let angle = player.body.angle - this.halfPi;
    let r = player.sprite.width * 0.5;
    let x = player.sprite.position.x + Math.cos(angle) * r;
    let y = player.sprite.position.y + Math.sin(angle) * r;
    this.body.position = [pxm(x), pxm(y)];
    this.body.velocity = [this.bulletSpeed * Math.cos(angle), this.bulletSpeed * Math.sin(angle)];
    this.body.angle = angle;
    //console.log('bullet fire', r, player.sprite.position.x, player.sprite.position.y, angle);
    //this.initDebug(camera);
  }

  destroy() {

  }


}