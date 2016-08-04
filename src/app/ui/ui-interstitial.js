var UIComponent = require('./ui-component');
var _ = require('lodash');
var gameState = require('../data/game-state');
var TweenLite = global.TweenLite;
var TimelineLite = global.TimelineLite;
var Quad = global.Quad;
var dialog = require('./mission-dialog');

var p = UIInterstial.prototype = Object.create(UIComponent.prototype, {
  constructor: UIInterstial
});

module.exports = UIInterstial;

/**
 * @class UIInterstial
 * @param group
 * @param name
 * @param playState
 * @constructor
 */
function UIInterstial(group, name, playState) {
  UIComponent.call(this, group, name, true, true);
  this.playState = playState;
}

/**
 * @property onExitComplete
 * @type {Phaser.Signal}
 */
p.onExitComplete = new Phaser.Signal();

/**
 * @property preventAutoEnable
 * @type {boolean}
 */
p.preventAutoEnable = true;

/**
 * Data provider for this ui component
 * 
 * @property fields
 * @type {*[]}
 */
p.fields = [
  {
    successLabel: "Mission Complete",
    failLabel: "Mission Failed",
    yPos: 0.3,
    style: { font: "18px thrust_regular", fill: "#ffffff", align: "left" },
    center: true
  },
  {
    successLabel: "Orb Recovered",
    failLabel: "Orb Not Recovered",
    valueId: "ORB_RECOVERED",
    yPos: 0.4,
    style: { font: "14px thrust_regular", fill: "#ffffff", align: "left" }
  },
  {
    successLabel: "Planet Destroyed",
    failLabel: "",
    valueId: "PLANET_BUSTER",
    yPos: 0.45,
    style: { font: "14px thrust_regular", fill: "#ffffff", align: "left" }
  },
  {
    successLabel: "Prepare for warp",
    failLabel: "Retry Mission",
    yPos: 0.55,
    style: { font: "18px thrust_regular", fill: "#00ffff", align: "left" },
    center: true
  },
  {
    successLabel: "Press Fire",
    failLabel: "Press Fire",
    yPos: 0.6,
    style: { font: "18px thrust_regular", fill: "#00ff00", align: "left" },
    center: true
  }
];

p.scaleFontSize = function(style) {
  var fontsizeStr = style.split('px')[0];
  var fontsize = parseInt(fontsizeStr, 10) * gameState.gameScale;
  return style.replace(fontsizeStr, fontsize);
};

/**
 * @method createLabels
 * @param x
 * @param field
 * @param index
 * @param label
 */
p.createLabels = function(x, field, index, label) {
  var fontStyle = this.scaleFontSize(field.style.font);
  if (gameState.bonuses.planetBuster) {
    if (index === 2 || index === 3) {
      label = field.successLabel;
    }
  } else {
    if (index === 2) {
      label = field.failLabel;
    }
  }
  field.tf = game.add.text(x, game.height * field.yPos, label, {
    font: fontStyle,
    fill: field.style.fill,
    align: field.style.align
  }, this.group);
  field.tf.alpha = 0;
  return label;
};

/**
 * @method createValues
 * @param x
 * @param field
 * @param label
 */
p.createValues = function(x, field, label) {
  var fontStyle = this.scaleFontSize(field.style.font);
  if (field.center) {
    field.tf.anchor.setTo(0.5, 0);
  } else {
    field.tf.x = field.tf.x - 200 * gameState.gameScale;
  }
  if (field.valueId) {
    if (label === field.successLabel) {
      field.score = gameState.getScoreByValueId(field.valueId);
    } else {
      field.score = 0;
    }
    if (label.length) {
      field.valueTf = game.add.text(x + 150 * gameState.gameScale, game.height * field.yPos, field.score, {
        font: fontStyle,
        fill: field.style.fill,
        align: field.style.align
      }, this.group);
      field.valueTf.alpha = 0;
    }
  }
};

/**
 * @method render
 */
p.render = function() {
  UIComponent.prototype.render.call(this);
  var x = game.width/2;
  _.each(this.fields, function(field, index) {
    var labelText = gameState.bonuses.orbRecovered? field.successLabel : field.failLabel;
    var label = this.createLabels(x, field, index, labelText);
    this.createValues(x, field, label);
  }.bind(this));
  this.transitionEnter();
};

/**
 * Called by play state only for external joypad support
 *
 * @method update
 */
p.update = function() {
  if (!this.enabled) {
    return;
  }
  if (game.controls.gamepad.justPressed(Phaser.Gamepad.BUTTON_1)) {
    this.spacePressed();
  }
};

/**
 * @method enable
 */
p.enable = function() {
  this.enabled = true;
  if (game.controls.useKeys) {
    game.controls.spacePress.onDown.add(this.spacePressed, this);
  }
  if (game.controls.useVirtualJoypad) {
    game.controls.buttonB.onDown.add(this.spacePressed, this);
  }
};

/**
 * @method disable
 */
p.disable = function() {
  this.enabled = false;
  if (game.controls.useKeys) {
    game.controls.spacePress.onDown.remove(this.spacePressed, this);
  }
  if (game.controls.useVirtualJoypad) {
    game.controls.buttonB.onDown.remove(this.spacePressed, this);
  }
};

/**
 * @method spacePressed
 */
p.spacePressed = function () {
  this.disable();
  this.transitionExit();
};

/**
 * Tweens the ui component elements into view
 * 
 * @method transitionEnter
 */
p.transitionEnter = function() {
   this.tl = new TimelineLite({delay: 0.25, onComplete: this.transitionEnterComplete, callbackScope: this});
   _.each(this.fields, function(field) {
     this.tl.add(TweenLite.to(field.tf, 0.2, {alpha: 1, ease:Quad.easeIn}));
   }.bind(this));
    this.tl.add(TweenLite.to(this, 0.5));
   _.each(this.fields, function(field) {
     if (field.valueTf) {
       this.tl.add(TweenLite.to(field.valueTf, 0.2, {alpha: 1, ease:Quad.easeIn}));
       if (field.score > 0) {
         var newScore = gameState.score + field.score;
         this.tl.add(TweenMax.to(gameState, 0.3, {score: newScore, roundProps:"score"}));
       }
     }
   }.bind(this));
};

/**
 * Tweens the ui component elements out of view
 * 
 * @method transitionExit
 */
p.transitionExit = function() {
  this.tl = new TimelineLite({delay: 0, onComplete: this.transitionExitComplete, callbackScope: this});
  _.each(this.fields, function(field) {
    this.tl.add(TweenLite.to(field.tf, 0.2, {y: -100, ease:Quad.easeIn}));
    if (field.valueTf) {
      this.tl.add(TweenLite.to(field.valueTf, 0.2, {x: game.width + 100, ease:Quad.easeIn}));
    }
  }.bind(this));
  this.onExitComplete.dispatch();
};

/**
 * @method transitionEnterComplete
 */
p.transitionEnterComplete = function() {
  this.enable();
};

/**
 * @method transitionExitComplete
 */
p.transitionExitComplete = function() {
  this.group.removeAll();
  if (gameState.trainingMode) {
    dialog.render(function() {
      gameState.isGameOver = true;
      this.playState.gameOver();
    }.bind(this), this)
  } else {
    this.playState.nextLevel();
  }
};
