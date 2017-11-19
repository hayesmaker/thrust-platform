import RotateLeftCommand from './RotateLeftCommand';
import PlayerFireCommand from './FireCommand';
import RotateRightCommand from './RotateRightCommand';
import ThrustCommand from './ThrustCommand';
import MenuUpCommand from './MenuUpComand';
import MenuLeftCommand from './MenuLeftComand';
import MenuRightCommand from './MenuRightComand';
import MenuDownCommand from './MenuDownComand';
import MenuSelectCommand from './MenuSelectCommand';
import RotateResetCommand from './RotateResetCommand';

/**
 * Command driven InputHandler
 *
 * @class InputHandler
 */
export default class InputHandler {

  /**
   * @constructor
   * @param state
   * @param player
   */
  constructor(state, player) {
    this.state = state;
    this.player = player;
    this.nullCommand = {execute: function(){}};
    this.keyLeft = false;
    this.keyRight = false;
    this.keyUp = false;
    this.keyDown = false;
    this.keySpace = false;
    this.inPlayCommands();
  }

  /**
   * @method inPlayCommands
   */
  inPlayCommands() {
    this.buttonX = new PlayerFireCommand(this.player);
    this.buttonY = new ThrustCommand(this.player);
    this.buttonA = new PlayerFireCommand(this.player);
    this.buttonB = new ThrustCommand(this.player);
    this.padRight = new RotateRightCommand(this.player);
    this.padLeft = new RotateLeftCommand(this.player);
    this.padUp = this.nullCommand;
    this.padDown = this.nullCommand;
    this.reset = new RotateResetCommand(this.player);
  }

  /**
   * @method handleInput
   */
  handleInput () {
    this.handleKeyInput();
  }

  /**
   * @method handleKeyInput
   */
  handleKeyInput() {
    if (this.keyUp) {
      this.buttonB.execute();
    }
    if (this.keySpace) {
      this.buttonA.execute();
    }
    if (this.keyLeft) {
      this.padLeft.execute();
    }
    if (this.keyRight) {
      this.padRight.execute();
    }
    if (!this.keyLeft && !this.keyRight) {
      this.reset.execute();
      //this.player.resetAngularForces();
    }
  }

  /**
   * @method initKeyboardControls
   */
  initKeyboardControl() {
    window.onkeydown = (evt) => {
      this.handleKey(evt.keyCode, true);
    };
    window.onkeyup = (evt) => {
      this.handleKey(evt.keyCode, false);
    };
    window.onkeypress = (evt) => {
      this.handleKeyPress(evt.keyCode);
    };
  }

  /**
   * @method handleKeyPress
   * @param code
   */
  handleKeyPress(code) {
    switch (code) {
      case 27:
      case 167:
          this.state.isPaused = !this.state.isPaused;
        break;
    }
  }

  /**
   * @mehood handleKey
   * @param code
   * @param isDown
   */
  handleKey(code, isDown) {
    switch (code) {
      case 32:
        this.keySpace = isDown;
        if (!isDown) {
          this.player.loadGun();
        }
        break;
      case 37:
        this.keyLeft = isDown;
        break;
      case 38:
        this.keyUp = isDown;
        break;
      case 39:
        this.keyRight = isDown;
        break;
      case 40:
        this.keyDown = isDown;
        break;
    }
  }

}