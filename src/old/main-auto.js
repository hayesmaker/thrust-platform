var launcher = require('./states/launcher');

window.onload = function() {
  launcher.renderMode = Phaser.AUTO;
  launcher.enableHiResMode();
  launcher.start();
};