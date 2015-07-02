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
            onPointerEndCallback : null
        };

        // Merge/replace the user defined options
        this._extend(this.options, options);

        /**
         * The DOM node.
         * @property el
         * @type Object
         */
        this.el = typeof el === 'string' ? doc.querySelector(el) : el;

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
            utils.addClass(this.el, this.hoverStateStyle);
            this.el.addEventListener(param.pointerEnd, this, false);
            this.el.addEventListener(param.pointerCancel, this, false);
            e.preventDefault();
            e.stopPropagation();
        },

        /**
         * Called when a pointer or touch event ends.
         * @method _onEnd
         * @private
         */
        _onEnd : function (e) {
            /*var self = this;*/

            utils.removeClass(this.el, this.hoverStateStyle);

            if (this.options.persistActiveState) {
                utils.addClass(this.el, this.activeStateStyle);
            }

            this.el.removeEventListener(param.pointerEnd, this, false);
            this.el.removeEventListener(param.pointerCancel, this, false);

            if (this.options.onPointerEndCallback) {
                this.options.onPointerEndCallback.call(this);
            }

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
        }
    };

    return ViewOptionsBttn;

}(this));
