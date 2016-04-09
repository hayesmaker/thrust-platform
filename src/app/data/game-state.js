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
   */
  SCORES: {
    FUEL: 100,
    LIMPET: 200,
    PLANET_BUSTER: 1000,
    ORB_RECOVERED: 750,
    LIMPETS_DESTROYED: 500
  },

  /**
   * @property POWER_STATION_HEALTH
   * @type {number}
   */
  POWER_STATION_HEALTH: 1000,

  ENEMY_BULLET_DURATION: 2000,

  PLAYER_BULLET_DURATION: 2000,
  
  initialise: function() {
    this.score = 5;
    this.fuel = 10000;
    this.lives = 5;
  },
  
  score: 0,
  
  fuel: 10000,
  
  lives: 5
  
};