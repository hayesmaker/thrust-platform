var launcher = require('./states/launcher');

window.onload = function () {
  launcher.renderMode = Phaser.CANVAS;
  launcher.setCustomOptions({
    options: {
      versionSuffix: '-@gobbapeas',
      gameModes: {
        allLevels: true,
        gravity: {
          unlocked: true,
          enabled: false
        }
      }
    }
  });
  launcher.enableHiResMode();
  launcher.start();
};