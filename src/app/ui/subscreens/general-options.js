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

p.render = function() {
  UiComponent.prototype.render.call(this);
  this.createDisplay();
};

p.createDisplay = function() {

  var resetButton = new UiButton(this.group, "Reset High Scores");
  resetButton.group.x = 200;
  resetButton.group.y = 400;
  resetButton.render();
  
  this.components = [resetButton];
};

p.dispose = function(){
  _.each(this.components, function(component) {
    component.dispose();
  });
};
