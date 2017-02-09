import * as PIXI from 'pixi.js';
import Launcher from "./pixi/launcher";

//Pixi Aliases
global.Container = PIXI.Container;
global.Sprite = PIXI.Sprite;
global.TextureCache = PIXI.utils.TextureCache;
global.loader = PIXI.loader;
global.resources = PIXI.loader.resources;
global.autoDetectRenderer = PIXI.autoDetectRenderer;

//Thrust Aliases
global.textureAtlasPath = 'assets/atlas/combined.json';

export function main() {
  new Launcher();
}

main();