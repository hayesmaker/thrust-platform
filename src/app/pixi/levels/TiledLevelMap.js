import  _ from 'lodash';
import p2 from 'p2';
import {mpx, pxm, mpxi, pxmi} from '../utils/Pixi2P2';
import BodyDebug from '../rendering/body-debug';
import {degToRad} from '../utils/maths';

export default class TiledLevelMap {

  constructor(camera, world) {
    this.camera = camera;
    this.world = world;
  }

  renderSprites() {
    let combinedAtlas = loader.resources[global.ASSETS.textureAtlasPath].textures;
    let textureData = loader.resources[global.ASSETS.textureAtlasPath].data;
    let gameData = loader.resources[global.ASSETS.levelDataPath].data;
    let level1Data = gameData.data[0];
    let frames = this.getFramesArr(level1Data, textureData);
    let x, y, tileWidth, tileHeight;
    let tile;
    let zoom = 2;
    tileWidth = tileHeight = 96 * zoom;
    let worldWidth = 768 * zoom;
    let numTilesWide = worldWidth / tileWidth;
    let h = 270;
    _.each(frames, (frame, index) => {
      x = Math.floor(index % numTilesWide) * tileWidth;
      y = Math.floor(index / numTilesWide) * tileHeight;
      tile = new Sprite(combinedAtlas[frame.key]);
      tile.x = x;
      tile.y = y + 1000-h;
      tile.scale.set(zoom, zoom);
      this.camera.world.addChild(tile);
    });
    this.initPhysics();
  }

  initPhysics() {
    let data = loader.resources[global.ASSETS.level1PhysicsPath].data['level-1'];
    let w = 1536;
    let h = 270;
    let cm = p2.vec2.create();
    let c,v;
    let body = new p2.Body({
      position: [
        pxm(1536/2),
        pxm(1000-h/2)
      ],
      mass: 0
    });
    body.angle = degToRad(180);
    for(let i = 0; i < data.length; i++) {
      let vertices = [];
      for (let s = 0; s < data[i].shape.length; s += 2) {
        vertices.push([pxmi(data[i].shape[s]) * 2, pxmi(data[i].shape[s+1]) * 2]);
      }
      c = new p2.Convex({vertices: vertices});
      for (let j = 0; j !== c.vertices.length; j++) {
        v = c.vertices[j];
        p2.vec2.sub(v, v, c.centerOfMass);
      }
      p2.vec2.scale(cm, c.centerOfMass, 1);
      cm[0] -= pxmi(w/2);
      cm[1] -= pxmi(h/2);
      c.collisionGroup = global.COLLISIONS.LAND;
      c.collisionMask = global.COLLISIONS.SHIP | global.COLLISIONS.BULLET;
      c.updateTriangles();
      c.updateCenterOfMass();
      c.updateBoundingRadius();
      body.addShape(c, cm);
    }
    body.aabbNeedsUpdate = true;
    this.world.addBody(body);
    /*
    let spr = new Sprite();
    let graphics = new Graphics();
    new BodyDebug(spr, graphics, body, {});
    this.camera.world.addChild(spr);
    spr.addChild(graphics);
    */
  }

  getFramesArr(level1Data, textureData) {
    let result = _.pickBy(textureData.frames, function(value, key) {
      return _.startsWith(key, level1Data.atlasData.levelKey);
    });
    return _.map(result, (value, key) => {
      return {
        frame:value,
        key: key
      };
    });
  }
}
