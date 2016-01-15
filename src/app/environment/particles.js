'use strict';
/**
 * Manager for particle effects,
 * currently houses the swirl effect uses when the player jumps into a level
 *
 * @class particles
 * @type {{group: null, manager: null, emitter: null, init: Function, create: Function, startSwirl: Function}}
 * @static
 */
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

  /**
   * creates the magic smoke particle emitter
   * and adds to the game world.
   *
   * @method create
   */
  create: function() {
    this.group = game.add.group();
    this.group.fixedToCamera = false;
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

  /**
   * Starts a magic smoke particle swirl animation
   * at the specified xy coords.
   *
   * @method startSwirl
   * @param x
   * @param y
   */
  startSwirl: function(x, y) {
    this.emitter.emit('magicSmokeEmitter', x - 100, y + 100);
  }

};