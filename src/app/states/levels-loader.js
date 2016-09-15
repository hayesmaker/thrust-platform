module.exports = {

  init: function() {

  },

  loadLevelsPack: function() {

  },

  loadLevelsJson: function() {
    game.load.json('levels-data', 'public/levels/classic.json');
  },

  loadAtlas: function() {

  },

  loadLevel: function() {

  },

  loadLevelPhysics: function() {

  },

  levelsLoadComplete: function() {
    var levelsData = game.cache.getJSON('levels-data');
  }


};