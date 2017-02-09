import p2 from 'p2';
import * as Pixi2P2 from '../utils/Pixi2P2';

const shipTurnSpeed = 5;

export default class Play {
  constructor(stage) {
    this.stage = stage;
    this.hasStarted = false;
    this.keyShoot = false;
    this.keyLeft = false;
    this.keyUp = false;
    this.keyRight = false;
    this.keyDown = false;
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

    this.initKeyboardControl();

    let combinedAtlas = loader.resources[global.textureAtlasPath].textures;
    this.sprite = new Sprite(combinedAtlas['player.png']);
    this.stage.addChild(this.sprite);
    this.sprite.scale.set(1, -1);
    this.sprite.anchor.set(0.5, 0.5);
    let boxShape = new p2.Box({width: Pixi2P2.p2(this.sprite.width), height: Pixi2P2.p2(this.sprite.height) });
    this.boxBody = new p2.Body({mass: 1, position: [1,1], angularVelocity: 0});
    this.boxBody.addShape(boxShape);
    this.world.addBody(this.boxBody);
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
    console.log('play :: update');
  }
}
