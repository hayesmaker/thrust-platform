/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link http://choosealicense.com/licenses/no-license/|No License}
* @version      1.0.0 - March 31st 2015
*/

/**
 * @namespace Phaser
 */

/**
 * The VirtualJoystick plugin.
 * 
 * This plugin is responsible for all joysticks and buttons created within your game.
 *
 * Add it to your game via the Phaser Plugin Manager:
 *
 * `this.pad = this.game.plugins.add(Phaser.VirtualJoystick);`
 *
 * Once created you can then add new joysticks and buttons using `addStick` and `addButton` respectively.
 * 
 * This plugin can contain multiple sticks and buttons and will handle processing and updating them all.
 *
 * @class VirtualJoystick
 * @memberOf Phaser
 * @constructor
 * @param {Phaser.Game} game - A reference to the current Phaser.Game instance.
 * @param {Phaser.PluginManager} parent - The Phaser Plugin Manager which looks after this plugin.
 */
Phaser.VirtualJoystick = function (game, parent) {

    Phaser.Plugin.call(this, game, parent);

    /**
    * @property {Phaser.ArraySet} sticks - The Sticks that this plugin is responsible for.
    * @protected
    */
    this.sticks = null;

    /**
    * @property {Phaser.ArraySet} buttons - The Buttons that this plugin is responsible for.
    * @protected
    */
    this.buttons = null;

    /**
    * @property {integer} _pointerTotal - Internal var to track the Input pointer total.
    * @private
    */
    this._pointerTotal = 0;
    
};

Phaser.VirtualJoystick.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.VirtualJoystick.prototype.constructor = Phaser.VirtualJoystick;

/**
* Used by VirtualJoystick.Stick.motionLock. Defines full freedom of movement.
* @constant
* @type {integer}
*/
Phaser.VirtualJoystick.NONE = 0;

/**
* Used by VirtualJoystick.Stick.motionLock. Defines movement locked to the horizontal axis only.
* @constant
* @type {integer}
*/
Phaser.VirtualJoystick.HORIZONTAL = 1;

/**
* Used by VirtualJoystick.Stick.motionLock. Defines movement locked to the vertical axis only.
* @constant
* @type {integer}
*/
Phaser.VirtualJoystick.VERTICAL = 2;

/**
* Used by VirtualJoystick.Button.shape. Defines the hit area geometry shape being used is a Circle.
* @constant
* @type {integer}
*/
Phaser.VirtualJoystick.CIRC_BUTTON = 0;

/**
* Used by VirtualJoystick.Button.shape. Defines the hit area geometry shape being used is a Rectangle.
* @constant
* @type {integer}
*/
Phaser.VirtualJoystick.RECT_BUTTON = 1;

/**
 * Called automatically by the Phaser Plugin Manager.
 * Creates the local properties.
 *
 * @method init
 * @memberOf Phaser.VirtualJoystick
 * @protected
 */
Phaser.VirtualJoystick.prototype.init = function () {

    this.sticks = new Phaser.ArraySet();
    this.buttons = new Phaser.ArraySet();

};

/**
 * Creates a new `Stick` object.
 *
 * `var stick = pad.addStick(x, y, distance, 'texture');`
 * 
 * It consists of two Sprites: one representing the 'base' of the joystick and the other the 'stick' itself, which is the part
 * that the player grabs hold of and interacts with. As the stick is moved you can read back the force being applied, either globally
 * or on a per axis basis.
 *
 * The Stick can either be on-screen all the time, positioned via the `posX` and `posY` setters. Or you can have it only appear when the
 * player touches the screen by setting `showOnTouch` to true.
 *
 * The Stick sprites are added to `Game.Stage`, which is always above `Game.World` in which all other Sprites and display objects live.
 * 
 * Stick force values are analogue, that is they are values between 0 and 1 that vary depending on how the stick
 * is being moved. This allows players to have fine-grained control over your game. If you require just an 'on / off' response you may
 * wish to use the DPad class instead.
 *
 * @method addStick
 * @memberOf Phaser.VirtualJoystick
 * @param {number} x - The x coordinate to draw the joystick at. The joystick is centered on this coordinate.
 * @param {number} y - The y coordinate to draw the joystick at. The joystick is centered on this coordinate.
 * @param {number} distance - The distance threshold between the stick and the base. This is how far the stick can be pushed in any direction.
 * @param {string} texture - The Phaser.Cache key of the texture atlas to be used to render this joystick.
 * @param {string} [baseFrame='base'] - The name of the base frame within the joystick texture atlas.
 * @param {string} [stickFrame='stick'] - The name of the stick frame within the joystick texture atlas.
 * @return {Phaser.VirtualJoystick.Stick} The Stick object.
 */
Phaser.VirtualJoystick.prototype.addStick = function (x, y, distance, texture, baseFrame, stickFrame) {

    if (typeof baseFrame === 'undefined') { baseFrame = 'base'; }
    if (typeof stickFrame === 'undefined') { stickFrame = 'stick'; }

    var stick = new Phaser.VirtualJoystick.Stick(this, x, y, distance, texture, baseFrame, stickFrame);

    this.sticks.add(stick);

    this._pointerTotal++;

    if (this._pointerTotal > 2)
    {
        this.game.input.addPointer();
    }

    return stick;

};

/**
 * Creates a new `DPad` object.
 *
 * `var dpad = pad.addDPad(x, y, distance, 'texture');`
 *
 * While the Stick class creates an analogue joystick, the DPad one creates a digital joystick. The difference is that a digital joystick
 * is either "on" or "off" in any given direction. There is no pressure or degree of force in any direction, it's either moving or it isn't.
 * This is the same as the way in which NES style game pads work. The "D" stands for "Direction".
 *
 * Unlike the Stick class the DPad can use a different frame from the texture atlas for each of the 4 directions in which it can move.
 *
 * The DPad can either be on-screen all the time, positioned via the `posX` and `posY` setters. Or you can have it only appear when the
 * player touches the screen by setting `showOnTouch` to true.
 *
 * The DPad sprite is added to `Game.Stage`, which is always above `Game.World` in which all other Sprites and display objects live.
 *
 * @method addDPad
 * @memberOf Phaser.VirtualJoystick
 * @param {Phaser.VirtualJoystick.Pad} pad - The Virtual Pad that this Joystick belongs to.
 * @param {number} x - The x coordinate to draw the joystick at. The joystick is centered on this coordinate.
 * @param {number} y - The y coordinate to draw the joystick at. The joystick is centered on this coordinate.
 * @param {number} distance - The distance threshold between the stick and the base. This is how far the stick can be pushed in any direction.
 * @param {string} texture - The Phaser.Cache key of the texture atlas to be used to render this joystick.
 * @param {string} [neutralFrame=neutral] - The name of the frame within the texture atlas that contains the 'neutral' state of the dpad. Neutral is the state when the dpad isn't moved at all.
 * @param {string} [upFrame=up] - The name of the frame within the texture atlas that contains the 'up' state of the dpad.
 * @param {string} [downFrame=down] - The name of the frame within the texture atlas that contains the 'down' state of the dpad.
 * @param {string} [leftFrame=left] - The name of the frame within the texture atlas that contains the 'left' state of the dpad.
 * @param {string} [rightFrame=right] - The name of the frame within the texture atlas that contains the 'right' state of the dpad.
 * @return {Phaser.VirtualJoystick.DPad} The DPad object.
 */
Phaser.VirtualJoystick.prototype.addDPad = function (x, y, distance, texture, neutralFrame, upFrame, downFrame, leftFrame, rightFrame) {

    if (typeof neutralFrame === 'undefined') { neutralFrame = 'neutral'; }
    if (typeof upFrame === 'undefined') { upFrame = 'up'; }
    if (typeof downFrame === 'undefined') { downFrame = 'down'; }
    if (typeof leftFrame === 'undefined') { leftFrame = 'left'; }
    if (typeof rightFrame === 'undefined') { rightFrame = 'right'; }

    var stick = new Phaser.VirtualJoystick.DPad(this, x, y, distance, texture, neutralFrame, upFrame, downFrame, leftFrame, rightFrame);

    this.sticks.add(stick);

    this._pointerTotal++;

    if (this._pointerTotal > 2)
    {
        this.game.input.addPointer();
    }

    return stick;

};

/**
 * Removes the given Stick or DPad object from this plugin and then calls `destroy` on it.
 *
 * @method removeStick
 * @memberOf Phaser.VirtualJoystick
 * @param {Phaser.VirtualJoystick.Stick|Phaser.VirtualJoystick.DPad} stick - The Stick or DPad object to be destroyed and removed.
 */
Phaser.VirtualJoystick.prototype.removeStick = function (stick) {

    this.sticks.remove(stick);

    stick.destroy();

};

/**
 * Creates a new `Button` object - a virtual button.
 *
 * `var button = pad.addButton(x, y, 'texture', 'button-up', 'button-down');`
 * 
 * It consists of one sprite with two frames. One frame depicts the button as it's held down, the other when up.
 *
 * The Button sprite is added to `Game.Stage`, which is always above `Game.World` in which all other Sprites and display objects live.
 *
 * The Button is digital, i.e. it is either 'on or off'. It doesn't have a pressure or force associated with it.
 *
 * @method addButton
 * @memberOf Phaser.VirtualJoystick
 * @param {Phaser.VirtualJoystick.Pad} pad - The Virtual Pad that this Button belongs to.
 * @param {integer} shape - The shape of the buttons hit area. Either Phaser.VirtualJoystick.CIRC_BUTTON or Phaser.VirtualJoystick.RECT_BUTTON.
 * @param {number} x - The x coordinate to draw the button at. The button is centered on this coordinate.
 * @param {number} y - The y coordinate to draw the button at. The button is centered on this coordinate.
 * @param {string} texture - The Phaser.Cache key of the texture atlas to be used to render this button.
 * @param {string} upFrame - The name of the frame within the button texture atlas to be used when the button is in an 'up' state.
 * @param {string} downFrame - The name of the frame within the button texture atlas to be used when the button is in a 'down' state.
 * @return {Phaser.VirtualJoystick.Button} The Button object.
 */
Phaser.VirtualJoystick.prototype.addButton = function (x, y, texture, upFrame, downFrame, shape) {

    if (typeof shape === 'undefined') { shape = Phaser.VirtualJoystick.CIRC_BUTTON; }

    var button = new Phaser.VirtualJoystick.Button(this, shape, x, y, texture, upFrame, downFrame);

    this.buttons.add(button);

    this._pointerTotal++;

    if (this._pointerTotal > 2)
    {
        this.game.input.addPointer();
    }

    return button;

};

