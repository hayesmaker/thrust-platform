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
  subScreens: null,

  init: function(ui) {
    this.ui = ui;
    this.screens = [];
    this.subScreens = [];
  },
  
  add: function(screen) {
    this.screens.push(screen);
  },
  
  showScreen: function(name, isSubScreen) {
    console.log('ui-manager :: showScreen : name, isSubScreen, subscreens, screens', name, isSubScreen, this.subScreens, this.screens);
    var screensCheck = isSubScreen? this.subScreens : this.screens;
    _.each(screensCheck, function(screen) {
      if(screen.name.toLowerCase() === name.toLowerCase()) {
        screen.showAndAdd();
      } else {
        screen.hideAndRemove();
      }
    }.bind(this));
  },

  addSubScreen: function(subScreen) {
    this.subScreens.push(subScreen);
  },

  getScreenByName: function(name) {
    var screen = _.find(this.screens, function(screen) {
      return screen.name.toLowerCase() === name.toLowerCase();
    });
    if (!screen) {
      screen = _.find(this.subScreens, function(screen) {
        return screen.name.toLowerCase() === name.toLowerCase();
      });
    }
    if (!screen) {
      throw new Error("Can't find a screen by name", name);
    }
    return screen;
  }
  

};