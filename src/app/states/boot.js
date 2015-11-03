var properties = require('../properties');
var features = require('../utils/features');
var StatsModule = require('../utils/StatsModule');
var UserControl = require('../environment/UserControl');
var levelManager = require('../data/level-manager');

var userControl;
/**
 * The boot state
 *
 * @namespace states
 * @module boot
 * @type {{create: Function, update: Function}}
 */
module.exports = {
  preload: function () {
    game.load.image('title', 'assets/images/title.png');
  },

  create: function () {
    features.init();
    levelManager.init();
    game.scale.scaleMode = features.isTouchScreen ? Phaser.ScaleManager.EXACT_FIT : properties.scale.mode;
    game.time.advancedTiming = true;
    if (properties.stats) {
      game.stats = new StatsModule();
    }
    userControl = new UserControl(features.isTouchScreen || properties.enableJoypad);
    console.warn("Instructions: Use Cursors to move ship, space to shoot, collect orb by passing near");
    console.warn("TouchScreenDetected:", features.isTouchScreen);
    console.warn("ScaleMode:", game.scale.scaleMode);

    game.controls = userControl;

    var spr = game.add.sprite(0,0, 'title');
    spr.inputEnabled = true;
    spr.useHandCursor = true;
    spr.events.onInputDown.add(this.startGame, this);

    game.controls.spacePress.onDown.add(this.startGame, this);
  },

  startGame: function() {
    game.state.start('play');
  },

  update: function () {

  }
};
