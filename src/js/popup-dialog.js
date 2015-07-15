var RCAM = RCAM || {};

RCAM.widgets = RCAM.widgets || {};

RCAM.widgets.PopupDialog = (function (global) {

    'use strict';

    /*jslint nomen:true*/

    var param = RCAM.param,
        utils = RCAM.utils,
        win   = global.window,
        doc   = global.document,
        nextFrame = win.requestAnimFrame;

    function PopupDialog(el, options) {

        /**
         * Ensure the constructor is new-agnostic
         * Checks the receiver value is a proper instance of Header.
         * This ensures no error if instantiated without 'new' keyword.
         */
        if (!(this instanceof PopupDialog)) {
            return new PopupDialog(el, options);
        }

        /**
         * Object containing the default configuration options.
         * (These defults are used when no options are provided on intantiation)
         * @property options
         * @type Object
         */
        this.options = {
            onToggleState : null
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

        /*this.el.addEventListener(param.pointerStart, this, false);
        this.el.addEventListener(param.pointerEnd, this, false);
        this.el.addEventListener(param.transitionEnd, this, false);*/
    }

    PopupDialog.prototype = {

        constructor: PopupDialog,

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

        /**
         * Called when the header tray completes its animation.
         * @method _onTransitionEnd
         * @private
         */
        _onTransitionEnd : function () {

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
                utils.toggleClass(self.el, 'view-options--active');
            });

            if (this.options.onToggleState) {
                this.options.onToggleState.call(self);
            }

            this.isActive = this.isActive ? false : true;
        }

    };

    return PopupDialog;

}(this));
