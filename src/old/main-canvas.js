//require('dotenv').config();
var launcher = require('./states/launcher');
var version = require('./package.json').version;

window.onload = function() {
  launcher.renderMode = Phaser.CANVAS;
  launcher.enableHiResMode();
  launcher.setCustomOptions({
    options: {
      version: version,
      versionSuffix: '-1',
      gameModes: {
        allLevels: true
      }
    }
  });
  launcher.start();
};