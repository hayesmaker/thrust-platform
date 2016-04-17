var _ = require('lodash');

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
  },
  
  showScreen: function(name) {
    console.log('ui-manager :: showScreen : name', name);
    _.each(this.screens, function(screen) {
      if(screen.name === name) {
        screen.showAndAdd();
      } else {
        screen.hideAndRemove();
      }
    });
    
  }
  
};