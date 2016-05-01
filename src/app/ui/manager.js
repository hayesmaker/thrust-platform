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


  init: function(ui) {
    this.ui = ui;
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
    if (name === "HIGH_SCORES" || name === 'INTERSTITIAL') {
      this.ui.fade.tweenIn();
    } else {
      this.ui.fade.tweenOut();
    }
    
  }
  
};