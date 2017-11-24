var launcher = require('./states/launcher');

window.onload = function() {
  launcher.renderMode = Phaser.CANVAS;
  launcher.enableHiResMode();
  launcher.setCustomOptions({
    options: {
      versionSuffix: '-0',
      gameModes: {
        allLevels: true
      }
    }
  });
  launcher.start();
};