import GameLoop from './rendering/game-loop';
import Load from './states/load';
import Play from './states/play';
import p2 from 'p2';

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
    window.addEventListener('resize', function () {
      console.log('resize :: ', renderer, window.innerWidth, window.innerHeight);
      renderer.width = window.innerWidth;
      renderer.height = window.innerHeight;
    });
    let stage = new Container();
    let load = new Load(stage);
    let play = new Play(stage);

    this.states = [load, play];
    this.loop = new GameLoop(renderer, stage, load);
    this.loop.start();
    load.onComplete = this.startPlayState;
    load.onCompleteContext = this;
    console.log('launcher constructor :: p2=', p2);
  }

  startPlayState() {
    console.log('startPlayState', this);
    this.loop.currentState = this.states[1];
  }
};