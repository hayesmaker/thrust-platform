/**
 * Manages the fuel display
 *
 * @class fuel
 * @module ui
 * @submodule fuel
 * @static
 * @type {Object}
 */
module.exports = {

  /**
   * @property group
   * @type {Phaser.Group}
   */
  group: null,

  fuelTf: null,

  currentFuel: 0,

  init: function(x, y, group) {

    this.group = group;

    var style = { font: "12px thrust_regular", fill: "#ffffff", align: "left" };
    var fuelLabel = game.add.text(x + 5, y + 5, "Fuel:", style, this.group);

    style.align = 'right';
    this.fuelTf = game.add.text(x + 5 + fuelLabel.width + 5, y + 5, "999999", style, this.group);

  },

  update: function(fuel, shouldReset) {
    if (shouldReset) {
      this.currentFuel = fuel;
    } else {
      this.currentFuel += fuel;
    }
    this.fuelTf.text = this.currentFuel.toString();
  }


};