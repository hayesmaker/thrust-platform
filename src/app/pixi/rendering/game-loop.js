import FPSStats from '../utils/fps-stats';

export default class GameLoop {
  constructor(renderer, stage, startState) {
    this.meter = new FPSStats();
    this.renderer = renderer;
    this.stage = stage;
    this.currentState = startState;
    this.isStopped = false;
  }
  start () {
    this.isStopped = false;
    this.loop();
  }
  stop () {
    this.isStopped = true;
  }
  loop () {
    this.meter && this.meter.tickStart();
    if (this.stopped) {
      return;
    }
    window.requestAnimationFrame(this.loop.bind(this));
    this.currentState.meter && this.currentState.meter.tickStart();
    if (this.currentState) {
      this.currentState.update();
    }
    this.renderer.render(this.stage);
    this.meter && this.meter.tickEnd();
  }
}