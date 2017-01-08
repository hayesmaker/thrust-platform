import * as PIXI from 'pixi.js';
import Launcher from "./pixi/launcher";

global.Container = PIXI.Container;
global.Sprite = PIXI.Sprite;

export function main() {
  new Launcher();
}

main();

