/**
 * @class Bullet
 * @constructor
 * @param collisions
 */
function Bullet(collisions) {
  var bulletBitmap = game.make.bitmapData(5, 5);
  bulletBitmap.ctx.fillStyle = '#ffffff';
  bulletBitmap.ctx.beginPath();
  bulletBitmap.ctx.lineWidth = 0.5;
  bulletBitmap.ctx.arc(0, 0, 5, 0, Math.PI * 2, true);
  bulletBitmap.ctx.closePath();
  bulletBitmap.ctx.fill();
  Phaser.Sprite.call(this, game, 0, 0, bulletBitmap);
  this.anchor.set(0.5);
  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
  this.exists = false;
  this.collisions = collisions;
}

var p = Bullet.prototype = Object.create(Phaser.Sprite.prototype, {
  constructor: Bullet
});

/**
 * @method fire
 * @param x
 * @param y
 * @param angle
 * @param speed
 * @param lifespan
 * @param [isPlayer] {boolean} - true if this is fired from player (false or leave blank if enemy fired)
 */
p.fire = function(x, y, angle, speed, lifespan, isPlayer) {
  //this.body.debug = true;
  var collisionGroup = isPlayer? this.collisions.bullets : this.collisions.enemyBullets;
  this.body.setCollisionGroup(collisionGroup);
  this.body.collides([this.collisions.terrain, this.collisions.enemies, this.collisions.fuels, this.collisions.players, this.collisions.orb], this.remove, this);
  this.exists = true;
  this.lifespan = lifespan;
  this.body.data.gravityScale = 0;
  this.body.reset(x, y);
  this.body.velocity.x = speed * Math.cos(angle);
  this.body.velocity.y = speed * Math.sin(angle);
};

/**
 * @method remove
 */
p.remove = function() {
  this.kill();
  this.exists = false;
};


module.exports = Bullet;

