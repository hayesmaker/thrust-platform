'use strict';

var properties = require('../properties');

/**
 * Background description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @param x {Number}
 * @param y {Number}
 * @param [key] {String}
 * @class Background
 * @constructor
 */
function Background(x, y, key) {
  this.sprite = game.make.tileSprite(x, y, properties.width, properties.height, key || 'stars');
  this.sprite.fixedToCamera = true;
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