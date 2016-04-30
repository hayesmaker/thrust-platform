var _ = require('lodash');

/**
 *
 * keeps a record of current game state data
 * defines score and bonuses
 *
 * @class game-state
 * @static
 */
module.exports = {

  /**
   * @property PLAY_STATES
   * @type {Object}
   */
  PLAY_STATES: {
    MENU: "MENU",
    PLAY: "PLAY",
    HIGH_SCORES: "HIGH_SCORES",
    TRANSITION: "TRANSITION",
    GAME_OVER: "GAME_OVER"
  },

  /**
   * @property currentState
   * @type {String}
   */
  currentState: null,

  /**
   * @property highScoreTable
   * @type {Array}
   */
  highScoreTable: [
    {
      name: "Andy",
      score: 100000
    },
    {
      name: "Joe",
      score: 50000
    },
    {
      name: "Malcolm",
      score: 10000
    },
    {
      name: "Rodney",
      score: 5000
    },
    {
      name: "Simon",
      score: 4000
    },
    {
      name: "Christopher",
      score: 3000
    },
    {
      name: "Bilbo",
      score: 2000
    },
    {
      name: "Baggins",
      score: 1000
    }
  ],

  /**
   * 
   */
  getScoreIndex: function() {
    return _.findIndex(this.highScoreTable, function(data) {
      return this.score > data.score;
    }.bind(this));
  },

  /**
   * 
   * @param scoreIndex
   */
  insertNewHighScore: function(scoreIndex) {
    this.highScoreTable.splice(scoreIndex, 0, {
      dirty: true,
      name: "",
      score: this.score
    });
    this.highScoreTable.pop();
    console.log('gameState :: insertNewHighScore :: ', this.highScoreTable);
  },

  /**
   * @param name
   */
  newScoreEntered: function(name) {
    _.each(this.highScoreTable, function(data) {
      if (data.dirty) {
        data.name = name;
        data.dirty = false;
      }
    });
    console.log('gameState :: newScoreEntered :: ', this.highScoreTable);
  },


  
  /**
   * @property SCORES
   * @type {object}
   */
  SCORES: {
    FUEL: 100,
    LIMPET: 750,
    PLANET_BUSTER: 1000,
    ORB_RECOVERED: 750,
    LIMPETS_DESTROYED: 500
  },

  /**
   * @property POWER_STATION_HEALTH
   * @type {number}
   */
  POWER_STATION_HEALTH: 1000,

  /**
   * @property ENEMY_BULLET_DURATION
   * @type {number}
   */
  ENEMY_BULLET_DURATION: 2000,

  /**
   * @property PLAYER_BULLET_DURATION
   * @type {number}
   */
  PLAYER_BULLET_DURATION: 2000,

  /**
   * The amount of fuel a fuel cell can refuel the player
   * before it is removed
   *
   * @property FUEL_AMOUNT
   * @type {Number}
   */
  FUEL_AMOUNT: 300,

  /**
   * @deprecated
   * @method init
   */
  init: function () {
    this.currentState = this.PLAY_STATES.MENU;
    this.score = 0;
    this.fuel = 5000;
    this.lives = 2;
    console.log('gameState :: initialise', this.currentState);
  },

  /**
   * @method levelReset
   */
  restart: function () {
    this.currentState = this.PLAY_STATES.PLAY;
    this.planetDestroyed = false;
    this.orbRecovered = false;
  },

  /**
   * Set to true when a condition is satisfied
   * This can be used in a level interstitial to add any bonuses
   * and check mission completion.
   *
   * @property bonuses
   */
  bonuses: {
    planetBuster: false,
    orbRecovered: false
  },

  /**
   * @property score
   * @type {number}
   */
  score: 0,

  /**
   * @property fuel
   * @type {number}
   */
  fuel: 10000,

  /**
   * @property lives
   * @type {number}
   */
  lives: 5

};