var RCAM = RCAM || {};

RCAM.widgets = RCAM.widgets || {};

/**
 * Constructs a custom interactive Button.
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

        /**
         * Ensure the constructor is new-agnostic
         * Checks the receiver value is a proper instance of Button.
         * This ensures no error if instantiated without 'new' keyword.
         */
        if (!(this instanceof Button)) {
            return new Button(el, options);
        }

        this.hoverStateStyle  = styles.hoverStateStyle;
        this.activeStateStyle = styles.activeStateStyle;

        /**
         * Object containing the default configuration options.
         * (These defults are used when no options are provided on intantiation)
         * @property options
         * @type Object
         */
        this.options = {
            persistActiveState : true,
            onPointerEndCallback : null,
            perimeterDelta : 30
        };

        // Merge/replace the user defined options
        this._extend(this.options, options);

        // Normalise 'persistActiveState' state
        this.options.persistActiveState = this.activeStateStyle === undefined
            ? false
            : this.options.persistActiveState;

        /**
         * The DOM node.
         * @property el
         * @type Object
         */
        this.el = typeof el === 'string' ? doc.querySelector(el) : el;

        // Get the button bounds
        this.bounds = this._getBounds();

        this.pointerIsDown = false;

        this.pointerIsInBounds = false;

        this.el.addEventListener(param.pointerStart, this, false);
        win.addEventListener(param.resizeEvent, this, false);
    }

    Button.prototype = {

        constructor: Button,

        /**
         * Handles events when they are fired.
         * @method handleEvent
         * @private 
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
                utils.addClass(this.el, this.activeStateStyle);
            }

            if (this.options.onPointerEndCallback && this.pointerIsInBounds) {
                this.options.onPointerEndCallback.call(this);
            }

            this.pointerIsInBounds = false;

            e.preventDefault();
            e.stopPropagation();
        },

        /**
         * Enumerate properties of the 'source' object and copy them to the 'target'.
         * @method _extend
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

        _resize : function () {
            this.bounds = this._getBounds();
        },

        destroy : function () {
            this.el.removeEventListener(param.pointerStart, this, false);
            win.removeEventListener(param.resizeEvent, this, false);
        }

    };

    return Button;

}(this));
