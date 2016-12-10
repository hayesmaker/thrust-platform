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
 * @param shouldAddNewGroup {Boolean} - maybe remove this, and automatically assign new groups to each ui-component
 * @param shouldAutoManage {Boolean}
 * @constructor
 */
function UiComponent(group, name, shouldAddNewGroup, shouldAutoManage) {
  this.group = shouldAddNewGroup? game.add.group(group) : group;
  this.name = this.group.name = name;
  if (shouldAutoManage) {
    manager.add(this);
  }
  this.components = [];
  this.overrideUserControl = new Phaser.Signal();
  this.restoreUserControl = new Phaser.Signal();
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

p.darkStyle = {font: "16px thrust_regular", fill: "#000000", align: "left"};

p.minStyle = {font: "12px thrust_regular", fill: "#ffffff", align: "left"};

p.darkMinStyle = {font: "12px thrust_regular", fill: "#000000", align: "left"};

p.isFullLayout = false;

/**
 * @property name
 * @type {string}
 * @default not set
 */
p.name = "not set";

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
 * List of display components, which can be cached here
 * and disposed of properly 
 *
 * @property components
 * @type {Array}
 */
p.components = [];

/**
 * @property layoutRect
 * @type {Phaser.Rectangle}
 */
p.layoutRect = new Phaser.Rectangle(0,0,10,10);

p.marginTop = 0;

/**
 * Is this ui-component currently active for the user
 * set to false to disable the current ui-component
 *
 * @property isActive
 * @type {boolean}
 */
p.isActive = false;

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
  this.initLayout();
  this.isRendered = true;
};

p.setTopMargin = function(marginTop) {
  this.marginTop = marginTop;
};


/**
 *
 * @param [group]
 */
p.renderDebug = function(group) {
  var debugGroup = group || this.group;
  console.log('ui-component :: renderDebug', debugGroup);
  var colour = group? 0x00ffff : 0x00ff00;
  var bgDebug = game.add.graphics(0,0, debugGroup);
  bgDebug.beginFill(colour, 0.3);
  bgDebug.drawRect(0, 0, debugGroup.width, debugGroup.height);
  bgDebug.endFill();
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
  if (game.device.desktop && game.width >= 1000) {
    this.initFullLayout();
  } else {
    this.initSmallLayout();
  }
};

p.initFullLayout = function() {
  this.isFullLayout = true;
};

p.initSmallLayout = function() {
  this.isFullLayout = false;
};

p.getDarkStyle = function() {
  return this.isFullLayout? this.darkStyle : this.darkMinStyle;
};

p.getStyle = function() {
  return this.isFullLayout? this.style : this.minStyle;
};

p.centerDisplay = function () {
  //console.log('ui-component :: centerDisplay :: game : group', game.width, game.height, this.group.width, this.group.height);
  this.group.x = game.width / 2 - this.layoutRect.width / 2;
  this.group.y = game.height / 2 - this.layoutRect.height / 2;
};

p.update = function() {

};

p.getComponentByName = function (name) {
  return _.find(this.components, {name: name});
};





