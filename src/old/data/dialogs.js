//var gameState = require('./game-state');
//var inAppPurchaes = require('./in-app-purchases');

module.exports = {



  /**
   * @todo return dynamic based on demo/full version
   * @returns {*}
   */
  getLevelsCompleteText: function() {
    return this.levelsComplete[0];
  },

  levelsComplete: [
    "You have successfully completed all the Thrust Missions\n" +
    "Thrust missions based on the SPECTRUM version level layouts" +
    "\n\n" +
    "Now try the classic \"endless mode\" and \"speedrun\" from\n the options menu\n" +
    "Follow the Thrust 30 Facebook group for updates \n\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tCREDITS: \n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tMUSIC & SFX: Matt Gray\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tADDITIONAL MUSIC: Martin Keary\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tGRAPHICS: Martin Keary & Andy Hayes\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tPROGRAMMING: ANDY HAYES\n",
  ],

  training: [
    'Flight training stage 1\n' +
    'Use left (<-), right (->) and THRUST (A) to pilot your ship between drones.\n' +
    'Press Fire (B) to begin.',

    'Mastering Thrust requires precise control of your ship despite the gravitational forces acting on it.\n' +
    'Fly to the right to find the drones arranged in diamond formation.  ' +
    'Hover between each set of drones for 4 seconds to activate it.\n' +
    'Press (B) to continue',

    'To complete each mission, you must recover the ORB located on the planet\'s surface' +
    'Attach the ORB by flying near to it without crashing' +
    'When it turns blue, Thrust up high enough from the surface to complete a level\n' +
    'Press (B) to continue.',

    'Flight Training Complete!\n' +
    'Congratulations, you successfully completed flight training.\n' +
    'You\'re now ready to begin real life Thrust missions.\n' +
    'Press (B) to return to the Menu'
  ]
};