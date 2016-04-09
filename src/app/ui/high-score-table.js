var gameState = require('../data/game-state');
var _ = require('lodash');


module.exports = {
  items: [],

  padding: 30,

  maxY: 0,

  style: { font: "14px thrust_regular", fill: "#ffffff", align: "left" },

  selectedIndex: 0,

  itemSelected: null,

  init: function(group) {
    this.items = [];
    this.group = game.add.group(group);
    this.initSignals();
    this.createDisplay();
  },

  initSignals: function() {

  },

  createDisplay: function() {
    this.createTitle();
    _.each(gameState.highScoreTable, _.bind(this.addHighScore, this));
    this.gameOverSubTitle();
  },

  createTitle: function() {
    var title = game.add.text(game.width/2, this.padding, "HIGH SCORES", {
      font: "20px thrust_regular",
      fill: "#ffffff",
      align: "left"
    }, this.group);
    title.anchor.setTo(0.5);
    var y = this.padding + 15;
    var line = game.add.graphics(game.width/2, y, this.group);
    line.lineStyle(4, 0xffffff, 1);
    line.moveTo(-200, 0);
    line.lineTo(200, 0);
  },
  
  addHighScore: function(highscore, index) {
    var y = this.padding + 40 + 23 * index;
    var numberTf = game.add.text(game.width/2 - 200, y, index + 1, this.style, this.group);
    var nameTf = game.add.text(game.width/2 - 140, y, highscore.name, this.style, this.group);
    var scoreTf = game.add.text(game.width/2 + 130, y, highscore.score, this.style, this.group);
    this.items.push({
      number: numberTf,
      name: nameTf,
      score: scoreTf
    });
    this.maxY = y;
  },

  defaultSubTitle: function() {
    var subTitle = game.add.text(game.width/2, this.maxY + this.padding * 3, "PRESS FIRE", {
      font: "16px thrust_regular",
      fill: "#ffffff",
      align: "left"
    }, this.group);
    subTitle.anchor.setTo(0.5);
  },

  newHighScoreSubTitle: function() {
    var style = {
      font: "16px thrust_regular",
      fill: "#ffffff",
      align: "left"
    };
    var subTitle = game.add.text(game.width/2, this.maxY + this.padding * 3, "CONGRATULATIONS, YOU RANK 4TH", style , this.group);
    subTitle.anchor.setTo(0.5);
    var subTitle2 = game.add.text(game.width/2, subTitle.y + subTitle.height + 10, "ENTER YOUR NAME PILOT", style, this.group);
    subTitle2.anchor.setTo(0.5);
  },

  gameOverSubTitle: function() {
    var style = {
      font: "16px thrust_regular",
      fill: "#ffffff",
      align: "left"
    };
    var subTitle = game.add.text(game.width/2, this.maxY + this.padding * 3, "GAME OVER", style , this.group);
    subTitle.anchor.setTo(0.5);
    var subTitle2 = game.add.text(game.width/2, subTitle.y + subTitle.height + 10, "YOUR SCORE WAS _SCORE_", style, this.group);
    subTitle2.anchor.setTo(0.5);
    var subTitle3 = game.add.text(game.width/2, subTitle2.y + subTitle.height + 10, "YOU REACHED LEVEL _LEVEL_", style, this.group);
    subTitle3.anchor.setTo(0.5);
  }



};