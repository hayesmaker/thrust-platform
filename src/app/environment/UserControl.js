var game = window.game;
/**
 * UserControl description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class UserControl
 * @constructor
 * @param isTouchDevice {Boolean} passed from the boot state.
 */
function UserControl(isTouchDevice) {
  this.initKeys();
  console.log('UserControl :: constructor :: isJoypadEnabled=', isTouchDevice);
  this.isJoypadEnabled = isTouchDevice;
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

/**
 * @method initJoypad
 */
p.initJoypad = function () {
  this.pad = game.plugins.add(Phaser.VirtualJoystick);
  this.stick = this.pad.addDPad(game.width * 0.15, game.height*0.8, 200, 'dpad');
  this.buttonA = this.pad.addButton(game.width * 0.78, game.height * 0.85, 'dpad', 'button1-up', 'button1-down');
  this.buttonB = this.pad.addButton(game.width * 0.92, game.height * 0.78, 'dpad', 'button2-up', 'button2-down');
  if (game.width < 1000) {
    this.stick.scale = 0.75;
    this.buttonA.scale = 0.8;
    this.buttonB.scale = 0.8;
  }
};

module.exports = UserControl;
