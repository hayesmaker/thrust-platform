var _ = require('lodash');

module.exports = Camera;

function Camera () {
  Phaser.Group.call(this, game);
  this.bounds = Phaser.Rectangle.clone(game.world.bounds);
}

var p = Camera.prototype = _.create(Phaser.Group.prototype, {
  constructor: Camera
});

p.zoomTo = function(scale) {
  var bounds = this.bounds;
  var cameraBounds = game.camera.bounds;
  cameraBounds.x = bounds.width * (1 - scale) / 2;
  cameraBounds.y = bounds.height * (1 - scale) / 2;
  cameraBounds.width = bounds.width * scale;
  cameraBounds.height = bounds.height * scale;
  this.scale.setTo(scale);
  console.log('Camera ZoomTo: scale=', scale, this.pivot);
  //this.pivot.x = 150;
};