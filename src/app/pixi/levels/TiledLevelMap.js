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

    //console.log('renderSprites :: textureData', textureData);
    //console.log('renderSprites :: gameData', gameData);

    /*
    this.sprite = new Sprite(combinedAtlas['level-1_0012.png']);
    this.sprite.scale.set(1, -1);
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.x = 200;
    this.sprite.y = -200;
    this.camera.world.addChild(this.sprite);
    */

    let frames = this.getFramesArr(level1Data, textureData);
    let x, y, tileWidth, tileHeight;
    /*
    var standardTileSize = this.levelData.tileSize || this.defaultTileSize;
    var tileWidth = standardTileSize * this.levelData.mapScale;
    var tileHeight = standardTileSize * this.levelData.mapScale;
    var numTilesWide = this.levelData.world.width / tileWidth;
    */
    /*
     x = Math.floor(index % numTilesWide) * tileWidth;
     y = Math.floor(index / numTilesWide) * tileHeight;
     tile = game.add.sprite(x, y, this.key, frame.index, this.spriteBatch);
     tile.scale.setTo(this.levelData.mapScale);
     */
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
      //console.log('index %s frame=', index, x, y);
      this.camera.world.addChild(tile);
    });
    this.initPhysics();
  }

  initPhysics() {
    let data = loader.resources[global.ASSETS.level1PhysicsPath].data['level-1'];
    console.log('level1Physics=', data);
    /*
     "width": 1536,
     "height": 1000
     */
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
      c.updateTriangles();
      c.updateCenterOfMass();
      c.updateBoundingRadius();

      body.addShape(c, cm);
    }

    body.aabbNeedsUpdate = true;
    this.world.addBody(body);

    let spr = new Sprite();
    let graphics = new Graphics();
    let bodyDebug = new BodyDebug(spr, graphics, body, {});
    this.camera.world.addChild(spr);
    spr.addChild(graphics);




  }

  getFramesArr(level1Data, textureData) {
    let result = _.pickBy(textureData.frames, function(value, key) {
      return _.startsWith(key, level1Data.atlasData.levelKey);
    });
    let array = _.map(result, (value, key) => {
      return {
        frame:value,
        key: key
      };
    });
    //onsole.log('getFramesArr', array)  ;
    return array;
  }

}
