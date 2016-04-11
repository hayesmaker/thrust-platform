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
    var style = { font: "12px thrust_regular", fill: "#ffffff", align: "left" };
    var scoreLabel = game.add.text(x + 5, y + 5, "Score:", style, this.group);
    style.align = 'right';
    this.scoreTf = game.add.text(x + 5 + scoreLabel.width + 5, y + 5, "999999", style, this.group);
  },
  
  /**
   * @method update
   * @param score
   * @param shouldReset
   */
  update: function(score, shouldReset) {
    if (shouldReset) {
      this.currentScore = score;
    } else {
      this.currentScore += score;
    }
    this.scoreTf.text = this.currentScore.toString();
  }


};