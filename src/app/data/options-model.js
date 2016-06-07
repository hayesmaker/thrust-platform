var _ = require('lodash');

/**
 * @class options-model
 * @type {{}}
 * @static
 * @type {{sound: {soundFx: boolean, music: boolean}, display: {webGl: boolean, filters: *[]}, controls: {virtualJoypad: boolean, keyboard: boolean, externalGamepad: boolean}, general: {}}}
 */
module.exports = {
  sound: {
    soundFx: false,
    music: false
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

  /**
   * @method getFilterByName
   * @param name {String}
   * @returns {Object} returns a filter option object eg: `getFilterByName('scanlines')` returns `{scanlines: false}`
   */
  getFilterByName: function(name) {
    return _.find(this.display.filters, function(val) {
      return  !_.isUndefined(val[name]);
    });
  }
};