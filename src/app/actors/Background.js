'use strict';

var properties = require('../properties');
var _ = require('lodash');

/**
 * Background description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @param levelData {Object}
 * @param groups {Groups}
 * @class Background
 * @constructor
 */
function Background(levelData) {
  this.levelData = levelData;
  this.gradientBg = game.make.tileSprite(0, 0, properties.width, this.levelData.mapPosition.y - 100, 'combined', 'gradient-bg.png');
  this.sprite = game.make.tileSprite(0, 0, properties.width, this.levelData.mapPosition.y, 'combined', 'stars-tile.png');
  this.sprite.fixedToCamera = true;
  this.gradientBg.fixedToCamera = true;

  var numStars = Math.floor(Math.random() * 40);
  var stars = ['star-1.png', 'star-2.png', 'star-3.png', 'star-4.png'];
  _.times(numStars, function() {
    var x = Math.floor(Math.random() * properties.width);
    var y = Math.floor(Math.random() * this.levelData.mapPosition.y);
    var frame = _.sample(stars);
    var star = game.make.sprite(x, y, 'combined', frame);
    this.sprite.addChild(star);
  }.bind(this));
}

var p = Background.prototype;

/**
 * Parallax scrolling the starfield background
 *
 * @method update
 */
p.update = function () {
  this.sprite.tilePosition.set(-game.camera.x * 0.2, -game.camera.y * 0.2);
};


module.exports = Background;