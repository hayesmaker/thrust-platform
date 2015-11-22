var properties = require('../properties');

/**
 * Want to know what time it is? you came to wrong place... Want to know what level it is?
 * This is what you want! :)
 *
 * @module level-manager
 * @type {{}}
 */
var self = module.exports = {

  /**
   * @property levels
   * @type {[]}
   */
  levels: properties.levels,

  /**
   * @property levelIndex
   * @type {Number}
   */
  levelIndex: 0,

  /**
   *
   * @property currentLevel
   * @type null
   */
  currentLevel: null,

  /**
   * Inits the level manager to make
   * levels available to the current level property.
   *
   * @method init
   */
  init: function() {
    this.currentLevel = this.levels[this.levelIndex];
  },

  /**
   * Gets the next level configuration
   * and updates the currentLevel index.
   * If you're on the last level, the levelIndex is reset to 0.
   *
   * @method nextLevel
   * @property nextLevel
   * @returns {{}}
   */
  nextLevel: function() {
    if (levels.length - 1 === this.levelIndex) {
      alert('all levels finished');
      this.levelIndex = 0;
    } else {
      this.levelIndex++;
    }
    return this.currentLevel;
  }


};