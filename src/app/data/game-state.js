/**
 * keeps a record of current game state data
 * defines score and bonuses
 *  
 * @class game-state
 * @type {{SCORES: {FUEL: number, LIMPET: number, PLANET_BUSTER: number, ORB_RECOVERED: number, LIMPETS_DESTROYED: number}, initialise: module.exports.initialise, score: number, fuel: number, lives: number}}
 * @static
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
  
  initialise: function() {
    this.score = 5;
    this.fuel = 10000;
    this.lives = 5;
  },
  
  score: 0,
  
  fuel: 10000,
  
  lives: 5
  
};