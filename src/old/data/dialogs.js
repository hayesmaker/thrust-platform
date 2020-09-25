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

  getRulesText: function(index) {
    return ["Objective:\n\n" +
      "We have captured several battle grade starships\n" +
      "which we need for a major offensive against the\n" +
      "INTERGALACTIC EMPIRE\n" +
      "However. We lack the Klystron Pods to power them\n\n" +
      "Your goal is to steal several of the Empire's \n" +
      "Klystron pods from various storage planets\n" +
      "So we may turn their own weapons against them\n" +
      "In the coming offensive\n",

      "The Game:\n\n" +
      "Destroy enemy turrets to avoid taking fire\n\n" +
      "Hover above fuel tanks to refuel your ship\n\n" +
        "Hover above the Klystron Pod to activate tractor beam to capture\n\n" +
        "Once captured your tractor beam will turn from purple to blue.\n\n" +
        "Thrust into space with the pod attached to warp to the next system"
    ][index];
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

    'Mastering Thrust requires precise control of your ship\n' +
    'Fly to the right to find the drones arranged in diamond formation.\n' +
    'Hover between each set of drones for 2 seconds to activate it.\n' +
    'Press (B) to continue',

    'To complete each mission, you must recover the ORB\n' +
    'Attach the ORB by flying near to it without crashing\n' +
    'When it turns blue, Thrust up high enough from the surface to complete a level\n' +
    'Press (B) to continue.',

    'Flight Training Complete!\n' +
    'Congratulations, you successfully completed flight training.\n' +
    'You\'re now ready to begin real life Thrust missions.\n' +
    'Press (B) to return to the Menu'
  ]
};