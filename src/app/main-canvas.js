var launcher = require('./states/launcher');

window.onload = function() {
  //launcher.renderMode = Phaser.CANVAS;
  launcher.enableHiResMode();
  launcher.start();
};