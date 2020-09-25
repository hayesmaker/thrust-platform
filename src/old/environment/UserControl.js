/**
 * UserControl description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class UserControl
 * @constructor
 * @param features {Object} passed from the boot state.
 */
function UserControl(features) {
  this.features = features;
  this.initExternalJoypad();
  this.initKeys();
  if (!this.useExternalJoypad && features.isTouchScreen) {
    this.initTouchEvents();
  }
}

var game = global.game;
var Phaser = global.Phaser;
var p = UserControl.prototype;

p.gamepad = null;
p.useKeys = false;
p.useExternalJoypad = false;
p.useVirtualJoypad = false;
p.externalGamePadDetected = false;
p.isHidden = false;
p.fireButtonDown = null;
p.fireButtonUp = null;
p.moveLeftButtonDown = null;
p.moveLeftButtonUp = null;
p.moveRightButtonDown = null;
p.moveRightButtonUp = null;
p.touchScale = 1;

/**
 * @method initExternalJoypad
 */
p.initExternalJoypad = function () {
  this.gamepad = game.input.gamepad.pad1;
  this.gamepad.addCallbacks(this, {
    onConnect: function () {
      console.warn("UserControl :: initExternalJoypad");
      this.useExternalJoypad = true;
      this.useVirtualJoypad = false;
      game.externalJoypad = {};
      game.externalJoypad.fireButton = this.gamepad.getButton(Phaser.Gamepad.BUTTON_1);
      game.externalJoypad.thrustButton = this.gamepad.getButton(Phaser.Gamepad.BUTTON_0);
      game.externalJoypad.up = this.gamepad.getButton(Phaser.Gamepad.BUTTON_12);
      game.externalJoypad.down = this.gamepad.getButton(Phaser.Gamepad.BUTTON_13);
      game.externalJoypad.left = this.gamepad.getButton(Phaser.Gamepad.BUTTON_14);
      game.externalJoypad.right = this.gamepad.getButton(Phaser.Gamepad.BUTTON_15);
      //this.refresh();
    }.bind(this)
  });
  game.input.gamepad.start();
};


/**
 * UserControl initialisation
 *
 * @method init
 */
p.initKeys = function () {
  this.useKeys = true;
  this.cursors = game.input.keyboard.createCursorKeys();
  this.spacePress = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.xKey = game.input.keyboard.addKey(Phaser.Keyboard.X);
  this.esc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
};


p.gotoPlayMode = function () {
  if (this.advancedTouchControlsGroup) {
    this.advancedTouchControlsGroup.visible = true;
  }
};

p.gotoInputMode = function () {
  if (this.advancedTouchControlsGroup) {
    this.advancedTouchControlsGroup.visible = false;
  }
};

p.initTouchEvents = function() {
  this.useVirtualJoypad = true;
  this.fireButtonDown = new Phaser.Signal();
  this.fireButtonUp = new Phaser.Signal();
  this.thrustButtonDown = new Phaser.Signal();
  this.thrustButtonUp = new Phaser.Signal();
  this.moveLeftButtonDown = new Phaser.Signal();
  this.moveLeftButtonUp = new Phaser.Signal();
  this.moveRightButtonDown = new Phaser.Signal();
  this.moveRightButtonUp = new Phaser.Signal();
  this.moveLeftIsDown = false;
  this.moveRightIsDown = false;
  this.fireButtonIsDown = false;
  this.thrustButtonIsDown = false;
  if (game.width < 1000) {
    this.touchScale = 0.7;
  }
};

