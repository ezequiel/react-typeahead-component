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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL1VzZXJzL2V6ZXF1aWVsL0Rlc2t0b3AvcmVhY3QtdHlwZWFoZWFkLWNvbXBvbmVudC9zcmMvY29tcG9uZW50cy9hcmlhX3N0YXR1cy5qc3giLCIvVXNlcnMvZXplcXVpZWwvRGVza3RvcC9yZWFjdC10eXBlYWhlYWQtY29tcG9uZW50L3NyYy9jb21wb25lbnRzL2lucHV0LmpzeCIsIi9Vc2Vycy9lemVxdWllbC9EZXNrdG9wL3JlYWN0LXR5cGVhaGVhZC1jb21wb25lbnQvc3JjL2NvbXBvbmVudHMvdHlwZWFoZWFkLmpzeCIsIi9Vc2Vycy9lemVxdWllbC9EZXNrdG9wL3JlYWN0LXR5cGVhaGVhZC1jb21wb25lbnQvc3JjL2luZGV4LmpzIiwiL1VzZXJzL2V6ZXF1aWVsL0Rlc2t0b3AvcmVhY3QtdHlwZWFoZWFkLWNvbXBvbmVudC9zcmMvdXRpbHMvZ2V0X3RleHRfZGlyZWN0aW9uLmpzIiwiL1VzZXJzL2V6ZXF1aWVsL0Rlc2t0b3AvcmVhY3QtdHlwZWFoZWFkLWNvbXBvbmVudC9zcmMvdXRpbHMvbmV1dHJhbF9jaGFyc19yZWdleHAuanMiLCIvVXNlcnMvZXplcXVpZWwvRGVza3RvcC9yZWFjdC10eXBlYWhlYWQtY29tcG9uZW50L3NyYy91dGlscy9ydGxfY2hhcnNfcmVnZXhwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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RSxNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsSUFBSSxFQUFFO0FBQ2hDLElBQUksSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDOztJQUVoQixJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDMUIsR0FBRyxHQUFHLEtBQUssQ0FBQztLQUNmLE1BQU0sSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQy9CLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDbkIsS0FBSzs7SUFFRCxPQUFPLEdBQUcsQ0FBQztDQUNkLENBQUM7Ozs7QUNqQkYsZUFBZTtBQUNmLDBCQUEwQjs7QUFFMUIsc0hBQXNIOztBQUV0SCxzQkFBc0I7QUFDdEIsaUNBQWlDO0FBQ2pDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsNjhJQUE2OEksQ0FBQztBQUMvOUksZ0NBQWdDO0FBQ2hDLG9CQUFvQjs7OztBQ1RwQixlQUFlO0FBQ2YsMEJBQTBCOztBQUUxQixnR0FBZ0c7O0FBRWhHLHNCQUFzQjtBQUN0QixpQ0FBaUM7QUFDakMsTUFBTSxDQUFDLE9BQU8sR0FBRyx3c0NBQXdzQyxDQUFDO0FBQzF0QyxnQ0FBZ0M7QUFDaEMsb0JBQW9CIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gdHJ1ZTtcbiAgICB2YXIgY3VycmVudFF1ZXVlO1xuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgICAgICAgICBjdXJyZW50UXVldWVbaV0oKTtcbiAgICAgICAgfVxuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG59XG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHF1ZXVlLnB1c2goZnVuKTtcbiAgICBpZiAoIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnQXJpYSBTdGF0dXMnLFxuXG4gICAgcHJvcFR5cGVzOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nID8ge30gOiB7XG4gICAgICAgIG1lc3NhZ2U6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbiAgICB9LFxuXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIC8vIFRoaXMgaXMgbmVlZGVkIGFzIGBjb21wb25lbnREaWRVcGRhdGVgXG4gICAgICAgIC8vIGRvZXMgbm90IGZpcmUgb24gdGhlIGluaXRpYWwgcmVuZGVyLlxuICAgICAgICBfdGhpcy5zZXRUZXh0Q29udGVudChfdGhpcy5wcm9wcy5tZXNzYWdlKTtcbiAgICB9LFxuXG4gICAgY29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICBfdGhpcy5zZXRUZXh0Q29udGVudChfdGhpcy5wcm9wcy5tZXNzYWdlKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgcm9sZT0nc3RhdHVzJ1xuICAgICAgICAgICAgICAgIGFyaWEtbGl2ZT0ncG9saXRlJ1xuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6ICctOTk5OXB4JyxcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgLy8gV2UgY2Fubm90IHNldCBgdGV4dENvbnRlbnRgIGRpcmVjdGx5IGluIGByZW5kZXJgLFxuICAgIC8vIGJlY2F1c2UgUmVhY3QgYWRkcy9kZWxldGVzIHRleHQgbm9kZXMgd2hlbiByZW5kZXJpbmcsXG4gICAgLy8gd2hpY2ggY29uZnVzZXMgc2NyZWVuIHJlYWRlcnMgYW5kIGRvZXNuJ3QgY2F1c2UgdGhlbSB0byByZWFkIGNoYW5nZXMuXG4gICAgc2V0VGV4dENvbnRlbnQ6IGZ1bmN0aW9uKHRleHRDb250ZW50KSB7XG4gICAgICAgIC8vIFdlIGNvdWxkIHNldCBgaW5uZXJIVE1MYCwgYnV0IGl0J3MgYmV0dGVyIHRvIGF2b2lkIGl0LlxuICAgICAgICB0aGlzLmdldERPTU5vZGUoKS50ZXh0Q29udGVudCA9IHRleHRDb250ZW50IHx8ICcnO1xuICAgIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ0lucHV0JyxcblxuICAgIHByb3BUeXBlczogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyA/IHt9IDoge1xuICAgICAgICB2YWx1ZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgb25DaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jXG4gICAgfSxcblxuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogJycsXG4gICAgICAgICAgICBvbkNoYW5nZTogZnVuY3Rpb24oKSB7fVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgICAgZGlyID0gX3RoaXMucHJvcHMuZGlyO1xuXG4gICAgICAgIGlmIChkaXIgPT09IG51bGwgfHwgZGlyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIFdoZW4gc2V0dGluZyBhbiBhdHRyaWJ1dGUgdG8gbnVsbC91bmRlZmluZWQsXG4gICAgICAgICAgICAvLyBSZWFjdCBpbnN0ZWFkIHNldHMgdGhlIGF0dHJpYnV0ZSB0byBhbiBlbXB0eSBzdHJpbmcuXG5cbiAgICAgICAgICAgIC8vIFRoaXMgaXMgbm90IGRlc2lyZWQgYmVjYXVzZSBvZiBhIHBvc3NpYmxlIGJ1ZyBpbiBDaHJvbWUuXG4gICAgICAgICAgICAvLyBJZiB0aGUgcGFnZSBpcyBSVEwsIGFuZCB0aGUgaW5wdXQncyBgZGlyYCBhdHRyaWJ1dGUgaXMgc2V0XG4gICAgICAgICAgICAvLyB0byBhbiBlbXB0eSBzdHJpbmcsIENocm9tZSBhc3N1bWVzIExUUiwgd2hpY2ggaXNuJ3Qgd2hhdCB3ZSB3YW50LlxuICAgICAgICAgICAgUmVhY3QuZmluZERPTU5vZGUoX3RoaXMpLnJlbW92ZUF0dHJpYnV0ZSgnZGlyJyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgey4uLl90aGlzLnByb3BzfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtfdGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICBoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciBwcm9wcyA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgLy8gVGhlcmUgYXJlIHNldmVyYWwgUmVhY3QgYnVncyBpbiBJRSxcbiAgICAgICAgLy8gd2hlcmUgdGhlIGBpbnB1dGAncyBgb25DaGFuZ2VgIGV2ZW50IGlzXG4gICAgICAgIC8vIGZpcmVkIGV2ZW4gd2hlbiB0aGUgdmFsdWUgZGlkbid0IGNoYW5nZS5cbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy8yMTg1XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9pc3N1ZXMvMzM3N1xuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LnZhbHVlICE9PSBwcm9wcy52YWx1ZSkge1xuICAgICAgICAgICAgcHJvcHMub25DaGFuZ2UoZXZlbnQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGJsdXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICBSZWFjdC5maW5kRE9NTm9kZSh0aGlzKS5ibHVyKCk7XG4gICAgfSxcblxuICAgIGlzQ3Vyc29yQXRFbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgICAgaW5wdXRET01Ob2RlID0gUmVhY3QuZmluZERPTU5vZGUoX3RoaXMpLFxuICAgICAgICAgICAgdmFsdWVMZW5ndGggPSBfdGhpcy5wcm9wcy52YWx1ZS5sZW5ndGg7XG5cbiAgICAgICAgcmV0dXJuIGlucHV0RE9NTm9kZS5zZWxlY3Rpb25TdGFydCA9PT0gdmFsdWVMZW5ndGggJiZcbiAgICAgICAgICAgICAgIGlucHV0RE9NTm9kZS5zZWxlY3Rpb25FbmQgPT09IHZhbHVlTGVuZ3RoO1xuICAgIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpLFxuICAgIElucHV0ID0gcmVxdWlyZSgnLi9pbnB1dC5qc3gnKSxcbiAgICBBcmlhU3RhdHVzID0gcmVxdWlyZSgnLi9hcmlhX3N0YXR1cy5qc3gnKSxcbiAgICBnZXRUZXh0RGlyZWN0aW9uID0gcmVxdWlyZSgnLi4vdXRpbHMvZ2V0X3RleHRfZGlyZWN0aW9uJyksXG4gICAgbm9vcCA9IGZ1bmN0aW9uKCkge307XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnVHlwZWFoZWFkJyxcblxuICAgIHByb3BUeXBlczogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyA/IHt9IDoge1xuICAgICAgICBpbnB1dElkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGF1dG9Gb2N1czogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgIGlucHV0VmFsdWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIG9wdGlvbnM6IFJlYWN0LlByb3BUeXBlcy5hcnJheSxcbiAgICAgICAgcGxhY2Vob2xkZXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIG9uQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25LZXlEb3duOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25LZXlQcmVzczogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uS2V5VXA6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbkZvY3VzOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25TZWxlY3Q6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbklucHV0Q2xpY2s6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBoYW5kbGVIaW50OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25Db21wbGV0ZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uT3B0aW9uQ2xpY2s6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbk9wdGlvbkNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9wdGlvblRlbXBsYXRlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgICBnZXRNZXNzYWdlRm9yT3B0aW9uOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgZ2V0TWVzc2FnZUZvckluY29taW5nT3B0aW9uczogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbiAgICB9LFxuXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlucHV0VmFsdWU6ICcnLFxuICAgICAgICAgICAgb3B0aW9uczogW10sXG4gICAgICAgICAgICBvbkZvY3VzOiBub29wLFxuICAgICAgICAgICAgb25LZXlEb3duOiBub29wLFxuICAgICAgICAgICAgb25DaGFuZ2U6IG5vb3AsXG4gICAgICAgICAgICBvbklucHV0Q2xpY2s6IG5vb3AsXG4gICAgICAgICAgICBoYW5kbGVIaW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25PcHRpb25DbGljazogbm9vcCxcbiAgICAgICAgICAgIG9uT3B0aW9uQ2hhbmdlOiBub29wLFxuICAgICAgICAgICAgb25Db21wbGV0ZTogIG5vb3AsXG4gICAgICAgICAgICBnZXRNZXNzYWdlRm9yT3B0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0TWVzc2FnZUZvckluY29taW5nT3B0aW9uczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdTdWdnZXN0aW9ucyBhcmUgYXZhaWxhYmxlLiBVc2UgdXAgYW5kIGRvd24gYXJyb3dzIHRvIHNlbGVjdC4nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICB9LFxuXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNlbGVjdGVkSW5kZXg6IC0xLFxuICAgICAgICAgICAgaXNIaW50VmlzaWJsZTogZmFsc2UsXG4gICAgICAgICAgICBpc0Ryb3Bkb3duVmlzaWJsZTogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIHVuaXF1ZUlkID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICAgICAgX3RoaXMudXNlcklucHV0VmFsdWUgPSBudWxsO1xuICAgICAgICBfdGhpcy5wcmV2aW91c0lucHV0VmFsdWUgPSBudWxsO1xuICAgICAgICBfdGhpcy5hY3RpdmVEZXNjZW5kYW50SWQgPSAncmVhY3QtdHlwZWFoZWFkLWFjdGl2ZWRlc2NlbmRhbnQtJyArIHVuaXF1ZUlkO1xuICAgICAgICBfdGhpcy5vcHRpb25zSWQgPSAncmVhY3QtdHlwZWFoZWFkLW9wdGlvbnMtJyArIHVuaXF1ZUlkO1xuICAgIH0sXG5cbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhZGRFdmVudCA9IHdpbmRvdy5hZGRFdmVudExpc3RlbmVyLFxuICAgICAgICAgICAgaGFuZGxlV2luZG93Q2xvc2UgPSB0aGlzLmhhbmRsZVdpbmRvd0Nsb3NlO1xuXG4gICAgICAgIC8vIFRoZSBgZm9jdXNgIGV2ZW50IGRvZXMgbm90IGJ1YmJsZSwgc28gd2UgbXVzdCBjYXB0dXJlIGl0IGluc3RlYWQuXG4gICAgICAgIC8vIFRoaXMgY2xvc2VzIFR5cGVhaGVhZCdzIGRyb3Bkb3duIHdoZW5ldmVyIHNvbWV0aGluZyBlbHNlIGdhaW5zIGZvY3VzLlxuICAgICAgICBhZGRFdmVudCgnZm9jdXMnLCBoYW5kbGVXaW5kb3dDbG9zZSwgdHJ1ZSk7XG5cbiAgICAgICAgLy8gSWYgd2UgY2xpY2sgYW55d2hlcmUgb3V0c2lkZSBvZiBUeXBlYWhlYWQsIGNsb3NlIHRoZSBkcm9wZG93bi5cbiAgICAgICAgYWRkRXZlbnQoJ2NsaWNrJywgaGFuZGxlV2luZG93Q2xvc2UsIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcmVtb3ZlRXZlbnQgPSB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcixcbiAgICAgICAgICAgIGhhbmRsZVdpbmRvd0Nsb3NlID0gdGhpcy5oYW5kbGVXaW5kb3dDbG9zZTtcblxuICAgICAgICByZW1vdmVFdmVudCgnZm9jdXMnLCBoYW5kbGVXaW5kb3dDbG9zZSwgdHJ1ZSk7XG4gICAgICAgIHJlbW92ZUV2ZW50KCdjbGljaycsIGhhbmRsZVdpbmRvd0Nsb3NlLCBmYWxzZSk7XG4gICAgfSxcblxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5leHRQcm9wcykge1xuICAgICAgICB2YXIgbmV4dFZhbHVlID0gbmV4dFByb3BzLmlucHV0VmFsdWUsXG4gICAgICAgICAgICBuZXh0T3B0aW9ucyA9IG5leHRQcm9wcy5vcHRpb25zLFxuICAgICAgICAgICAgdmFsdWVMZW5ndGggPSBuZXh0VmFsdWUubGVuZ3RoLFxuICAgICAgICAgICAgaXNIaW50VmlzaWJsZSA9IHZhbHVlTGVuZ3RoID4gMCAmJlxuICAgICAgICAgICAgICAgIC8vIEEgdmlzaWJsZSBwYXJ0IG9mIHRoZSBoaW50IG11c3QgYmVcbiAgICAgICAgICAgICAgICAvLyBhdmFpbGFibGUgZm9yIHVzIHRvIGNvbXBsZXRlIGl0LlxuICAgICAgICAgICAgICAgIG5leHRQcm9wcy5oYW5kbGVIaW50KG5leHRWYWx1ZSwgbmV4dE9wdGlvbnMpLnNsaWNlKHZhbHVlTGVuZ3RoKS5sZW5ndGggPiAwO1xuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaXNIaW50VmlzaWJsZTogaXNIaW50VmlzaWJsZVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9eydyZWFjdC10eXBlYWhlYWQtY29udGFpbmVyICcgKyBfdGhpcy5wcm9wcy5jbGFzc05hbWV9PlxuICAgICAgICAgICAgICAgIHtfdGhpcy5yZW5kZXJJbnB1dCgpfVxuICAgICAgICAgICAgICAgIHtfdGhpcy5yZW5kZXJEcm9wZG93bigpfVxuICAgICAgICAgICAgICAgIHtfdGhpcy5yZW5kZXJBcmlhTWVzc2FnZUZvck9wdGlvbnMoKX1cbiAgICAgICAgICAgICAgICB7X3RoaXMucmVuZGVyQXJpYU1lc3NhZ2VGb3JJbmNvbWluZ09wdGlvbnMoKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICByZW5kZXJJbnB1dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgICBzdGF0ZSA9IF90aGlzLnN0YXRlLFxuICAgICAgICAgICAgcHJvcHMgPSBfdGhpcy5wcm9wcyxcbiAgICAgICAgICAgIGlucHV0VmFsdWUgPSBwcm9wcy5pbnB1dFZhbHVlLFxuICAgICAgICAgICAgY2xhc3NOYW1lID0gJ3JlYWN0LXR5cGVhaGVhZC1pbnB1dCcsXG4gICAgICAgICAgICBpbnB1dERpcmVjdGlvbiA9IGdldFRleHREaXJlY3Rpb24oaW5wdXRWYWx1ZSk7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPSdyZWFjdC10eXBlYWhlYWQtaW5wdXQtY29udGFpbmVyJz5cbiAgICAgICAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgICAgICAgICAgcmVmPSdpbnB1dCdcbiAgICAgICAgICAgICAgICAgICAgcm9sZT0nY29tYm9ib3gnXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtb3ducz17X3RoaXMub3B0aW9uc0lkfVxuICAgICAgICAgICAgICAgICAgICBhcmlhLWV4cGFuZGVkPXtzdGF0ZS5pc0Ryb3Bkb3duVmlzaWJsZX1cbiAgICAgICAgICAgICAgICAgICAgYXJpYS1hdXRvY29tcGxldGU9J2JvdGgnXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtYWN0aXZlZGVzY2VuZGFudD17X3RoaXMuYWN0aXZlRGVzY2VuZGFudElkfVxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17aW5wdXRWYWx1ZX1cbiAgICAgICAgICAgICAgICAgICAgc3BlbGxDaGVjaz17ZmFsc2V9XG4gICAgICAgICAgICAgICAgICAgIGF1dG9Db21wbGV0ZT17ZmFsc2V9XG4gICAgICAgICAgICAgICAgICAgIGF1dG9Db3JyZWN0PXtmYWxzZX1cbiAgICAgICAgICAgICAgICAgICAgZGlyPXtpbnB1dERpcmVjdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17X3RoaXMuaGFuZGxlQ2xpY2t9XG4gICAgICAgICAgICAgICAgICAgIG9uRm9jdXM9e190aGlzLmhhbmRsZUZvY3VzfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17X3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICBvbktleURvd249e190aGlzLmhhbmRsZUtleURvd259XG4gICAgICAgICAgICAgICAgICAgIGlkPXtwcm9wcy5pbnB1dElkfVxuICAgICAgICAgICAgICAgICAgICBhdXRvRm9jdXM9e3Byb3BzLmF1dG9Gb2N1c31cbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3Byb3BzLnBsYWNlaG9sZGVyfVxuICAgICAgICAgICAgICAgICAgICBvblNlbGVjdD17cHJvcHMub25TZWxlY3R9XG4gICAgICAgICAgICAgICAgICAgIG9uS2V5VXA9e3Byb3BzLm9uS2V5VXB9XG4gICAgICAgICAgICAgICAgICAgIG9uS2V5UHJlc3M9e3Byb3BzLm9uS2V5UHJlc3N9XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lICsgJyByZWFjdC10eXBlYWhlYWQtdXNlcnRleHQnfVxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgLz5cblxuICAgICAgICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICAgcm9sZT0ncHJlc2VudGF0aW9uJ1xuICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICAgZGlyPXtpbnB1dERpcmVjdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWUgKyAnIHJlYWN0LXR5cGVhaGVhZC1oaW50J31cbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnc2lsdmVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFdlYmtpdFRleHRGaWxsQ29sb3I6ICdzaWx2ZXInXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtzdGF0ZS5pc0hpbnRWaXNpYmxlID8gcHJvcHMuaGFuZGxlSGludChpbnB1dFZhbHVlLCBwcm9wcy5vcHRpb25zKSA6IG51bGx9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICByZW5kZXJEcm9wZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgICBzdGF0ZSA9IF90aGlzLnN0YXRlLFxuICAgICAgICAgICAgcHJvcHMgPSBfdGhpcy5wcm9wcyxcbiAgICAgICAgICAgIE9wdGlvblRlbXBsYXRlID0gcHJvcHMub3B0aW9uVGVtcGxhdGUsXG4gICAgICAgICAgICBzZWxlY3RlZEluZGV4ID0gc3RhdGUuc2VsZWN0ZWRJbmRleCxcbiAgICAgICAgICAgIGlzRHJvcGRvd25WaXNpYmxlID0gc3RhdGUuaXNEcm9wZG93blZpc2libGUsXG4gICAgICAgICAgICBhY3RpdmVEZXNjZW5kYW50SWQgPSBfdGhpcy5hY3RpdmVEZXNjZW5kYW50SWQ7XG5cbiAgICAgICAgaWYgKHRoaXMucHJvcHMub3B0aW9ucy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8dWwgaWQ9e190aGlzLm9wdGlvbnNJZH1cbiAgICAgICAgICAgICAgICByb2xlPSdsaXN0Ym94J1xuICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPXshaXNEcm9wZG93blZpc2libGV9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJyNmZmYnLFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGlzRHJvcGRvd25WaXNpYmxlID8gJ2Jsb2NrJyA6ICdub25lJ1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPSdyZWFjdC10eXBlYWhlYWQtb3B0aW9ucydcbiAgICAgICAgICAgICAgICBvbk1vdXNlT3V0PXt0aGlzLmhhbmRsZU1vdXNlT3V0fT5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BzLm9wdGlvbnMubWFwKGZ1bmN0aW9uKGRhdGEsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNTZWxlY3RlZCA9IHNlbGVjdGVkSW5kZXggPT09IGluZGV4O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBpZD17aXNTZWxlY3RlZCA/IGFjdGl2ZURlc2NlbmRhbnRJZCA6IG51bGx9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvbGU9J29wdGlvbidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17X3RoaXMuaGFuZGxlT3B0aW9uQ2xpY2suYmluZChfdGhpcywgaW5kZXgpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlT3Zlcj17X3RoaXMuaGFuZGxlT3B0aW9uTW91c2VPdmVyLmJpbmQoX3RoaXMsIGluZGV4KX0+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE9wdGlvblRlbXBsYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhPXtkYXRhfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklucHV0VmFsdWU9e190aGlzLnVzZXJJbnB1dFZhbHVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWx1ZT17cHJvcHMuaW5wdXRWYWx1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ9e2lzU2VsZWN0ZWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyQXJpYU1lc3NhZ2VGb3JPcHRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIHByb3BzID0gX3RoaXMucHJvcHMsXG4gICAgICAgICAgICBpbnB1dFZhbHVlID0gcHJvcHMuaW5wdXRWYWx1ZSxcbiAgICAgICAgICAgIG9wdGlvbiA9IHByb3BzLm9wdGlvbnNbX3RoaXMuc3RhdGUuc2VsZWN0ZWRJbmRleF0gfHwgaW5wdXRWYWx1ZTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEFyaWFTdGF0dXNcbiAgICAgICAgICAgICAgICBtZXNzYWdlPXtwcm9wcy5nZXRNZXNzYWdlRm9yT3B0aW9uKG9wdGlvbikgfHwgaW5wdXRWYWx1ZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIHJlbmRlckFyaWFNZXNzYWdlRm9ySW5jb21pbmdPcHRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxBcmlhU3RhdHVzXG4gICAgICAgICAgICAgICAgbWVzc2FnZT17dGhpcy5wcm9wcy5nZXRNZXNzYWdlRm9ySW5jb21pbmdPcHRpb25zKCl9XG4gICAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICBzaG93RHJvcGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlzRHJvcGRvd25WaXNpYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBoaWRlRHJvcGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlzRHJvcGRvd25WaXNpYmxlOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2hvd0hpbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgICAgcHJvcHMgPSBfdGhpcy5wcm9wcyxcbiAgICAgICAgICAgIGlucHV0VmFsdWUgPSBwcm9wcy5pbnB1dFZhbHVlLFxuICAgICAgICAgICAgaW5wdXRWYWx1ZUxlbmd0aCA9IGlucHV0VmFsdWUubGVuZ3RoLFxuICAgICAgICAgICAgaXNIaW50VmlzaWJsZSA9IGlucHV0VmFsdWVMZW5ndGggPiAwICYmXG4gICAgICAgICAgICAgICAgLy8gQSB2aXNpYmxlIHBhcnQgb2YgdGhlIGhpbnQgbXVzdCBiZVxuICAgICAgICAgICAgICAgIC8vIGF2YWlsYWJsZSBmb3IgdXMgdG8gY29tcGxldGUgaXQuXG4gICAgICAgICAgICAgICAgcHJvcHMuaGFuZGxlSGludChpbnB1dFZhbHVlLCBwcm9wcy5vcHRpb25zKS5zbGljZShpbnB1dFZhbHVlTGVuZ3RoKS5sZW5ndGggPiAwO1xuXG4gICAgICAgIF90aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlzSGludFZpc2libGU6IGlzSGludFZpc2libGVcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGhpZGVIaW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpc0hpbnRWaXNpYmxlOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2V0U2VsZWN0ZWRJbmRleDogZnVuY3Rpb24oaW5kZXgsIGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgc2VsZWN0ZWRJbmRleDogaW5kZXhcbiAgICAgICAgfSwgY2FsbGJhY2spO1xuICAgIH0sXG5cbiAgICBoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgX3RoaXMuc2hvd0hpbnQoKTtcbiAgICAgICAgX3RoaXMuc2hvd0Ryb3Bkb3duKCk7XG4gICAgICAgIF90aGlzLnNldFNlbGVjdGVkSW5kZXgoLTEpO1xuICAgICAgICBfdGhpcy5wcm9wcy5vbkNoYW5nZShldmVudCk7XG4gICAgICAgIF90aGlzLnVzZXJJbnB1dFZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIH0sXG5cbiAgICBoYW5kbGVGb2N1czogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICBfdGhpcy5zaG93RHJvcGRvd24oKTtcbiAgICAgICAgX3RoaXMucHJvcHMub25Gb2N1cyhldmVudCk7XG4gICAgfSxcblxuICAgIGhhbmRsZUNsaWNrOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIF90aGlzLnNob3dIaW50KCk7XG4gICAgICAgIF90aGlzLnByb3BzLm9uSW5wdXRDbGljayhldmVudCk7XG4gICAgfSxcblxuICAgIG5hdmlnYXRlOiBmdW5jdGlvbihkaXJlY3Rpb24sIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgICBtaW5JbmRleCA9IC0xLFxuICAgICAgICAgICAgbWF4SW5kZXggPSBfdGhpcy5wcm9wcy5vcHRpb25zLmxlbmd0aCAtIDEsXG4gICAgICAgICAgICBpbmRleCA9IF90aGlzLnN0YXRlLnNlbGVjdGVkSW5kZXggKyBkaXJlY3Rpb247XG5cbiAgICAgICAgaWYgKGluZGV4ID4gbWF4SW5kZXgpIHtcbiAgICAgICAgICAgIGluZGV4ID0gbWluSW5kZXg7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5kZXggPCBtaW5JbmRleCkge1xuICAgICAgICAgICAgaW5kZXggPSBtYXhJbmRleDtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzLnNldFNlbGVjdGVkSW5kZXgoaW5kZXgsIGNhbGxiYWNrKTtcbiAgICB9LFxuXG4gICAgaGFuZGxlS2V5RG93bjogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIGtleSA9IGV2ZW50LmtleSxcbiAgICAgICAgICAgIHByb3BzID0gX3RoaXMucHJvcHMsXG4gICAgICAgICAgICBpbnB1dCA9IF90aGlzLnJlZnMuaW5wdXQsXG4gICAgICAgICAgICBpc0Ryb3Bkb3duVmlzaWJsZSA9IF90aGlzLnN0YXRlLmlzRHJvcGRvd25WaXNpYmxlLFxuICAgICAgICAgICAgaXNIaW50VmlzaWJsZSA9IF90aGlzLnN0YXRlLmlzSGludFZpc2libGUsXG4gICAgICAgICAgICBoYXNIYW5kbGVkS2V5RG93biA9IGZhbHNlLFxuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICBvcHRpb25EYXRhLFxuICAgICAgICAgICAgZGlyO1xuXG4gICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgIGNhc2UgJ0VuZCc6XG4gICAgICAgIGNhc2UgJ1RhYic6XG4gICAgICAgICAgICBpZiAoaXNIaW50VmlzaWJsZSAmJiAhZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHByb3BzLm9uQ29tcGxldGUoZXZlbnQsIHByb3BzLmhhbmRsZUhpbnQocHJvcHMuaW5wdXRWYWx1ZSwgcHJvcHMub3B0aW9ucykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6XG4gICAgICAgIGNhc2UgJ0Fycm93UmlnaHQnOlxuICAgICAgICAgICAgaWYgKGlzSGludFZpc2libGUgJiYgIWV2ZW50LnNoaWZ0S2V5ICYmIGlucHV0LmlzQ3Vyc29yQXRFbmQoKSkge1xuICAgICAgICAgICAgICAgIGRpciA9IGdldFRleHREaXJlY3Rpb24ocHJvcHMuaW5wdXRWYWx1ZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoKGRpciA9PT0gJ2x0cicgJiYga2V5ID09PSAnQXJyb3dSaWdodCcpIHx8IChkaXIgPT09ICdydGwnICYmIGtleSA9PT0gJ0Fycm93TGVmdCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BzLm9uQ29tcGxldGUoZXZlbnQsIHByb3BzLmhhbmRsZUhpbnQocHJvcHMuaW5wdXRWYWx1ZSwgcHJvcHMub3B0aW9ucykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdFbnRlcic6XG4gICAgICAgICAgICBpbnB1dC5ibHVyKCk7XG4gICAgICAgICAgICBfdGhpcy5oaWRlSGludCgpO1xuICAgICAgICAgICAgX3RoaXMuaGlkZURyb3Bkb3duKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnRXNjYXBlJzpcbiAgICAgICAgICAgIF90aGlzLmhpZGVIaW50KCk7XG4gICAgICAgICAgICBfdGhpcy5oaWRlRHJvcGRvd24oKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdBcnJvd1VwJzpcbiAgICAgICAgY2FzZSAnQXJyb3dEb3duJzpcbiAgICAgICAgICAgIGlmIChwcm9wcy5vcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgX3RoaXMuc2hvd0hpbnQoKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5zaG93RHJvcGRvd24oKTtcblxuICAgICAgICAgICAgICAgIGlmIChpc0Ryb3Bkb3duVmlzaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICBkaXIgPSBrZXkgPT09ICdBcnJvd1VwJyA/IC0xOiAxO1xuICAgICAgICAgICAgICAgICAgICBoYXNIYW5kbGVkS2V5RG93biA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubmF2aWdhdGUoZGlyLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZEluZGV4ID0gX3RoaXMuc3RhdGUuc2VsZWN0ZWRJbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2aW91c0lucHV0VmFsdWUgPSBfdGhpcy5wcmV2aW91c0lucHV0VmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uRGF0YSA9IHByZXZpb3VzSW5wdXRWYWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UncmUgY3VycmVudGx5IG9uIGFuIG9wdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTYXZlIHRoZSBjdXJyZW50IGBpbnB1dGAgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXMgd2UgbWlnaHQgYXJyb3cgYmFjayB0byBpdCBsYXRlci5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldmlvdXNJbnB1dFZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnByZXZpb3VzSW5wdXRWYWx1ZSA9IHByb3BzLmlucHV0VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uRGF0YSA9IHByb3BzLm9wdGlvbnNbc2VsZWN0ZWRJbmRleF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzLm9uT3B0aW9uQ2hhbmdlKGV2ZW50LCBvcHRpb25EYXRhLCBzZWxlY3RlZEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzLm9uS2V5RG93bihldmVudCwgb3B0aW9uRGF0YSwgc2VsZWN0ZWRJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWhhc0hhbmRsZWRLZXlEb3duKSB7XG4gICAgICAgICAgICBpbmRleCA9IHRoaXMuc3RhdGUuc2VsZWN0ZWRJbmRleDtcbiAgICAgICAgICAgIG9wdGlvbkRhdGEgPSBpbmRleCA8IDAgPyBwcm9wcy5pbnB1dFZhbHVlIDogcHJvcHMub3B0aW9uc1tpbmRleF07XG4gICAgICAgICAgICBwcm9wcy5vbktleURvd24oZXZlbnQsIG9wdGlvbkRhdGEsIGluZGV4KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBoYW5kbGVPcHRpb25DbGljazogZnVuY3Rpb24oc2VsZWN0ZWRJbmRleCwgZXZlbnQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIHByb3BzID0gX3RoaXMucHJvcHM7XG5cbiAgICAgICAgX3RoaXMuaGlkZUhpbnQoKTtcbiAgICAgICAgX3RoaXMuaGlkZURyb3Bkb3duKCk7XG4gICAgICAgIF90aGlzLnNldFNlbGVjdGVkSW5kZXgoc2VsZWN0ZWRJbmRleCk7XG4gICAgICAgIHByb3BzLm9uT3B0aW9uQ2xpY2soZXZlbnQsIHByb3BzLm9wdGlvbnNbc2VsZWN0ZWRJbmRleF0sIHNlbGVjdGVkSW5kZXgpO1xuICAgIH0sXG5cbiAgICBoYW5kbGVPcHRpb25Nb3VzZU92ZXI6IGZ1bmN0aW9uKHNlbGVjdGVkSW5kZXgpIHtcbiAgICAgICAgdGhpcy5zZXRTZWxlY3RlZEluZGV4KHNlbGVjdGVkSW5kZXgpO1xuICAgIH0sXG5cbiAgICBoYW5kbGVNb3VzZU91dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRJbmRleCgtMSk7XG4gICAgfSxcblxuICAgIGhhbmRsZVdpbmRvd0Nsb3NlOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgICAgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuXG4gICAgICAgIGlmICh0YXJnZXQgIT09IHdpbmRvdyAmJiAhdGhpcy5nZXRET01Ob2RlKCkuY29udGFpbnModGFyZ2V0KSkge1xuICAgICAgICAgICAgX3RoaXMuaGlkZUhpbnQoKTtcbiAgICAgICAgICAgIF90aGlzLmhpZGVEcm9wZG93bigpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy90eXBlYWhlYWQuanN4Jyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBSVExDaGFyYWN0ZXJzUmVnRXhwID0gcmVxdWlyZSgnLi9ydGxfY2hhcnNfcmVnZXhwJyksXG4gICAgTmV1dHJhbENoYXJhY3RlcnNSZWdFeHAgPSByZXF1aXJlKCcuL25ldXRyYWxfY2hhcnNfcmVnZXhwJyksXG4gICAgc3RhcnRzV2l0aFJUTCA9IG5ldyBSZWdFeHAoJ14oPzonICsgTmV1dHJhbENoYXJhY3RlcnNSZWdFeHAgKyAnKSooPzonICsgUlRMQ2hhcmFjdGVyc1JlZ0V4cCArICcpJyksXG4gICAgbmV1dHJhbFRleHQgPSBuZXcgUmVnRXhwKCdeKD86JyArIE5ldXRyYWxDaGFyYWN0ZXJzUmVnRXhwICsgJykqJCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICB2YXIgZGlyID0gJ2x0cic7XG5cbiAgICBpZiAoc3RhcnRzV2l0aFJUTC50ZXN0KHRleHQpKSB7XG4gICAgICAgIGRpciA9ICdydGwnO1xuICAgIH0gZWxzZSBpZiAobmV1dHJhbFRleHQudGVzdCh0ZXh0KSkge1xuICAgICAgICBkaXIgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBkaXI7XG59O1xuIiwiLy8gRE8gTk9UIEVESVQhXG4vLyBUSElTIEZJTEUgSVMgR0VORVJBVEVEIVxuXG4vLyBBbGwgYmlkaSBjaGFyYWN0ZXJzIGV4Y2VwdCB0aG9zZSBmb3VuZCBpbiBjbGFzc2VzICdMJyAoTFRSKSwgJ1InIChSVEwpLCBhbmQgJ0FMJyAoUlRMIEFyYWJpYykgYXMgcGVyIFVuaWNvZGUgNy4wLjAuXG5cbi8vIGpzaGludCBpZ25vcmU6c3RhcnRcbi8vIGpzY3M6ZGlzYWJsZSBtYXhpbXVtTGluZUxlbmd0aFxubW9kdWxlLmV4cG9ydHMgPSAnW1xcMC1AXFxbLWBcXHstXFx4QTlcXHhBQi1cXHhCNFxceEI2LVxceEI5XFx4QkItXFx4QkZcXHhEN1xceEY3XFx1MDJCOVxcdTAyQkFcXHUwMkMyLVxcdTAyQ0ZcXHUwMkQyLVxcdTAyREZcXHUwMkU1LVxcdTAyRURcXHUwMkVGLVxcdTAzNkZcXHUwMzc0XFx1MDM3NVxcdTAzN0VcXHUwMzg0XFx1MDM4NVxcdTAzODdcXHUwM0Y2XFx1MDQ4My1cXHUwNDg5XFx1MDU4QVxcdTA1OEQtXFx1MDU4RlxcdTA1OTEtXFx1MDVCRFxcdTA1QkZcXHUwNUMxXFx1MDVDMlxcdTA1QzRcXHUwNUM1XFx1MDVDN1xcdTA2MDAtXFx1MDYwN1xcdTA2MDlcXHUwNjBBXFx1MDYwQ1xcdTA2MEUtXFx1MDYxQVxcdTA2NEItXFx1MDY2Q1xcdTA2NzBcXHUwNkQ2LVxcdTA2RTRcXHUwNkU3LVxcdTA2RURcXHUwNkYwLVxcdTA2RjlcXHUwNzExXFx1MDczMC1cXHUwNzRBXFx1MDdBNi1cXHUwN0IwXFx1MDdFQi1cXHUwN0YzXFx1MDdGNi1cXHUwN0Y5XFx1MDgxNi1cXHUwODE5XFx1MDgxQi1cXHUwODIzXFx1MDgyNS1cXHUwODI3XFx1MDgyOS1cXHUwODJEXFx1MDg1OS1cXHUwODVCXFx1MDhFNC1cXHUwOTAyXFx1MDkzQVxcdTA5M0NcXHUwOTQxLVxcdTA5NDhcXHUwOTREXFx1MDk1MS1cXHUwOTU3XFx1MDk2MlxcdTA5NjNcXHUwOTgxXFx1MDlCQ1xcdTA5QzEtXFx1MDlDNFxcdTA5Q0RcXHUwOUUyXFx1MDlFM1xcdTA5RjJcXHUwOUYzXFx1MDlGQlxcdTBBMDFcXHUwQTAyXFx1MEEzQ1xcdTBBNDFcXHUwQTQyXFx1MEE0N1xcdTBBNDhcXHUwQTRCLVxcdTBBNERcXHUwQTUxXFx1MEE3MFxcdTBBNzFcXHUwQTc1XFx1MEE4MVxcdTBBODJcXHUwQUJDXFx1MEFDMS1cXHUwQUM1XFx1MEFDN1xcdTBBQzhcXHUwQUNEXFx1MEFFMlxcdTBBRTNcXHUwQUYxXFx1MEIwMVxcdTBCM0NcXHUwQjNGXFx1MEI0MS1cXHUwQjQ0XFx1MEI0RFxcdTBCNTZcXHUwQjYyXFx1MEI2M1xcdTBCODJcXHUwQkMwXFx1MEJDRFxcdTBCRjMtXFx1MEJGQVxcdTBDMDBcXHUwQzNFLVxcdTBDNDBcXHUwQzQ2LVxcdTBDNDhcXHUwQzRBLVxcdTBDNERcXHUwQzU1XFx1MEM1NlxcdTBDNjJcXHUwQzYzXFx1MEM3OC1cXHUwQzdFXFx1MEM4MVxcdTBDQkNcXHUwQ0NDXFx1MENDRFxcdTBDRTJcXHUwQ0UzXFx1MEQwMVxcdTBENDEtXFx1MEQ0NFxcdTBENERcXHUwRDYyXFx1MEQ2M1xcdTBEQ0FcXHUwREQyLVxcdTBERDRcXHUwREQ2XFx1MEUzMVxcdTBFMzQtXFx1MEUzQVxcdTBFM0ZcXHUwRTQ3LVxcdTBFNEVcXHUwRUIxXFx1MEVCNC1cXHUwRUI5XFx1MEVCQlxcdTBFQkNcXHUwRUM4LVxcdTBFQ0RcXHUwRjE4XFx1MEYxOVxcdTBGMzVcXHUwRjM3XFx1MEYzOS1cXHUwRjNEXFx1MEY3MS1cXHUwRjdFXFx1MEY4MC1cXHUwRjg0XFx1MEY4NlxcdTBGODdcXHUwRjhELVxcdTBGOTdcXHUwRjk5LVxcdTBGQkNcXHUwRkM2XFx1MTAyRC1cXHUxMDMwXFx1MTAzMi1cXHUxMDM3XFx1MTAzOVxcdTEwM0FcXHUxMDNEXFx1MTAzRVxcdTEwNThcXHUxMDU5XFx1MTA1RS1cXHUxMDYwXFx1MTA3MS1cXHUxMDc0XFx1MTA4MlxcdTEwODVcXHUxMDg2XFx1MTA4RFxcdTEwOURcXHUxMzVELVxcdTEzNUZcXHUxMzkwLVxcdTEzOTlcXHUxNDAwXFx1MTY4MFxcdTE2OUJcXHUxNjlDXFx1MTcxMi1cXHUxNzE0XFx1MTczMi1cXHUxNzM0XFx1MTc1MlxcdTE3NTNcXHUxNzcyXFx1MTc3M1xcdTE3QjRcXHUxN0I1XFx1MTdCNy1cXHUxN0JEXFx1MTdDNlxcdTE3QzktXFx1MTdEM1xcdTE3REJcXHUxN0REXFx1MTdGMC1cXHUxN0Y5XFx1MTgwMC1cXHUxODBFXFx1MThBOVxcdTE5MjAtXFx1MTkyMlxcdTE5MjdcXHUxOTI4XFx1MTkzMlxcdTE5MzktXFx1MTkzQlxcdTE5NDBcXHUxOTQ0XFx1MTk0NVxcdTE5REUtXFx1MTlGRlxcdTFBMTdcXHUxQTE4XFx1MUExQlxcdTFBNTZcXHUxQTU4LVxcdTFBNUVcXHUxQTYwXFx1MUE2MlxcdTFBNjUtXFx1MUE2Q1xcdTFBNzMtXFx1MUE3Q1xcdTFBN0ZcXHUxQUIwLVxcdTFBQkVcXHUxQjAwLVxcdTFCMDNcXHUxQjM0XFx1MUIzNi1cXHUxQjNBXFx1MUIzQ1xcdTFCNDJcXHUxQjZCLVxcdTFCNzNcXHUxQjgwXFx1MUI4MVxcdTFCQTItXFx1MUJBNVxcdTFCQThcXHUxQkE5XFx1MUJBQi1cXHUxQkFEXFx1MUJFNlxcdTFCRThcXHUxQkU5XFx1MUJFRFxcdTFCRUYtXFx1MUJGMVxcdTFDMkMtXFx1MUMzM1xcdTFDMzZcXHUxQzM3XFx1MUNEMC1cXHUxQ0QyXFx1MUNENC1cXHUxQ0UwXFx1MUNFMi1cXHUxQ0U4XFx1MUNFRFxcdTFDRjRcXHUxQ0Y4XFx1MUNGOVxcdTFEQzAtXFx1MURGNVxcdTFERkMtXFx1MURGRlxcdTFGQkRcXHUxRkJGLVxcdTFGQzFcXHUxRkNELVxcdTFGQ0ZcXHUxRkRELVxcdTFGREZcXHUxRkVELVxcdTFGRUZcXHUxRkZEXFx1MUZGRVxcdTIwMDAtXFx1MjAwRFxcdTIwMTAtXFx1MjAyOVxcdTIwMkYtXFx1MjA2NFxcdTIwNjhcXHUyMDZBLVxcdTIwNzBcXHUyMDc0LVxcdTIwN0VcXHUyMDgwLVxcdTIwOEVcXHUyMEEwLVxcdTIwQkRcXHUyMEQwLVxcdTIwRjBcXHUyMTAwXFx1MjEwMVxcdTIxMDMtXFx1MjEwNlxcdTIxMDhcXHUyMTA5XFx1MjExNFxcdTIxMTYtXFx1MjExOFxcdTIxMUUtXFx1MjEyM1xcdTIxMjVcXHUyMTI3XFx1MjEyOVxcdTIxMkVcXHUyMTNBXFx1MjEzQlxcdTIxNDAtXFx1MjE0NFxcdTIxNEEtXFx1MjE0RFxcdTIxNTAtXFx1MjE1RlxcdTIxODlcXHUyMTkwLVxcdTIzMzVcXHUyMzdCLVxcdTIzOTRcXHUyMzk2LVxcdTIzRkFcXHUyNDAwLVxcdTI0MjZcXHUyNDQwLVxcdTI0NEFcXHUyNDYwLVxcdTI0OUJcXHUyNEVBLVxcdTI2QUJcXHUyNkFELVxcdTI3RkZcXHUyOTAwLVxcdTJCNzNcXHUyQjc2LVxcdTJCOTVcXHUyQjk4LVxcdTJCQjlcXHUyQkJELVxcdTJCQzhcXHUyQkNBLVxcdTJCRDFcXHUyQ0U1LVxcdTJDRUFcXHUyQ0VGLVxcdTJDRjFcXHUyQ0Y5LVxcdTJDRkZcXHUyRDdGXFx1MkRFMC1cXHUyRTQyXFx1MkU4MC1cXHUyRTk5XFx1MkU5Qi1cXHUyRUYzXFx1MkYwMC1cXHUyRkQ1XFx1MkZGMC1cXHUyRkZCXFx1MzAwMC1cXHUzMDA0XFx1MzAwOC1cXHUzMDIwXFx1MzAyQS1cXHUzMDJEXFx1MzAzMFxcdTMwMzZcXHUzMDM3XFx1MzAzRC1cXHUzMDNGXFx1MzA5OS1cXHUzMDlDXFx1MzBBMFxcdTMwRkJcXHUzMUMwLVxcdTMxRTNcXHUzMjFEXFx1MzIxRVxcdTMyNTAtXFx1MzI1RlxcdTMyN0MtXFx1MzI3RVxcdTMyQjEtXFx1MzJCRlxcdTMyQ0MtXFx1MzJDRlxcdTMzNzctXFx1MzM3QVxcdTMzREVcXHUzM0RGXFx1MzNGRlxcdTREQzAtXFx1NERGRlxcdUE0OTAtXFx1QTRDNlxcdUE2MEQtXFx1QTYwRlxcdUE2NkYtXFx1QTY3RlxcdUE2OUZcXHVBNkYwXFx1QTZGMVxcdUE3MDAtXFx1QTcyMVxcdUE3ODhcXHVBODAyXFx1QTgwNlxcdUE4MEJcXHVBODI1XFx1QTgyNlxcdUE4MjgtXFx1QTgyQlxcdUE4MzhcXHVBODM5XFx1QTg3NC1cXHVBODc3XFx1QThDNFxcdUE4RTAtXFx1QThGMVxcdUE5MjYtXFx1QTkyRFxcdUE5NDctXFx1QTk1MVxcdUE5ODAtXFx1QTk4MlxcdUE5QjNcXHVBOUI2LVxcdUE5QjlcXHVBOUJDXFx1QTlFNVxcdUFBMjktXFx1QUEyRVxcdUFBMzFcXHVBQTMyXFx1QUEzNVxcdUFBMzZcXHVBQTQzXFx1QUE0Q1xcdUFBN0NcXHVBQUIwXFx1QUFCMi1cXHVBQUI0XFx1QUFCN1xcdUFBQjhcXHVBQUJFXFx1QUFCRlxcdUFBQzFcXHVBQUVDXFx1QUFFRFxcdUFBRjZcXHVBQkU1XFx1QUJFOFxcdUFCRURcXHVGQjFFXFx1RkIyOVxcdUZEM0VcXHVGRDNGXFx1RkRGRFxcdUZFMDAtXFx1RkUxOVxcdUZFMjAtXFx1RkUyRFxcdUZFMzAtXFx1RkU1MlxcdUZFNTQtXFx1RkU2NlxcdUZFNjgtXFx1RkU2QlxcdUZFRkZcXHVGRjAxLVxcdUZGMjBcXHVGRjNCLVxcdUZGNDBcXHVGRjVCLVxcdUZGNjVcXHVGRkUwLVxcdUZGRTZcXHVGRkU4LVxcdUZGRUVcXHVGRkY5LVxcdUZGRkRdfFxcdUQ4MDBbXFx1REQwMVxcdURENDAtXFx1REQ4Q1xcdUREOTAtXFx1REQ5QlxcdUREQTBcXHVEREZEXFx1REVFMC1cXHVERUZCXFx1REY3Ni1cXHVERjdBXXxcXHVEODAyW1xcdUREMUZcXHVERTAxLVxcdURFMDNcXHVERTA1XFx1REUwNlxcdURFMEMtXFx1REUwRlxcdURFMzgtXFx1REUzQVxcdURFM0ZcXHVERUU1XFx1REVFNlxcdURGMzktXFx1REYzRl18XFx1RDgwM1tcXHVERTYwLVxcdURFN0VdfFtcXHVEODA0XFx1REI0MF1bXFx1REMwMVxcdURDMzgtXFx1REM0NlxcdURDNTItXFx1REM2NVxcdURDN0YtXFx1REM4MVxcdURDQjMtXFx1RENCNlxcdURDQjlcXHVEQ0JBXFx1REQwMC1cXHVERDAyXFx1REQyNy1cXHVERDJCXFx1REQyRC1cXHVERDM0XFx1REQ3M1xcdUREODBcXHVERDgxXFx1RERCNi1cXHVEREJFXFx1REUyRi1cXHVERTMxXFx1REUzNFxcdURFMzZcXHVERTM3XFx1REVERlxcdURFRTMtXFx1REVFQVxcdURGMDFcXHVERjNDXFx1REY0MFxcdURGNjYtXFx1REY2Q1xcdURGNzAtXFx1REY3NF18XFx1RDgwNVtcXHVEQ0IzLVxcdURDQjhcXHVEQ0JBXFx1RENCRlxcdURDQzBcXHVEQ0MyXFx1RENDM1xcdUREQjItXFx1RERCNVxcdUREQkNcXHVEREJEXFx1RERCRlxcdUREQzBcXHVERTMzLVxcdURFM0FcXHVERTNEXFx1REUzRlxcdURFNDBcXHVERUFCXFx1REVBRFxcdURFQjAtXFx1REVCNVxcdURFQjddfFxcdUQ4MUFbXFx1REVGMC1cXHVERUY0XFx1REYzMC1cXHVERjM2XXxcXHVEODFCW1xcdURGOEYtXFx1REY5Ml18XFx1RDgyRltcXHVEQzlEXFx1REM5RVxcdURDQTAtXFx1RENBM118XFx1RDgzNFtcXHVERDY3LVxcdURENjlcXHVERDczLVxcdUREODJcXHVERDg1LVxcdUREOEJcXHVEREFBLVxcdUREQURcXHVERTAwLVxcdURFNDVcXHVERjAwLVxcdURGNTZdfFxcdUQ4MzVbXFx1REVEQlxcdURGMTVcXHVERjRGXFx1REY4OVxcdURGQzNcXHVERkNFLVxcdURGRkZdfFxcdUQ4M0FbXFx1RENEMC1cXHVEQ0Q2XXxcXHVEODNCW1xcdURFRjBcXHVERUYxXXxcXHVEODNDW1xcdURDMDAtXFx1REMyQlxcdURDMzAtXFx1REM5M1xcdURDQTAtXFx1RENBRVxcdURDQjEtXFx1RENCRlxcdURDQzEtXFx1RENDRlxcdURDRDEtXFx1RENGNVxcdUREMDAtXFx1REQwQ1xcdURENkFcXHVERDZCXFx1REYwMC1cXHVERjJDXFx1REYzMC1cXHVERjdEXFx1REY4MC1cXHVERkNFXFx1REZENC1cXHVERkY3XXxcXHVEODNEW1xcdURDMDAtXFx1RENGRVxcdUREMDAtXFx1REQ0QVxcdURENTAtXFx1REQ3OVxcdUREN0ItXFx1RERBM1xcdUREQTUtXFx1REU0MlxcdURFNDUtXFx1REVDRlxcdURFRTAtXFx1REVFQ1xcdURFRjAtXFx1REVGM1xcdURGMDAtXFx1REY3M1xcdURGODAtXFx1REZENF18XFx1RDgzRVtcXHVEQzAwLVxcdURDMEJcXHVEQzEwLVxcdURDNDdcXHVEQzUwLVxcdURDNTlcXHVEQzYwLVxcdURDODdcXHVEQzkwLVxcdURDQURdJztcbi8vIGpzY3M6ZW5hYmxlIG1heGltdW1MaW5lTGVuZ3RoXG4vLyBqc2hpbnQgaWdub3JlOmVuZFxuIiwiLy8gRE8gTk9UIEVESVQhXG4vLyBUSElTIEZJTEUgSVMgR0VORVJBVEVEIVxuXG4vLyBBbGwgYmlkaSBjaGFyYWN0ZXJzIGZvdW5kIGluIGNsYXNzZXMgJ1InLCAnQUwnLCAnUkxFJywgJ1JMTycsIGFuZCAnUkxJJyBhcyBwZXIgVW5pY29kZSA3LjAuMC5cblxuLy8ganNoaW50IGlnbm9yZTpzdGFydFxuLy8ganNjczpkaXNhYmxlIG1heGltdW1MaW5lTGVuZ3RoXG5tb2R1bGUuZXhwb3J0cyA9ICdbXFx1MDVCRVxcdTA1QzBcXHUwNUMzXFx1MDVDNlxcdTA1RDAtXFx1MDVFQVxcdTA1RjAtXFx1MDVGNFxcdTA2MDhcXHUwNjBCXFx1MDYwRFxcdTA2MUJcXHUwNjFDXFx1MDYxRS1cXHUwNjRBXFx1MDY2RC1cXHUwNjZGXFx1MDY3MS1cXHUwNkQ1XFx1MDZFNVxcdTA2RTZcXHUwNkVFXFx1MDZFRlxcdTA2RkEtXFx1MDcwRFxcdTA3MEZcXHUwNzEwXFx1MDcxMi1cXHUwNzJGXFx1MDc0RC1cXHUwN0E1XFx1MDdCMVxcdTA3QzAtXFx1MDdFQVxcdTA3RjRcXHUwN0Y1XFx1MDdGQVxcdTA4MDAtXFx1MDgxNVxcdTA4MUFcXHUwODI0XFx1MDgyOFxcdTA4MzAtXFx1MDgzRVxcdTA4NDAtXFx1MDg1OFxcdTA4NUVcXHUwOEEwLVxcdTA4QjJcXHUyMDBGXFx1MjAyQlxcdTIwMkVcXHUyMDY3XFx1RkIxRFxcdUZCMUYtXFx1RkIyOFxcdUZCMkEtXFx1RkIzNlxcdUZCMzgtXFx1RkIzQ1xcdUZCM0VcXHVGQjQwXFx1RkI0MVxcdUZCNDNcXHVGQjQ0XFx1RkI0Ni1cXHVGQkMxXFx1RkJEMy1cXHVGRDNEXFx1RkQ1MC1cXHVGRDhGXFx1RkQ5Mi1cXHVGREM3XFx1RkRGMC1cXHVGREZDXFx1RkU3MC1cXHVGRTc0XFx1RkU3Ni1cXHVGRUZDXXxcXHVEODAyW1xcdURDMDAtXFx1REMwNVxcdURDMDhcXHVEQzBBLVxcdURDMzVcXHVEQzM3XFx1REMzOFxcdURDM0NcXHVEQzNGLVxcdURDNTVcXHVEQzU3LVxcdURDOUVcXHVEQ0E3LVxcdURDQUZcXHVERDAwLVxcdUREMUJcXHVERDIwLVxcdUREMzlcXHVERDNGXFx1REQ4MC1cXHVEREI3XFx1RERCRVxcdUREQkZcXHVERTAwXFx1REUxMC1cXHVERTEzXFx1REUxNS1cXHVERTE3XFx1REUxOS1cXHVERTMzXFx1REU0MC1cXHVERTQ3XFx1REU1MC1cXHVERTU4XFx1REU2MC1cXHVERTlGXFx1REVDMC1cXHVERUU0XFx1REVFQi1cXHVERUY2XFx1REYwMC1cXHVERjM1XFx1REY0MC1cXHVERjU1XFx1REY1OC1cXHVERjcyXFx1REY3OC1cXHVERjkxXFx1REY5OS1cXHVERjlDXFx1REZBOS1cXHVERkFGXXxcXHVEODAzW1xcdURDMDAtXFx1REM0OF18XFx1RDgzQVtcXHVEQzAwLVxcdURDQzRcXHVEQ0M3LVxcdURDQ0ZdfFxcdUQ4M0JbXFx1REUwMC1cXHVERTAzXFx1REUwNS1cXHVERTFGXFx1REUyMVxcdURFMjJcXHVERTI0XFx1REUyN1xcdURFMjktXFx1REUzMlxcdURFMzQtXFx1REUzN1xcdURFMzlcXHVERTNCXFx1REU0MlxcdURFNDdcXHVERTQ5XFx1REU0QlxcdURFNEQtXFx1REU0RlxcdURFNTFcXHVERTUyXFx1REU1NFxcdURFNTdcXHVERTU5XFx1REU1QlxcdURFNURcXHVERTVGXFx1REU2MVxcdURFNjJcXHVERTY0XFx1REU2Ny1cXHVERTZBXFx1REU2Qy1cXHVERTcyXFx1REU3NC1cXHVERTc3XFx1REU3OS1cXHVERTdDXFx1REU3RVxcdURFODAtXFx1REU4OVxcdURFOEItXFx1REU5QlxcdURFQTEtXFx1REVBM1xcdURFQTUtXFx1REVBOVxcdURFQUItXFx1REVCQl0nO1xuLy8ganNjczplbmFibGUgbWF4aW11bUxpbmVMZW5ndGhcbi8vIGpzaGludCBpZ25vcmU6ZW5kXG4iXX0=
