var _ = require('lodash');
var UiComponent = require('../ui-component');

var p = ControlOptions.prototype = Object.create(UiComponent.prototype, {
  constructor: ControlOptions
});

module.exports = ControlOptions;

/**
 * @property group
 * @type {null}
 */
p.group = null;

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
  var spr = game.add.sprite(0, 0, 'combined', 'gamepad.png', this.group);
  spr.anchor.setTo(0.5);
  if (this.isFullLayout) {
    spr.scale.setTo(1.5);
  }
  spr.x = this.layoutRect.width * 0.5;
  spr.y = this.layoutRect.height * 0.5;
  var text1 = game.add.text(0, 0, "ROTATE\nRIGHT", this.style, this.group);
  var text2 = game.add.text(0, 0, "ROTATE\nLEFT", this.style, this.group);
  var text3 = game.add.text(0, 0, "FIRE", this.style, this.group);
  var text4 = game.add.text(0, 0, "THRUST", this.style, this.group);
  text1.anchor.setTo(0.5);
  text2.anchor.setTo(0.5);
  text1.x = this.layoutRect.halfWidth * 0.5;
  text1.y = this.layoutRect.height * 0.3;
  text2.x = this.layoutRect.halfWidth * 0.45;
  text2.y = this.layoutRect.height * 0.45;
  text3.x = this.layoutRect.width * 0.7;
  text3.y = this.layoutRect.height * 0.3;
  text4.x = this.layoutRect.width * 0.7;
  text4.y = this.layoutRect.height * 0.4;
  var graphics = game.add.graphics(0, 0, this.group);
  graphics.lineStyle(1, 0xff00c6, 1);
  var fraction = spr.height * 0.007;
  var buttonRightPos = new Phaser.Point(
    spr.x - spr.width * 0.075,
    spr.y + spr.height * 0.06
  );
  var buttonLeftPos = new Phaser.Point(
    spr.x - spr.width * 0.14,
    buttonRightPos.y
  );
  var aButtonPos = new Phaser.Point(
    spr.x + spr.width * 0.23,
    spr.y - spr.height * 0.05
  );
  var bButtonPos = new Phaser.Point(
    spr.x + spr.width * 0.3,
    spr.y - spr.height * 0.15
  );
  var coords = [
    {x: text1.x + text1.width * 0.5, y: text1.y},
    {x: buttonLeftPos.x, y: text1.y},
    {x: buttonLeftPos.x, y: buttonLeftPos.y - fraction},
    {x: text2.x, y: text2.y + text2.height * 0.5},
    {x: text2.x, y: buttonRightPos.y + fraction},
    {x: buttonRightPos.x, y: buttonRightPos.y + fraction},
    {x: text3.x, y: text3.y + text3.height * 0.5},
    {x: bButtonPos.x, y: text3.y + text3.height * 0.5},
    {x: bButtonPos.x, y: bButtonPos.y},
    {x: text4.x + text4.width * 0.5, y: text4.y + text4.height * 0.5},
    {x: text4.x + text4.width * 0.5, y: aButtonPos.y},
    {x: aButtonPos.x, y: aButtonPos.y}
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
  // this.useExternalJoypad = false;
  // this.useVirtualJoypad = true;
};

/**
 *
 */
p.virtualJoypadOff = function () {
  // this.useExternalJoypad = false;
  // this.useVirtualJoypad = true;
};