'use strict';

/**
 * @module mission-swipe
 * @type {{}}
 */
module.exports = {

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

    var bmd = game.make.bitmapData(1, 1);
    bmd.rect(0,0,1,1, "rgba(255, 0, 0, 0.7)");
    this.swipe = game.add.sprite(x, y, bmd);
    this.swipe.anchor.setTo(0);
    this.swipe.width = 5;
    this.swipe.height = 5;

    this.group.add(this.swipe);
    this.group.fixedToCamera = true;

    style = { font: "24px thrust_regular", fill: "#ffffff", align: "left" };
    this.title = game.add.text(x + 5, y + 5, "Mission 1", style, this.group);
    style = { font: "12px thrust_regular", fill: "#ffffff", align: "left" };
    this.desc = game.add.text(this.title.x, this.title.y + this.title.height + 2, "Recover the orb", style, this.group);

    this.hideSwipe();

    this.tl = new TimelineLite({delay: 1, onComplete: this.missionStartSwipeOut, callbackScope: this, onReverseComplete: this.missionReady});
    this.tl.add(TweenMax.to(this.swipe, 0.2, {alpha: 1, ease: Quad.easeOut} ));
    this.tl.add(TweenMax.to(this.swipe, 0.2, {height: this.fullH, ease: Quad.easeOut} ));
    this.tl.add(TweenMax.to(this.swipe, 0.4, {width: this.fullW, ease: Quad.easeOut} ));
    this.tl.add(TweenMax.to(this.title, 0.25, {alpha: 1, ease: Quad.easeOut} ));
    this.tl.add(TweenMax.to(this.desc, 0.25, {alpha: 1, ease: Quad.easeOut} ));
    this.tl.add(TweenMax.to(this, 1.2));
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
    this.tl.reverse();
  },

  missionReady: function() {
    this.hideSwipe();
    this.callback.call(this.cbContext);
  }






};