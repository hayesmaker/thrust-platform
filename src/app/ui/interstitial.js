module.exports = {

  init: function(group) {
    this.group = game.add.group(group);
    this.group.visible = false;
    var style = { font: "12px thrust_regular", fill: "#ffffff", align: "left" };
    this.text1 = game.add.text(game.width/2, game.height/2, "", style, this.group);
    this.text0 = game.add.text(this.text1.x, this.text1.y - 35, "", style, this.group);
    this.text2 = game.add.text(this.text1.x, this.text1.y + 35, "", style, this.group);
    this.text0.anchor.setTo(0.5);
    this.text1.anchor.setTo(0.5);
    this.text2.anchor.setTo(0.5);
  },

  levelComplete: function() {
    this.group.visible = true;
    this.text0.text = "Level Complete";
    this.text1.text = "Prepare for Next Level";
    this.text2.text = "Get Ready";
  },

  clear: function() {
    this.group.visible = false;
    this.text0.text = "";
    this.text1.text = "";
    this.text2.text = "";
  }








};