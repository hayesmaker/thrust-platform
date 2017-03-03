import PixiLauncher from './pixi/launcher';
import Aliases from './pixi/aliases';

export function main() {
  Aliases.init();
  new PixiLauncher();
}

main();