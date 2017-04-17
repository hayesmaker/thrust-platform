export default class TiledLevelMap {

  constructor(camera) {
    this.camera = camera;
    //this.renderSprites();
  }

  renderSprites() {
    let combinedAtlas = loader.resources[global.ASSETS.textureAtlasPath].textures;
    this.sprite = new Sprite(combinedAtlas['level-1_0012.png']);
    this.sprite.scale.set(1, -1);
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.x = 200;
    this.sprite.y = -200;
    this.camera.world.addChild(this.sprite);

  }

}
