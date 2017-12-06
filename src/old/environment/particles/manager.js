'use strict';
/**
 * Manager for particle effects,
 * currently houses the swirl effect uses when the player jumps into a level
 *
 * @class manager
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

  /**
   * @property powerEmitter
   * @type {Phaser.ParticleStorm.Emitter}
   */
  powerEmitter: null,

  /**
   * @property enabled
   */
  enabled: true,

  /**
   * @method init
   */
  init: function () {
    this.manager = game.plugins.add(Phaser.ParticleStorm);
  },

  enable: function() {
    this.enabled = true;
  },

  disable: function() {
    this.enabled = false;
  },

  /**
   * creates the magic smoke particle emitter
   * and adds to the game world.
   *
   * @method create
   */
  create: function () {

    this.group = game.add.group();
    this.group.fixedToCamera = false;

    //var smoke = game.make.image(0,0,'combined', 'smoke-particle.png');

    var explodeParticle = game.make.bitmapData(2, 2);
    explodeParticle.ctx.fillStyle = '#ffffff';
    explodeParticle.ctx.beginPath();
    explodeParticle.ctx.fillRect(0, 0, 2, 2);
    explodeParticle.ctx.closePath();

    var transporterParticle = game.make.bitmapData(2, 2);
    transporterParticle.ctx.fillStyle = '#f0ff00';
    transporterParticle.ctx.beginPath();
    transporterParticle.ctx.fillRect(0, 0, 2, 2);
    transporterParticle.ctx.closePath();

    var transporterOrbParticle = game.make.bitmapData(2, 2);
    transporterOrbParticle.ctx.fillStyle = '#42ff00';
    transporterOrbParticle.ctx.beginPath();
    transporterOrbParticle.ctx.fillRect(0, 0, 2, 2);
    transporterOrbParticle.ctx.closePath();

    var fuelParticle = game.make.bitmapData(2, 2);
    //fuelParticle.circle(0, 0, 1, 'rgb(255,255,255)');
    fuelParticle.ctx.fillStyle = '#3CFFFF';
    fuelParticle.ctx.fillRect(0, 0, 2, 2);

    game.cache.addBitmapData('transportParticle', transporterParticle);
    game.cache.addBitmapData('transportOrbParticle', transporterOrbParticle);
    game.cache.addBitmapData('fuelParticle', fuelParticle);
    game.cache.addBitmapData('explodeParticle', explodeParticle);

    var teleportEmitterData = {
      lifespan: 400,
      image: game.cache.getBitmapData('fuelParticle')
    };

    var teleportEmitterDataOrb = {
      lifespan: 400,
      image: game.cache.getBitmapData('fuelParticle'),
      hsv: {initial: 0, value: 359, control: 'linear'}
    };

    var fuelEmitterData = {
      lifespan: 850,
      image: game.cache.getBitmapData('fuelParticle'),
      vy: {min: 0, max: 0},
      alpha: {
        initial: 0,
        value: 1,
        control: [
          {x: 0, y: 1},
          {x: 1, y: 0}
        ]
      }
    };

    var lifeSpan = game.device.isMobile ?
    {min: 2000, max: 4000} : {min: 1000, max: 2000};

    var smokeData = {
      lifespan: lifeSpan,
      hsv: 299,
      image: 'combined',
      frame: 'smoke-particle.png',
      vx: {min: -0.1, max: 0.1},
      vy: -1,
      scale: {min: 0.01, max: 0.1},
      alpha: {value: 0, delta: 0.005}
    };

    var fuelExplodeEmitter = {
      lifespan: {min: 500, max: 1250},
      image: game.cache.getBitmapData('fuelParticle'),
      scale: {min: 0.25, max: 1.5},
      rotation: {delta: 4},
      velocity: {radial: {arcStart: -15, arcEnd: 15}, initial: {min: 1, max: 3}}
    };

    var explodeEmitterData = {
      lifespan: {min: 500, max: 1000},
      image: game.cache.getBitmapData('explodeParticle'),
      scale: {min: 0.5, max: 2},
      rotation: {delta: 3},
      velocity: {radial: {arcStart: -30, arcEnd: 20}, initial: {min: 3, max: 6}}
    };

    this.manager.addData('explode', explodeEmitterData);
    this.manager.addData('fuelEmitter', fuelEmitterData);
    this.manager.addData('transporter', teleportEmitterData);
    this.manager.addData('fuelExplode', fuelExplodeEmitter);
    this.manager.addData('smoke', smokeData);

    this.powerEmitter = this.manager.createEmitter(Phaser.ParticleStorm.SPRITE_BATCH);
    this.powerEmitter.addToWorld(this.group);

    this.emitter = this.manager.createEmitter(Phaser.ParticleStorm.SPRITE_BATCH);
    this.emitter.addToWorld(this.group);
  },

  /**
   * @method playerTeleport
   * @param x
   * @param y
   * @param boundCallback {Function}
   */
  playerTeleport: function (x, y, boundCallback) {
    var circle = this.manager.createCircleZone(25/2);
    this.emitter.force.y = 0;
    this.emitter.emit('transporter', x, y, {
      zone: circle,
      total: 20,
      repeat: 10,
      frequency: 100
    });
    if (boundCallback) {
      game.time.events.add(1000, boundCallback);
    }
  },

  orbTeleport: function (x, y) {
    var circle = this.manager.createCircleZone(25/2);
    this.emitter.force.y = 0;
    this.emitter.emit('transporter', x, y, {
      zone: circle,
      total: 20,
      repeat: 10,
      frequency: 100
    });
  },

  explode: function (x, y) {
    this.emitter.force.y = 0.1;
    this.emitter.emit('explode', x, y, {total: 20});
  },

  fuelExplode: function (x, y) {
    this.emitter.force.y = -0.005;
    this.emitter.emit('fuelExplode', x, y, {total: 80});
  },

  emitPower: function (x, y) {
    console.log('particle-manager :: emitPower :: x,y', x, y, this.enabled);
    if (this.enabled) {
      var freqency = game.device.isMobile ? 100 : 50;
      this.powerEmitter.force.y = -0.0001;
      this.powerEmitter.emit('smoke', x, y, {repeat: -1, frequency: freqency});
      this.powerEmitter.timer.resume();
    }
  },

  stopPower: function () {
    this.powerEmitter.timer.pause();
  }

};
