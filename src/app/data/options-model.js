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

  setLevels: function(value) {
    this.gameModes.levels.dirty = value !== this.gameModes.levels.current;
    this.gameModes.levels.selected = value;
  },

  getLevelsJsonUrl: function() {
    var jsonUrl;
    switch(this.gameModes.levels.selected) {
      case 'classic' :
        jsonUrl = 'assets/levels/classic.json';
        break;
      case '2016' :
        jsonUrl = 'assets/levels/2016.json';
        break;
    }
    return jsonUrl;
  },

  gameModes: {
    levels: {
      dirty: false,
      current: '2016',
      selected: '2016'
    },
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

  /**
   * @method initEvents
   */
  initEvents: function() {
    this.loadNewLevels = new Phaser.Signal();
    this.fxParticlesOn = new Phaser.Signal();
    this.fxParticlesOff = new Phaser.Signal();
    this.fxBackgroundOn = new Phaser.Signal();
    this.fxBackgroundOff = new Phaser.Signal();
  },

  /**
   * @method dispose
   */
  dispose: function() {
    this.loadNewLevels.removeAll();
    this.loadNewLevels = null;
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