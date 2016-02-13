var particles = require('../environment/particles');
var ParticleSystem = require('./ParticleSystem');


function FuelParticlesSystem() {

}

var p = FuelParticlesSystem.prototype = Object.create(ParticleSystem.prototype, {
  constructor: FuelParticlesSystem
});

module.exports = FuelParticlesSystem;

/**
 * @method init
 * @param source
 */
p.init = function(source) {
  ParticleSystem.prototype.init.call(this);
  this.well = this.emitter.createGravityWell(source.x, source.y, 1);
  this.circle = this.manager.createCircleZone(20);
  this.emitter.addToWorld(particles.group);
};

/**
 *
 * @param origin
 * @param target
 */
p.start = function(origin, target) {
  ParticleSystem.prototype.start.call(this, origin, target);
  this.emitter.emit('fuelEmitter', this.origin.x, this.origin.y, { zone: this.circle, total: 4, repeat: -1, frequency: 4 });
  this.refuelEmitterEvent = this.emitter.timerEvent;
};

p.update = function() {
  ParticleSystem.prototype.update.call(this);
  this.well.position.x = this.target.x;
  this.well.position.y = this.target.y;
};

p.stop = function() {
  ParticleSystem.prototype.stop.call(this);
  game.time.events.remove(this.refuelEmitterEvent);
  this.refuelEmitterEvent.loop = false;
};

