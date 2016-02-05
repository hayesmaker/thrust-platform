var properties = require('../properties');

/**
 * Want to know what time it is? you came to wrong place... Want to know what level it is?
 * This is what you want! :)
 *
 * @module level-manager
 * @type {{}}
 */
module.exports = {

  /**
   * @property levels
   * @type {[]}
   */
  levels: properties.levels.data,

  /**
   * @property levelIndex
   * @type {Number}
   */
  levelIndex: properties.levels.startLevel - 1,

  /**
   * @todo make levels a data type
   * @property currentLevel
   * @type {Object}
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
   * @return {Number}
   */
  nextLevel: function() {
    if (this.levels.length - 1 === this.levelIndex) {
      alert('all levels finished');
      this.levelIndex = 0;
    } else {
      this.levelIndex++;
    }
    this.currentLevel = this.levels[this.levelIndex];
    return this.currentLevel;
  }


};