var properties = require('../properties');

/**
 * Want to know what time it is? you came to wrong place... Want to know what level it is?
 * This is what you want! :)
 *
 * @class level-manager
 * @type {Object}
 */
module.exports = {

  /**
   * Caches all the game's levels from `properties.js`
   *
   * @property levels
   * @type {Array}
   */
  levels: properties.levels.data,

  /**
   * Starting level index
   *
   * @property levelIndex
   * @type {Number}
   */
  levelIndex: properties.levels.startLevel - 1,

  /**
   * Current level data
   *
   * @todo make levels a data type
   * @property currentLevel
   * @type {Object}
   */
  currentLevel: null,

  /**
   * Initialise the level manager.
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
   * @return {Object}
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