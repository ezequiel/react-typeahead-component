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
                className: "react-typeahead-offscreen"}
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
        onSelect: React.PropTypes.func,
        onInputClick: React.PropTypes.func,
        handleHint: React.PropTypes.func,
        onComplete: React.PropTypes.func,
        onOptionClick: React.PropTypes.func,
        onOptionChange: React.PropTypes.func,
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
            getMessageForOption: function() {
                return '';
            },
            getMessageForIncomingOptions: function() {
                return '';
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
            React.createElement("div", {className: 'react-typeahead-container ' + _this.props.className}, 
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
            React.createElement("div", {className: "react-typeahead-input-container"}, 
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
                    onChange: _this.handleChange, 
                    onKeyDown: _this.handleKeyDown, 
                    id: props.inputId, 
                    autoFocus: props.autoFocus, 
                    placeholder: props.placeholder, 
                    onSelect: props.onSelect, 
                    onKeyUp: props.onKeyUp, 
                    onKeyPress: props.onKeyPress, 
                    className: className + ' react-typeahead-usertext'}
                ), 

                React.createElement(Input, {
                    disabled: true, 
                    role: "presentation", 
                    "aria-hidden": true, 
                    dir: inputDirection, 
                    className: className + ' react-typeahead-hint', 
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
                className: 
                    'react-typeahead-options' + (!isDropdownVisible ? ' react-typeahead-hidden' : ''), 
                
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
            option = props.options[_this.state.selectedIndex] || props.inputValue;

        return (
            React.createElement(AriaStatus, {
                message: props.getMessageForOption(option)}
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
        this.setState({
            isDropdownVisible: true
        });
    },

    hideDropdown: function() {
        this.setState({
            isDropdownVisible: false
        });
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
        var _this = this;

        if (!React.findDOMNode(this).contains(event.target)) {
            _this.hideHint();
            _this.hideDropdown();
        }
    }
});


}).call(this,require('_process'))

},{"../utils/get_text_direction":7,"./aria_status.jsx":2,"./input.jsx":3,"_process":1,"react":"react"}],5:[function(require,module,exports){
module.exports = ".react-typeahead-offscreen,.react-typeahead-options,.react-typeahead-usertext{position:absolute}.react-typeahead-usertext{background-color:transparent}.react-typeahead-offscreen{left:-9999px}.react-typeahead-hint{color:silver;-webkit-text-fill-color:silver}.react-typeahead-input{padding:2px;border:1px solid silver}.react-typeahead-container,.react-typeahead-input-container{position:relative}.react-typeahead-hidden{display:none}.react-typeahead-options{width:100%;background:#fff;box-sizing:border-box}";


},{}],6:[function(require,module,exports){
(function (global){
var doc = global.document,
    css = require('./css/react-typeahead-component.css.js'),
    styleElement,
    head;

// If the `document` object exists, assume this is a browser.
if (doc) {
    styleElement = doc.createElement('style');

    if ('textContent' in styleElement) {
        styleElement.textContent = css;
    } else {
        // IE 8
        styleElement.styleSheet.cssText = css;
    }

    head = doc.head;
    head.insertBefore(styleElement, head.firstChild);
}

module.exports = require('./components/typeahead.jsx');


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./components/typeahead.jsx":4,"./css/react-typeahead-component.css.js":5}],7:[function(require,module,exports){
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


},{"./neutral_chars_regexp":8,"./rtl_chars_regexp":9}],8:[function(require,module,exports){
// DO NOT EDIT!
// THIS FILE IS GENERATED!

// All bidi characters except those found in classes 'L' (LTR), 'R' (RTL), and 'AL' (RTL Arabic) as per Unicode 7.0.0.

// jshint ignore:start
// jscs:disable maximumLineLength
module.exports = '[\0-@\[-`\{-\xA9\xAB-\xB4\xB6-\xB9\xBB-\xBF\xD7\xF7\u02B9\u02BA\u02C2-\u02CF\u02D2-\u02DF\u02E5-\u02ED\u02EF-\u036F\u0374\u0375\u037E\u0384\u0385\u0387\u03F6\u0483-\u0489\u058A\u058D-\u058F\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0600-\u0607\u0609\u060A\u060C\u060E-\u061A\u064B-\u066C\u0670\u06D6-\u06E4\u06E7-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07F6-\u07F9\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08E4-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u09F2\u09F3\u09FB\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AF1\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0BF3-\u0BFA\u0C00\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C78-\u0C7E\u0C81\u0CBC\u0CCC\u0CCD\u0CE2\u0CE3\u0D01\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E3F\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39-\u0F3D\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1390-\u1399\u1400\u1680\u169B\u169C\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DB\u17DD\u17F0-\u17F9\u1800-\u180E\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1940\u1944\u1945\u19DE-\u19FF\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF5\u1DFC-\u1DFF\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2000-\u200D\u2010-\u2029\u202F-\u2064\u2068\u206A-\u2070\u2074-\u207E\u2080-\u208E\u20A0-\u20BD\u20D0-\u20F0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u2150-\u215F\u2189\u2190-\u2335\u237B-\u2394\u2396-\u23FA\u2400-\u2426\u2440-\u244A\u2460-\u249B\u24EA-\u26AB\u26AD-\u27FF\u2900-\u2B73\u2B76-\u2B95\u2B98-\u2BB9\u2BBD-\u2BC8\u2BCA-\u2BD1\u2CE5-\u2CEA\u2CEF-\u2CF1\u2CF9-\u2CFF\u2D7F\u2DE0-\u2E42\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3000-\u3004\u3008-\u3020\u302A-\u302D\u3030\u3036\u3037\u303D-\u303F\u3099-\u309C\u30A0\u30FB\u31C0-\u31E3\u321D\u321E\u3250-\u325F\u327C-\u327E\u32B1-\u32BF\u32CC-\u32CF\u3377-\u337A\u33DE\u33DF\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA60D-\uA60F\uA66F-\uA67F\uA69F\uA6F0\uA6F1\uA700-\uA721\uA788\uA802\uA806\uA80B\uA825\uA826\uA828-\uA82B\uA838\uA839\uA874-\uA877\uA8C4\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFB29\uFD3E\uFD3F\uFDFD\uFE00-\uFE19\uFE20-\uFE2D\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFEFF\uFF01-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFF9-\uFFFD]|\uD800[\uDD01\uDD40-\uDD8C\uDD90-\uDD9B\uDDA0\uDDFD\uDEE0-\uDEFB\uDF76-\uDF7A]|\uD802[\uDD1F\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6\uDF39-\uDF3F]|\uD803[\uDE60-\uDE7E]|[\uD804\uDB40][\uDC01\uDC38-\uDC46\uDC52-\uDC65\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDE2F-\uDE31\uDE34\uDE36\uDE37\uDEDF\uDEE3-\uDEEA\uDF01\uDF3C\uDF40\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDCB3-\uDCB8\uDCBA\uDCBF\uDCC0\uDCC2\uDCC3\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB5\uDEB7]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF8F-\uDF92]|\uD82F[\uDC9D\uDC9E\uDCA0-\uDCA3]|\uD834[\uDD67-\uDD69\uDD73-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE00-\uDE45\uDF00-\uDF56]|\uD835[\uDEDB\uDF15\uDF4F\uDF89\uDFC3\uDFCE-\uDFFF]|\uD83A[\uDCD0-\uDCD6]|\uD83B[\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD00-\uDD0C\uDD6A\uDD6B\uDF00-\uDF2C\uDF30-\uDF7D\uDF80-\uDFCE\uDFD4-\uDFF7]|\uD83D[\uDC00-\uDCFE\uDD00-\uDD4A\uDD50-\uDD79\uDD7B-\uDDA3\uDDA5-\uDE42\uDE45-\uDECF\uDEE0-\uDEEC\uDEF0-\uDEF3\uDF00-\uDF73\uDF80-\uDFD4]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD]';
// jscs:enable maximumLineLength
// jshint ignore:end


},{}],9:[function(require,module,exports){
// DO NOT EDIT!
// THIS FILE IS GENERATED!

// All bidi characters found in classes 'R', 'AL', 'RLE', 'RLO', and 'RLI' as per Unicode 7.0.0.

// jshint ignore:start
// jscs:disable maximumLineLength
module.exports = '[\u05BE\u05C0\u05C3\u05C6\u05D0-\u05EA\u05F0-\u05F4\u0608\u060B\u060D\u061B\u061C\u061E-\u064A\u066D-\u066F\u0671-\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u070D\u070F\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0830-\u083E\u0840-\u0858\u085E\u08A0-\u08B2\u200F\u202B\u202E\u2067\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBC1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFC\uFE70-\uFE74\uFE76-\uFEFC]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC57-\uDC9E\uDCA7-\uDCAF\uDD00-\uDD1B\uDD20-\uDD39\uDD3F\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE40-\uDE47\uDE50-\uDE58\uDE60-\uDE9F\uDEC0-\uDEE4\uDEEB-\uDEF6\uDF00-\uDF35\uDF40-\uDF55\uDF58-\uDF72\uDF78-\uDF91\uDF99-\uDF9C\uDFA9-\uDFAF]|\uD803[\uDC00-\uDC48]|\uD83A[\uDC00-\uDCC4\uDCC7-\uDCCF]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]';
// jscs:enable maximumLineLength
// jshint ignore:end


},{}]},{},[6])(6)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL1VzZXJzL2V6ZXF1aWVsL0Rlc2t0b3AvcmVhY3QtdHlwZWFoZWFkLWNvbXBvbmVudC9zcmMvY29tcG9uZW50cy9hcmlhX3N0YXR1cy5qc3giLCIvVXNlcnMvZXplcXVpZWwvRGVza3RvcC9yZWFjdC10eXBlYWhlYWQtY29tcG9uZW50L3NyYy9jb21wb25lbnRzL2lucHV0LmpzeCIsIi9Vc2Vycy9lemVxdWllbC9EZXNrdG9wL3JlYWN0LXR5cGVhaGVhZC1jb21wb25lbnQvc3JjL2NvbXBvbmVudHMvdHlwZWFoZWFkLmpzeCIsIi9Vc2Vycy9lemVxdWllbC9EZXNrdG9wL3JlYWN0LXR5cGVhaGVhZC1jb21wb25lbnQvc3JjL2Nzcy9yZWFjdC10eXBlYWhlYWQtY29tcG9uZW50LmNzcy5qcyIsIi9Vc2Vycy9lemVxdWllbC9EZXNrdG9wL3JlYWN0LXR5cGVhaGVhZC1jb21wb25lbnQvc3JjL2luZGV4LmpzIiwiL1VzZXJzL2V6ZXF1aWVsL0Rlc2t0b3AvcmVhY3QtdHlwZWFoZWFkLWNvbXBvbmVudC9zcmMvdXRpbHMvZ2V0X3RleHRfZGlyZWN0aW9uLmpzIiwiL1VzZXJzL2V6ZXF1aWVsL0Rlc2t0b3AvcmVhY3QtdHlwZWFoZWFkLWNvbXBvbmVudC9zcmMvdXRpbHMvbmV1dHJhbF9jaGFyc19yZWdleHAuanMiLCIvVXNlcnMvZXplcXVpZWwvRGVza3RvcC9yZWFjdC10eXBlYWhlYWQtY29tcG9uZW50L3NyYy91dGlscy9ydGxfY2hhcnNfcmVnZXhwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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LEdBQUcsbUJBQW1CLEdBQUcsR0FBRyxDQUFDO0FBQ3RHLElBQUksV0FBVyxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyx1QkFBdUIsR0FBRyxLQUFLLENBQUMsQ0FBQzs7QUFFdkUsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLElBQUksRUFBRTtBQUNoQyxJQUFJLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQzs7SUFFaEIsSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQzFCLEdBQUcsR0FBRyxLQUFLLENBQUM7S0FDZixNQUFNLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUMvQixHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ25CLEtBQUs7O0lBRUQsT0FBTyxHQUFHLENBQUM7Q0FDZCxDQUFDOzs7O0FDakJGLGVBQWU7QUFDZiwwQkFBMEI7O0FBRTFCLHNIQUFzSDs7QUFFdEgsc0JBQXNCO0FBQ3RCLGlDQUFpQztBQUNqQyxNQUFNLENBQUMsT0FBTyxHQUFHLDY4SUFBNjhJLENBQUM7QUFDLzlJLGdDQUFnQztBQUNoQyxvQkFBb0I7Ozs7QUNUcEIsZUFBZTtBQUNmLDBCQUEwQjs7QUFFMUIsZ0dBQWdHOztBQUVoRyxzQkFBc0I7QUFDdEIsaUNBQWlDO0FBQ2pDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsd3NDQUF3c0MsQ0FBQztBQUMxdEMsZ0NBQWdDO0FBQ2hDLG9CQUFvQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IHRydWU7XG4gICAgdmFyIGN1cnJlbnRRdWV1ZTtcbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgd2hpbGUgKCsraSA8IGxlbikge1xuICAgICAgICAgICAgY3VycmVudFF1ZXVlW2ldKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xufVxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICBxdWV1ZS5wdXNoKGZ1bik7XG4gICAgaWYgKCFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ0FyaWEgU3RhdHVzJyxcblxuICAgIHByb3BUeXBlczogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyA/IHt9IDoge1xuICAgICAgICBtZXNzYWdlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gICAgfSxcblxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAvLyBUaGlzIGlzIG5lZWRlZCBhcyBgY29tcG9uZW50RGlkVXBkYXRlYFxuICAgICAgICAvLyBkb2VzIG5vdCBmaXJlIG9uIHRoZSBpbml0aWFsIHJlbmRlci5cbiAgICAgICAgX3RoaXMuc2V0VGV4dENvbnRlbnQoX3RoaXMucHJvcHMubWVzc2FnZSk7XG4gICAgfSxcblxuICAgIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgX3RoaXMuc2V0VGV4dENvbnRlbnQoX3RoaXMucHJvcHMubWVzc2FnZSk7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgIHJvbGU9J3N0YXR1cydcbiAgICAgICAgICAgICAgICBhcmlhLWxpdmU9J3BvbGl0ZSdcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9J3JlYWN0LXR5cGVhaGVhZC1vZmZzY3JlZW4nXG4gICAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICAvLyBXZSBjYW5ub3Qgc2V0IGB0ZXh0Q29udGVudGAgZGlyZWN0bHkgaW4gYHJlbmRlcmAsXG4gICAgLy8gYmVjYXVzZSBSZWFjdCBhZGRzL2RlbGV0ZXMgdGV4dCBub2RlcyB3aGVuIHJlbmRlcmluZyxcbiAgICAvLyB3aGljaCBjb25mdXNlcyBzY3JlZW4gcmVhZGVycyBhbmQgZG9lc24ndCBjYXVzZSB0aGVtIHRvIHJlYWQgY2hhbmdlcy5cbiAgICBzZXRUZXh0Q29udGVudDogZnVuY3Rpb24odGV4dENvbnRlbnQpIHtcbiAgICAgICAgLy8gV2UgY291bGQgc2V0IGBpbm5lckhUTUxgLCBidXQgaXQncyBiZXR0ZXIgdG8gYXZvaWQgaXQuXG4gICAgICAgIHRoaXMuZ2V0RE9NTm9kZSgpLnRleHRDb250ZW50ID0gdGV4dENvbnRlbnQgfHwgJyc7XG4gICAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnSW5wdXQnLFxuXG4gICAgcHJvcFR5cGVzOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nID8ge30gOiB7XG4gICAgICAgIHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBvbkNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbiAgICB9LFxuXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiAnJyxcbiAgICAgICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbigpIHt9XG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgICBkaXIgPSBfdGhpcy5wcm9wcy5kaXI7XG5cbiAgICAgICAgaWYgKGRpciA9PT0gbnVsbCB8fCBkaXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gV2hlbiBzZXR0aW5nIGFuIGF0dHJpYnV0ZSB0byBudWxsL3VuZGVmaW5lZCxcbiAgICAgICAgICAgIC8vIFJlYWN0IGluc3RlYWQgc2V0cyB0aGUgYXR0cmlidXRlIHRvIGFuIGVtcHR5IHN0cmluZy5cblxuICAgICAgICAgICAgLy8gVGhpcyBpcyBub3QgZGVzaXJlZCBiZWNhdXNlIG9mIGEgcG9zc2libGUgYnVnIGluIENocm9tZS5cbiAgICAgICAgICAgIC8vIElmIHRoZSBwYWdlIGlzIFJUTCwgYW5kIHRoZSBpbnB1dCdzIGBkaXJgIGF0dHJpYnV0ZSBpcyBzZXRcbiAgICAgICAgICAgIC8vIHRvIGFuIGVtcHR5IHN0cmluZywgQ2hyb21lIGFzc3VtZXMgTFRSLCB3aGljaCBpc24ndCB3aGF0IHdlIHdhbnQuXG4gICAgICAgICAgICBSZWFjdC5maW5kRE9NTm9kZShfdGhpcykucmVtb3ZlQXR0cmlidXRlKCdkaXInKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICB7Li4uX3RoaXMucHJvcHN9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e190aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIHByb3BzID0gdGhpcy5wcm9wcztcblxuICAgICAgICAvLyBUaGVyZSBhcmUgc2V2ZXJhbCBSZWFjdCBidWdzIGluIElFLFxuICAgICAgICAvLyB3aGVyZSB0aGUgYGlucHV0YCdzIGBvbkNoYW5nZWAgZXZlbnQgaXNcbiAgICAgICAgLy8gZmlyZWQgZXZlbiB3aGVuIHRoZSB2YWx1ZSBkaWRuJ3QgY2hhbmdlLlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvaXNzdWVzLzIxODVcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy8zMzc3XG4gICAgICAgIGlmIChldmVudC50YXJnZXQudmFsdWUgIT09IHByb3BzLnZhbHVlKSB7XG4gICAgICAgICAgICBwcm9wcy5vbkNoYW5nZShldmVudCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgYmx1cjogZnVuY3Rpb24oKSB7XG4gICAgICAgIFJlYWN0LmZpbmRET01Ob2RlKHRoaXMpLmJsdXIoKTtcbiAgICB9LFxuXG4gICAgaXNDdXJzb3JBdEVuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgICBpbnB1dERPTU5vZGUgPSBSZWFjdC5maW5kRE9NTm9kZShfdGhpcyksXG4gICAgICAgICAgICB2YWx1ZUxlbmd0aCA9IF90aGlzLnByb3BzLnZhbHVlLmxlbmd0aDtcblxuICAgICAgICByZXR1cm4gaW5wdXRET01Ob2RlLnNlbGVjdGlvblN0YXJ0ID09PSB2YWx1ZUxlbmd0aCAmJlxuICAgICAgICAgICAgICAgaW5wdXRET01Ob2RlLnNlbGVjdGlvbkVuZCA9PT0gdmFsdWVMZW5ndGg7XG4gICAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JyksXG4gICAgSW5wdXQgPSByZXF1aXJlKCcuL2lucHV0LmpzeCcpLFxuICAgIEFyaWFTdGF0dXMgPSByZXF1aXJlKCcuL2FyaWFfc3RhdHVzLmpzeCcpLFxuICAgIGdldFRleHREaXJlY3Rpb24gPSByZXF1aXJlKCcuLi91dGlscy9nZXRfdGV4dF9kaXJlY3Rpb24nKSxcbiAgICBub29wID0gZnVuY3Rpb24oKSB7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgZGlzcGxheU5hbWU6ICdUeXBlYWhlYWQnLFxuXG4gICAgcHJvcFR5cGVzOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nID8ge30gOiB7XG4gICAgICAgIGlucHV0SWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgYXV0b0ZvY3VzOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgICAgICAgaW5wdXRWYWx1ZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgb3B0aW9uczogUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxuICAgICAgICBwbGFjZWhvbGRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgb25DaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbktleURvd246IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbktleVByZXNzOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25LZXlVcDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uRm9jdXM6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvblNlbGVjdDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uSW5wdXRDbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIGhhbmRsZUhpbnQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbkNvbXBsZXRlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25PcHRpb25DbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uT3B0aW9uQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb3B0aW9uVGVtcGxhdGU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICAgIGdldE1lc3NhZ2VGb3JPcHRpb246IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBnZXRNZXNzYWdlRm9ySW5jb21pbmdPcHRpb25zOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xuICAgIH0sXG5cbiAgICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaW5wdXRWYWx1ZTogJycsXG4gICAgICAgICAgICBvcHRpb25zOiBbXSxcbiAgICAgICAgICAgIG9uRm9jdXM6IG5vb3AsXG4gICAgICAgICAgICBvbktleURvd246IG5vb3AsXG4gICAgICAgICAgICBvbkNoYW5nZTogbm9vcCxcbiAgICAgICAgICAgIG9uSW5wdXRDbGljazogbm9vcCxcbiAgICAgICAgICAgIGhhbmRsZUhpbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbk9wdGlvbkNsaWNrOiBub29wLFxuICAgICAgICAgICAgb25PcHRpb25DaGFuZ2U6IG5vb3AsXG4gICAgICAgICAgICBvbkNvbXBsZXRlOiAgbm9vcCxcbiAgICAgICAgICAgIGdldE1lc3NhZ2VGb3JPcHRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRNZXNzYWdlRm9ySW5jb21pbmdPcHRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgIH0sXG5cbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2VsZWN0ZWRJbmRleDogLTEsXG4gICAgICAgICAgICBpc0hpbnRWaXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGlzRHJvcGRvd25WaXNpYmxlOiBmYWxzZVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgICAgdW5pcXVlSWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgICAgICBfdGhpcy51c2VySW5wdXRWYWx1ZSA9IG51bGw7XG4gICAgICAgIF90aGlzLnByZXZpb3VzSW5wdXRWYWx1ZSA9IG51bGw7XG4gICAgICAgIF90aGlzLmFjdGl2ZURlc2NlbmRhbnRJZCA9ICdyZWFjdC10eXBlYWhlYWQtYWN0aXZlZGVzY2VuZGFudC0nICsgdW5pcXVlSWQ7XG4gICAgICAgIF90aGlzLm9wdGlvbnNJZCA9ICdyZWFjdC10eXBlYWhlYWQtb3B0aW9ucy0nICsgdW5pcXVlSWQ7XG4gICAgfSxcblxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFkZEV2ZW50ID0gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIsXG4gICAgICAgICAgICBoYW5kbGVXaW5kb3dDbG9zZSA9IHRoaXMuaGFuZGxlV2luZG93Q2xvc2U7XG5cbiAgICAgICAgLy8gVGhlIGBmb2N1c2AgZXZlbnQgZG9lcyBub3QgYnViYmxlLCBzbyB3ZSBtdXN0IGNhcHR1cmUgaXQgaW5zdGVhZC5cbiAgICAgICAgLy8gVGhpcyBjbG9zZXMgVHlwZWFoZWFkJ3MgZHJvcGRvd24gd2hlbmV2ZXIgc29tZXRoaW5nIGVsc2UgZ2FpbnMgZm9jdXMuXG4gICAgICAgIGFkZEV2ZW50KCdmb2N1cycsIGhhbmRsZVdpbmRvd0Nsb3NlLCB0cnVlKTtcblxuICAgICAgICAvLyBJZiB3ZSBjbGljayBhbnl3aGVyZSBvdXRzaWRlIG9mIFR5cGVhaGVhZCwgY2xvc2UgdGhlIGRyb3Bkb3duLlxuICAgICAgICBhZGRFdmVudCgnY2xpY2snLCBoYW5kbGVXaW5kb3dDbG9zZSwgZmFsc2UpO1xuICAgIH0sXG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZW1vdmVFdmVudCA9IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyLFxuICAgICAgICAgICAgaGFuZGxlV2luZG93Q2xvc2UgPSB0aGlzLmhhbmRsZVdpbmRvd0Nsb3NlO1xuXG4gICAgICAgIHJlbW92ZUV2ZW50KCdmb2N1cycsIGhhbmRsZVdpbmRvd0Nsb3NlLCB0cnVlKTtcbiAgICAgICAgcmVtb3ZlRXZlbnQoJ2NsaWNrJywgaGFuZGxlV2luZG93Q2xvc2UsIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzKSB7XG4gICAgICAgIHZhciBuZXh0VmFsdWUgPSBuZXh0UHJvcHMuaW5wdXRWYWx1ZSxcbiAgICAgICAgICAgIG5leHRPcHRpb25zID0gbmV4dFByb3BzLm9wdGlvbnMsXG4gICAgICAgICAgICB2YWx1ZUxlbmd0aCA9IG5leHRWYWx1ZS5sZW5ndGgsXG4gICAgICAgICAgICBpc0hpbnRWaXNpYmxlID0gdmFsdWVMZW5ndGggPiAwICYmXG4gICAgICAgICAgICAgICAgLy8gQSB2aXNpYmxlIHBhcnQgb2YgdGhlIGhpbnQgbXVzdCBiZVxuICAgICAgICAgICAgICAgIC8vIGF2YWlsYWJsZSBmb3IgdXMgdG8gY29tcGxldGUgaXQuXG4gICAgICAgICAgICAgICAgbmV4dFByb3BzLmhhbmRsZUhpbnQobmV4dFZhbHVlLCBuZXh0T3B0aW9ucykuc2xpY2UodmFsdWVMZW5ndGgpLmxlbmd0aCA+IDA7XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpc0hpbnRWaXNpYmxlOiBpc0hpbnRWaXNpYmxlXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17J3JlYWN0LXR5cGVhaGVhZC1jb250YWluZXIgJyArIF90aGlzLnByb3BzLmNsYXNzTmFtZX0+XG4gICAgICAgICAgICAgICAge190aGlzLnJlbmRlcklucHV0KCl9XG4gICAgICAgICAgICAgICAge190aGlzLnJlbmRlckRyb3Bkb3duKCl9XG4gICAgICAgICAgICAgICAge190aGlzLnJlbmRlckFyaWFNZXNzYWdlRm9yT3B0aW9ucygpfVxuICAgICAgICAgICAgICAgIHtfdGhpcy5yZW5kZXJBcmlhTWVzc2FnZUZvckluY29taW5nT3B0aW9ucygpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIHJlbmRlcklucHV0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIHN0YXRlID0gX3RoaXMuc3RhdGUsXG4gICAgICAgICAgICBwcm9wcyA9IF90aGlzLnByb3BzLFxuICAgICAgICAgICAgaW5wdXRWYWx1ZSA9IHByb3BzLmlucHV0VmFsdWUsXG4gICAgICAgICAgICBjbGFzc05hbWUgPSAncmVhY3QtdHlwZWFoZWFkLWlucHV0JyxcbiAgICAgICAgICAgIGlucHV0RGlyZWN0aW9uID0gZ2V0VGV4dERpcmVjdGlvbihpbnB1dFZhbHVlKTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3JlYWN0LXR5cGVhaGVhZC1pbnB1dC1jb250YWluZXInPlxuICAgICAgICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgICAgICAgICByZWY9J2lucHV0J1xuICAgICAgICAgICAgICAgICAgICByb2xlPSdjb21ib2JveCdcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1vd25zPXtfdGhpcy5vcHRpb25zSWR9XG4gICAgICAgICAgICAgICAgICAgIGFyaWEtZXhwYW5kZWQ9e3N0YXRlLmlzRHJvcGRvd25WaXNpYmxlfVxuICAgICAgICAgICAgICAgICAgICBhcmlhLWF1dG9jb21wbGV0ZT0nYm90aCdcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1hY3RpdmVkZXNjZW5kYW50PXtfdGhpcy5hY3RpdmVEZXNjZW5kYW50SWR9XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpbnB1dFZhbHVlfVxuICAgICAgICAgICAgICAgICAgICBzcGVsbENoZWNrPXtmYWxzZX1cbiAgICAgICAgICAgICAgICAgICAgYXV0b0NvbXBsZXRlPXtmYWxzZX1cbiAgICAgICAgICAgICAgICAgICAgYXV0b0NvcnJlY3Q9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICBkaXI9e2lucHV0RGlyZWN0aW9ufVxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtfdGhpcy5oYW5kbGVDbGlja31cbiAgICAgICAgICAgICAgICAgICAgb25Gb2N1cz17X3RoaXMuaGFuZGxlRm9jdXN9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtfdGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICAgICAgICAgIG9uS2V5RG93bj17X3RoaXMuaGFuZGxlS2V5RG93bn1cbiAgICAgICAgICAgICAgICAgICAgaWQ9e3Byb3BzLmlucHV0SWR9XG4gICAgICAgICAgICAgICAgICAgIGF1dG9Gb2N1cz17cHJvcHMuYXV0b0ZvY3VzfVxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17cHJvcHMucGxhY2Vob2xkZXJ9XG4gICAgICAgICAgICAgICAgICAgIG9uU2VsZWN0PXtwcm9wcy5vblNlbGVjdH1cbiAgICAgICAgICAgICAgICAgICAgb25LZXlVcD17cHJvcHMub25LZXlVcH1cbiAgICAgICAgICAgICAgICAgICAgb25LZXlQcmVzcz17cHJvcHMub25LZXlQcmVzc31cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWUgKyAnIHJlYWN0LXR5cGVhaGVhZC11c2VydGV4dCd9XG4gICAgICAgICAgICAgICAgLz5cblxuICAgICAgICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICAgcm9sZT0ncHJlc2VudGF0aW9uJ1xuICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICAgZGlyPXtpbnB1dERpcmVjdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWUgKyAnIHJlYWN0LXR5cGVhaGVhZC1oaW50J31cbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3N0YXRlLmlzSGludFZpc2libGUgPyBwcm9wcy5oYW5kbGVIaW50KGlucHV0VmFsdWUsIHByb3BzLm9wdGlvbnMpIDogbnVsbH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIHJlbmRlckRyb3Bkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIHN0YXRlID0gX3RoaXMuc3RhdGUsXG4gICAgICAgICAgICBwcm9wcyA9IF90aGlzLnByb3BzLFxuICAgICAgICAgICAgT3B0aW9uVGVtcGxhdGUgPSBwcm9wcy5vcHRpb25UZW1wbGF0ZSxcbiAgICAgICAgICAgIHNlbGVjdGVkSW5kZXggPSBzdGF0ZS5zZWxlY3RlZEluZGV4LFxuICAgICAgICAgICAgaXNEcm9wZG93blZpc2libGUgPSBzdGF0ZS5pc0Ryb3Bkb3duVmlzaWJsZSxcbiAgICAgICAgICAgIGFjdGl2ZURlc2NlbmRhbnRJZCA9IF90aGlzLmFjdGl2ZURlc2NlbmRhbnRJZDtcblxuICAgICAgICBpZiAodGhpcy5wcm9wcy5vcHRpb25zLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDx1bCBpZD17X3RoaXMub3B0aW9uc0lkfVxuICAgICAgICAgICAgICAgIHJvbGU9J2xpc3Rib3gnXG4gICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49eyFpc0Ryb3Bkb3duVmlzaWJsZX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e1xuICAgICAgICAgICAgICAgICAgICAncmVhY3QtdHlwZWFoZWFkLW9wdGlvbnMnICsgKCFpc0Ryb3Bkb3duVmlzaWJsZSA/ICcgcmVhY3QtdHlwZWFoZWFkLWhpZGRlbicgOiAnJylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb25Nb3VzZU91dD17dGhpcy5oYW5kbGVNb3VzZU91dH0+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBwcm9wcy5vcHRpb25zLm1hcChmdW5jdGlvbihkYXRhLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlzU2VsZWN0ZWQgPSBzZWxlY3RlZEluZGV4ID09PSBpbmRleDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGkgaWQ9e2lzU2VsZWN0ZWQgPyBhY3RpdmVEZXNjZW5kYW50SWQgOiBudWxsfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb2xlPSdvcHRpb24nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e190aGlzLmhhbmRsZU9wdGlvbkNsaWNrLmJpbmQoX3RoaXMsIGluZGV4KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Nb3VzZU92ZXI9e190aGlzLmhhbmRsZU9wdGlvbk1vdXNlT3Zlci5iaW5kKF90aGlzLCBpbmRleCl9PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxPcHRpb25UZW1wbGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YT17ZGF0YX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4PXtpbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJbnB1dFZhbHVlPXtfdGhpcy51c2VySW5wdXRWYWx1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0VmFsdWU9e3Byb3BzLmlucHV0VmFsdWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1NlbGVjdGVkPXtpc1NlbGVjdGVkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIHJlbmRlckFyaWFNZXNzYWdlRm9yT3B0aW9uczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgICBwcm9wcyA9IF90aGlzLnByb3BzLFxuICAgICAgICAgICAgb3B0aW9uID0gcHJvcHMub3B0aW9uc1tfdGhpcy5zdGF0ZS5zZWxlY3RlZEluZGV4XSB8fCBwcm9wcy5pbnB1dFZhbHVlO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8QXJpYVN0YXR1c1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U9e3Byb3BzLmdldE1lc3NhZ2VGb3JPcHRpb24ob3B0aW9uKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIHJlbmRlckFyaWFNZXNzYWdlRm9ySW5jb21pbmdPcHRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxBcmlhU3RhdHVzXG4gICAgICAgICAgICAgICAgbWVzc2FnZT17dGhpcy5wcm9wcy5nZXRNZXNzYWdlRm9ySW5jb21pbmdPcHRpb25zKCl9XG4gICAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICBzaG93RHJvcGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlzRHJvcGRvd25WaXNpYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBoaWRlRHJvcGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlzRHJvcGRvd25WaXNpYmxlOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2hvd0hpbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgICAgcHJvcHMgPSBfdGhpcy5wcm9wcyxcbiAgICAgICAgICAgIGlucHV0VmFsdWUgPSBwcm9wcy5pbnB1dFZhbHVlLFxuICAgICAgICAgICAgaW5wdXRWYWx1ZUxlbmd0aCA9IGlucHV0VmFsdWUubGVuZ3RoLFxuICAgICAgICAgICAgaXNIaW50VmlzaWJsZSA9IGlucHV0VmFsdWVMZW5ndGggPiAwICYmXG4gICAgICAgICAgICAgICAgLy8gQSB2aXNpYmxlIHBhcnQgb2YgdGhlIGhpbnQgbXVzdCBiZVxuICAgICAgICAgICAgICAgIC8vIGF2YWlsYWJsZSBmb3IgdXMgdG8gY29tcGxldGUgaXQuXG4gICAgICAgICAgICAgICAgcHJvcHMuaGFuZGxlSGludChpbnB1dFZhbHVlLCBwcm9wcy5vcHRpb25zKS5zbGljZShpbnB1dFZhbHVlTGVuZ3RoKS5sZW5ndGggPiAwO1xuXG4gICAgICAgIF90aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlzSGludFZpc2libGU6IGlzSGludFZpc2libGVcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGhpZGVIaW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpc0hpbnRWaXNpYmxlOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2V0U2VsZWN0ZWRJbmRleDogZnVuY3Rpb24oaW5kZXgsIGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgc2VsZWN0ZWRJbmRleDogaW5kZXhcbiAgICAgICAgfSwgY2FsbGJhY2spO1xuICAgIH0sXG5cbiAgICBoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgX3RoaXMuc2hvd0hpbnQoKTtcbiAgICAgICAgX3RoaXMuc2hvd0Ryb3Bkb3duKCk7XG4gICAgICAgIF90aGlzLnNldFNlbGVjdGVkSW5kZXgoLTEpO1xuICAgICAgICBfdGhpcy5wcm9wcy5vbkNoYW5nZShldmVudCk7XG4gICAgICAgIF90aGlzLnVzZXJJbnB1dFZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIH0sXG5cbiAgICBoYW5kbGVGb2N1czogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICBfdGhpcy5zaG93RHJvcGRvd24oKTtcbiAgICAgICAgX3RoaXMucHJvcHMub25Gb2N1cyhldmVudCk7XG4gICAgfSxcblxuICAgIGhhbmRsZUNsaWNrOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIF90aGlzLnNob3dIaW50KCk7XG4gICAgICAgIF90aGlzLnByb3BzLm9uSW5wdXRDbGljayhldmVudCk7XG4gICAgfSxcblxuICAgIG5hdmlnYXRlOiBmdW5jdGlvbihkaXJlY3Rpb24sIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgICBtaW5JbmRleCA9IC0xLFxuICAgICAgICAgICAgbWF4SW5kZXggPSBfdGhpcy5wcm9wcy5vcHRpb25zLmxlbmd0aCAtIDEsXG4gICAgICAgICAgICBpbmRleCA9IF90aGlzLnN0YXRlLnNlbGVjdGVkSW5kZXggKyBkaXJlY3Rpb247XG5cbiAgICAgICAgaWYgKGluZGV4ID4gbWF4SW5kZXgpIHtcbiAgICAgICAgICAgIGluZGV4ID0gbWluSW5kZXg7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5kZXggPCBtaW5JbmRleCkge1xuICAgICAgICAgICAgaW5kZXggPSBtYXhJbmRleDtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzLnNldFNlbGVjdGVkSW5kZXgoaW5kZXgsIGNhbGxiYWNrKTtcbiAgICB9LFxuXG4gICAgaGFuZGxlS2V5RG93bjogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIGtleSA9IGV2ZW50LmtleSxcbiAgICAgICAgICAgIHByb3BzID0gX3RoaXMucHJvcHMsXG4gICAgICAgICAgICBpbnB1dCA9IF90aGlzLnJlZnMuaW5wdXQsXG4gICAgICAgICAgICBpc0Ryb3Bkb3duVmlzaWJsZSA9IF90aGlzLnN0YXRlLmlzRHJvcGRvd25WaXNpYmxlLFxuICAgICAgICAgICAgaXNIaW50VmlzaWJsZSA9IF90aGlzLnN0YXRlLmlzSGludFZpc2libGUsXG4gICAgICAgICAgICBoYXNIYW5kbGVkS2V5RG93biA9IGZhbHNlLFxuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICBvcHRpb25EYXRhLFxuICAgICAgICAgICAgZGlyO1xuXG4gICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgIGNhc2UgJ0VuZCc6XG4gICAgICAgIGNhc2UgJ1RhYic6XG4gICAgICAgICAgICBpZiAoaXNIaW50VmlzaWJsZSAmJiAhZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHByb3BzLm9uQ29tcGxldGUoZXZlbnQsIHByb3BzLmhhbmRsZUhpbnQocHJvcHMuaW5wdXRWYWx1ZSwgcHJvcHMub3B0aW9ucykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6XG4gICAgICAgIGNhc2UgJ0Fycm93UmlnaHQnOlxuICAgICAgICAgICAgaWYgKGlzSGludFZpc2libGUgJiYgIWV2ZW50LnNoaWZ0S2V5ICYmIGlucHV0LmlzQ3Vyc29yQXRFbmQoKSkge1xuICAgICAgICAgICAgICAgIGRpciA9IGdldFRleHREaXJlY3Rpb24ocHJvcHMuaW5wdXRWYWx1ZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoKGRpciA9PT0gJ2x0cicgJiYga2V5ID09PSAnQXJyb3dSaWdodCcpIHx8IChkaXIgPT09ICdydGwnICYmIGtleSA9PT0gJ0Fycm93TGVmdCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BzLm9uQ29tcGxldGUoZXZlbnQsIHByb3BzLmhhbmRsZUhpbnQocHJvcHMuaW5wdXRWYWx1ZSwgcHJvcHMub3B0aW9ucykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdFbnRlcic6XG4gICAgICAgICAgICBpbnB1dC5ibHVyKCk7XG4gICAgICAgICAgICBfdGhpcy5oaWRlSGludCgpO1xuICAgICAgICAgICAgX3RoaXMuaGlkZURyb3Bkb3duKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnRXNjYXBlJzpcbiAgICAgICAgICAgIF90aGlzLmhpZGVIaW50KCk7XG4gICAgICAgICAgICBfdGhpcy5oaWRlRHJvcGRvd24oKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdBcnJvd1VwJzpcbiAgICAgICAgY2FzZSAnQXJyb3dEb3duJzpcbiAgICAgICAgICAgIGlmIChwcm9wcy5vcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgX3RoaXMuc2hvd0hpbnQoKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5zaG93RHJvcGRvd24oKTtcblxuICAgICAgICAgICAgICAgIGlmIChpc0Ryb3Bkb3duVmlzaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICBkaXIgPSBrZXkgPT09ICdBcnJvd1VwJyA/IC0xOiAxO1xuICAgICAgICAgICAgICAgICAgICBoYXNIYW5kbGVkS2V5RG93biA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubmF2aWdhdGUoZGlyLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZEluZGV4ID0gX3RoaXMuc3RhdGUuc2VsZWN0ZWRJbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2aW91c0lucHV0VmFsdWUgPSBfdGhpcy5wcmV2aW91c0lucHV0VmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uRGF0YSA9IHByZXZpb3VzSW5wdXRWYWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UncmUgY3VycmVudGx5IG9uIGFuIG9wdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTYXZlIHRoZSBjdXJyZW50IGBpbnB1dGAgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXMgd2UgbWlnaHQgYXJyb3cgYmFjayB0byBpdCBsYXRlci5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldmlvdXNJbnB1dFZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnByZXZpb3VzSW5wdXRWYWx1ZSA9IHByb3BzLmlucHV0VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uRGF0YSA9IHByb3BzLm9wdGlvbnNbc2VsZWN0ZWRJbmRleF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzLm9uT3B0aW9uQ2hhbmdlKGV2ZW50LCBvcHRpb25EYXRhLCBzZWxlY3RlZEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzLm9uS2V5RG93bihldmVudCwgb3B0aW9uRGF0YSwgc2VsZWN0ZWRJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWhhc0hhbmRsZWRLZXlEb3duKSB7XG4gICAgICAgICAgICBpbmRleCA9IHRoaXMuc3RhdGUuc2VsZWN0ZWRJbmRleDtcbiAgICAgICAgICAgIG9wdGlvbkRhdGEgPSBpbmRleCA8IDAgPyBwcm9wcy5pbnB1dFZhbHVlIDogcHJvcHMub3B0aW9uc1tpbmRleF07XG4gICAgICAgICAgICBwcm9wcy5vbktleURvd24oZXZlbnQsIG9wdGlvbkRhdGEsIGluZGV4KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBoYW5kbGVPcHRpb25DbGljazogZnVuY3Rpb24oc2VsZWN0ZWRJbmRleCwgZXZlbnQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIHByb3BzID0gX3RoaXMucHJvcHM7XG5cbiAgICAgICAgX3RoaXMuaGlkZUhpbnQoKTtcbiAgICAgICAgX3RoaXMuaGlkZURyb3Bkb3duKCk7XG4gICAgICAgIF90aGlzLnNldFNlbGVjdGVkSW5kZXgoc2VsZWN0ZWRJbmRleCk7XG4gICAgICAgIHByb3BzLm9uT3B0aW9uQ2xpY2soZXZlbnQsIHByb3BzLm9wdGlvbnNbc2VsZWN0ZWRJbmRleF0sIHNlbGVjdGVkSW5kZXgpO1xuICAgIH0sXG5cbiAgICBoYW5kbGVPcHRpb25Nb3VzZU92ZXI6IGZ1bmN0aW9uKHNlbGVjdGVkSW5kZXgpIHtcbiAgICAgICAgdGhpcy5zZXRTZWxlY3RlZEluZGV4KHNlbGVjdGVkSW5kZXgpO1xuICAgIH0sXG5cbiAgICBoYW5kbGVNb3VzZU91dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRJbmRleCgtMSk7XG4gICAgfSxcblxuICAgIGhhbmRsZVdpbmRvd0Nsb3NlOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIGlmICghUmVhY3QuZmluZERPTU5vZGUodGhpcykuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgICAgICAgX3RoaXMuaGlkZUhpbnQoKTtcbiAgICAgICAgICAgIF90aGlzLmhpZGVEcm9wZG93bigpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiLnJlYWN0LXR5cGVhaGVhZC1vZmZzY3JlZW4sLnJlYWN0LXR5cGVhaGVhZC1vcHRpb25zLC5yZWFjdC10eXBlYWhlYWQtdXNlcnRleHR7cG9zaXRpb246YWJzb2x1dGV9LnJlYWN0LXR5cGVhaGVhZC11c2VydGV4dHtiYWNrZ3JvdW5kLWNvbG9yOnRyYW5zcGFyZW50fS5yZWFjdC10eXBlYWhlYWQtb2Zmc2NyZWVue2xlZnQ6LTk5OTlweH0ucmVhY3QtdHlwZWFoZWFkLWhpbnR7Y29sb3I6c2lsdmVyOy13ZWJraXQtdGV4dC1maWxsLWNvbG9yOnNpbHZlcn0ucmVhY3QtdHlwZWFoZWFkLWlucHV0e3BhZGRpbmc6MnB4O2JvcmRlcjoxcHggc29saWQgc2lsdmVyfS5yZWFjdC10eXBlYWhlYWQtY29udGFpbmVyLC5yZWFjdC10eXBlYWhlYWQtaW5wdXQtY29udGFpbmVye3Bvc2l0aW9uOnJlbGF0aXZlfS5yZWFjdC10eXBlYWhlYWQtaGlkZGVue2Rpc3BsYXk6bm9uZX0ucmVhY3QtdHlwZWFoZWFkLW9wdGlvbnN7d2lkdGg6MTAwJTtiYWNrZ3JvdW5kOiNmZmY7Ym94LXNpemluZzpib3JkZXItYm94fVwiO1xuIiwidmFyIGRvYyA9IGdsb2JhbC5kb2N1bWVudCxcbiAgICBjc3MgPSByZXF1aXJlKCcuL2Nzcy9yZWFjdC10eXBlYWhlYWQtY29tcG9uZW50LmNzcy5qcycpLFxuICAgIHN0eWxlRWxlbWVudCxcbiAgICBoZWFkO1xuXG4vLyBJZiB0aGUgYGRvY3VtZW50YCBvYmplY3QgZXhpc3RzLCBhc3N1bWUgdGhpcyBpcyBhIGJyb3dzZXIuXG5pZiAoZG9jKSB7XG4gICAgc3R5bGVFbGVtZW50ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG5cbiAgICBpZiAoJ3RleHRDb250ZW50JyBpbiBzdHlsZUVsZW1lbnQpIHtcbiAgICAgICAgc3R5bGVFbGVtZW50LnRleHRDb250ZW50ID0gY3NzO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIElFIDhcbiAgICAgICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgICB9XG5cbiAgICBoZWFkID0gZG9jLmhlYWQ7XG4gICAgaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBoZWFkLmZpcnN0Q2hpbGQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy90eXBlYWhlYWQuanN4Jyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBSVExDaGFyYWN0ZXJzUmVnRXhwID0gcmVxdWlyZSgnLi9ydGxfY2hhcnNfcmVnZXhwJyksXG4gICAgTmV1dHJhbENoYXJhY3RlcnNSZWdFeHAgPSByZXF1aXJlKCcuL25ldXRyYWxfY2hhcnNfcmVnZXhwJyksXG4gICAgc3RhcnRzV2l0aFJUTCA9IG5ldyBSZWdFeHAoJ14oPzonICsgTmV1dHJhbENoYXJhY3RlcnNSZWdFeHAgKyAnKSooPzonICsgUlRMQ2hhcmFjdGVyc1JlZ0V4cCArICcpJyksXG4gICAgbmV1dHJhbFRleHQgPSBuZXcgUmVnRXhwKCdeKD86JyArIE5ldXRyYWxDaGFyYWN0ZXJzUmVnRXhwICsgJykqJCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICB2YXIgZGlyID0gJ2x0cic7XG5cbiAgICBpZiAoc3RhcnRzV2l0aFJUTC50ZXN0KHRleHQpKSB7XG4gICAgICAgIGRpciA9ICdydGwnO1xuICAgIH0gZWxzZSBpZiAobmV1dHJhbFRleHQudGVzdCh0ZXh0KSkge1xuICAgICAgICBkaXIgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBkaXI7XG59O1xuIiwiLy8gRE8gTk9UIEVESVQhXG4vLyBUSElTIEZJTEUgSVMgR0VORVJBVEVEIVxuXG4vLyBBbGwgYmlkaSBjaGFyYWN0ZXJzIGV4Y2VwdCB0aG9zZSBmb3VuZCBpbiBjbGFzc2VzICdMJyAoTFRSKSwgJ1InIChSVEwpLCBhbmQgJ0FMJyAoUlRMIEFyYWJpYykgYXMgcGVyIFVuaWNvZGUgNy4wLjAuXG5cbi8vIGpzaGludCBpZ25vcmU6c3RhcnRcbi8vIGpzY3M6ZGlzYWJsZSBtYXhpbXVtTGluZUxlbmd0aFxubW9kdWxlLmV4cG9ydHMgPSAnW1xcMC1AXFxbLWBcXHstXFx4QTlcXHhBQi1cXHhCNFxceEI2LVxceEI5XFx4QkItXFx4QkZcXHhEN1xceEY3XFx1MDJCOVxcdTAyQkFcXHUwMkMyLVxcdTAyQ0ZcXHUwMkQyLVxcdTAyREZcXHUwMkU1LVxcdTAyRURcXHUwMkVGLVxcdTAzNkZcXHUwMzc0XFx1MDM3NVxcdTAzN0VcXHUwMzg0XFx1MDM4NVxcdTAzODdcXHUwM0Y2XFx1MDQ4My1cXHUwNDg5XFx1MDU4QVxcdTA1OEQtXFx1MDU4RlxcdTA1OTEtXFx1MDVCRFxcdTA1QkZcXHUwNUMxXFx1MDVDMlxcdTA1QzRcXHUwNUM1XFx1MDVDN1xcdTA2MDAtXFx1MDYwN1xcdTA2MDlcXHUwNjBBXFx1MDYwQ1xcdTA2MEUtXFx1MDYxQVxcdTA2NEItXFx1MDY2Q1xcdTA2NzBcXHUwNkQ2LVxcdTA2RTRcXHUwNkU3LVxcdTA2RURcXHUwNkYwLVxcdTA2RjlcXHUwNzExXFx1MDczMC1cXHUwNzRBXFx1MDdBNi1cXHUwN0IwXFx1MDdFQi1cXHUwN0YzXFx1MDdGNi1cXHUwN0Y5XFx1MDgxNi1cXHUwODE5XFx1MDgxQi1cXHUwODIzXFx1MDgyNS1cXHUwODI3XFx1MDgyOS1cXHUwODJEXFx1MDg1OS1cXHUwODVCXFx1MDhFNC1cXHUwOTAyXFx1MDkzQVxcdTA5M0NcXHUwOTQxLVxcdTA5NDhcXHUwOTREXFx1MDk1MS1cXHUwOTU3XFx1MDk2MlxcdTA5NjNcXHUwOTgxXFx1MDlCQ1xcdTA5QzEtXFx1MDlDNFxcdTA5Q0RcXHUwOUUyXFx1MDlFM1xcdTA5RjJcXHUwOUYzXFx1MDlGQlxcdTBBMDFcXHUwQTAyXFx1MEEzQ1xcdTBBNDFcXHUwQTQyXFx1MEE0N1xcdTBBNDhcXHUwQTRCLVxcdTBBNERcXHUwQTUxXFx1MEE3MFxcdTBBNzFcXHUwQTc1XFx1MEE4MVxcdTBBODJcXHUwQUJDXFx1MEFDMS1cXHUwQUM1XFx1MEFDN1xcdTBBQzhcXHUwQUNEXFx1MEFFMlxcdTBBRTNcXHUwQUYxXFx1MEIwMVxcdTBCM0NcXHUwQjNGXFx1MEI0MS1cXHUwQjQ0XFx1MEI0RFxcdTBCNTZcXHUwQjYyXFx1MEI2M1xcdTBCODJcXHUwQkMwXFx1MEJDRFxcdTBCRjMtXFx1MEJGQVxcdTBDMDBcXHUwQzNFLVxcdTBDNDBcXHUwQzQ2LVxcdTBDNDhcXHUwQzRBLVxcdTBDNERcXHUwQzU1XFx1MEM1NlxcdTBDNjJcXHUwQzYzXFx1MEM3OC1cXHUwQzdFXFx1MEM4MVxcdTBDQkNcXHUwQ0NDXFx1MENDRFxcdTBDRTJcXHUwQ0UzXFx1MEQwMVxcdTBENDEtXFx1MEQ0NFxcdTBENERcXHUwRDYyXFx1MEQ2M1xcdTBEQ0FcXHUwREQyLVxcdTBERDRcXHUwREQ2XFx1MEUzMVxcdTBFMzQtXFx1MEUzQVxcdTBFM0ZcXHUwRTQ3LVxcdTBFNEVcXHUwRUIxXFx1MEVCNC1cXHUwRUI5XFx1MEVCQlxcdTBFQkNcXHUwRUM4LVxcdTBFQ0RcXHUwRjE4XFx1MEYxOVxcdTBGMzVcXHUwRjM3XFx1MEYzOS1cXHUwRjNEXFx1MEY3MS1cXHUwRjdFXFx1MEY4MC1cXHUwRjg0XFx1MEY4NlxcdTBGODdcXHUwRjhELVxcdTBGOTdcXHUwRjk5LVxcdTBGQkNcXHUwRkM2XFx1MTAyRC1cXHUxMDMwXFx1MTAzMi1cXHUxMDM3XFx1MTAzOVxcdTEwM0FcXHUxMDNEXFx1MTAzRVxcdTEwNThcXHUxMDU5XFx1MTA1RS1cXHUxMDYwXFx1MTA3MS1cXHUxMDc0XFx1MTA4MlxcdTEwODVcXHUxMDg2XFx1MTA4RFxcdTEwOURcXHUxMzVELVxcdTEzNUZcXHUxMzkwLVxcdTEzOTlcXHUxNDAwXFx1MTY4MFxcdTE2OUJcXHUxNjlDXFx1MTcxMi1cXHUxNzE0XFx1MTczMi1cXHUxNzM0XFx1MTc1MlxcdTE3NTNcXHUxNzcyXFx1MTc3M1xcdTE3QjRcXHUxN0I1XFx1MTdCNy1cXHUxN0JEXFx1MTdDNlxcdTE3QzktXFx1MTdEM1xcdTE3REJcXHUxN0REXFx1MTdGMC1cXHUxN0Y5XFx1MTgwMC1cXHUxODBFXFx1MThBOVxcdTE5MjAtXFx1MTkyMlxcdTE5MjdcXHUxOTI4XFx1MTkzMlxcdTE5MzktXFx1MTkzQlxcdTE5NDBcXHUxOTQ0XFx1MTk0NVxcdTE5REUtXFx1MTlGRlxcdTFBMTdcXHUxQTE4XFx1MUExQlxcdTFBNTZcXHUxQTU4LVxcdTFBNUVcXHUxQTYwXFx1MUE2MlxcdTFBNjUtXFx1MUE2Q1xcdTFBNzMtXFx1MUE3Q1xcdTFBN0ZcXHUxQUIwLVxcdTFBQkVcXHUxQjAwLVxcdTFCMDNcXHUxQjM0XFx1MUIzNi1cXHUxQjNBXFx1MUIzQ1xcdTFCNDJcXHUxQjZCLVxcdTFCNzNcXHUxQjgwXFx1MUI4MVxcdTFCQTItXFx1MUJBNVxcdTFCQThcXHUxQkE5XFx1MUJBQi1cXHUxQkFEXFx1MUJFNlxcdTFCRThcXHUxQkU5XFx1MUJFRFxcdTFCRUYtXFx1MUJGMVxcdTFDMkMtXFx1MUMzM1xcdTFDMzZcXHUxQzM3XFx1MUNEMC1cXHUxQ0QyXFx1MUNENC1cXHUxQ0UwXFx1MUNFMi1cXHUxQ0U4XFx1MUNFRFxcdTFDRjRcXHUxQ0Y4XFx1MUNGOVxcdTFEQzAtXFx1MURGNVxcdTFERkMtXFx1MURGRlxcdTFGQkRcXHUxRkJGLVxcdTFGQzFcXHUxRkNELVxcdTFGQ0ZcXHUxRkRELVxcdTFGREZcXHUxRkVELVxcdTFGRUZcXHUxRkZEXFx1MUZGRVxcdTIwMDAtXFx1MjAwRFxcdTIwMTAtXFx1MjAyOVxcdTIwMkYtXFx1MjA2NFxcdTIwNjhcXHUyMDZBLVxcdTIwNzBcXHUyMDc0LVxcdTIwN0VcXHUyMDgwLVxcdTIwOEVcXHUyMEEwLVxcdTIwQkRcXHUyMEQwLVxcdTIwRjBcXHUyMTAwXFx1MjEwMVxcdTIxMDMtXFx1MjEwNlxcdTIxMDhcXHUyMTA5XFx1MjExNFxcdTIxMTYtXFx1MjExOFxcdTIxMUUtXFx1MjEyM1xcdTIxMjVcXHUyMTI3XFx1MjEyOVxcdTIxMkVcXHUyMTNBXFx1MjEzQlxcdTIxNDAtXFx1MjE0NFxcdTIxNEEtXFx1MjE0RFxcdTIxNTAtXFx1MjE1RlxcdTIxODlcXHUyMTkwLVxcdTIzMzVcXHUyMzdCLVxcdTIzOTRcXHUyMzk2LVxcdTIzRkFcXHUyNDAwLVxcdTI0MjZcXHUyNDQwLVxcdTI0NEFcXHUyNDYwLVxcdTI0OUJcXHUyNEVBLVxcdTI2QUJcXHUyNkFELVxcdTI3RkZcXHUyOTAwLVxcdTJCNzNcXHUyQjc2LVxcdTJCOTVcXHUyQjk4LVxcdTJCQjlcXHUyQkJELVxcdTJCQzhcXHUyQkNBLVxcdTJCRDFcXHUyQ0U1LVxcdTJDRUFcXHUyQ0VGLVxcdTJDRjFcXHUyQ0Y5LVxcdTJDRkZcXHUyRDdGXFx1MkRFMC1cXHUyRTQyXFx1MkU4MC1cXHUyRTk5XFx1MkU5Qi1cXHUyRUYzXFx1MkYwMC1cXHUyRkQ1XFx1MkZGMC1cXHUyRkZCXFx1MzAwMC1cXHUzMDA0XFx1MzAwOC1cXHUzMDIwXFx1MzAyQS1cXHUzMDJEXFx1MzAzMFxcdTMwMzZcXHUzMDM3XFx1MzAzRC1cXHUzMDNGXFx1MzA5OS1cXHUzMDlDXFx1MzBBMFxcdTMwRkJcXHUzMUMwLVxcdTMxRTNcXHUzMjFEXFx1MzIxRVxcdTMyNTAtXFx1MzI1RlxcdTMyN0MtXFx1MzI3RVxcdTMyQjEtXFx1MzJCRlxcdTMyQ0MtXFx1MzJDRlxcdTMzNzctXFx1MzM3QVxcdTMzREVcXHUzM0RGXFx1MzNGRlxcdTREQzAtXFx1NERGRlxcdUE0OTAtXFx1QTRDNlxcdUE2MEQtXFx1QTYwRlxcdUE2NkYtXFx1QTY3RlxcdUE2OUZcXHVBNkYwXFx1QTZGMVxcdUE3MDAtXFx1QTcyMVxcdUE3ODhcXHVBODAyXFx1QTgwNlxcdUE4MEJcXHVBODI1XFx1QTgyNlxcdUE4MjgtXFx1QTgyQlxcdUE4MzhcXHVBODM5XFx1QTg3NC1cXHVBODc3XFx1QThDNFxcdUE4RTAtXFx1QThGMVxcdUE5MjYtXFx1QTkyRFxcdUE5NDctXFx1QTk1MVxcdUE5ODAtXFx1QTk4MlxcdUE5QjNcXHVBOUI2LVxcdUE5QjlcXHVBOUJDXFx1QTlFNVxcdUFBMjktXFx1QUEyRVxcdUFBMzFcXHVBQTMyXFx1QUEzNVxcdUFBMzZcXHVBQTQzXFx1QUE0Q1xcdUFBN0NcXHVBQUIwXFx1QUFCMi1cXHVBQUI0XFx1QUFCN1xcdUFBQjhcXHVBQUJFXFx1QUFCRlxcdUFBQzFcXHVBQUVDXFx1QUFFRFxcdUFBRjZcXHVBQkU1XFx1QUJFOFxcdUFCRURcXHVGQjFFXFx1RkIyOVxcdUZEM0VcXHVGRDNGXFx1RkRGRFxcdUZFMDAtXFx1RkUxOVxcdUZFMjAtXFx1RkUyRFxcdUZFMzAtXFx1RkU1MlxcdUZFNTQtXFx1RkU2NlxcdUZFNjgtXFx1RkU2QlxcdUZFRkZcXHVGRjAxLVxcdUZGMjBcXHVGRjNCLVxcdUZGNDBcXHVGRjVCLVxcdUZGNjVcXHVGRkUwLVxcdUZGRTZcXHVGRkU4LVxcdUZGRUVcXHVGRkY5LVxcdUZGRkRdfFxcdUQ4MDBbXFx1REQwMVxcdURENDAtXFx1REQ4Q1xcdUREOTAtXFx1REQ5QlxcdUREQTBcXHVEREZEXFx1REVFMC1cXHVERUZCXFx1REY3Ni1cXHVERjdBXXxcXHVEODAyW1xcdUREMUZcXHVERTAxLVxcdURFMDNcXHVERTA1XFx1REUwNlxcdURFMEMtXFx1REUwRlxcdURFMzgtXFx1REUzQVxcdURFM0ZcXHVERUU1XFx1REVFNlxcdURGMzktXFx1REYzRl18XFx1RDgwM1tcXHVERTYwLVxcdURFN0VdfFtcXHVEODA0XFx1REI0MF1bXFx1REMwMVxcdURDMzgtXFx1REM0NlxcdURDNTItXFx1REM2NVxcdURDN0YtXFx1REM4MVxcdURDQjMtXFx1RENCNlxcdURDQjlcXHVEQ0JBXFx1REQwMC1cXHVERDAyXFx1REQyNy1cXHVERDJCXFx1REQyRC1cXHVERDM0XFx1REQ3M1xcdUREODBcXHVERDgxXFx1RERCNi1cXHVEREJFXFx1REUyRi1cXHVERTMxXFx1REUzNFxcdURFMzZcXHVERTM3XFx1REVERlxcdURFRTMtXFx1REVFQVxcdURGMDFcXHVERjNDXFx1REY0MFxcdURGNjYtXFx1REY2Q1xcdURGNzAtXFx1REY3NF18XFx1RDgwNVtcXHVEQ0IzLVxcdURDQjhcXHVEQ0JBXFx1RENCRlxcdURDQzBcXHVEQ0MyXFx1RENDM1xcdUREQjItXFx1RERCNVxcdUREQkNcXHVEREJEXFx1RERCRlxcdUREQzBcXHVERTMzLVxcdURFM0FcXHVERTNEXFx1REUzRlxcdURFNDBcXHVERUFCXFx1REVBRFxcdURFQjAtXFx1REVCNVxcdURFQjddfFxcdUQ4MUFbXFx1REVGMC1cXHVERUY0XFx1REYzMC1cXHVERjM2XXxcXHVEODFCW1xcdURGOEYtXFx1REY5Ml18XFx1RDgyRltcXHVEQzlEXFx1REM5RVxcdURDQTAtXFx1RENBM118XFx1RDgzNFtcXHVERDY3LVxcdURENjlcXHVERDczLVxcdUREODJcXHVERDg1LVxcdUREOEJcXHVEREFBLVxcdUREQURcXHVERTAwLVxcdURFNDVcXHVERjAwLVxcdURGNTZdfFxcdUQ4MzVbXFx1REVEQlxcdURGMTVcXHVERjRGXFx1REY4OVxcdURGQzNcXHVERkNFLVxcdURGRkZdfFxcdUQ4M0FbXFx1RENEMC1cXHVEQ0Q2XXxcXHVEODNCW1xcdURFRjBcXHVERUYxXXxcXHVEODNDW1xcdURDMDAtXFx1REMyQlxcdURDMzAtXFx1REM5M1xcdURDQTAtXFx1RENBRVxcdURDQjEtXFx1RENCRlxcdURDQzEtXFx1RENDRlxcdURDRDEtXFx1RENGNVxcdUREMDAtXFx1REQwQ1xcdURENkFcXHVERDZCXFx1REYwMC1cXHVERjJDXFx1REYzMC1cXHVERjdEXFx1REY4MC1cXHVERkNFXFx1REZENC1cXHVERkY3XXxcXHVEODNEW1xcdURDMDAtXFx1RENGRVxcdUREMDAtXFx1REQ0QVxcdURENTAtXFx1REQ3OVxcdUREN0ItXFx1RERBM1xcdUREQTUtXFx1REU0MlxcdURFNDUtXFx1REVDRlxcdURFRTAtXFx1REVFQ1xcdURFRjAtXFx1REVGM1xcdURGMDAtXFx1REY3M1xcdURGODAtXFx1REZENF18XFx1RDgzRVtcXHVEQzAwLVxcdURDMEJcXHVEQzEwLVxcdURDNDdcXHVEQzUwLVxcdURDNTlcXHVEQzYwLVxcdURDODdcXHVEQzkwLVxcdURDQURdJztcbi8vIGpzY3M6ZW5hYmxlIG1heGltdW1MaW5lTGVuZ3RoXG4vLyBqc2hpbnQgaWdub3JlOmVuZFxuIiwiLy8gRE8gTk9UIEVESVQhXG4vLyBUSElTIEZJTEUgSVMgR0VORVJBVEVEIVxuXG4vLyBBbGwgYmlkaSBjaGFyYWN0ZXJzIGZvdW5kIGluIGNsYXNzZXMgJ1InLCAnQUwnLCAnUkxFJywgJ1JMTycsIGFuZCAnUkxJJyBhcyBwZXIgVW5pY29kZSA3LjAuMC5cblxuLy8ganNoaW50IGlnbm9yZTpzdGFydFxuLy8ganNjczpkaXNhYmxlIG1heGltdW1MaW5lTGVuZ3RoXG5tb2R1bGUuZXhwb3J0cyA9ICdbXFx1MDVCRVxcdTA1QzBcXHUwNUMzXFx1MDVDNlxcdTA1RDAtXFx1MDVFQVxcdTA1RjAtXFx1MDVGNFxcdTA2MDhcXHUwNjBCXFx1MDYwRFxcdTA2MUJcXHUwNjFDXFx1MDYxRS1cXHUwNjRBXFx1MDY2RC1cXHUwNjZGXFx1MDY3MS1cXHUwNkQ1XFx1MDZFNVxcdTA2RTZcXHUwNkVFXFx1MDZFRlxcdTA2RkEtXFx1MDcwRFxcdTA3MEZcXHUwNzEwXFx1MDcxMi1cXHUwNzJGXFx1MDc0RC1cXHUwN0E1XFx1MDdCMVxcdTA3QzAtXFx1MDdFQVxcdTA3RjRcXHUwN0Y1XFx1MDdGQVxcdTA4MDAtXFx1MDgxNVxcdTA4MUFcXHUwODI0XFx1MDgyOFxcdTA4MzAtXFx1MDgzRVxcdTA4NDAtXFx1MDg1OFxcdTA4NUVcXHUwOEEwLVxcdTA4QjJcXHUyMDBGXFx1MjAyQlxcdTIwMkVcXHUyMDY3XFx1RkIxRFxcdUZCMUYtXFx1RkIyOFxcdUZCMkEtXFx1RkIzNlxcdUZCMzgtXFx1RkIzQ1xcdUZCM0VcXHVGQjQwXFx1RkI0MVxcdUZCNDNcXHVGQjQ0XFx1RkI0Ni1cXHVGQkMxXFx1RkJEMy1cXHVGRDNEXFx1RkQ1MC1cXHVGRDhGXFx1RkQ5Mi1cXHVGREM3XFx1RkRGMC1cXHVGREZDXFx1RkU3MC1cXHVGRTc0XFx1RkU3Ni1cXHVGRUZDXXxcXHVEODAyW1xcdURDMDAtXFx1REMwNVxcdURDMDhcXHVEQzBBLVxcdURDMzVcXHVEQzM3XFx1REMzOFxcdURDM0NcXHVEQzNGLVxcdURDNTVcXHVEQzU3LVxcdURDOUVcXHVEQ0E3LVxcdURDQUZcXHVERDAwLVxcdUREMUJcXHVERDIwLVxcdUREMzlcXHVERDNGXFx1REQ4MC1cXHVEREI3XFx1RERCRVxcdUREQkZcXHVERTAwXFx1REUxMC1cXHVERTEzXFx1REUxNS1cXHVERTE3XFx1REUxOS1cXHVERTMzXFx1REU0MC1cXHVERTQ3XFx1REU1MC1cXHVERTU4XFx1REU2MC1cXHVERTlGXFx1REVDMC1cXHVERUU0XFx1REVFQi1cXHVERUY2XFx1REYwMC1cXHVERjM1XFx1REY0MC1cXHVERjU1XFx1REY1OC1cXHVERjcyXFx1REY3OC1cXHVERjkxXFx1REY5OS1cXHVERjlDXFx1REZBOS1cXHVERkFGXXxcXHVEODAzW1xcdURDMDAtXFx1REM0OF18XFx1RDgzQVtcXHVEQzAwLVxcdURDQzRcXHVEQ0M3LVxcdURDQ0ZdfFxcdUQ4M0JbXFx1REUwMC1cXHVERTAzXFx1REUwNS1cXHVERTFGXFx1REUyMVxcdURFMjJcXHVERTI0XFx1REUyN1xcdURFMjktXFx1REUzMlxcdURFMzQtXFx1REUzN1xcdURFMzlcXHVERTNCXFx1REU0MlxcdURFNDdcXHVERTQ5XFx1REU0QlxcdURFNEQtXFx1REU0RlxcdURFNTFcXHVERTUyXFx1REU1NFxcdURFNTdcXHVERTU5XFx1REU1QlxcdURFNURcXHVERTVGXFx1REU2MVxcdURFNjJcXHVERTY0XFx1REU2Ny1cXHVERTZBXFx1REU2Qy1cXHVERTcyXFx1REU3NC1cXHVERTc3XFx1REU3OS1cXHVERTdDXFx1REU3RVxcdURFODAtXFx1REU4OVxcdURFOEItXFx1REU5QlxcdURFQTEtXFx1REVBM1xcdURFQTUtXFx1REVBOVxcdURFQUItXFx1REVCQl0nO1xuLy8ganNjczplbmFibGUgbWF4aW11bUxpbmVMZW5ndGhcbi8vIGpzaGludCBpZ25vcmU6ZW5kXG4iXX0=