/**
 * Removes the given Button object from this plugin and then calls `Button.destroy` on it.
 *
 * @method removeButton
 * @memberOf Phaser.VirtualJoystick
 * @param {Phaser.VirtualJoystick.Button} button - The Button object to be destroyed and removed.
 */
Phaser.VirtualJoystick.prototype.removeButton = function (button) {

    this.buttons.remove(button);

    button.destroy();

};

/**
 * Called automatically by the Phaser Plugin Manager.
 * Updates all Stick and Button objects.
 *
 * @method update
 * @memberOf Phaser.VirtualJoystick
 * @protected
 */
Phaser.VirtualJoystick.prototype.update = function () {

    this.sticks.callAll('update');
    this.buttons.callAll('update');

};

/**
 * Removes and calls `destroy` on all Stick and Button objects in this plugin.
 *
 * @method destroy
 * @memberOf Phaser.VirtualJoystick
 */
Phaser.VirtualJoystick.prototype.destroy = function () {

    this.sticks.removeAll(true);
    this.buttons.removeAll(true);

};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link http://choosealicense.com/licenses/no-license/|No License}
*/

/**
 * A `Stick` is a virtual joystick. It belongs to a parent `Pad` object which is responsible for creating and updating it.
 *
 * Create a new stick by using the `Pad.addStick` method.
 * 
 * It consists of two Sprites: one representing the 'base' of the joystick and the other the 'stick' itself, which is the part
 * that the player grabs hold of and interacts with. As the stick is moved you can read back the force being applied, either globally
 * or on a per axis basis.
 *
 * The Stick can either be on-screen all the time, positioned via the `posX` and `posY` setters. Or you can have it only appear when the
 * player touches the screen by setting `showOnTouch` to true.
 *
 * The Stick sprites are added to `Game.Stage`, which is always above `Game.World` in which all other Sprites and display objects live.
 * 
 * Stick force values are analogue, that is they are values between 0 and 1 that vary depending on how the stick
 * is being moved. This allows players to have fine-grained control over your game. If you require just an 'on / off' response you may
 * wish to use the DPad class instead.
 *
 * @class Phaser.VirtualJoystick.Stick
 * @constructor
 * @param {Phaser.VirtualJoystick.Pad} pad - The Virtual Pad that this Joystick belongs to.
 * @param {number} x - The x coordinate to draw the joystick at. The joystick is centered on this coordinate.
 * @param {number} y - The y coordinate to draw the joystick at. The joystick is centered on this coordinate.
 * @param {number} distance - The distance threshold between the stick and the base. This is how far the stick can be pushed in any direction.
 * @param {string} texture - The Phaser.Cache key of the texture atlas to be used to render this joystick.
 * @param {string} [baseFrame='base'] - The name of the frame within the joystick texture atlas that contains the 'base' image.
 * @param {string} [stickFrame='stick'] - The name of the frame within the joystick texture atlas that contains the 'stick' image.
 */
Phaser.VirtualJoystick.Stick = function (pad, x, y, distance, texture, baseFrame, stickFrame) {

    /**
    * @property {Phaser.VirtualJoystick.Pad} pad - A reference to the Virtual Pad that this Joystick belongs to.
    */
    this.pad = pad;

    /**
    * @property {string} baseFrame - The name of the frame within the joystick texture atlas that contains the 'base' image.
    */
    this.baseFrame = baseFrame;

    /**
    * @property {string} stickFrame - The name of the frame within the joystick texture atlas that contains the 'stick' image.
    */
    this.stickFrame = stickFrame;

    /**
    * @property {Phaser.Point} position - The position of the joystick in screen coordinates. To adjust please use `posX` and `posY`.
    * @protected
    */
    this.position = new Phaser.Point(x, y);

    /**
    * @property {Phaser.Line} line - The line object used for stick to base calculations.
    * @protected
    */
    this.line = new Phaser.Line(this.position.x, this.position.y, this.position.x, this.position.y);

    /**
    * @property {Phaser.Sprite} baseSprite - The Sprite that is used to display the base of the joystick.
    */
    this.baseSprite = this.pad.game.make.sprite(this.position.x, this.position.y, texture, baseFrame);
    this.baseSprite.anchor.set(0.5);

    /**
    * @property {Phaser.Sprite} stickSprite - The Sprite that is used to display the stick or handle of the joystick.
    */
    this.stickSprite = this.pad.game.make.sprite(this.position.x, this.position.y, texture, stickFrame);
    this.stickSprite.anchor.set(0.5);

    /**
    * @property {Phaser.Circle} baseHitArea - The circular hit area that defines the base of the joystick.
    */
    this.baseHitArea = new Phaser.Circle(this.position.x, this.position.y, distance);

    /**
    * @property {Phaser.Circle} stickHitArea - The circular hit area that defines the stick or handle of the joystick.
    */
    this.stickHitArea = new Phaser.Circle(this.position.x, this.position.y, this.stickSprite.width);

    /**
    * @property {Phaser.Point} limitPoint - A Point object that holds the stick limits.
    * @protected
    */
    this.limitPoint = new Phaser.Point();

    /**
    * @property {Phaser.Pointer} pointer - A reference to the Input Pointer being used to update this joystick.
    * @protected
    */
    this.pointer = null;

    /**
    * @property {boolean} enabled - Should this joystick process or dispatch any events? Set to `false` to disable it.
    * @default
    */
    this.enabled = true;

    /**
    * The current down state of this joystick. A joystick is determined as being down if it has been pressed and interacted with.
    * If it has a `deadZone` set then it's not considered as being down unless it has moved beyond the limits of the deadZone.
    * @property {boolean} isDown
    * @protected
    */
    this.isDown = false;

    /**
    * The current up state of this joystick. A joystick is determined as being up if it is not being interacted with.
    * If it has a `deadZone` set then it's considered as being up until it has moved beyond the limits of the deadZone.
    * @property {boolean} isUp
    * @protected
    */
    this.isUp = true;

    /**
    * The onDown signal is dispatched as soon as the joystick is touched, or clicked when under mouse emulation.
    * If it has a `deadZone` set then it's not dispatched until it has moved beyond the limits of the deadZone.
    * When this signal is dispatched it sends 2 parameters: this Stick and the Phaser.Pointer object that caused the event:
    * `onDown(Phaser.VirtualJoystick.Stick, Phaser.Pointer)`
    * 
    * @property {Phaser.Signal} onDown
    */
    this.onDown = new Phaser.Signal();

    /**
    * The onUp signal is dispatched as soon as the joystick is released, having previously been in an `isDown` state.
    * When this signal is dispatched it sends 2 parameters: this Stick and the Phaser.Pointer object that caused the event:
    * `onUp(Phaser.VirtualJoystick.Stick, Phaser.Pointer)`
    * 
    * @property {Phaser.Signal} onUp
    */
    this.onUp = new Phaser.Signal();

    /**
    * The onMove signal is dispatched whenever the joystick is moved as a result of a device Touch movement event.
    * When this signal is dispatched it sends 4 parameters: this Stick and the `force`, `forceX` and `forceY` values:
    * `onMove(Phaser.VirtualJoystick.Stick, force, forceX, forceY)`
    * This signal is only dispatched when a touch move event is received, even if the stick is held in a specific direction.
    * If you wish to constantly check the position of the joystick then you should use the `onUpdate` signal instead of `onMove`.
    * 
    * @property {Phaser.Signal} onMove
    */
    this.onMove = new Phaser.Signal();

    /**
    * The onUpdate signal is dispatched constantly for as long as the joystick is in an `isDown` state.
    * When this signal is dispatched it sends 4 parameters: this Stick and the `force`, `forceX` and `forceY` values:
    * `onUpdate(Phaser.VirtualJoystick.Stick, force, forceX, forceY)`
    * This is a high frequency signal so be careful what is bound to it. If there are computationally cheaper ways of 
    * reacting to this joysticks movement then you should explore them.
    * 
    * @property {Phaser.Signal} onUpdate
    */
    this.onUpdate = new Phaser.Signal();

    /**
    * @property {integer} timeDown - The time when the joystick last entered an `isDown` state.
    * @readOnly
    */
    this.timeDown = 0;

    /**
    * @property {integer} timeUp - The time when the joystick last entered an `isUp` state.
    * @readOnly
    */
    this.timeUp = 0;

    /**
    * @property {number} angle - The angle of the joystick in degrees. From -180 to 180 where zero is right-handed.
    * @readOnly
    */
    this.angle = 0;

    /**
    * @property {number} angleFull - The angle of the joystick in degrees. From 0 to 360 where zero is right-handed.
    * @readOnly
    */
    this.angleFull = 0;

    /**
    * The quadrant the joystick is in.
    * Where 315 to 45 degrees is quadrant 0. 
    * 45 to 135 degrees is quadrant 1. 
    * 135 to 225 degrees is quadrant 2.
    * 225 to 315 degrees is quadrant 3.
    * @property {integer} quadrant
    * @readOnly
    */
    this.quadrant = 0;

    /**
    * The nearest octant of the joystick. Where each octant is 360 degrees / 45.
    * @property {integer} octant
    * @readOnly
    */
    this.octant = 0;

    /**
    * A Stick can be motion locked. When locked it can only move along the specified axis.
    * `motionLock = Phaser.VirtualJoystick.HORIZONTAL` will only allow it to move horizontally.
    * `motionLock = Phaser.VirtualJoystick.VERTICAL` will only allow it to move vertically.
    * `motionLock = Phaser.VirtualJoystick.NONE` will allow it to move freely.
    * @property {integer} motionLock
    * @default Phaser.VirtualJoystick.NONE
    */
    this.motionLock = Phaser.VirtualJoystick.NONE;

    /**
    * @property {number} _distance - Internal calculation var.
    * @private
    */
    this._distance = distance;

    /**
    * @property {number} _deadZone - Internal calculation var.
    * @private
    */
    this._deadZone = distance * 0.15;

    /**
    * @property {number} _scale - Internal calculation var.
    * @private
    */
    this._scale = 1;

    /**
    * @property {boolean} _tracking - Internal var.
    * @private
    */
    this._tracking = false;

    /**
    * @property {boolean} _showOnTouch - Internal var.
    * @private
    */
    this._showOnTouch = false;

    this.pad.game.stage.addChild(this.baseSprite);
    this.pad.game.stage.addChild(this.stickSprite);

    this.pad.game.input.onDown.add(this.checkDown, this);
    this.pad.game.input.onUp.add(this.checkUp, this);
    this.pad.game.input.addMoveCallback(this.moveStick, this);

};

