var UiComponent = require('./ui-component');
var _ = require('lodash');
var sound = require('../utils/sound');
//var inAppPurchaes = require('../data/in-app-purchases');
//var UIButton = require('./ui-button');
var options = require('../data/options-model');
var game = global.game;

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
    {label: 'PLAY', id: 'play'},
    {label: 'HOW TO PLAY', id: 'rules'},
    /*{label: 'GAME MODES', id: 'modes'},*/
    {label: 'HIGH SCORES', id: 'scores'},
    {label: 'OPTIONS', id: 'options'}
  ];
}

/**
 * @property debounceGamepadFire
 * @type {boolean}
 */
p.debounceGamepadFire = true;
/**
 * @property debounceGamepadDpad
 * @type {boolean}
 */
p.debounceGamepadDpad = false;
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
 * @property styleSelected
 * @type {{font: string, fill: string, align: string}}
 */
p.styleFullSelected = {font: "24px thrust_regular", fill: "#ffffff", align: "left"};
p.styleFullDeselected = {font: "24px thrust_regular", fill: "#1d0431", align: "left"};
p.styleMinSelected = {font: "16px thrust_regular", fill: "#ffffff", align: "left"};
p.styleMinDeselected = {font: "16px thrust_regular", fill: "#1d0431", align: "left"};

/**
 * @property padding
 * @type {{x: number, y: number}}
 */
p.padding = {
  x: 50,
  y: 10
};

/**
 * @property selectedIndex
 * @type {number}
 */
p.selectedIndex = 0;

/**
 * @method render
 */
p.render = function () {
  UiComponent.prototype.render.call(this);
  this.debounceGamepadFire = true;
  //var x = 10;
  //var y = 10;

  var style = {font: "12px thrust_regular", fill: "#ffffff", align: 'left'};
  this.version = game.make.text(0,0, 'v' + options.version + options.versionSuffix, style);
  this.version.anchor.setTo(0, 0);
  this.version.x = game.width - this.version.width - 10;
  this.version.y = game.height - this.version.height - 10;
  this.group.add(this.version);

  this.logo = game.make.sprite(0, 0, 'thrust-logo');
  this.logo.width = game.width * 0.6;
  this.logo.scale.y = this.logo.scale.x;
  //this.logo.height =
  this.logo.position.x = game.width/2 - this.logo.width/2;
  this.logo.position.y = 20;
  this.group.add(this.logo);
  this.topY = this.logo.position.y + this.logo.height;
  this.items = [];

  this.menuSpr = game.add.sprite(0,0, '', '', this.group);
  _.each(this.dataProvider, _.bind(this.menuItem, this));
  var lastItem = this.items[this.items.length - 1];
  var lastY = lastItem.graphic.position.y + lastItem.graphic.height;
  //this.menuSpr.y = ;
  this.menuSpr.y = (this.logo.y + this.logo.height) / 2 + (game.height) / 2 - lastY / 2;
  console.log("this.menuSpr height", lastY, this.menuSpr.y);


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

/*
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
*/

/**
 * @method update
 */
p.update = function () {
  if (!game.controls.useExternalJoypad) {
    return;
  }
  var gamepad = game.externalJoypad;
  if (gamepad) {
    if (gamepad.fireButton.isUp) {
      this.debounceGamepadFire = false;
    } else if (gamepad.fireButton.isDown && !this.debounceGamepadFire) {
      this.debounceGamepadFire = true;
      this.gamepadFirePressed();
    }
    if (gamepad.up.isUp && gamepad.down.isUp) {
      this.debounceGamepadDpad = false;
    } else if (gamepad.up.isDown && !this.debounceGamepadDpad) {
      this.debounceGamepadDpad = true;
      this.upPressed();
    } else if (gamepad.down.isDown && !this.debounceGamepadDpad) {
      this.debounceGamepadDpad = true;
      this.downPressed();
    }
  }
};

/**
 *
 *
 * @method menuItem
 * @param data {Object}
 * @param index {Number}
 */
p.menuItem = function (data, index) {
  var styleSelected = this.isFullLayout? this.styleFullSelected : this.styleMinSelected;
  var styleDeselected = this.isFullLayout? this.styleFullDeselected : this.styleMinDeselected;
  var textDeselected = game.make.text(
    0,
    0,
    data.label,
    styleDeselected,
    this.group
  );
  var textSelected = game.make.text(
    0,
    0,
    data.label,
    styleSelected,
    this.group
  );
  textSelected.visible = false;
  textSelected.anchor.setTo(0.5);
  textDeselected.anchor.setTo(0.5);
  var graphic = game.make.graphics(0, 0, this.group);
  graphic.beginFill(0xffffff, 0.5);
  graphic.drawRect(0, 0, game.width * 0.35, textSelected.height + this.padding.y * 2);
  graphic.endFill();
  graphic.anchor.setTo(0.5);
  graphic.x = 0;
  graphic.y = 0;
  var topY = 0;
  console.log("ui-menu :: menuItem topY=", game.height, this.topY, topY);
  graphic.x = game.width/2 - graphic.width * 0.5;
  graphic.y = topY  + (graphic.height + (2*this.padding.y)) * index;
  textSelected.x = graphic.width / 2;
  textSelected.y = graphic.height /2;
  textDeselected.x = textSelected.x;
  textDeselected.y = textSelected.y;

  this.menuSpr.addChild(graphic);
  graphic.addChild(textDeselected);
  graphic.addChild(textSelected);
  graphic.inputEnabled = true;
  graphic.events.onInputDown.add(this.onMenuItemTouch, this, 0, index);

  //textSelected.bringToTop();
  this.items.push({
    textSelected: textSelected,
    textDeselected: textDeselected,
    graphic: graphic,
    id: data.id
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
  //this.items[index].graphic.visible = true;
  this.items[index].textSelected.visible = true;
  sound.playSound(sound.UI_MENU_SELECT, 1);
};

/**
 * @method deselectItem
 * @param item
 */
p.deselectItem = function (item) {
  item.textSelected.visible = false;
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
    //@todo touch menu
    //game.controls.buttonA.onDown.add(this.spacePressed, this);
    //game.controls.buttonB.onDown.add(this.spacePressed, this);
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
  //@todo touch menu
  //if (game.controls.stick) {
    //game.controls.buttonA.onDown.remove(this.spacePressed, this);
    //game.controls.buttonB.onDown.remove(this.spacePressed, this);
  //}
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
  console.warn("ui-menu :: spacePressed");
  //disable touch control
  //enable keys
  game.controls.useVirtualJoypad = false;
  game.controls.useExternalJoypad = false;
  this.itemSelected.dispatch(this.items[this.selectedIndex].id);
};

p.gamepadFirePressed = function() {
  game.controls.useVirtualJoypad = false;
  this.itemSelected.dispatch(this.items[this.selectedIndex].id);
};

/**
 * @method onMenuItemTouch
 * @param e
 * @param pointer
 * @param index
 */
p.onMenuItemTouch = function(e, pointer, index) {
  this.selectItemByIndex(index);
  game.controls.useVirtualJoypad = true;
  game.controls.useExternalJoypad = false;
  //game.controls.initAdvancedTouchControls();
  this.itemSelected.dispatch(this.items[index].id);
};

p.dispose = function() {
  UiComponent.prototype.dispose.call(this);
  _.each(this.items, function(item) {
    item.graphic.events.onInputUp.remove(this.onMenuItemTouch, this);
    item.graphic.destroy();
    this.menuSpr.destroy();
  }.bind(this));
  this.version.destroy();
  this.logo.destroy();
};




