/**
 * @class Bullet
 * @constructor
 * @param collisions
 */
function Bullet(collisions, isPlayer) {
  var bulletBitmap;
  if (isPlayer) {
   bulletBitmap = this.drawPlayerBullet();
  } else {
   bulletBitmap = this.drawEnemyBullet();
  }
  Phaser.Sprite.call(this, game, 0, 0, bulletBitmap);
  this.collisions = collisions;
  this.anchor.set(0.5);
  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
  this.exists = false;
}

var p = Bullet.prototype = Object.create(Phaser.Sprite.prototype, {
  constructor: Bullet
});

p.drawPlayerBullet = function() {
  var bulletBitmap = game.make.bitmapData(15, 2);
  bulletBitmap.ctx.beginPath();
  bulletBitmap.ctx.strokeStyle = '#4affff';
  bulletBitmap.ctx.lineWidth = 2;
  bulletBitmap.ctx.moveTo(1, 1);
  bulletBitmap.ctx.lineTo(15, 1);
  bulletBitmap.ctx.stroke();
  return bulletBitmap;
};

p.drawEnemyBullet = function() {
  var bulletBitmap = game.make.bitmapData(4, 4);
  bulletBitmap.ctx.fillStyle = '#ff93ff';
  bulletBitmap.ctx.beginPath();
  bulletBitmap.ctx.lineWidth = 1;
  bulletBitmap.ctx.arc(0, 0, 4, 0, Math.PI * 2, true);
  bulletBitmap.ctx.closePath();
  bulletBitmap.ctx.fill();
  return bulletBitmap;
};

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
  this.body.reset(x, y);
  this.body.velocity.x = speed * Math.cos(angle);
  this.body.velocity.y = speed * Math.sin(angle);
  this.body.collideWorldBounds = false;
  this.body.setCollisionGroup(collisionGroup);
  this.body.collides([this.collisions.terrain, this.collisions.enemies, this.collisions.fuels, this.collisions.players, this.collisions.orb], this.remove, this);
  this.exists = true;
  this.lifespan = lifespan;
  this.body.rotation = angle;
  this.body.data.gravityScale = 0;
};

/**
 * @method remove
 */
p.remove = function() {
  this.exists = false;
  this.kill();
};


module.exports = Bullet;

