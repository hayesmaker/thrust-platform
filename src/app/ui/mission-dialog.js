var utils = require('../utils/canvas');
var TweenMax = global.TweenMax;
var textData = require('../data/dialogs');

module.exports = {

  /**
   * @property dialogCallback
   */
  dialogCallback: null,

  /**
   * @property dialogCallbacContext
   */
  dialogCallbackContext: null,

  /**
   * @property group
   */
  group: null,

  /**
   * @property textIndex
   */
  textIndex: 0,

  /**
   * @method init
   * @param group
   */
  init: function (group) {
    this.group = group;
    this.initLayout();
    this.textData = textData.training;

  },

  /**
   * @method initLayout
   */
  initLayout: function () {
    this.layoutRect = new Phaser.Rectangle(0, 0, game.width * 0.8, game.height * 0.2);
  },

  /**
   * ctx, x, y, width, height, radius, fill, stroke, cornerRadii
   * @param dialogCallback
   * @param context
   *
   * @method render
   */
  render: function (dialogCallback, context) {
    this.dialogCallback = dialogCallback;
    this.dialogCallbackContext = context;
    this.renderBg();
    this.renderText();
    this.enable();

  },

  /**
   * @method renderBg
   */
  renderBg: function () {
    var lineW = 4;
    var w = this.layoutRect.width;
    var h = this.layoutRect.height;
    var bmd = game.make.bitmapData(w + lineW * 2, h + lineW * 2);
    bmd.ctx.fillStyle = "rgba(0,0,0, 0.5)";
    bmd.ctx.strokeStyle = "rgba(0,0,255, 1)";
    bmd.ctx.lineWidth = 4;
    utils.drawRoundRect(bmd.ctx, lineW / 2, lineW / 2, w, h, 25, true, true);
    this.bg = game.add.sprite(0, 0, bmd, null, this.group);
    this.bg.x = this.layoutRect.x = game.width / 2 - this.bg.width / 2;
    this.bg.y = this.layoutRect.y = game.height - this.bg.height - 10;
  },

  /**
   * @method renderText
   */
  renderText: function () {
    var style = {
      font: "18px Arial", fill: "#fff",
      align: "center",
      boundsAlignH: "left",
      boundsAlignV: "top",
      wordWrap: true, wordWrapWidth: this.layoutRect.width - 20
    };
    var text = game.add.text(this.bg.x + 20, this.bg.y + 10, this.textData[this.textIndex], style);
    this.group.add(text);
  },

  /**
   * @method enable
   */
  enable: function () {
    this.enabled = true;
    if (game.controls.useKeys) {
      game.controls.spacePress.onDown.add(this.spacePressed, this);
    }
    if (game.controls.useVirtualJoypad) {
      game.controls.buttonB.onDown.add(this.spacePressed, this);
    }
  },

  /**
   * @method disable
   */
  disable: function () {
    this.enabled = false;
    if (game.controls.useKeys) {
      game.controls.spacePress.onDown.remove(this.spacePressed, this);
    }
    if (game.controls.useVirtualJoypad) {
      game.controls.buttonB.onDown.remove(this.spacePressed, this);
    }
  },

  /**
   * @method spacePressed
   */
  spacePressed: function () {
    this.textIndex++;
    this.transitionExitComplete();
    this.disable();
    this.dialogCallback.call(this.dialogCallbackContext);
  },

  /**
   * @method transitionExitComplete
   */
  transitionExitComplete: function () {
    this.group.removeAll();
  }


};