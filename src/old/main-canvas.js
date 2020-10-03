//require('dotenv').config();
var launcher = require('./states/launcher');
var version = require('./package.json').version;

window.onload = function() {
  launcher.renderMode = Phaser.AUTO;
  launcher.enableHiResMode();
  launcher.setCustomOptions({
    options: {
      version: version,
      versionSuffix: '',
      gameModes: {
        allLevels: true
      }
    }
  });
  launcher.start();
};