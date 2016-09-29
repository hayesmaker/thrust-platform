/**
 * @class Bullet
 * @constructor
 */
function Bullet(collisionGroup) {
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
  this.outOfBoundsKill = false;
  this.exists = false;
  this.tracking = false;
  this.scaleSpeed = 0;
  this.collisionGroup = collisionGroup;
  console.log('new Bullet :: ', this, this.body);
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
 */
p.fire = function(x, y, angle, speed, lifespan) {
  console.log('fire', this.body, x, y, angle, speed, lifespan);
  this.body.setCollisionGroup(this.collisionGroup);
  this.exists = true;
  this.lifespan = lifespan;
  this.body.data.gravityScale = 0;
  this.body.reset(x, y);
  this.body.velocity.x = speed * Math.cos(angle);
  this.body.velocity.y = speed * Math.sin(angle);
};


module.exports = Bullet;

