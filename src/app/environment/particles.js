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
   *
   */
  manager: null,

  /**
   * @property emitter
   * @type {Phaser.ParticleStorm.Emitter}
   */
  emitter: null,

  noRefuel: true,

  /**
   * @method init
   */
  init: function() {
    this.manager = game.plugins.add(Phaser.ParticleStorm);
  },

  /*
   function create() {

     manager = this.game.plugins.add(Phaser.ParticleStorm);

     var data = {
       lifespan: 4000,
       image: '4x4',
       vy: { min: 1, max: 2 },
       alpha: { initial: 0, value: 1, control: [ { x: 0, y: 1 }, { x: 1, y: 0 } ] }
     };

     manager.addData('basic', data);

     emitter = manager.createEmitter();

     //  Create three Gravity Wells on the Emitter.
     var well1 = emitter.createGravityWell(200, 100, 1);
     var well2 = emitter.createGravityWell(300, 300, 1);
     var well2 = emitter.createGravityWell(600, 400, 1);

     circle = manager.createCircleZone(32);
     emitter.addToWorld();
     emitter.emit('basic', 0, 0, { zone: circle, total: 10, repeat: -1, frequency: 20 });
     game.add.image(432, 487, 'logo');

   }
   */

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

    var transporterOrbParticle = game.make.bitmapData(2, 2);
    transporterOrbParticle.ctx.fillStyle = '#0000ff';
    transporterOrbParticle.ctx.beginPath();
    transporterOrbParticle.ctx.fillRect(0,0,2,2);
    transporterOrbParticle.ctx.closePath();

    game.cache.addBitmapData('transportParticle', transporterParticle);
    game.cache.addBitmapData('transportOrbParticle', transporterOrbParticle);

    var fuelEmitterData = {
      lifespan: 3000,
      image: game.cache.getBitmapData('transportParticle'),
      vy: { min: 1, max: 2 },
      alpha: { initial: 0, value: 1, control: [ { x: 0, y: 1 }, { x: 1, y: 0 } ] }
    };

    this.manager.addData('magicSmokeEmitter', this.magicSmokeEmitter);
    this.manager.addData('magicSmoke', this.magicSmoke);
    this.manager.addData('transporter', {image: game.cache.getBitmapData('transportParticle')});
    this.manager.addData('transporterOrb', {image: game.cache.getBitmapData('transportOrbParticle')});
    this.manager.addData('fuelEmitter', fuelEmitterData);
    this.emitter = this.manager.createEmitter();
    this.emitter.addToWorld(this.group);
  },

  /**
   *
   * @param start
   * @param target
   */
  startRefuel: function(start, target) {
    this.noRefuel = false;
    this.target = target;
    this.well1 = this.emitter.createGravityWell(target.x, target.y, 1);
    var circle = this.manager.createCircleZone(32);
    this.emitter.emit('fuelEmitter', start.x, start.y, { zone: circle, total: 5, repeat: -1, frequency: 10 });
    this.refuelEmitterEvent = this.emitter.timerEvent;
  },

  updateFuelTarget: function(target) {
    this.well1.position.x = target.x;
    this.well1.position.y = target.y;
  },

  stopRefuel: function() {
    this.noRefuel = true;
    game.time.events.remove(this.refuelEmitterEvent);
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



  /**
   * @method playerTeleport
   * @param x
   * @param y
   * @param boundCallback {Function}
   */
  playerTeleport: function(x, y, boundCallback) {
    var circle = this.manager.createCircleZone(25);
    this.emitter.emit('transporter', x, y, {zone: circle, total: 5, repeat: 80, frequency: 1});
    if (boundCallback) {
      game.time.events.add(2000, boundCallback);
    }
  },

  orbTeleport: function(x, y) {
    var circle = this.manager.createCircleZone(25);
    this.emitter.emit('transporterOrb', x, y, {zone: circle, total: 5, repeat: 80, frequency: 1});
  }

};