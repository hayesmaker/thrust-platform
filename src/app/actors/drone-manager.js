var Drone = require('./Drone');

module.exports = {


  /**
   * @method newDrones
   * @param x
   * @param y
   * @param groups
   * @param collisions
   */
  newDrones: function(x, y, groups, collisions) {
    var drone = new Drone(x, y, groups, collisions);

  }

};