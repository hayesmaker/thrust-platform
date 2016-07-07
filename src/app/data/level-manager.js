var properties = require('../properties');
var _ = require('lodash');

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
  levels: null,

  /**
   * Starting level index
   * > Overridden from QueryString with `level=1`
   *
   * @property levelIndex
   * @type {Number}
   * @default null
   */
  levelIndex: null,

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
    var customLevel = parseInt(game.net.getQueryString('level'), 10);
    console.log('level-manager ::  init : customLevel= %s', customLevel);
    this.levels = properties.levels.data;
    if (_.isEmpty(customLevel)) {
      this.levelIndex = properties.levels.startLevel - 1;
    } else {
      this.levelIndex = customLevel - 1;
    }
    this.currentLevel = this.levels[this.levelIndex];
    console.log('level-manager :: init=', this.levelIndex, this.currentLevel);
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
      //end of levels.
      this.levelIndex = 0;
    } else {
      this.levelIndex++;
    }
    this.currentLevel = this.levels[this.levelIndex];
    return this.currentLevel;
  },
  
  newGame: function() {
    //this.levelIndex = 0;
    console.log('level-manager :: newGame :', this.levelIndex);
    this.currentLevel = this.levels[this.levelIndex];
  }


};