p.initAdvancedTouchControls = function () {
  this.advancedTouchControlsGroup = game.make.group();
  game.world.add(this.advancedTouchControlsGroup);
  this.advancedTouchControlsGroup.fixedToCamera = true;
  this.moveButtonLeft = game.add.sprite(0, 0, 'controls', 'button-move.png', this.advancedTouchControlsGroup);
  this.moveButtonRight = game.add.sprite(0, 0, 'controls', 'button-move.png', this.advancedTouchControlsGroup);
  this.advancedFireButton = game.add.sprite(0, 0, 'controls', 'button-1.png', this.advancedTouchControlsGroup);
  this.advancedThrustButton = game.add.sprite(0, 0, 'controls', 'button-1.png', this.advancedTouchControlsGroup);
  this.moveButtonLeft.name = "moveLeft";
  this.moveButtonRight.name = "moveRight";
  this.advancedFireButton.name = "fireButton";
  this.advancedThrustButton.name = "thrustButton";
  this.moveButtonLeft.inputEnabled = true;
  this.moveButtonRight.inputEnabled = true;
  this.advancedThrustButton.inputEnabled = true;
  this.advancedFireButton.inputEnabled = true;
  var style = {font: "20px thrust_regular", fill: "#ffffff", align: "left"};
  var buttonFireTxt = game.make.text(0, 0, "FIRE", style);
  var buttonThrustTxt = game.make.text(0, 0, "THRUST", style);
  this.advancedFireButton.addChild(buttonFireTxt);
  this.advancedThrustButton.addChild(buttonThrustTxt);
  buttonFireTxt.anchor.setTo(0.5);
  buttonThrustTxt.anchor.setTo(0.5);
  this.moveButtonLeft.anchor.setTo(0.5);
  this.moveButtonRight.anchor.setTo(0.5);
  this.advancedFireButton.anchor.setTo(0.5);
  this.advancedThrustButton.anchor.setTo(0.5);
  this.moveButtonRight.scale.set(-this.touchScale, this.touchScale);
  this.moveButtonLeft.scale.setTo(this.touchScale);
  this.advancedThrustButton.scale.setTo(this.touchScale);
  this.advancedFireButton.scale.setTo(this.touchScale);
  this.moveButtonLeft.x = this.moveButtonLeft.width * 0.5;
  this.moveButtonLeft.y = game.height - this.moveButtonLeft.height * 0.5;
  this.moveButtonRight.x = this.moveButtonLeft.x + this.moveButtonLeft.width;
  this.moveButtonRight.y = this.moveButtonLeft.y;
  this.advancedThrustButton.x = game.width * 0.9;
  this.advancedThrustButton.y = game.height * 0.78;
  this.advancedFireButton.x = game.width * 0.72;
  this.advancedFireButton.y = game.height * 0.85;
  this.advancedTouchControlsGroup.visible = true;
  this.moveButtonLeft.events.onInputDown.add(this.checkDown, this);
  this.moveButtonLeft.events.onInputUp.add(this.checkUp, this);
  this.moveButtonRight.events.onInputDown.add(this.checkDown, this);
  this.moveButtonRight.events.onInputUp.add(this.checkUp, this);
  this.advancedFireButton.events.onInputDown.add(this.checkDown, this);
  this.advancedFireButton.events.onInputUp.add(this.checkUp, this);
  this.advancedThrustButton.events.onInputDown.add(this.checkDown, this);
  this.advancedThrustButton.events.onInputUp.add(this.checkUp, this);
  //this.moveButtonLeft.events.onInputOut.add(this.checkUp, this);
  //this.moveButtonRight.events.onInputOut.add(this.checkUp, this);
  //this.advancedFireButton.events.onInputOut.add(this.checkUp, this);
  //this.advancedThrustButton.events.onInputOut.add(this.checkUp, this);
  //this.moveButtonLeft.events.onInputOver.add(this.checkDown, this);
  //this.moveButtonRight.events.onInputOver.add(this.checkDown, this);
  //this.advancedFireButton.events.onInputOver.add(this.checkDown, this);
  //this.advancedThrustButton.events.onInputOver.add(this.checkDown, this);
};

p.checkDown = function (e) {
  switch (e.name) {
    case "moveLeft":
      this.moveButtonLeft.frameName = 'button-move-ontouch.png';
      this.moveLeftButtonDown.dispatch();
      this.moveLeftIsDown = true;
      break;
    case "moveRight":
      this.moveButtonRight.frameName = 'button-move-ontouch.png';
      this.moveRightButtonDown.dispatch();
      this.moveRightIsDown = true;
      break;
    case "fireButton":
      this.advancedFireButton.frameName = 'button-1-ontouch.png';
      this.fireButtonDown.dispatch();
      this.fireButtonIsDown = true;
      break;
    case "thrustButton":
      this.advancedThrustButton.frameName = 'button-1-ontouch.png';
      this.thrustButtonDown.dispatch();
      this.thrustButtonIsDown = true;
      break;
  }
};

p.checkUp = function (e) {
  switch (e.name) {
    case "moveLeft":
      this.moveButtonLeft.frameName = 'button-move.png';
      this.moveLeftButtonUp.dispatch();
      this.moveLeftIsDown = false;
      break;
    case "moveRight":
      this.moveButtonRight.frameName = 'button-move.png';
      this.moveRightButtonUp.dispatch();
      this.moveRightIsDown = false;
      break;
    case "fireButton":
      this.advancedFireButton.frameName = 'button-1.png';
      this.fireButtonUp.dispatch();
      this.fireButtonIsDown = false;
      break;
    case "thrustButton":
      this.advancedThrustButton.frameName = 'button-1.png';
      this.thrustButtonUp.dispatch();
      this.thrustButtonIsDown = false;
      break;
  }
};

/**
 * @deprecated
 */
p.refresh = function () {
  console.warn('deprecated - no op taken');
};

module.exports = UserControl;
