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

  var style = {font: "12px thrust_regular", fill: "#ffffff", align: 'left'};
  this.version = game.make.text(0,0, 'v' + options.version + options.versionSuffix, style);
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
  var gamepad = game.externalJoypad;
  if (gamepad) {
    if (gamepad.fireButton.isUp) {
      this.debounceGamepadFire = false;
    } else if (gamepad.fireButton.isDown && !this.debounceGamepadFire) {
      this.debounceGamepadFire = true;
      this.spacePressed();
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
  textSelected.x = textDeselected.x = graphic.width/2;
  textSelected.y = textDeselected.y = graphic.height/2;
  var menuSpr = game.add.sprite(0,0, '', '', this.group);
  menuSpr.x = game.width/2 - graphic.width * 0.5;

  var topY = game.height /2 - 100;
  if (game.width < 1000 || game.height < 700) {
    //console.warn("small layout");
    //topY = graphic.height + game.height * 0.1;
  }
  menuSpr.y = topY  + (graphic.height + (2*this.padding.y)) * index - graphic.height * 0.5;
  menuSpr.addChild(graphic);
  menuSpr.addChild(textDeselected);
  menuSpr.addChild(textSelected);
  menuSpr.inputEnabled = true;
  menuSpr.events.onInputDown.add(this.onMenuItemTouch, this, 0, index);

  //textSelected.bringToTop();
  this.items.push({
    spr: menuSpr,
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
  this.itemSelected.dispatch(this.items[index].id);
};

p.dispose = function() {
  UiComponent.prototype.dispose.call(this);
  _.each(this.items, function(item) {
    item.spr.events.onInputUp.remove(this.onMenuItemTouch, this);
    item.spr.destroy();
  }.bind(this));
  this.version.destroy();
};




