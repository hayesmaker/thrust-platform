var game = window.game;
/**
 * UserControl description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class UserControl
 * @constructor
 */
function UserControl(enableJoypad) {


  this.initKeys();
  //this.initJoypad();

  this.isJoypadEnabled = enableJoypad;
}

var p = UserControl.prototype;

/**
 * UserControl initialisation
 *
 * @method init
 */
p.initKeys = function () {
  this.cursors = game.input.keyboard.createCursorKeys();
  this.spacePress = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.xKey = game.input.keyboard.addKey(Phaser.Keyboard.X);
};

p.initJoypad = function () {
  this.pad = game.plugins.add(Phaser.VirtualJoystick);
  this.stick = this.pad.addDPad(0, 0, 200, 'dpad');
  this.stick.alignBottomLeft();
  this.stick.scale = 0.8;
  this.buttonA = this.pad.addButton(game.width * 0.8, game.height * 0.8, 'dpad', 'button1-up', 'button1-down');
  this.buttonA.scale = 0.8;
  this.buttonB = this.pad.addButton(game.width * 0.9, game.height * 0.7, 'dpad', 'button2-up', 'button2-down');
  this.buttonB.scale = 0.8;
};


module.exports = UserControl;
