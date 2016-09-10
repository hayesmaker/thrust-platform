var _ = require('lodash');

/**
 * @class options-model
 * @type {{}}
 * @static
 * @type {{gameModes: {speedRun: {unlocked: boolean, enabled: boolean}, endlessMode: {unlocked: boolean, enabled: boolean}}, sound: {soundFx: boolean, music: boolean}, display: {webGl: boolean, filters: *[]}, controls: {virtualJoypad: boolean, keyboard: boolean, externalGamepad: boolean}, general: {}, getFilterByName: module.exports.getFilterByName}}
 */
module.exports = {

  init: function() {
    this.initEvents();
  },


  gameModes: {
    speedRun: {
      unlocked: true,
      enabled: true
    },
    endlessMode: {
      unlocked: true,
      enabled: false
    }
  },
  sound: {
    soundFx: true,
    music: true
  },
  display: {
    fullscreen: true,
    fx: {
      background: true,
      particles: true
    }
  },
  controls: {
    virtualJoypad: false,
    keyboard: true,
    externalGamepad: false
  },
  general: {},

  /**
   * @method getFilterByName
   * @param name {String}
   * @returns {Object} returns a filter option object eg: `getFilterByName('scanlines')` returns `{scanlines: false}`
   */
  getFilterByName: function(name) {
    return _.find(this.display.filters, function(val) {
      return  !_.isUndefined(val[name]);
    });
  },

  initEvents: function() {
    this.fxParticlesOn = new Phaser.Signal();
    this.fxParticlesOff = new Phaser.Signal();
    this.fxBackgroundOn = new Phaser.Signal();
    this.fxBackgroundOff = new Phaser.Signal();
  },

  dispose: function() {
    this.fxParticlesOn.removeAll();
    this.fxParticlesOn = null;
    this.fxParticlesOff.removeAll();
    this.fxParticlesOff = null;
    this.fxBackgroundOn.removeAll();
    this.fxBackgroundOn = null;
    this.fxBackgroundOff.removeAll();
    this.fxBackgroundOff = null;
  }
};