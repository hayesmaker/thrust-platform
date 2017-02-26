import * as PIXI from 'pixi.js';
import Launcher from "./pixi/launcher";

//Pixi Aliases
global.DisplayObject = PIXI.DisplayObject;
global.Container = PIXI.Container;
global.Sprite = PIXI.Sprite;
global.Graphics = PIXI.Graphics;
global.TextureCache = PIXI.utils.TextureCache;
global.loader = PIXI.loader;
global.resources = PIXI.loader.resources;
global.autoDetectRenderer = PIXI.autoDetectRenderer;
global.Point = PIXI.Point;
global.Rectangle = PIXI.Rectangle;

//Thrust Aliases
global.ASSETS = {
  textureAtlasPath: 'assets/atlas/combined.json'
};

export function main() {
  new Launcher();
}

main();