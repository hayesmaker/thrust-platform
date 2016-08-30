/**
 * Manages the stopwatch display
 *
 * @class ui-stopwatch
 * @static
 * @type {Object}
 */
module.exports = {

  /**
   * @property group
   * @type {Phaser.Group}
   */
  group: null,

  /**
   * @property timerLabel
   * @type {Phaser.Text}
   * @default null
   */
  timerLabel: null,

  /**
   * @property timerVaue
   * @type {Phaser.Text}
   */
  timerValue: null,

  /**
   * @method init
   * @param x
   * @param y
   * @param group
   */
  init: function(x, y, group) {


    this.group = group;
    var style = { font: "14px thrust_regular", fill: "#ffffff", align: "center" };
    this.timerLabel = game.add.text(0, y + 5, "Time:", style, this.group);
    this.timerValue = game.add.text(0, y + 5, "00:00:00", style, this.group);
    this.timerLabel.x = x - this.timerLabel.width - this.timerValue.width - 10;
    this.timerValue.x = this.timerLabel.x + this.timerLabel.width + 5;
  },

  /**
   * Replaces default text label with training specific
   * message
   *
   * @method trainingMode
   */
  trainingMode: function() {
    this.timerLabel.visible = true;
    this.timerValue.visible = true;
    this.scoreLabel.text = "Drones: ";
  },

  /**
   * @method hide
   */
  hide: function() {
    if (this.timerLabel) {
      this.timerLabel.visible = false;
      this.timerValue.visible = false;
    }
  },

  /**
   * @method update
   * @param text
   */
  update: function(text) {
    this.timerValue.text = text;
  }


};