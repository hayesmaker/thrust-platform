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

    var transporterParticle = game.make.bitmapData(2, 2);
    transporterParticle.ctx.fillStyle = '#7ca8c6';
    transporterParticle.ctx.beginPath();
    transporterParticle.ctx.fillRect(0,0,2,2);
    transporterParticle.ctx.closePath();
    //transporterParticle.ctx.fill();

    var transporterOrbParticle = game.make.bitmapData(2, 2);
    transporterOrbParticle.ctx.fillStyle = '#0000ff';
    transporterOrbParticle.ctx.beginPath();
    transporterOrbParticle.ctx.fillRect(0,0,2,2);
    transporterOrbParticle.ctx.closePath();

    game.cache.addBitmapData('transportParticle', transporterParticle);
    game.cache.addBitmapData('transportOrbParticle', transporterOrbParticle);
    //game.add.sprite(x, y, game.cache.getBitmapData(key));
    /*
     var data = {
     image: '4x4'
     };

     manager.addData('basic', data);

     //  Creates a Circle zone with a radius of 150px


     emitter = manager.createEmitter();

     emitter.addToWorld();

     emitter.emit('basic', 400, 260, { zone: circle, total: 4, repeat: -1, frequency: 20 });

     game.add.image(432, 487, 'logo');
     */


    this.manager.addData('magicSmokeEmitter', this.magicSmokeEmitter);
    this.manager.addData('magicSmoke', this.magicSmoke);
    this.manager.addData('transporter', {image: game.cache.getBitmapData('transportParticle')});
    this.manager.addData('transporterOrb', {image: game.cache.getBitmapData('transportOrbParticle')});
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
  },

  playerTeleport: function(x, y, boundCallback) {
    var circle = this.manager.createCircleZone(25);
    this.emitter.emit('transporter', x, y, {zone: circle, total: 5, repeat: 80, frequency: 1});
    
  },

  orbTeleport: function(x, y) {
    var circle = this.manager.createCircleZone(25);
    this.emitter.emit('transporterOrb', x, y, {zone: circle, total: 5, repeat: 80, frequency: 1});
  }

};