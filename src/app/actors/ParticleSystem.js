var particles = require('../environment/particles');


function ParticleSystem() {

}

var p = ParticleSystem.prototype;

module.exports = ParticleSystem;

p.isEmitting = false;

p.start = null;

p.target = null;

p.emitter = null;

/**
 * @method init
 */
p.init = function() {
  this.manager = particles.manager;
  this.emitter = this.manager.createEmitter();
  this.emitter.addToWorld(particles.group);
};

/**
 * @method start
 * @param origin
 * @param target
 */
p.start = function(origin, target) {
  this.isEmitting = true;
  this.origin = origin;
  this.target = target;
};

/**
 * @method update
 */
p.update = function() {

};

/**
 * @method stop
 */
p.stop = function() {
  this.isEmitting = false;
  this.target = null;
};

