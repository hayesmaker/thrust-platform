import Container from './mocks/Container';
import Graphics from './mocks/Graphics';
import Sprite from './mocks/Sprite';

global.DisplayObject = {};
global.Container = Container;
global.Sprite = Sprite;
global.Graphics = Graphics;
global.TextureCache = {};
global.loader = {};
global.resources = {};
global.autoDetectRenderer = {};
global.Point = {};
global.Rectangle = function(x, y, width, height) {
  return {x,y,width,height};
};

import cameraSpec from './rendering/camera-spec';
import tiledLevelMapSpec from './levels/tiled-level-map-spec';
import playerSpec from './actors/player-spec';

