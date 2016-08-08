/**
 *
 * Supported Features
 * -----------------
 * - TouchScreen
 * - LocalStorage
 *
 *
 * @class Features
 * @type {Object}
 * @static
 */
module.exports = {
  /**
   * Initialise Browser supported features detection
   * @method init
   */
  init: function () {
    this.isTouchScreen =
      (
        ('ontouchstart' in window) ||
        (navigator.MaxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0)
      );
    this.isLocalStorageAvailable = this.storageAvailable('localStorage');
    console.log("features:");
    console.log("touchScreen:", this.isTouchScreen);
    console.log("isLocalStorageAvailable:", this.isLocalStorageAvailable);
  },

  /**
   * @method storageAvailable
   * @param type
   * @returns {boolean}
   */
  storageAvailable: function (type) {
    try {
      var storage = window[type],
        x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    }
    catch (e) {
      return false;
    }
  },

  /**
   * @property isTouchScreen
   * @type {Boolean}
   */
  isTouchScreen: this.isTouchScreen,
  /**
   * @property isLocalStorageAvailable
   * @type {Boolean}
   */
  isLocalStorageAvailable: this.isLocalStorageAvailable
};
