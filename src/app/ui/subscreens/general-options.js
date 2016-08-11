var _ = require('lodash');
var UiComponent = require('../ui-component');
var UiButton = require('../ui-button');

var p = GeneralOptions.prototype = Object.create(UiComponent.prototype, {
  constructor: GeneralOptions
});

module.exports = GeneralOptions;

/**
 * @property group
 * @type {null}
 */
p.group = null;

/**
 *
 *
 * @class GeneralOptions
 * @param group
 * @param name
 * @constructor
 */
function GeneralOptions(group, name) {
  UiComponent.call(this, group, name, true, false);
}

/**
 * @method render
 */
p.render = function() {
  UiComponent.prototype.render.call(this);
  this.createDisplay();
};

/**
 * @method createDisplay
 */
p.createDisplay = function() {

  var resetButton = new UiButton(this.group, "Reset High Scores");
  resetButton.group.x = 200;
  resetButton.group.y = 300;
  resetButton.render();
  resetButton.onItemSelected.add(this.resetHighScores, this);

  this.components = [resetButton];
};

/**
 * Clears the localStorage highscores..
 * @todo automatically reset current session's highscores also
 * @todo maybe make a confirmation dialog component
 * @todo maybe implement a restore deleted highscores
 * @method resetHighScores
 */
p.resetHighScores = function() {
  window.localStorage.clear();
};

/**
 * @method dispose
 */
p.dispose = function(){
  _.each(this.components, function(component) {
    component.dispose();
  });
};
