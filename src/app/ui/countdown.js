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
  
  complete: null,

  init: function(group) {
    this.group = group;
    var style = { font: "24px thrust_regular", fill: "#ff0000", align: "left" };
    this.label = game.add.text(game.width/2, game.height*0.1, this.currentTime, style, this.group);
    this.timer = game.time.create(false);
    this.timer.loop(1000, this.updateCount, this);
    this.label.visible = false;
    this.complete = new Phaser.Signal();
  },

  updateCount: function() {
    if (this.currentTime > 0) {
      game.audiosprite.play('select2');
      game.camera.shake(0.004, 1000);
      this.currentTime--;
    } else {
      this.complete.dispatch();
      gameState.planetDestroyed = true;
      this.stop();
    }
    this.label.text = this.currentTime;
  },

  update: function() {
   
  },

  start: function() {
    game.audiosprite.play('planet-dying1', 0.4, true);
    game.camera.shake(0.006, 1000);
    this.label.visible = true;
    this.timer.start();
  },

  stop: function() {
    game.audiosprite.stop('planet-dying1');
    this.label.visible = false;
    this.timer.stop();
  },

  clear: function() {
    this.label.visible = false;
    this.currentTime = 10;
  }

};