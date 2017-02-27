import Launcher from "./pixi/launcher";
import Aliases from "./pixi/aliases";

export function main() {
  Aliases.init();
  new Launcher();
}

main();