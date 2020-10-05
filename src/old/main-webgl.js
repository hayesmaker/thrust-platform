var launcher = require('./states/launcher');
var version = require('./package.json').version;

window.onload = function() {
  launcher.renderMode = Phaser.WEBGL;
  launcher.enableHiResMode();
  launcher.setCustomOptions({
    options: {
      version: version,
      versionSuffix: 'wgl',
      gameModes: {
        allLevels: true
      }
    }
  });
  launcher.start();
};