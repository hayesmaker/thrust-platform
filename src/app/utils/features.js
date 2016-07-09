/**
 * @class Features
 * @type {Object}
 * @static
 */
module.exports = {
  init: function () {
    this.isTouchScreen =
      (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
    console.log("touchScreen:", this.isTouchScreen);
  },
  isTouchScreen: this.isTouchScreen
};
