import GameLoop from './rendering/game-loop';
import Load from './states/load';

export default class PixiLauncher {
  constructor() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let colour = 0xff0000;
    let renderer = autoDetectRenderer(
      width, height,
      {
        backgroundColor : colour
      },
      true
    );
    window.document.body.appendChild(renderer.view);
    let stage = new Container();
    let load = new Load(stage);
    let loop = new GameLoop(renderer, stage, load);
    loop.start();
  }
};