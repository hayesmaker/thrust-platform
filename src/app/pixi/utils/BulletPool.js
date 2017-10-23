import PlayerBullet from '../actors/PlayerBullet';
import Pool from './Pool';

export default class BulletPool extends Pool {

  constructor() {
    super({size: 100});
  }

  create() {
    return new PlayerBullet();
  }

  destroy(bullet) {
    bullet.destroy();
    return this;
  }
};