Phaser.VirtualJoystick.Stick.prototype = {

    /**
     * The Input.onDown callback. Processes the down event for this stick, or starts tracking if required.
     *
     * @method Phaser.VirtualJoystick.Stick#checkDown
     * @private
     * @param {Phaser.Pointer} pointer - The Phaser Pointer that triggered the event.
     */
    checkDown: function (pointer) {

        if (this.enabled && this.isUp)
        {
            this.pointer = pointer;

            if (this.motionLock === Phaser.VirtualJoystick.NONE)
            {
                this.line.end.copyFrom(this.pointer);
            }
            else if (this.motionLock === Phaser.VirtualJoystick.HORIZONTAL)
            {
                this.line.end.x = this.pointer.x;
            }
            else if (this.motionLock === Phaser.VirtualJoystick.VERTICAL)
            {
                this.line.end.y = this.pointer.y;
            }

            if (this._showOnTouch)
            {
                this.line.start.copyFrom(pointer);
                this.posX = pointer.x;
                this.posY = pointer.y;
                this.visible = true;
                this.setDown();
            }
            else
            {
                if (this.stickHitArea.contains(pointer.x, pointer.y))
                {
                    if (this.line.length <= this.deadZone)
                    {
                        this._tracking = true;
                    }
                    else
                    {
                        this.setDown();
                        this.moveStick();
                    }
                }
            }
        }

    },

    /**
     * The Input.onUp callback. Processes the up event for this stick.
     *
     * @method Phaser.VirtualJoystick.Stick#checkUp
     * @private
     * @param {Phaser.Pointer} pointer - The Phaser Pointer that triggered the event.
     */
    checkUp: function (pointer) {

        if (pointer === this.pointer)
        {
            this.pointer = null;

            this.stickHitArea.x = this.position.x;
            this.stickHitArea.y = this.position.y;

            this.stickSprite.x = this.stickHitArea.x;
            this.stickSprite.y = this.stickHitArea.y;

            this.line.end.copyFrom(this.line.start);

            this.isDown = false;
            this.isUp = true;

            this.timeUp = this.pad.game.time.time;

            this.onUp.dispatch(this, pointer);

            if (this._showOnTouch)
            {
                this.visible = false;
            }
        }

    },

    /**
     * Internal down handler. Activated either onDown or after tracking if the stick has a dead zone.
     *
     * @method Phaser.VirtualJoystick.Stick#setDown
     * @private
     */
    setDown: function () {

        this.isDown = true;
        this.isUp = false;
        this.timeDown = this.pad.game.time.time;
        this.timeUp = 0;

        this._tracking = false;

        this.checkArea();

        this.onDown.dispatch(this, this.pointer);

    },

    /**
     * Internal calculation method. Updates the various angle related properties.
     *
     * @method Phaser.VirtualJoystick.Stick#checkArea
     * @private
     */
    checkArea: function () {

        this.angle = this.pad.game.math.radToDeg(this.line.angle);
        this.angleFull = this.angle;

        if (this.angleFull < 0)
        {
            this.angleFull += 360;
        }

        this.octant = 45 * (Math.round(this.angleFull / 45));

        if (this.angleFull >= 45 && this.angleFull < 135)
        {
            this.quadrant = 1;
        }
        else if (this.angleFull >= 135 && this.angleFull < 225)
        {
            this.quadrant = 2;
        }
        else if (this.angleFull >= 225 && this.angleFull < 315)
        {
            this.quadrant = 3;
        }
        else
        {
            this.quadrant = 0;
        }

    },

    /**
     * The Input.onMove callback. Processes the movement event for this stick.
     *
     * @method Phaser.VirtualJoystick.Stick#moveStick
     * @private
     */
    moveStick: function () {

        if (!this.pointer || (!this.isDown && !this._tracking))
        {
            return;
        }

        if (this.motionLock === Phaser.VirtualJoystick.NONE)
        {
            this.line.end.copyFrom(this.pointer);
        }
        else if (this.motionLock === Phaser.VirtualJoystick.HORIZONTAL)
        {
            this.line.end.x = this.pointer.x;
        }
        else if (this.motionLock === Phaser.VirtualJoystick.VERTICAL)
        {
            this.line.end.y = this.pointer.y;
        }

        this.checkArea();

        if (!this.isDown && this.line.length <= this.deadZone)
        {
            return;
        }

        if (this._tracking)
        {
            //  Was tracking, now in the zone so dispatch and follow
            this.setDown();
        }

        if (this.line.length < this.baseHitArea.radius)
        {
            if (this.motionLock === Phaser.VirtualJoystick.NONE)
            {
                this.stickHitArea.x = this.pointer.x;
                this.stickHitArea.y = this.pointer.y;
            }
            else if (this.motionLock === Phaser.VirtualJoystick.HORIZONTAL)
            {
                this.stickHitArea.x = this.pointer.x;
            }
            else if (this.motionLock === Phaser.VirtualJoystick.VERTICAL)
            {
                this.stickHitArea.y = this.pointer.y;
            }
        }
        else
        {
            //  Let it smoothly rotate around the base limit
            this.baseHitArea.circumferencePoint(this.line.angle, false, this.limitPoint);

            if (this.motionLock === Phaser.VirtualJoystick.NONE)
            {
                this.stickHitArea.x = this.limitPoint.x;
                this.stickHitArea.y = this.limitPoint.y;
            }
            else if (this.motionLock === Phaser.VirtualJoystick.HORIZONTAL)
            {
                this.stickHitArea.x = this.limitPoint.x;
            }
            else if (this.motionLock === Phaser.VirtualJoystick.VERTICAL)
            {
                this.stickHitArea.y = this.limitPoint.y;
            }
        }

        this.stickSprite.x = this.stickHitArea.x;
        this.stickSprite.y = this.stickHitArea.y;

        this.onMove.dispatch(this, this.force, this.forceX, this.forceY);

    },

    /**
     * The update callback. This is called automatically by the Pad parent.
     *
     * @method Phaser.VirtualJoystick.Stick#update
     * @private
     */
    update: function () {

        if (this.isDown && !this._tracking)
        {
            this.onUpdate.dispatch(this, this.force, this.forceX, this.forceY);
        }

    },

    /**
     * Visually aligns the joystick to the bottom left of the game view.
     * The optional spacing parameter allows you to add a border between the edge of the game and the joystick.
     *
     * @method Phaser.VirtualJoystick.Stick#alignBottomLeft
     * @param {number} [spacing=0] - The spacing to apply between the edge of the game and the joystick.
     */
    alignBottomLeft: function (spacing) {

        if (typeof spacing === 'undefined') { spacing = 0; }

        var w = (this.baseSprite.width / 2) + spacing;
        var h = (this.baseSprite.height / 2) + spacing;

        this.posX = w;
        this.posY = this.pad.game.height - h;

    },

    /**
     * Visually aligns the joystick to the bottom right of the game view.
     * The optional spacing parameter allows you to add a border between the edge of the game and the joystick.
     *
     * @method Phaser.VirtualJoystick.Stick#alignBottomRight
     * @param {number} [spacing=0] - The spacing to apply between the edge of the game and the joystick.
     */
    alignBottomRight: function (spacing) {

        if (typeof spacing === 'undefined') { spacing = 0; }

        var w = (this.baseSprite.width / 2) + spacing;
        var h = (this.baseSprite.height / 2) + spacing;

        this.posX = this.pad.game.width - w;
        this.posY = this.pad.game.height - h;

    },

    /**
     * Destroys this Stick.
     * 
     * Removes all associated event listeners and signals and calls destroy on the stick sprites.
     *
     * @method Phaser.VirtualJoystick.Stick#destroy
     */
    destroy: function () {

        this.pad.game.input.onDown.remove(this.checkDown, this);
        this.pad.game.input.onUp.remove(this.checkUp, this);

        var mc = this.pad.game.input.moveCallbacks;

        for (var i = 0; i < mc.length; i++)
        {
            if (mc.callback === this.moveStick && mc.context === this)
            {
                mc.splice(i, 1);
                break;
            }
        }

        this.stickSprite.destroy();
        this.baseSprite.destroy();

        this.stickHitArea = null;
        this.baseHitArea = null;
        this.line = null;
        this.limitPoint = null;

        this.onDown.dispose();
        this.onUp.dispose();
        this.onMove.dispose();
        this.onUpdate.dispose();

        this.pointer = null;

        this._scale = null;
        this.pad = null;

    },

    /**
     * Renders out a debug view of this Stick to the `Phaser.Debug` handler.
     *
     * It optionally renders the geometry involved in the stick hit areas and calculation line.
     * 
     * It also optionally renders text information relating to the current forces and angles. The text is rendered
     * to the right of the joystick image unless an x parameter is specified.
     *
     * Because of the overhead of using Phaser.Debug in WebGL mode you should never enable this in a production game.
     * However for debugging it's extremely useful, hence why it's named `debug`.
     *
     * @method Phaser.VirtualJoystick.Stick#debug
     * @param {boolean} [sticks=true] - Renders the geometry involved in the stick hit areas and calculation line.
     * @param {boolean} [text=true] - Renders text information relating to the current forces and angles.
     * @param {number} [x] - The x coordinate to render the text properties to. If not given will default to the right of the joystick.
     */
    debug: function (sticks, text, x) {

        if (typeof sticks === 'undefined') { sticks = true; }
        if (typeof text === 'undefined') { text = true; }
        if (typeof x === 'undefined') { x = this.baseSprite.right; }

        var debug = this.pad.game.debug;

        if (sticks)
        {
            debug.context.lineWidth = 2;
            debug.geom(this.baseHitArea, 'rgba(255, 0, 0, 1)', false);
            debug.geom(this.stickHitArea, 'rgba(0, 255, 0, 1)', false);
            debug.geom(this.line, 'rgba(255, 255, 0, 1)');
            debug.context.lineWidth = 1;
        }

        if (text)
        {
            var shadow = debug.renderShadow;
            var tx = x;
            var ty = this.baseSprite.y - 114;

            debug.renderShadow = true;

            debug.text('Force: ' + this.force.toFixed(2), tx, ty);
            debug.text('ForceX: ' + this.forceX.toFixed(2), tx, ty + 24);
            debug.text('ForceY: ' + this.forceY.toFixed(2), tx, ty + 48);
            debug.text('Rotation: ' + this.rotation.toFixed(2), tx, ty + 96);
            debug.text('Angle: ' + this.angle.toFixed(2), tx, ty + 120);
            debug.text('Distance: ' + this.distance, tx, ty + 172);
            debug.text('Quadrant: ' + this.quadrant, tx, ty + 196);
            debug.text('Octant: ' + this.octant, tx, ty + 220);

            debug.renderShadow = shadow;
        }

    }

};

