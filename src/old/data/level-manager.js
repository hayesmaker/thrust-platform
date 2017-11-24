var properties = require('../properties');
//var inAppPurchases = require('./in-app-purchases');
var options = require('./options-model');

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
   * Increased in endless mode when levels cycle ends
   *
   * @property endlessModeIndex
   * @type {number}
   */
  endlessModeIndex: 0,

  /**
   * @property endlessCycle
   * @type {number}
   */
  endlessCycle: 0,

  /**
   * @property endless
   */
  endless: [],

  /**
   * @property endlessData
   * @type {object}
   */
  endlessData: {
    rate: 1,
    blink: false,
    flip: false
  },

  /**
   * @property debugStartLevelIndex
   */
  debugStartLevelIndex: 0,

  /**
   * @property startDebugLevel
   */
  startDebugLevel: false,

  allLevels: [],

  /**
   * Initialise the level manager.
   *
   * @method init
   */
  init: function(levels) {
    this.endless = levels.endless;
    this.allLevels = levels.data.slice();
    this.levels = levels.data;
    if (options.gameModes.allLevels) {
      this.levels = this.allLevels.slice();
    } else {
      this.levels.splice(3, 3);
      //inAppPurchases.onLevelsPurchased.add(this.onLevelsPurchased, this);
    }
    this.currentLevel = this.levels[this.levelIndex];
    this.updateEndlessData();
  },

  onLevelsPurchased: function() {
    this.levels = this.allLevels.slice();
    options.unlockGameModes();
  },

  /**
   * @method setNewLevel
   * @param levelIndex
   * @return {boolean}
   */
  setNewLevel: function(levelIndex) {
    if (levelIndex !== this.levelIndex) {
      this.startDebugLevel = true;
      this.debugStartLevelIndex = levelIndex;
      return true;
    }
    return false;
  },

  /**
   * @method resetToLevel1
   */
  resetToLevel1: function() {
    this.levelIndex = 0;
    this.currentLevel = this.levels[this.levelIndex];
  },

  /**
   * Gets the next level configuration  
   * and updates the currentLevel index.
   * If you're on the last level, the levelIndex is reset to 0.
   * Also handles endless mode looping (next level should only be called here if endless mode is on
   * or if the current levels set hasn't been exhausted.
   *
   * @method nextLevel
   * @property nextLevel
   * @return {Object}
   */
  nextLevel: function() {
    //support debug level starts
    if (this.startDebugLevel) {
      this.startDebugLevel = false;
      this.levelIndex = this.debugStartLevelIndex;
      this.currentLevel = this.levels[this.levelIndex];
      return this.currentLevel;
    }
    if (this.levels.length - 1 === this.levelIndex) {
      this.checkEndlessCycle();
      this.levelIndex = 0;
    } else {
      this.levelIndex++;
    }
    this.currentLevel = this.levels[this.levelIndex];
    return this.currentLevel;
  },

  /**
   * @method checkEndlessCycle
   */
  checkEndlessCycle: function() {
    console.log('checkEndlessCycle this.endless.length, this.endlessModeIndex', this.endless.length, this.endlessModeIndex);
    if (this.endless.length - 1 === this.endlessModeIndex) {
      this.endlessModeIndex = 0;
      this.endlessCycle++;
    } else {
      this.endlessModeIndex++;
    }
    console.log('checkEndlessCycle index:', this.endlessCycle);
    this.updateEndlessData();
  },

  updateEndlessData: function() {
    var endlessObj = this.endless[this.endlessModeIndex];
    this.endlessData.flip = endlessObj.flip;
    this.endlessData.rate = endlessObj.rate;
    this.endlessData.blink = endlessObj.blink;
  },

  /**
   * Simply sets the currentLevel data to the level defined by the level index
   * levels are normally defined in properties.levels
   *
   * You can implement a continue play
   * system by not resetting the level index on newGame
   *
   * @method newGame
   */
  newGame: function() {
    this.levelIndex = properties.levels.startLevel - 1;
    this.currentLevel = this.levels[this.levelIndex];
    this.endlessModeIndex = 0;
    this.endlessCycle = 0;
  },

  /**
   * @method startTraining
   */
  startTraining: function() {
    this.currentLevel = properties.levels.training;
  }


};