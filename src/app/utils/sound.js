var optionsModel = require('../data/options-model');

/**
 *
 * @type {{playSound: function}}
 */
module.exports = {
  music: null,
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

  /**
   * @method shouldPlaySfx
   * @returns {Boolean}
   */
  shouldPlaySfx: function() {
    return optionsModel.sound.soundFx;
  },

  /**
   * @method playMusic
   * @param name
   * @param volume
   * @param loop
   */
  playMusic: function(name, volume, loop) {
    if (optionsModel.sound.music) {
      game.music.play(name, volume, loop);
      this.music = game.music.get(name);
    }
  },
  
  stopMusic: function() {
    if (this.music) {
      this.music.stop();
      this.music = null;
    }
  }
};