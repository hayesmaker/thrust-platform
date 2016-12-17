'use strict';

var levelManager = require('../data/level-manager');
var sound = require('../utils/sound');
var TimelineMax = global.TimelineMax;

/**
 * The swipe mission title info on level start
 *
 * @class mission-swipe
 * @type {{}}
 * @static
 */
module.exports = {

  isReversed: false,
  /**
   * @property swipe
   * @type {Phaser.Sprite}
   */
  swipe: null,

  /**
   * @property swipeTl
   * @type {TimelineLite}
   */
  swipeTl: null,

  /**
   * @property group
   * @type {Phaser.Group}
   */
  group: null,

  fullW: 0,

  fullH: 0,

  callback: function() {},

  cbContext: null,

  /**
   * @method init
   */
  init: function(x, y, fullWidth, fullHeight, group) {
    var style;
    this.fullW = fullWidth;
    this.fullH = fullHeight;
    this.group = group;
    var level = levelManager.currentLevel;
    var bmd = game.make.bitmapData(1, 1);
    bmd.rect(0,0,1,1, level.missionSwipe.color);
    this.swipe = game.add.sprite(x, y, bmd);
    this.swipe.anchor.setTo(0);
    this.swipe.width = 5;
    this.swipe.height = 5;
    this.group.add(this.swipe);
    this.group.fixedToCamera = true;
    this.isReversed = false;

    /**
     "title": "Mission %n",
     "desc": "Recover the orb %s %s",
     "color": "rgba(255, 0, 0, 0.7)"
     *
     * @type {{font: string, fill: string, align: string}}
     */

    //_.bind(this.swipeSound, this);

    console.log('levelIndex=', levelManager.levelIndex);
    console.log('levels.length=', levelManager.levels.length);
    console.log('levels.endlessModeIndex=', levelManager.endlessModeIndex);
    console.log('levels.endlessCycle=', levelManager.endlessCycle);
    var levelNo = levelManager.levelIndex + 1 +
      levelManager.levels.length * levelManager.endlessModeIndex +
      levelManager.endless.length * levelManager.endlessCycle;
    console.log('levels.levelNo = ', levelNo);
    var title = level.missionSwipe.title.replace('%n', levelNo.toString());
    var repl1 = levelManager.endlessData.flip? "\nReverse Gravity" : "";
    var repl2 = levelManager.endlessData.blink? "\nBlink Map" : "";
    var desc;
    desc = level.missionSwipe.desc.replace('%s1', repl1);
    desc = desc.replace('%s2', repl2);
    style = { font: "24px thrust_regular", fill: "#ffffff", align: "left" };
    this.title = game.add.text(x + 5, y + 5, title, style, this.group);
    style = { font: "12px thrust_regular", fill: "#ffffff", align: "left" };
    this.desc = game.add.text(this.title.x, this.title.y + this.title.height + 2, desc, style, this.group);
    this.fullH = this.desc.y + this.desc.height;
    this.hideSwipe();
    this.tl = new TimelineMax({delay: 0.2, onComplete: this.missionStartSwipeOut, callbackScope: this, onReverseComplete: this.missionReady});
    this.tl.add(TweenMax.to(this.swipe, 0.2, {alpha: 1, ease: Quad.easeOut} ));
    this.tl.add(TweenMax.to(this.swipe, 0.2, {height: this.fullH, ease: Quad.easeOut} ));
    this.tl.add(function() {
      if (this.isReversed) {
        sound.playSound(sound.UI_SWIPE_OUT);
      } else {
        sound.playSound(sound.UI_SWIPE_IN);
      }
    }.bind(this));
    this.tl.add(TweenMax.to(this.swipe, 0.4, {width: this.fullW, ease: Quad.easeOut} ));
    this.tl.add(TweenMax.to(this.title, 0.25, {alpha: 1, ease: Quad.easeOut} ));
    this.tl.add(TweenMax.to(this.desc, 0.25, {alpha: 1, ease: Quad.easeOut} ));
    this.tl.add(TweenMax.to(this, 1));
    this.tl.pause();
  },

  hideSwipe: function() {
    this.title.alpha = 0;
    this.title.visible = false;
    this.desc.alpha = 0;
    this.desc.visibe = false;
    this.swipe.visible = false;
    this.swipe.alpha = 0;
  },

  showSwipe: function() {
    this.title.visible = true;
    this.desc.visibe = true;
    this.swipe.visible = true;
  },


  missionStartSwipeIn: function(callback, context) {
    this.callback = callback;
    this.cbContext = context;
    this.showSwipe();
    this.tl.play();
  },

  missionStartSwipeOut: function() {
    this.isReversed = true;
    this.tl.reverse();
  },

  missionReady: function() {
    this.hideSwipe();
    this.callback.call(this.cbContext);
  }






};