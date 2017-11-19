import Command from './Command';

export default class RotateResetCommand extends Command {

  constructor(player) {
    super(player);
  }

  execute() {
    this.player.resetAngularForces();
  }

}