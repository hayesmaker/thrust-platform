

module.exports = {
  
  init: function(group) {
    this.group = game.add.group(group);
    var bmd = game.make.bitmapData(1, 1);
    bmd.rect(0,0,1,1, 'rgba(0, 0, 0, 1)');
    this.fader = game.add.sprite(0, 0, bmd);
    this.fader.anchor.setTo(0);
    this.fader.width = game.width;
    this.fader.height = game.height;
    this.group.add(this.fader);
    this.group.fixedToCamera = false;
    this.group.visible = false;
    this.fader.alpha = 0;
  },

  tweenIn: function() {
    this.group.visible = true;
    TweenLite.to(this.fader, 0.3, {alpha: 0.7, ease: Quad.easeIn});
  },

  tweenOut: function() {
    TweenLite.to(this.fader, 0.3, {alpha: 0, ease: Quad.easeOut, onComplete: function() {
      this.group.visible = false;
    }.bind(this)});
  }




};