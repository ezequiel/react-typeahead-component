(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Typeahead = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process){
'use strict';

var React = window.React || require('react');

module.exports = React.createClass({
    displayName: 'Aria Status',

    propTypes: process.env.NODE_ENV === 'production' ? {} : {
        message: React.PropTypes.string
    },

    componentDidMount: function() {
        var _this = this;

        // This is needed as `componentDidUpdate`
        // does not fire on the initial render.
        _this.setTextContent(_this.props.message);
    },

    componentDidUpdate: function() {
        var _this = this;

        _this.setTextContent(_this.props.message);
    },

    render: function() {
        return (
            React.createElement("span", {
                role: "status", 
                "aria-live": "polite", 
                style: {
                    left: '-9999px',
                    position: 'absolute'
                }}
            )
        );
    },

    // We cannot set `textContent` directly in `render`,
    // because React adds/deletes text nodes when rendering,
    // which confuses screen readers and doesn't cause them to read changes.
    setTextContent: function(textContent) {
        // We could set `innerHTML`, but it's better to avoid it.
        this.getDOMNode().textContent = textContent || '';
    }
});


}).call(this,require('_process'))

},{"_process":1,"react":"react"}],3:[function(require,module,exports){
(function (process){
'use strict';

var React = window.React || require('react');

module.exports = React.createClass({
    displayName: 'Input',

    propTypes: process.env.NODE_ENV === 'production' ? {} : {
        value: React.PropTypes.string,
        onChange: React.PropTypes.func
    },

    getDefaultProps: function() {
        return {
            value: '',
            onChange: function() {}
        };
    },

    componentDidUpdate: function() {
        var _this = this,
            dir = _this.props.dir;

        if (dir === null || dir === undefined) {
            // When setting an attribute to null/undefined,
            // React instead sets the attribute to an empty string.

            // This is not desired because of a possible bug in Chrome.
            // If the page is RTL, and the input's `dir` attribute is set
            // to an empty string, Chrome assumes LTR, which isn't what we want.
            React.findDOMNode(_this).removeAttribute('dir');
        }
    },

    render: function() {
        var _this = this;

        return (
            React.createElement("input", React.__spread({}, 
                _this.props, 
                {onChange: _this.handleChange})
            )
        );
    },

    handleChange: function(event) {
        var props = this.props;

        // There are several React bugs in IE,
        // where the `input`'s `onChange` event is
        // fired even when the value didn't change.
        // https://github.com/facebook/react/issues/2185
        // https://github.com/facebook/react/issues/3377
        if (event.target.value !== props.value) {
            props.onChange(event);
        }
    },

    blur: function() {
        React.findDOMNode(this).blur();
    },

    isCursorAtEnd: function() {
        var _this = this,
            inputDOMNode = React.findDOMNode(_this),
            valueLength = _this.props.value.length;

        return inputDOMNode.selectionStart === valueLength &&
               inputDOMNode.selectionEnd === valueLength;
    }
});


}).call(this,require('_process'))

},{"_process":1,"react":"react"}],4:[function(require,module,exports){
(function (process){
'use strict';

var React = window.React || require('react'),
    Input = require('./input.jsx'),
    AriaStatus = require('./aria_status.jsx'),
    getTextDirection = require('../utils/get_text_direction'),
    noop = function() {};

module.exports = React.createClass({
    displayName: 'Typeahead',

    propTypes: process.env.NODE_ENV === 'production' ? {} : {
        inputId: React.PropTypes.string,
        className: React.PropTypes.string,
        autoFocus: React.PropTypes.bool,
        hoverSelect: React.PropTypes.bool,
        inputValue: React.PropTypes.string,
        options: React.PropTypes.array,
        placeholder: React.PropTypes.string,
        onChange: React.PropTypes.func,
        onKeyDown: React.PropTypes.func,
        onKeyPress: React.PropTypes.func,
        onKeyUp: React.PropTypes.func,
        onFocus: React.PropTypes.func,
        onBlur: React.PropTypes.func,
        onSelect: React.PropTypes.func,
        onInputClick: React.PropTypes.func,
        handleHint: React.PropTypes.func,
        onComplete: React.PropTypes.func,
        onOptionClick: React.PropTypes.func,
        onOptionChange: React.PropTypes.func,
        onDropdownOpen: React.PropTypes.func,
        onDropdownClose: React.PropTypes.func,
        optionTemplate: React.PropTypes.func.isRequired,
        getMessageForOption: React.PropTypes.func,
        getMessageForIncomingOptions: React.PropTypes.func
    },

    getDefaultProps: function() {
        return {
            className: '',
            inputValue: '',
            options: [],
            hoverSelect: true,
            onFocus: noop,
            onKeyDown: noop,
            onChange: noop,
            onInputClick: noop,
            handleHint: function() {
                return '';
            },
            onOptionClick: noop,
            onOptionChange: noop,
            onComplete:  noop,
            onDropdownOpen: noop,
            onDropdownClose: noop,
            getMessageForOption: function() {
                return '';
            },
            getMessageForIncomingOptions: function(number) {
                return (
                    number + ' suggestions are available. Use up and down arrows to select.'
                );
            }
        };
     },

    getInitialState: function() {
        return {
            selectedIndex: -1,
            isHintVisible: false,
            isDropdownVisible: false
        };
    },

    componentWillMount: function() {
        var _this = this,
            uniqueId = new Date().getTime();

        _this.userInputValue = null;
        _this.previousInputValue = null;
        _this.activeDescendantId = 'react-typeahead-activedescendant-' + uniqueId;
        _this.optionsId = 'react-typeahead-options-' + uniqueId;
    },

    componentDidMount: function() {
        var addEvent = window.addEventListener,
            handleWindowClose = this.handleWindowClose;

        // The `focus` event does not bubble, so we must capture it instead.
        // This closes Typeahead's dropdown whenever something else gains focus.
        addEvent('focus', handleWindowClose, true);

        // If we click anywhere outside of Typeahead, close the dropdown.
        addEvent('click', handleWindowClose, false);
    },

    componentWillUnmount: function() {
        var removeEvent = window.removeEventListener,
            handleWindowClose = this.handleWindowClose;

        removeEvent('focus', handleWindowClose, true);
        removeEvent('click', handleWindowClose, false);
    },

    componentWillReceiveProps: function(nextProps) {
        var nextValue = nextProps.inputValue,
            nextOptions = nextProps.options,
            valueLength = nextValue.length,
            isHintVisible = valueLength > 0 &&
                // A visible part of the hint must be
                // available for us to complete it.
                nextProps.handleHint(nextValue, nextOptions).slice(valueLength).length > 0;

        this.setState({
            isHintVisible: isHintVisible
        });
    },

    render: function() {
        var _this = this;

        return (
            React.createElement("div", {
                style: {
                    position: 'relative'
                }, 
                className: 'react-typeahead-container ' + _this.props.className}, 
                _this.renderInput(), 
                _this.renderDropdown(), 
                _this.renderAriaMessageForOptions(), 
                _this.renderAriaMessageForIncomingOptions()
            )
        );
    },

    renderInput: function() {
        var _this = this,
            state = _this.state,
            props = _this.props,
            inputValue = props.inputValue,
            className = 'react-typeahead-input',
            inputDirection = getTextDirection(inputValue);

        return (
            React.createElement("div", {
                style: {
                    position: 'relative'
                }, 
                className: "react-typeahead-input-container"}, 
                React.createElement(Input, {
                    disabled: true, 
                    role: "presentation", 
                    "aria-hidden": true, 
                    dir: inputDirection, 
                    className: className + ' react-typeahead-hint', 
                    style: {
                        color: 'silver',
                        WebkitTextFillColor: 'silver',
                        position: 'absolute'
                    }, 
                    value: state.isHintVisible ? props.handleHint(inputValue, props.options) : null}
                ), 
                React.createElement(Input, {
                    ref: "input", 
                    role: "combobox", 
                    "aria-owns": _this.optionsId, 
                    "aria-expanded": state.isDropdownVisible, 
                    "aria-autocomplete": "both", 
                    "aria-activedescendant": _this.activeDescendantId, 
                    value: inputValue, 
                    spellCheck: false, 
                    autoComplete: false, 
                    autoCorrect: false, 
                    dir: inputDirection, 
                    onClick: _this.handleClick, 
                    onFocus: _this.handleFocus, 
                    onBlur: props.onBlur, 
                    onChange: _this.handleChange, 
                    onKeyDown: _this.handleKeyDown, 
                    id: props.inputId, 
                    autoFocus: props.autoFocus, 
                    placeholder: props.placeholder, 
                    onSelect: props.onSelect, 
                    onKeyUp: props.onKeyUp, 
                    onKeyPress: props.onKeyPress, 
                    className: className + ' react-typeahead-usertext', 
                    style: {
                        position: 'relative',
                        background: 'transparent'
                    }}
                )
            )
        );
    },

    renderDropdown: function() {
        var _this = this,
            state = _this.state,
            props = _this.props,
            OptionTemplate = props.optionTemplate,
            selectedIndex = state.selectedIndex,
            isDropdownVisible = state.isDropdownVisible,
            activeDescendantId = _this.activeDescendantId;

        if (this.props.options.length < 1) {
            return null;
        }

        return (
            React.createElement("ul", {id: _this.optionsId, 
                role: "listbox", 
                "aria-hidden": !isDropdownVisible, 
                style: {
                    width: '100%',
                    background: '#fff',
                    position: 'absolute',
                    boxSizing: 'border-box',
                    display: isDropdownVisible ? 'block' : 'none'
                }, 
                className: "react-typeahead-options", 
                onMouseOut: this.handleMouseOut}, 
                
                    props.options.map(function(data, index) {
                        var isSelected = selectedIndex === index;

                        return (
                            React.createElement("li", {id: isSelected ? activeDescendantId : null, 
                                "aria-selected": isSelected, 
                                role: "option", 
                                key: index, 
                                onClick: _this.handleOptionClick.bind(_this, index), 
                                onMouseOver: _this.handleOptionMouseOver.bind(_this, index)}, 

                                React.createElement(OptionTemplate, {
                                    data: data, 
                                    index: index, 
                                    userInputValue: _this.userInputValue, 
                                    inputValue: props.inputValue, 
                                    isSelected: isSelected}
                                )
                            )
                        );
                    })
                
            )
        );
    },

    renderAriaMessageForOptions: function() {
        var _this = this,
            props = _this.props,
            inputValue = props.inputValue,
            option = props.options[_this.state.selectedIndex] || inputValue;

        return (
            React.createElement(AriaStatus, {
                message: props.getMessageForOption(option) || inputValue}
            )
        );
    },

    renderAriaMessageForIncomingOptions: function() {
        var props = this.props;

        return (
            React.createElement(AriaStatus, {
                message: props.getMessageForIncomingOptions(props.options.length)}
            )
        );
    },

    showDropdown: function() {
        var _this = this;

        if (!_this.state.isDropdownVisible) {
            _this.setState({
                isDropdownVisible: true
            }, function() {
                _this.props.onDropdownOpen();
            });
        }
    },

    hideDropdown: function() {
        var _this = this;

        if (_this.state.isDropdownVisible) {
            _this.setState({
                isDropdownVisible: false
            }, function() {
                _this.props.onDropdownClose();
            });
        }
    },

    showHint: function() {
        var _this = this,
            props = _this.props,
            inputValue = props.inputValue,
            inputValueLength = inputValue.length,
            isHintVisible = inputValueLength > 0 &&
                // A visible part of the hint must be
                // available for us to complete it.
                props.handleHint(inputValue, props.options).slice(inputValueLength).length > 0;

        _this.setState({
            isHintVisible: isHintVisible
        });
    },

    hideHint: function() {
        this.setState({
            isHintVisible: false
        });
    },

    setSelectedIndex: function(index, callback) {
        this.setState({
            selectedIndex: index
        }, callback);
    },

    handleChange: function(event) {
        var _this = this;

        _this.showHint();
        _this.showDropdown();
        _this.setSelectedIndex(-1);
        _this.props.onChange(event);
        _this.userInputValue = event.target.value;
    },

    focus: function() {
        this.refs.input.getDOMNode().focus();
    },

    handleFocus: function(event) {
        var _this = this;

        _this.showDropdown();
        _this.props.onFocus(event);
    },

    handleClick: function(event) {
        var _this = this;

        _this.showHint();
        _this.props.onInputClick(event);
    },

    navigate: function(direction, callback) {
        var _this = this,
            minIndex = -1,
            maxIndex = _this.props.options.length - 1,
            index = _this.state.selectedIndex + direction;

        if (index > maxIndex) {
            index = minIndex;
        } else if (index < minIndex) {
            index = maxIndex;
        }

        _this.setSelectedIndex(index, callback);
    },

    handleKeyDown: function(event) {
        var _this = this,
            key = event.key,
            props = _this.props,
            input = _this.refs.input,
            isDropdownVisible = _this.state.isDropdownVisible,
            isHintVisible = _this.state.isHintVisible,
            hasHandledKeyDown = false,
            index,
            optionData,
            dir;

        switch (key) {
        case 'End':
        case 'Tab':
            if (isHintVisible && !event.shiftKey) {
                event.preventDefault();
                props.onComplete(event, props.handleHint(props.inputValue, props.options));
            }
            break;
        case 'ArrowLeft':
        case 'ArrowRight':
            if (isHintVisible && !event.shiftKey && input.isCursorAtEnd()) {
                dir = getTextDirection(props.inputValue);

                if ((dir === 'ltr' && key === 'ArrowRight') || (dir === 'rtl' && key === 'ArrowLeft')) {
                    props.onComplete(event, props.handleHint(props.inputValue, props.options));
                }
            }
            break;
        case 'Enter':
            input.blur();
            _this.hideHint();
            _this.hideDropdown();
            break;
        case 'Escape':
            _this.hideHint();
            _this.hideDropdown();
            break;
        case 'ArrowUp':
        case 'ArrowDown':
            if (props.options.length > 0) {
                event.preventDefault();

                _this.showHint();
                _this.showDropdown();

                if (isDropdownVisible) {
                    dir = key === 'ArrowUp' ? -1: 1;
                    hasHandledKeyDown = true;

                    _this.navigate(dir, function() {
                        var selectedIndex = _this.state.selectedIndex,
                            previousInputValue = _this.previousInputValue,
                            optionData = previousInputValue;

                        // We're currently on an option.
                        if (selectedIndex >= 0) {
                            // Save the current `input` value,
                            // as we might arrow back to it later.
                            if (previousInputValue === null) {
                                _this.previousInputValue = props.inputValue;
                            }

                            optionData = props.options[selectedIndex];
                        }

                        props.onOptionChange(event, optionData, selectedIndex);
                        props.onKeyDown(event, optionData, selectedIndex);
                    });
                }
            }

            break;
        }

        if (!hasHandledKeyDown) {
            index = this.state.selectedIndex;
            optionData = index < 0 ? props.inputValue : props.options[index];
            props.onKeyDown(event, optionData, index);
        }
    },

    handleOptionClick: function(selectedIndex, event) {
        var _this = this,
            props = _this.props;

        _this.hideHint();
        _this.hideDropdown();
        _this.setSelectedIndex(selectedIndex);
        props.onOptionClick(event, props.options[selectedIndex], selectedIndex);
    },

    handleOptionMouseOver: function(selectedIndex) {
        var _this = this;

        if (_this.props.hoverSelect) {
            _this.setSelectedIndex(selectedIndex);
        }
    },

    handleMouseOut: function() {
        var _this = this;

        if (_this.props.hoverSelect) {
            _this.setSelectedIndex(-1);
        }
    },

    handleWindowClose: function(event) {
        var _this = this,
            target = event.target;

        if (target !== window && !this.getDOMNode().contains(target)) {
            _this.hideHint();
            _this.hideDropdown();
        }
    }
});


}).call(this,require('_process'))

},{"../utils/get_text_direction":6,"./aria_status.jsx":2,"./input.jsx":3,"_process":1,"react":"react"}],5:[function(require,module,exports){
module.exports = require('./components/typeahead.jsx');


},{"./components/typeahead.jsx":4}],6:[function(require,module,exports){
'use strict';

var RTLCharactersRegExp = require('./rtl_chars_regexp'),
    NeutralCharactersRegExp = require('./neutral_chars_regexp'),
    startsWithRTL = new RegExp('^(?:' + NeutralCharactersRegExp + ')*(?:' + RTLCharactersRegExp + ')'),
    neutralText = new RegExp('^(?:' + NeutralCharactersRegExp + ')*$');

module.exports = function(text) {
    var dir = 'ltr';

    if (startsWithRTL.test(text)) {
        dir = 'rtl';
    } else if (neutralText.test(text)) {
        dir = null;
    }

    return dir;
};


},{"./neutral_chars_regexp":7,"./rtl_chars_regexp":8}],7:[function(require,module,exports){
// DO NOT EDIT!
// THIS FILE IS GENERATED!

// All bidi characters except those found in classes 'L' (LTR), 'R' (RTL), and 'AL' (RTL Arabic) as per Unicode 7.0.0.

// jshint ignore:start
// jscs:disable maximumLineLength
module.exports = '[\0-@\[-`\{-\xA9\xAB-\xB4\xB6-\xB9\xBB-\xBF\xD7\xF7\u02B9\u02BA\u02C2-\u02CF\u02D2-\u02DF\u02E5-\u02ED\u02EF-\u036F\u0374\u0375\u037E\u0384\u0385\u0387\u03F6\u0483-\u0489\u058A\u058D-\u058F\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0600-\u0607\u0609\u060A\u060C\u060E-\u061A\u064B-\u066C\u0670\u06D6-\u06E4\u06E7-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07F6-\u07F9\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08E4-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u09F2\u09F3\u09FB\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AF1\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0BF3-\u0BFA\u0C00\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C78-\u0C7E\u0C81\u0CBC\u0CCC\u0CCD\u0CE2\u0CE3\u0D01\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E3F\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39-\u0F3D\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1390-\u1399\u1400\u1680\u169B\u169C\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DB\u17DD\u17F0-\u17F9\u1800-\u180E\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1940\u1944\u1945\u19DE-\u19FF\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF5\u1DFC-\u1DFF\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2000-\u200D\u2010-\u2029\u202F-\u2064\u2068\u206A-\u2070\u2074-\u207E\u2080-\u208E\u20A0-\u20BD\u20D0-\u20F0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u2150-\u215F\u2189\u2190-\u2335\u237B-\u2394\u2396-\u23FA\u2400-\u2426\u2440-\u244A\u2460-\u249B\u24EA-\u26AB\u26AD-\u27FF\u2900-\u2B73\u2B76-\u2B95\u2B98-\u2BB9\u2BBD-\u2BC8\u2BCA-\u2BD1\u2CE5-\u2CEA\u2CEF-\u2CF1\u2CF9-\u2CFF\u2D7F\u2DE0-\u2E42\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3000-\u3004\u3008-\u3020\u302A-\u302D\u3030\u3036\u3037\u303D-\u303F\u3099-\u309C\u30A0\u30FB\u31C0-\u31E3\u321D\u321E\u3250-\u325F\u327C-\u327E\u32B1-\u32BF\u32CC-\u32CF\u3377-\u337A\u33DE\u33DF\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA60D-\uA60F\uA66F-\uA67F\uA69F\uA6F0\uA6F1\uA700-\uA721\uA788\uA802\uA806\uA80B\uA825\uA826\uA828-\uA82B\uA838\uA839\uA874-\uA877\uA8C4\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFB29\uFD3E\uFD3F\uFDFD\uFE00-\uFE19\uFE20-\uFE2D\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFEFF\uFF01-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFF9-\uFFFD]|\uD800[\uDD01\uDD40-\uDD8C\uDD90-\uDD9B\uDDA0\uDDFD\uDEE0-\uDEFB\uDF76-\uDF7A]|\uD802[\uDD1F\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6\uDF39-\uDF3F]|\uD803[\uDE60-\uDE7E]|[\uD804\uDB40][\uDC01\uDC38-\uDC46\uDC52-\uDC65\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDE2F-\uDE31\uDE34\uDE36\uDE37\uDEDF\uDEE3-\uDEEA\uDF01\uDF3C\uDF40\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDCB3-\uDCB8\uDCBA\uDCBF\uDCC0\uDCC2\uDCC3\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB5\uDEB7]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF8F-\uDF92]|\uD82F[\uDC9D\uDC9E\uDCA0-\uDCA3]|\uD834[\uDD67-\uDD69\uDD73-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE00-\uDE45\uDF00-\uDF56]|\uD835[\uDEDB\uDF15\uDF4F\uDF89\uDFC3\uDFCE-\uDFFF]|\uD83A[\uDCD0-\uDCD6]|\uD83B[\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD00-\uDD0C\uDD6A\uDD6B\uDF00-\uDF2C\uDF30-\uDF7D\uDF80-\uDFCE\uDFD4-\uDFF7]|\uD83D[\uDC00-\uDCFE\uDD00-\uDD4A\uDD50-\uDD79\uDD7B-\uDDA3\uDDA5-\uDE42\uDE45-\uDECF\uDEE0-\uDEEC\uDEF0-\uDEF3\uDF00-\uDF73\uDF80-\uDFD4]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD]';
// jscs:enable maximumLineLength
// jshint ignore:end


},{}],8:[function(require,module,exports){
// DO NOT EDIT!
// THIS FILE IS GENERATED!

// All bidi characters found in classes 'R', 'AL', 'RLE', 'RLO', and 'RLI' as per Unicode 7.0.0.

// jshint ignore:start
// jscs:disable maximumLineLength
module.exports = '[\u05BE\u05C0\u05C3\u05C6\u05D0-\u05EA\u05F0-\u05F4\u0608\u060B\u060D\u061B\u061C\u061E-\u064A\u066D-\u066F\u0671-\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u070D\u070F\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0830-\u083E\u0840-\u0858\u085E\u08A0-\u08B2\u200F\u202B\u202E\u2067\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBC1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFC\uFE70-\uFE74\uFE76-\uFEFC]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC57-\uDC9E\uDCA7-\uDCAF\uDD00-\uDD1B\uDD20-\uDD39\uDD3F\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE40-\uDE47\uDE50-\uDE58\uDE60-\uDE9F\uDEC0-\uDEE4\uDEEB-\uDEF6\uDF00-\uDF35\uDF40-\uDF55\uDF58-\uDF72\uDF78-\uDF91\uDF99-\uDF9C\uDFA9-\uDFAF]|\uD803[\uDC00-\uDC48]|\uD83A[\uDC00-\uDCC4\uDCC7-\uDCCF]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]';
// jscs:enable maximumLineLength
// jshint ignore:end


},{}]},{},[5])(5)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL1VzZXJzL2V6ZXF1aWVsL0Rlc2t0b3AvcmVhY3QtdHlwZWFoZWFkLWNvbXBvbmVudC9zcmMvY29tcG9uZW50cy9hcmlhX3N0YXR1cy5qc3giLCIvVXNlcnMvZXplcXVpZWwvRGVza3RvcC9yZWFjdC10eXBlYWhlYWQtY29tcG9uZW50L3NyYy9jb21wb25lbnRzL2lucHV0LmpzeCIsIi9Vc2Vycy9lemVxdWllbC9EZXNrdG9wL3JlYWN0LXR5cGVhaGVhZC1jb21wb25lbnQvc3JjL2NvbXBvbmVudHMvdHlwZWFoZWFkLmpzeCIsIi9Vc2Vycy9lemVxdWllbC9EZXNrdG9wL3JlYWN0LXR5cGVhaGVhZC1jb21wb25lbnQvc3JjL2luZGV4LmpzIiwiL1VzZXJzL2V6ZXF1aWVsL0Rlc2t0b3AvcmVhY3QtdHlwZWFoZWFkLWNvbXBvbmVudC9zcmMvdXRpbHMvZ2V0X3RleHRfZGlyZWN0aW9uLmpzIiwiL1VzZXJzL2V6ZXF1aWVsL0Rlc2t0b3AvcmVhY3QtdHlwZWFoZWFkLWNvbXBvbmVudC9zcmMvdXRpbHMvbmV1dHJhbF9jaGFyc19yZWdleHAuanMiLCIvVXNlcnMvZXplcXVpZWwvRGVza3RvcC9yZWFjdC10eXBlYWhlYWQtY29tcG9uZW50L3NyYy91dGlscy9ydGxfY2hhcnNfcmVnZXhwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFDdEcsSUFBSSxXQUFXLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLHVCQUF1QixHQUFHLEtBQUssQ0FBQyxDQUFDOztBQUV2RSxNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsSUFBSSxFQUFFO0FBQ2hDLElBQUksSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDOztJQUVoQixJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDMUIsR0FBRyxHQUFHLEtBQUssQ0FBQztLQUNmLE1BQU0sSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQy9CLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDbkIsS0FBSzs7SUFFRCxPQUFPLEdBQUcsQ0FBQztDQUNkLENBQUM7Ozs7QUNqQkYsZUFBZTtBQUNmLDBCQUEwQjs7QUFFMUIsc0hBQXNIOztBQUV0SCxzQkFBc0I7QUFDdEIsaUNBQWlDO0FBQ2pDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsNjhJQUE2OEksQ0FBQztBQUMvOUksZ0NBQWdDO0FBQ2hDLG9CQUFvQjs7OztBQ1RwQixlQUFlO0FBQ2YsMEJBQTBCOztBQUUxQixnR0FBZ0c7O0FBRWhHLHNCQUFzQjtBQUN0QixpQ0FBaUM7QUFDakMsTUFBTSxDQUFDLE9BQU8sR0FBRyx3c0NBQXdzQyxDQUFDO0FBQzF0QyxnQ0FBZ0M7QUFDaEMsb0JBQW9CIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gdHJ1ZTtcbiAgICB2YXIgY3VycmVudFF1ZXVlO1xuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgICAgICAgICBjdXJyZW50UXVldWVbaV0oKTtcbiAgICAgICAgfVxuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG59XG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHF1ZXVlLnB1c2goZnVuKTtcbiAgICBpZiAoIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnQXJpYSBTdGF0dXMnLFxuXG4gICAgcHJvcFR5cGVzOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nID8ge30gOiB7XG4gICAgICAgIG1lc3NhZ2U6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbiAgICB9LFxuXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIC8vIFRoaXMgaXMgbmVlZGVkIGFzIGBjb21wb25lbnREaWRVcGRhdGVgXG4gICAgICAgIC8vIGRvZXMgbm90IGZpcmUgb24gdGhlIGluaXRpYWwgcmVuZGVyLlxuICAgICAgICBfdGhpcy5zZXRUZXh0Q29udGVudChfdGhpcy5wcm9wcy5tZXNzYWdlKTtcbiAgICB9LFxuXG4gICAgY29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICBfdGhpcy5zZXRUZXh0Q29udGVudChfdGhpcy5wcm9wcy5tZXNzYWdlKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgcm9sZT0nc3RhdHVzJ1xuICAgICAgICAgICAgICAgIGFyaWEtbGl2ZT0ncG9saXRlJ1xuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6ICctOTk5OXB4JyxcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgLy8gV2UgY2Fubm90IHNldCBgdGV4dENvbnRlbnRgIGRpcmVjdGx5IGluIGByZW5kZXJgLFxuICAgIC8vIGJlY2F1c2UgUmVhY3QgYWRkcy9kZWxldGVzIHRleHQgbm9kZXMgd2hlbiByZW5kZXJpbmcsXG4gICAgLy8gd2hpY2ggY29uZnVzZXMgc2NyZWVuIHJlYWRlcnMgYW5kIGRvZXNuJ3QgY2F1c2UgdGhlbSB0byByZWFkIGNoYW5nZXMuXG4gICAgc2V0VGV4dENvbnRlbnQ6IGZ1bmN0aW9uKHRleHRDb250ZW50KSB7XG4gICAgICAgIC8vIFdlIGNvdWxkIHNldCBgaW5uZXJIVE1MYCwgYnV0IGl0J3MgYmV0dGVyIHRvIGF2b2lkIGl0LlxuICAgICAgICB0aGlzLmdldERPTU5vZGUoKS50ZXh0Q29udGVudCA9IHRleHRDb250ZW50IHx8ICcnO1xuICAgIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ0lucHV0JyxcblxuICAgIHByb3BUeXBlczogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyA/IHt9IDoge1xuICAgICAgICB2YWx1ZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgb25DaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jXG4gICAgfSxcblxuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogJycsXG4gICAgICAgICAgICBvbkNoYW5nZTogZnVuY3Rpb24oKSB7fVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgICAgZGlyID0gX3RoaXMucHJvcHMuZGlyO1xuXG4gICAgICAgIGlmIChkaXIgPT09IG51bGwgfHwgZGlyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIFdoZW4gc2V0dGluZyBhbiBhdHRyaWJ1dGUgdG8gbnVsbC91bmRlZmluZWQsXG4gICAgICAgICAgICAvLyBSZWFjdCBpbnN0ZWFkIHNldHMgdGhlIGF0dHJpYnV0ZSB0byBhbiBlbXB0eSBzdHJpbmcuXG5cbiAgICAgICAgICAgIC8vIFRoaXMgaXMgbm90IGRlc2lyZWQgYmVjYXVzZSBvZiBhIHBvc3NpYmxlIGJ1ZyBpbiBDaHJvbWUuXG4gICAgICAgICAgICAvLyBJZiB0aGUgcGFnZSBpcyBSVEwsIGFuZCB0aGUgaW5wdXQncyBgZGlyYCBhdHRyaWJ1dGUgaXMgc2V0XG4gICAgICAgICAgICAvLyB0byBhbiBlbXB0eSBzdHJpbmcsIENocm9tZSBhc3N1bWVzIExUUiwgd2hpY2ggaXNuJ3Qgd2hhdCB3ZSB3YW50LlxuICAgICAgICAgICAgUmVhY3QuZmluZERPTU5vZGUoX3RoaXMpLnJlbW92ZUF0dHJpYnV0ZSgnZGlyJyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgey4uLl90aGlzLnByb3BzfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtfdGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICBoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciBwcm9wcyA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgLy8gVGhlcmUgYXJlIHNldmVyYWwgUmVhY3QgYnVncyBpbiBJRSxcbiAgICAgICAgLy8gd2hlcmUgdGhlIGBpbnB1dGAncyBgb25DaGFuZ2VgIGV2ZW50IGlzXG4gICAgICAgIC8vIGZpcmVkIGV2ZW4gd2hlbiB0aGUgdmFsdWUgZGlkbid0IGNoYW5nZS5cbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy8yMTg1XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9pc3N1ZXMvMzM3N1xuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LnZhbHVlICE9PSBwcm9wcy52YWx1ZSkge1xuICAgICAgICAgICAgcHJvcHMub25DaGFuZ2UoZXZlbnQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGJsdXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICBSZWFjdC5maW5kRE9NTm9kZSh0aGlzKS5ibHVyKCk7XG4gICAgfSxcblxuICAgIGlzQ3Vyc29yQXRFbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgICAgaW5wdXRET01Ob2RlID0gUmVhY3QuZmluZERPTU5vZGUoX3RoaXMpLFxuICAgICAgICAgICAgdmFsdWVMZW5ndGggPSBfdGhpcy5wcm9wcy52YWx1ZS5sZW5ndGg7XG5cbiAgICAgICAgcmV0dXJuIGlucHV0RE9NTm9kZS5zZWxlY3Rpb25TdGFydCA9PT0gdmFsdWVMZW5ndGggJiZcbiAgICAgICAgICAgICAgIGlucHV0RE9NTm9kZS5zZWxlY3Rpb25FbmQgPT09IHZhbHVlTGVuZ3RoO1xuICAgIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpLFxuICAgIElucHV0ID0gcmVxdWlyZSgnLi9pbnB1dC5qc3gnKSxcbiAgICBBcmlhU3RhdHVzID0gcmVxdWlyZSgnLi9hcmlhX3N0YXR1cy5qc3gnKSxcbiAgICBnZXRUZXh0RGlyZWN0aW9uID0gcmVxdWlyZSgnLi4vdXRpbHMvZ2V0X3RleHRfZGlyZWN0aW9uJyksXG4gICAgbm9vcCA9IGZ1bmN0aW9uKCkge307XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnVHlwZWFoZWFkJyxcblxuICAgIHByb3BUeXBlczogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyA/IHt9IDoge1xuICAgICAgICBpbnB1dElkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGF1dG9Gb2N1czogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgIGhvdmVyU2VsZWN0OiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgICAgICAgaW5wdXRWYWx1ZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgb3B0aW9uczogUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxuICAgICAgICBwbGFjZWhvbGRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgb25DaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbktleURvd246IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbktleVByZXNzOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25LZXlVcDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uRm9jdXM6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbkJsdXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvblNlbGVjdDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uSW5wdXRDbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIGhhbmRsZUhpbnQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbkNvbXBsZXRlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25PcHRpb25DbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uT3B0aW9uQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25Ecm9wZG93bk9wZW46IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbkRyb3Bkb3duQ2xvc2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvcHRpb25UZW1wbGF0ZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgICAgZ2V0TWVzc2FnZUZvck9wdGlvbjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIGdldE1lc3NhZ2VGb3JJbmNvbWluZ09wdGlvbnM6IFJlYWN0LlByb3BUeXBlcy5mdW5jXG4gICAgfSxcblxuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICcnLFxuICAgICAgICAgICAgaW5wdXRWYWx1ZTogJycsXG4gICAgICAgICAgICBvcHRpb25zOiBbXSxcbiAgICAgICAgICAgIGhvdmVyU2VsZWN0OiB0cnVlLFxuICAgICAgICAgICAgb25Gb2N1czogbm9vcCxcbiAgICAgICAgICAgIG9uS2V5RG93bjogbm9vcCxcbiAgICAgICAgICAgIG9uQ2hhbmdlOiBub29wLFxuICAgICAgICAgICAgb25JbnB1dENsaWNrOiBub29wLFxuICAgICAgICAgICAgaGFuZGxlSGludDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uT3B0aW9uQ2xpY2s6IG5vb3AsXG4gICAgICAgICAgICBvbk9wdGlvbkNoYW5nZTogbm9vcCxcbiAgICAgICAgICAgIG9uQ29tcGxldGU6ICBub29wLFxuICAgICAgICAgICAgb25Ecm9wZG93bk9wZW46IG5vb3AsXG4gICAgICAgICAgICBvbkRyb3Bkb3duQ2xvc2U6IG5vb3AsXG4gICAgICAgICAgICBnZXRNZXNzYWdlRm9yT3B0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0TWVzc2FnZUZvckluY29taW5nT3B0aW9uczogZnVuY3Rpb24obnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgbnVtYmVyICsgJyBzdWdnZXN0aW9ucyBhcmUgYXZhaWxhYmxlLiBVc2UgdXAgYW5kIGRvd24gYXJyb3dzIHRvIHNlbGVjdC4nXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgfSxcblxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzZWxlY3RlZEluZGV4OiAtMSxcbiAgICAgICAgICAgIGlzSGludFZpc2libGU6IGZhbHNlLFxuICAgICAgICAgICAgaXNEcm9wZG93blZpc2libGU6IGZhbHNlXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgICB1bmlxdWVJZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG4gICAgICAgIF90aGlzLnVzZXJJbnB1dFZhbHVlID0gbnVsbDtcbiAgICAgICAgX3RoaXMucHJldmlvdXNJbnB1dFZhbHVlID0gbnVsbDtcbiAgICAgICAgX3RoaXMuYWN0aXZlRGVzY2VuZGFudElkID0gJ3JlYWN0LXR5cGVhaGVhZC1hY3RpdmVkZXNjZW5kYW50LScgKyB1bmlxdWVJZDtcbiAgICAgICAgX3RoaXMub3B0aW9uc0lkID0gJ3JlYWN0LXR5cGVhaGVhZC1vcHRpb25zLScgKyB1bmlxdWVJZDtcbiAgICB9LFxuXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYWRkRXZlbnQgPSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcixcbiAgICAgICAgICAgIGhhbmRsZVdpbmRvd0Nsb3NlID0gdGhpcy5oYW5kbGVXaW5kb3dDbG9zZTtcblxuICAgICAgICAvLyBUaGUgYGZvY3VzYCBldmVudCBkb2VzIG5vdCBidWJibGUsIHNvIHdlIG11c3QgY2FwdHVyZSBpdCBpbnN0ZWFkLlxuICAgICAgICAvLyBUaGlzIGNsb3NlcyBUeXBlYWhlYWQncyBkcm9wZG93biB3aGVuZXZlciBzb21ldGhpbmcgZWxzZSBnYWlucyBmb2N1cy5cbiAgICAgICAgYWRkRXZlbnQoJ2ZvY3VzJywgaGFuZGxlV2luZG93Q2xvc2UsIHRydWUpO1xuXG4gICAgICAgIC8vIElmIHdlIGNsaWNrIGFueXdoZXJlIG91dHNpZGUgb2YgVHlwZWFoZWFkLCBjbG9zZSB0aGUgZHJvcGRvd24uXG4gICAgICAgIGFkZEV2ZW50KCdjbGljaycsIGhhbmRsZVdpbmRvd0Nsb3NlLCBmYWxzZSk7XG4gICAgfSxcblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJlbW92ZUV2ZW50ID0gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIsXG4gICAgICAgICAgICBoYW5kbGVXaW5kb3dDbG9zZSA9IHRoaXMuaGFuZGxlV2luZG93Q2xvc2U7XG5cbiAgICAgICAgcmVtb3ZlRXZlbnQoJ2ZvY3VzJywgaGFuZGxlV2luZG93Q2xvc2UsIHRydWUpO1xuICAgICAgICByZW1vdmVFdmVudCgnY2xpY2snLCBoYW5kbGVXaW5kb3dDbG9zZSwgZmFsc2UpO1xuICAgIH0sXG5cbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcbiAgICAgICAgdmFyIG5leHRWYWx1ZSA9IG5leHRQcm9wcy5pbnB1dFZhbHVlLFxuICAgICAgICAgICAgbmV4dE9wdGlvbnMgPSBuZXh0UHJvcHMub3B0aW9ucyxcbiAgICAgICAgICAgIHZhbHVlTGVuZ3RoID0gbmV4dFZhbHVlLmxlbmd0aCxcbiAgICAgICAgICAgIGlzSGludFZpc2libGUgPSB2YWx1ZUxlbmd0aCA+IDAgJiZcbiAgICAgICAgICAgICAgICAvLyBBIHZpc2libGUgcGFydCBvZiB0aGUgaGludCBtdXN0IGJlXG4gICAgICAgICAgICAgICAgLy8gYXZhaWxhYmxlIGZvciB1cyB0byBjb21wbGV0ZSBpdC5cbiAgICAgICAgICAgICAgICBuZXh0UHJvcHMuaGFuZGxlSGludChuZXh0VmFsdWUsIG5leHRPcHRpb25zKS5zbGljZSh2YWx1ZUxlbmd0aCkubGVuZ3RoID4gMDtcblxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlzSGludFZpc2libGU6IGlzSGludFZpc2libGVcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXsncmVhY3QtdHlwZWFoZWFkLWNvbnRhaW5lciAnICsgX3RoaXMucHJvcHMuY2xhc3NOYW1lfT5cbiAgICAgICAgICAgICAgICB7X3RoaXMucmVuZGVySW5wdXQoKX1cbiAgICAgICAgICAgICAgICB7X3RoaXMucmVuZGVyRHJvcGRvd24oKX1cbiAgICAgICAgICAgICAgICB7X3RoaXMucmVuZGVyQXJpYU1lc3NhZ2VGb3JPcHRpb25zKCl9XG4gICAgICAgICAgICAgICAge190aGlzLnJlbmRlckFyaWFNZXNzYWdlRm9ySW5jb21pbmdPcHRpb25zKCl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgcmVuZGVySW5wdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgICAgc3RhdGUgPSBfdGhpcy5zdGF0ZSxcbiAgICAgICAgICAgIHByb3BzID0gX3RoaXMucHJvcHMsXG4gICAgICAgICAgICBpbnB1dFZhbHVlID0gcHJvcHMuaW5wdXRWYWx1ZSxcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9ICdyZWFjdC10eXBlYWhlYWQtaW5wdXQnLFxuICAgICAgICAgICAgaW5wdXREaXJlY3Rpb24gPSBnZXRUZXh0RGlyZWN0aW9uKGlucHV0VmFsdWUpO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT0ncmVhY3QtdHlwZWFoZWFkLWlucHV0LWNvbnRhaW5lcic+XG4gICAgICAgICAgICAgICAgPElucHV0XG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXt0cnVlfVxuICAgICAgICAgICAgICAgICAgICByb2xlPSdwcmVzZW50YXRpb24nXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPXt0cnVlfVxuICAgICAgICAgICAgICAgICAgICBkaXI9e2lucHV0RGlyZWN0aW9ufVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZSArICcgcmVhY3QtdHlwZWFoZWFkLWhpbnQnfVxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICdzaWx2ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgV2Via2l0VGV4dEZpbGxDb2xvcjogJ3NpbHZlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17c3RhdGUuaXNIaW50VmlzaWJsZSA/IHByb3BzLmhhbmRsZUhpbnQoaW5wdXRWYWx1ZSwgcHJvcHMub3B0aW9ucykgOiBudWxsfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPElucHV0XG4gICAgICAgICAgICAgICAgICAgIHJlZj0naW5wdXQnXG4gICAgICAgICAgICAgICAgICAgIHJvbGU9J2NvbWJvYm94J1xuICAgICAgICAgICAgICAgICAgICBhcmlhLW93bnM9e190aGlzLm9wdGlvbnNJZH1cbiAgICAgICAgICAgICAgICAgICAgYXJpYS1leHBhbmRlZD17c3RhdGUuaXNEcm9wZG93blZpc2libGV9XG4gICAgICAgICAgICAgICAgICAgIGFyaWEtYXV0b2NvbXBsZXRlPSdib3RoJ1xuICAgICAgICAgICAgICAgICAgICBhcmlhLWFjdGl2ZWRlc2NlbmRhbnQ9e190aGlzLmFjdGl2ZURlc2NlbmRhbnRJZH1cbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2lucHV0VmFsdWV9XG4gICAgICAgICAgICAgICAgICAgIHNwZWxsQ2hlY2s9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICBhdXRvQ29tcGxldGU9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICBhdXRvQ29ycmVjdD17ZmFsc2V9XG4gICAgICAgICAgICAgICAgICAgIGRpcj17aW5wdXREaXJlY3Rpb259XG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e190aGlzLmhhbmRsZUNsaWNrfVxuICAgICAgICAgICAgICAgICAgICBvbkZvY3VzPXtfdGhpcy5oYW5kbGVGb2N1c31cbiAgICAgICAgICAgICAgICAgICAgb25CbHVyPXtwcm9wcy5vbkJsdXJ9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtfdGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICAgICAgICAgIG9uS2V5RG93bj17X3RoaXMuaGFuZGxlS2V5RG93bn1cbiAgICAgICAgICAgICAgICAgICAgaWQ9e3Byb3BzLmlucHV0SWR9XG4gICAgICAgICAgICAgICAgICAgIGF1dG9Gb2N1cz17cHJvcHMuYXV0b0ZvY3VzfVxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17cHJvcHMucGxhY2Vob2xkZXJ9XG4gICAgICAgICAgICAgICAgICAgIG9uU2VsZWN0PXtwcm9wcy5vblNlbGVjdH1cbiAgICAgICAgICAgICAgICAgICAgb25LZXlVcD17cHJvcHMub25LZXlVcH1cbiAgICAgICAgICAgICAgICAgICAgb25LZXlQcmVzcz17cHJvcHMub25LZXlQcmVzc31cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWUgKyAnIHJlYWN0LXR5cGVhaGVhZC11c2VydGV4dCd9XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCdcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIHJlbmRlckRyb3Bkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIHN0YXRlID0gX3RoaXMuc3RhdGUsXG4gICAgICAgICAgICBwcm9wcyA9IF90aGlzLnByb3BzLFxuICAgICAgICAgICAgT3B0aW9uVGVtcGxhdGUgPSBwcm9wcy5vcHRpb25UZW1wbGF0ZSxcbiAgICAgICAgICAgIHNlbGVjdGVkSW5kZXggPSBzdGF0ZS5zZWxlY3RlZEluZGV4LFxuICAgICAgICAgICAgaXNEcm9wZG93blZpc2libGUgPSBzdGF0ZS5pc0Ryb3Bkb3duVmlzaWJsZSxcbiAgICAgICAgICAgIGFjdGl2ZURlc2NlbmRhbnRJZCA9IF90aGlzLmFjdGl2ZURlc2NlbmRhbnRJZDtcblxuICAgICAgICBpZiAodGhpcy5wcm9wcy5vcHRpb25zLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDx1bCBpZD17X3RoaXMub3B0aW9uc0lkfVxuICAgICAgICAgICAgICAgIHJvbGU9J2xpc3Rib3gnXG4gICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49eyFpc0Ryb3Bkb3duVmlzaWJsZX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnI2ZmZicsXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogaXNEcm9wZG93blZpc2libGUgPyAnYmxvY2snIDogJ25vbmUnXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9J3JlYWN0LXR5cGVhaGVhZC1vcHRpb25zJ1xuICAgICAgICAgICAgICAgIG9uTW91c2VPdXQ9e3RoaXMuaGFuZGxlTW91c2VPdXR9PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcHMub3B0aW9ucy5tYXAoZnVuY3Rpb24oZGF0YSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpc1NlbGVjdGVkID0gc2VsZWN0ZWRJbmRleCA9PT0gaW5kZXg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGlkPXtpc1NlbGVjdGVkID8gYWN0aXZlRGVzY2VuZGFudElkIDogbnVsbH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1zZWxlY3RlZD17aXNTZWxlY3RlZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9sZT0nb3B0aW9uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtfdGhpcy5oYW5kbGVPcHRpb25DbGljay5iaW5kKF90aGlzLCBpbmRleCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VPdmVyPXtfdGhpcy5oYW5kbGVPcHRpb25Nb3VzZU92ZXIuYmluZChfdGhpcywgaW5kZXgpfT5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8T3B0aW9uVGVtcGxhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE9e2RhdGF9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VySW5wdXRWYWx1ZT17X3RoaXMudXNlcklucHV0VmFsdWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dFZhbHVlPXtwcm9wcy5pbnB1dFZhbHVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNTZWxlY3RlZD17aXNTZWxlY3RlZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICByZW5kZXJBcmlhTWVzc2FnZUZvck9wdGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgICAgcHJvcHMgPSBfdGhpcy5wcm9wcyxcbiAgICAgICAgICAgIGlucHV0VmFsdWUgPSBwcm9wcy5pbnB1dFZhbHVlLFxuICAgICAgICAgICAgb3B0aW9uID0gcHJvcHMub3B0aW9uc1tfdGhpcy5zdGF0ZS5zZWxlY3RlZEluZGV4XSB8fCBpbnB1dFZhbHVlO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8QXJpYVN0YXR1c1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U9e3Byb3BzLmdldE1lc3NhZ2VGb3JPcHRpb24ob3B0aW9uKSB8fCBpbnB1dFZhbHVlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyQXJpYU1lc3NhZ2VGb3JJbmNvbWluZ09wdGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcHJvcHMgPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8QXJpYVN0YXR1c1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U9e3Byb3BzLmdldE1lc3NhZ2VGb3JJbmNvbWluZ09wdGlvbnMocHJvcHMub3B0aW9ucy5sZW5ndGgpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgc2hvd0Ryb3Bkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICBpZiAoIV90aGlzLnN0YXRlLmlzRHJvcGRvd25WaXNpYmxlKSB7XG4gICAgICAgICAgICBfdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgaXNEcm9wZG93blZpc2libGU6IHRydWVcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIF90aGlzLnByb3BzLm9uRHJvcGRvd25PcGVuKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBoaWRlRHJvcGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIGlmIChfdGhpcy5zdGF0ZS5pc0Ryb3Bkb3duVmlzaWJsZSkge1xuICAgICAgICAgICAgX3RoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIGlzRHJvcGRvd25WaXNpYmxlOiBmYWxzZVxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMucHJvcHMub25Ecm9wZG93bkNsb3NlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzaG93SGludDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgICBwcm9wcyA9IF90aGlzLnByb3BzLFxuICAgICAgICAgICAgaW5wdXRWYWx1ZSA9IHByb3BzLmlucHV0VmFsdWUsXG4gICAgICAgICAgICBpbnB1dFZhbHVlTGVuZ3RoID0gaW5wdXRWYWx1ZS5sZW5ndGgsXG4gICAgICAgICAgICBpc0hpbnRWaXNpYmxlID0gaW5wdXRWYWx1ZUxlbmd0aCA+IDAgJiZcbiAgICAgICAgICAgICAgICAvLyBBIHZpc2libGUgcGFydCBvZiB0aGUgaGludCBtdXN0IGJlXG4gICAgICAgICAgICAgICAgLy8gYXZhaWxhYmxlIGZvciB1cyB0byBjb21wbGV0ZSBpdC5cbiAgICAgICAgICAgICAgICBwcm9wcy5oYW5kbGVIaW50KGlucHV0VmFsdWUsIHByb3BzLm9wdGlvbnMpLnNsaWNlKGlucHV0VmFsdWVMZW5ndGgpLmxlbmd0aCA+IDA7XG5cbiAgICAgICAgX3RoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaXNIaW50VmlzaWJsZTogaXNIaW50VmlzaWJsZVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgaGlkZUhpbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlzSGludFZpc2libGU6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzZXRTZWxlY3RlZEluZGV4OiBmdW5jdGlvbihpbmRleCwgY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBzZWxlY3RlZEluZGV4OiBpbmRleFxuICAgICAgICB9LCBjYWxsYmFjayk7XG4gICAgfSxcblxuICAgIGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICBfdGhpcy5zaG93SGludCgpO1xuICAgICAgICBfdGhpcy5zaG93RHJvcGRvd24oKTtcbiAgICAgICAgX3RoaXMuc2V0U2VsZWN0ZWRJbmRleCgtMSk7XG4gICAgICAgIF90aGlzLnByb3BzLm9uQ2hhbmdlKGV2ZW50KTtcbiAgICAgICAgX3RoaXMudXNlcklucHV0VmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgfSxcblxuICAgIGZvY3VzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5yZWZzLmlucHV0LmdldERPTU5vZGUoKS5mb2N1cygpO1xuICAgIH0sXG5cbiAgICBoYW5kbGVGb2N1czogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICBfdGhpcy5zaG93RHJvcGRvd24oKTtcbiAgICAgICAgX3RoaXMucHJvcHMub25Gb2N1cyhldmVudCk7XG4gICAgfSxcblxuICAgIGhhbmRsZUNsaWNrOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIF90aGlzLnNob3dIaW50KCk7XG4gICAgICAgIF90aGlzLnByb3BzLm9uSW5wdXRDbGljayhldmVudCk7XG4gICAgfSxcblxuICAgIG5hdmlnYXRlOiBmdW5jdGlvbihkaXJlY3Rpb24sIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgICBtaW5JbmRleCA9IC0xLFxuICAgICAgICAgICAgbWF4SW5kZXggPSBfdGhpcy5wcm9wcy5vcHRpb25zLmxlbmd0aCAtIDEsXG4gICAgICAgICAgICBpbmRleCA9IF90aGlzLnN0YXRlLnNlbGVjdGVkSW5kZXggKyBkaXJlY3Rpb247XG5cbiAgICAgICAgaWYgKGluZGV4ID4gbWF4SW5kZXgpIHtcbiAgICAgICAgICAgIGluZGV4ID0gbWluSW5kZXg7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5kZXggPCBtaW5JbmRleCkge1xuICAgICAgICAgICAgaW5kZXggPSBtYXhJbmRleDtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzLnNldFNlbGVjdGVkSW5kZXgoaW5kZXgsIGNhbGxiYWNrKTtcbiAgICB9LFxuXG4gICAgaGFuZGxlS2V5RG93bjogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIGtleSA9IGV2ZW50LmtleSxcbiAgICAgICAgICAgIHByb3BzID0gX3RoaXMucHJvcHMsXG4gICAgICAgICAgICBpbnB1dCA9IF90aGlzLnJlZnMuaW5wdXQsXG4gICAgICAgICAgICBpc0Ryb3Bkb3duVmlzaWJsZSA9IF90aGlzLnN0YXRlLmlzRHJvcGRvd25WaXNpYmxlLFxuICAgICAgICAgICAgaXNIaW50VmlzaWJsZSA9IF90aGlzLnN0YXRlLmlzSGludFZpc2libGUsXG4gICAgICAgICAgICBoYXNIYW5kbGVkS2V5RG93biA9IGZhbHNlLFxuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICBvcHRpb25EYXRhLFxuICAgICAgICAgICAgZGlyO1xuXG4gICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgIGNhc2UgJ0VuZCc6XG4gICAgICAgIGNhc2UgJ1RhYic6XG4gICAgICAgICAgICBpZiAoaXNIaW50VmlzaWJsZSAmJiAhZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHByb3BzLm9uQ29tcGxldGUoZXZlbnQsIHByb3BzLmhhbmRsZUhpbnQocHJvcHMuaW5wdXRWYWx1ZSwgcHJvcHMub3B0aW9ucykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6XG4gICAgICAgIGNhc2UgJ0Fycm93UmlnaHQnOlxuICAgICAgICAgICAgaWYgKGlzSGludFZpc2libGUgJiYgIWV2ZW50LnNoaWZ0S2V5ICYmIGlucHV0LmlzQ3Vyc29yQXRFbmQoKSkge1xuICAgICAgICAgICAgICAgIGRpciA9IGdldFRleHREaXJlY3Rpb24ocHJvcHMuaW5wdXRWYWx1ZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoKGRpciA9PT0gJ2x0cicgJiYga2V5ID09PSAnQXJyb3dSaWdodCcpIHx8IChkaXIgPT09ICdydGwnICYmIGtleSA9PT0gJ0Fycm93TGVmdCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BzLm9uQ29tcGxldGUoZXZlbnQsIHByb3BzLmhhbmRsZUhpbnQocHJvcHMuaW5wdXRWYWx1ZSwgcHJvcHMub3B0aW9ucykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdFbnRlcic6XG4gICAgICAgICAgICBpbnB1dC5ibHVyKCk7XG4gICAgICAgICAgICBfdGhpcy5oaWRlSGludCgpO1xuICAgICAgICAgICAgX3RoaXMuaGlkZURyb3Bkb3duKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnRXNjYXBlJzpcbiAgICAgICAgICAgIF90aGlzLmhpZGVIaW50KCk7XG4gICAgICAgICAgICBfdGhpcy5oaWRlRHJvcGRvd24oKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdBcnJvd1VwJzpcbiAgICAgICAgY2FzZSAnQXJyb3dEb3duJzpcbiAgICAgICAgICAgIGlmIChwcm9wcy5vcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgX3RoaXMuc2hvd0hpbnQoKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5zaG93RHJvcGRvd24oKTtcblxuICAgICAgICAgICAgICAgIGlmIChpc0Ryb3Bkb3duVmlzaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICBkaXIgPSBrZXkgPT09ICdBcnJvd1VwJyA/IC0xOiAxO1xuICAgICAgICAgICAgICAgICAgICBoYXNIYW5kbGVkS2V5RG93biA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubmF2aWdhdGUoZGlyLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZEluZGV4ID0gX3RoaXMuc3RhdGUuc2VsZWN0ZWRJbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2aW91c0lucHV0VmFsdWUgPSBfdGhpcy5wcmV2aW91c0lucHV0VmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uRGF0YSA9IHByZXZpb3VzSW5wdXRWYWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UncmUgY3VycmVudGx5IG9uIGFuIG9wdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTYXZlIHRoZSBjdXJyZW50IGBpbnB1dGAgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXMgd2UgbWlnaHQgYXJyb3cgYmFjayB0byBpdCBsYXRlci5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldmlvdXNJbnB1dFZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnByZXZpb3VzSW5wdXRWYWx1ZSA9IHByb3BzLmlucHV0VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uRGF0YSA9IHByb3BzLm9wdGlvbnNbc2VsZWN0ZWRJbmRleF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzLm9uT3B0aW9uQ2hhbmdlKGV2ZW50LCBvcHRpb25EYXRhLCBzZWxlY3RlZEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzLm9uS2V5RG93bihldmVudCwgb3B0aW9uRGF0YSwgc2VsZWN0ZWRJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWhhc0hhbmRsZWRLZXlEb3duKSB7XG4gICAgICAgICAgICBpbmRleCA9IHRoaXMuc3RhdGUuc2VsZWN0ZWRJbmRleDtcbiAgICAgICAgICAgIG9wdGlvbkRhdGEgPSBpbmRleCA8IDAgPyBwcm9wcy5pbnB1dFZhbHVlIDogcHJvcHMub3B0aW9uc1tpbmRleF07XG4gICAgICAgICAgICBwcm9wcy5vbktleURvd24oZXZlbnQsIG9wdGlvbkRhdGEsIGluZGV4KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBoYW5kbGVPcHRpb25DbGljazogZnVuY3Rpb24oc2VsZWN0ZWRJbmRleCwgZXZlbnQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIHByb3BzID0gX3RoaXMucHJvcHM7XG5cbiAgICAgICAgX3RoaXMuaGlkZUhpbnQoKTtcbiAgICAgICAgX3RoaXMuaGlkZURyb3Bkb3duKCk7XG4gICAgICAgIF90aGlzLnNldFNlbGVjdGVkSW5kZXgoc2VsZWN0ZWRJbmRleCk7XG4gICAgICAgIHByb3BzLm9uT3B0aW9uQ2xpY2soZXZlbnQsIHByb3BzLm9wdGlvbnNbc2VsZWN0ZWRJbmRleF0sIHNlbGVjdGVkSW5kZXgpO1xuICAgIH0sXG5cbiAgICBoYW5kbGVPcHRpb25Nb3VzZU92ZXI6IGZ1bmN0aW9uKHNlbGVjdGVkSW5kZXgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICBpZiAoX3RoaXMucHJvcHMuaG92ZXJTZWxlY3QpIHtcbiAgICAgICAgICAgIF90aGlzLnNldFNlbGVjdGVkSW5kZXgoc2VsZWN0ZWRJbmRleCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgaGFuZGxlTW91c2VPdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIGlmIChfdGhpcy5wcm9wcy5ob3ZlclNlbGVjdCkge1xuICAgICAgICAgICAgX3RoaXMuc2V0U2VsZWN0ZWRJbmRleCgtMSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgaGFuZGxlV2luZG93Q2xvc2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgICB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG5cbiAgICAgICAgaWYgKHRhcmdldCAhPT0gd2luZG93ICYmICF0aGlzLmdldERPTU5vZGUoKS5jb250YWlucyh0YXJnZXQpKSB7XG4gICAgICAgICAgICBfdGhpcy5oaWRlSGludCgpO1xuICAgICAgICAgICAgX3RoaXMuaGlkZURyb3Bkb3duKCk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3R5cGVhaGVhZC5qc3gnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFJUTENoYXJhY3RlcnNSZWdFeHAgPSByZXF1aXJlKCcuL3J0bF9jaGFyc19yZWdleHAnKSxcbiAgICBOZXV0cmFsQ2hhcmFjdGVyc1JlZ0V4cCA9IHJlcXVpcmUoJy4vbmV1dHJhbF9jaGFyc19yZWdleHAnKSxcbiAgICBzdGFydHNXaXRoUlRMID0gbmV3IFJlZ0V4cCgnXig/OicgKyBOZXV0cmFsQ2hhcmFjdGVyc1JlZ0V4cCArICcpKig/OicgKyBSVExDaGFyYWN0ZXJzUmVnRXhwICsgJyknKSxcbiAgICBuZXV0cmFsVGV4dCA9IG5ldyBSZWdFeHAoJ14oPzonICsgTmV1dHJhbENoYXJhY3RlcnNSZWdFeHAgKyAnKSokJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHZhciBkaXIgPSAnbHRyJztcblxuICAgIGlmIChzdGFydHNXaXRoUlRMLnRlc3QodGV4dCkpIHtcbiAgICAgICAgZGlyID0gJ3J0bCc7XG4gICAgfSBlbHNlIGlmIChuZXV0cmFsVGV4dC50ZXN0KHRleHQpKSB7XG4gICAgICAgIGRpciA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpcjtcbn07XG4iLCIvLyBETyBOT1QgRURJVCFcbi8vIFRISVMgRklMRSBJUyBHRU5FUkFURUQhXG5cbi8vIEFsbCBiaWRpIGNoYXJhY3RlcnMgZXhjZXB0IHRob3NlIGZvdW5kIGluIGNsYXNzZXMgJ0wnIChMVFIpLCAnUicgKFJUTCksIGFuZCAnQUwnIChSVEwgQXJhYmljKSBhcyBwZXIgVW5pY29kZSA3LjAuMC5cblxuLy8ganNoaW50IGlnbm9yZTpzdGFydFxuLy8ganNjczpkaXNhYmxlIG1heGltdW1MaW5lTGVuZ3RoXG5tb2R1bGUuZXhwb3J0cyA9ICdbXFwwLUBcXFstYFxcey1cXHhBOVxceEFCLVxceEI0XFx4QjYtXFx4QjlcXHhCQi1cXHhCRlxceEQ3XFx4RjdcXHUwMkI5XFx1MDJCQVxcdTAyQzItXFx1MDJDRlxcdTAyRDItXFx1MDJERlxcdTAyRTUtXFx1MDJFRFxcdTAyRUYtXFx1MDM2RlxcdTAzNzRcXHUwMzc1XFx1MDM3RVxcdTAzODRcXHUwMzg1XFx1MDM4N1xcdTAzRjZcXHUwNDgzLVxcdTA0ODlcXHUwNThBXFx1MDU4RC1cXHUwNThGXFx1MDU5MS1cXHUwNUJEXFx1MDVCRlxcdTA1QzFcXHUwNUMyXFx1MDVDNFxcdTA1QzVcXHUwNUM3XFx1MDYwMC1cXHUwNjA3XFx1MDYwOVxcdTA2MEFcXHUwNjBDXFx1MDYwRS1cXHUwNjFBXFx1MDY0Qi1cXHUwNjZDXFx1MDY3MFxcdTA2RDYtXFx1MDZFNFxcdTA2RTctXFx1MDZFRFxcdTA2RjAtXFx1MDZGOVxcdTA3MTFcXHUwNzMwLVxcdTA3NEFcXHUwN0E2LVxcdTA3QjBcXHUwN0VCLVxcdTA3RjNcXHUwN0Y2LVxcdTA3RjlcXHUwODE2LVxcdTA4MTlcXHUwODFCLVxcdTA4MjNcXHUwODI1LVxcdTA4MjdcXHUwODI5LVxcdTA4MkRcXHUwODU5LVxcdTA4NUJcXHUwOEU0LVxcdTA5MDJcXHUwOTNBXFx1MDkzQ1xcdTA5NDEtXFx1MDk0OFxcdTA5NERcXHUwOTUxLVxcdTA5NTdcXHUwOTYyXFx1MDk2M1xcdTA5ODFcXHUwOUJDXFx1MDlDMS1cXHUwOUM0XFx1MDlDRFxcdTA5RTJcXHUwOUUzXFx1MDlGMlxcdTA5RjNcXHUwOUZCXFx1MEEwMVxcdTBBMDJcXHUwQTNDXFx1MEE0MVxcdTBBNDJcXHUwQTQ3XFx1MEE0OFxcdTBBNEItXFx1MEE0RFxcdTBBNTFcXHUwQTcwXFx1MEE3MVxcdTBBNzVcXHUwQTgxXFx1MEE4MlxcdTBBQkNcXHUwQUMxLVxcdTBBQzVcXHUwQUM3XFx1MEFDOFxcdTBBQ0RcXHUwQUUyXFx1MEFFM1xcdTBBRjFcXHUwQjAxXFx1MEIzQ1xcdTBCM0ZcXHUwQjQxLVxcdTBCNDRcXHUwQjREXFx1MEI1NlxcdTBCNjJcXHUwQjYzXFx1MEI4MlxcdTBCQzBcXHUwQkNEXFx1MEJGMy1cXHUwQkZBXFx1MEMwMFxcdTBDM0UtXFx1MEM0MFxcdTBDNDYtXFx1MEM0OFxcdTBDNEEtXFx1MEM0RFxcdTBDNTVcXHUwQzU2XFx1MEM2MlxcdTBDNjNcXHUwQzc4LVxcdTBDN0VcXHUwQzgxXFx1MENCQ1xcdTBDQ0NcXHUwQ0NEXFx1MENFMlxcdTBDRTNcXHUwRDAxXFx1MEQ0MS1cXHUwRDQ0XFx1MEQ0RFxcdTBENjJcXHUwRDYzXFx1MERDQVxcdTBERDItXFx1MERENFxcdTBERDZcXHUwRTMxXFx1MEUzNC1cXHUwRTNBXFx1MEUzRlxcdTBFNDctXFx1MEU0RVxcdTBFQjFcXHUwRUI0LVxcdTBFQjlcXHUwRUJCXFx1MEVCQ1xcdTBFQzgtXFx1MEVDRFxcdTBGMThcXHUwRjE5XFx1MEYzNVxcdTBGMzdcXHUwRjM5LVxcdTBGM0RcXHUwRjcxLVxcdTBGN0VcXHUwRjgwLVxcdTBGODRcXHUwRjg2XFx1MEY4N1xcdTBGOEQtXFx1MEY5N1xcdTBGOTktXFx1MEZCQ1xcdTBGQzZcXHUxMDJELVxcdTEwMzBcXHUxMDMyLVxcdTEwMzdcXHUxMDM5XFx1MTAzQVxcdTEwM0RcXHUxMDNFXFx1MTA1OFxcdTEwNTlcXHUxMDVFLVxcdTEwNjBcXHUxMDcxLVxcdTEwNzRcXHUxMDgyXFx1MTA4NVxcdTEwODZcXHUxMDhEXFx1MTA5RFxcdTEzNUQtXFx1MTM1RlxcdTEzOTAtXFx1MTM5OVxcdTE0MDBcXHUxNjgwXFx1MTY5QlxcdTE2OUNcXHUxNzEyLVxcdTE3MTRcXHUxNzMyLVxcdTE3MzRcXHUxNzUyXFx1MTc1M1xcdTE3NzJcXHUxNzczXFx1MTdCNFxcdTE3QjVcXHUxN0I3LVxcdTE3QkRcXHUxN0M2XFx1MTdDOS1cXHUxN0QzXFx1MTdEQlxcdTE3RERcXHUxN0YwLVxcdTE3RjlcXHUxODAwLVxcdTE4MEVcXHUxOEE5XFx1MTkyMC1cXHUxOTIyXFx1MTkyN1xcdTE5MjhcXHUxOTMyXFx1MTkzOS1cXHUxOTNCXFx1MTk0MFxcdTE5NDRcXHUxOTQ1XFx1MTlERS1cXHUxOUZGXFx1MUExN1xcdTFBMThcXHUxQTFCXFx1MUE1NlxcdTFBNTgtXFx1MUE1RVxcdTFBNjBcXHUxQTYyXFx1MUE2NS1cXHUxQTZDXFx1MUE3My1cXHUxQTdDXFx1MUE3RlxcdTFBQjAtXFx1MUFCRVxcdTFCMDAtXFx1MUIwM1xcdTFCMzRcXHUxQjM2LVxcdTFCM0FcXHUxQjNDXFx1MUI0MlxcdTFCNkItXFx1MUI3M1xcdTFCODBcXHUxQjgxXFx1MUJBMi1cXHUxQkE1XFx1MUJBOFxcdTFCQTlcXHUxQkFCLVxcdTFCQURcXHUxQkU2XFx1MUJFOFxcdTFCRTlcXHUxQkVEXFx1MUJFRi1cXHUxQkYxXFx1MUMyQy1cXHUxQzMzXFx1MUMzNlxcdTFDMzdcXHUxQ0QwLVxcdTFDRDJcXHUxQ0Q0LVxcdTFDRTBcXHUxQ0UyLVxcdTFDRThcXHUxQ0VEXFx1MUNGNFxcdTFDRjhcXHUxQ0Y5XFx1MURDMC1cXHUxREY1XFx1MURGQy1cXHUxREZGXFx1MUZCRFxcdTFGQkYtXFx1MUZDMVxcdTFGQ0QtXFx1MUZDRlxcdTFGREQtXFx1MUZERlxcdTFGRUQtXFx1MUZFRlxcdTFGRkRcXHUxRkZFXFx1MjAwMC1cXHUyMDBEXFx1MjAxMC1cXHUyMDI5XFx1MjAyRi1cXHUyMDY0XFx1MjA2OFxcdTIwNkEtXFx1MjA3MFxcdTIwNzQtXFx1MjA3RVxcdTIwODAtXFx1MjA4RVxcdTIwQTAtXFx1MjBCRFxcdTIwRDAtXFx1MjBGMFxcdTIxMDBcXHUyMTAxXFx1MjEwMy1cXHUyMTA2XFx1MjEwOFxcdTIxMDlcXHUyMTE0XFx1MjExNi1cXHUyMTE4XFx1MjExRS1cXHUyMTIzXFx1MjEyNVxcdTIxMjdcXHUyMTI5XFx1MjEyRVxcdTIxM0FcXHUyMTNCXFx1MjE0MC1cXHUyMTQ0XFx1MjE0QS1cXHUyMTREXFx1MjE1MC1cXHUyMTVGXFx1MjE4OVxcdTIxOTAtXFx1MjMzNVxcdTIzN0ItXFx1MjM5NFxcdTIzOTYtXFx1MjNGQVxcdTI0MDAtXFx1MjQyNlxcdTI0NDAtXFx1MjQ0QVxcdTI0NjAtXFx1MjQ5QlxcdTI0RUEtXFx1MjZBQlxcdTI2QUQtXFx1MjdGRlxcdTI5MDAtXFx1MkI3M1xcdTJCNzYtXFx1MkI5NVxcdTJCOTgtXFx1MkJCOVxcdTJCQkQtXFx1MkJDOFxcdTJCQ0EtXFx1MkJEMVxcdTJDRTUtXFx1MkNFQVxcdTJDRUYtXFx1MkNGMVxcdTJDRjktXFx1MkNGRlxcdTJEN0ZcXHUyREUwLVxcdTJFNDJcXHUyRTgwLVxcdTJFOTlcXHUyRTlCLVxcdTJFRjNcXHUyRjAwLVxcdTJGRDVcXHUyRkYwLVxcdTJGRkJcXHUzMDAwLVxcdTMwMDRcXHUzMDA4LVxcdTMwMjBcXHUzMDJBLVxcdTMwMkRcXHUzMDMwXFx1MzAzNlxcdTMwMzdcXHUzMDNELVxcdTMwM0ZcXHUzMDk5LVxcdTMwOUNcXHUzMEEwXFx1MzBGQlxcdTMxQzAtXFx1MzFFM1xcdTMyMURcXHUzMjFFXFx1MzI1MC1cXHUzMjVGXFx1MzI3Qy1cXHUzMjdFXFx1MzJCMS1cXHUzMkJGXFx1MzJDQy1cXHUzMkNGXFx1MzM3Ny1cXHUzMzdBXFx1MzNERVxcdTMzREZcXHUzM0ZGXFx1NERDMC1cXHU0REZGXFx1QTQ5MC1cXHVBNEM2XFx1QTYwRC1cXHVBNjBGXFx1QTY2Ri1cXHVBNjdGXFx1QTY5RlxcdUE2RjBcXHVBNkYxXFx1QTcwMC1cXHVBNzIxXFx1QTc4OFxcdUE4MDJcXHVBODA2XFx1QTgwQlxcdUE4MjVcXHVBODI2XFx1QTgyOC1cXHVBODJCXFx1QTgzOFxcdUE4MzlcXHVBODc0LVxcdUE4NzdcXHVBOEM0XFx1QThFMC1cXHVBOEYxXFx1QTkyNi1cXHVBOTJEXFx1QTk0Ny1cXHVBOTUxXFx1QTk4MC1cXHVBOTgyXFx1QTlCM1xcdUE5QjYtXFx1QTlCOVxcdUE5QkNcXHVBOUU1XFx1QUEyOS1cXHVBQTJFXFx1QUEzMVxcdUFBMzJcXHVBQTM1XFx1QUEzNlxcdUFBNDNcXHVBQTRDXFx1QUE3Q1xcdUFBQjBcXHVBQUIyLVxcdUFBQjRcXHVBQUI3XFx1QUFCOFxcdUFBQkVcXHVBQUJGXFx1QUFDMVxcdUFBRUNcXHVBQUVEXFx1QUFGNlxcdUFCRTVcXHVBQkU4XFx1QUJFRFxcdUZCMUVcXHVGQjI5XFx1RkQzRVxcdUZEM0ZcXHVGREZEXFx1RkUwMC1cXHVGRTE5XFx1RkUyMC1cXHVGRTJEXFx1RkUzMC1cXHVGRTUyXFx1RkU1NC1cXHVGRTY2XFx1RkU2OC1cXHVGRTZCXFx1RkVGRlxcdUZGMDEtXFx1RkYyMFxcdUZGM0ItXFx1RkY0MFxcdUZGNUItXFx1RkY2NVxcdUZGRTAtXFx1RkZFNlxcdUZGRTgtXFx1RkZFRVxcdUZGRjktXFx1RkZGRF18XFx1RDgwMFtcXHVERDAxXFx1REQ0MC1cXHVERDhDXFx1REQ5MC1cXHVERDlCXFx1RERBMFxcdURERkRcXHVERUUwLVxcdURFRkJcXHVERjc2LVxcdURGN0FdfFxcdUQ4MDJbXFx1REQxRlxcdURFMDEtXFx1REUwM1xcdURFMDVcXHVERTA2XFx1REUwQy1cXHVERTBGXFx1REUzOC1cXHVERTNBXFx1REUzRlxcdURFRTVcXHVERUU2XFx1REYzOS1cXHVERjNGXXxcXHVEODAzW1xcdURFNjAtXFx1REU3RV18W1xcdUQ4MDRcXHVEQjQwXVtcXHVEQzAxXFx1REMzOC1cXHVEQzQ2XFx1REM1Mi1cXHVEQzY1XFx1REM3Ri1cXHVEQzgxXFx1RENCMy1cXHVEQ0I2XFx1RENCOVxcdURDQkFcXHVERDAwLVxcdUREMDJcXHVERDI3LVxcdUREMkJcXHVERDJELVxcdUREMzRcXHVERDczXFx1REQ4MFxcdUREODFcXHVEREI2LVxcdUREQkVcXHVERTJGLVxcdURFMzFcXHVERTM0XFx1REUzNlxcdURFMzdcXHVERURGXFx1REVFMy1cXHVERUVBXFx1REYwMVxcdURGM0NcXHVERjQwXFx1REY2Ni1cXHVERjZDXFx1REY3MC1cXHVERjc0XXxcXHVEODA1W1xcdURDQjMtXFx1RENCOFxcdURDQkFcXHVEQ0JGXFx1RENDMFxcdURDQzJcXHVEQ0MzXFx1RERCMi1cXHVEREI1XFx1RERCQ1xcdUREQkRcXHVEREJGXFx1RERDMFxcdURFMzMtXFx1REUzQVxcdURFM0RcXHVERTNGXFx1REU0MFxcdURFQUJcXHVERUFEXFx1REVCMC1cXHVERUI1XFx1REVCN118XFx1RDgxQVtcXHVERUYwLVxcdURFRjRcXHVERjMwLVxcdURGMzZdfFxcdUQ4MUJbXFx1REY4Ri1cXHVERjkyXXxcXHVEODJGW1xcdURDOURcXHVEQzlFXFx1RENBMC1cXHVEQ0EzXXxcXHVEODM0W1xcdURENjctXFx1REQ2OVxcdURENzMtXFx1REQ4MlxcdUREODUtXFx1REQ4QlxcdUREQUEtXFx1RERBRFxcdURFMDAtXFx1REU0NVxcdURGMDAtXFx1REY1Nl18XFx1RDgzNVtcXHVERURCXFx1REYxNVxcdURGNEZcXHVERjg5XFx1REZDM1xcdURGQ0UtXFx1REZGRl18XFx1RDgzQVtcXHVEQ0QwLVxcdURDRDZdfFxcdUQ4M0JbXFx1REVGMFxcdURFRjFdfFxcdUQ4M0NbXFx1REMwMC1cXHVEQzJCXFx1REMzMC1cXHVEQzkzXFx1RENBMC1cXHVEQ0FFXFx1RENCMS1cXHVEQ0JGXFx1RENDMS1cXHVEQ0NGXFx1RENEMS1cXHVEQ0Y1XFx1REQwMC1cXHVERDBDXFx1REQ2QVxcdURENkJcXHVERjAwLVxcdURGMkNcXHVERjMwLVxcdURGN0RcXHVERjgwLVxcdURGQ0VcXHVERkQ0LVxcdURGRjddfFxcdUQ4M0RbXFx1REMwMC1cXHVEQ0ZFXFx1REQwMC1cXHVERDRBXFx1REQ1MC1cXHVERDc5XFx1REQ3Qi1cXHVEREEzXFx1RERBNS1cXHVERTQyXFx1REU0NS1cXHVERUNGXFx1REVFMC1cXHVERUVDXFx1REVGMC1cXHVERUYzXFx1REYwMC1cXHVERjczXFx1REY4MC1cXHVERkQ0XXxcXHVEODNFW1xcdURDMDAtXFx1REMwQlxcdURDMTAtXFx1REM0N1xcdURDNTAtXFx1REM1OVxcdURDNjAtXFx1REM4N1xcdURDOTAtXFx1RENBRF0nO1xuLy8ganNjczplbmFibGUgbWF4aW11bUxpbmVMZW5ndGhcbi8vIGpzaGludCBpZ25vcmU6ZW5kXG4iLCIvLyBETyBOT1QgRURJVCFcbi8vIFRISVMgRklMRSBJUyBHRU5FUkFURUQhXG5cbi8vIEFsbCBiaWRpIGNoYXJhY3RlcnMgZm91bmQgaW4gY2xhc3NlcyAnUicsICdBTCcsICdSTEUnLCAnUkxPJywgYW5kICdSTEknIGFzIHBlciBVbmljb2RlIDcuMC4wLlxuXG4vLyBqc2hpbnQgaWdub3JlOnN0YXJ0XG4vLyBqc2NzOmRpc2FibGUgbWF4aW11bUxpbmVMZW5ndGhcbm1vZHVsZS5leHBvcnRzID0gJ1tcXHUwNUJFXFx1MDVDMFxcdTA1QzNcXHUwNUM2XFx1MDVEMC1cXHUwNUVBXFx1MDVGMC1cXHUwNUY0XFx1MDYwOFxcdTA2MEJcXHUwNjBEXFx1MDYxQlxcdTA2MUNcXHUwNjFFLVxcdTA2NEFcXHUwNjZELVxcdTA2NkZcXHUwNjcxLVxcdTA2RDVcXHUwNkU1XFx1MDZFNlxcdTA2RUVcXHUwNkVGXFx1MDZGQS1cXHUwNzBEXFx1MDcwRlxcdTA3MTBcXHUwNzEyLVxcdTA3MkZcXHUwNzRELVxcdTA3QTVcXHUwN0IxXFx1MDdDMC1cXHUwN0VBXFx1MDdGNFxcdTA3RjVcXHUwN0ZBXFx1MDgwMC1cXHUwODE1XFx1MDgxQVxcdTA4MjRcXHUwODI4XFx1MDgzMC1cXHUwODNFXFx1MDg0MC1cXHUwODU4XFx1MDg1RVxcdTA4QTAtXFx1MDhCMlxcdTIwMEZcXHUyMDJCXFx1MjAyRVxcdTIwNjdcXHVGQjFEXFx1RkIxRi1cXHVGQjI4XFx1RkIyQS1cXHVGQjM2XFx1RkIzOC1cXHVGQjNDXFx1RkIzRVxcdUZCNDBcXHVGQjQxXFx1RkI0M1xcdUZCNDRcXHVGQjQ2LVxcdUZCQzFcXHVGQkQzLVxcdUZEM0RcXHVGRDUwLVxcdUZEOEZcXHVGRDkyLVxcdUZEQzdcXHVGREYwLVxcdUZERkNcXHVGRTcwLVxcdUZFNzRcXHVGRTc2LVxcdUZFRkNdfFxcdUQ4MDJbXFx1REMwMC1cXHVEQzA1XFx1REMwOFxcdURDMEEtXFx1REMzNVxcdURDMzdcXHVEQzM4XFx1REMzQ1xcdURDM0YtXFx1REM1NVxcdURDNTctXFx1REM5RVxcdURDQTctXFx1RENBRlxcdUREMDAtXFx1REQxQlxcdUREMjAtXFx1REQzOVxcdUREM0ZcXHVERDgwLVxcdUREQjdcXHVEREJFXFx1RERCRlxcdURFMDBcXHVERTEwLVxcdURFMTNcXHVERTE1LVxcdURFMTdcXHVERTE5LVxcdURFMzNcXHVERTQwLVxcdURFNDdcXHVERTUwLVxcdURFNThcXHVERTYwLVxcdURFOUZcXHVERUMwLVxcdURFRTRcXHVERUVCLVxcdURFRjZcXHVERjAwLVxcdURGMzVcXHVERjQwLVxcdURGNTVcXHVERjU4LVxcdURGNzJcXHVERjc4LVxcdURGOTFcXHVERjk5LVxcdURGOUNcXHVERkE5LVxcdURGQUZdfFxcdUQ4MDNbXFx1REMwMC1cXHVEQzQ4XXxcXHVEODNBW1xcdURDMDAtXFx1RENDNFxcdURDQzctXFx1RENDRl18XFx1RDgzQltcXHVERTAwLVxcdURFMDNcXHVERTA1LVxcdURFMUZcXHVERTIxXFx1REUyMlxcdURFMjRcXHVERTI3XFx1REUyOS1cXHVERTMyXFx1REUzNC1cXHVERTM3XFx1REUzOVxcdURFM0JcXHVERTQyXFx1REU0N1xcdURFNDlcXHVERTRCXFx1REU0RC1cXHVERTRGXFx1REU1MVxcdURFNTJcXHVERTU0XFx1REU1N1xcdURFNTlcXHVERTVCXFx1REU1RFxcdURFNUZcXHVERTYxXFx1REU2MlxcdURFNjRcXHVERTY3LVxcdURFNkFcXHVERTZDLVxcdURFNzJcXHVERTc0LVxcdURFNzdcXHVERTc5LVxcdURFN0NcXHVERTdFXFx1REU4MC1cXHVERTg5XFx1REU4Qi1cXHVERTlCXFx1REVBMS1cXHVERUEzXFx1REVBNS1cXHVERUE5XFx1REVBQi1cXHVERUJCXSc7XG4vLyBqc2NzOmVuYWJsZSBtYXhpbXVtTGluZUxlbmd0aFxuLy8ganNoaW50IGlnbm9yZTplbmRcbiJdfQ==
