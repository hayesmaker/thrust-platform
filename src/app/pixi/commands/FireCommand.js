import Command from './Command';

export default class FireCommand extends Command {

  constructor(player) {
    super(player);
  }

  execute() {
    this.player.fire();
  }

}