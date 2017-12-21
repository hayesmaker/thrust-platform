var Drone = require('./Drone');
var HoverDrone = require('./HoverDrone');
var dialog = require('../ui/mission-dialog');
var _ = require('lodash');

module.exports = {
  followOrb: false,
  player: null,
  standardDroneWidth: 75,
  standardDroneData: [
    {x: 1600, y: 1400, rotation: 0},
    {x: 1600, y: 1200, rotation: 0},
    {x: 1600, y: 1000, rotation: 0},
    {x: 1500, y: 800, rotation: 0},
    {x: 1700, y: 600, rotation: 0},
    {x: 1600, y: 400, rotation: 0},
    {x: 1400, y: 300, rotation: Math.PI / 4},
    {x: 1200, y: 300, rotation: Math.PI / 2},
    {x: 1000, y: 300, rotation: Math.PI / 2},
    {x: 800, y: 300, rotation: Math.PI / 2},
    {x: 600, y: 300, rotation: 3 * Math.PI / 4},
    {x: 500, y: 400, rotation: 3 * Math.PI / 4},
    {x: 400, y: 500, rotation: 3 * Math.PI / 4},
    {x: 300, y: 700, rotation: 0},
    {x: 400, y: 900, rotation: 0},
    {x: 300, y: 1100, rotation: 0},
    {x: 200, y: 1300, rotation: 0},
    {x: 300, y: 1600, rotation: Math.PI / 4},
    {x: 300, y: 1800, rotation: Math.PI / 4},
    {x: 800, y: 1900, rotation: Math.PI / 2},
    {x: 1000, y: 1900, rotation: Math.PI / 2},
    {x: 1200, y: 1900, rotation: Math.PI / 2},
    {x: 1300, y: 1800, rotation: 7 * Math.PI / 4},
    {x: 1500, y: 1700, rotation: 7 * Math.PI / 4},
    {x: 1600, y: 1550, rotation: 0}
  ],
  standardDrones: [],
  hoverDrones: [],
  hoverDroneWidth: 125,
  hoverDroneData: [
    {x: 2300, y: 1550},
    {x: 2500, y: 1000},
    {x: 2400, y: 1300},
    {x: 2600, y: 1500},
    {x: 2250, y: 800}
  ],
  trainingStageIndex: 0,

  /**
   * @method init
   * @param player
   * @param groups
   * @param collisions
   */
  init: function(player, groups, collisions) {
    this.trainingStageIndex = 0;
    this.standardDrones = [];
    this.player = player;
    this.groups = groups;
    this.collisions = collisions;
    this.scale = player.scale.x;
  },

  /**
   * @method newHoverDrones
   */
  newHoverDrones: function() {
    _.each(this.hoverDroneData, function(data) {
      this.hoverDrones.push(new HoverDrone(
        data.x * this.scale,
        data.y * this.scale,
        this.hoverDroneWidth * this.scale,
        this.groups,
        this.collisions));
    }.bind(this));
    _.each(this.hoverDrones, function(drone) {
      drone.onTrainingComplete.add(this.hoverDroneActivated, this);
    }.bind(this));
  },

  /**
   * @method newDrones
   */
  newDrones: function () {
    _.each(this.standardDroneData, function (data) {
      this.standardDrones.push(new Drone(
        data.x * this.scale,
        data.y * this.scale,
        this.standardDroneWidth * this.scale,
        data.rotation,
        this.groups,
        this.collisions));
    }.bind(this));
    _.each(this.standardDrones, function(drone, i) {
      if (i < this.standardDrones.length - 1) {
        drone.nextDrone = this.standardDrones[i + 1];
      } else {
        drone.lastDrone();
        drone.onTrainingComplete.add(this.nextTrainingStage, this);
      }
    }.bind(this));
    this.standardDrones[0].activate();
  },

  /**
   * @method hoverDroneActivated
   */
  hoverDroneActivated: function() {
    var passedDrones = _.map(this.hoverDrones, function(drone) {
      return drone.hasPassed;
    });
    console.info('drone-manager :: hoverDroneActivated passedDrones',
      passedDrones, passedDrones.indexOf(false) < 0
    );
    if (passedDrones.indexOf(false) < 0) {
      this.gotoOrbStage();
    }
  },

  /**
   * @method gotoOrbStage
   */
  gotoOrbStage: function () {
    this.player.stop();
    this.nextTrainingStage();
  },

  /**
   * @todo refactor needed!
   *
   * @method nextTrainingStage
   */
  nextTrainingStage: function() {
    console.info('drone-manager :: nextTrainingStage :', this.trainingStageIndex);
    this.player.stop();
    if (this.trainingStageIndex === 1) {
      this.followOrb = true;
    }
    dialog.render(function() {
      this.trainingStageIndex++;
      this.doStageSpecifics();
      this.player.resume();
      this.followOrb = false;
    }.bind(this), this);
  },

  activateTimedRun: function(stopwatch) {
    this.stopwatch = stopwatch;
  },

  /**
   * @method trainingComplete
   */
  trainingComplete: function() {
    this.stopwatch.stop();
  },

  /**
   * @method doStageSpecifics
   */
  doStageSpecifics: function() {
    if (this.trainingStageIndex === 1) {
      _.each(this.hoverDrones, function(hoverDrone) {
        hoverDrone.activate();
      }.bind(this));
    } else if (this.trainingStageIndex === 2) {
      this.player.orbActivated = true;
    }
  }
};