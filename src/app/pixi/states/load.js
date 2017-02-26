
export default class Load {
  constructor(stage) {
    this.hasStarted = false;
    this.stage = stage;
    this.onComplete = null;
    this.onCompleteContext = null;
  }


  start () {
    this.hasStarted = true;
    this.preload();
  }

  preload () {
    loader.add(global.ASSETS.textureAtlasPath)
      .load(this.create.bind(this));
  }

  create () {
    console.log('Texture Atlas loaded');
    this.complete();
  }

  load () {

  }

  update () {
    if (!this.hasStarted) {
      this.start();
    }
    console.log('load update');
  }

  complete () {
    this.nextState();
  }

  nextState() {
    if (this.onComplete && this.onCompleteContext) {
      this.onComplete.call(this.onCompleteContext);
    }

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