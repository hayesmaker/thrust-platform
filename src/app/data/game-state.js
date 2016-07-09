var _ = require('lodash');
var levelManager = require('./level-manager');

/**
 * keeps a record of current game state data
 * defines score and bonuses
 *
 * @class game-state
 * @static
 * @type {{PLAY_STATES: {MENU: string, PLAY: string, HIGH_SCORES: string, INTERSTITIAL: string, GAME_OVER: string}, currentState: null, highScoreTable: *[], getScoreIndex: module.exports.getScoreIndex, insertNewHighScore: module.exports.insertNewHighScore, newScoreEntered: module.exports.newScoreEntered, shouldEnterHighScore: boolean, SCORES: {FUEL: number, LIMPET: number, PLANET_BUSTER: number, ORB_RECOVERED: number, LIMPETS_DESTROYED: number}, getScoreByValueId: module.exports.getScoreByValueId, POWER_STATION_HEALTH: number, ENEMY_BULLET_DURATION: number, PLAYER_BULLET_DURATION: number, FUEL_AMOUNT: number, init: module.exports.init, levelStart: module.exports.levelStart, newPlayer: module.exports.newPlayer, newGame: module.exports.newGame, doHighScoreCheck: module.exports.doHighScoreCheck, nextLevel: module.exports.nextLevel, bonuses: {planetBuster: boolean, orbRecovered: boolean}, score: number, fuel: number, lives: number, isGameOver: boolean}}
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
    INTERSTITIAL: "INTERSTITIAL",
    GAME_OVER: "GAME_OVER",
    OPTIONS: "OPTIONS",
    COMPLETE: "GAME_COMPLETE",
    GAME_COMPLETE: "GAME_COMPLETE"
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
      score: 200
    },
    {
      name: "Bilbo",
      score: 100
    },
    {
      name: "Baggins",
      score: 0
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
   * If high score state is entered when this is true
   * then insert high score is called.
   * 
   * @property shouldEnterHighScore
   * @type {boolean}
   * @default false
   */
  shouldEnterHighScore: false,
  
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
   * @method getScoreByValueId
   * @param valueId
   * @returns {*}
   */
  getScoreByValueId: function(valueId) {
    return this.SCORES[valueId];
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
  ENEMY_BULLET_DURATION: 3000,

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
  FUEL_AMOUNT: 400,

  /**
   * 
   * 
   * @property gameScale
   */
  gameScale: 1,

  /**
   * @method init
   */
  init: function () {
    this.gameScale = game.width / 1024;
    this.currentState = this.PLAY_STATES.MENU;
    this.newPlayer();
    this.newGame();
    console.log('gameState :: initialise', this.currentState);
    this.levelsCompleted = new Phaser.Signal();
  },

  /**
   * @method levelStart
   */
  levelStart: function() {
    this.bonuses.planetBuster = false;
    this.bonuses.orbRecovered = false;
  },
  
  newPlayer: function() {
    this.score = 0;
    this.fuel = 10000;
    this.lives = 1;
  },

  newGame: function() {
    this.levelStart();
    levelManager.newGame();
  },

  doHighScoreCheck: function() {
    this.shouldEnterHighScore = this.getScoreIndex() >= 0;
  },

  /**
   * @method levelReset
   */
  nextLevel: function () {
    console.log('gameState :: nextLevel : orbRecovered,isGameOver=', this.bonuses.orbRecovered, this.isGameOver);
    if (this.bonuses.orbRecovered && !this.isGameOver) {
      if (levelManager.levels.length - 1 === levelManager.levelIndex) {
        this.levelsCompleted.dispatch();
      } else {
        this.levelStart();
        levelManager.nextLevel();
      }
      

    }
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
  lives: 5,

  /**
   * @property isGameOver
   */
  isGameOver: true

};