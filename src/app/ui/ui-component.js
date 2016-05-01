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

/**
 * Prevents this ui component being enabled automatically when shown.
 * 
 * @property preventAutoEnable
 * @type {boolean}
 * @default false
 */
p.preventAutoEnable = false;

/**
 * @property isRendered
 * @type {boolean}
 */
p.isRendered = false;

p.render = function () {
  this.isRendered = true;
};

p.remove = function () {
  this.isRendered = false;
  this.group.removeAll();
};

p.enable = function () {
  console.log('abstract ui-component enable');
};

p.disable = function () {
  console.log('abstract ui-component disable');
};

p.show = function () {
  this.group.visible = true;
  if (!this.preventAutoEnable) {
    this.enable();
  }
};

p.hide = function () {
  this.group.visible = false;
  this.disable();
};

p.showAndAdd = function () {
  if (!this.isRendered) {
    this.render();
    this.show();
  }
};

p.hideAndRemove = function () {
  if (this.isRendered) {
    this.remove();
    this.hide();
  }
};


