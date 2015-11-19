/**
 * These groups are registerd to a common camera parent group.
 *
 * This is an attempt to make zooming possible.
 * But currently in phaser, this effects the physics badly, and camera.follow stops
 * working properly, so no zooming is done at runtime yet.
 *
 * calls init
 *
 * @class Groups
 * @constructor
 */
function Groups(cameraGroup) {
  this.cameraGroup = cameraGroup;

  this.init();
}

var p = Groups.prototype;

/**
 * Groups initialisation
 *
 * @method init
 */
p.init = function () {


  this.actors = game.make.group();
  this.enemies = game.make.group();
  this.terrain = game.make.group();
  this.bullets = game.make.group();

  this.cameraGroup.add(this.actors);
  this.cameraGroup.add(this.enemies);
  this.cameraGroup.add(this.terrain);
  this.cameraGroup.add(this.bullets);

};

p.swapTerrain = function () {
  this.cameraGroup.swap(this.terrain, this.actors);
};


module.exports = Groups;