/**
* @name Phaser.VirtualJoystick.Stick#rotation
* @property {number} rotation - The rotation of the stick from its base in radians.
* @readOnly
*/
Object.defineProperty(Phaser.VirtualJoystick.Stick.prototype, "rotation", {

    get: function () {

        return this.line.angle;

    }

});

/**
* The x coordinate the joystick is rendered at. Value should be given in pixel coordinates based on game dimensions.
* Use this to change the position of the joystick on-screen. Value can even be tweened to display or hide the joystick in interesting ways.
* 
* @name Phaser.VirtualJoystick.Stick#posX
* @property {number} posX
*/
Object.defineProperty(Phaser.VirtualJoystick.Stick.prototype, "posX", {

    get: function () {

        return this.position.x;

    },

    set: function (x) {

        if (this.position.x !== x)
        {
            this.position.x = x;

            this.baseSprite.x = x;
            this.stickSprite.x = x;

            this.baseHitArea.x = x;
            this.stickHitArea.x = x;
            this.line.start.x = x;
            this.line.end.x = x;
        }

    }

});

/**
* The y coordinate the joystick is rendered at. Value should be given in pixel coordinates based on game dimensions.
* Use this to change the position of the joystick on-screen. Value can even be tweened to display or hide the joystick in interesting ways.
* 
* @name Phaser.VirtualJoystick.Stick#posY
* @property {number} posY
*/
Object.defineProperty(Phaser.VirtualJoystick.Stick.prototype, "posY", {

    get: function () {

        return this.position.y;

    },

    set: function (y) {

        if (this.position.y !== y)
        {
            this.position.y = y;

            this.baseSprite.y = y;
            this.stickSprite.y = y;

            this.baseHitArea.y = y;
            this.stickHitArea.y = y;
            this.line.start.y = y;
            this.line.end.y = y;
        }

    }

});

/**
* The current force being applied to the joystick.
* 
* This is a value between 0 and 1 calculated based on the distance of the stick from its base.
* It can be used to apply speed to physics objects, for example:
* 
* `ArcadePhysics.velocityFromRotation(Stick.rotation, Stick.force * maxSpeed, Sprite.body.velocity)`
* 
* @name Phaser.VirtualJoystick.Stick#force
* @property {number} force
* @readOnly
*/
Object.defineProperty(Phaser.VirtualJoystick.Stick.prototype, "force", {

    get: function () {

        return Math.min(1, (this.line.length / this.distance * 2));

    }

});

/**
* The current force being applied to the joystick on the horizontal axis.
* 
* This is a value between 0 and 1 calculated based on the distance of the stick from its base.
*
* If you need to know which direction the Stick is facing (i.e. left or right) then see the `x` property value.
* 
* @name Phaser.VirtualJoystick.Stick#forceX
* @property {number} forceX
* @readOnly
*/
Object.defineProperty(Phaser.VirtualJoystick.Stick.prototype, "forceX", {

    get: function () {

        return this.force * this.x;

    }

});

/**
* The current force being applied to the joystick on the vertical axis.
* 
* This is a value between 0 and 1 calculated based on the distance of the stick from its base.
*
* If you need to know which direction the Stick is facing (i.e. up or down) then see the `y` property value.
* 
* @name Phaser.VirtualJoystick.Stick#forceY
* @property {number} forceY
* @readOnly
*/
Object.defineProperty(Phaser.VirtualJoystick.Stick.prototype, "forceY", {

    get: function () {

        return this.force * this.y;

    }

});

/**
* The current x value of the joystick.
* 
* This is a value between -1 and 1 calculated based on the distance of the stick from its base.
* Where -1 is to the left of the base and +1 is to the right.
* 
* @name Phaser.VirtualJoystick.Stick#x
* @property {number} x
* @readOnly
*/
Object.defineProperty(Phaser.VirtualJoystick.Stick.prototype, "x", {

    get: function () {

        if (this.line.angle >= 0)
        {
            if (this.line.angle <= 1.5707963267948966)
            {
                //   Bottom right (0 - 90)
                return (1.5707963267948966 - this.line.angle) / 1.5707963267948966;
            }
            else
            {
                //   Bottom left (90 - 180)
                return -1 + (((3.141592653589793 - this.line.angle) / 3.141592653589793) * 2);
            }
        }
        else
        {
            if (this.line.angle >= -1.5707963267948966)
            {
                //   Top right (0 to -90)
                return (Math.abs(-1.5707963267948966 - this.line.angle)) / 1.5707963267948966;
            }
            else
            {
                //   Top left (-90 to -180)
                return -1 + ((Math.abs(-3.141592653589793 - this.line.angle) / 3.141592653589793) * 2);
            }
        }

    }

});

/**
* The current y value of the joystick.
* 
* This is a value between -1 and 1 calculated based on the distance of the stick from its base.
* Where -1 is above the base and +1 is below the base.
* 
* @name Phaser.VirtualJoystick.Stick#y
* @property {number} y
* @readOnly
*/
Object.defineProperty(Phaser.VirtualJoystick.Stick.prototype, "y", {

    get: function () {

        if (this.line.angle >= 0)
        {
            //  Down
            return 1 - (Math.abs(1.5707963267948966 - this.line.angle) / 1.5707963267948966);
        }
        else
        {
            //  Up
            return -1 + (Math.abs(-1.5707963267948966 - this.line.angle) / 1.5707963267948966);
        }

    }

});

/**
* The filterX value is the forceX value adjusted to be used as the mouse input uniform for a filter.
* 
* This is a value between 0 and 1 where 0.5 is the center, i.e. the stick un-moved from its base.
*
* Use it in the update method like so:
*
* `filter.uniforms.mouse.value.x = this.stick.filterX;`
* `filter.uniforms.mouse.value.y = this.stick.filterY;`
* `filter.update();`
* 
* @name Phaser.VirtualJoystick.Stick#filterX
* @property {number} filterX
* @readOnly
*/
Object.defineProperty(Phaser.VirtualJoystick.Stick.prototype, "filterX", {

    get: function () {

        if (this.x === 0)
        {
            return 0.50;
        }
        else
        {
            var fx = Math.abs(this.forceX) / 2;

            if (this.x < 0)
            {
                return (0.5 - fx).toFixed(2);
            }
            else
            {
                return (0.5 + fx).toFixed(2);
            }
        }

    }

});

/**
* The filterY value is the forceY value adjusted to be used as the mouse input uniform for a filter.
* 
* This is a value between 0 and 1 where 0.5 is the center, i.e. the stick un-moved from its base.
*
* Use it in the update method like so:
*
* `filter.uniforms.mouse.value.x = this.stick.filterX;`
* `filter.uniforms.mouse.value.y = this.stick.filterY;`
* `filter.update();`
* 
* @name Phaser.VirtualJoystick.Stick#filterY
* @property {number} filterY
* @readOnly
*/
Object.defineProperty(Phaser.VirtualJoystick.Stick.prototype, "filterY", {

    get: function () {

        if (this.y === 0)
        {
            return 0.50;
        }
        else
        {
            var fy = Math.abs(this.forceY) / 2;

            if (this.y < 0)
            {
                return 1 - (0.5 - fy).toFixed(2);
            }
            else
            {
                return 1 - (0.5 + fy).toFixed(2);
            }
        }

    }

});

/**
* The alpha value of the Stick.
* 
* Adjusting this value changes the alpha property of both the base and stick sprites.
* Reading it reads the alpha value of the stick sprite alone.
*
* If you need to give the base and stick sprites *different* alpha values then you can access them directly:
*
* `stick.baseSprite.alpha` and `stick.stickSprite.alpha`.
* 
* @name Phaser.VirtualJoystick.Stick#alpha
* @property {number} alpha
*/
Object.defineProperty(Phaser.VirtualJoystick.Stick.prototype, "alpha", {

    get: function () {

        return this.stickSprite.alpha;

    },

    set: function (value) {

        this.stickSprite.alpha = value;
        this.baseSprite.alpha = value;

    }

});

/**
* The visible state of the Stick.
* 
* Adjusting this value changes the visible property of both the base and stick sprites.
* Reading it reads the visible value of the stick sprite alone.
*
* Note that this stick will carry on processing and dispatching events even when not visible.
* If you wish to disable the stick from processing events see `Stick.enabled`.
*
* If you need to give the base and stick sprites *different* visible values then you can access them directly:
*
* `stick.baseSprite.visible` and `stick.stickSprite.visible`.
* 
* @name Phaser.VirtualJoystick.Stick#visible
* @property {number} visible
*/
Object.defineProperty(Phaser.VirtualJoystick.Stick.prototype, "visible", {

    get: function () {

        return this.stickSprite.visible;

    },

    set: function (value) {

        this.stickSprite.visible = value;
        this.baseSprite.visible = value;

    }

});

/**
* The distance in pixels that the stick needs to move from the base before it's at 'full force'.
* 
* This value is adjusted for scale.
* 
* It should never be less than the `Stick.deadZone` value.
* 
* @name Phaser.VirtualJoystick.Stick#distance
* @property {number} distance
*/
Object.defineProperty(Phaser.VirtualJoystick.Stick.prototype, "distance", {

    get: function () {

        return this._distance * this._scale;

    },

    set: function (value) {

        if (this._distance !== value)
        {
            this._distance = value;
        }

    }

});

/**
* The dead zone is a distance in pixels within which the Stick isn't considered as down or moving.
* Only when it moves beyond this value does it start dispatching events.
* 
* By default the deadZone is 15% of the given distance value. 
* So if the distance is 100 pixels then the Stick won't be considered as active until it has moved at least 15 pixels from its base.
* 
* This value is adjusted for scale.
* 
* It should never be more than the `Stick.distance` value.
* 
* @name Phaser.VirtualJoystick.Stick#deadZone
* @property {number} deadZone
*/
Object.defineProperty(Phaser.VirtualJoystick.Stick.prototype, "deadZone", {

    get: function () {

        return this._deadZone * this._scale;

    },

    set: function (value) {

        this._deadZone = value;

    }

});

/**
* The scale of the Stick. The scale is applied evenly to both the x and y axis of the Stick.
* You cannot specify a different scale per axis.
* 
* Adjusting this value changes the scale of both the base and stick sprites and recalculates all of the hit areas.
*
* The base and stick sprites must have the same scale.
* 
* @name Phaser.VirtualJoystick.Stick#scale
* @property {number} scale
*/
Object.defineProperty(Phaser.VirtualJoystick.Stick.prototype, "scale", {

    get: function () {

        return this._scale;

    },

    set: function (value) {

        if (this._scale !== value)
        {
            this.stickSprite.scale.set(value);
            this.baseSprite.scale.set(value);

            this.baseHitArea.setTo(this.position.x, this.position.y, this.distance * value);
            this.stickHitArea.setTo(this.position.x, this.position.y, this.stickSprite.width);

            this._scale = value;
        }

    }

});

