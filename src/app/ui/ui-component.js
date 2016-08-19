var manager = require('./manager');
var _ = require('lodash');

/**
 * Base Class for UiComponents, 
 * - responsible for adding the group for this component's display objects,
 * - registering itself to the ui-manager
 * - choosing which layout type (small for small displays or large for desktop or ipad displays)
 * - rendering display objects
 * - removing display objects
 * - cleaning up via dispose
 * - can hide/show the display objects
 * - or add remove the display objects completely 
 * 
 * //todo register component signals for disposal in dispose method.
 * //todo maybe implement an events property which can store all this component's signals 
 * 
 * @class UiComponent
 * @constructor
 * @param group
 * @param name
 * @param shouldAddNewGroup
 * @param shouldAutoManage
 * @constructor
 */
function UiComponent(group, name, shouldAddNewGroup, shouldAutoManage) {
  this.group = group;
  this.shouldAddNewGroup = shouldAddNewGroup;
  this.group = this.shouldAddNewGroup? game.add.group(this.group) : this.group;
  this.name = name;
  if (shouldAutoManage) {
    manager.add(this);
  }
  this.components = [];
}

var p = UiComponent.prototype = Object.create(UiComponent.prototype, {
  constructor: UiComponent
});

module.exports = UiComponent;

UiComponent.VERTICAL = "VERTICAL";
UiComponent.HORIZONTAL = "HORIZONTAL";

/**
 * @property group
 * @type {Phaser.Group}
 */
p.group = null;

/**
 * Default style for text in a uicomponent
 * Only currently used in ui-lists until a proper refactor of styling ui-components is added
 * 
 * @property style
 * @type {{font: string, fill: string, align: string}}
 */
p.style = {font: "16px thrust_regular", fill: "#ffffff", align: "left"};

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
 * @private
 */
p.isRendered = false;

/**
 * @property hasNewGroup
 * @type {boolean}
 * @private
 */
p.hasNewGroup = false;

/**
 * List of display components, which can be cached here
 * and disposed of properly 
 *
 * @property components
 * @type {Array}
 */
p.components = [];

/**
 * Make this uiComponent a subscreen
 * If the ui-component is autoManaged (via the constructor)
 * this should not be called
 * todo maybe refactor this so it's not possible to be called if auto managed
 *
 * @method addAsSubScreen
 */
p.addAsSubScreen = function() {
  manager.addSubScreen(this);
};

p.add = function(component) {
  this.components.push(component);
};

p.render = function () {
  this.isRendered = true;
};

p.remove = function () {
  this.isRendered = false;
  this.group.removeAll();
  this.dispose();
};

p.dispose = function() {
  _.each(this.components, function(component) {
    component.dispose();
  });
  this.components = [];
};

p.enable = function () {
};
  
p.disable = function () {
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

p.initLayout = function () {
  if (game.width > 1000) {
    this.initFullLayout();
  } else {
    this.initSmallLayout();
  }
};

p.initFullLayout = function() {
  
};

p.initSmallLayout = function() {
  
};

p.centerDisplay = function () {
  this.group.x = game.width / 2 - this.group.width / 2;
  this.group.y = game.height / 2 - this.group.height / 2;
};





