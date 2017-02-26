import GameLoop from './rendering/game-loop';
import Load from './states/load';
import Play from './states/play';
import FPSHelper from './utils/fps-stats';

export default class PixiLauncher {
  constructor() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let colour = 0x000000;
    let renderer = autoDetectRenderer(
      width, height,
      {
        backgroundColor : colour
      },
      true
    );
    window.document.body.appendChild(renderer.view);
    let stage = new Container();

    window.addEventListener('resize', function () {
      console.log('resize :: ', renderer, window.innerWidth, window.innerHeight);
      //renderer.width = window.innerWidth;
      //renderer.height = window.innerHeight;
    });

    new FPSHelper();

    this.load = new Load(stage);
    this.play = new Play(stage, renderer, this.camera);

    this.loop = new GameLoop(renderer, stage, this.load);
    this.loop.start();
    this.load.onComplete = this.startPlayState;
    this.load.onCompleteContext = this;
  }

  startPlayState() {
    console.log('startPlayState', this);
    this.loop.currentState = this.play;
  }
};