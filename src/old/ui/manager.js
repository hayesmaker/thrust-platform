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

  //todo only add if doesn't exist in array
  add: function(screen) {

    var existingScreen = _.find(this.screens, {name: screen.name});
    if (!existingScreen) {
      this.screens.push(screen);
    }
  },
  
  showScreen: function(name, isSubScreen) {
    var screensCheck = isSubScreen? this.subScreens : this.screens;
    var activeScreen = null;
    _.each(screensCheck, function(screen) {
      if(screen.name.toLowerCase() === name.toLowerCase()) {
        activeScreen = screen;
        activeScreen.showAndAdd();
      } else {
        screen.hideAndRemove();
      }
    }.bind(this));
    return activeScreen;
  },

  addSubScreen: function(subScreen) {
    this.subScreens.push(subScreen);
  },
  
  clearSubscreens: function() {
    this.subScreens = [];
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