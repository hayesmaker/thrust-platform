import {mpx, pxm, mpxi, pxmi} from '../utils/Pixi2P2';
import p2  from 'p2';
import BodyDebug from '../rendering/body-debug';

export default class PlayerBullet {

  constructor(camera, world) {
    this.camera = camera;
    this.world = world;
    this.sprite = null;
  }

  renderSprite() {
    let graphics = new Graphics();
    graphics.lineStyle(5, 0xff0000, 0.8);
    graphics.moveTo(0,0);
    graphics.lineTo(25, 0);
    this.sprite = new Sprite();
    this.sprite.addChild(graphics);
    this.camera.world.addChild(this.sprite);
    this.sprite.x = 0;
    this.sprite.y = 0;

    this.initPhysics();
    this.initDebug();
  }

  initPhysics() {
    console.log('bulletwidth', pxm(100), this.sprite.width);
    var shape = new p2.Line({
      width: 2
    });
    //var circleShape = new p2.Circle({radius: pxm(100)});
    //circleShape.sensor = false;
    this.body = new p2.Body({
      mass: 0.1,
      position: [
        pxm(200),
        pxm(200)
      ],
      angularVelocity: 1
    });

    this.body.addShape(shape);
    this.world.addBody(this.body);
    this.camera.world.addChild(this.sprite);

    /*
    let boxShape = new p2.Box({width: Pixi2P2.p2(this.sprite.width), height: Pixi2P2.p2(this.sprite.height)});
    this.boxBody = new p2.Body({
      mass: 1,
      position: [
        Pixi2P2.p2(this.renderer.width / 2),
        Pixi2P2.p2(this.renderer.height / 2)
      ],
      angularVelocity: 0
    });
    this.boxBody.addShape(boxShape);
    this.world.addBody(this.boxBody);
    this.camera.world.addChild(this.sprite);
    this.camera.follow(this.sprite);
    */
  }

  initDebug() {
    let spr = new Sprite();
    let graphics = new Graphics();
    this.debug = new BodyDebug(spr, graphics, this.body, {});
    this.camera.world.addChild(spr);
    spr.addChild(graphics);
  }

  update() {
    //this.sprite.position.x = mpx(this.circleBody.position[0]);
    //this.sprite.position.y = mpx(this.circleBody.position[1]);
    this.sprite.rotation = this.body.angle;
    this.debug.updateSpriteTransform();
  }


}