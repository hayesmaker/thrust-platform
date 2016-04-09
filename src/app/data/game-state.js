/**
 *
 * keeps a record of current game state data
 * defines score and bonuses
 *
 * @class game-state
 * @static
 *
 * @type {{SCORES: {FUEL: number, LIMPET: number, PLANET_BUSTER: number, ORB_RECOVERED: number, LIMPETS_DESTROYED: number}, POWER_STATION_HEALTH: number, ENEMY_BULLET_DURATION: number, PLAYER_BULLET_DURATION: number, initialise: module.exports.initialise, score: number, fuel: number, lives: number}}
 */
module.exports = {

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
   * @method initialise
   */
  initialise: function() {
    this.score = 5;
    this.fuel = 10000;
    this.lives = 5;
  },

  /**
   * @method levelReset
   */
  restart: function() {
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