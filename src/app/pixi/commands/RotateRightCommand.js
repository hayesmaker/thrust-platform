import Command from './Command';

export default class RotateRightCommand extends Command {

  constructor(player) {
    super(player);
  }

  execute() {
    this.player.rotateRight();
  }

}