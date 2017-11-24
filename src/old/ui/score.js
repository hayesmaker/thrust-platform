/**
 * Manages the score display
 *
 * @class score
 * @module ui
 * @submodule score
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
   * @property scoreLabel
   * @type {Phaser.Text}
   * @default null
   */
  scoreLabel: null,

  /**
   * @property scoreTf
   * @type {Phaser.Text}
   */
  scoreTf: null,

  /**
   * @property currentScore
   * @type {Number}
   */
  currentScore: 0,

  /**
   * @method init
   * @param x
   * @param y
   * @param group
   */
  init: function(x, y, group) {
    this.group = group;
    var style = { font: "12px thrust_regular", fill: "#ffffff", align: "center" };
    this.scoreLabel = game.add.text(x, y + 5, "Score:", style, this.group);
    style.align = 'center';
    this.scoreTf = game.add.text(x + this.scoreLabel.width + 5, y + 5, "999999", style, this.group);
  },

  /**
   * Replaces default text label with training specific
   * message
   *
   * @method trainingMode
   */
  trainingMode: function() {
    this.scoreLabel.text = "Drones: ";
    this.scoreTf.x = this.scoreLabel.width + 5;
  },
  
  /**
   * @method update
   * @param score {String|Number}
   * @param override {boolean}
   */
  update: function(score, override) {
    if (override) {
      this.currentScore = score;
    } else {
      this.currentScore += score;
    }
    this.scoreTf.text = this.currentScore.toString();
  }


};