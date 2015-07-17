var RCAM = RCAM || {};

RCAM.widgets = RCAM.widgets || {};

RCAM.widgets.TrayReveal = (function (global) {

    'use strict';

    /*jslint nomen:true*/

    var param = RCAM.param,
        utils = RCAM.utils,
        win   = global.window,
        doc   = global.document,
        nextFrame = win.requestAnimFrame;

    function TrayReveal(el, options) {

        /**
         * Ensure the constructor is new-agnostic
         * Checks the receiver value is a proper instance of Header.
         * This ensures no error if instantiated without 'new' keyword.
         */
        if (!(this instanceof TrayReveal)) {
            return new TrayReveal(el, options);
        }

        /**
         * Object containing the default configuration options.
         * (These defults are used when no options are provided on intantiation)
         * @property options
         * @type Object
         */
        this.options = {
            onToggleState : undefined,
            onTransitionEnd : undefined
        };

        // Merge/replace the user defined options
        this._extend(this.options, options);

        this.isActive = false;

        /**
         * The DOM node.
         * @property el
         * @type Object
         */
        this.trayReveal = typeof el === 'string' ? doc.querySelector(el) : el;

        this.trayRevealMask = this.trayReveal.querySelector('.tray-reveal__mask');

        this.trayRevealContent = this.trayReveal.querySelector('.tray-reveal__mask__content');

        this.fontList = this.trayRevealContent.querySelector('.font-list');

        this._appendFontList();

        this.trayRevealContent.addEventListener(param.transitionEnd, this, false);
    }

    TrayReveal.prototype = {

        constructor: TrayReveal,

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
            var self = this;

            if (this.options.onTransitionEnd) {
                this.options.onTransitionEnd.call(self);
            }
        },

        _appendFontList : function () {
            var parentNode = this.fontList;

            param.installedFontList.forEach(function(font) {
                var li = doc.createElement('li'),
                    txtNode = doc.createTextNode(font);

                li.className = 'font-list__item';
                li.setAttribute('data-font', font);
                li.style.fontFamily = font;
                li.appendChild(txtNode);
                parentNode.appendChild(li);
            });

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
                utils.toggleClass(self.trayRevealMask, 'tray-reveal__mask--active');
                utils.toggleClass(self.trayRevealContent, 'tray-reveal__mask__content--active');
            });

            if (this.options.onToggleState) {
                this.options.onToggleState.call(self);
            }

            this.isActive = this.isActive ? false : true;
        }

    };

    return TrayReveal;

}(this));
