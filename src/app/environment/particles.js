var ui = require('../ui');

module.exports = {
  group: null,
  /**
   * @property manager
   */
  manager: null,

  /**
   * @property emitter
   */
  emitter: null,

  /**
   * @method init
   */
  init: function() {
    this.manager = game.plugins.add(Phaser.ParticleStorm);
  },

  create: function() {
    this.group = game.add.group();
    this.group.fixedToCamera = true;

    this.magicSmokeEmitter = {
      _image: 'smoke_r',
      visible: false,
      lifespan: 2500,
      emit: {
        name: 'magicSmoke',
        value: 2,
        control: [ { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 } ]
      }
    };

    this.magicSmoke = {
      image: 'smoke_r',
      lifespan: 3000,
      rotation: { value: -90.0, delta: 4 },
      vy: -2,
      facingAcceleration: { initial: 0.1, value: 0, delta: 0 },
      scaleX: { value: 1.5, control: [ { x: 0, y: 0 }, { x: 0.5, y: 1 }, { x: 1, y: 0 } ] },
      scaleY: { value: 1.5, control: [ { x: 0, y: 0 }, { x: 0.5, y: 1 }, { x: 1, y: 0 } ] },
      alpha: 0.5
    };

    this.manager.addData('magicSmokeEmitter', this.magicSmokeEmitter);
    this.manager.addData('magicSmoke', this.magicSmoke);

    this.emitter = this.manager.createEmitter();
    this.emitter.addToWorld(this.group);
  },

  startSwirl: function() {
    this.emitter.emit('magicSmokeEmitter', game.width/2 - 100, game.height/2 + 100);
  }

};