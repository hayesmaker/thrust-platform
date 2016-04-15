var manager = require('./manager');

/**
 * @property UiComponent
 * @constructor
 */
function UiComponent(group, name) {
  this.group = game.add.group(group);
  this.name = name;
  manager.add(this);
}

var p = UiComponent.prototype = Object.create(UiComponent.prototype, {
  constructor: UiComponent
});

module.exports = UiComponent;

/**
 * @property group
 * @type {Phaser.Group}
 */
p.group = null;

/**
 * @property name
 * @type {string}
 */
p.name = "";

p.show = function() {
  this.group.visible = true;
};

p.hide = function() {
  this.group.visible = false;
};

p.createDisplay = function() {

};

p.showAndAdd = function() {

};

p.hideAndRemove = function() {

};


