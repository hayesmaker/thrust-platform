'use strict';

// var sound = require('../utils/sound');
var TimelineLite = global.TimelineLite;
var TweenLite = global.TweenLite;
var Elastic = global.Elastic;
var canvas = require('../utils/canvas');

module.exports = {

  notificationSpr: null,
  noticesCollection: [],
  messageQueue: [],

  init: function(group) {

    this.notificationSpr = game.make.sprite(0, 0);
    this.noticesCollection = [];
    group.add(this.notificationSpr);
    this.createNotice(group, 0);
    this.createNotice(group, 1);
    this.createNotice(group, 2);
    this.createNotice(group, 3);
    this.createNotice(group, 4);
    game.externalJoypad.connected.add(this.addMessage, this);
  },

  createNotice: function(group, index) {
    var w = 200;
    var h = 100;
    console.log("ui-notice :: init", group);

    var bgSpr = game.make.sprite(0, 0);
    this.notificationSpr.addChild(bgSpr);

    var bmd = game.make.bitmapData(w, h);
    bmd.ctx.translate(0.5, 0.5);
    bmd.ctx.beginPath();
    bmd.ctx.strokeStyle =  '#ffffff';
    bmd.ctx.lineWidth = 2;
    bmd.ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
    canvas.drawRoundRect(bmd.ctx, 2, 2, w - 4, h-4, 2, true, true );

    var spr1 = game.make.sprite(0,0,bmd);
    bgSpr.addChild(spr1);

    h = h * 0.3;
    var bmd2 = game.make.bitmapData(w, h);
    bmd2.ctx.translate(0.5, 0.5);
    bmd2.ctx.beginPath();
    bmd2.ctx.strokeStyle =  '#ffffff';
    bmd2.ctx.lineWidth = 2;
    bmd2.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    canvas.drawRoundRect(bmd2.ctx, 2, 2, w - 4, h-4, 0, true, false, [2,2,0,0]);

    var style = {font: "14px Arial", fontWeight: 'bold', fill: "#123e03", align: 'left'};
    var title = game.make.text(0,0, 'CONNECTED', style);
    title.anchor.setTo(0, 0);
    title.position.x = w/2 - title.width/2;
    title.position.y = h/2 - title.height/2;

    var style2 = {font: "12px Arial", fontWeight: 'bold', fill: "#123e03", align: 'left'};
    var content = game.make.text(0,0, 'GAMEPAD X469\nUSE OPTIONS TO CHANGE', style2);
    content.anchor.setTo(0, 0);
    content.position.x = 10;
    content.position.y = h + 10;

    var spr2 = game.make.sprite(0,0,bmd2);
    bgSpr.addChild(spr2);
    bgSpr.addChild(title);
    bgSpr.addChild(content);
    bgSpr.position.x = game.width - spr1.width - 20;
    var posY = game.height - ((index + 1) * (spr1.height + 10));
    bgSpr.position.y = game.height;
    var tl = new TimelineLite({paused: true});
    tl.add(new TweenLite(bgSpr.position, 1, {y: posY, ease: Elastic.easeOut}));
    this.noticesCollection.push({
      tl: tl,
      sprite: bgSpr,
      index: index,
      textContent: content,
    });
  },

  addMessage: function(gamepad) {
    console.log("addMessage", gamepad);
    var id = gamepad.index + 1;
    var notice = this.noticesCollection[0];
    this.messageQueue.push(notice);
    notice.textContent.text = "GAMEPAD " + id + " CONNECTED";
    notice.tl.play();
    setTimeout(function() {
      notice.tl.reverse();
    }.bind(this), 4000);
  }

};