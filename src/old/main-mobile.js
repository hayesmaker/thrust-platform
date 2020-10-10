var launcher = require('./states/launcher');
var Phaser = global.Phaser;

window.onload = function() {
  launcher.renderMode = Phaser.AUTO;
  launcher.customScaleMode = Phaser.ScaleManager.EXACT_FIT;
  launcher.start();
};