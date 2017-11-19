import Command from './Command';

export default class RotateLeftCommand extends Command {

  constructor(player) {
    super(player);
  }

  execute() {
    this.player.rotateLeft();
  }

}