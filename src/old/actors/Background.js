'use strict';

var properties = require('../properties');
var _ = require('lodash');
var options = require('../options-model');

/**
 * Background description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class Background
 * @constructor
 * @param levelData {Object}
 * @param groups {Groups}
 */
function Background(levelData, groups) {
  this.groups = groups;
  this.levelData = levelData;
  this.gradientBg = game.make.tileSprite(0, 0, properties.width, 490, 'combined', 'gradient-bg.png');
  var requiredHeight = this.levelData.mapPosition.y;
  //this.gradientBg.scale.set(1, requiredHeight / 740);

  if (options.display.fx.background) {
    this.sprite = game.make.tileSprite(0, 0, properties.width, requiredHeight, 'combined', 'stars-tile.png');
    this.sprite.fixedToCamera = true;
    this.gradientBg.fixedToCamera = true;

    var numStars = Math.floor(Math.random() * 40);
    var stars = ['star-1.png', 'star-2.png', 'star-3.png', 'star-4.png'];
    _.times(numStars, function() {
      var x = Math.floor(Math.random() * properties.width);
      var y = Math.floor(Math.random() * requiredHeight);
      var frame = _.sample(stars);
      var star = game.make.sprite(x, y, 'combined', frame);
      this.sprite.addChild(star);
    }.bind(this));
    this.groups.background.add(this.gradientBg);
    this.enable();
  }

}

var p = Background.prototype;

p.enabled = false;

/**
 * Parallax scrolling the starfield background
 *
 * @method update
 */
p.update = function () {
  this.sprite.tilePosition.set(-game.camera.x * 0.2, -game.camera.y * 0.2);
  //this.gradientBg.tilePosition.set(-game.camera.x * 0.2, -game.camera.y * 0.2);
};

p.enable = function() {
  this.enabled = true;
  this.groups.background.add(this.sprite);
};

p.disable = function() {
  this.enabled = false;
  //this.groups.background.remove(this.gradientBg);
  this.groups.background.remove(this.sprite);
};




module.exports = Background;