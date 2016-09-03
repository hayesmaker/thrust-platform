var _ = require('lodash');
var UiComponent = require('../ui-component');
var UiSwitch = require('../ui-switch');
var optionsModel = require('../../data/options-model');
var user

var p = ControlOptions.prototype = Object.create(UiComponent.prototype, {
  constructor: ControlOptions
});

module.exports = ControlOptions;

/**
 * @property group
 * @type {null}
 */
p.group = null;

p.marginTop = 0;

/**
 *
 *
 * @class ControlOptions
 * @param group
 * @param name
 * @param layoutRect
 * @constructor
 */
function ControlOptions(group, name, layoutRect) {
  UiComponent.call(this, group, name, true, false);
  this.layoutRect = layoutRect;
}

/**
 *
 */
p.render = function () {
  UiComponent.prototype.render.call(this);
  this.createDisplay();
  this.renderDefaults();
};

/**
 *
 */
p.createDisplay = function () {

  var rightAlignedStyle = _.clone(this.style);
  rightAlignedStyle.align = "right";

  var text1 = game.add.text(0, 0, "ROTATE\nLEFT", this.style, this.group);
  var text2 = game.add.text(0, 0, "ROTATE\nRIGHT", rightAlignedStyle, this.group);
  var text3 = game.add.text(0, 0, "THRUST", this.style, this.group);
  var text4 = game.add.text(0, 0, "FIRE", this.style, this.group);
  //text1.anchor.setTo(0.5);
  //text2.anchor.setTo(0.5);
  text1.x = this.layoutRect.halfWidth * 0.05;
  text1.y = this.layoutRect.height * 0.45;
  text2.x = this.layoutRect.halfWidth * 0.45;
  text2.y = this.layoutRect.height * 0.45;
  text3.x = this.layoutRect.width * 0.65;
  text3.y = this.layoutRect.height * 0.6;
  text4.x = this.layoutRect.width * 0.85;
  text4.y = this.layoutRect.height * 0.5;

  var graphics = game.add.graphics(0, 0, this.group);
  graphics.lineStyle(1, 0xff00c6, 1);

  console.log('virtualjoypad dpad= ', game.controls.stick);
  console.log('virtualjoypad buttonA= ', game.controls.buttonA);
  console.log('virtualjoypad buttonB= ', game.controls.buttonB);

  var dpad = game.controls.stick;
  var aButton = game.controls.buttonA;
  var bButton = game.controls.buttonB;

  //var fraction = spr.height * 0.007;

  var buttonLeftPos = new Phaser.Point(
    dpad.posX - dpad.sprite.width * 0.25,
    dpad.posY
  );

  var buttonRightPos = new Phaser.Point(
    dpad.posX + dpad.sprite.width * 0.25,
    dpad.posY
  );

  var aButtonPos = new Phaser.Point(
    aButton.posX,
    aButton.posY

  );
  var bButtonPos = new Phaser.Point(
    bButton.posX,
    bButton.posY
  );

  var coords = [
    {x: text1.x + text1.width * 0.5, y: text1.y + text1.height},
    {x: buttonLeftPos.x, y: text1.y + text1.height},
    {x: buttonLeftPos.x, y: buttonLeftPos.y},
    {x: text2.x + text2.width * 0.5, y: text2.y + text2.height},
    {x: text2.x + text2.width * 0.5, y: buttonRightPos.y},
    {x: buttonRightPos.x, y: buttonRightPos.y},
    {x: text3.x + text3.width * 0.5, y: text3.y + text3.height},
    {x: text3.x + text3.width * 0.5, y: aButtonPos.y},
    {x: aButtonPos.x, y: aButtonPos.y},
    {x: text4.x + text4.width * 0.5, y: text4.y + text4.height},
    {x: text4.x + text4.width * 0.5, y: bButtonPos.y},
    {x: bButtonPos.x, y: bButtonPos.y}
  ];


  graphics.moveTo(coords[0].x, coords[0].y);
  graphics.lineTo(coords[1].x, coords[1].y);
  graphics.lineTo(coords[2].x, coords[2].y);
  graphics.moveTo(coords[3].x, coords[3].y);
  graphics.lineTo(coords[4].x, coords[4].y);
  graphics.lineTo(coords[5].x, coords[5].y);
  graphics.moveTo(coords[6].x, coords[6].y);
  graphics.lineTo(coords[7].x, coords[7].y);
  graphics.lineTo(coords[8].x, coords[8].y);
  graphics.moveTo(coords[9].x, coords[9].y);
  graphics.lineTo(coords[10].x, coords[10].y);
  graphics.lineTo(coords[11].x, coords[11].y);



  var gamePadEnabled = new UiSwitch(this.group, "VIRTUAL JOYPAD");
  gamePadEnabled.render();
  gamePadEnabled.group.x = this.layoutRect.halfWidth - gamePadEnabled.originPos.x;
  gamePadEnabled.group.y = this.marginTop;
  //gamePadEnabled.switchedOn.add(this.onSwitch, this, 0, name);
  //gamePadEnabled.switchedOff.add(this.offSwitch, this, 0, name);
  this.components.push(gamePadEnabled);
};

/**
 *
 */
p.renderDefaults = function () {
  /*
   if (optionsModel.controls.virtualJoypad) {
   this.components[0].switch(true);
   }
   */
};

//todo fix this dispose
p.dispose = function () {
  _.each(this.components, function (component) {
    //component.switchOn.removeAll();
    //component.switchOff.removeAll();
  });
  UiComponent.prototype.dispose.call(this);
};

/**
 *
 */
p.virtualJoypadOn = function () {
  optionsModel.controls.virtualJoypad = true;
};

/**
 *
 */
p.virtualJoypadOff = function () {
  optionsModel.controls.virtualJoypad = false;
};