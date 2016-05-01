var UIComponent = require('./ui-component');
var _ = require('lodash');
var gameState = require('../data/game-state');
var TweenMax = global.TweenMax;
var TimelineLite = global.TimelineLite;
var Quad = global.Quad;

var p = UIInterstial.prototype = Object.create(UIComponent.prototype, {
  constructor: UIInterstial
});

module.exports = UIInterstial;

/**
 *
 * @param group
 * @param name
 * @param playState
 * @constructor
 */
function UIInterstial(group, name, playState) {
  UIComponent.call(this, group, name);
  this.playState = playState;
}

/**
 * @property onExitComplete
 * @type {Phaser.Signal}
 */
p.onExitComplete = new Phaser.Signal();

/**
 *
 * @type {boolean}
 */
p.preventAutoEnable = true;

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
    valueId: "orb_recovered",
    yPos: 0.4,
    style: { font: "14px thrust_regular", fill: "#ffffff", align: "left" }
  },
  {
    successLabel: "Planet Destroyed",
    failLabel: "",
    valueId: "planet_buster",
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

p.render = function() {
  UIComponent.prototype.render.call(this);
  var x = game.width/2;
  _.each(this.fields, function(field) {
    field.tf = game.add.text(x, game.height * field.yPos, field.successLabel, field.style, this.group);
    field.tf.alpha = 0;
    if (field.center) {
      field.tf.anchor.setTo(0.5, 0);
    } else {
      field.tf.x = field.tf.x - 200;
    }
    if (field.valueId) {
      field.valueTf = game.add.text(x + 150, game.height * field.yPos, "1000", field.style, this.group);
      field.valueTf.alpha = 0;
    }
  }.bind(this));
  this.levelExit();
};

p.enable = function() {
  game.controls.spacePress.onDown.add(this.spacePressed, this);
  if (game.controls.stick) {
    game.controls.buttonB.onDown.add(this.spacePressed, this);
  }
};

p.disable = function() {
  game.controls.spacePress.onDown.remove(this.spacePressed, this);
  if (game.controls.stick) {
    game.controls.buttonB.onDown.remove(this.spacePressed, this);
  }
};

/**
 * @method spacePressed
 */
p.spacePressed = function () {
  console.log('ui-interstitial :: space pressed');
  //this.playState.showCurrentScreenByState.call(this.playState, gameState.PLAY_STATES.MENU);
  this.disable();
  this.levelEnter();
};


p.initLayout = function() {
  if (game.width > 1000) {
    this.titleStyle = {font: "16px thrust_regular", fill: "#ffffff", align: "left" };
    this.style = { font: "14px thrust_regular", fill: "#ffffff", align: "left" };
    this.styleBlue = { font: "14px thrust_regular", fill: "#00ffff", align: "left" };
    this.styleGreen = { font: "14px thrust_regular", fill: "#00ff00", align: "left" };
  } else {
    this.titleStyle = {font: "14px thrust_regular", fill: "#ffffff", align: "left" };
    this.style = { font: "12px thrust_regular", fill: "#ffffff", align: "left" };
    this.styleBlue = { font: "12px thrust_regular", fill: "#00ffff", align: "left" };
    this.styleGreen = { font: "12px thrust_regular", fill: "#00ff00", align: "left" };
  }
};

p.levelExit = function() {
   this.tl = new TimelineLite({delay: 0.5, onComplete: this.timelineComplete, callbackScope: this});
   _.each(this.fields, function(field) {
     this.tl.add(TweenLite.to(field.tf, 0.2, {alpha: 1, ease:Quad.easeIn}));
   }.bind(this));
    this.tl.add(TweenLite.to(this, 1.2));
   _.each(this.fields, function(field) {
     if (field.valueTf) {
       this.tl.add(TweenLite.to(field.valueTf, 0.2, {alpha: 1, ease:Quad.easeIn}));
     }
   }.bind(this));
};

p.levelEnter = function() {
  this.tl = new TimelineLite({delay: 0, onComplete: this.levelExitComplete, callbackScope: this});
  _.each(this.fields, function(field) {
    this.tl.add(TweenLite.to(field.tf, 0.2, {y: -100, ease:Quad.easeIn}));
    if (field.valueTf) {
      this.tl.add(TweenLite.to(field.valueTf, 0.2, {x: game.width + 100, ease:Quad.easeIn}));
    }
  }.bind(this));
  this.onExitComplete.dispatch();
};

p.timelineComplete = function() {
  this.enable();
};

p.levelExitComplete = function() {
  this.playState.nextLevel();
};

p.clear = function() {
  this.group.visible = false;
  this.text0.text = "";
  this.text1.text = "";
  this.text2.text = "";
  this.text3.text = "";
};