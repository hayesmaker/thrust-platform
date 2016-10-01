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
      game.sfx.play(name, volume);
      var sound = game.sfx.get(name);
      if (loop) {
        sound.loop = loop;
      }
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
    this.stopMusic();
    if (optionsModel.sound.music) {
      game.music.play(name, volume);
      this.music = game.music.get(name);
      if (loop) {
        this.music.loop = loop;
      }
    }
  },
  
  stopMusic: function() {
    if (this.music) {
      this.music.stop();
      this.music = null;
    }
  }
};