/**
* A Stick that is set to `showOnTouch` will have `visible` set to false until the player presses on the screen.
* When this happens the Stick is centered on the x/y coordinate of the finger and can be immediately dragged for movement.
* 
* @name Phaser.VirtualJoystick.Stick#showOnTouch
* @property {boolean} showOnTouch
*/
Object.defineProperty(Phaser.VirtualJoystick.Stick.prototype, "showOnTouch", {

    get: function () {

        return this._showOnTouch;

    },

    set: function (value) {

        if (this._showOnTouch !== value)
        {
            this._showOnTouch = value;

            if (this._showOnTouch && this.visible)
            {
                this.visible = false;
            }
        }

    }

});

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link http://choosealicense.com/licenses/no-license/|No License}
*/

/**
 * A `Button` is a virtual button. It belongs to a parent `Pad` object which is responsible for creating and updating it.
 *
 * Create a new button by using the `Pad.addButton` method.
 * 
 * It consists of one sprite with two frames. One frame depicts the button as it's held down, the other when up.
 *
 * The Button sprite is added to `Game.Stage`, which is always above `Game.World` in which all other Sprites and display objects live.
 *
 * The Button is digital, i.e. it is either 'on or off'. It doesn't have a pressure or force associated with it.
 *
 * @class Phaser.VirtualJoystick.Button
 * @constructor
 * @param {Phaser.VirtualJoystick.Pad} pad - The Virtual Pad that this Button belongs to.
 * @param {integer} shape - The shape of the buttons hit area. Either Phaser.VirtualJoystick.CIRC_BUTTON or Phaser.VirtualJoystick.RECT_BUTTON.
 * @param {number} x - The x coordinate to draw the button at. The button is centered on this coordinate.
 * @param {number} y - The y coordinate to draw the button at. The button is centered on this coordinate.
 * @param {string} texture - The Phaser.Cache key of the texture atlas to be used to render this button.
 * @param {string} upFrame - The name of the frame within the button texture atlas to be used when the button is in an 'up' state.
 * @param {string} downFrame - The name of the frame within the button texture atlas to be used when the button is in a 'down' state.
 */
Phaser.VirtualJoystick.Button = function (pad, shape, x, y, texture, upFrame, downFrame) {

    /**
    * @property {Phaser.VirtualJoystick.Pad} pad - A reference to the Virtual Pad that this Joystick belongs to.
    */
    this.pad = pad;

    /**
    * @property {string} upFrame - The name of the frame within the button texture atlas to be used when the button is in an 'up' state.
    */
    this.upFrame = upFrame;

    /**
    * @property {string} downFrame - The name of the frame within the button texture atlas to be used when the button is in a 'down' state.
    */
    this.downFrame = downFrame;

    /**
    * @property {Phaser.Sprite} sprite - The Sprite that is used to display this button.
    */
    this.sprite = this.pad.game.make.sprite(x, y, texture, upFrame);
    this.sprite.anchor.set(0.5);

    /**
    * @property {Phaser.Circle|Phaser.Rectangle} hitArea - The hit area of the button in which input events will be detected.
    */
    if (shape === Phaser.VirtualJoystick.CIRC_BUTTON)
    {
        this.hitArea = new Phaser.Circle(this.sprite.x, this.sprite.y, this.sprite.width);
    }
    else if (shape === Phaser.VirtualJoystick.RECT_BUTTON)
    {
        this.hitArea = new Phaser.Rectangle(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height);
    }

    /**
    * @property {Phaser.Pointer} pointer - A reference to the Input Pointer being used to update this button.
    * @protected
    */
    this.pointer = null;

    /**
    * @property {boolean} enabled - Should this button process or dispatch any events? Set to `false` to disable it.
    * @default
    */
    this.enabled = true;

    /**
    * The current down state of this button. A button is determined as being down if it has been pressed.
    * @property {boolean} isDown
    * @protected
    */
    this.isDown = false;

    /**
    * The current up state of this button. A button is determined as being up if it is not being pressed.
    * @property {boolean} isUp
    * @protected
    */
    this.isUp = true;

    /**
    * The onDown signal is dispatched as soon as the button is touched, or clicked when under mouse emulation.
    * 
    * When this signal is dispatched it sends 2 parameters: this button and the Phaser.Pointer object that caused the event:
    * `onDown(Phaser.VirtualJoystick.Button, Phaser.Pointer)`
    *
    * If you have added a Key to this button via `addKey` and that is pressed, the signal will send the Phaser.Key as the second
    * parameter instead of a Phaser.Pointer object.
    * 
    * @property {Phaser.Signal} onDown
    */
    this.onDown = new Phaser.Signal();

    /**
    * The onUp signal is dispatched as soon as the button is released.
    * 
    * When this signal is dispatched it sends 3 parameters: 
    * this button, the Phaser.Pointer object that caused the event and the duration the button was down for:
    * `onUp(Phaser.VirtualJoystick.Button, Phaser.Pointer, duration)`
    *
    * If you have added a Key to this button via `addKey` and that is released, the signal will send the Phaser.Key as the second
    * parameter instead of a Phaser.Pointer object.
    * 
    * @property {Phaser.Signal} onUp
    */
    this.onUp = new Phaser.Signal();

    /**
    * @property {integer} timeDown - The time when the button last entered an `isDown` state.
    * @readOnly
    */
    this.timeDown = 0;

    /**
    * @property {integer} timeUp - The time when the button last entered an `isUp` state.
    * @readOnly
    */
    this.timeUp = 0;

    /**
    * The repeatRate allows you to set how often this button fires the `onDown` signal.
    * At the default setting of zero Button.onDown will be sent only once.
    * No more signals will be sent until the button is released and pressed again.
    *
    * By setting repeatRate to a value above zero you can control the time delay in milliseconds between each onDown signal.
    *
    * For example: `button.repeatRate = 100` would send the onDown signal once every 100ms for as long as the button is held down.
    *
    * To disable a repeat rate set the value back to zero again.
    * 
    * @property {integer} repeatRate
    * @default
    */
    this.repeatRate = 0;

    /**
    * The key that is bound to this button. Pressing it activates the button the same way as clicking does.
    * It is set via `Button.addKey`.
    * @property {Phaser.Key} key
    * @default
    */
    this.key = null;

    /**
    * @property {number} _timeNext - Internal calculation var.
    * @private
    */
    this._timeNext = 0;

    /**
    * @property {number} _scale - Internal calculation var.
    * @private
    */
    this._scale = 1;

    this.pad.game.stage.addChild(this.sprite);

    this.pad.game.input.onDown.add(this.checkDown, this);
    this.pad.game.input.onUp.add(this.checkUp, this);

};

Phaser.VirtualJoystick.Button.prototype = {

    /**
     * You can bind a Keyboard key to this button, so that when the key is pressed the button is activated.
     *
     * Obviously you only want to do this on desktop browsers, but it allows you to minimise your code quantity.
     *
     * When the Key is pressed the Button.onDown signal is dispatched.
     *
     * @method Phaser.VirtualJoystick.Button#addKey
     * @param {integer} keycode - The Phaser.Keyboard const, for example Phaser.Keyboard.CONTROL.
     * @return {Phaser.Key} The Key object bound to this button.
     */
    addKey: function (keycode) {

        if (this.key)
        {
            if (this.key.keyCode === keycode)
            {
                return false;
            }

            this.key.onDown.removeAll();
            this.key.onUp.removeAll();

            this.pad.game.input.keyboard.removeKey(this.key);

            this.key = null;
        }

        if (keycode)
        {
            this.key = this.pad.game.input.keyboard.addKey(keycode);
            this.key.onDown.add(this.keyDown, this);
            this.key.onUp.add(this.keyUp, this);
        }

        return this.key;

    },

    /**
     * The Phaser.Key.onDown callback. Processes the down event for this button.
     *
     * @method Phaser.VirtualJoystick.Button#keyDown
     * @private
     */
    keyDown: function () {

        if (!this.isDown)
        {
            this.sprite.frameName = this.downFrame;

            this.isDown = true;
            this.isUp = false;
            this.timeDown = this.pad.game.time.time;
            this.timeUp = 0;

            this.onDown.dispatch(this, this.key);
        }

    },

    /**
     * The Phaser.Key.onUp callback. Processes the down event for this button.
     *
     * @method Phaser.VirtualJoystick.Button#keyUp
     * @private
     */
    keyUp: function () {

        if (this.isDown)
        {
            this.sprite.frameName = this.upFrame;

            this.isDown = false;
            this.isUp = true;

            this.timeUp = this.pad.game.time.time;

            this.onUp.dispatch(this, this.key, this.duration);
        }

    },

    /**
     * The Input.onDown callback. Processes the down event for this button.
     *
     * @method Phaser.VirtualJoystick.Button#checkDown
     * @private
     * @param {Phaser.Pointer} pointer - The Phaser Pointer that triggered the event.
     */
    checkDown: function (pointer) {

        if (this.enabled && this.isUp && this.hitArea.contains(pointer.x, pointer.y))
        {
            this.pointer = pointer;
            this.sprite.frameName = this.downFrame;

            this.isDown = true;
            this.isUp = false;

            this.timeDown = this.pad.game.time.time;
            this.timeUp = 0;

            this.onDown.dispatch(this, pointer);
        }

    },

    /**
     * The Input.onUp callback. Processes the up event for this button.
     *
     * @method Phaser.VirtualJoystick.Button#checkUp
     * @private
     * @param {Phaser.Pointer} pointer - The Phaser Pointer that triggered the event.
     */
    checkUp: function (pointer) {

        if (pointer === this.pointer)
        {
            this.pointer = null;
            this.sprite.frameName = this.upFrame;

            this.isDown = false;
            this.isUp = true;

            this.timeUp = this.pad.game.time.time;

            this.onUp.dispatch(this, pointer, this.duration);
        }

    },

    /**
     * The update callback. This is called automatically by the Pad parent.
     *
     * @method Phaser.VirtualJoystick.Button#update
     * @private
     */
    update: function () {

        if (this.repeatRate > 0 && this.isDown && this.pad.game.time.time >= this._timeNext)
        {
            this.onDown.dispatch(this, this.pointer);
            this._timeNext = this.pad.game.time.time + this.repeatRate;
        }

    },

    /**
     * Visually aligns the button to the bottom left of the game view.
     * The optional spacing parameter allows you to add a border between the edge of the game and the button.
     *
     * @method Phaser.VirtualJoystick.Button#alignBottomLeft
     * @param {number} [spacing=0] - The spacing to apply between the edge of the game and the button.
     */
    alignBottomLeft: function (spacing) {

        if (typeof spacing === 'undefined') { spacing = 0; }

        var w = (this.sprite.width / 2) + spacing;
        var h = (this.sprite.height / 2) + spacing;

        this.posX = w;
        this.posY = this.pad.game.height - h;

    },

    /**
     * Visually aligns the button to the bottom right of the game view.
     * The optional spacing parameter allows you to add a border between the edge of the game and the button.
     *
     * @method Phaser.VirtualJoystick.Button#alignBottomRight
     * @param {number} [spacing=0] - The spacing to apply between the edge of the game and the button.
     */
    alignBottomRight: function (spacing) {

        if (typeof spacing === 'undefined') { spacing = 0; }

        var w = (this.sprite.width / 2) + spacing;
        var h = (this.sprite.height / 2) + spacing;

        this.posX = this.pad.game.width - w;
        this.posY = this.pad.game.height - h;

    },

    /**
     * Destroys this Button.
     * 
     * Removes all associated event listeners and signals and calls destroy on the button sprite.
     *
     * @method Phaser.VirtualJoystick.Button#destroy
     */
    destroy: function () {

        this.pad.game.input.onDown.remove(this.checkDown, this);
        this.pad.game.input.onUp.remove(this.checkUp, this);

        this.sprite.destroy();

        this.onDown.dispose();
        this.onUp.dispose();

        this.hitArea = null;

        this.pointer = null;

        this._scale = null;

        this.pad = null;

    }

};

