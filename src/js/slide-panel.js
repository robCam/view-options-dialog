var RCAM = RCAM || {};

RCAM.widgets = RCAM.widgets || {};

RCAM.widgets.SlidePanel = (function (global) {

    'use strict';

    /*jslint nomen:true*/

    var utils = RCAM.utils,
        param = RCAM.param,
        win = global.window,
        doc = global.document,
        nextFrame = win.requestAnimFrame;

    function SlidePanel(el, activeStateStyle, options) {

        /**
         * Ensure the constructor is new-agnostic
         * Checks the receiver value is a proper instance of Header.
         * This ensures no error if instantiated without 'new' keyword.
         */
        if (!(this instanceof SlidePanel)) {
            return new SlidePanel(el, activeStateStyle, options);
        }

        /**
         * Object containing the default configuration options.
         * (These defults are used when no options are provided on intantiation)
         * @property options
         * @type Object
         */
        this.options = {
            foo : undefined,
            onTransitionEndCallback: undefined
        };

        // Merge/replace the user defined options
        this._extend(this.options, options);

        this.isActive = false;

        /**
         * The DOM node.
         * @property el
         * @type Object
         */
        this.el = typeof el === 'string' ? doc.querySelector(el) : el;

        this.activeStateStyle = activeStateStyle;

        this.el.addEventListener(param.transitionEnd, this, false);
    }

    SlidePanel.prototype = {

        constructor: SlidePanel,

        /**
         * Handles events when they are fired.
         * @method handleEvent
         * @private
         */
        handleEvent : function (e) {
            switch (e.type) {
            case param.transitionEnd:
                this._onTransitionEnd(e);
                break;
            }
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

        _onTransitionEnd : function () {
            if (this.options.onTransitionEndCallback) {
                this.options.onTransitionEndCallback.call(this);
            }
        },

        /**
         * Toggles the active/non-active el state.
         * @method toggleTray
         * @example
             el.toggleState();
         */
        toggleState : function () {
            var self = this;

            nextFrame(function() {
                utils.toggleClass(self.el, self.activeStateStyle);
            });

            if (this.options.onToggleState) {
                this.options.onToggleState.call(self);
            }

            this.isActive = this.isActive ? false : true;
        }

    };

    return SlidePanel;

}(this));
