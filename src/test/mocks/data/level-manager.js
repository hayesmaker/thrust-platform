var properties = require('../properties-mock');

/*
 this.preloadTrainingMap(properties.levels.training);
 preloadTrainingMap: function(levelData) {
 game.load.image(levelData.mapImgKey, levelData.mapImgUrl);
 game.load.physics(levelData.mapDataKey + properties.mapSuffix, levelData.mapDataUrl);
 },

 */

module.exports = {
  levels: properties.levels.data,
  levelIndex: 0,
  currentLevel: null
};