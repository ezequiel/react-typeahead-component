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
            isHintVisible = state.isHintVisible,
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
                    });
                }
            }

            break;
        }

        props.onKeyDown(event);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL1VzZXJzL2V6ZXF1aWVsL0Rlc2t0b3AvcmVhY3QtdHlwZWFoZWFkLWNvbXBvbmVudC9zcmMvY29tcG9uZW50cy9hcmlhX3N0YXR1cy5qc3giLCIvVXNlcnMvZXplcXVpZWwvRGVza3RvcC9yZWFjdC10eXBlYWhlYWQtY29tcG9uZW50L3NyYy9jb21wb25lbnRzL2lucHV0LmpzeCIsIi9Vc2Vycy9lemVxdWllbC9EZXNrdG9wL3JlYWN0LXR5cGVhaGVhZC1jb21wb25lbnQvc3JjL2NvbXBvbmVudHMvdHlwZWFoZWFkLmpzeCIsIi9Vc2Vycy9lemVxdWllbC9EZXNrdG9wL3JlYWN0LXR5cGVhaGVhZC1jb21wb25lbnQvc3JjL2Nzcy9yZWFjdC10eXBlYWhlYWQtY29tcG9uZW50LmNzcy5qcyIsIi9Vc2Vycy9lemVxdWllbC9EZXNrdG9wL3JlYWN0LXR5cGVhaGVhZC1jb21wb25lbnQvc3JjL2luZGV4LmpzIiwiL1VzZXJzL2V6ZXF1aWVsL0Rlc2t0b3AvcmVhY3QtdHlwZWFoZWFkLWNvbXBvbmVudC9zcmMvdXRpbHMvZ2V0X3RleHRfZGlyZWN0aW9uLmpzIiwiL1VzZXJzL2V6ZXF1aWVsL0Rlc2t0b3AvcmVhY3QtdHlwZWFoZWFkLWNvbXBvbmVudC9zcmMvdXRpbHMvbmV1dHJhbF9jaGFyc19yZWdleHAuanMiLCIvVXNlcnMvZXplcXVpZWwvRGVza3RvcC9yZWFjdC10eXBlYWhlYWQtY29tcG9uZW50L3NyYy91dGlscy9ydGxfY2hhcnNfcmVnZXhwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUMsRUFBRTtRQUMvQixHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ25CLEtBQUs7O0lBRUQsT0FBTyxHQUFHLENBQUM7Q0FDZCxDQUFDOzs7O0FDakJGLGVBQWU7QUFDZiwwQkFBMEI7O0FBRTFCLHNIQUFzSDs7QUFFdEgsc0JBQXNCO0FBQ3RCLGlDQUFpQztBQUNqQyxNQUFNLENBQUMsT0FBTyxHQUFHLDY4SUFBNjhJLENBQUM7QUFDLzlJLGdDQUFnQztBQUNoQyxvQkFBb0I7Ozs7QUNUcEIsZUFBZTtBQUNmLDBCQUEwQjs7QUFFMUIsZ0dBQWdHOztBQUVoRyxzQkFBc0I7QUFDdEIsaUNBQWlDO0FBQ2pDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsd3NDQUF3c0MsQ0FBQztBQUMxdEMsZ0NBQWdDO0FBQ2hDLG9CQUFvQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IHRydWU7XG4gICAgdmFyIGN1cnJlbnRRdWV1ZTtcbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgd2hpbGUgKCsraSA8IGxlbikge1xuICAgICAgICAgICAgY3VycmVudFF1ZXVlW2ldKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xufVxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICBxdWV1ZS5wdXNoKGZ1bik7XG4gICAgaWYgKCFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ0FyaWEgU3RhdHVzJyxcblxuICAgIHByb3BUeXBlczogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyA/IHt9IDoge1xuICAgICAgICBtZXNzYWdlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gICAgfSxcblxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAvLyBUaGlzIGlzIG5lZWRlZCBhcyBgY29tcG9uZW50RGlkVXBkYXRlYFxuICAgICAgICAvLyBkb2VzIG5vdCBmaXJlIG9uIHRoZSBpbml0aWFsIHJlbmRlci5cbiAgICAgICAgX3RoaXMuc2V0VGV4dENvbnRlbnQoX3RoaXMucHJvcHMubWVzc2FnZSk7XG4gICAgfSxcblxuICAgIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgX3RoaXMuc2V0VGV4dENvbnRlbnQoX3RoaXMucHJvcHMubWVzc2FnZSk7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgIHJvbGU9J3N0YXR1cydcbiAgICAgICAgICAgICAgICBhcmlhLWxpdmU9J3BvbGl0ZSdcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9J3JlYWN0LXR5cGVhaGVhZC1vZmZzY3JlZW4nXG4gICAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICAvLyBXZSBjYW5ub3Qgc2V0IGB0ZXh0Q29udGVudGAgZGlyZWN0bHkgaW4gYHJlbmRlcmAsXG4gICAgLy8gYmVjYXVzZSBSZWFjdCBhZGRzL2RlbGV0ZXMgdGV4dCBub2RlcyB3aGVuIHJlbmRlcmluZyxcbiAgICAvLyB3aGljaCBjb25mdXNlcyBzY3JlZW4gcmVhZGVycyBhbmQgZG9lc24ndCBjYXVzZSB0aGVtIHRvIHJlYWQgY2hhbmdlcy5cbiAgICBzZXRUZXh0Q29udGVudDogZnVuY3Rpb24odGV4dENvbnRlbnQpIHtcbiAgICAgICAgLy8gV2UgY291bGQgc2V0IGBpbm5lckhUTUxgLCBidXQgaXQncyBiZXR0ZXIgdG8gYXZvaWQgaXQuXG4gICAgICAgIHRoaXMuZ2V0RE9NTm9kZSgpLnRleHRDb250ZW50ID0gdGV4dENvbnRlbnQgfHwgJyc7XG4gICAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnSW5wdXQnLFxuXG4gICAgcHJvcFR5cGVzOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nID8ge30gOiB7XG4gICAgICAgIHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBvbkNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbiAgICB9LFxuXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiAnJyxcbiAgICAgICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbigpIHt9XG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgICBkaXIgPSBfdGhpcy5wcm9wcy5kaXI7XG5cbiAgICAgICAgaWYgKGRpciA9PT0gbnVsbCB8fCBkaXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gV2hlbiBzZXR0aW5nIGFuIGF0dHJpYnV0ZSB0byBudWxsL3VuZGVmaW5lZCxcbiAgICAgICAgICAgIC8vIFJlYWN0IGluc3RlYWQgc2V0cyB0aGUgYXR0cmlidXRlIHRvIGFuIGVtcHR5IHN0cmluZy5cblxuICAgICAgICAgICAgLy8gVGhpcyBpcyBub3QgZGVzaXJlZCBiZWNhdXNlIG9mIGEgcG9zc2libGUgYnVnIGluIENocm9tZS5cbiAgICAgICAgICAgIC8vIElmIHRoZSBwYWdlIGlzIFJUTCwgYW5kIHRoZSBpbnB1dCdzIGBkaXJgIGF0dHJpYnV0ZSBpcyBzZXRcbiAgICAgICAgICAgIC8vIHRvIGFuIGVtcHR5IHN0cmluZywgQ2hyb21lIGFzc3VtZXMgTFRSLCB3aGljaCBpc24ndCB3aGF0IHdlIHdhbnQuXG4gICAgICAgICAgICBSZWFjdC5maW5kRE9NTm9kZShfdGhpcykucmVtb3ZlQXR0cmlidXRlKCdkaXInKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICB7Li4uX3RoaXMucHJvcHN9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e190aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIHByb3BzID0gdGhpcy5wcm9wcztcblxuICAgICAgICAvLyBUaGVyZSBhcmUgc2V2ZXJhbCBSZWFjdCBidWdzIGluIElFLFxuICAgICAgICAvLyB3aGVyZSB0aGUgYGlucHV0YCdzIGBvbkNoYW5nZWAgZXZlbnQgaXNcbiAgICAgICAgLy8gZmlyZWQgZXZlbiB3aGVuIHRoZSB2YWx1ZSBkaWRuJ3QgY2hhbmdlLlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvaXNzdWVzLzIxODVcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy8zMzc3XG4gICAgICAgIGlmIChldmVudC50YXJnZXQudmFsdWUgIT09IHByb3BzLnZhbHVlKSB7XG4gICAgICAgICAgICBwcm9wcy5vbkNoYW5nZShldmVudCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgYmx1cjogZnVuY3Rpb24oKSB7XG4gICAgICAgIFJlYWN0LmZpbmRET01Ob2RlKHRoaXMpLmJsdXIoKTtcbiAgICB9LFxuXG4gICAgaXNDdXJzb3JBdEVuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgICBpbnB1dERPTU5vZGUgPSBSZWFjdC5maW5kRE9NTm9kZShfdGhpcyksXG4gICAgICAgICAgICB2YWx1ZUxlbmd0aCA9IF90aGlzLnByb3BzLnZhbHVlLmxlbmd0aDtcblxuICAgICAgICByZXR1cm4gaW5wdXRET01Ob2RlLnNlbGVjdGlvblN0YXJ0ID09PSB2YWx1ZUxlbmd0aCAmJlxuICAgICAgICAgICAgICAgaW5wdXRET01Ob2RlLnNlbGVjdGlvbkVuZCA9PT0gdmFsdWVMZW5ndGg7XG4gICAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JyksXG4gICAgSW5wdXQgPSByZXF1aXJlKCcuL2lucHV0LmpzeCcpLFxuICAgIEFyaWFTdGF0dXMgPSByZXF1aXJlKCcuL2FyaWFfc3RhdHVzLmpzeCcpLFxuICAgIGdldFRleHREaXJlY3Rpb24gPSByZXF1aXJlKCcuLi91dGlscy9nZXRfdGV4dF9kaXJlY3Rpb24nKSxcbiAgICBub29wID0gZnVuY3Rpb24oKSB7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgZGlzcGxheU5hbWU6ICdUeXBlYWhlYWQnLFxuXG4gICAgcHJvcFR5cGVzOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nID8ge30gOiB7XG4gICAgICAgIGlucHV0SWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgYXV0b0ZvY3VzOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgICAgICAgaW5wdXRWYWx1ZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgb3B0aW9uczogUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxuICAgICAgICBwbGFjZWhvbGRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgb25DaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbktleURvd246IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbktleVByZXNzOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25LZXlVcDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uRm9jdXM6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvblNlbGVjdDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uSW5wdXRDbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIGhhbmRsZUhpbnQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbkNvbXBsZXRlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25PcHRpb25DbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uT3B0aW9uQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb3B0aW9uVGVtcGxhdGU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICAgIGdldE1lc3NhZ2VGb3JPcHRpb246IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBnZXRNZXNzYWdlRm9ySW5jb21pbmdPcHRpb25zOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xuICAgIH0sXG5cbiAgICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaW5wdXRWYWx1ZTogJycsXG4gICAgICAgICAgICBvcHRpb25zOiBbXSxcbiAgICAgICAgICAgIG9uRm9jdXM6IG5vb3AsXG4gICAgICAgICAgICBvbktleURvd246IG5vb3AsXG4gICAgICAgICAgICBvbkNoYW5nZTogbm9vcCxcbiAgICAgICAgICAgIG9uSW5wdXRDbGljazogbm9vcCxcbiAgICAgICAgICAgIGhhbmRsZUhpbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbk9wdGlvbkNsaWNrOiBub29wLFxuICAgICAgICAgICAgb25PcHRpb25DaGFuZ2U6IG5vb3AsXG4gICAgICAgICAgICBvbkNvbXBsZXRlOiAgbm9vcCxcbiAgICAgICAgICAgIGdldE1lc3NhZ2VGb3JPcHRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRNZXNzYWdlRm9ySW5jb21pbmdPcHRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgIH0sXG5cbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2VsZWN0ZWRJbmRleDogLTEsXG4gICAgICAgICAgICBpc0hpbnRWaXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGlzRHJvcGRvd25WaXNpYmxlOiBmYWxzZVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgICAgdW5pcXVlSWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgICAgICBfdGhpcy51c2VySW5wdXRWYWx1ZSA9IG51bGw7XG4gICAgICAgIF90aGlzLnByZXZpb3VzSW5wdXRWYWx1ZSA9IG51bGw7XG4gICAgICAgIF90aGlzLmFjdGl2ZURlc2NlbmRhbnRJZCA9ICdyZWFjdC10eXBlYWhlYWQtYWN0aXZlZGVzY2VuZGFudC0nICsgdW5pcXVlSWQ7XG4gICAgICAgIF90aGlzLm9wdGlvbnNJZCA9ICdyZWFjdC10eXBlYWhlYWQtb3B0aW9ucy0nICsgdW5pcXVlSWQ7XG4gICAgfSxcblxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFkZEV2ZW50ID0gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIsXG4gICAgICAgICAgICBoYW5kbGVXaW5kb3dDbG9zZSA9IHRoaXMuaGFuZGxlV2luZG93Q2xvc2U7XG5cbiAgICAgICAgLy8gVGhlIGBmb2N1c2AgZXZlbnQgZG9lcyBub3QgYnViYmxlLCBzbyB3ZSBtdXN0IGNhcHR1cmUgaXQgaW5zdGVhZC5cbiAgICAgICAgLy8gVGhpcyBjbG9zZXMgVHlwZWFoZWFkJ3MgZHJvcGRvd24gd2hlbmV2ZXIgc29tZXRoaW5nIGVsc2UgZ2FpbnMgZm9jdXMuXG4gICAgICAgIGFkZEV2ZW50KCdmb2N1cycsIGhhbmRsZVdpbmRvd0Nsb3NlLCB0cnVlKTtcblxuICAgICAgICAvLyBJZiB3ZSBjbGljayBhbnl3aGVyZSBvdXRzaWRlIG9mIFR5cGVhaGVhZCwgY2xvc2UgdGhlIGRyb3Bkb3duLlxuICAgICAgICBhZGRFdmVudCgnY2xpY2snLCBoYW5kbGVXaW5kb3dDbG9zZSwgZmFsc2UpO1xuICAgIH0sXG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZW1vdmVFdmVudCA9IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyLFxuICAgICAgICAgICAgaGFuZGxlV2luZG93Q2xvc2UgPSB0aGlzLmhhbmRsZVdpbmRvd0Nsb3NlO1xuXG4gICAgICAgIHJlbW92ZUV2ZW50KCdmb2N1cycsIGhhbmRsZVdpbmRvd0Nsb3NlLCB0cnVlKTtcbiAgICAgICAgcmVtb3ZlRXZlbnQoJ2NsaWNrJywgaGFuZGxlV2luZG93Q2xvc2UsIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzKSB7XG4gICAgICAgIHZhciBuZXh0VmFsdWUgPSBuZXh0UHJvcHMuaW5wdXRWYWx1ZSxcbiAgICAgICAgICAgIG5leHRPcHRpb25zID0gbmV4dFByb3BzLm9wdGlvbnMsXG4gICAgICAgICAgICB2YWx1ZUxlbmd0aCA9IG5leHRWYWx1ZS5sZW5ndGgsXG4gICAgICAgICAgICBpc0hpbnRWaXNpYmxlID0gdmFsdWVMZW5ndGggPiAwICYmXG4gICAgICAgICAgICAgICAgLy8gQSB2aXNpYmxlIHBhcnQgb2YgdGhlIGhpbnQgbXVzdCBiZVxuICAgICAgICAgICAgICAgIC8vIGF2YWlsYWJsZSBmb3IgdXMgdG8gY29tcGxldGUgaXQuXG4gICAgICAgICAgICAgICAgbmV4dFByb3BzLmhhbmRsZUhpbnQobmV4dFZhbHVlLCBuZXh0T3B0aW9ucykuc2xpY2UodmFsdWVMZW5ndGgpLmxlbmd0aCA+IDA7XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpc0hpbnRWaXNpYmxlOiBpc0hpbnRWaXNpYmxlXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17J3JlYWN0LXR5cGVhaGVhZC1jb250YWluZXIgJyArIF90aGlzLnByb3BzLmNsYXNzTmFtZX0+XG4gICAgICAgICAgICAgICAge190aGlzLnJlbmRlcklucHV0KCl9XG4gICAgICAgICAgICAgICAge190aGlzLnJlbmRlckRyb3Bkb3duKCl9XG4gICAgICAgICAgICAgICAge190aGlzLnJlbmRlckFyaWFNZXNzYWdlRm9yT3B0aW9ucygpfVxuICAgICAgICAgICAgICAgIHtfdGhpcy5yZW5kZXJBcmlhTWVzc2FnZUZvckluY29taW5nT3B0aW9ucygpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIHJlbmRlcklucHV0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIHN0YXRlID0gX3RoaXMuc3RhdGUsXG4gICAgICAgICAgICBwcm9wcyA9IF90aGlzLnByb3BzLFxuICAgICAgICAgICAgaW5wdXRWYWx1ZSA9IHByb3BzLmlucHV0VmFsdWUsXG4gICAgICAgICAgICBjbGFzc05hbWUgPSAncmVhY3QtdHlwZWFoZWFkLWlucHV0JyxcbiAgICAgICAgICAgIGlucHV0RGlyZWN0aW9uID0gZ2V0VGV4dERpcmVjdGlvbihpbnB1dFZhbHVlKTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3JlYWN0LXR5cGVhaGVhZC1pbnB1dC1jb250YWluZXInPlxuICAgICAgICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgICAgICAgICByZWY9J2lucHV0J1xuICAgICAgICAgICAgICAgICAgICByb2xlPSdjb21ib2JveCdcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1vd25zPXtfdGhpcy5vcHRpb25zSWR9XG4gICAgICAgICAgICAgICAgICAgIGFyaWEtZXhwYW5kZWQ9e3N0YXRlLmlzRHJvcGRvd25WaXNpYmxlfVxuICAgICAgICAgICAgICAgICAgICBhcmlhLWF1dG9jb21wbGV0ZT0nYm90aCdcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1hY3RpdmVkZXNjZW5kYW50PXtfdGhpcy5hY3RpdmVEZXNjZW5kYW50SWR9XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpbnB1dFZhbHVlfVxuICAgICAgICAgICAgICAgICAgICBzcGVsbENoZWNrPXtmYWxzZX1cbiAgICAgICAgICAgICAgICAgICAgYXV0b0NvbXBsZXRlPXtmYWxzZX1cbiAgICAgICAgICAgICAgICAgICAgYXV0b0NvcnJlY3Q9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICBkaXI9e2lucHV0RGlyZWN0aW9ufVxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtfdGhpcy5oYW5kbGVDbGlja31cbiAgICAgICAgICAgICAgICAgICAgb25Gb2N1cz17X3RoaXMuaGFuZGxlRm9jdXN9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtfdGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICAgICAgICAgIG9uS2V5RG93bj17X3RoaXMuaGFuZGxlS2V5RG93bn1cbiAgICAgICAgICAgICAgICAgICAgaWQ9e3Byb3BzLmlucHV0SWR9XG4gICAgICAgICAgICAgICAgICAgIGF1dG9Gb2N1cz17cHJvcHMuYXV0b0ZvY3VzfVxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17cHJvcHMucGxhY2Vob2xkZXJ9XG4gICAgICAgICAgICAgICAgICAgIG9uU2VsZWN0PXtwcm9wcy5vblNlbGVjdH1cbiAgICAgICAgICAgICAgICAgICAgb25LZXlVcD17cHJvcHMub25LZXlVcH1cbiAgICAgICAgICAgICAgICAgICAgb25LZXlQcmVzcz17cHJvcHMub25LZXlQcmVzc31cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWUgKyAnIHJlYWN0LXR5cGVhaGVhZC11c2VydGV4dCd9XG4gICAgICAgICAgICAgICAgLz5cblxuICAgICAgICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICAgcm9sZT0ncHJlc2VudGF0aW9uJ1xuICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICAgZGlyPXtpbnB1dERpcmVjdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWUgKyAnIHJlYWN0LXR5cGVhaGVhZC1oaW50J31cbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3N0YXRlLmlzSGludFZpc2libGUgPyBwcm9wcy5oYW5kbGVIaW50KGlucHV0VmFsdWUsIHByb3BzLm9wdGlvbnMpIDogbnVsbH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIHJlbmRlckRyb3Bkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIHN0YXRlID0gX3RoaXMuc3RhdGUsXG4gICAgICAgICAgICBwcm9wcyA9IF90aGlzLnByb3BzLFxuICAgICAgICAgICAgT3B0aW9uVGVtcGxhdGUgPSBwcm9wcy5vcHRpb25UZW1wbGF0ZSxcbiAgICAgICAgICAgIHNlbGVjdGVkSW5kZXggPSBzdGF0ZS5zZWxlY3RlZEluZGV4LFxuICAgICAgICAgICAgaXNIaW50VmlzaWJsZSA9IHN0YXRlLmlzSGludFZpc2libGUsXG4gICAgICAgICAgICBpc0Ryb3Bkb3duVmlzaWJsZSA9IHN0YXRlLmlzRHJvcGRvd25WaXNpYmxlLFxuICAgICAgICAgICAgYWN0aXZlRGVzY2VuZGFudElkID0gX3RoaXMuYWN0aXZlRGVzY2VuZGFudElkO1xuXG4gICAgICAgIGlmICh0aGlzLnByb3BzLm9wdGlvbnMubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHVsIGlkPXtfdGhpcy5vcHRpb25zSWR9XG4gICAgICAgICAgICAgICAgcm9sZT0nbGlzdGJveCdcbiAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj17IWlzRHJvcGRvd25WaXNpYmxlfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17XG4gICAgICAgICAgICAgICAgICAgICdyZWFjdC10eXBlYWhlYWQtb3B0aW9ucycgKyAoIWlzRHJvcGRvd25WaXNpYmxlID8gJyByZWFjdC10eXBlYWhlYWQtaGlkZGVuJyA6ICcnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvbk1vdXNlT3V0PXt0aGlzLmhhbmRsZU1vdXNlT3V0fT5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BzLm9wdGlvbnMubWFwKGZ1bmN0aW9uKGRhdGEsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNTZWxlY3RlZCA9IHNlbGVjdGVkSW5kZXggPT09IGluZGV4O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBpZD17aXNTZWxlY3RlZCA/IGFjdGl2ZURlc2NlbmRhbnRJZCA6IG51bGx9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvbGU9J29wdGlvbidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17X3RoaXMuaGFuZGxlT3B0aW9uQ2xpY2suYmluZChfdGhpcywgaW5kZXgpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlT3Zlcj17X3RoaXMuaGFuZGxlT3B0aW9uTW91c2VPdmVyLmJpbmQoX3RoaXMsIGluZGV4KX0+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE9wdGlvblRlbXBsYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhPXtkYXRhfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklucHV0VmFsdWU9e190aGlzLnVzZXJJbnB1dFZhbHVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWx1ZT17cHJvcHMuaW5wdXRWYWx1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ9e2lzU2VsZWN0ZWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyQXJpYU1lc3NhZ2VGb3JPcHRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIHByb3BzID0gX3RoaXMucHJvcHMsXG4gICAgICAgICAgICBvcHRpb24gPSBwcm9wcy5vcHRpb25zW190aGlzLnN0YXRlLnNlbGVjdGVkSW5kZXhdIHx8IHByb3BzLmlucHV0VmFsdWU7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxBcmlhU3RhdHVzXG4gICAgICAgICAgICAgICAgbWVzc2FnZT17cHJvcHMuZ2V0TWVzc2FnZUZvck9wdGlvbihvcHRpb24pfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyQXJpYU1lc3NhZ2VGb3JJbmNvbWluZ09wdGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEFyaWFTdGF0dXNcbiAgICAgICAgICAgICAgICBtZXNzYWdlPXt0aGlzLnByb3BzLmdldE1lc3NhZ2VGb3JJbmNvbWluZ09wdGlvbnMoKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIHNob3dEcm9wZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaXNEcm9wZG93blZpc2libGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGhpZGVEcm9wZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaXNEcm9wZG93blZpc2libGU6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzaG93SGludDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgICBwcm9wcyA9IF90aGlzLnByb3BzLFxuICAgICAgICAgICAgaW5wdXRWYWx1ZSA9IHByb3BzLmlucHV0VmFsdWUsXG4gICAgICAgICAgICBpbnB1dFZhbHVlTGVuZ3RoID0gaW5wdXRWYWx1ZS5sZW5ndGgsXG4gICAgICAgICAgICBpc0hpbnRWaXNpYmxlID0gaW5wdXRWYWx1ZUxlbmd0aCA+IDAgJiZcbiAgICAgICAgICAgICAgICAvLyBBIHZpc2libGUgcGFydCBvZiB0aGUgaGludCBtdXN0IGJlXG4gICAgICAgICAgICAgICAgLy8gYXZhaWxhYmxlIGZvciB1cyB0byBjb21wbGV0ZSBpdC5cbiAgICAgICAgICAgICAgICBwcm9wcy5oYW5kbGVIaW50KGlucHV0VmFsdWUsIHByb3BzLm9wdGlvbnMpLnNsaWNlKGlucHV0VmFsdWVMZW5ndGgpLmxlbmd0aCA+IDA7XG5cbiAgICAgICAgX3RoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaXNIaW50VmlzaWJsZTogaXNIaW50VmlzaWJsZVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgaGlkZUhpbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlzSGludFZpc2libGU6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzZXRTZWxlY3RlZEluZGV4OiBmdW5jdGlvbihpbmRleCwgY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBzZWxlY3RlZEluZGV4OiBpbmRleFxuICAgICAgICB9LCBjYWxsYmFjayk7XG4gICAgfSxcblxuICAgIGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICBfdGhpcy5zaG93SGludCgpO1xuICAgICAgICBfdGhpcy5zaG93RHJvcGRvd24oKTtcbiAgICAgICAgX3RoaXMuc2V0U2VsZWN0ZWRJbmRleCgtMSk7XG4gICAgICAgIF90aGlzLnByb3BzLm9uQ2hhbmdlKGV2ZW50KTtcbiAgICAgICAgX3RoaXMudXNlcklucHV0VmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgfSxcblxuICAgIGhhbmRsZUZvY3VzOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIF90aGlzLnNob3dEcm9wZG93bigpO1xuICAgICAgICBfdGhpcy5wcm9wcy5vbkZvY3VzKGV2ZW50KTtcbiAgICB9LFxuXG4gICAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgX3RoaXMuc2hvd0hpbnQoKTtcbiAgICAgICAgX3RoaXMucHJvcHMub25JbnB1dENsaWNrKGV2ZW50KTtcbiAgICB9LFxuXG4gICAgbmF2aWdhdGU6IGZ1bmN0aW9uKGRpcmVjdGlvbiwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIG1pbkluZGV4ID0gLTEsXG4gICAgICAgICAgICBtYXhJbmRleCA9IF90aGlzLnByb3BzLm9wdGlvbnMubGVuZ3RoIC0gMSxcbiAgICAgICAgICAgIGluZGV4ID0gX3RoaXMuc3RhdGUuc2VsZWN0ZWRJbmRleCArIGRpcmVjdGlvbjtcblxuICAgICAgICBpZiAoaW5kZXggPiBtYXhJbmRleCkge1xuICAgICAgICAgICAgaW5kZXggPSBtaW5JbmRleDtcbiAgICAgICAgfSBlbHNlIGlmIChpbmRleCA8IG1pbkluZGV4KSB7XG4gICAgICAgICAgICBpbmRleCA9IG1heEluZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXMuc2V0U2VsZWN0ZWRJbmRleChpbmRleCwgY2FsbGJhY2spO1xuICAgIH0sXG5cbiAgICBoYW5kbGVLZXlEb3duOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgICAga2V5ID0gZXZlbnQua2V5LFxuICAgICAgICAgICAgcHJvcHMgPSBfdGhpcy5wcm9wcyxcbiAgICAgICAgICAgIGlucHV0ID0gX3RoaXMucmVmcy5pbnB1dCxcbiAgICAgICAgICAgIGlzRHJvcGRvd25WaXNpYmxlID0gX3RoaXMuc3RhdGUuaXNEcm9wZG93blZpc2libGUsXG4gICAgICAgICAgICBpc0hpbnRWaXNpYmxlID0gX3RoaXMuc3RhdGUuaXNIaW50VmlzaWJsZSxcbiAgICAgICAgICAgIGRpcjtcblxuICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICBjYXNlICdFbmQnOlxuICAgICAgICBjYXNlICdUYWInOlxuICAgICAgICAgICAgaWYgKGlzSGludFZpc2libGUgJiYgIWV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBwcm9wcy5vbkNvbXBsZXRlKGV2ZW50LCBwcm9wcy5oYW5kbGVIaW50KHByb3BzLmlucHV0VmFsdWUsIHByb3BzLm9wdGlvbnMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdBcnJvd0xlZnQnOlxuICAgICAgICBjYXNlICdBcnJvd1JpZ2h0JzpcbiAgICAgICAgICAgIGlmIChpc0hpbnRWaXNpYmxlICYmICFldmVudC5zaGlmdEtleSAmJiBpbnB1dC5pc0N1cnNvckF0RW5kKCkpIHtcbiAgICAgICAgICAgICAgICBkaXIgPSBnZXRUZXh0RGlyZWN0aW9uKHByb3BzLmlucHV0VmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKChkaXIgPT09ICdsdHInICYmIGtleSA9PT0gJ0Fycm93UmlnaHQnKSB8fCAoZGlyID09PSAncnRsJyAmJiBrZXkgPT09ICdBcnJvd0xlZnQnKSkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wcy5vbkNvbXBsZXRlKGV2ZW50LCBwcm9wcy5oYW5kbGVIaW50KHByb3BzLmlucHV0VmFsdWUsIHByb3BzLm9wdGlvbnMpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnRW50ZXInOlxuICAgICAgICAgICAgaW5wdXQuYmx1cigpO1xuICAgICAgICAgICAgX3RoaXMuaGlkZUhpbnQoKTtcbiAgICAgICAgICAgIF90aGlzLmhpZGVEcm9wZG93bigpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0VzY2FwZSc6XG4gICAgICAgICAgICBfdGhpcy5oaWRlSGludCgpO1xuICAgICAgICAgICAgX3RoaXMuaGlkZURyb3Bkb3duKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnQXJyb3dVcCc6XG4gICAgICAgIGNhc2UgJ0Fycm93RG93bic6XG4gICAgICAgICAgICBpZiAocHJvcHMub3B0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIF90aGlzLnNob3dIaW50KCk7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2hvd0Ryb3Bkb3duKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaXNEcm9wZG93blZpc2libGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlyID0ga2V5ID09PSAnQXJyb3dVcCcgPyAtMTogMTtcblxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5uYXZpZ2F0ZShkaXIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkSW5kZXggPSBfdGhpcy5zdGF0ZS5zZWxlY3RlZEluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZpb3VzSW5wdXRWYWx1ZSA9IF90aGlzLnByZXZpb3VzSW5wdXRWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25EYXRhID0gcHJldmlvdXNJbnB1dFZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSdyZSBjdXJyZW50bHkgb24gYW4gb3B0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkSW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNhdmUgdGhlIGN1cnJlbnQgYGlucHV0YCB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcyB3ZSBtaWdodCBhcnJvdyBiYWNrIHRvIGl0IGxhdGVyLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c0lucHV0VmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMucHJldmlvdXNJbnB1dFZhbHVlID0gcHJvcHMuaW5wdXRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25EYXRhID0gcHJvcHMub3B0aW9uc1tzZWxlY3RlZEluZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHMub25PcHRpb25DaGFuZ2UoZXZlbnQsIG9wdGlvbkRhdGEsIHNlbGVjdGVkSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvcHMub25LZXlEb3duKGV2ZW50KTtcbiAgICB9LFxuXG4gICAgaGFuZGxlT3B0aW9uQ2xpY2s6IGZ1bmN0aW9uKHNlbGVjdGVkSW5kZXgsIGV2ZW50KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgICBwcm9wcyA9IF90aGlzLnByb3BzO1xuXG4gICAgICAgIF90aGlzLmhpZGVIaW50KCk7XG4gICAgICAgIF90aGlzLmhpZGVEcm9wZG93bigpO1xuICAgICAgICBfdGhpcy5zZXRTZWxlY3RlZEluZGV4KHNlbGVjdGVkSW5kZXgpO1xuICAgICAgICBwcm9wcy5vbk9wdGlvbkNsaWNrKGV2ZW50LCBwcm9wcy5vcHRpb25zW3NlbGVjdGVkSW5kZXhdLCBzZWxlY3RlZEluZGV4KTtcbiAgICB9LFxuXG4gICAgaGFuZGxlT3B0aW9uTW91c2VPdmVyOiBmdW5jdGlvbihzZWxlY3RlZEluZGV4KSB7XG4gICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRJbmRleChzZWxlY3RlZEluZGV4KTtcbiAgICB9LFxuXG4gICAgaGFuZGxlTW91c2VPdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNldFNlbGVjdGVkSW5kZXgoLTEpO1xuICAgIH0sXG5cbiAgICBoYW5kbGVXaW5kb3dDbG9zZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICBpZiAoIVJlYWN0LmZpbmRET01Ob2RlKHRoaXMpLmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHtcbiAgICAgICAgICAgIF90aGlzLmhpZGVIaW50KCk7XG4gICAgICAgICAgICBfdGhpcy5oaWRlRHJvcGRvd24oKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBcIi5yZWFjdC10eXBlYWhlYWQtb2Zmc2NyZWVuLC5yZWFjdC10eXBlYWhlYWQtb3B0aW9ucywucmVhY3QtdHlwZWFoZWFkLXVzZXJ0ZXh0e3Bvc2l0aW9uOmFic29sdXRlfS5yZWFjdC10eXBlYWhlYWQtdXNlcnRleHR7YmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudH0ucmVhY3QtdHlwZWFoZWFkLW9mZnNjcmVlbntsZWZ0Oi05OTk5cHh9LnJlYWN0LXR5cGVhaGVhZC1oaW50e2NvbG9yOnNpbHZlcjstd2Via2l0LXRleHQtZmlsbC1jb2xvcjpzaWx2ZXJ9LnJlYWN0LXR5cGVhaGVhZC1pbnB1dHtwYWRkaW5nOjJweDtib3JkZXI6MXB4IHNvbGlkIHNpbHZlcn0ucmVhY3QtdHlwZWFoZWFkLWNvbnRhaW5lciwucmVhY3QtdHlwZWFoZWFkLWlucHV0LWNvbnRhaW5lcntwb3NpdGlvbjpyZWxhdGl2ZX0ucmVhY3QtdHlwZWFoZWFkLWhpZGRlbntkaXNwbGF5Om5vbmV9LnJlYWN0LXR5cGVhaGVhZC1vcHRpb25ze3dpZHRoOjEwMCU7YmFja2dyb3VuZDojZmZmO2JveC1zaXppbmc6Ym9yZGVyLWJveH1cIjtcbiIsInZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQsXG4gICAgY3NzID0gcmVxdWlyZSgnLi9jc3MvcmVhY3QtdHlwZWFoZWFkLWNvbXBvbmVudC5jc3MuanMnKSxcbiAgICBzdHlsZUVsZW1lbnQsXG4gICAgaGVhZDtcblxuLy8gSWYgdGhlIGBkb2N1bWVudGAgb2JqZWN0IGV4aXN0cywgYXNzdW1lIHRoaXMgaXMgYSBicm93c2VyLlxuaWYgKGRvYykge1xuICAgIHN0eWxlRWxlbWVudCA9IGRvYy5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuXG4gICAgaWYgKCd0ZXh0Q29udGVudCcgaW4gc3R5bGVFbGVtZW50KSB7XG4gICAgICAgIHN0eWxlRWxlbWVudC50ZXh0Q29udGVudCA9IGNzcztcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBJRSA4XG4gICAgICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gICAgfVxuXG4gICAgaGVhZCA9IGRvYy5oZWFkO1xuICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgaGVhZC5maXJzdENoaWxkKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvdHlwZWFoZWFkLmpzeCcpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUlRMQ2hhcmFjdGVyc1JlZ0V4cCA9IHJlcXVpcmUoJy4vcnRsX2NoYXJzX3JlZ2V4cCcpLFxuICAgIE5ldXRyYWxDaGFyYWN0ZXJzUmVnRXhwID0gcmVxdWlyZSgnLi9uZXV0cmFsX2NoYXJzX3JlZ2V4cCcpLFxuICAgIHN0YXJ0c1dpdGhSVEwgPSBuZXcgUmVnRXhwKCdeKD86JyArIE5ldXRyYWxDaGFyYWN0ZXJzUmVnRXhwICsgJykqKD86JyArIFJUTENoYXJhY3RlcnNSZWdFeHAgKyAnKScpLFxuICAgIG5ldXRyYWxUZXh0ID0gbmV3IFJlZ0V4cCgnXig/OicgKyBOZXV0cmFsQ2hhcmFjdGVyc1JlZ0V4cCArICcpKiQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgdmFyIGRpciA9ICdsdHInO1xuXG4gICAgaWYgKHN0YXJ0c1dpdGhSVEwudGVzdCh0ZXh0KSkge1xuICAgICAgICBkaXIgPSAncnRsJztcbiAgICB9IGVsc2UgaWYgKG5ldXRyYWxUZXh0LnRlc3QodGV4dCkpIHtcbiAgICAgICAgZGlyID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gZGlyO1xufTtcbiIsIi8vIERPIE5PVCBFRElUIVxuLy8gVEhJUyBGSUxFIElTIEdFTkVSQVRFRCFcblxuLy8gQWxsIGJpZGkgY2hhcmFjdGVycyBleGNlcHQgdGhvc2UgZm91bmQgaW4gY2xhc3NlcyAnTCcgKExUUiksICdSJyAoUlRMKSwgYW5kICdBTCcgKFJUTCBBcmFiaWMpIGFzIHBlciBVbmljb2RlIDcuMC4wLlxuXG4vLyBqc2hpbnQgaWdub3JlOnN0YXJ0XG4vLyBqc2NzOmRpc2FibGUgbWF4aW11bUxpbmVMZW5ndGhcbm1vZHVsZS5leHBvcnRzID0gJ1tcXDAtQFxcWy1gXFx7LVxceEE5XFx4QUItXFx4QjRcXHhCNi1cXHhCOVxceEJCLVxceEJGXFx4RDdcXHhGN1xcdTAyQjlcXHUwMkJBXFx1MDJDMi1cXHUwMkNGXFx1MDJEMi1cXHUwMkRGXFx1MDJFNS1cXHUwMkVEXFx1MDJFRi1cXHUwMzZGXFx1MDM3NFxcdTAzNzVcXHUwMzdFXFx1MDM4NFxcdTAzODVcXHUwMzg3XFx1MDNGNlxcdTA0ODMtXFx1MDQ4OVxcdTA1OEFcXHUwNThELVxcdTA1OEZcXHUwNTkxLVxcdTA1QkRcXHUwNUJGXFx1MDVDMVxcdTA1QzJcXHUwNUM0XFx1MDVDNVxcdTA1QzdcXHUwNjAwLVxcdTA2MDdcXHUwNjA5XFx1MDYwQVxcdTA2MENcXHUwNjBFLVxcdTA2MUFcXHUwNjRCLVxcdTA2NkNcXHUwNjcwXFx1MDZENi1cXHUwNkU0XFx1MDZFNy1cXHUwNkVEXFx1MDZGMC1cXHUwNkY5XFx1MDcxMVxcdTA3MzAtXFx1MDc0QVxcdTA3QTYtXFx1MDdCMFxcdTA3RUItXFx1MDdGM1xcdTA3RjYtXFx1MDdGOVxcdTA4MTYtXFx1MDgxOVxcdTA4MUItXFx1MDgyM1xcdTA4MjUtXFx1MDgyN1xcdTA4MjktXFx1MDgyRFxcdTA4NTktXFx1MDg1QlxcdTA4RTQtXFx1MDkwMlxcdTA5M0FcXHUwOTNDXFx1MDk0MS1cXHUwOTQ4XFx1MDk0RFxcdTA5NTEtXFx1MDk1N1xcdTA5NjJcXHUwOTYzXFx1MDk4MVxcdTA5QkNcXHUwOUMxLVxcdTA5QzRcXHUwOUNEXFx1MDlFMlxcdTA5RTNcXHUwOUYyXFx1MDlGM1xcdTA5RkJcXHUwQTAxXFx1MEEwMlxcdTBBM0NcXHUwQTQxXFx1MEE0MlxcdTBBNDdcXHUwQTQ4XFx1MEE0Qi1cXHUwQTREXFx1MEE1MVxcdTBBNzBcXHUwQTcxXFx1MEE3NVxcdTBBODFcXHUwQTgyXFx1MEFCQ1xcdTBBQzEtXFx1MEFDNVxcdTBBQzdcXHUwQUM4XFx1MEFDRFxcdTBBRTJcXHUwQUUzXFx1MEFGMVxcdTBCMDFcXHUwQjNDXFx1MEIzRlxcdTBCNDEtXFx1MEI0NFxcdTBCNERcXHUwQjU2XFx1MEI2MlxcdTBCNjNcXHUwQjgyXFx1MEJDMFxcdTBCQ0RcXHUwQkYzLVxcdTBCRkFcXHUwQzAwXFx1MEMzRS1cXHUwQzQwXFx1MEM0Ni1cXHUwQzQ4XFx1MEM0QS1cXHUwQzREXFx1MEM1NVxcdTBDNTZcXHUwQzYyXFx1MEM2M1xcdTBDNzgtXFx1MEM3RVxcdTBDODFcXHUwQ0JDXFx1MENDQ1xcdTBDQ0RcXHUwQ0UyXFx1MENFM1xcdTBEMDFcXHUwRDQxLVxcdTBENDRcXHUwRDREXFx1MEQ2MlxcdTBENjNcXHUwRENBXFx1MEREMi1cXHUwREQ0XFx1MERENlxcdTBFMzFcXHUwRTM0LVxcdTBFM0FcXHUwRTNGXFx1MEU0Ny1cXHUwRTRFXFx1MEVCMVxcdTBFQjQtXFx1MEVCOVxcdTBFQkJcXHUwRUJDXFx1MEVDOC1cXHUwRUNEXFx1MEYxOFxcdTBGMTlcXHUwRjM1XFx1MEYzN1xcdTBGMzktXFx1MEYzRFxcdTBGNzEtXFx1MEY3RVxcdTBGODAtXFx1MEY4NFxcdTBGODZcXHUwRjg3XFx1MEY4RC1cXHUwRjk3XFx1MEY5OS1cXHUwRkJDXFx1MEZDNlxcdTEwMkQtXFx1MTAzMFxcdTEwMzItXFx1MTAzN1xcdTEwMzlcXHUxMDNBXFx1MTAzRFxcdTEwM0VcXHUxMDU4XFx1MTA1OVxcdTEwNUUtXFx1MTA2MFxcdTEwNzEtXFx1MTA3NFxcdTEwODJcXHUxMDg1XFx1MTA4NlxcdTEwOERcXHUxMDlEXFx1MTM1RC1cXHUxMzVGXFx1MTM5MC1cXHUxMzk5XFx1MTQwMFxcdTE2ODBcXHUxNjlCXFx1MTY5Q1xcdTE3MTItXFx1MTcxNFxcdTE3MzItXFx1MTczNFxcdTE3NTJcXHUxNzUzXFx1MTc3MlxcdTE3NzNcXHUxN0I0XFx1MTdCNVxcdTE3QjctXFx1MTdCRFxcdTE3QzZcXHUxN0M5LVxcdTE3RDNcXHUxN0RCXFx1MTdERFxcdTE3RjAtXFx1MTdGOVxcdTE4MDAtXFx1MTgwRVxcdTE4QTlcXHUxOTIwLVxcdTE5MjJcXHUxOTI3XFx1MTkyOFxcdTE5MzJcXHUxOTM5LVxcdTE5M0JcXHUxOTQwXFx1MTk0NFxcdTE5NDVcXHUxOURFLVxcdTE5RkZcXHUxQTE3XFx1MUExOFxcdTFBMUJcXHUxQTU2XFx1MUE1OC1cXHUxQTVFXFx1MUE2MFxcdTFBNjJcXHUxQTY1LVxcdTFBNkNcXHUxQTczLVxcdTFBN0NcXHUxQTdGXFx1MUFCMC1cXHUxQUJFXFx1MUIwMC1cXHUxQjAzXFx1MUIzNFxcdTFCMzYtXFx1MUIzQVxcdTFCM0NcXHUxQjQyXFx1MUI2Qi1cXHUxQjczXFx1MUI4MFxcdTFCODFcXHUxQkEyLVxcdTFCQTVcXHUxQkE4XFx1MUJBOVxcdTFCQUItXFx1MUJBRFxcdTFCRTZcXHUxQkU4XFx1MUJFOVxcdTFCRURcXHUxQkVGLVxcdTFCRjFcXHUxQzJDLVxcdTFDMzNcXHUxQzM2XFx1MUMzN1xcdTFDRDAtXFx1MUNEMlxcdTFDRDQtXFx1MUNFMFxcdTFDRTItXFx1MUNFOFxcdTFDRURcXHUxQ0Y0XFx1MUNGOFxcdTFDRjlcXHUxREMwLVxcdTFERjVcXHUxREZDLVxcdTFERkZcXHUxRkJEXFx1MUZCRi1cXHUxRkMxXFx1MUZDRC1cXHUxRkNGXFx1MUZERC1cXHUxRkRGXFx1MUZFRC1cXHUxRkVGXFx1MUZGRFxcdTFGRkVcXHUyMDAwLVxcdTIwMERcXHUyMDEwLVxcdTIwMjlcXHUyMDJGLVxcdTIwNjRcXHUyMDY4XFx1MjA2QS1cXHUyMDcwXFx1MjA3NC1cXHUyMDdFXFx1MjA4MC1cXHUyMDhFXFx1MjBBMC1cXHUyMEJEXFx1MjBEMC1cXHUyMEYwXFx1MjEwMFxcdTIxMDFcXHUyMTAzLVxcdTIxMDZcXHUyMTA4XFx1MjEwOVxcdTIxMTRcXHUyMTE2LVxcdTIxMThcXHUyMTFFLVxcdTIxMjNcXHUyMTI1XFx1MjEyN1xcdTIxMjlcXHUyMTJFXFx1MjEzQVxcdTIxM0JcXHUyMTQwLVxcdTIxNDRcXHUyMTRBLVxcdTIxNERcXHUyMTUwLVxcdTIxNUZcXHUyMTg5XFx1MjE5MC1cXHUyMzM1XFx1MjM3Qi1cXHUyMzk0XFx1MjM5Ni1cXHUyM0ZBXFx1MjQwMC1cXHUyNDI2XFx1MjQ0MC1cXHUyNDRBXFx1MjQ2MC1cXHUyNDlCXFx1MjRFQS1cXHUyNkFCXFx1MjZBRC1cXHUyN0ZGXFx1MjkwMC1cXHUyQjczXFx1MkI3Ni1cXHUyQjk1XFx1MkI5OC1cXHUyQkI5XFx1MkJCRC1cXHUyQkM4XFx1MkJDQS1cXHUyQkQxXFx1MkNFNS1cXHUyQ0VBXFx1MkNFRi1cXHUyQ0YxXFx1MkNGOS1cXHUyQ0ZGXFx1MkQ3RlxcdTJERTAtXFx1MkU0MlxcdTJFODAtXFx1MkU5OVxcdTJFOUItXFx1MkVGM1xcdTJGMDAtXFx1MkZENVxcdTJGRjAtXFx1MkZGQlxcdTMwMDAtXFx1MzAwNFxcdTMwMDgtXFx1MzAyMFxcdTMwMkEtXFx1MzAyRFxcdTMwMzBcXHUzMDM2XFx1MzAzN1xcdTMwM0QtXFx1MzAzRlxcdTMwOTktXFx1MzA5Q1xcdTMwQTBcXHUzMEZCXFx1MzFDMC1cXHUzMUUzXFx1MzIxRFxcdTMyMUVcXHUzMjUwLVxcdTMyNUZcXHUzMjdDLVxcdTMyN0VcXHUzMkIxLVxcdTMyQkZcXHUzMkNDLVxcdTMyQ0ZcXHUzMzc3LVxcdTMzN0FcXHUzM0RFXFx1MzNERlxcdTMzRkZcXHU0REMwLVxcdTRERkZcXHVBNDkwLVxcdUE0QzZcXHVBNjBELVxcdUE2MEZcXHVBNjZGLVxcdUE2N0ZcXHVBNjlGXFx1QTZGMFxcdUE2RjFcXHVBNzAwLVxcdUE3MjFcXHVBNzg4XFx1QTgwMlxcdUE4MDZcXHVBODBCXFx1QTgyNVxcdUE4MjZcXHVBODI4LVxcdUE4MkJcXHVBODM4XFx1QTgzOVxcdUE4NzQtXFx1QTg3N1xcdUE4QzRcXHVBOEUwLVxcdUE4RjFcXHVBOTI2LVxcdUE5MkRcXHVBOTQ3LVxcdUE5NTFcXHVBOTgwLVxcdUE5ODJcXHVBOUIzXFx1QTlCNi1cXHVBOUI5XFx1QTlCQ1xcdUE5RTVcXHVBQTI5LVxcdUFBMkVcXHVBQTMxXFx1QUEzMlxcdUFBMzVcXHVBQTM2XFx1QUE0M1xcdUFBNENcXHVBQTdDXFx1QUFCMFxcdUFBQjItXFx1QUFCNFxcdUFBQjdcXHVBQUI4XFx1QUFCRVxcdUFBQkZcXHVBQUMxXFx1QUFFQ1xcdUFBRURcXHVBQUY2XFx1QUJFNVxcdUFCRThcXHVBQkVEXFx1RkIxRVxcdUZCMjlcXHVGRDNFXFx1RkQzRlxcdUZERkRcXHVGRTAwLVxcdUZFMTlcXHVGRTIwLVxcdUZFMkRcXHVGRTMwLVxcdUZFNTJcXHVGRTU0LVxcdUZFNjZcXHVGRTY4LVxcdUZFNkJcXHVGRUZGXFx1RkYwMS1cXHVGRjIwXFx1RkYzQi1cXHVGRjQwXFx1RkY1Qi1cXHVGRjY1XFx1RkZFMC1cXHVGRkU2XFx1RkZFOC1cXHVGRkVFXFx1RkZGOS1cXHVGRkZEXXxcXHVEODAwW1xcdUREMDFcXHVERDQwLVxcdUREOENcXHVERDkwLVxcdUREOUJcXHVEREEwXFx1RERGRFxcdURFRTAtXFx1REVGQlxcdURGNzYtXFx1REY3QV18XFx1RDgwMltcXHVERDFGXFx1REUwMS1cXHVERTAzXFx1REUwNVxcdURFMDZcXHVERTBDLVxcdURFMEZcXHVERTM4LVxcdURFM0FcXHVERTNGXFx1REVFNVxcdURFRTZcXHVERjM5LVxcdURGM0ZdfFxcdUQ4MDNbXFx1REU2MC1cXHVERTdFXXxbXFx1RDgwNFxcdURCNDBdW1xcdURDMDFcXHVEQzM4LVxcdURDNDZcXHVEQzUyLVxcdURDNjVcXHVEQzdGLVxcdURDODFcXHVEQ0IzLVxcdURDQjZcXHVEQ0I5XFx1RENCQVxcdUREMDAtXFx1REQwMlxcdUREMjctXFx1REQyQlxcdUREMkQtXFx1REQzNFxcdURENzNcXHVERDgwXFx1REQ4MVxcdUREQjYtXFx1RERCRVxcdURFMkYtXFx1REUzMVxcdURFMzRcXHVERTM2XFx1REUzN1xcdURFREZcXHVERUUzLVxcdURFRUFcXHVERjAxXFx1REYzQ1xcdURGNDBcXHVERjY2LVxcdURGNkNcXHVERjcwLVxcdURGNzRdfFxcdUQ4MDVbXFx1RENCMy1cXHVEQ0I4XFx1RENCQVxcdURDQkZcXHVEQ0MwXFx1RENDMlxcdURDQzNcXHVEREIyLVxcdUREQjVcXHVEREJDXFx1RERCRFxcdUREQkZcXHVEREMwXFx1REUzMy1cXHVERTNBXFx1REUzRFxcdURFM0ZcXHVERTQwXFx1REVBQlxcdURFQURcXHVERUIwLVxcdURFQjVcXHVERUI3XXxcXHVEODFBW1xcdURFRjAtXFx1REVGNFxcdURGMzAtXFx1REYzNl18XFx1RDgxQltcXHVERjhGLVxcdURGOTJdfFxcdUQ4MkZbXFx1REM5RFxcdURDOUVcXHVEQ0EwLVxcdURDQTNdfFxcdUQ4MzRbXFx1REQ2Ny1cXHVERDY5XFx1REQ3My1cXHVERDgyXFx1REQ4NS1cXHVERDhCXFx1RERBQS1cXHVEREFEXFx1REUwMC1cXHVERTQ1XFx1REYwMC1cXHVERjU2XXxcXHVEODM1W1xcdURFREJcXHVERjE1XFx1REY0RlxcdURGODlcXHVERkMzXFx1REZDRS1cXHVERkZGXXxcXHVEODNBW1xcdURDRDAtXFx1RENENl18XFx1RDgzQltcXHVERUYwXFx1REVGMV18XFx1RDgzQ1tcXHVEQzAwLVxcdURDMkJcXHVEQzMwLVxcdURDOTNcXHVEQ0EwLVxcdURDQUVcXHVEQ0IxLVxcdURDQkZcXHVEQ0MxLVxcdURDQ0ZcXHVEQ0QxLVxcdURDRjVcXHVERDAwLVxcdUREMENcXHVERDZBXFx1REQ2QlxcdURGMDAtXFx1REYyQ1xcdURGMzAtXFx1REY3RFxcdURGODAtXFx1REZDRVxcdURGRDQtXFx1REZGN118XFx1RDgzRFtcXHVEQzAwLVxcdURDRkVcXHVERDAwLVxcdURENEFcXHVERDUwLVxcdURENzlcXHVERDdCLVxcdUREQTNcXHVEREE1LVxcdURFNDJcXHVERTQ1LVxcdURFQ0ZcXHVERUUwLVxcdURFRUNcXHVERUYwLVxcdURFRjNcXHVERjAwLVxcdURGNzNcXHVERjgwLVxcdURGRDRdfFxcdUQ4M0VbXFx1REMwMC1cXHVEQzBCXFx1REMxMC1cXHVEQzQ3XFx1REM1MC1cXHVEQzU5XFx1REM2MC1cXHVEQzg3XFx1REM5MC1cXHVEQ0FEXSc7XG4vLyBqc2NzOmVuYWJsZSBtYXhpbXVtTGluZUxlbmd0aFxuLy8ganNoaW50IGlnbm9yZTplbmRcbiIsIi8vIERPIE5PVCBFRElUIVxuLy8gVEhJUyBGSUxFIElTIEdFTkVSQVRFRCFcblxuLy8gQWxsIGJpZGkgY2hhcmFjdGVycyBmb3VuZCBpbiBjbGFzc2VzICdSJywgJ0FMJywgJ1JMRScsICdSTE8nLCBhbmQgJ1JMSScgYXMgcGVyIFVuaWNvZGUgNy4wLjAuXG5cbi8vIGpzaGludCBpZ25vcmU6c3RhcnRcbi8vIGpzY3M6ZGlzYWJsZSBtYXhpbXVtTGluZUxlbmd0aFxubW9kdWxlLmV4cG9ydHMgPSAnW1xcdTA1QkVcXHUwNUMwXFx1MDVDM1xcdTA1QzZcXHUwNUQwLVxcdTA1RUFcXHUwNUYwLVxcdTA1RjRcXHUwNjA4XFx1MDYwQlxcdTA2MERcXHUwNjFCXFx1MDYxQ1xcdTA2MUUtXFx1MDY0QVxcdTA2NkQtXFx1MDY2RlxcdTA2NzEtXFx1MDZENVxcdTA2RTVcXHUwNkU2XFx1MDZFRVxcdTA2RUZcXHUwNkZBLVxcdTA3MERcXHUwNzBGXFx1MDcxMFxcdTA3MTItXFx1MDcyRlxcdTA3NEQtXFx1MDdBNVxcdTA3QjFcXHUwN0MwLVxcdTA3RUFcXHUwN0Y0XFx1MDdGNVxcdTA3RkFcXHUwODAwLVxcdTA4MTVcXHUwODFBXFx1MDgyNFxcdTA4MjhcXHUwODMwLVxcdTA4M0VcXHUwODQwLVxcdTA4NThcXHUwODVFXFx1MDhBMC1cXHUwOEIyXFx1MjAwRlxcdTIwMkJcXHUyMDJFXFx1MjA2N1xcdUZCMURcXHVGQjFGLVxcdUZCMjhcXHVGQjJBLVxcdUZCMzZcXHVGQjM4LVxcdUZCM0NcXHVGQjNFXFx1RkI0MFxcdUZCNDFcXHVGQjQzXFx1RkI0NFxcdUZCNDYtXFx1RkJDMVxcdUZCRDMtXFx1RkQzRFxcdUZENTAtXFx1RkQ4RlxcdUZEOTItXFx1RkRDN1xcdUZERjAtXFx1RkRGQ1xcdUZFNzAtXFx1RkU3NFxcdUZFNzYtXFx1RkVGQ118XFx1RDgwMltcXHVEQzAwLVxcdURDMDVcXHVEQzA4XFx1REMwQS1cXHVEQzM1XFx1REMzN1xcdURDMzhcXHVEQzNDXFx1REMzRi1cXHVEQzU1XFx1REM1Ny1cXHVEQzlFXFx1RENBNy1cXHVEQ0FGXFx1REQwMC1cXHVERDFCXFx1REQyMC1cXHVERDM5XFx1REQzRlxcdUREODAtXFx1RERCN1xcdUREQkVcXHVEREJGXFx1REUwMFxcdURFMTAtXFx1REUxM1xcdURFMTUtXFx1REUxN1xcdURFMTktXFx1REUzM1xcdURFNDAtXFx1REU0N1xcdURFNTAtXFx1REU1OFxcdURFNjAtXFx1REU5RlxcdURFQzAtXFx1REVFNFxcdURFRUItXFx1REVGNlxcdURGMDAtXFx1REYzNVxcdURGNDAtXFx1REY1NVxcdURGNTgtXFx1REY3MlxcdURGNzgtXFx1REY5MVxcdURGOTktXFx1REY5Q1xcdURGQTktXFx1REZBRl18XFx1RDgwM1tcXHVEQzAwLVxcdURDNDhdfFxcdUQ4M0FbXFx1REMwMC1cXHVEQ0M0XFx1RENDNy1cXHVEQ0NGXXxcXHVEODNCW1xcdURFMDAtXFx1REUwM1xcdURFMDUtXFx1REUxRlxcdURFMjFcXHVERTIyXFx1REUyNFxcdURFMjdcXHVERTI5LVxcdURFMzJcXHVERTM0LVxcdURFMzdcXHVERTM5XFx1REUzQlxcdURFNDJcXHVERTQ3XFx1REU0OVxcdURFNEJcXHVERTRELVxcdURFNEZcXHVERTUxXFx1REU1MlxcdURFNTRcXHVERTU3XFx1REU1OVxcdURFNUJcXHVERTVEXFx1REU1RlxcdURFNjFcXHVERTYyXFx1REU2NFxcdURFNjctXFx1REU2QVxcdURFNkMtXFx1REU3MlxcdURFNzQtXFx1REU3N1xcdURFNzktXFx1REU3Q1xcdURFN0VcXHVERTgwLVxcdURFODlcXHVERThCLVxcdURFOUJcXHVERUExLVxcdURFQTNcXHVERUE1LVxcdURFQTlcXHVERUFCLVxcdURFQkJdJztcbi8vIGpzY3M6ZW5hYmxlIG1heGltdW1MaW5lTGVuZ3RoXG4vLyBqc2hpbnQgaWdub3JlOmVuZFxuIl19
