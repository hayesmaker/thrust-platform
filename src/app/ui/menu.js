var _ = require('lodash');
var stateScreen = require('./state-screen-manager');
var gameStates = require('../data/game-state');

module.exports = {

  items: [],

  padding: 5,

  style: {font: "16px thrust_regular", fill: "#ffffff", align: "left"},

  selectedIndex: 0,

  itemSelected: null,

  stickUpPressed: false,

  stickDownPressed:false,

  init: function (group) {
    this.items = [];
    this.group = stateScreen.init(group, gameStates.PLAY_STATES.MENU);
    this.itemSelected = new Phaser.Signal();
    _.each(['PLAY THRUST', 'HIGH-SCORES', 'OPTIONS'], _.bind(this.menuItem, this));
  },

  menuItem: function (label, index) {
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
  },

  selectItem: function (index) {
    _.each(this.items, this.deselectItem);
    this.items[index].graphic.visible = true;
  },

  deselectItem: function (item) {
    item.graphic.visible = false;
  },

  enable: function () {
    stateScreen.enable(this.group);
    this.selectedIndex = 0;
    this.selectItem(this.selectedIndex);
    game.controls.cursors.up.onDown.add(this.upPressed, this);
    game.controls.cursors.down.onDown.add(this.downPressed, this);
    game.controls.spacePress.onDown.add(this.spacePressed, this);
    if (game.controls.stick) {
      game.controls.buttonB.onDown.add(this.spacePressed, this);
    }
  },

  disable: function () {
    stateScreen.disable(this.group);
    game.controls.cursors.up.onDown.remove(this.upPressed, this);
    game.controls.cursors.down.onDown.remove(this.downPressed, this);
    game.controls.spacePress.onDown.remove(this.spacePressed, this);
    if (game.controls.stick) {
      game.controls.buttonB.onDown.remove(this.spacePressed, this);
    }
  },

  upPressed: function () {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    } else {
      this.selectedIndex = this.items.length - 1;
    }
    this.selectItem(this.selectedIndex);
  },

  downPressed: function () {
    if (this.selectedIndex < this.items.length - 1) {
      this.selectedIndex++;
    } else {
      this.selectedIndex = 0;
    }
    this.selectItem(this.selectedIndex);
  },

  spacePressed: function () {
    this.itemSelected.dispatch(this.items[this.selectedIndex]);
  },

  update: function () {
    var stick = game.controls.stick;
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
        if (this.stickDownPressed) {
          this.stickDownPressed = false;
          this.downPressed();
        }
        if (this.stickUpPressed) {
          this.stickUpPressed = false;
          this.upPressed();
        }
      }
    }
  }


};