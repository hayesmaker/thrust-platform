module.exports = {

  counter: 1,

  blinking: false,

  init: function(group) {
    this.counter = 1;
    this.group = group;
    var x = game.width/2;
    var y = game.height * 0.05;
    var style = { font: "12px thrust_regular", fill: "#ffffff", align: "center" };
    this.text = game.add.text(x, y, "GAME OVER", style, this.group);
    this.text.anchor.setTo(0.5);
    this.text.visible = false;
  },

  blink: function() {
    this.text.visible = true;
    this.blinking = true;
  },

  stop: function() {
    this.text.visible = false;
    this.blinking = false;
  },

  update: function() {
    if (this.blinking) {
      if (this.counter++ % 80 === 0) {
        this.text.visible = !this.text.visible;
      }
    }
  }

};