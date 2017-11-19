import Command from './Command';

export default class ThrustCommand extends Command {

  constructor(player) {
    super(player);
  }

  execute() {
    this.player.thrust();
  }

}