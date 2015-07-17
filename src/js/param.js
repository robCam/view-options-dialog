var RCAM = RCAM || {};

RCAM.param = RCAM.param || {};

RCAM.init = (function (global) {

    'use strict';

    var param = RCAM.param,
        doc = global.document,
        win = global.window,
        installedFontList = [],
        predefinedFontList = ['Arial', 'Baskerville', 'Droid Serif', 'Georgia',
                'Helvetica', 'Helvetica Neue', 'Lucida', 'Optima', 'Palatino',
                'Thonburi', 'Times New Roman', 'Verdana'];

    function getPrefix(transitions) {
        var t,
            el = doc.createElement('tempElement');
        for (t in transitions) {
            if (transitions.hasOwnProperty(t)) {
                if (el.style[t] !== undefined) {
                    return transitions[t];
                }
            }
        }
        el = null;
    }

    function doesFontExist(fontName) {
        var canvas = doc.createElement("canvas"),
            context = canvas.getContext("2d"),
            text = "abcdefghijklmnopqrstuvwxyz0123456789",
            baselineSize,
            newSize;

        context.font = "72px monospace";

        baselineSize = context.measureText(text).width;

        context.font = "72px '" + fontName + "', monospace";

        newSize = context.measureText(text).width;

        canvas = null;

        if (newSize === baselineSize) {
            return false;
        }

        if (newSize !== baselineSize) {
            return true;
        }
    }

    predefinedFontList.forEach(function (font) {
        var check = doesFontExist(font);

        if (check) {
            installedFontList.push(font);
        }

    });

    function getDeviceParameters() {
        var hasOrientation = win.hasOwnProperty('onorientationchange'),
            styles = win.getComputedStyle(doc.documentElement, ''),
            pre = (Array.prototype.slice
                .call(styles)
                .join('')
                .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
            )[1];

        param.hasTouch = 'ontouchstart' in doc;
        /*param.hasTouch = win.hasOwnProperty('ontouchstart') ||
                         win.hasOwnProperty('ontouchstart') ||
                         (nav.MaxTouchPoints > 0)           ||
                         (nav.msMaxTouchPoints > 0);*/

        param.resizeEvent  = hasOrientation ? 'orientationchange' : 'resize';
        param.pointerStart = param.hasTouch ? 'touchstart' : 'mousedown';
        param.pointerMove  = param.hasTouch ? 'touchmove'  : 'mousemove';
        param.pointerEnd   = param.hasTouch ? 'touchend'   : 'mouseup';

        if (param.hasTouch) { param.pointerCancel = 'touchcancel'; }

        param.cssVendorPref = '-' + pre + '-';
        param.jsVendorPref  = pre[0].toUpperCase() + pre.substr(1);

        param.installedFontList = installedFontList;

        param.transitionStart = getPrefix({
            'transition'       : 'transitionstart',
            'OTransition'      : 'oTransitionStart',
            'MozTransition'    : 'transitionstart',
            'WebkitTransition' : 'webkitTransitionStart'
        });

        param.transitionEnd = getPrefix({
            'transition'       : 'transitionend',
            'OTransition'      : 'oTransitionEnd',
            'MozTransition'    : 'transitionend',
            'WebkitTransition' : 'webkitTransitionEnd'
        });

        param.animationStart = getPrefix({
            'animation'       : 'animationstart',
            'Oanimation'      : 'oAnimationStart',
            'MozAnimation'    : 'animationstart',
            'WebkitAnimation' : 'webkitAnimationStart'
        });

        param.animationEnd = getPrefix({
            'animation'       : 'animationend',
            'Oanimation'      : 'oAnimationEnd',
            'MozAnimation'    : 'animationend',
            'WebkitAnimation' : 'webkitAnimationEnd'
        });
    }

    function init() {
        getDeviceParameters();
    }

    return init;

}(this));

RCAM.init();
