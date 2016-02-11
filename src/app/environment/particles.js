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

  /**
   * creates the magic smoke particle emitter
   * and adds to the game world.
   *
   * @method create
   */
  create: function() {
    this.group = game.add.group();
    this.group.fixedToCamera = false;

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

    var fuelParticle = game.make.bitmapData(2, 2);
    fuelParticle.ctx.fillStyle = '#00ff00';
    fuelParticle.ctx.beginPath();
    fuelParticle.ctx.fillRect(0,0,2,2);
    fuelParticle.ctx.closePath();

    game.cache.addBitmapData('transportParticle', transporterParticle);
    game.cache.addBitmapData('transportOrbParticle', transporterOrbParticle);
    game.cache.addBitmapData('fuelParticle', fuelParticle);

    var fuelEmitterData = {
      lifespan: 1750,
      image: game.cache.getBitmapData('fuelParticle'),
      vy: { min: 0, max: 0 },
      alpha: {
        initial: 0,
        value: 0.5,
        control: [
          { x: 0, y: 1 },
          { x: 1, y: 0 }
        ]
      }
    };

    this.manager.addData('fuelEmitter', fuelEmitterData);
    this.manager.addData('transporter', {image: game.cache.getBitmapData('transportParticle')});
    this.manager.addData('transporterOrb', {image: game.cache.getBitmapData('transportOrbParticle')});

    this.emitter = this.manager.createEmitter();
    this.emitter.addToWorld(this.group);
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