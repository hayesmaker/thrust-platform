/**
 * keeps a record of current game state data
 * 
 * @class game-state
 * @type {{initialise: function, score: number, fuel: number, lives: number}}
 * @static
 */
module.exports = {
  
  initialise: function() {
    this.score = 5;
    this.fuel = 10000;
    this.lives = 5;
  },
  
  score: 0,
  
  fuel: 10000,
  
  lives: 5
  
};