/**
* The x coordinate the button is rendered at. Value should be given in pixel coordinates based on game dimensions.
* Use this to change the position of the button on-screen. Value can even be tweened to display or hide the button in interesting ways.
* 
* @name Phaser.VirtualJoystick.Button#posX
* @property {number} posX
*/
Object.defineProperty(Phaser.VirtualJoystick.Button.prototype, "posX", {

    get: function () {

        return this.sprite.x;

    },

    set: function (x) {

        if (this.sprite.x !== x)
        {
            this.sprite.x = x;
            this.hitArea.x = x;
        }

    }

});

/**
* The y coordinate the button is rendered at. Value should be given in pixel coordinates based on game dimensions.
* Use this to change the position of the button on-screen. Value can even be tweened to display or hide the button in interesting ways.
* 
* @name Phaser.VirtualJoystick.Button#posY
* @property {number} posY
*/
Object.defineProperty(Phaser.VirtualJoystick.Button.prototype, "posY", {

    get: function () {

        return this.sprite.y;

    },

    set: function (y) {

        if (this.sprite.y !== y)
        {
            this.sprite.y = y;
            this.hitArea.y = y;
        }

    }

});

/**
* The alpha value of the Button.
* 
* Adjusting this value changes the alpha property of button sprite.
* 
* @name Phaser.VirtualJoystick.Button#alpha
* @property {number} alpha
*/
Object.defineProperty(Phaser.VirtualJoystick.Button.prototype, "alpha", {

    get: function () {

        return this.sprite.alpha;

    },

    set: function (value) {

        this.sprite.alpha = value;

    }

});

/**
* The visible state of the Button.
* 
* Adjusting this value changes the visible property of the button sprite.
*
* Note that this button will carry on processing and dispatching events even when not visible.
* If you wish to disable the button from processing events see `Button.enabled`.
* 
* @name Phaser.VirtualJoystick.Button#visible
* @property {number} visible
*/
Object.defineProperty(Phaser.VirtualJoystick.Button.prototype, "visible", {

    get: function () {

        return this.sprite.visible;

    },

    set: function (value) {

        this.sprite.visible = value;

    }

});

/**
* The scale of the Button. The scale is applied evenly to both the x and y axis of the Button.
* You cannot specify a different scale per axis.
* 
* Adjusting this value changes the scale of the button sprite and recalculates the hit area.
* 
* @name Phaser.VirtualJoystick.Button#scale
* @property {number} scale
*/
Object.defineProperty(Phaser.VirtualJoystick.Button.prototype, "scale", {

    get: function () {

        return this._scale;

    },

    set: function (value) {

        if (this._scale !== value)
        {
            this.sprite.scale.set(value);

            this.hitArea.setTo(this.sprite.x, this.sprite.y, this.sprite.width);

            this._scale = value;
        }

    }

});

/**
* The duration in milliseconds that the Button has been held down for.
* If the button is not currently in an `onDown` state it returns the duration the button was previously held down for.
* If the button is in an `onDown` state it returns the current duration in ms.
* 
* @name Phaser.VirtualJoystick.Button#duration
* @property {integer} duration
* @readOnly
*/
Object.defineProperty(Phaser.VirtualJoystick.Button.prototype, "duration", {

    get: function () {

        if (this.isUp)
        {
            return this.timeUp - this.timeDown;
        }

        return this.game.time.time - this.timeDown;

    }

});

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link http://choosealicense.com/licenses/no-license/|No License}
*/

/**
 * A `DPad` is a virtual joystick. It belongs to a parent `Pad` object which is responsible for creating and updating it.
 *
 * Create a new dpad by using the `Pad.addDPad` method.
 *
 * While the Stick class creates an analogue joystick, the DPad one creates a digital joystick. The difference is that a digital joystick
 * is either "on" or "off" in any given direction. There is no pressure or degree of force in any direction, it's either moving or it isn't.
 * This is the same as the way in which NES style game pads work. The "D" stands for "Direction".
 *
 * Unlike the Stick class the DPad can use a different frame from the texture atlas for each of the 4 directions in which it can move.
 *
 * The DPad can either be on-screen all the time, positioned via the `posX` and `posY` setters. Or you can have it only appear when the
 * player touches the screen by setting `showOnTouch` to true.
 *
 * The DPad sprite is added to `Game.Stage`, which is always above `Game.World` in which all other Sprites and display objects live.
 *
 * @class Phaser.VirtualJoystick.DPad
 * @constructor
 * @param {Phaser.VirtualJoystick.Pad} pad - The Virtual Pad that this Joystick belongs to.
 * @param {number} x - The x coordinate to draw the joystick at. The joystick is centered on this coordinate.
 * @param {number} y - The y coordinate to draw the joystick at. The joystick is centered on this coordinate.
 * @param {number} distance - The distance threshold between the stick and the base. This is how far the stick can be pushed in any direction.
 * @param {string} texture - The Phaser.Cache key of the texture atlas to be used to render this joystick.
 * @param {string} [neutralFrame=neutral] - The name of the frame within the texture atlas that contains the 'neutral' state of the dpad. Neutral is the state when the dpad isn't moved at all.
 * @param {string} [upFrame=up] - The name of the frame within the texture atlas that contains the 'up' state of the dpad.
 * @param {string} [downFrame=down] - The name of the frame within the texture atlas that contains the 'down' state of the dpad.
 * @param {string} [leftFrame=left] - The name of the frame within the texture atlas that contains the 'left' state of the dpad.
 * @param {string} [rightFrame=right] - The name of the frame within the texture atlas that contains the 'right' state of the dpad.
 */
