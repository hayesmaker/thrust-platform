
export default class Load {
  constructor(stage) {
    this.start();
    this.stage = stage;
  }


  start () {
    this.preload();
  }

  preload () {
    loader.add('assets/atlas/combined.json')
      .load(this.create.bind(this));
  }

  create () {
    console.log('Texture Atlas loaded');

    let combinedAtlas = loader.resources['assets/atlas/combined.json'].textures;
    let sprite = new Sprite(combinedAtlas['player.png']);
    this.stage.addChild(sprite);
    sprite.scale.set(10,10);

  }

  load () {

  }

  update () {
    console.log('load :: update');
  }
}

/*
module.exports = {

  start: function() {
    gameLoop.currentState = this;
    this.preload();
  },

  preload: function() {

  },

  create: function() {

  },

  load: function() {

  },

  update: function() {
    console.log('load :: update');
  },

  complete: function() {

  }

};
  */