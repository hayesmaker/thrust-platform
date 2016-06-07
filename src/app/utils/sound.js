var optionsModel = require('../data/options-model');

/**
 *
 * @type {{playSound: function}}
 */
module.exports = {
  /**
   *
   *
   * @method playSound
   * @param name
   * @param volume
   * @param loop
   */
  playSound: function(name, volume, loop) {
    if (optionsModel.sound.soundFx) {
      game.audiosprite.play(name, volume, loop);
    }
  },

  shouldPlaySfx: function() {
    return optionsModel.sound.soundFx;
  }
};