var gameState = require('../data/game-state');

/**
 * Manages the fuel display
 *
 * @class countdown
 * @namespace ui
 * @static
 * @type {Object}
 */
module.exports = {
  /**
   * @property group
   * @type {Phaser.Group}
   */
  group: null,

  fuelTf: null,

  currentFuel: 0,

  currentTime: 10,
  
  complete: new Phaser.Signal(),

  init: function(group) {
    this.group = group;
    var style = { font: "24px thrust_regular", fill: "#ff0000", align: "left" };
    this.label = game.add.text(game.width/2, game.height*0.1, this.currentTime, style, this.group);
    this.timer = game.time.create(false);
    this.timer.loop(1000, this.updateCount, this);
    this.label.visible = false;
  },

  updateCount: function() {
    if (this.currentTime > 0) {
      this.currentTime--;
    } else {
      gameState.planetDestroyed = true;
      this.stop();
    }
    this.label.text = this.currentTime;
  },

  update: function() {
   
  },

  start: function() {
    this.label.visible = true;
    this.timer.start();
  },

  stop: function() {
    this.label.visible = false;
    this.timer.stop();
  },

  clear: function() {
    this.label.visible = false;
    this.currentTime = 10;
  }

};