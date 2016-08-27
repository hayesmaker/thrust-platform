var particles = require('./manager');
var ParticleSystem = require('./ParticleSystem');

/**
 * Creates a new emitter on the particle system
 * This one is used by the fuel cells and emit a stream of particles
 * towards the player while refuelling.
 * 
 * @class FuelParticlesSystem
 * @extends ParticleSystem
 * @constructor
 */
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
  this.well = this.emitter.createGravityWell(source.x, source.y, 2);
  this.circle = this.manager.createCircleZone(20);
  this.emitter.addToWorld(particles.group);
};

/**
 * @method start
 * @param origin
 * @param target
 */
p.start = function(origin, target) {
  ParticleSystem.prototype.start.call(this, origin, target);
  this.emitter.emit('fuelEmitter', 
    this.origin.x, 
    this.origin.y, 
    { 
      zone: this.circle, 
      total: 3,
      repeat: -1, 
      frequency: 15
    });
  this.refuelEmitterEvent = this.emitter.timerEvent;
};

/**
 * @method update
 */
p.update = function() {
  this.well.position.x = this.target.x;
  this.well.position.y = this.target.y;
  ParticleSystem.prototype.update.call(this);
};

/**
 * @method stop
 */
p.stop = function() {
  ParticleSystem.prototype.stop.call(this);
  game.time.events.remove(this.refuelEmitterEvent);
  this.refuelEmitterEvent.loop = false;
};

