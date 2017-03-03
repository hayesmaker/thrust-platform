import * as PIXI from 'pixi.js';

export default class Aliases {
  constructor() {}
  static init() {
    console.log('pixi');
    console.log('pixi');
    console.log('pixi');
    console.log('pixi');
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

    //Vendor Aliases
    global.TweenLite = TweenLite;

//Thrust Aliases
    global.ASSETS = {
      textureAtlasPath: 'assets/atlas/combined.json'
    };
  }
}