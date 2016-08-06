'use strict';

/**
 * @class StopWatch
 * @constructor
 */
function StopWatch() {
  this.timer = game.time.create(false);
  this.timer.loop(1, this.update, this);
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
 *
 */
p.start = function (uiStopwatch) {
  this.uiStopwatch = uiStopwatch;
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
  this.timer.pause();
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
  this.counter = this.timer.ms;
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