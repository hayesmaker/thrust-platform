var UiComponent = require('./ui-component');
var _ = require('lodash');
var sound = require('../utils/sound');

var p = UIMenu.prototype = Object.create(UiComponent.prototype, {
  constructor: UIMenu
});

module.exports = UIMenu;

/**
 *
 *
 * @class UIMenu
 * @param group
 * @param name
 * @param menuSelectedCallback
 * @param playState
 * @constructor
 */
function UIMenu(group, name, menuSelectedCallback, playState) {
  UiComponent.call(this, group, name, true, true);
  this.menuSelectedCallback = menuSelectedCallback;
  this.playState = playState;
}

/**
 * @property group
 * @type {Phaser.Group}
 */
p.group = null;
/**
 * @property items
 * @type {Array}
 */
p.items = [];

/**
 * @property itemSelected
 * @type {Phaser.Signal}
 */
p.itemSelected = new Phaser.Signal();

/**
 * @property style
 * @type {{font: string, fill: string, align: string}}
 */
p.style = {font: "16px thrust_regular", fill: "#ffffff", align: "left"};

/**
 * @property padding
 * @type {number}
 */
p.padding = 5;

/**
 * @property selectedIndex
 * @type {number}
 */
p.selectedIndex = 0;

/**
 * @property stickUpPressed
 * @type {boolean}
 */
p.stickUpPressed = false;

/**
 * @property stickDownPressed
 * @type {boolean}
 */
p.stickDownPressed = false;

/**
 * @method render
 */
p.render = function () {
  UiComponent.prototype.render.call(this);
  console.log('ui-menu :: render');
  this.items = [];
  _.each(
    [
      'PLAY THRUST',
      'HIGH-SCORES',
      'OPTIONS'
    ],
    _.bind(
      this.menuItem,
      this
    )
  );
};

/**
 * @method update
 */
p.update = function () {
  var stick = game.controls.stick;
  var joypad = game.externalJoypad;
  if (joypad) {
    if (joypad.up.isDown) {
      this.stickUpPressed = true;
      this.stickDownPressed = false;
    } else if (joypad.down.isDown) {
      this.stickUpPressed = false;
      this.stickDownPressed = true;
    } else {
      this.checkPressed();
    }
    if (joypad.fireButton.isDown) {
      this.spacePressed();
    }
  }
  if (stick) {
    if (stick.isDown) {
      if (stick.direction === Phaser.UP) {
        this.stickUpPressed = true;
        this.stickDownPressed = false;
      } else if (stick.direction === Phaser.DOWN) {
        this.stickUpPressed = false;
        this.stickDownPressed = true;
      }
    } else {
      this.checkPressed();
    }
  }
};

/**
 * @method checkPressed
 */
p.checkPressed = function() {
  if (this.stickDownPressed) {
    this.stickDownPressed = false;
    this.downPressed();
  }
  if (this.stickUpPressed) {
    this.stickUpPressed = false;
    this.upPressed();
  }
};

/**
 * @method menuItem
 * @param label
 * @param index
 */
p.menuItem = function (label, index) {
  var text = game.add.text(game.width / 2, game.height / 2 - 35 + 35 * index, label, this.style, this.group);
  text.anchor.setTo(0.5);
  var graphic = game.add.graphics(0, 0, this.group);
  graphic.beginFill(0xff0000, 0.8);
  graphic.drawRect(0, 0, text.width + this.padding * 2, text.height + this.padding * 2);
  graphic.endFill();
  graphic.x = text.x - text.width / 2 - this.padding;
  graphic.y = text.y - text.height / 2 - this.padding;
  text.bringToTop();
  this.items.push({
    text: text,
    graphic: graphic
  });
};

/**
 * @method selectItemByIndex
 * @param index
 */
p.selectItemByIndex = function (index) {
  _.each(this.items, this.deselectItem);
  this.items[index].graphic.visible = true;
  sound.playSound('select2', 0.2);
  console.log('this.items[index]', this.items[index].graphic);
};

/**
 * @method deselectItem
 * @param item
 */
p.deselectItem = function (item) {
  item.graphic.visible = false;
};

/**
 * @method enable
 */
p.enable = function () {
  this.selectedIndex = 0;
  console.log('ui-menu :: enable', this.selectedIndex);
  this.selectItemByIndex(this.selectedIndex);
  game.controls.cursors.up.onDown.add(this.upPressed, this);
  game.controls.cursors.down.onDown.add(this.downPressed, this);
  game.controls.spacePress.onDown.add(this.spacePressed, this);
  if (game.controls.stick) {
    game.controls.buttonB.onDown.add(this.spacePressed, this);
  }
  this.itemSelected.add(this.menuSelectedCallback, this.playState);
};

/**
 * @method disable
 */
p.disable = function () {
  console.log('ui-menu :: disable');
  game.controls.cursors.up.onDown.remove(this.upPressed, this);
  game.controls.cursors.down.onDown.remove(this.downPressed, this);
  game.controls.spacePress.onDown.remove(this.spacePressed, this);
  if (game.controls.stick) {
    game.controls.buttonB.onDown.remove(this.spacePressed, this);
  }
  this.itemSelected.remove(this.menuSelectedCallback, this.playState);
};

/**
 * @method upPressed
 */
p.upPressed = function () {
  if (this.selectedIndex > 0) {
    this.selectedIndex--;
  } else {
    this.selectedIndex = this.items.length - 1;
  }
  this.selectItemByIndex(this.selectedIndex);
};

/**
 * @method downPressed
 */
p.downPressed = function () {
  if (this.selectedIndex < this.items.length - 1) {
    this.selectedIndex++;
  } else {
    this.selectedIndex = 0;
  }
  this.selectItemByIndex(this.selectedIndex);
};

/**
 * @method spacePressed
 */
p.spacePressed = function () {
  this.itemSelected.dispatch(this.items[this.selectedIndex]);
};





