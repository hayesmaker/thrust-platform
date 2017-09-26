import  {_} from 'lodash';

export default class TiledLevelMap {

  constructor(camera) {
    this.camera = camera;
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

    _.each(frames, (frame, index) => {
      x = Math.floor(index % numTilesWide) * tileWidth;
      y = Math.floor(index / numTilesWide) * -tileHeight;
      tile = new Sprite(combinedAtlas[frame.key]);
      tile.x = x;
      tile.y = y - 730;
      tile.scale.set(2, -2);
      //console.log('index %s frame=', index, x, y);
      this.camera.world.addChild(tile);
    });

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
