var gamepad = require('../subscreens/controls-options-gamepad');
var touch = require('../subscreens/controls-options-touch');
var keys = require('../subscreens/controls-options-keys');

module.exports = {

  /**
   *
   * @todo create correct controls screen and return it
   * @method getControlsScreen
   * @returns {UiComponent}
   */
  getControlsScreen: function() {
    if (game.controls.advancedTouchControlsGroup && !game.controls.useExternalJoypad) {
      return touch;
    } else if (game.controls.useExternalJoypad) {
      return gamepad;
    } else {
      return keys;
    }
  }
};