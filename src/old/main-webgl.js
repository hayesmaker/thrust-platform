var launcher = require('./states/launcher');

window.onload = function() {
  launcher.renderMode = Phaser.WEBGL;
  launcher.enableHiResMode();
  launcher.start();
};