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
            inputValue: '',
            options: [],
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
            getMessageForIncomingOptions: function() {
                return 'Suggestions are available. Use up and down arrows to select.';
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
                        position: 'absolute',
                        background: 'transparent'
                    }}
                ), 

                React.createElement(Input, {
                    disabled: true, 
                    role: "presentation", 
                    "aria-hidden": true, 
                    dir: inputDirection, 
                    className: className + ' react-typeahead-hint', 
                    style: {
                        color: 'silver',
                        WebkitTextFillColor: 'silver'
                    }, 
                    value: state.isHintVisible ? props.handleHint(inputValue, props.options) : null}
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
        return (
            React.createElement(AriaStatus, {
                message: this.props.getMessageForIncomingOptions()}
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
        this.setSelectedIndex(selectedIndex);
    },

    handleMouseOut: function() {
        this.setSelectedIndex(-1);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL1VzZXJzL2V6ZXF1aWVsL0Rlc2t0b3AvcmVhY3QtdHlwZWFoZWFkLWNvbXBvbmVudC9zcmMvY29tcG9uZW50cy9hcmlhX3N0YXR1cy5qc3giLCIvVXNlcnMvZXplcXVpZWwvRGVza3RvcC9yZWFjdC10eXBlYWhlYWQtY29tcG9uZW50L3NyYy9jb21wb25lbnRzL2lucHV0LmpzeCIsIi9Vc2Vycy9lemVxdWllbC9EZXNrdG9wL3JlYWN0LXR5cGVhaGVhZC1jb21wb25lbnQvc3JjL2NvbXBvbmVudHMvdHlwZWFoZWFkLmpzeCIsIi9Vc2Vycy9lemVxdWllbC9EZXNrdG9wL3JlYWN0LXR5cGVhaGVhZC1jb21wb25lbnQvc3JjL2luZGV4LmpzIiwiL1VzZXJzL2V6ZXF1aWVsL0Rlc2t0b3AvcmVhY3QtdHlwZWFoZWFkLWNvbXBvbmVudC9zcmMvdXRpbHMvZ2V0X3RleHRfZGlyZWN0aW9uLmpzIiwiL1VzZXJzL2V6ZXF1aWVsL0Rlc2t0b3AvcmVhY3QtdHlwZWFoZWFkLWNvbXBvbmVudC9zcmMvdXRpbHMvbmV1dHJhbF9jaGFyc19yZWdleHAuanMiLCIvVXNlcnMvZXplcXVpZWwvRGVza3RvcC9yZWFjdC10eXBlYWhlYWQtY29tcG9uZW50L3NyYy91dGlscy9ydGxfY2hhcnNfcmVnZXhwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFFdEgsc0JBQXNCO0FBQ3RCLGlDQUFpQztBQUNqQyxNQUFNLENBQUMsT0FBTyxHQUFHLDY4SUFBNjhJLENBQUM7QUFDLzlJLGdDQUFnQztBQUNoQyxvQkFBb0I7Ozs7QUNUcEIsZUFBZTtBQUNmLDBCQUEwQjs7QUFFMUIsZ0dBQWdHOztBQUVoRyxzQkFBc0I7QUFDdEIsaUNBQWlDO0FBQ2pDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsd3NDQUF3c0MsQ0FBQztBQUMxdEMsZ0NBQWdDO0FBQ2hDLG9CQUFvQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IHRydWU7XG4gICAgdmFyIGN1cnJlbnRRdWV1ZTtcbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgd2hpbGUgKCsraSA8IGxlbikge1xuICAgICAgICAgICAgY3VycmVudFF1ZXVlW2ldKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xufVxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICBxdWV1ZS5wdXNoKGZ1bik7XG4gICAgaWYgKCFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ0FyaWEgU3RhdHVzJyxcblxuICAgIHByb3BUeXBlczogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyA/IHt9IDoge1xuICAgICAgICBtZXNzYWdlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gICAgfSxcblxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAvLyBUaGlzIGlzIG5lZWRlZCBhcyBgY29tcG9uZW50RGlkVXBkYXRlYFxuICAgICAgICAvLyBkb2VzIG5vdCBmaXJlIG9uIHRoZSBpbml0aWFsIHJlbmRlci5cbiAgICAgICAgX3RoaXMuc2V0VGV4dENvbnRlbnQoX3RoaXMucHJvcHMubWVzc2FnZSk7XG4gICAgfSxcblxuICAgIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgX3RoaXMuc2V0VGV4dENvbnRlbnQoX3RoaXMucHJvcHMubWVzc2FnZSk7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgIHJvbGU9J3N0YXR1cydcbiAgICAgICAgICAgICAgICBhcmlhLWxpdmU9J3BvbGl0ZSdcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAnLTk5OTlweCcsXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIC8vIFdlIGNhbm5vdCBzZXQgYHRleHRDb250ZW50YCBkaXJlY3RseSBpbiBgcmVuZGVyYCxcbiAgICAvLyBiZWNhdXNlIFJlYWN0IGFkZHMvZGVsZXRlcyB0ZXh0IG5vZGVzIHdoZW4gcmVuZGVyaW5nLFxuICAgIC8vIHdoaWNoIGNvbmZ1c2VzIHNjcmVlbiByZWFkZXJzIGFuZCBkb2Vzbid0IGNhdXNlIHRoZW0gdG8gcmVhZCBjaGFuZ2VzLlxuICAgIHNldFRleHRDb250ZW50OiBmdW5jdGlvbih0ZXh0Q29udGVudCkge1xuICAgICAgICAvLyBXZSBjb3VsZCBzZXQgYGlubmVySFRNTGAsIGJ1dCBpdCdzIGJldHRlciB0byBhdm9pZCBpdC5cbiAgICAgICAgdGhpcy5nZXRET01Ob2RlKCkudGV4dENvbnRlbnQgPSB0ZXh0Q29udGVudCB8fCAnJztcbiAgICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgZGlzcGxheU5hbWU6ICdJbnB1dCcsXG5cbiAgICBwcm9wVHlwZXM6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicgPyB7fSA6IHtcbiAgICAgICAgdmFsdWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIG9uQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xuICAgIH0sXG5cbiAgICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6ICcnLFxuICAgICAgICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uKCkge31cbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgY29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIGRpciA9IF90aGlzLnByb3BzLmRpcjtcblxuICAgICAgICBpZiAoZGlyID09PSBudWxsIHx8IGRpciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBXaGVuIHNldHRpbmcgYW4gYXR0cmlidXRlIHRvIG51bGwvdW5kZWZpbmVkLFxuICAgICAgICAgICAgLy8gUmVhY3QgaW5zdGVhZCBzZXRzIHRoZSBhdHRyaWJ1dGUgdG8gYW4gZW1wdHkgc3RyaW5nLlxuXG4gICAgICAgICAgICAvLyBUaGlzIGlzIG5vdCBkZXNpcmVkIGJlY2F1c2Ugb2YgYSBwb3NzaWJsZSBidWcgaW4gQ2hyb21lLlxuICAgICAgICAgICAgLy8gSWYgdGhlIHBhZ2UgaXMgUlRMLCBhbmQgdGhlIGlucHV0J3MgYGRpcmAgYXR0cmlidXRlIGlzIHNldFxuICAgICAgICAgICAgLy8gdG8gYW4gZW1wdHkgc3RyaW5nLCBDaHJvbWUgYXNzdW1lcyBMVFIsIHdoaWNoIGlzbid0IHdoYXQgd2Ugd2FudC5cbiAgICAgICAgICAgIFJlYWN0LmZpbmRET01Ob2RlKF90aGlzKS5yZW1vdmVBdHRyaWJ1dGUoJ2RpcicpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIHsuLi5fdGhpcy5wcm9wc31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17X3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgaGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgcHJvcHMgPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIC8vIFRoZXJlIGFyZSBzZXZlcmFsIFJlYWN0IGJ1Z3MgaW4gSUUsXG4gICAgICAgIC8vIHdoZXJlIHRoZSBgaW5wdXRgJ3MgYG9uQ2hhbmdlYCBldmVudCBpc1xuICAgICAgICAvLyBmaXJlZCBldmVuIHdoZW4gdGhlIHZhbHVlIGRpZG4ndCBjaGFuZ2UuXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9pc3N1ZXMvMjE4NVxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvaXNzdWVzLzMzNzdcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC52YWx1ZSAhPT0gcHJvcHMudmFsdWUpIHtcbiAgICAgICAgICAgIHByb3BzLm9uQ2hhbmdlKGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBibHVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgUmVhY3QuZmluZERPTU5vZGUodGhpcykuYmx1cigpO1xuICAgIH0sXG5cbiAgICBpc0N1cnNvckF0RW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIGlucHV0RE9NTm9kZSA9IFJlYWN0LmZpbmRET01Ob2RlKF90aGlzKSxcbiAgICAgICAgICAgIHZhbHVlTGVuZ3RoID0gX3RoaXMucHJvcHMudmFsdWUubGVuZ3RoO1xuXG4gICAgICAgIHJldHVybiBpbnB1dERPTU5vZGUuc2VsZWN0aW9uU3RhcnQgPT09IHZhbHVlTGVuZ3RoICYmXG4gICAgICAgICAgICAgICBpbnB1dERPTU5vZGUuc2VsZWN0aW9uRW5kID09PSB2YWx1ZUxlbmd0aDtcbiAgICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKSxcbiAgICBJbnB1dCA9IHJlcXVpcmUoJy4vaW5wdXQuanN4JyksXG4gICAgQXJpYVN0YXR1cyA9IHJlcXVpcmUoJy4vYXJpYV9zdGF0dXMuanN4JyksXG4gICAgZ2V0VGV4dERpcmVjdGlvbiA9IHJlcXVpcmUoJy4uL3V0aWxzL2dldF90ZXh0X2RpcmVjdGlvbicpLFxuICAgIG5vb3AgPSBmdW5jdGlvbigpIHt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ1R5cGVhaGVhZCcsXG5cbiAgICBwcm9wVHlwZXM6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicgPyB7fSA6IHtcbiAgICAgICAgaW5wdXRJZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgY2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBhdXRvRm9jdXM6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICAgICAgICBpbnB1dFZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBvcHRpb25zOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG4gICAgICAgIHBsYWNlaG9sZGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBvbkNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uS2V5RG93bjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uS2V5UHJlc3M6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbktleVVwOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25Gb2N1czogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uQmx1cjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uU2VsZWN0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25JbnB1dENsaWNrOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgaGFuZGxlSGludDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uQ29tcGxldGU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbk9wdGlvbkNsaWNrOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25PcHRpb25DaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbkRyb3Bkb3duT3BlbjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uRHJvcGRvd25DbG9zZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9wdGlvblRlbXBsYXRlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgICBnZXRNZXNzYWdlRm9yT3B0aW9uOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgZ2V0TWVzc2FnZUZvckluY29taW5nT3B0aW9uczogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbiAgICB9LFxuXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlucHV0VmFsdWU6ICcnLFxuICAgICAgICAgICAgb3B0aW9uczogW10sXG4gICAgICAgICAgICBvbkZvY3VzOiBub29wLFxuICAgICAgICAgICAgb25LZXlEb3duOiBub29wLFxuICAgICAgICAgICAgb25DaGFuZ2U6IG5vb3AsXG4gICAgICAgICAgICBvbklucHV0Q2xpY2s6IG5vb3AsXG4gICAgICAgICAgICBoYW5kbGVIaW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25PcHRpb25DbGljazogbm9vcCxcbiAgICAgICAgICAgIG9uT3B0aW9uQ2hhbmdlOiBub29wLFxuICAgICAgICAgICAgb25Db21wbGV0ZTogIG5vb3AsXG4gICAgICAgICAgICBvbkRyb3Bkb3duT3Blbjogbm9vcCxcbiAgICAgICAgICAgIG9uRHJvcGRvd25DbG9zZTogbm9vcCxcbiAgICAgICAgICAgIGdldE1lc3NhZ2VGb3JPcHRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRNZXNzYWdlRm9ySW5jb21pbmdPcHRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ1N1Z2dlc3Rpb25zIGFyZSBhdmFpbGFibGUuIFVzZSB1cCBhbmQgZG93biBhcnJvd3MgdG8gc2VsZWN0Lic7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgIH0sXG5cbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2VsZWN0ZWRJbmRleDogLTEsXG4gICAgICAgICAgICBpc0hpbnRWaXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGlzRHJvcGRvd25WaXNpYmxlOiBmYWxzZVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgICAgdW5pcXVlSWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgICAgICBfdGhpcy51c2VySW5wdXRWYWx1ZSA9IG51bGw7XG4gICAgICAgIF90aGlzLnByZXZpb3VzSW5wdXRWYWx1ZSA9IG51bGw7XG4gICAgICAgIF90aGlzLmFjdGl2ZURlc2NlbmRhbnRJZCA9ICdyZWFjdC10eXBlYWhlYWQtYWN0aXZlZGVzY2VuZGFudC0nICsgdW5pcXVlSWQ7XG4gICAgICAgIF90aGlzLm9wdGlvbnNJZCA9ICdyZWFjdC10eXBlYWhlYWQtb3B0aW9ucy0nICsgdW5pcXVlSWQ7XG4gICAgfSxcblxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFkZEV2ZW50ID0gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIsXG4gICAgICAgICAgICBoYW5kbGVXaW5kb3dDbG9zZSA9IHRoaXMuaGFuZGxlV2luZG93Q2xvc2U7XG5cbiAgICAgICAgLy8gVGhlIGBmb2N1c2AgZXZlbnQgZG9lcyBub3QgYnViYmxlLCBzbyB3ZSBtdXN0IGNhcHR1cmUgaXQgaW5zdGVhZC5cbiAgICAgICAgLy8gVGhpcyBjbG9zZXMgVHlwZWFoZWFkJ3MgZHJvcGRvd24gd2hlbmV2ZXIgc29tZXRoaW5nIGVsc2UgZ2FpbnMgZm9jdXMuXG4gICAgICAgIGFkZEV2ZW50KCdmb2N1cycsIGhhbmRsZVdpbmRvd0Nsb3NlLCB0cnVlKTtcblxuICAgICAgICAvLyBJZiB3ZSBjbGljayBhbnl3aGVyZSBvdXRzaWRlIG9mIFR5cGVhaGVhZCwgY2xvc2UgdGhlIGRyb3Bkb3duLlxuICAgICAgICBhZGRFdmVudCgnY2xpY2snLCBoYW5kbGVXaW5kb3dDbG9zZSwgZmFsc2UpO1xuICAgIH0sXG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZW1vdmVFdmVudCA9IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyLFxuICAgICAgICAgICAgaGFuZGxlV2luZG93Q2xvc2UgPSB0aGlzLmhhbmRsZVdpbmRvd0Nsb3NlO1xuXG4gICAgICAgIHJlbW92ZUV2ZW50KCdmb2N1cycsIGhhbmRsZVdpbmRvd0Nsb3NlLCB0cnVlKTtcbiAgICAgICAgcmVtb3ZlRXZlbnQoJ2NsaWNrJywgaGFuZGxlV2luZG93Q2xvc2UsIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzKSB7XG4gICAgICAgIHZhciBuZXh0VmFsdWUgPSBuZXh0UHJvcHMuaW5wdXRWYWx1ZSxcbiAgICAgICAgICAgIG5leHRPcHRpb25zID0gbmV4dFByb3BzLm9wdGlvbnMsXG4gICAgICAgICAgICB2YWx1ZUxlbmd0aCA9IG5leHRWYWx1ZS5sZW5ndGgsXG4gICAgICAgICAgICBpc0hpbnRWaXNpYmxlID0gdmFsdWVMZW5ndGggPiAwICYmXG4gICAgICAgICAgICAgICAgLy8gQSB2aXNpYmxlIHBhcnQgb2YgdGhlIGhpbnQgbXVzdCBiZVxuICAgICAgICAgICAgICAgIC8vIGF2YWlsYWJsZSBmb3IgdXMgdG8gY29tcGxldGUgaXQuXG4gICAgICAgICAgICAgICAgbmV4dFByb3BzLmhhbmRsZUhpbnQobmV4dFZhbHVlLCBuZXh0T3B0aW9ucykuc2xpY2UodmFsdWVMZW5ndGgpLmxlbmd0aCA+IDA7XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpc0hpbnRWaXNpYmxlOiBpc0hpbnRWaXNpYmxlXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17J3JlYWN0LXR5cGVhaGVhZC1jb250YWluZXIgJyArIF90aGlzLnByb3BzLmNsYXNzTmFtZX0+XG4gICAgICAgICAgICAgICAge190aGlzLnJlbmRlcklucHV0KCl9XG4gICAgICAgICAgICAgICAge190aGlzLnJlbmRlckRyb3Bkb3duKCl9XG4gICAgICAgICAgICAgICAge190aGlzLnJlbmRlckFyaWFNZXNzYWdlRm9yT3B0aW9ucygpfVxuICAgICAgICAgICAgICAgIHtfdGhpcy5yZW5kZXJBcmlhTWVzc2FnZUZvckluY29taW5nT3B0aW9ucygpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIHJlbmRlcklucHV0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIHN0YXRlID0gX3RoaXMuc3RhdGUsXG4gICAgICAgICAgICBwcm9wcyA9IF90aGlzLnByb3BzLFxuICAgICAgICAgICAgaW5wdXRWYWx1ZSA9IHByb3BzLmlucHV0VmFsdWUsXG4gICAgICAgICAgICBjbGFzc05hbWUgPSAncmVhY3QtdHlwZWFoZWFkLWlucHV0JyxcbiAgICAgICAgICAgIGlucHV0RGlyZWN0aW9uID0gZ2V0VGV4dERpcmVjdGlvbihpbnB1dFZhbHVlKTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9J3JlYWN0LXR5cGVhaGVhZC1pbnB1dC1jb250YWluZXInPlxuICAgICAgICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgICAgICAgICByZWY9J2lucHV0J1xuICAgICAgICAgICAgICAgICAgICByb2xlPSdjb21ib2JveCdcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1vd25zPXtfdGhpcy5vcHRpb25zSWR9XG4gICAgICAgICAgICAgICAgICAgIGFyaWEtZXhwYW5kZWQ9e3N0YXRlLmlzRHJvcGRvd25WaXNpYmxlfVxuICAgICAgICAgICAgICAgICAgICBhcmlhLWF1dG9jb21wbGV0ZT0nYm90aCdcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1hY3RpdmVkZXNjZW5kYW50PXtfdGhpcy5hY3RpdmVEZXNjZW5kYW50SWR9XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpbnB1dFZhbHVlfVxuICAgICAgICAgICAgICAgICAgICBzcGVsbENoZWNrPXtmYWxzZX1cbiAgICAgICAgICAgICAgICAgICAgYXV0b0NvbXBsZXRlPXtmYWxzZX1cbiAgICAgICAgICAgICAgICAgICAgYXV0b0NvcnJlY3Q9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICBkaXI9e2lucHV0RGlyZWN0aW9ufVxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtfdGhpcy5oYW5kbGVDbGlja31cbiAgICAgICAgICAgICAgICAgICAgb25Gb2N1cz17X3RoaXMuaGFuZGxlRm9jdXN9XG4gICAgICAgICAgICAgICAgICAgIG9uQmx1cj17cHJvcHMub25CbHVyfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17X3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICBvbktleURvd249e190aGlzLmhhbmRsZUtleURvd259XG4gICAgICAgICAgICAgICAgICAgIGlkPXtwcm9wcy5pbnB1dElkfVxuICAgICAgICAgICAgICAgICAgICBhdXRvRm9jdXM9e3Byb3BzLmF1dG9Gb2N1c31cbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3Byb3BzLnBsYWNlaG9sZGVyfVxuICAgICAgICAgICAgICAgICAgICBvblNlbGVjdD17cHJvcHMub25TZWxlY3R9XG4gICAgICAgICAgICAgICAgICAgIG9uS2V5VXA9e3Byb3BzLm9uS2V5VXB9XG4gICAgICAgICAgICAgICAgICAgIG9uS2V5UHJlc3M9e3Byb3BzLm9uS2V5UHJlc3N9XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lICsgJyByZWFjdC10eXBlYWhlYWQtdXNlcnRleHQnfVxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgLz5cblxuICAgICAgICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICAgcm9sZT0ncHJlc2VudGF0aW9uJ1xuICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICAgZGlyPXtpbnB1dERpcmVjdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWUgKyAnIHJlYWN0LXR5cGVhaGVhZC1oaW50J31cbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnc2lsdmVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFdlYmtpdFRleHRGaWxsQ29sb3I6ICdzaWx2ZXInXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtzdGF0ZS5pc0hpbnRWaXNpYmxlID8gcHJvcHMuaGFuZGxlSGludChpbnB1dFZhbHVlLCBwcm9wcy5vcHRpb25zKSA6IG51bGx9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICByZW5kZXJEcm9wZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgICBzdGF0ZSA9IF90aGlzLnN0YXRlLFxuICAgICAgICAgICAgcHJvcHMgPSBfdGhpcy5wcm9wcyxcbiAgICAgICAgICAgIE9wdGlvblRlbXBsYXRlID0gcHJvcHMub3B0aW9uVGVtcGxhdGUsXG4gICAgICAgICAgICBzZWxlY3RlZEluZGV4ID0gc3RhdGUuc2VsZWN0ZWRJbmRleCxcbiAgICAgICAgICAgIGlzRHJvcGRvd25WaXNpYmxlID0gc3RhdGUuaXNEcm9wZG93blZpc2libGUsXG4gICAgICAgICAgICBhY3RpdmVEZXNjZW5kYW50SWQgPSBfdGhpcy5hY3RpdmVEZXNjZW5kYW50SWQ7XG5cbiAgICAgICAgaWYgKHRoaXMucHJvcHMub3B0aW9ucy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8dWwgaWQ9e190aGlzLm9wdGlvbnNJZH1cbiAgICAgICAgICAgICAgICByb2xlPSdsaXN0Ym94J1xuICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPXshaXNEcm9wZG93blZpc2libGV9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJyNmZmYnLFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGlzRHJvcGRvd25WaXNpYmxlID8gJ2Jsb2NrJyA6ICdub25lJ1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPSdyZWFjdC10eXBlYWhlYWQtb3B0aW9ucydcbiAgICAgICAgICAgICAgICBvbk1vdXNlT3V0PXt0aGlzLmhhbmRsZU1vdXNlT3V0fT5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BzLm9wdGlvbnMubWFwKGZ1bmN0aW9uKGRhdGEsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNTZWxlY3RlZCA9IHNlbGVjdGVkSW5kZXggPT09IGluZGV4O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBpZD17aXNTZWxlY3RlZCA/IGFjdGl2ZURlc2NlbmRhbnRJZCA6IG51bGx9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvbGU9J29wdGlvbidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17X3RoaXMuaGFuZGxlT3B0aW9uQ2xpY2suYmluZChfdGhpcywgaW5kZXgpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlT3Zlcj17X3RoaXMuaGFuZGxlT3B0aW9uTW91c2VPdmVyLmJpbmQoX3RoaXMsIGluZGV4KX0+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE9wdGlvblRlbXBsYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhPXtkYXRhfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklucHV0VmFsdWU9e190aGlzLnVzZXJJbnB1dFZhbHVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWx1ZT17cHJvcHMuaW5wdXRWYWx1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ9e2lzU2VsZWN0ZWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyQXJpYU1lc3NhZ2VGb3JPcHRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIHByb3BzID0gX3RoaXMucHJvcHMsXG4gICAgICAgICAgICBpbnB1dFZhbHVlID0gcHJvcHMuaW5wdXRWYWx1ZSxcbiAgICAgICAgICAgIG9wdGlvbiA9IHByb3BzLm9wdGlvbnNbX3RoaXMuc3RhdGUuc2VsZWN0ZWRJbmRleF0gfHwgaW5wdXRWYWx1ZTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEFyaWFTdGF0dXNcbiAgICAgICAgICAgICAgICBtZXNzYWdlPXtwcm9wcy5nZXRNZXNzYWdlRm9yT3B0aW9uKG9wdGlvbikgfHwgaW5wdXRWYWx1ZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIHJlbmRlckFyaWFNZXNzYWdlRm9ySW5jb21pbmdPcHRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxBcmlhU3RhdHVzXG4gICAgICAgICAgICAgICAgbWVzc2FnZT17dGhpcy5wcm9wcy5nZXRNZXNzYWdlRm9ySW5jb21pbmdPcHRpb25zKCl9XG4gICAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICBzaG93RHJvcGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIGlmICghX3RoaXMuc3RhdGUuaXNEcm9wZG93blZpc2libGUpIHtcbiAgICAgICAgICAgIF90aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBpc0Ryb3Bkb3duVmlzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMucHJvcHMub25Ecm9wZG93bk9wZW4oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGhpZGVEcm9wZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKF90aGlzLnN0YXRlLmlzRHJvcGRvd25WaXNpYmxlKSB7XG4gICAgICAgICAgICBfdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgaXNEcm9wZG93blZpc2libGU6IGZhbHNlXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5wcm9wcy5vbkRyb3Bkb3duQ2xvc2UoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHNob3dIaW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIHByb3BzID0gX3RoaXMucHJvcHMsXG4gICAgICAgICAgICBpbnB1dFZhbHVlID0gcHJvcHMuaW5wdXRWYWx1ZSxcbiAgICAgICAgICAgIGlucHV0VmFsdWVMZW5ndGggPSBpbnB1dFZhbHVlLmxlbmd0aCxcbiAgICAgICAgICAgIGlzSGludFZpc2libGUgPSBpbnB1dFZhbHVlTGVuZ3RoID4gMCAmJlxuICAgICAgICAgICAgICAgIC8vIEEgdmlzaWJsZSBwYXJ0IG9mIHRoZSBoaW50IG11c3QgYmVcbiAgICAgICAgICAgICAgICAvLyBhdmFpbGFibGUgZm9yIHVzIHRvIGNvbXBsZXRlIGl0LlxuICAgICAgICAgICAgICAgIHByb3BzLmhhbmRsZUhpbnQoaW5wdXRWYWx1ZSwgcHJvcHMub3B0aW9ucykuc2xpY2UoaW5wdXRWYWx1ZUxlbmd0aCkubGVuZ3RoID4gMDtcblxuICAgICAgICBfdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpc0hpbnRWaXNpYmxlOiBpc0hpbnRWaXNpYmxlXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBoaWRlSGludDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaXNIaW50VmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNldFNlbGVjdGVkSW5kZXg6IGZ1bmN0aW9uKGluZGV4LCBjYWxsYmFjaykge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHNlbGVjdGVkSW5kZXg6IGluZGV4XG4gICAgICAgIH0sIGNhbGxiYWNrKTtcbiAgICB9LFxuXG4gICAgaGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIF90aGlzLnNob3dIaW50KCk7XG4gICAgICAgIF90aGlzLnNob3dEcm9wZG93bigpO1xuICAgICAgICBfdGhpcy5zZXRTZWxlY3RlZEluZGV4KC0xKTtcbiAgICAgICAgX3RoaXMucHJvcHMub25DaGFuZ2UoZXZlbnQpO1xuICAgICAgICBfdGhpcy51c2VySW5wdXRWYWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICB9LFxuXG4gICAgZm9jdXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnJlZnMuaW5wdXQuZ2V0RE9NTm9kZSgpLmZvY3VzKCk7XG4gICAgfSxcblxuICAgIGhhbmRsZUZvY3VzOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIF90aGlzLnNob3dEcm9wZG93bigpO1xuICAgICAgICBfdGhpcy5wcm9wcy5vbkZvY3VzKGV2ZW50KTtcbiAgICB9LFxuXG4gICAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgX3RoaXMuc2hvd0hpbnQoKTtcbiAgICAgICAgX3RoaXMucHJvcHMub25JbnB1dENsaWNrKGV2ZW50KTtcbiAgICB9LFxuXG4gICAgbmF2aWdhdGU6IGZ1bmN0aW9uKGRpcmVjdGlvbiwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIG1pbkluZGV4ID0gLTEsXG4gICAgICAgICAgICBtYXhJbmRleCA9IF90aGlzLnByb3BzLm9wdGlvbnMubGVuZ3RoIC0gMSxcbiAgICAgICAgICAgIGluZGV4ID0gX3RoaXMuc3RhdGUuc2VsZWN0ZWRJbmRleCArIGRpcmVjdGlvbjtcblxuICAgICAgICBpZiAoaW5kZXggPiBtYXhJbmRleCkge1xuICAgICAgICAgICAgaW5kZXggPSBtaW5JbmRleDtcbiAgICAgICAgfSBlbHNlIGlmIChpbmRleCA8IG1pbkluZGV4KSB7XG4gICAgICAgICAgICBpbmRleCA9IG1heEluZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXMuc2V0U2VsZWN0ZWRJbmRleChpbmRleCwgY2FsbGJhY2spO1xuICAgIH0sXG5cbiAgICBoYW5kbGVLZXlEb3duOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgICAga2V5ID0gZXZlbnQua2V5LFxuICAgICAgICAgICAgcHJvcHMgPSBfdGhpcy5wcm9wcyxcbiAgICAgICAgICAgIGlucHV0ID0gX3RoaXMucmVmcy5pbnB1dCxcbiAgICAgICAgICAgIGlzRHJvcGRvd25WaXNpYmxlID0gX3RoaXMuc3RhdGUuaXNEcm9wZG93blZpc2libGUsXG4gICAgICAgICAgICBpc0hpbnRWaXNpYmxlID0gX3RoaXMuc3RhdGUuaXNIaW50VmlzaWJsZSxcbiAgICAgICAgICAgIGhhc0hhbmRsZWRLZXlEb3duID0gZmFsc2UsXG4gICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgIG9wdGlvbkRhdGEsXG4gICAgICAgICAgICBkaXI7XG5cbiAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgY2FzZSAnRW5kJzpcbiAgICAgICAgY2FzZSAnVGFiJzpcbiAgICAgICAgICAgIGlmIChpc0hpbnRWaXNpYmxlICYmICFldmVudC5zaGlmdEtleSkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgcHJvcHMub25Db21wbGV0ZShldmVudCwgcHJvcHMuaGFuZGxlSGludChwcm9wcy5pbnB1dFZhbHVlLCBwcm9wcy5vcHRpb25zKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnQXJyb3dMZWZ0JzpcbiAgICAgICAgY2FzZSAnQXJyb3dSaWdodCc6XG4gICAgICAgICAgICBpZiAoaXNIaW50VmlzaWJsZSAmJiAhZXZlbnQuc2hpZnRLZXkgJiYgaW5wdXQuaXNDdXJzb3JBdEVuZCgpKSB7XG4gICAgICAgICAgICAgICAgZGlyID0gZ2V0VGV4dERpcmVjdGlvbihwcm9wcy5pbnB1dFZhbHVlKTtcblxuICAgICAgICAgICAgICAgIGlmICgoZGlyID09PSAnbHRyJyAmJiBrZXkgPT09ICdBcnJvd1JpZ2h0JykgfHwgKGRpciA9PT0gJ3J0bCcgJiYga2V5ID09PSAnQXJyb3dMZWZ0JykpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcHMub25Db21wbGV0ZShldmVudCwgcHJvcHMuaGFuZGxlSGludChwcm9wcy5pbnB1dFZhbHVlLCBwcm9wcy5vcHRpb25zKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0VudGVyJzpcbiAgICAgICAgICAgIGlucHV0LmJsdXIoKTtcbiAgICAgICAgICAgIF90aGlzLmhpZGVIaW50KCk7XG4gICAgICAgICAgICBfdGhpcy5oaWRlRHJvcGRvd24oKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdFc2NhcGUnOlxuICAgICAgICAgICAgX3RoaXMuaGlkZUhpbnQoKTtcbiAgICAgICAgICAgIF90aGlzLmhpZGVEcm9wZG93bigpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0Fycm93VXAnOlxuICAgICAgICBjYXNlICdBcnJvd0Rvd24nOlxuICAgICAgICAgICAgaWYgKHByb3BzLm9wdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICBfdGhpcy5zaG93SGludCgpO1xuICAgICAgICAgICAgICAgIF90aGlzLnNob3dEcm9wZG93bigpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGlzRHJvcGRvd25WaXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpciA9IGtleSA9PT0gJ0Fycm93VXAnID8gLTE6IDE7XG4gICAgICAgICAgICAgICAgICAgIGhhc0hhbmRsZWRLZXlEb3duID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5uYXZpZ2F0ZShkaXIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkSW5kZXggPSBfdGhpcy5zdGF0ZS5zZWxlY3RlZEluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZpb3VzSW5wdXRWYWx1ZSA9IF90aGlzLnByZXZpb3VzSW5wdXRWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25EYXRhID0gcHJldmlvdXNJbnB1dFZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSdyZSBjdXJyZW50bHkgb24gYW4gb3B0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkSW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNhdmUgdGhlIGN1cnJlbnQgYGlucHV0YCB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcyB3ZSBtaWdodCBhcnJvdyBiYWNrIHRvIGl0IGxhdGVyLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c0lucHV0VmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMucHJldmlvdXNJbnB1dFZhbHVlID0gcHJvcHMuaW5wdXRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25EYXRhID0gcHJvcHMub3B0aW9uc1tzZWxlY3RlZEluZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHMub25PcHRpb25DaGFuZ2UoZXZlbnQsIG9wdGlvbkRhdGEsIHNlbGVjdGVkSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHMub25LZXlEb3duKGV2ZW50LCBvcHRpb25EYXRhLCBzZWxlY3RlZEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaGFzSGFuZGxlZEtleURvd24pIHtcbiAgICAgICAgICAgIGluZGV4ID0gdGhpcy5zdGF0ZS5zZWxlY3RlZEluZGV4O1xuICAgICAgICAgICAgb3B0aW9uRGF0YSA9IGluZGV4IDwgMCA/IHByb3BzLmlucHV0VmFsdWUgOiBwcm9wcy5vcHRpb25zW2luZGV4XTtcbiAgICAgICAgICAgIHByb3BzLm9uS2V5RG93bihldmVudCwgb3B0aW9uRGF0YSwgaW5kZXgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGhhbmRsZU9wdGlvbkNsaWNrOiBmdW5jdGlvbihzZWxlY3RlZEluZGV4LCBldmVudCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgICAgcHJvcHMgPSBfdGhpcy5wcm9wcztcblxuICAgICAgICBfdGhpcy5oaWRlSGludCgpO1xuICAgICAgICBfdGhpcy5oaWRlRHJvcGRvd24oKTtcbiAgICAgICAgX3RoaXMuc2V0U2VsZWN0ZWRJbmRleChzZWxlY3RlZEluZGV4KTtcbiAgICAgICAgcHJvcHMub25PcHRpb25DbGljayhldmVudCwgcHJvcHMub3B0aW9uc1tzZWxlY3RlZEluZGV4XSwgc2VsZWN0ZWRJbmRleCk7XG4gICAgfSxcblxuICAgIGhhbmRsZU9wdGlvbk1vdXNlT3ZlcjogZnVuY3Rpb24oc2VsZWN0ZWRJbmRleCkge1xuICAgICAgICB0aGlzLnNldFNlbGVjdGVkSW5kZXgoc2VsZWN0ZWRJbmRleCk7XG4gICAgfSxcblxuICAgIGhhbmRsZU1vdXNlT3V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zZXRTZWxlY3RlZEluZGV4KC0xKTtcbiAgICB9LFxuXG4gICAgaGFuZGxlV2luZG93Q2xvc2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgICB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG5cbiAgICAgICAgaWYgKHRhcmdldCAhPT0gd2luZG93ICYmICF0aGlzLmdldERPTU5vZGUoKS5jb250YWlucyh0YXJnZXQpKSB7XG4gICAgICAgICAgICBfdGhpcy5oaWRlSGludCgpO1xuICAgICAgICAgICAgX3RoaXMuaGlkZURyb3Bkb3duKCk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3R5cGVhaGVhZC5qc3gnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFJUTENoYXJhY3RlcnNSZWdFeHAgPSByZXF1aXJlKCcuL3J0bF9jaGFyc19yZWdleHAnKSxcbiAgICBOZXV0cmFsQ2hhcmFjdGVyc1JlZ0V4cCA9IHJlcXVpcmUoJy4vbmV1dHJhbF9jaGFyc19yZWdleHAnKSxcbiAgICBzdGFydHNXaXRoUlRMID0gbmV3IFJlZ0V4cCgnXig/OicgKyBOZXV0cmFsQ2hhcmFjdGVyc1JlZ0V4cCArICcpKig/OicgKyBSVExDaGFyYWN0ZXJzUmVnRXhwICsgJyknKSxcbiAgICBuZXV0cmFsVGV4dCA9IG5ldyBSZWdFeHAoJ14oPzonICsgTmV1dHJhbENoYXJhY3RlcnNSZWdFeHAgKyAnKSokJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHZhciBkaXIgPSAnbHRyJztcblxuICAgIGlmIChzdGFydHNXaXRoUlRMLnRlc3QodGV4dCkpIHtcbiAgICAgICAgZGlyID0gJ3J0bCc7XG4gICAgfSBlbHNlIGlmIChuZXV0cmFsVGV4dC50ZXN0KHRleHQpKSB7XG4gICAgICAgIGRpciA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpcjtcbn07XG4iLCIvLyBETyBOT1QgRURJVCFcbi8vIFRISVMgRklMRSBJUyBHRU5FUkFURUQhXG5cbi8vIEFsbCBiaWRpIGNoYXJhY3RlcnMgZXhjZXB0IHRob3NlIGZvdW5kIGluIGNsYXNzZXMgJ0wnIChMVFIpLCAnUicgKFJUTCksIGFuZCAnQUwnIChSVEwgQXJhYmljKSBhcyBwZXIgVW5pY29kZSA3LjAuMC5cblxuLy8ganNoaW50IGlnbm9yZTpzdGFydFxuLy8ganNjczpkaXNhYmxlIG1heGltdW1MaW5lTGVuZ3RoXG5tb2R1bGUuZXhwb3J0cyA9ICdbXFwwLUBcXFstYFxcey1cXHhBOVxceEFCLVxceEI0XFx4QjYtXFx4QjlcXHhCQi1cXHhCRlxceEQ3XFx4RjdcXHUwMkI5XFx1MDJCQVxcdTAyQzItXFx1MDJDRlxcdTAyRDItXFx1MDJERlxcdTAyRTUtXFx1MDJFRFxcdTAyRUYtXFx1MDM2RlxcdTAzNzRcXHUwMzc1XFx1MDM3RVxcdTAzODRcXHUwMzg1XFx1MDM4N1xcdTAzRjZcXHUwNDgzLVxcdTA0ODlcXHUwNThBXFx1MDU4RC1cXHUwNThGXFx1MDU5MS1cXHUwNUJEXFx1MDVCRlxcdTA1QzFcXHUwNUMyXFx1MDVDNFxcdTA1QzVcXHUwNUM3XFx1MDYwMC1cXHUwNjA3XFx1MDYwOVxcdTA2MEFcXHUwNjBDXFx1MDYwRS1cXHUwNjFBXFx1MDY0Qi1cXHUwNjZDXFx1MDY3MFxcdTA2RDYtXFx1MDZFNFxcdTA2RTctXFx1MDZFRFxcdTA2RjAtXFx1MDZGOVxcdTA3MTFcXHUwNzMwLVxcdTA3NEFcXHUwN0E2LVxcdTA3QjBcXHUwN0VCLVxcdTA3RjNcXHUwN0Y2LVxcdTA3RjlcXHUwODE2LVxcdTA4MTlcXHUwODFCLVxcdTA4MjNcXHUwODI1LVxcdTA4MjdcXHUwODI5LVxcdTA4MkRcXHUwODU5LVxcdTA4NUJcXHUwOEU0LVxcdTA5MDJcXHUwOTNBXFx1MDkzQ1xcdTA5NDEtXFx1MDk0OFxcdTA5NERcXHUwOTUxLVxcdTA5NTdcXHUwOTYyXFx1MDk2M1xcdTA5ODFcXHUwOUJDXFx1MDlDMS1cXHUwOUM0XFx1MDlDRFxcdTA5RTJcXHUwOUUzXFx1MDlGMlxcdTA5RjNcXHUwOUZCXFx1MEEwMVxcdTBBMDJcXHUwQTNDXFx1MEE0MVxcdTBBNDJcXHUwQTQ3XFx1MEE0OFxcdTBBNEItXFx1MEE0RFxcdTBBNTFcXHUwQTcwXFx1MEE3MVxcdTBBNzVcXHUwQTgxXFx1MEE4MlxcdTBBQkNcXHUwQUMxLVxcdTBBQzVcXHUwQUM3XFx1MEFDOFxcdTBBQ0RcXHUwQUUyXFx1MEFFM1xcdTBBRjFcXHUwQjAxXFx1MEIzQ1xcdTBCM0ZcXHUwQjQxLVxcdTBCNDRcXHUwQjREXFx1MEI1NlxcdTBCNjJcXHUwQjYzXFx1MEI4MlxcdTBCQzBcXHUwQkNEXFx1MEJGMy1cXHUwQkZBXFx1MEMwMFxcdTBDM0UtXFx1MEM0MFxcdTBDNDYtXFx1MEM0OFxcdTBDNEEtXFx1MEM0RFxcdTBDNTVcXHUwQzU2XFx1MEM2MlxcdTBDNjNcXHUwQzc4LVxcdTBDN0VcXHUwQzgxXFx1MENCQ1xcdTBDQ0NcXHUwQ0NEXFx1MENFMlxcdTBDRTNcXHUwRDAxXFx1MEQ0MS1cXHUwRDQ0XFx1MEQ0RFxcdTBENjJcXHUwRDYzXFx1MERDQVxcdTBERDItXFx1MERENFxcdTBERDZcXHUwRTMxXFx1MEUzNC1cXHUwRTNBXFx1MEUzRlxcdTBFNDctXFx1MEU0RVxcdTBFQjFcXHUwRUI0LVxcdTBFQjlcXHUwRUJCXFx1MEVCQ1xcdTBFQzgtXFx1MEVDRFxcdTBGMThcXHUwRjE5XFx1MEYzNVxcdTBGMzdcXHUwRjM5LVxcdTBGM0RcXHUwRjcxLVxcdTBGN0VcXHUwRjgwLVxcdTBGODRcXHUwRjg2XFx1MEY4N1xcdTBGOEQtXFx1MEY5N1xcdTBGOTktXFx1MEZCQ1xcdTBGQzZcXHUxMDJELVxcdTEwMzBcXHUxMDMyLVxcdTEwMzdcXHUxMDM5XFx1MTAzQVxcdTEwM0RcXHUxMDNFXFx1MTA1OFxcdTEwNTlcXHUxMDVFLVxcdTEwNjBcXHUxMDcxLVxcdTEwNzRcXHUxMDgyXFx1MTA4NVxcdTEwODZcXHUxMDhEXFx1MTA5RFxcdTEzNUQtXFx1MTM1RlxcdTEzOTAtXFx1MTM5OVxcdTE0MDBcXHUxNjgwXFx1MTY5QlxcdTE2OUNcXHUxNzEyLVxcdTE3MTRcXHUxNzMyLVxcdTE3MzRcXHUxNzUyXFx1MTc1M1xcdTE3NzJcXHUxNzczXFx1MTdCNFxcdTE3QjVcXHUxN0I3LVxcdTE3QkRcXHUxN0M2XFx1MTdDOS1cXHUxN0QzXFx1MTdEQlxcdTE3RERcXHUxN0YwLVxcdTE3RjlcXHUxODAwLVxcdTE4MEVcXHUxOEE5XFx1MTkyMC1cXHUxOTIyXFx1MTkyN1xcdTE5MjhcXHUxOTMyXFx1MTkzOS1cXHUxOTNCXFx1MTk0MFxcdTE5NDRcXHUxOTQ1XFx1MTlERS1cXHUxOUZGXFx1MUExN1xcdTFBMThcXHUxQTFCXFx1MUE1NlxcdTFBNTgtXFx1MUE1RVxcdTFBNjBcXHUxQTYyXFx1MUE2NS1cXHUxQTZDXFx1MUE3My1cXHUxQTdDXFx1MUE3RlxcdTFBQjAtXFx1MUFCRVxcdTFCMDAtXFx1MUIwM1xcdTFCMzRcXHUxQjM2LVxcdTFCM0FcXHUxQjNDXFx1MUI0MlxcdTFCNkItXFx1MUI3M1xcdTFCODBcXHUxQjgxXFx1MUJBMi1cXHUxQkE1XFx1MUJBOFxcdTFCQTlcXHUxQkFCLVxcdTFCQURcXHUxQkU2XFx1MUJFOFxcdTFCRTlcXHUxQkVEXFx1MUJFRi1cXHUxQkYxXFx1MUMyQy1cXHUxQzMzXFx1MUMzNlxcdTFDMzdcXHUxQ0QwLVxcdTFDRDJcXHUxQ0Q0LVxcdTFDRTBcXHUxQ0UyLVxcdTFDRThcXHUxQ0VEXFx1MUNGNFxcdTFDRjhcXHUxQ0Y5XFx1MURDMC1cXHUxREY1XFx1MURGQy1cXHUxREZGXFx1MUZCRFxcdTFGQkYtXFx1MUZDMVxcdTFGQ0QtXFx1MUZDRlxcdTFGREQtXFx1MUZERlxcdTFGRUQtXFx1MUZFRlxcdTFGRkRcXHUxRkZFXFx1MjAwMC1cXHUyMDBEXFx1MjAxMC1cXHUyMDI5XFx1MjAyRi1cXHUyMDY0XFx1MjA2OFxcdTIwNkEtXFx1MjA3MFxcdTIwNzQtXFx1MjA3RVxcdTIwODAtXFx1MjA4RVxcdTIwQTAtXFx1MjBCRFxcdTIwRDAtXFx1MjBGMFxcdTIxMDBcXHUyMTAxXFx1MjEwMy1cXHUyMTA2XFx1MjEwOFxcdTIxMDlcXHUyMTE0XFx1MjExNi1cXHUyMTE4XFx1MjExRS1cXHUyMTIzXFx1MjEyNVxcdTIxMjdcXHUyMTI5XFx1MjEyRVxcdTIxM0FcXHUyMTNCXFx1MjE0MC1cXHUyMTQ0XFx1MjE0QS1cXHUyMTREXFx1MjE1MC1cXHUyMTVGXFx1MjE4OVxcdTIxOTAtXFx1MjMzNVxcdTIzN0ItXFx1MjM5NFxcdTIzOTYtXFx1MjNGQVxcdTI0MDAtXFx1MjQyNlxcdTI0NDAtXFx1MjQ0QVxcdTI0NjAtXFx1MjQ5QlxcdTI0RUEtXFx1MjZBQlxcdTI2QUQtXFx1MjdGRlxcdTI5MDAtXFx1MkI3M1xcdTJCNzYtXFx1MkI5NVxcdTJCOTgtXFx1MkJCOVxcdTJCQkQtXFx1MkJDOFxcdTJCQ0EtXFx1MkJEMVxcdTJDRTUtXFx1MkNFQVxcdTJDRUYtXFx1MkNGMVxcdTJDRjktXFx1MkNGRlxcdTJEN0ZcXHUyREUwLVxcdTJFNDJcXHUyRTgwLVxcdTJFOTlcXHUyRTlCLVxcdTJFRjNcXHUyRjAwLVxcdTJGRDVcXHUyRkYwLVxcdTJGRkJcXHUzMDAwLVxcdTMwMDRcXHUzMDA4LVxcdTMwMjBcXHUzMDJBLVxcdTMwMkRcXHUzMDMwXFx1MzAzNlxcdTMwMzdcXHUzMDNELVxcdTMwM0ZcXHUzMDk5LVxcdTMwOUNcXHUzMEEwXFx1MzBGQlxcdTMxQzAtXFx1MzFFM1xcdTMyMURcXHUzMjFFXFx1MzI1MC1cXHUzMjVGXFx1MzI3Qy1cXHUzMjdFXFx1MzJCMS1cXHUzMkJGXFx1MzJDQy1cXHUzMkNGXFx1MzM3Ny1cXHUzMzdBXFx1MzNERVxcdTMzREZcXHUzM0ZGXFx1NERDMC1cXHU0REZGXFx1QTQ5MC1cXHVBNEM2XFx1QTYwRC1cXHVBNjBGXFx1QTY2Ri1cXHVBNjdGXFx1QTY5RlxcdUE2RjBcXHVBNkYxXFx1QTcwMC1cXHVBNzIxXFx1QTc4OFxcdUE4MDJcXHVBODA2XFx1QTgwQlxcdUE4MjVcXHVBODI2XFx1QTgyOC1cXHVBODJCXFx1QTgzOFxcdUE4MzlcXHVBODc0LVxcdUE4NzdcXHVBOEM0XFx1QThFMC1cXHVBOEYxXFx1QTkyNi1cXHVBOTJEXFx1QTk0Ny1cXHVBOTUxXFx1QTk4MC1cXHVBOTgyXFx1QTlCM1xcdUE5QjYtXFx1QTlCOVxcdUE5QkNcXHVBOUU1XFx1QUEyOS1cXHVBQTJFXFx1QUEzMVxcdUFBMzJcXHVBQTM1XFx1QUEzNlxcdUFBNDNcXHVBQTRDXFx1QUE3Q1xcdUFBQjBcXHVBQUIyLVxcdUFBQjRcXHVBQUI3XFx1QUFCOFxcdUFBQkVcXHVBQUJGXFx1QUFDMVxcdUFBRUNcXHVBQUVEXFx1QUFGNlxcdUFCRTVcXHVBQkU4XFx1QUJFRFxcdUZCMUVcXHVGQjI5XFx1RkQzRVxcdUZEM0ZcXHVGREZEXFx1RkUwMC1cXHVGRTE5XFx1RkUyMC1cXHVGRTJEXFx1RkUzMC1cXHVGRTUyXFx1RkU1NC1cXHVGRTY2XFx1RkU2OC1cXHVGRTZCXFx1RkVGRlxcdUZGMDEtXFx1RkYyMFxcdUZGM0ItXFx1RkY0MFxcdUZGNUItXFx1RkY2NVxcdUZGRTAtXFx1RkZFNlxcdUZGRTgtXFx1RkZFRVxcdUZGRjktXFx1RkZGRF18XFx1RDgwMFtcXHVERDAxXFx1REQ0MC1cXHVERDhDXFx1REQ5MC1cXHVERDlCXFx1RERBMFxcdURERkRcXHVERUUwLVxcdURFRkJcXHVERjc2LVxcdURGN0FdfFxcdUQ4MDJbXFx1REQxRlxcdURFMDEtXFx1REUwM1xcdURFMDVcXHVERTA2XFx1REUwQy1cXHVERTBGXFx1REUzOC1cXHVERTNBXFx1REUzRlxcdURFRTVcXHVERUU2XFx1REYzOS1cXHVERjNGXXxcXHVEODAzW1xcdURFNjAtXFx1REU3RV18W1xcdUQ4MDRcXHVEQjQwXVtcXHVEQzAxXFx1REMzOC1cXHVEQzQ2XFx1REM1Mi1cXHVEQzY1XFx1REM3Ri1cXHVEQzgxXFx1RENCMy1cXHVEQ0I2XFx1RENCOVxcdURDQkFcXHVERDAwLVxcdUREMDJcXHVERDI3LVxcdUREMkJcXHVERDJELVxcdUREMzRcXHVERDczXFx1REQ4MFxcdUREODFcXHVEREI2LVxcdUREQkVcXHVERTJGLVxcdURFMzFcXHVERTM0XFx1REUzNlxcdURFMzdcXHVERURGXFx1REVFMy1cXHVERUVBXFx1REYwMVxcdURGM0NcXHVERjQwXFx1REY2Ni1cXHVERjZDXFx1REY3MC1cXHVERjc0XXxcXHVEODA1W1xcdURDQjMtXFx1RENCOFxcdURDQkFcXHVEQ0JGXFx1RENDMFxcdURDQzJcXHVEQ0MzXFx1RERCMi1cXHVEREI1XFx1RERCQ1xcdUREQkRcXHVEREJGXFx1RERDMFxcdURFMzMtXFx1REUzQVxcdURFM0RcXHVERTNGXFx1REU0MFxcdURFQUJcXHVERUFEXFx1REVCMC1cXHVERUI1XFx1REVCN118XFx1RDgxQVtcXHVERUYwLVxcdURFRjRcXHVERjMwLVxcdURGMzZdfFxcdUQ4MUJbXFx1REY4Ri1cXHVERjkyXXxcXHVEODJGW1xcdURDOURcXHVEQzlFXFx1RENBMC1cXHVEQ0EzXXxcXHVEODM0W1xcdURENjctXFx1REQ2OVxcdURENzMtXFx1REQ4MlxcdUREODUtXFx1REQ4QlxcdUREQUEtXFx1RERBRFxcdURFMDAtXFx1REU0NVxcdURGMDAtXFx1REY1Nl18XFx1RDgzNVtcXHVERURCXFx1REYxNVxcdURGNEZcXHVERjg5XFx1REZDM1xcdURGQ0UtXFx1REZGRl18XFx1RDgzQVtcXHVEQ0QwLVxcdURDRDZdfFxcdUQ4M0JbXFx1REVGMFxcdURFRjFdfFxcdUQ4M0NbXFx1REMwMC1cXHVEQzJCXFx1REMzMC1cXHVEQzkzXFx1RENBMC1cXHVEQ0FFXFx1RENCMS1cXHVEQ0JGXFx1RENDMS1cXHVEQ0NGXFx1RENEMS1cXHVEQ0Y1XFx1REQwMC1cXHVERDBDXFx1REQ2QVxcdURENkJcXHVERjAwLVxcdURGMkNcXHVERjMwLVxcdURGN0RcXHVERjgwLVxcdURGQ0VcXHVERkQ0LVxcdURGRjddfFxcdUQ4M0RbXFx1REMwMC1cXHVEQ0ZFXFx1REQwMC1cXHVERDRBXFx1REQ1MC1cXHVERDc5XFx1REQ3Qi1cXHVEREEzXFx1RERBNS1cXHVERTQyXFx1REU0NS1cXHVERUNGXFx1REVFMC1cXHVERUVDXFx1REVGMC1cXHVERUYzXFx1REYwMC1cXHVERjczXFx1REY4MC1cXHVERkQ0XXxcXHVEODNFW1xcdURDMDAtXFx1REMwQlxcdURDMTAtXFx1REM0N1xcdURDNTAtXFx1REM1OVxcdURDNjAtXFx1REM4N1xcdURDOTAtXFx1RENBRF0nO1xuLy8ganNjczplbmFibGUgbWF4aW11bUxpbmVMZW5ndGhcbi8vIGpzaGludCBpZ25vcmU6ZW5kXG4iLCIvLyBETyBOT1QgRURJVCFcbi8vIFRISVMgRklMRSBJUyBHRU5FUkFURUQhXG5cbi8vIEFsbCBiaWRpIGNoYXJhY3RlcnMgZm91bmQgaW4gY2xhc3NlcyAnUicsICdBTCcsICdSTEUnLCAnUkxPJywgYW5kICdSTEknIGFzIHBlciBVbmljb2RlIDcuMC4wLlxuXG4vLyBqc2hpbnQgaWdub3JlOnN0YXJ0XG4vLyBqc2NzOmRpc2FibGUgbWF4aW11bUxpbmVMZW5ndGhcbm1vZHVsZS5leHBvcnRzID0gJ1tcXHUwNUJFXFx1MDVDMFxcdTA1QzNcXHUwNUM2XFx1MDVEMC1cXHUwNUVBXFx1MDVGMC1cXHUwNUY0XFx1MDYwOFxcdTA2MEJcXHUwNjBEXFx1MDYxQlxcdTA2MUNcXHUwNjFFLVxcdTA2NEFcXHUwNjZELVxcdTA2NkZcXHUwNjcxLVxcdTA2RDVcXHUwNkU1XFx1MDZFNlxcdTA2RUVcXHUwNkVGXFx1MDZGQS1cXHUwNzBEXFx1MDcwRlxcdTA3MTBcXHUwNzEyLVxcdTA3MkZcXHUwNzRELVxcdTA3QTVcXHUwN0IxXFx1MDdDMC1cXHUwN0VBXFx1MDdGNFxcdTA3RjVcXHUwN0ZBXFx1MDgwMC1cXHUwODE1XFx1MDgxQVxcdTA4MjRcXHUwODI4XFx1MDgzMC1cXHUwODNFXFx1MDg0MC1cXHUwODU4XFx1MDg1RVxcdTA4QTAtXFx1MDhCMlxcdTIwMEZcXHUyMDJCXFx1MjAyRVxcdTIwNjdcXHVGQjFEXFx1RkIxRi1cXHVGQjI4XFx1RkIyQS1cXHVGQjM2XFx1RkIzOC1cXHVGQjNDXFx1RkIzRVxcdUZCNDBcXHVGQjQxXFx1RkI0M1xcdUZCNDRcXHVGQjQ2LVxcdUZCQzFcXHVGQkQzLVxcdUZEM0RcXHVGRDUwLVxcdUZEOEZcXHVGRDkyLVxcdUZEQzdcXHVGREYwLVxcdUZERkNcXHVGRTcwLVxcdUZFNzRcXHVGRTc2LVxcdUZFRkNdfFxcdUQ4MDJbXFx1REMwMC1cXHVEQzA1XFx1REMwOFxcdURDMEEtXFx1REMzNVxcdURDMzdcXHVEQzM4XFx1REMzQ1xcdURDM0YtXFx1REM1NVxcdURDNTctXFx1REM5RVxcdURDQTctXFx1RENBRlxcdUREMDAtXFx1REQxQlxcdUREMjAtXFx1REQzOVxcdUREM0ZcXHVERDgwLVxcdUREQjdcXHVEREJFXFx1RERCRlxcdURFMDBcXHVERTEwLVxcdURFMTNcXHVERTE1LVxcdURFMTdcXHVERTE5LVxcdURFMzNcXHVERTQwLVxcdURFNDdcXHVERTUwLVxcdURFNThcXHVERTYwLVxcdURFOUZcXHVERUMwLVxcdURFRTRcXHVERUVCLVxcdURFRjZcXHVERjAwLVxcdURGMzVcXHVERjQwLVxcdURGNTVcXHVERjU4LVxcdURGNzJcXHVERjc4LVxcdURGOTFcXHVERjk5LVxcdURGOUNcXHVERkE5LVxcdURGQUZdfFxcdUQ4MDNbXFx1REMwMC1cXHVEQzQ4XXxcXHVEODNBW1xcdURDMDAtXFx1RENDNFxcdURDQzctXFx1RENDRl18XFx1RDgzQltcXHVERTAwLVxcdURFMDNcXHVERTA1LVxcdURFMUZcXHVERTIxXFx1REUyMlxcdURFMjRcXHVERTI3XFx1REUyOS1cXHVERTMyXFx1REUzNC1cXHVERTM3XFx1REUzOVxcdURFM0JcXHVERTQyXFx1REU0N1xcdURFNDlcXHVERTRCXFx1REU0RC1cXHVERTRGXFx1REU1MVxcdURFNTJcXHVERTU0XFx1REU1N1xcdURFNTlcXHVERTVCXFx1REU1RFxcdURFNUZcXHVERTYxXFx1REU2MlxcdURFNjRcXHVERTY3LVxcdURFNkFcXHVERTZDLVxcdURFNzJcXHVERTc0LVxcdURFNzdcXHVERTc5LVxcdURFN0NcXHVERTdFXFx1REU4MC1cXHVERTg5XFx1REU4Qi1cXHVERTlCXFx1REVBMS1cXHVERUEzXFx1REVBNS1cXHVERUE5XFx1REVBQi1cXHVERUJCXSc7XG4vLyBqc2NzOmVuYWJsZSBtYXhpbXVtTGluZUxlbmd0aFxuLy8ganNoaW50IGlnbm9yZTplbmRcbiJdfQ==