Phaser.VirtualJoystick.DPad = function (pad, x, y, distance, texture, neutralFrame, upFrame, downFrame, leftFrame, rightFrame) {

    /**
    * @property {Phaser.VirtualJoystick.Pad} pad - A reference to the Virtual Pad that this Joystick belongs to.
    */
    this.pad = pad;

    /**
    * @property {string} neutralFrame - The name of the frame within the texture atlas that contains the 'neutral' state of the dpad. Neutral is the state when the dpad isn't moved at all.
    */
    this.neutralFrame = neutralFrame;

    /**
    * @property {string} upFrame - The name of the frame within the texture atlas that contains the 'up' state of the dpad.
    */
    this.upFrame = upFrame;

    /**
    * @property {string} downFrame - The name of the frame within the texture atlas that contains the 'down' state of the dpad.
    */
    this.downFrame = downFrame;

    /**
    * @property {string} leftFrame - The name of the frame within the texture atlas that contains the 'left' state of the dpad.
    */
    this.leftFrame = leftFrame;

    /**
    * @property {string} rightFrame - The name of the frame within the texture atlas that contains the 'right' state of the dpad.
    */
    this.rightFrame = rightFrame;

    /**
    * @property {Phaser.Point} position - The position of the dpad in screen coordinates. To adjust please use `posX` and `posY`.
    * @protected
    */
    this.position = new Phaser.Point(x, y);

    /**
    * @property {Phaser.Line} line - The line object used for stick to base calculations.
    * @protected
    */
    this.line = new Phaser.Line(this.position.x, this.position.y, this.position.x, this.position.y);

    /**
    * @property {Phaser.Sprite} sprite - The Sprite that is used to display the dpad.
    */
    this.sprite = this.pad.game.make.sprite(x, y, texture, neutralFrame);
    this.sprite.anchor.set(0.5);

    /**
    * @property {Phaser.Circle} baseHitArea - The circular hit area that defines the base of the dpad.
    */
    this.baseHitArea = new Phaser.Circle(this.position.x, this.position.y, distance);

    /**
    * @property {Phaser.Circle} stickHitArea - The circular hit area that defines the stick or handle of the dpad.
    */
    this.stickHitArea = new Phaser.Circle(this.position.x, this.position.y, this.sprite.width);

    /**
    * @property {Phaser.Point} limitPoint - A Point object that holds the stick limits.
    * @protected
    */
    this.limitPoint = new Phaser.Point();

    /**
    * @property {Phaser.Pointer} pointer - A reference to the Input Pointer being used to update this dpad.
    * @protected
    */
    this.pointer = null;

    /**
    * @property {boolean} enabled - Should this dpad process or dispatch any events? Set to `false` to disable it.
    * @default
    */
    this.enabled = true;

    /**
    * The current down state of this dpad. A dpad is determined as being down if it has been pressed and interacted with.
    * If it has a `deadZone` set then it's not considered as being down unless it has moved beyond the limits of the deadZone.
    * @property {boolean} isDown
    * @protected
    */
    this.isDown = false;

    /**
    * The current up state of this dpad. A dpad is determined as being up if it is not being interacted with.
    * If it has a `deadZone` set then it's considered as being up until it has moved beyond the limits of the deadZone.
    * @property {boolean} isUp
    * @protected
    */
    this.isUp = true;

    /**
    * The onDown signal is dispatched as soon as the dpad is touched, or clicked when under mouse emulation.
    * If it has a `deadZone` set then it's not dispatched until it has moved beyond the limits of the deadZone.
    * When this signal is dispatched it sends 2 parameters: this DPad and the Phaser.Pointer object that caused the event:
    * `onDown(Phaser.VirtualJoystick.DPad, Phaser.Pointer)`
    * 
    * @property {Phaser.Signal} onDown
    */
    this.onDown = new Phaser.Signal();

    /**
    * The onUp signal is dispatched as soon as the dpad is released, having previously been in an `isDown` state.
    * When this signal is dispatched it sends 2 parameters: this DPad and the Phaser.Pointer object that caused the event:
    * `onUp(Phaser.VirtualJoystick.DPad, Phaser.Pointer)`
    * 
    * @property {Phaser.Signal} onUp
    */
    this.onUp = new Phaser.Signal();

    /**
    * The onMove signal is dispatched whenever the dpad is moved as a result of a device Touch movement event.
    * When this signal is dispatched it sends 3 parameters: this DPad and the `x` and `y` values:
    * `onMove(Phaser.VirtualJoystick.DPad, x, y)`
    * This signal is only dispatched when a touch move event is received, even if the dpad is held down in a specific direction.
    * If you wish to constantly check the position of the dpad then you should use the `onUpdate` signal instead of `onMove`.
    * 
    * @property {Phaser.Signal} onMove
    */
    this.onMove = new Phaser.Signal();

    /**
    * The onUpdate signal is dispatched constantly for as long as the dpad is in an `isDown` state.
    * When this signal is dispatched it sends 3 parameters: this DPad and the `x` and `y` values:
    * `onUpdate(Phaser.VirtualJoystick.DPad, x, y)`
    * This is a high frequency signal so be careful what is bound to it. If there are computationally cheaper ways of 
    * reacting to this dpads movement then you should explore them (such as polling DPad.x/y within an update loop)
    * 
    * @property {Phaser.Signal} onUpdate
    */
    this.onUpdate = new Phaser.Signal();

    /**
    * @property {integer} timeDown - The time when the dpad last entered an `isDown` state.
    * @readOnly
    */
    this.timeDown = 0;

    /**
    * @property {integer} timeUp - The time when the dpad last entered an `isUp` state.
    * @readOnly
    */
    this.timeUp = 0;

    /**
    * @property {number} angle - The angle of the dpad in degrees. From -180 to 180 where zero is right-handed.
    * @readOnly
    */
    this.angle = 0;

    /**
    * @property {number} angleFull - The angle of the dpad in degrees. From 0 to 360 where zero is right-handed.
    * @readOnly
    */
    this.angleFull = 0;

    /**
    * The quadrant the dpad is in.
    * Where 315 to 45 degrees is quadrant 0. 
    * 45 to 135 degrees is quadrant 1. 
    * 135 to 225 degrees is quadrant 2.
    * 225 to 315 degrees is quadrant 3.
    * @property {integer} quadrant
    * @readOnly
    */
    this.quadrant = 0;

    /**
    * The nearest octant of the dpad. Where each octant is 360 degrees / 45.
    * @property {integer} octant
    * @readOnly
    */
    this.octant = 0;

    /**
    * The direction the dpad is currently pushed. 
    * If not touched it's Phaser.NONE, otherwise one of Phaser.LEFT, Phaser.RIGHT, Phaser.UP or Phaser.DOWN.
    * @property {integer} direction
    * @protected
    */
    this.direction = Phaser.NONE;

    /**
    * @property {number} _distance - Internal calculation var.
    * @private
    */
    this._distance = distance;

    /**
    * @property {number} _deadZone - Internal calculation var.
    * @private
    */
    this._deadZone = distance * 0.15;

    /**
    * @property {number} _scale - Internal calculation var.
    * @private
    */
    this._scale = 1;

    /**
    * @property {boolean} _tracking - Internal var.
    * @private
    */
    this._tracking = false;

    /**
    * @property {boolean} _showOnTouch - Internal var.
    * @private
    */
    this._showOnTouch = false;

    this.pad.game.stage.addChild(this.sprite);

    this.pad.game.input.onDown.add(this.checkDown, this);
    this.pad.game.input.onUp.add(this.checkUp, this);
    this.pad.game.input.addMoveCallback(this.moveStick, this);

};

Phaser.VirtualJoystick.DPad.prototype = {

    /**
     * The Input.onDown callback. Processes the down event for this dpad, or starts tracking if required.
     *
     * @method Phaser.VirtualJoystick.DPad#checkDown
     * @private
     * @param {Phaser.Pointer} pointer - The Phaser Pointer that triggered the event.
     */
    checkDown: function (pointer) {

        if (this.enabled && this.isUp)
        {
            this.pointer = pointer;

            this.line.end.copyFrom(pointer);

            if (this._showOnTouch)
            {
                this.line.start.copyFrom(pointer);
                this.posX = pointer.x;
                this.posY = pointer.y;
                this.visible = true;
                this.setDown();
            }
            else
            {
                if (this.stickHitArea.contains(pointer.x, pointer.y))
                {
                    if (this.line.length <= this.deadZone)
                    {
                        this._tracking = true;
                    }
                    else
                    {
                        this.setDown();
                        this.moveStick();
                    }
                }
            }
        }

    },

    /**
     * The Input.onUp callback. Processes the up event for this dpad.
     *
     * @method Phaser.VirtualJoystick.DPad#checkUp
     * @private
     * @param {Phaser.Pointer} pointer - The Phaser Pointer that triggered the event.
     */
    checkUp: function (pointer) {

        if (pointer === this.pointer)
        {
            this.pointer = null;

            this.stickHitArea.x = this.position.x;
            this.stickHitArea.y = this.position.y;

            this.sprite.frameName = this.neutralFrame;

            this.line.end.copyFrom(this.line.start);

            this.isDown = false;
            this.isUp = true;
            this.direction = Phaser.NONE;

            this.timeUp = this.pad.game.time.time;

            this.onUp.dispatch(this, pointer);

            if (this._showOnTouch)
            {
                this.visible = false;
            }
        }

    },

    /**
     * Internal down handler. Activated either onDown or after tracking if the dpad has a dead zone.
     *
     * @method Phaser.VirtualJoystick.DPad#setDown
     * @private
     */
    setDown: function () {

        this.isDown = true;
        this.isUp = false;
        this.timeDown = this.pad.game.time.time;
        this.timeUp = 0;

        this._tracking = false;
        
        this.checkArea();

        this.onDown.dispatch(this, this.pointer);

    },

    /**
     * Internal calculation method. Updates the various angle related properties.
     *
     * @method Phaser.VirtualJoystick.DPad#checkArea
     * @private
     */
    checkArea: function () {

        this.angle = this.pad.game.math.radToDeg(this.line.angle);
        this.angleFull = this.angle;

        if (this.angleFull < 0)
        {
            this.angleFull += 360;
        }

        this.octant = 45 * (Math.round(this.angleFull / 45));

        if (this.angleFull >= 45 && this.angleFull < 135)
        {
            this.quadrant = 1;
        }
        else if (this.angleFull >= 135 && this.angleFull < 225)
        {
            this.quadrant = 2;
        }
        else if (this.angleFull >= 225 && this.angleFull < 315)
        {
            this.quadrant = 3;
        }
        else
        {
            this.quadrant = 0;
        }

    },

    /**
     * The Input.onMove callback. Processes the movement event for this dpad.
     *
     * @method Phaser.VirtualJoystick.DPad#moveStick
     * @private
     */
    moveStick: function () {

        if (!this.pointer || (!this.isDown && !this._tracking))
        {
            this.direction = Phaser.NONE;
            this.sprite.frameName = this.neutralFrame;
            return;
        }

        this.line.end.copyFrom(this.pointer);

        this.checkArea();

        if (!this.isDown && this.line.length <= this.deadZone)
        {
            this.direction = Phaser.NONE;
            this.sprite.frameName = this.neutralFrame;
            return;
        }

        if (this._tracking)
        {
            //  Was tracking, now in the zone so dispatch and follow
            this.setDown();
        }

        if (this.line.length < this.baseHitArea.radius)
        {
            if (this.motionLock === Phaser.VirtualJoystick.NONE)
            {
                this.stickHitArea.x = this.pointer.x;
                this.stickHitArea.y = this.pointer.y;
            }
            else if (this.motionLock === Phaser.VirtualJoystick.HORIZONTAL)
            {
                this.stickHitArea.x = this.pointer.x;
            }
            else if (this.motionLock === Phaser.VirtualJoystick.VERTICAL)
            {
                this.stickHitArea.y = this.pointer.y;
            }
        }
        else
        {
            //  Let it smoothly rotate around the base limit
            this.baseHitArea.circumferencePoint(this.line.angle, false, this.limitPoint);

            if (this.motionLock === Phaser.VirtualJoystick.NONE)
            {
                this.stickHitArea.x = this.limitPoint.x;
                this.stickHitArea.y = this.limitPoint.y;
            }
            else if (this.motionLock === Phaser.VirtualJoystick.HORIZONTAL)
            {
                this.stickHitArea.x = this.limitPoint.x;
            }
            else if (this.motionLock === Phaser.VirtualJoystick.VERTICAL)
            {
                this.stickHitArea.y = this.limitPoint.y;
            }
        }

        if (this.quadrant === 1)
        {
            this.sprite.frameName = this.downFrame;
            this.direction = Phaser.DOWN;
        }
        else if (this.quadrant === 2)
        {
            this.sprite.frameName = this.leftFrame;
            this.direction = Phaser.LEFT;
        }
        else if (this.quadrant === 3)
        {
            this.sprite.frameName = this.upFrame;
            this.direction = Phaser.UP;
        }
        else
        {
            this.sprite.frameName = this.rightFrame;
            this.direction = Phaser.RIGHT;
        }

        this.onMove.dispatch(this, this.x, this.y);

    },

    /**
     * The update callback. This is called automatically by the Pad parent.
     *
     * @method Phaser.VirtualJoystick.DPad#update
     * @private
     */
    update: function () {

        if (this.isDown && !this._tracking)
        {
            this.onUpdate.dispatch(this, this.x, this.y);
        }

    },

    /**
     * Visually aligns the dpad to the bottom left of the game view.
     * The optional spacing parameter allows you to add a border between the edge of the game and the dpad.
     *
     * @method Phaser.VirtualJoystick.DPad#alignBottomLeft
     * @param {number} [spacing=0] - The spacing to apply between the edge of the game and the dpad.
     */
    alignBottomLeft: function (spacing) {

        if (typeof spacing === 'undefined') { spacing = 0; }

        var w = (this.sprite.width / 2) + spacing;
        var h = (this.sprite.height / 2) + spacing;

        this.posX = w;
        this.posY = this.pad.game.height - h;

    },

    /**
     * Visually aligns the dpad to the bottom right of the game view.
     * The optional spacing parameter allows you to add a border between the edge of the game and the dpad.
     *
     * @method Phaser.VirtualJoystick.DPad#alignBottomRight
     * @param {number} [spacing=0] - The spacing to apply between the edge of the game and the joystick.
     */
    alignBottomRight: function (spacing) {

        if (typeof spacing === 'undefined') { spacing = 0; }

        var w = (this.sprite.width / 2) + spacing;
        var h = (this.sprite.height / 2) + spacing;

        this.posX = this.pad.game.width - w;
        this.posY = this.pad.game.height - h;

    },

    /**
     * Destroys this dpad.
     * 
     * Removes all associated event listeners and signals and calls destroy on the dpad sprite.
     *
     * @method Phaser.VirtualJoystick.DPad#destroy
     */
    destroy: function () {

        this.pad.game.input.onDown.remove(this.checkDown, this);
        this.pad.game.input.onUp.remove(this.checkUp, this);

        var mc = this.pad.game.input.moveCallbacks;

        for (var i = 0; i < mc.length; i++)
        {
            if (mc.callback === this.moveStick && mc.context === this)
            {
                mc.splice(i, 1);
                break;
            }
        }

        this.sprite.destroy();

        this.stickHitArea = null;
        this.baseHitArea = null;
        this.line = null;
        this.limitPoint = null;

        this.onDown.dispose();
        this.onUp.dispose();

        this.pointer = null;

        this._scale = null;
        this.pad = null;

    },

    /**
     * Renders out a debug view of this DPad to the `Phaser.Debug` handler.
     *
     * It optionally renders the geometry involved in the dpad hit areas and calculation line.
     * 
     * It also optionally renders text information relating to the current forces and angles. The text is rendered
     * to the right of the dpad image unless an x parameter is specified.
     *
     * Because of the overhead of using Phaser.Debug in WebGL mode you should never enable this in a production game.
     * However for debugging it's extremely useful, hence why it's named `debug`.
     *
     * @method Phaser.VirtualJoystick.DPad#debug
     * @param {boolean} [sticks=true] - Renders the geometry involved in the stick hit areas and calculation line.
     * @param {boolean} [text=true] - Renders text information relating to the current forces and angles.
     * @param {number} [x] - The x coordinate to render the text properties to. If not given will default to the right of the joystick.
     */
    debug: function (sticks, text, x) {

        if (typeof sticks === 'undefined') { sticks = true; }
        if (typeof text === 'undefined') { text = true; }
        if (typeof x === 'undefined') { x = this.sprite.right; }

        var debug = this.pad.game.debug;

        if (sticks)
        {
            debug.context.lineWidth = 2;
            debug.geom(this.baseHitArea, 'rgba(255, 0, 0, 1)', false);
            debug.geom(this.stickHitArea, 'rgba(0, 255, 0, 1)', false);
            debug.geom(this.line, 'rgba(255, 255, 0, 1)');
            debug.context.lineWidth = 1;
        }

        if (text)
        {
            var shadow = debug.renderShadow;
            var tx = x;
            var ty = this.sprite.y - 48;

            debug.renderShadow = true;

            debug.text('X: ' + this.x, tx, ty);
            debug.text('Y: ' + this.y, tx, ty + 24);
            debug.text('Distance: ' + this.distance, tx, ty + 48);
            debug.text('Quadrant: ' + this.quadrant, tx, ty + 96);
            debug.text('Octant: ' + this.octant, tx, ty + 120);

            debug.renderShadow = shadow;
        }

    }

};

