/**
 * 
 */
module.exports = {
  /**
   * @property screens
   * @type {Array}
   */
  screens: null,


  init: function() {
    this.screens = [];
  },
  
  add: function(screen) {
    this.screens.push(screen);
  }
  
};