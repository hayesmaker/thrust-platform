//var utils = require('../utils/canvas');
var TweenMax = global.TweenMax;
var textData = require('../data/dialogs');
var gameState = require('../data/game-state');

module.exports = {

  joypadFireButton: false,
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
    this.textIndex = 0;
    this.group = game.add.group(group);
    this.initLayout();
    this.textData = textData.training;
  },

  /**
   * @method initLayout
   */
  initLayout: function () {
    this.layoutRect = new Phaser.Rectangle(0, 0, game.width * 0.8, game.height * 0.225);
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
    this.startTweenIn();
  },

  /**
   * @method startTweenIn
   */
  startTweenIn: function () {
    var toY;
    if (game.controls.useVirtualJoypad) {
      toY = game.height / 2 - this.layoutRect.height / 2;
      this.group.y = -this.layoutRect.height;
    } else {
      toY = game.height - this.layoutRect.height - 20;
      this.group.y = game.height + this.layoutRect.height;
    }
    this.group.x = game.width / 2 - this.group.width / 2;
    TweenMax.to(this.group, 0.25, {
      y: toY, ease: Quad.easeOut, onComplete: function () {
        this.enable();
      }.bind(this)
    });
  },

  /**
   * @method startTweenOut
   */
  startTweenOut: function () {
    var toY;
    if (game.controls.useVirtualJoypad) {
      toY = -this.layoutRect.height;
    } else {
      toY = game.height + this.layoutRect.height;
    }
    TweenMax.to(this.group, 0.25, {
      y: toY, ease: Quad.easeOut, onComplete: function () {
        this.transitionExitComplete();
      }.bind(this)
    });
  },

  /**
   * @method renderBg
   */
  renderBg: function () {
    var lineW = 4;
    var w = this.layoutRect.width;
    var h = this.layoutRect.height;
    //if (game.device.iPad || game.device.iPhone) {
    /*
     this.bg = game.add.graphics(0,0);
     this.bg.beginFill(0xFF3300);
     this.bg.lineStyle(lineW, 0xffd900, 1);
     this.bg.drawRect(0, 0, w + lineW * 2, h + lineW *2);
     this.bg.endFill();
     this.bg.fixedToCamera = true;

     //this.bg = new Phaser.Sprite();
     //this.group.add(this.bg);
     //this.bg.addChild(graphics);
     //}
     */
    var bmd = game.make.bitmapData(1, 1);
    bmd.rect(0, 0, 1, 1, 'rgba(0,100,0, 1)');
    this.bg = game.add.sprite(0, 0, bmd, null, this.group);
    this.bg.width = w + lineW * 2;
    this.bg.height = h + lineW * 2;

    /* This method isn't working on ipad
     var bmd = game.make.bitmapData(w + lineW * 2, h + lineW * 2);
     bmd.ctx.fillStyle = "rgba(0,0,0, 1)";
     bmd.ctx.strokeStyle = "rgba(0,0,255, 1)";
     bmd.ctx.lineWidth = lineW;
     utils.drawRoundRect(bmd.ctx, lineW / 2, lineW / 2, w, h, 25, true, true);
     */

    this.bg = game.add.sprite(0, 0, bmd, null, this.group);
    this.bg.x = this.layoutRect.x = 0;
    this.bg.y = this.layoutRect.y = 0;
    //this.bg.fixedToCamera = true;
  },

  /**
   * @method renderText
   */
  renderText: function () {
    var style = {
      font: "18px Arial", fill: "#fff",
      align: "center",
      boundsAlignH: "center",
      boundsAlignV: "center",
      wordWrap: true, wordWrapWidth: this.layoutRect.width - 20
    };
    style.font = this.scaleFontSize(style.font);
    var text = game.add.text(0, 0, this.textData[this.textIndex], style);
    text.setTextBounds(10, 10, this.layoutRect.width - 20, this.layoutRect.height - 10);
    this.group.add(text);
  },

  scaleFontSize: function (style) {
    var fontsizeStr = style.split('px')[0];
    var fontsize = parseInt(fontsizeStr, 10) * gameState.gameScale;
    return style.replace(fontsizeStr, fontsize);
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
      //game.controls.buttonB.onDown.add(this.spacePressed, this);
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
      //game.controls.buttonB.onDown.remove(this.spacePressed, this);
    }
  },

  /**
   * @method spacePressed
   */
  spacePressed: function () {
    this.textIndex++;
    this.startTweenOut();
    this.disable();
  },

  /**
   * @method transitionExitComplete
   */
  transitionExitComplete: function () {
    this.dialogCallback.call(this.dialogCallbackContext);
    this.group.removeAll();
  },

  /**
   * @method update
   */
  update: function () {
    game.input.gamepad.pad1.onUpCallback = function (buttonCode) {
      if (buttonCode === Phaser.Gamepad.BUTTON_1) {
        this.joypadFireButton = true;
      }
    }.bind(this);
    game.input.gamepad.pad1.onDownCallback = function (buttonCode) {
      if (buttonCode === Phaser.Gamepad.BUTTON_1 && this.joypadFireButton) {
        this.joypadFireButton = false;
        this.spacePressed();
      }
    }.bind(this);
  }
};