/**
* The rotation of the stick from its base in radians.
* Even though a DPad is locked to one of 4 fixed directions the rotation will always be accurate to the radian.
* 
* @name Phaser.VirtualJoystick.DPad#rotation
* @property {number} rotation
* @readOnly
*/
Object.defineProperty(Phaser.VirtualJoystick.DPad.prototype, "rotation", {

    get: function () {

        return this.line.angle;

    }

});

/**
* The x coordinate the dpad is rendered at. Value should be given in pixel coordinates based on game dimensions.
* Use this to change the position of the dpad on-screen. Value can even be tweened to display or hide the dpad in interesting ways.
* 
* @name Phaser.VirtualJoystick.DPad#posX
* @property {number} posX
*/
Object.defineProperty(Phaser.VirtualJoystick.DPad.prototype, "posX", {

    get: function () {

        return this.position.x;

    },

    set: function (x) {

        if (this.position.x !== x)
        {
            this.position.x = x;

            this.sprite.x = x;

            this.baseHitArea.x = x;
            this.stickHitArea.x = x;
            this.line.start.x = x;
            this.line.end.x = x;
        }

    }

});

/**
* The y coordinate the dpad is rendered at. Value should be given in pixel coordinates based on game dimensions.
* Use this to change the position of the dpad on-screen. Value can even be tweened to display or hide the dpad in interesting ways.
* 
* @name Phaser.VirtualJoystick.DPad#posY
* @property {number} posY
*/
Object.defineProperty(Phaser.VirtualJoystick.DPad.prototype, "posY", {

    get: function () {

        return this.position.y;

    },

    set: function (y) {

        if (this.position.y !== y)
        {
            this.position.y = y;

            this.sprite.y = y;

            this.baseHitArea.y = y;
            this.stickHitArea.y = y;
            this.line.start.y = y;
            this.line.end.y = y;
        }

    }

});

/**
* The current x value of the dpad.
*
* If the dpad is being held to the left it will return -1. If to the right it will return 1.
* If either not held at all, or not left or right, it will return 0.
* 
* @name Phaser.VirtualJoystick.DPad#x
* @property {number} x
* @readOnly
*/
Object.defineProperty(Phaser.VirtualJoystick.DPad.prototype, "x", {

    get: function () {

        if (this.direction === Phaser.LEFT)
        {
            return -1;
        }
        else if (this.direction === Phaser.RIGHT)
        {
            return 1;
        }
        else
        {
            return 0;
        }

    }

});

/**
* The current y value of the joystick.
* 
* If the dpad is being held up it will return -1. If down it will return 1.
* If either not held at all, or not up or down, it will return 0.
* 
* @name Phaser.VirtualJoystick.DPad#y
* @property {number} y
* @readOnly
*/
Object.defineProperty(Phaser.VirtualJoystick.DPad.prototype, "y", {

    get: function () {

        if (this.direction === Phaser.UP)
        {
            return -1;
        }
        else if (this.direction === Phaser.DOWN)
        {
            return 1;
        }
        else
        {
            return 0;
        }

    }

});

/**
* The alpha value of the dpad.
* 
* Adjusting this value changes the alpha property of dpad sprite.
* 
* @name Phaser.VirtualJoystick.DPad#alpha
* @property {number} alpha
*/
Object.defineProperty(Phaser.VirtualJoystick.DPad.prototype, "alpha", {

    get: function () {

        return this.sprite.alpha;

    },

    set: function (value) {

        this.sprite.alpha = value;

    }

});

/**
* The visible state of the dpad.
* 
* Adjusting this value changes the visible property of the dpad sprite.
*
* Note that this dpad will carry on processing and dispatching events even when not visible.
* If you wish to disable the dpad from processing events see `DPad.enabled`.
* 
* @name Phaser.VirtualJoystick.DPad#visible
* @property {number} visible
*/
Object.defineProperty(Phaser.VirtualJoystick.DPad.prototype, "visible", {

    get: function () {

        return this.sprite.visible;

    },

    set: function (value) {

        this.sprite.visible = value;

    }

});

/**
* The distance in pixels that the player needs to move their finger from the base before it's at 'full force'.
* 
* This value is adjusted for scale.
* 
* It should never be less than the `DPad.deadZone` value.
* 
* @name Phaser.VirtualJoystick.DPad#distance
* @property {number} distance
*/
Object.defineProperty(Phaser.VirtualJoystick.DPad.prototype, "distance", {

    get: function () {

        return this._distance * this._scale;

    },

    set: function (value) {

        if (this._distance !== value)
        {
            this._distance = value;
        }

    }

});

/**
* The dead zone is a distance in pixels within which the dpad isn't considered as down or moving.
* Only when it moves beyond this value does it start dispatching events.
* 
* By default the deadZone is 15% of the given distance value. 
* So if the distance is 100 pixels then the dpad won't be considered as active until it has moved at least 15 pixels from its base.
* 
* This value is adjusted for scale.
* 
* It should never be more than the `DPad.distance` value.
* 
* @name Phaser.VirtualJoystick.DPad#deadZone
* @property {number} deadZone
*/
Object.defineProperty(Phaser.VirtualJoystick.DPad.prototype, "deadZone", {

    get: function () {

        return this._deadZone * this._scale;

    },

    set: function (value) {

        this._deadZone = value;

    }

});

/**
* The scale of the dpad. The scale is applied evenly to both the x and y axis of the dpad.
* You cannot specify a different scale per axis.
* 
* Adjusting this value changes the scale of the base sprite and recalculates all of the hit areas.
* 
* @name Phaser.VirtualJoystick.DPad#scale
* @property {number} scale
*/
Object.defineProperty(Phaser.VirtualJoystick.DPad.prototype, "scale", {

    get: function () {

        return this._scale;

    },

    set: function (value) {

        if (this._scale !== value)
        {
            this.sprite.scale.set(value);

            this.baseHitArea.setTo(this.position.x, this.position.y, this.distance * value);
            this.stickHitArea.setTo(this.position.x, this.position.y, this.sprite.width);

            this._scale = value;
        }

    }

});

/**
* A dpad that is set to `showOnTouch` will have `visible` set to false until the player presses on the screen.
* When this happens the dpad is centered on the x/y coordinate of the finger and can be immediately dragged for movement.
* 
* @name Phaser.VirtualJoystick.DPad#showOnTouch
* @property {boolean} showOnTouch
*/
Object.defineProperty(Phaser.VirtualJoystick.DPad.prototype, "showOnTouch", {

    get: function () {

        return this._showOnTouch;

    },

    set: function (value) {

        if (this._showOnTouch !== value)
        {
            this._showOnTouch = value;

            if (this._showOnTouch && this.visible)
            {
                this.visible = false;
            }
        }

    }

});
