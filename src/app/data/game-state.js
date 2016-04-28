var _ = require('lodash');

/**
 *
 * keeps a record of current game state data
 * defines score and bonuses
 *
 * @class game-state
 * @static
 *
 * @type {{PLAY_STATES: {MENU: string, PLAY: string, HIGH_SCORES: string, TRANSITION: string, GAME_OVER: string}, currentState: null, highScoreTable: *[], SCORES: {FUEL: number, LIMPET: number, PLANET_BUSTER: number, ORB_RECOVERED: number, LIMPETS_DESTROYED: number}, POWER_STATION_HEALTH: number, ENEMY_BULLET_DURATION: number, PLAYER_BULLET_DURATION: number, FUEL_AMOUNT: number, init: module.exports.init, restart: module.exports.restart, planetDestroyed: boolean, orbRecovered: boolean, score: number, fuel: number, lives: number}}
 */
module.exports = {

  PLAY_STATES: {
    MENU: "MENU",
    PLAY: "PLAY",
    HIGH_SCORES: "HIGH_SCORES",
    TRANSITION: "TRANSITION",
    GAME_OVER: "GAME_OVER"
  },

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
      name: "Andy",
      score: 50000
    },
    {
      name: "Andy",
      score: 10000
    },
    {
      name: "Andy",
      score: 5000
    },
    {
      name: "Andy",
      score: 4000
    },
    {
      name: "Andy",
      score: 3000
    },
    {
      name: "Andy",
      score: 2000
    },
    {
      name: "Andy",
      score: 1000
    }
  ],

  getScoreIndex: function() {
    return _.findIndex(this.highScoreTable, function(data) {
      return this.score > data.score;
    }.bind(this));
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
    this.score = 3000;
    this.fuel = 7000;
    this.lives = 1;
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
   * @property planetDestroyed
   * @type {boolean}
   */
  planetDestroyed: false,

  /**
   * @property orbRecovered
   * @type {boolean}
   */
  orbRecovered: false,

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