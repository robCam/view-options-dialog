var RCAM = RCAM || {};

RCAM.dialogButtons = (function(window, document, RCAM, localStorage) {

    'use strict';

    /*jslint nomen:true*/

    function init() {

        var utils = RCAM.utils,
            fontSmallerBttn,
            fontLargerBttn,
            chosenFontBttn,
            paperWhiteBttn,
            paperBlackBttn,
            paperSepiaBttn,
            chosenFontTray,
            fontList = document.querySelector('.js-font-list'),
            fontListBttns = [].slice.call(fontList.querySelectorAll('.font-list__item')),
            listOfFontBttns = [],

            paperBttnContainer = document.querySelector('.js-view-options__paper-buttons'),
            jsPaperBttnContainer,

            viewOptionsDialog = document.querySelector('.view-options'), 

            paper = document.querySelector('.wrapper'),
            paperColorRadioButtons = [],
            bottomPanel = document.querySelector('.js-view-options__bottom-panel'),
            jsBottomPanel,
            mainContent = document.querySelector('.main-content'),
            addStylesheetToHead = function(css, existingStyleId) {
                var head = document.head || document.getElementsByTagName('head')[0],
                    style = document.createElement('style'),
                    existingAppendedStyle = head.querySelector(existingStyleId);

                if (css) {
                    style.type = 'text/css';
                    style.id = existingStyleId.replace('#', '');
                    style.appendChild(document.createTextNode(css));
                }

                if (existingAppendedStyle !== null || undefined) {
                    existingAppendedStyle.parentNode.removeChild(existingAppendedStyle);
                }

                if (css && css.indexOf('publisher-font') === -1) {
                    head.appendChild(style);
                }

            };

        if (localStorage.getItem('paperBlackBttnIsActive') === 'true') {
            addStylesheetToHead('.main-content * { color: hsl(0, 0%, 100%) !important; }', '#background-color');
            utils.addClass(viewOptionsDialog, 'view-options--theme-b');
        } else if (localStorage.getItem('paperSepiaBttnIsActive') === 'true') {
            addStylesheetToHead('.main-content * { color: hsl(40, 65%, 20%) !important; }', '#background-color');
        }

        if (localStorage.getItem('fontSetting')) {
            addStylesheetToHead('.main-content * { font-family: \"' + localStorage.getItem('fontSetting') + '\" !important;}', '#custom-font');
        }

        if (localStorage.getItem('fontSize')) {
            mainContent.style.fontSize = localStorage.getItem('fontSize') + 'px';
        }

        if (localStorage.getItem('lineHeight')) {
            mainContent.style.lineHeight = localStorage.getItem('lineHeight') + 'px';
        }

        fontSmallerBttn = new RCAM.widgets.Button('.js-fontsmaller', {
            hoverStateStyle: 'view-options__bttn--hover'
        }, {
            onPointerEndCallback: function() {
                var fontSize = parseFloat(window.getComputedStyle(mainContent, null).getPropertyValue('font-size')),
                    lineHeight = parseFloat(window.getComputedStyle(mainContent, null).getPropertyValue('line-height'));

                mainContent.style.fontSize = (fontSize - 2) + 'px';
                mainContent.style.lineHeight = (lineHeight - 4) + 'px';
                localStorage.setItem('fontSize', fontSize - 2);
                localStorage.setItem('lineHeight', lineHeight - 4);
            }
        });

        fontLargerBttn = new RCAM.widgets.Button('.js-fontlarger', {
            hoverStateStyle: 'view-options__bttn--hover'
        }, {
            onPointerEndCallback: function() {
                var fontSize = parseFloat(window.getComputedStyle(mainContent, null).getPropertyValue('font-size')),
                    lineHeight = parseFloat(window.getComputedStyle(mainContent, null).getPropertyValue('line-height'));

                mainContent.style.fontSize = (fontSize + 2) + 'px';
                mainContent.style.lineHeight = (lineHeight + 4) + 'px';
                localStorage.setItem('fontSize', fontSize + 2);
                localStorage.setItem('lineHeight', lineHeight + 4);
            }
        });

        chosenFontBttn = new RCAM.widgets.Button('.js-chosenFont', {
            hoverStateStyle: 'view-options__bttn--fontbttn--hover'
        }, {
            onPointerEndCallback: function() {
                chosenFontTray.toggleState();
                jsPaperBttnContainer.toggleState();
                jsBottomPanel.toggleState();
            }
        });

        chosenFontTray = new RCAM.widgets.TrayReveal('.tray-reveal', {
            onTransitionEnd: function() {
                paperColorRadioButtons.forEach(function(button) {
                    button.bounds = button._getBounds(); //Update button bounds
                });
            }
        });

        jsPaperBttnContainer = new RCAM.widgets.SlidePanel(paperBttnContainer,
            'view-options__paper-buttons--active', {
                foobar: null
            });

        paperWhiteBttn = new RCAM.widgets.Button('.js-paper-white', {
            hoverStateStyle: 'view-options__bttn--hover',
            activeStateStyle: 'view-options__bttn--active'
        }, {
            onPointerEndCallback: function() {
                var self = this,
                    paper = document.querySelector('.wrapper');
                paperColorRadioButtons.forEach(function(button) {
                    if (button !== self) {
                        button.setStateInactive();
                        if (localStorage.getItem('paperWhiteBttnIsActive') === null ||
                                localStorage.getItem('paperWhiteBttnIsActive') === 'false') {
                            localStorage.setItem('paperWhiteBttnIsActive', true);
                        }
                    } else {
                        utils.removeClass(viewOptionsDialog, 'view-options--theme-b');
                        localStorage.setItem('paperBlackBttnIsActive', false);
                        localStorage.setItem('paperWhiteBttnIsActive', true);
                        localStorage.setItem('paperSepiaBttnIsActive', false);
                    }
                });
                addStylesheetToHead('', '#background-color');
                paper.style.background = "hsl(0, 0%, 80%)";
            }
        });

        paperColorRadioButtons.push(paperWhiteBttn);
        if (localStorage.getItem('paperWhiteBttnIsActive') === 'true') {
            paperWhiteBttn.setStateActive();
            paper.style.background = "hsl(0, 0%, 80%)";
        }

        paperBlackBttn = new RCAM.widgets.Button('.js-paper-black', {
            hoverStateStyle: 'view-options__bttn--black--hover',
            activeStateStyle: 'view-options__bttn--active'
        }, {
            onPointerEndCallback: function() {
                var self = this,
                    paper = document.querySelector('.wrapper');
                paperColorRadioButtons.forEach(function(button) {
                    if (button !== self) {
                        button.setStateInactive();
                        if (localStorage.getItem('paperBlackBttnIsActive') === null ||
                                localStorage.getItem('paperBlackBttnIsActive') === 'false') {
                            localStorage.setItem('paperBlackBttnIsActive', true);
                        }
                    } else {
                        utils.addClass(viewOptionsDialog, 'view-options--theme-b');
                        localStorage.setItem('paperBlackBttnIsActive', true);
                        localStorage.setItem('paperWhiteBttnIsActive', false);
                        localStorage.setItem('paperSepiaBttnIsActive', false);
                    }
                });
                addStylesheetToHead('.main-content * { color: white !important;}', '#background-color');
                paper.style.background = "hsl(0, 0%, 6%)";
            }
        });

        paperColorRadioButtons.push(paperBlackBttn);
        if (localStorage.getItem('paperBlackBttnIsActive') === 'true') {
            paperBlackBttn.setStateActive();
            paper.style.background = "hsl(0, 0%, 6%)";
        }

        paperSepiaBttn = new RCAM.widgets.Button('.js-paper-sepia', {
            hoverStateStyle: 'view-options__bttn--sepia--hover',
            activeStateStyle: 'view-options__bttn--active'
        }, {
            onPointerEndCallback: function() {
                var self = this,
                    paper = document.querySelector('.wrapper');
                paperColorRadioButtons.forEach(function(button) {
                    if (button !== self) {
                        button.setStateInactive();
                        if (localStorage.getItem('paperSepiaBttnIsActive') === null ||
                                localStorage.getItem('paperSepiaBttnIsActive') === 'false') {
                            localStorage.setItem('paperSepiaBttnIsActive', true);
                        }
                    } else {
                        utils.removeClass(viewOptionsDialog, 'view-options--theme-b');
                        localStorage.setItem('paperSepiaBttnIsActive', true);
                        localStorage.setItem('paperWhiteBttnIsActive', false);
                        localStorage.setItem('paperBlackBttnIsActive', false);
                    }
                });
                addStylesheetToHead('.main-content * { color: hsl(40, 65%, 20%) !important;}', '#background-color');
                paper.style.background = "hsl(40, 35%, 70%)";
            }
        });

        paperColorRadioButtons.push(paperSepiaBttn);
        if (localStorage.getItem('paperSepiaBttnIsActive') === 'true') {
            paperSepiaBttn.setStateActive();
            paper.style.background = "hsl(40, 35%, 70%)";
        }

        jsBottomPanel = new RCAM.widgets.SlidePanel(bottomPanel,
            'view-options__bottom-panel--active', {
                foobar: null
            });

        fontListBttns = [].slice.call(fontList.querySelectorAll('.font-list__item'));
        fontListBttns.forEach(function(button) {
            var bttn = new RCAM.widgets.Button(button, {
                hoverStateStyle: 'view-options__bttn--fontbttn--hover'
            }, {
                onPointerEndCallback: function() {
                    var dataAttr = button.dataset ? button.dataset.font : button.getAttribute("data-font");
                    addStylesheetToHead('.main-content * { font-family: \"' + dataAttr + '\" !important;}', '#custom-font');
                    localStorage.setItem('fontSetting', dataAttr);
                }
            });
            listOfFontBttns.push(bttn);
        });

        fontList.ontouchmove = function(e) {
            e.stopPropagation();
        };
        mainContent.ontouchmove = function(e) {
            e.stopPropagation();
        };
        document.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, false);

    }

    return {
        init : init
    };

}(this.window, this.document, this.RCAM, this.localStorage));