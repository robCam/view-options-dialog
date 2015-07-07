/**
 * Global variable contains the app.
 * @module RCAM
 */
var RCAM = RCAM || {};

/**
 * Object container to hold custom interactive widgets.
 * @module RCAM.widgets
 */
RCAM.widgets = RCAM.widgets || {};

/**
 * Constructs a custom interactive Button.
 *
 * @class Button
 * @constructor
 * @namespace RCAM.widgets
 * @requires RCAM.utils, RCAM.param
 * @param {Object} el A reference for the button element in the DOM.
 * @param {Object} styles The css stylenames for hover and active states.
 * @param {Object} options The custom configuration options.
 * @example
        var aButton = new RCAM.widgets.Button('.button', {
            hoverStateStyle  : 'button--hover',
            activeStateStyle : 'button--active'
        }, {
            persistActiveState : true,
            perimeterDelta : 50,
            onPointerEndCallback: function() {
                ...
            }
        });
 */
RCAM.widgets.Button = (function (global) {

    'use strict';

    /*jslint nomen:true*/

    var param = RCAM.param,
        utils = RCAM.utils,
        win   = global.window,
        doc   = global.document,
        nextFrame = win.requestAnimFrame;

    function Button(el, styles, options) {


        // Ensure the constructor is new-agnostic
        // Checks the receiver value is a proper instance of Button.
        // This ensures no error if instantiated without 'new' keyword.

        if (!(this instanceof Button)) {
            return new Button(el, styles, options);
        }

        /**
         * Holds a reference to the css style to use
         * for the buttons hover state.
         *
         * @property hoverStateStyle
         * @type String
         * @required
         */
        this.hoverStateStyle = styles.hoverStateStyle;

        /**
         * Holds a reference to the css style to use
         * for the buttons active state.
         *
         * @property activeStateStyle
         * @type String
         * @optional
         */
        this.activeStateStyle = styles.activeStateStyle;

        /**
         * Object containing the default configuration options.
         * These defults are used when no options are provided
         *
         * at intantiation.
         * @property options
         * @type Object
         */
        this.options = {

            /**
             * Used to determine whether the active state is 
             * indicated after the button is pressed.
             *
             * @property persistActiveState
             * @default true
             * @type Boolean
             */
            persistActiveState : true,

            /**
             * A callback can be passed in at invocation
             * which will be fired when the button is released.
             *
             * @property onPointerEndCallback
             * @default undefined
             * @type Function
             * @example
                var aButton = new RCAM.widgets.Button('.button', {
                    hoverStateStyle  : 'button--hover',
                    activeStateStyle : 'button--active'
                }, {
                    // Callback can be passed in at invocation.
                    onPointerEndCallback: function() {
                        alert('The button has been clicked');
                    }
                });  
             */
            onPointerEndCallback : undefined,

            /**
             * Used to further extend the perimeter of the button
             * bounds. The default unit is pixels.
             *
             * @property perimeterDelta
             * @default 30
             * @type Number
             */
            perimeterDelta : 30
        };


        // Merge/replace the user defined options
        this._extend(this.options, options);

        // Normalise 'persistActiveState' state
        this.options.persistActiveState = this.activeStateStyle === undefined ? false : this.options.persistActiveState;

        /**
         * The DOM node.
         * @property el
         * @type Object
         */
        this.el = typeof el === 'string' ? doc.querySelector(el) : el;

        /**
         * Contains a reference to the buttons perimeter bounds:
         * top, right, bottom, left, width, and height.
         * @property bounds
         * @type Object
         */
        this.bounds = this._getBounds();

        /**
         * Indicates whether the pointer mechanism
         * (mouse or touch) is down:
         * @property pointerIsDown
         * @default false
         * @type Boolean
         */
        this.pointerIsDown = false;

        /**
         * Indicates whether the pointer mechanism
         * (mouse or touch) is within the button bounds.
         * @property pointerIsInBounds
         * @default false
         * @type Boolean
         */
        this.pointerIsInBounds = false;

        // Attach initial event listeners
        this.el.addEventListener(param.pointerStart, this, false);
        win.addEventListener(param.resizeEvent, this, false);
    }

    Button.prototype = {

        constructor: Button,

        /**
         * Handles events when they are fired.
         * @method handleEvent
         * @param {Object} e The event being fired
         */
        handleEvent : function (e) {
            switch (e.type) {
            case param.pointerStart:
                this._onStart(e);
                break;
            case param.pointerMove:
                this._onMove(e);
                break;
            case param.pointerEnd:
            case param.pointerCancel:
                this._onEnd(e);
                break;
            case param.resizeEvent:
                this._resize(e);
                break;
            }
        },

        /**
         * Called when a pointer or touch event starts.
         * @method _onStart
         * @param {Object} e 'touchstart' or 'mousedown' event
         * @private
         */
        _onStart : function (e) {
            var docOrButton = param.hasTouch ? this.el : doc;

            this.pointerIsDown = true;
            this.pointerIsInBounds = true;

            utils.addClass(this.el, this.hoverStateStyle);

            docOrButton.addEventListener(param.pointerMove, this, false);
            docOrButton.addEventListener(param.pointerEnd, this, false);
            docOrButton.addEventListener(param.pointerCancel, this, false);
            this.el.removeEventListener(param.pointerStart, this, false);

            e.preventDefault();
            e.stopPropagation();
        },

        /**
         * Called when a pointer or touch event moves.
         * @method _onMove
         * @param {Object} e 'touchmove' or 'mousemove' event
         * @private 
         */
        _onMove : function (e) {
            if (!this.pointerIsDown) { return; }

            var point = param.hasTouch ? e.touches[0] : e;

            this.el.removeEventListener(param.pointerStart, this, false);

            this._handleMove(point.pageX, point.pageY);

            e.preventDefault();
            e.stopPropagation();
        },

        /**
         * Called when a pointer or touch event moves.
         * @method _handleMove
         * @param {Object} x The pointers current pageX position
         * @param {Object} y The pointers current pageY position
         * @private 
         */
        _handleMove : function (x, y) {
            if (x < this.bounds.left      ||
                    x > this.bounds.right ||
                    y < this.bounds.top   ||
                    y > this.bounds.bottom) {

                this.pointerIsInBounds = false;
                utils.removeClass(this.el, this.hoverStateStyle);

            } else {
                this.pointerIsInBounds = true;
                utils.addClass(this.el, this.hoverStateStyle);
            }
        },

        /**
         * Called when a pointer or touch event ends.
         * @method _onEnd
         * @param {Object} e 'touchend' or 'mouseup' event
         * @private
         */
        _onEnd : function (e) {

            var docOrButton = param.hasTouch ? this.el : doc;

            this.pointerIsDown = false;

            utils.removeClass(this.el, this.hoverStateStyle);

            this.el.addEventListener(param.pointerStart, this, false);
            docOrButton.removeEventListener(param.pointerEnd, this, false);
            docOrButton.removeEventListener(param.pointerCancel, this, false);
            docOrButton.removeEventListener(param.pointerMove, this, false);

            if (this.options.persistActiveState && this.pointerIsInBounds) {
                this.setStateActive();
            }

            if (this.options.onPointerEndCallback && this.pointerIsInBounds) {
                this.options.onPointerEndCallback.call(this);
            }

            this.pointerIsInBounds = false;

            e.preventDefault();
            e.stopPropagation();
        },

        /**
         * Enumerate properties of the 'source' object and copy to the 'target'.
         * @method _extend
         * @param {Object} target The target object reference
         * @param {Object} source the source object reference
         * @private
         */
        _extend : function (target, source) {
            var i;
            if (typeof source === 'object') {
                for (i in source) {
                    if (source.hasOwnProperty(i)) {
                        target[i] = source[i];
                    }
                }
            }
        },

        /**
         * Retrieves the buttons bounds via getBoundingClientRect().
         * @method _getBounds
         * @private
         * @return {Object} The button bounds values (top, right, bottom, etc...)
         */
        _getBounds : function () {
            var delta = this.options.perimeterDelta,
                forcePaint = this.el.offsetHeight,
                bounds = this.el.getBoundingClientRect();

            return {
                top    : bounds.top - delta,
                right  : bounds.right + delta,
                bottom : bounds.bottom + delta,
                left   : bounds.left - delta,
                width  : bounds.right - bounds.left,
                height : bounds.bottom - bounds.top
            };
        },

        /**
         * Called when the window is resized/rotated.
         * @method _resize
         * @private
         */
        _resize : function () {
            this.bounds = this._getBounds();
        },

        /**
         * Sets the buttons 'active' state css style.
         * @method setStateActive
         */
        setStateActive : function () {
            if (this.options.persistActiveState) {
                utils.addClass(this.el, this.activeStateStyle);
            }
        },

        /**
         * Sets the buttons 'inactive' state css style.
         * @method setStateInactive
         */
        setStateInactive : function () {
            if (this.options.persistActiveState) {
                utils.removeClass(this.el, this.activeStateStyle);
            }
        },

        /**
         * Removes all event listeners correlating to the instance.
         *
         * The destroy method should be called prior to deleting
         * the instance to allow the garbage collector to determine
         * what is able to be reclaimed.
         *
         * @method destroy
         * @example
        // Create an instance
        var aButton = new RCAM.widgets.Button('.button', {
            hoverStateStyle  : 'button--hover',
            activeStateStyle : 'button--active'
        });
        // Destroy an instance
        aButton.destroy();
        // Delete an instance by setting to null.
        aButton = null;
        // Or, delete an instance by setting to undefined.
        aButton = undefined;
        // Or, delete an instance via the delete operator.
        delete window.aButton;
         */
        destroy : function () {
            var docOrButton = param.hasTouch ? this.el : doc;
            this.el.removeEventListener(param.pointerStart, this, false);
            docOrButton.removeEventListener(param.pointerMove, this, false);
            docOrButton.removeEventListener(param.pointerEnd, this, false);
            docOrButton.addEventListener(param.pointerCancel, this, false);
        }

    };

    return Button;

}(this));
