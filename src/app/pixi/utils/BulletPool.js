import PlayerBullet from '../actors/PlayerBullet';
import Pool from './Pool';

export default class BulletPool extends Pool {

  constructor(world) {
    super({size: 100, world: world});
  }

  create(world) {
    return new PlayerBullet(world);
  }

  destroy(bullet) {
    bullet.destroy();
    return this;
  }
};
