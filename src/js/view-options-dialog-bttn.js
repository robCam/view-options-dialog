var RCAM = RCAM || {};

RCAM.widgets = RCAM.widgets || {};

RCAM.widgets.ViewOptionsBttn = (function (global) {

    'use strict';

    /*jslint nomen:true*/

    var param = RCAM.param,
        utils = RCAM.utils,
        win   = global.window,
        doc   = global.document,
        nextFrame = win.requestAnimFrame;

    function ViewOptionsBttn(el, styles, options) {

        /**
         * Ensure the constructor is new-agnostic
         * Checks the receiver value is a proper instance of ViewOptionsBttn.
         * This ensures no error if instantiated without 'new' keyword.
         */
        if (!(this instanceof ViewOptionsBttn)) {
            return new ViewOptionsBttn(el, options);
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


        this.options.persistActiveState = this.activeStateStyle === undefined
            ? false
            : this.options.persistActiveState;

        /**
         * The DOM node.
         * @property el
         * @type Object
         */
        this.el = typeof el === 'string' ? doc.querySelector(el) : el;

        this.bounds = this._getBounds();

        this.pointerIsDown = false;

        this.pointerIsInBounds = false;

        this.el.addEventListener(param.pointerStart, this, false);
    }

    ViewOptionsBttn.prototype = {

        constructor: ViewOptionsBttn,

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
            case param.transitionEnd:
                this._onTransitionEnd(e);
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

            e.preventDefault();
            e.stopPropagation();
        },

        _onMove : function (e) {
            if (!this.pointerIsDown) { return; }

            var point = param.hasTouch ? e.touches[0] : e,
                docOrButton = param.hasTouch ? this.el : doc;

            docOrButton.removeEventListener(param.pointerStart, this, false);

            this._handleMove(point.pageX, point.pageY);

            e.preventDefault();
            e.stopPropagation();
        },

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

            docOrButton.addEventListener(param.pointerStart, this, false);
            docOrButton.removeEventListener(param.pointerEnd, this, false);
            docOrButton.removeEventListener(param.pointerCancel, this, false);

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

        destroy : function () {
            this.el.removeEventListener(param.pointerStart, this, false);
        }

    };

    return ViewOptionsBttn;

}(this));
