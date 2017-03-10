/**
 * Manages the lives display
 *
 * @class lives
 * @module ui
 * @submodule lives
 * @static
 * @type {Object}
 */
module.exports = {

  /**
   * the ui display group
   *
   * @property group
   * @type {Phaser.Group}
   */
  group: null,

  /**
   * @property textField
   * @type {Phaser.Text}
   */
  textfield: null,

  /**
   * The value represented in the textfield display
   *
   * @property currentAmount
   * @type {Number}
   */
  currentAmount: 0,

  /**
   * create label and textfield
   *
   * @method init
   * @param x
   * @param y
   * @param group
   */
  init: function(x, y, group) {

    this.group = group;

    var style = { font: "12px thrust_regular", fill: "#ffffff", align: 'center' };
    var label = game.add.text(x, y + 5, "Ships:", style, this.group);
    style.align = 'center';
    this.textfield = game.add.text(x + label.width + 5, y + 5, "5", style, this.group);

  },

  /**
   * @method update
   * @param val {Number} the amount to update the textfield by
   * @param shouldReset {Boolean} if true, set the label to the value (val) otherwise add val the to the currentAmount
   */
  update: function(val, shouldReset) {
    if (shouldReset) {
      this.currentAmount = val;
    } else {
      this.currentAmount += val;
    }
    this.textfield.text = this.currentAmount.toString();
  }


};