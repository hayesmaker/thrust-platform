export default class GameLoop {
  constructor(renderer, stage, startState) {
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
    if (this.stopped) {
      return;
    }
    window.requestAnimationFrame(this.loop.bind(this));
    if (this.currentState) {
      this.currentState.update();
    }
    this.renderer.render(this.stage);
  }
}