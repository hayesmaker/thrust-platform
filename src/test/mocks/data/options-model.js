var _ = require('lodash');

/**
 * @class options-model
 * @type {{}}
 * @static
 * @type {{gameModes: {speedRun: {unlocked: boolean, enabled: boolean}, endlessMode: {unlocked: boolean, enabled: boolean}}, sound: {soundFx: boolean, music: boolean}, display: {webGl: boolean, filters: *[]}, controls: {virtualJoypad: boolean, keyboard: boolean, externalGamepad: boolean}, general: {}, getFilterByName: module.exports.getFilterByName}}
 */
module.exports = {
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
    webGl: false,
    filters: [
      {scanlines: false},
      {vignette: false},
      {noise: false}
    ]
  },
  controls: {
    virtualJoypad: false,
    keyboard: true,
    externalGamepad: false
  },
  general: {},
  getFilterByName: function() {}
};