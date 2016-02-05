/**
 * These groups were registerd to a common camera parent group.
 *
 * This was an attempt to make zooming possible.
 * But currently in phaser, this effects the physics badly, and camera.follow stops
 * working properly, so no zooming is done at runtime yet.
 *
 * calls init
 *
 * @class Groups
 * @constructor
 */
function Groups() {
  this.init();
}

var p = Groups.prototype;

/**
 * Groups initialisation
 *
 * @method init
 */
p.init = function () {
  this.background = game.add.group();

  this.actors = game.add.group();
  this.fuels = game.add.group();
  this.enemies = game.add.group();
  this.terrain = game.add.group();
  this.bullets = game.add.group();


  /*
  this.cameraGroup.add(this.background);
  this.cameraGroup.add(this.actors);
  this.cameraGroup.add(this.enemies);
  this.cameraGroup.add(this.terrain);
  this.cameraGroup.add(this.bullets);
  */
};

p.swapTerrain = function () {
  game.world.swap(this.terrain, this.actors);
};


module.exports = Groups;