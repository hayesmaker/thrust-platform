'use strict';

/**
 * @prporty _firingStrategy
 * @type {FiringStrategy}
 * @private
 */
var _firingStrategy;

/**
 * Turret description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class Turret
 * @param groups
 * @param sprite
 * @param strategy
 * @constructor
 */
function Turret(groups, sprite, strategy) {
  this.groups = groups;
  this.origin = sprite;
  this.firingStrategy = strategy;
}

var p = Turret.prototype;

/**
 * FiringStrategy initialisation
 *
 * @method setStrategy
 * @param {FiringStrategy} firingStrategy
 */
p.setStrategy = function (firingStrategy) {
  _firingStrategy = firingStrategy;
};

p.fire = function () {
  this.firingStrategy.fire();
};

p.update = function () {
  //this.firingStrategy.update();
};

p.destroy = function () {
  this.firingStrategy = null;
  this.groups = null;
  this.origin = null;
};


module.exports = Turret;
