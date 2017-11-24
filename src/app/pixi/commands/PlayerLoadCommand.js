import Command from './Command';

export default class PlayerLoadCommand extends Command {

  constructor(player) {
    super(player);
  }

  execute() {
    this.player.loadGun();
  }

}