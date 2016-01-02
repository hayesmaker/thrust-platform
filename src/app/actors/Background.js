'use strict';

/**
 * Background description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class Background
 * @constructor
 */
function Background(x, y) {
  this.sprite = game.make.tileSprite(x, y, 700, 500, 'stars');
  this.sprite.fixedToCamera = true;
  this.init();
}

var p = Background.prototype;

/**
 * Background initialisation
 *
 * @method init
 */
p.init = function () {
  this.stars = this.sprite;
};

/**
 * Parallax scrolling the starfield background
 *
 * @method update
 */
p.update = function () {
  this.sprite.tilePosition.set(-game.camera.x * 0.1, -game.camera.y * 0.1);
};


module.exports = Background;