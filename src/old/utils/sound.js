var optionsModel = require('../data/options-model');

/**
 * @class sound
 * @type {{music: null, GATE_OPEN: string, GATE_CLOSE: string, FUEL_EXPLODE: string, FUEL_REFUELLING: string, FUEL_REFUEL_COMPLETE: string, LIMPET_FIRE: string, LIMPET_EXPLODE: string, PLAYER_1UP: string, PLAYER_THRUST_START: string, PLAYER_THRUST_MID: string, PLAYER_THRUST_END: string, PLAYER_FIRE: string, PLAYER_DEATH: string, PLAYER_EXPLOSION: string, PLAYER_TELEPORT_IN: string, PLAYER_TELEPORT_OUT: string, POWER_STATION_EXPLODE1: string, POWER_STATION_EXPLODE2: string, POWER_STATION_HIT: string, TRACTOR_BEAM_CONNECTING: string, TRACTOR_BEAM_RELEASE: string, TRACTOR_BEAM_GRAB: string, TRACTOR_BEAM_BREAK: string, UI_COUNTDOWN_SECOND: string, UI_MENU_SELECT: string, UI_SWIPE_IN: string, UI_SWIPE_OUT: string, UI_INTERSTITIAL_MISSION_COMPLETE: string, UI_INTERSTITIAL_MISSION_FAILED: string, UI_SCORE_ROLLUP: string, UI_PRESS_FIRE: string, UI_GAME_OVER: string, UI_COUNTDOWN_START: string, TRAINING_DRONE_PASSED: string, TRAINING_DRONE_HOVER1: string, TRAINING_DRONE_HOVER2: string, TRAINING_DRONE_HOVER3: string, TRAINING_DRONE_HOVER4: string, playSound: module.exports.playSound, shouldPlaySfx: module.exports.shouldPlaySfx, playMusic: module.exports.playMusic, stopMusic: module.exports.stopMusic}}
 */
module.exports = {
  GATE_OPEN: 'gate-open',
  GATE_CLOSE: 'gate-close',
  FUEL_EXPLODE: 'fuel-explode',
  FUEL_REFUELLING: 'fuel-refuelling',
  FUEL_REFUEL_COMPLETE: 'fuel-refuel-complete',
  LIMPET_FIRE: 'limpet-fire',
  LIMPET_EXPLODE: 'limpet-explode',
  PLAYER_1UP: 'player-1up2',
  PLAYER_THRUST_START: 'player-thrust-start',
  PLAYER_THRUST_MID: 'player-thrust-mid',
  PLAYER_THRUST_END: 'player-thrust-end',
  PLAYER_FIRE: 'player-fire',
  PLAYER_DEATH: 'player-death', //not implemented
  PLAYER_EXPLOSION: 'player-explosion',
  PLAYER_TELEPORT_IN: 'player-teleport-in',
  PLAYER_TELEPORT_OUT: 'player-teleport-out',
  POWER_STATION_EXPLODE1: 'power-station-explode1',
  POWER_STATION_EXPLODE2: 'power-station-explode2',
  POWER_STATION_HIT: 'power-station-hit',
  TRACTOR_BEAM_CONNECTING: 'tractor-beam-connecting',
  TRACTOR_BEAM_RELEASE: 'tractor-beam-release',
  TRACTOR_BEAM_GRAB: 'tractor-beam-grab',
  TRACTOR_BEAM_BREAK: 'tractor-beam-break',
  UI_COUNTDOWN_START: 'ui-countdown-start',
  UI_COUNTDOWN_SECOND: 'ui-countdown-second',
  UI_MENU_SELECT: 'ui-menu-select',
  UI_SWIPE_IN: 'ui-swipe-in',
  UI_SWIPE_OUT: 'ui-swipe-out',
  UI_INTERSTITIAL_MISSION_COMPLETE: 'ui-interstitial-mission-complete',
  UI_INTERSTITIAL_MISSION_FAILED: 'ui-interstitial-mission-failed',
  UI_SCORE_ROLLUP: 'ui-score-rollup',
  UI_PRESS_FIRE: 'ui-press-fire',
  UI_GAME_OVER: 'ui-game-over',
  TRAINING_DRONE_PASSED: 'training-drone-connect',
  TRAINING_DRONE_HOVER1: 'training-drone-hover1',
  TRAINING_DRONE_HOVER2: 'training-drone-hover2',
  TRAINING_DRONE_HOVER3: 'training-drone-hover3',
  TRAINING_DRONE_HOVER4: 'training-drone-hover4',

  /**
   * @property music
   */
  music: null,

  /**
   * @property currentMusic
   */
  currentMusic: "",

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
   * Checks if the current music is not already playing
   * Before playing Music
   *
   * @method playMusic
   * @param name
   * @param volume
   * @param loop
   */
  playMusic: function(name, volume, loop) {
    if (this.currentMusic !== name) {
      this.currentMusic = name;
      this.stopMusic();
      if (optionsModel.sound.music) {
        game.music.play(name, volume);
        this.music = game.music.get(name);
        if (loop) {
          this.music.loop = loop;
        }
      }
    }
  },

  /**
   * @method stopMusic
   */
  stopMusic: function() {
    if (this.music) {
      this.music.stop();
      this.music = null;
    }
  }
};