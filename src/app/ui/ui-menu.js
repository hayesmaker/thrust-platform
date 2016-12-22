var UiComponent = require('./ui-component');
var _ = require('lodash');
var sound = require('../utils/sound');
//var inAppPurchaes = require('../data/in-app-purchases');
//var UIButton = require('./ui-button');
var version = require('../../../package.json').version;
var options = require('../data/options-model');

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
  this.dataProvider = [
    'PLAY THRUST',
    'TRAINING',
    'HIGH-SCORES',
    'OPTIONS'
  ];
}

/**
 * @property joypadFireButton
 * @type {boolean}
 */
p.joypadFireButton = true;
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
  this.items = [];
  _.each(
    this.dataProvider,
    _.bind(
      this.menuItem,
      this
    )
  );
  //var x = 10;
  //var y = 10;

  var style = {font: "14px thrust_regular", fill: "#ffffff", align: 'left'};
  this.version = game.make.text(0,0, 'v' + version + options.versionSuffix, style);
  this.version.anchor.setTo(0, 0);
  this.version.x = game.width - this.version.width - 10;
  this.version.y = 10;
  this.group.add(this.version);

  /*
  if (inAppPurchaes.levelsPurchased.length === 0 && inAppPurchaes.inappsService) {
    var purchaseLevelsBtn = new UIButton(this.group, "BUY\nLEVELS");
    purchaseLevelsBtn.render();
    purchaseLevelsBtn.group.x = x;
    purchaseLevelsBtn.group.y = y;
    purchaseLevelsBtn.onItemSelected.add(this.purchaseLevels, this);
    x = purchaseLevelsBtn.group.x + purchaseLevelsBtn.group.width;
    this.components = [purchaseLevelsBtn];
  }
  if (inAppPurchaes.inappsService) {
    var restoreButton = new UIButton(this.group, "RESTORE\nPURCHASE");
    this.components.push(restoreButton);
    restoreButton.render();
    restoreButton.group.x = x + 10;
    restoreButton.group.y = y;
    restoreButton.onItemSelected.add(this.restorePurchase, this);
  }
  */

};

p.purchaseLevels = function() {
  this.components[0].selectComponent();
  inAppPurchaes.buyClassicLevels(function() {
    this.components[0].deselectComponent();
  }.bind(this));
};

p.restorePurchase = function() {
  this.components[1].selectComponent();
  inAppPurchaes.restorePurchases(function() {
    this.components[1].deselectComponent();
  }.bind(this));
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
    game.input.gamepad.pad1.onUpCallback = function(buttonCode) {
      if (buttonCode === Phaser.Gamepad.BUTTON_1) {
        this.joypadFireButton = true;
      }
    }.bind(this);
    game.input.gamepad.pad1.onDownCallback = function(buttonCode) {
      if (buttonCode === Phaser.Gamepad.BUTTON_1 && this.joypadFireButton) {
        this.joypadFireButton = false;
        this.spacePressed();
      }
    }.bind(this);

  } else if (stick) {
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
 * //todo runtime error on game over / highscores on mobile
 * this.items[index].graphic.visible = true;
 * [Error] TypeError: undefined is not an object (evaluating 'this.items[index].graphic')
         selectItemByIndex (thrust-engine-cordova.js:24349)
         downPressed (thrust-engine-cordova.js:24414)
         checkPressed (thrust-engine-cordova.js:24314)
         update (thrust-engine-cordova.js:24303)
         update (thrust-engine-cordova.js:20813)
         update (thrust-engine-cordova.js:19495)
         update (phaser.min.js:10:28841)
         updateLogic (phaser.min.js:12:5150)
         update (phaser.min.js:12:4581)
         updateRAF (phaser.min.js:18:10011)
         _onLoop (phaser.min.js:18:9890)
 *
 * @method selectItemByIndex
 * @param index
 */
p.selectItemByIndex = function (index) {
  _.each(this.items, this.deselectItem);
  this.items[index].graphic.visible = true;
  sound.playSound(sound.UI_MENU_SELECT, 1);
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
  this.selectItemByIndex(this.selectedIndex);
  if (game.controls.useKeys) {
    game.controls.cursors.up.onDown.add(this.upPressed, this);
    game.controls.cursors.down.onDown.add(this.downPressed, this);
    game.controls.spacePress.onDown.add(this.spacePressed, this);
  }
  if (game.controls.useVirtualJoypad) {
    game.controls.buttonA.onDown.add(this.spacePressed, this);
    game.controls.buttonB.onDown.add(this.spacePressed, this);
  }
  this.itemSelected.add(this.menuSelectedCallback, this.playState);
};

/**
 * @method disable
 */
p.disable = function () {
  if (game.controls.useKeys) {
    game.controls.cursors.up.onDown.remove(this.upPressed, this);
    game.controls.cursors.down.onDown.remove(this.downPressed, this);
    game.controls.spacePress.onDown.remove(this.spacePressed, this);
  }
  if (game.controls.stick) {
    game.controls.buttonA.onDown.remove(this.spacePressed, this);
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

p.dispose = function() {
  UiComponent.prototype.dispose.call(this);
  this.version.destroy();
};




