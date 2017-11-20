'use strict';


var options = require('../data/options-model');
var gameState = require('../data/game-state');

/**
 * @class StopWatch
 * @constructor
 */
function StopWatch(uiStopwatch) {
  this.uiStopwatch = uiStopwatch;
  this.timer = game.time.create(false);
  this.timer.loop(1, this.update, this);
  if (options.gameModes.speedRun.enabled) {
    this.timerString = gameState.getCachedTimeStr();
    this.cachedTime = gameState.getCachedTime();
    this.uiStopwatch.update(this.timerString);
  }
}

var p = StopWatch.prototype;

/**
 *
 * @property timer
 * @type {null}
 */
p.timer = null;
/**
 *
 * @type {number}
 */
p.counter = 0;
/**
 *
 * @type {string}
 */
p.timerString = "00:00:00";

/**
 * Stored during speed runs
 *
 * @property cachedTime
 * @type {number}
 */
p.cachedTime = 0;

/**
 *
 */
p.start = function () {
  this.timer.start();
};

/**
 *
 */
p.pause = function () {
  this.timer.stop();
};

/**
 *
 */
p.stop = function () {
  console.log('Stopwatch :: stop');
  this.timer.pause();
  if (options.gameModes.speedRun.enabled) {
    gameState.cacheTime(this.counter, this.getText());
  }
};

/**
 *
 */
p.resume = function () {
  this.timer.resume();
};

/**
 * @method destroy
 */
p.destroy = function () {
  game.time.events.remove(this.timer);
  this.timer = null;
  this.timerString = null;
};

/**
 *
 */
p.update = function () {
  this.counter = this.timer.ms + this.cachedTime;
  var mins = Math.floor(this.counter / 60000) % 60;
  var s = Math.floor(this.counter / 1000) % 60;
  var ms = Math.floor(this.counter / 10) % 100;
  if (ms < 10) {
    ms = '0' + ms;
  }
  if (s < 10) {
    s = '0' + s;
  }
  if (mins < 10)  {
    mins = '0' + mins;
  }
  this.timerString = mins + ':' + s + ':' + ms;
  if (this.uiStopwatch) {
    this.uiStopwatch.update(this.timerString);
  }
};

/**
 *
 * @returns {string|*}
 */
p.getText = function() {
  return this.timerString;
};

module.exports = StopWatch;