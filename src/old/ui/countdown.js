var gameState = require('../data/game-state');
var sound = require('../utils/sound');

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
    console.log('ui-countdown :: init');
    this.group = group;
    var style = { font: "24px thrust_regular", fill: "#ff0000", align: "left" };
    this.label = game.add.text(game.width/2, game.height*0.1, this.currentTime, style, this.group);
    this.timer = game.time.create(false);
    this.timer.loop(1000, this.updateCount, this);
    this.label.visible = false;
    this.complete = new Phaser.Signal();
  },

  updateCount: function() {
    console.log('update count', this.currentTime);
    if (this.currentTime > 0) {
      sound.playSound(sound.UI_COUNTDOWN_SECOND);
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
    console.log('ui-countdown-start');
    game.camera.shake(0.006, 1000);
    this.label.visible = true;
    this.timer.start();
    sound.playSound(sound.UI_COUNTDOWN_START, 1, true); //loop this?
  },

  stop: function() {
    console.log('ui-countdown-stop');
    game.sfx.stop(sound.UI_COUNTDOWN_START);
    this.label.visible = false;
    this.timer.stop(false);
  },

  clear: function() {
    console.log('ui-countdown-clear');
    this.label.visible = false;
    this.currentTime = 10;
  }

};