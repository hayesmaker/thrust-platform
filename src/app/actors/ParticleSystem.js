var particles = require('../environment/particles');


function ParticleSystem() {

}

var p = ParticleSystem.prototype;

module.exports = ParticleSystem;

p.isEmitting = false;

p.init = function(source) {
  this.manager = particles.manager;
  var fuelEmitterData = {
    lifespan: 1750,
    image: game.cache.getBitmapData('transportParticle'),
    vy: { min: 1, max: 2 },
    alpha: { initial: 0, value: 1, control: [ { x: 0, y: 1 }, { x: 1, y: 0 } ] }
  };
  this.manager.addData('fuelEmitter', fuelEmitterData);
  this.emitter = this.manager.createEmitter();
  this.well = this.emitter.createGravityWell(source.x, source.y, 1);
  this.circle = this.manager.createCircleZone(20);
  this.emitter.addToWorld(particles.group);
};

/**
 *
 * @param start
 * @param target
 */
p.start = function(start, target) {
  this.isEmitting = true;
  this.target = target;
  this.emitter.emit('fuelEmitter', start.x, start.y, { zone: this.circle, total: 4, repeat: -1, frequency: 4 });
  this.refuelEmitterEvent = this.emitter.timerEvent;
};

p.update = function() {
  this.well.position.x = this.target.x;
  this.well.position.y = this.target.y;
};

p.stop = function() {
  this.isEmitting = false;
  game.time.events.remove(this.refuelEmitterEvent);
  this.refuelEmitterEvent.loop = false;
  this.target = null;
};

