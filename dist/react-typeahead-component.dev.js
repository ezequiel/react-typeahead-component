var Typeahead =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var doc = global.document,
	    css = __webpack_require__(1),
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
	
	module.exports = __webpack_require__(2);
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = ".react-typeahead-offscreen,.react-typeahead-options,.react-typeahead-usertext{position:absolute}.react-typeahead-usertext{background-color:transparent}.react-typeahead-offscreen{left:-9999px}.react-typeahead-hint{color:silver;-webkit-text-fill-color:silver}.react-typeahead-input{padding:2px;border:1px solid silver}.react-typeahead-container,.react-typeahead-input-container{position:relative}.react-typeahead-hidden{display:none}.react-typeahead-options{width:100%;background:#fff;box-sizing:border-box}";


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var React = __webpack_require__(4),
	    Input = __webpack_require__(5),
	    AriaStatus = __webpack_require__(6),
	    getTextDirection = __webpack_require__(7),
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
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// shim for using process in browser
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            currentQueue[queueIndex].run();
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = React;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var React = __webpack_require__(4);
	
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
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var React = __webpack_require__(4);
	
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
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var RTLCharactersRegExp = __webpack_require__(8),
	    NeutralCharactersRegExp = __webpack_require__(9),
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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// DO NOT EDIT!
	// THIS FILE IS GENERATED!
	
	// All bidi characters found in classes 'R', 'AL', 'RLE', 'RLO', and 'RLI' as per Unicode 7.0.0.
	
	// jshint ignore:start
	// jscs:disable maximumLineLength
	module.exports = '[\u05BE\u05C0\u05C3\u05C6\u05D0-\u05EA\u05F0-\u05F4\u0608\u060B\u060D\u061B\u061C\u061E-\u064A\u066D-\u066F\u0671-\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u070D\u070F\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0830-\u083E\u0840-\u0858\u085E\u08A0-\u08B2\u200F\u202B\u202E\u2067\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBC1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFC\uFE70-\uFE74\uFE76-\uFEFC]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC57-\uDC9E\uDCA7-\uDCAF\uDD00-\uDD1B\uDD20-\uDD39\uDD3F\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE40-\uDE47\uDE50-\uDE58\uDE60-\uDE9F\uDEC0-\uDEE4\uDEEB-\uDEF6\uDF00-\uDF35\uDF40-\uDF55\uDF58-\uDF72\uDF78-\uDF91\uDF99-\uDF9C\uDFA9-\uDFAF]|\uD803[\uDC00-\uDC48]|\uD83A[\uDC00-\uDCC4\uDCC7-\uDCCF]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]';
	// jscs:enable maximumLineLength
	// jshint ignore:end


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// DO NOT EDIT!
	// THIS FILE IS GENERATED!
	
	// All bidi characters except those found in classes 'L' (LTR), 'R' (RTL), and 'AL' (RTL Arabic) as per Unicode 7.0.0.
	
	// jshint ignore:start
	// jscs:disable maximumLineLength
	module.exports = '[\0-@\[-`\{-\xA9\xAB-\xB4\xB6-\xB9\xBB-\xBF\xD7\xF7\u02B9\u02BA\u02C2-\u02CF\u02D2-\u02DF\u02E5-\u02ED\u02EF-\u036F\u0374\u0375\u037E\u0384\u0385\u0387\u03F6\u0483-\u0489\u058A\u058D-\u058F\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0600-\u0607\u0609\u060A\u060C\u060E-\u061A\u064B-\u066C\u0670\u06D6-\u06E4\u06E7-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07F6-\u07F9\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08E4-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u09F2\u09F3\u09FB\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AF1\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0BF3-\u0BFA\u0C00\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C78-\u0C7E\u0C81\u0CBC\u0CCC\u0CCD\u0CE2\u0CE3\u0D01\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E3F\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39-\u0F3D\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1390-\u1399\u1400\u1680\u169B\u169C\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DB\u17DD\u17F0-\u17F9\u1800-\u180E\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1940\u1944\u1945\u19DE-\u19FF\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF5\u1DFC-\u1DFF\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2000-\u200D\u2010-\u2029\u202F-\u2064\u2068\u206A-\u2070\u2074-\u207E\u2080-\u208E\u20A0-\u20BD\u20D0-\u20F0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u2150-\u215F\u2189\u2190-\u2335\u237B-\u2394\u2396-\u23FA\u2400-\u2426\u2440-\u244A\u2460-\u249B\u24EA-\u26AB\u26AD-\u27FF\u2900-\u2B73\u2B76-\u2B95\u2B98-\u2BB9\u2BBD-\u2BC8\u2BCA-\u2BD1\u2CE5-\u2CEA\u2CEF-\u2CF1\u2CF9-\u2CFF\u2D7F\u2DE0-\u2E42\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3000-\u3004\u3008-\u3020\u302A-\u302D\u3030\u3036\u3037\u303D-\u303F\u3099-\u309C\u30A0\u30FB\u31C0-\u31E3\u321D\u321E\u3250-\u325F\u327C-\u327E\u32B1-\u32BF\u32CC-\u32CF\u3377-\u337A\u33DE\u33DF\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA60D-\uA60F\uA66F-\uA67F\uA69F\uA6F0\uA6F1\uA700-\uA721\uA788\uA802\uA806\uA80B\uA825\uA826\uA828-\uA82B\uA838\uA839\uA874-\uA877\uA8C4\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFB29\uFD3E\uFD3F\uFDFD\uFE00-\uFE19\uFE20-\uFE2D\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFEFF\uFF01-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFF9-\uFFFD]|\uD800[\uDD01\uDD40-\uDD8C\uDD90-\uDD9B\uDDA0\uDDFD\uDEE0-\uDEFB\uDF76-\uDF7A]|\uD802[\uDD1F\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6\uDF39-\uDF3F]|\uD803[\uDE60-\uDE7E]|[\uD804\uDB40][\uDC01\uDC38-\uDC46\uDC52-\uDC65\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDE2F-\uDE31\uDE34\uDE36\uDE37\uDEDF\uDEE3-\uDEEA\uDF01\uDF3C\uDF40\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDCB3-\uDCB8\uDCBA\uDCBF\uDCC0\uDCC2\uDCC3\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB5\uDEB7]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF8F-\uDF92]|\uD82F[\uDC9D\uDC9E\uDCA0-\uDCA3]|\uD834[\uDD67-\uDD69\uDD73-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE00-\uDE45\uDF00-\uDF56]|\uD835[\uDEDB\uDF15\uDF4F\uDF89\uDFC3\uDFCE-\uDFFF]|\uD83A[\uDCD0-\uDCD6]|\uD83B[\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD00-\uDD0C\uDD6A\uDD6B\uDF00-\uDF2C\uDF30-\uDF7D\uDF80-\uDFCE\uDFD4-\uDFF7]|\uD83D[\uDC00-\uDCFE\uDD00-\uDD4A\uDD50-\uDD79\uDD7B-\uDDA3\uDDA5-\uDE42\uDE45-\uDECF\uDEE0-\uDEEC\uDEF0-\uDEF3\uDF00-\uDF73\uDF80-\uDFD4]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD]';
	// jscs:enable maximumLineLength
	// jshint ignore:end


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMDU1ODRiYTMxY2YxMDEzZDhjYTAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jc3MvcmVhY3QtdHlwZWFoZWFkLWNvbXBvbmVudC5jc3MuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvdHlwZWFoZWFkLmpzeCIsIndlYnBhY2s6Ly8vLi9+L25vZGUtbGlicy1icm93c2VyL34vcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcIlJlYWN0XCIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvaW5wdXQuanN4Iiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2FyaWFfc3RhdHVzLmpzeCIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvZ2V0X3RleHRfZGlyZWN0aW9uLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlscy9ydGxfY2hhcnNfcmVnZXhwLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlscy9uZXV0cmFsX2NoYXJzX3JlZ2V4cC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7QUNwQkEsaUdBQWdHLGtCQUFrQiwwQkFBMEIsNkJBQTZCLDJCQUEyQixhQUFhLHNCQUFzQixhQUFhLCtCQUErQix1QkFBdUIsWUFBWSx3QkFBd0IsNERBQTRE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IFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgMDU1ODRiYTMxY2YxMDEzZDhjYTBcbiAqKi8iLCJ2YXIgZG9jID0gZ2xvYmFsLmRvY3VtZW50LFxuICAgIGNzcyA9IHJlcXVpcmUoJy4vY3NzL3JlYWN0LXR5cGVhaGVhZC1jb21wb25lbnQuY3NzLmpzJyksXG4gICAgc3R5bGVFbGVtZW50LFxuICAgIGhlYWQ7XG5cbi8vIElmIHRoZSBgZG9jdW1lbnRgIG9iamVjdCBleGlzdHMsIGFzc3VtZSB0aGlzIGlzIGEgYnJvd3Nlci5cbmlmIChkb2MpIHtcbiAgICBzdHlsZUVsZW1lbnQgPSBkb2MuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcblxuICAgIGlmICgndGV4dENvbnRlbnQnIGluIHN0eWxlRWxlbWVudCkge1xuICAgICAgICBzdHlsZUVsZW1lbnQudGV4dENvbnRlbnQgPSBjc3M7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSUUgOFxuICAgICAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICAgIH1cblxuICAgIGhlYWQgPSBkb2MuaGVhZDtcbiAgICBoZWFkLmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIGhlYWQuZmlyc3RDaGlsZCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3R5cGVhaGVhZC5qc3gnKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSAwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiLnJlYWN0LXR5cGVhaGVhZC1vZmZzY3JlZW4sLnJlYWN0LXR5cGVhaGVhZC1vcHRpb25zLC5yZWFjdC10eXBlYWhlYWQtdXNlcnRleHR7cG9zaXRpb246YWJzb2x1dGV9LnJlYWN0LXR5cGVhaGVhZC11c2VydGV4dHtiYWNrZ3JvdW5kLWNvbG9yOnRyYW5zcGFyZW50fS5yZWFjdC10eXBlYWhlYWQtb2Zmc2NyZWVue2xlZnQ6LTk5OTlweH0ucmVhY3QtdHlwZWFoZWFkLWhpbnR7Y29sb3I6c2lsdmVyOy13ZWJraXQtdGV4dC1maWxsLWNvbG9yOnNpbHZlcn0ucmVhY3QtdHlwZWFoZWFkLWlucHV0e3BhZGRpbmc6MnB4O2JvcmRlcjoxcHggc29saWQgc2lsdmVyfS5yZWFjdC10eXBlYWhlYWQtY29udGFpbmVyLC5yZWFjdC10eXBlYWhlYWQtaW5wdXQtY29udGFpbmVye3Bvc2l0aW9uOnJlbGF0aXZlfS5yZWFjdC10eXBlYWhlYWQtaGlkZGVue2Rpc3BsYXk6bm9uZX0ucmVhY3QtdHlwZWFoZWFkLW9wdGlvbnN7d2lkdGg6MTAwJTtiYWNrZ3JvdW5kOiNmZmY7Ym94LXNpemluZzpib3JkZXItYm94fVwiO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jc3MvcmVhY3QtdHlwZWFoZWFkLWNvbXBvbmVudC5jc3MuanNcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JyksXG4gICAgSW5wdXQgPSByZXF1aXJlKCcuL2lucHV0LmpzeCcpLFxuICAgIEFyaWFTdGF0dXMgPSByZXF1aXJlKCcuL2FyaWFfc3RhdHVzLmpzeCcpLFxuICAgIGdldFRleHREaXJlY3Rpb24gPSByZXF1aXJlKCcuLi91dGlscy9nZXRfdGV4dF9kaXJlY3Rpb24nKSxcbiAgICBub29wID0gZnVuY3Rpb24oKSB7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgZGlzcGxheU5hbWU6ICdUeXBlYWhlYWQnLFxuXG4gICAgcHJvcFR5cGVzOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nID8ge30gOiB7XG4gICAgICAgIGlucHV0SWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgYXV0b0ZvY3VzOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgICAgICAgaW5wdXRWYWx1ZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgb3B0aW9uczogUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxuICAgICAgICBwbGFjZWhvbGRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgb25DaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbktleURvd246IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbktleVByZXNzOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25LZXlVcDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uRm9jdXM6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvblNlbGVjdDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uSW5wdXRDbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIGhhbmRsZUhpbnQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbkNvbXBsZXRlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25PcHRpb25DbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uT3B0aW9uQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb3B0aW9uVGVtcGxhdGU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICAgIGdldE1lc3NhZ2VGb3JPcHRpb246IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgICBnZXRNZXNzYWdlRm9ySW5jb21pbmdPcHRpb25zOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xuICAgIH0sXG5cbiAgICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaW5wdXRWYWx1ZTogJycsXG4gICAgICAgICAgICBvcHRpb25zOiBbXSxcbiAgICAgICAgICAgIG9uRm9jdXM6IG5vb3AsXG4gICAgICAgICAgICBvbktleURvd246IG5vb3AsXG4gICAgICAgICAgICBvbkNoYW5nZTogbm9vcCxcbiAgICAgICAgICAgIG9uSW5wdXRDbGljazogbm9vcCxcbiAgICAgICAgICAgIGhhbmRsZUhpbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbk9wdGlvbkNsaWNrOiBub29wLFxuICAgICAgICAgICAgb25PcHRpb25DaGFuZ2U6IG5vb3AsXG4gICAgICAgICAgICBvbkNvbXBsZXRlOiAgbm9vcCxcbiAgICAgICAgICAgIGdldE1lc3NhZ2VGb3JPcHRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRNZXNzYWdlRm9ySW5jb21pbmdPcHRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgIH0sXG5cbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2VsZWN0ZWRJbmRleDogLTEsXG4gICAgICAgICAgICBpc0hpbnRWaXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGlzRHJvcGRvd25WaXNpYmxlOiBmYWxzZVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgICAgdW5pcXVlSWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgICAgICBfdGhpcy51c2VySW5wdXRWYWx1ZSA9IG51bGw7XG4gICAgICAgIF90aGlzLnByZXZpb3VzSW5wdXRWYWx1ZSA9IG51bGw7XG4gICAgICAgIF90aGlzLmFjdGl2ZURlc2NlbmRhbnRJZCA9ICdyZWFjdC10eXBlYWhlYWQtYWN0aXZlZGVzY2VuZGFudC0nICsgdW5pcXVlSWQ7XG4gICAgICAgIF90aGlzLm9wdGlvbnNJZCA9ICdyZWFjdC10eXBlYWhlYWQtb3B0aW9ucy0nICsgdW5pcXVlSWQ7XG4gICAgfSxcblxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFkZEV2ZW50ID0gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIsXG4gICAgICAgICAgICBoYW5kbGVXaW5kb3dDbG9zZSA9IHRoaXMuaGFuZGxlV2luZG93Q2xvc2U7XG5cbiAgICAgICAgLy8gVGhlIGBmb2N1c2AgZXZlbnQgZG9lcyBub3QgYnViYmxlLCBzbyB3ZSBtdXN0IGNhcHR1cmUgaXQgaW5zdGVhZC5cbiAgICAgICAgLy8gVGhpcyBjbG9zZXMgVHlwZWFoZWFkJ3MgZHJvcGRvd24gd2hlbmV2ZXIgc29tZXRoaW5nIGVsc2UgZ2FpbnMgZm9jdXMuXG4gICAgICAgIGFkZEV2ZW50KCdmb2N1cycsIGhhbmRsZVdpbmRvd0Nsb3NlLCB0cnVlKTtcblxuICAgICAgICAvLyBJZiB3ZSBjbGljayBhbnl3aGVyZSBvdXRzaWRlIG9mIFR5cGVhaGVhZCwgY2xvc2UgdGhlIGRyb3Bkb3duLlxuICAgICAgICBhZGRFdmVudCgnY2xpY2snLCBoYW5kbGVXaW5kb3dDbG9zZSwgZmFsc2UpO1xuICAgIH0sXG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZW1vdmVFdmVudCA9IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyLFxuICAgICAgICAgICAgaGFuZGxlV2luZG93Q2xvc2UgPSB0aGlzLmhhbmRsZVdpbmRvd0Nsb3NlO1xuXG4gICAgICAgIHJlbW92ZUV2ZW50KCdmb2N1cycsIGhhbmRsZVdpbmRvd0Nsb3NlLCB0cnVlKTtcbiAgICAgICAgcmVtb3ZlRXZlbnQoJ2NsaWNrJywgaGFuZGxlV2luZG93Q2xvc2UsIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzKSB7XG4gICAgICAgIHZhciBuZXh0VmFsdWUgPSBuZXh0UHJvcHMuaW5wdXRWYWx1ZSxcbiAgICAgICAgICAgIG5leHRPcHRpb25zID0gbmV4dFByb3BzLm9wdGlvbnMsXG4gICAgICAgICAgICB2YWx1ZUxlbmd0aCA9IG5leHRWYWx1ZS5sZW5ndGgsXG4gICAgICAgICAgICBpc0hpbnRWaXNpYmxlID0gdmFsdWVMZW5ndGggPiAwICYmXG4gICAgICAgICAgICAgICAgLy8gQSB2aXNpYmxlIHBhcnQgb2YgdGhlIGhpbnQgbXVzdCBiZVxuICAgICAgICAgICAgICAgIC8vIGF2YWlsYWJsZSBmb3IgdXMgdG8gY29tcGxldGUgaXQuXG4gICAgICAgICAgICAgICAgbmV4dFByb3BzLmhhbmRsZUhpbnQobmV4dFZhbHVlLCBuZXh0T3B0aW9ucykuc2xpY2UodmFsdWVMZW5ndGgpLmxlbmd0aCA+IDA7XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpc0hpbnRWaXNpYmxlOiBpc0hpbnRWaXNpYmxlXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17J3JlYWN0LXR5cGVhaGVhZC1jb250YWluZXIgJyArIF90aGlzLnByb3BzLmNsYXNzTmFtZX0+XG4gICAgICAgICAgICAgICAge190aGlzLnJlbmRlcklucHV0KCl9XG4gICAgICAgICAgICAgICAge190aGlzLnJlbmRlckRyb3Bkb3duKCl9XG4gICAgICAgICAgICAgICAge190aGlzLnJlbmRlckFyaWFNZXNzYWdlRm9yT3B0aW9ucygpfVxuICAgICAgICAgICAgICAgIHtfdGhpcy5yZW5kZXJBcmlhTWVzc2FnZUZvckluY29taW5nT3B0aW9ucygpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIHJlbmRlcklucHV0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIHN0YXRlID0gX3RoaXMuc3RhdGUsXG4gICAgICAgICAgICBwcm9wcyA9IF90aGlzLnByb3BzLFxuICAgICAgICAgICAgaW5wdXRWYWx1ZSA9IHByb3BzLmlucHV0VmFsdWUsXG4gICAgICAgICAgICBjbGFzc05hbWUgPSAncmVhY3QtdHlwZWFoZWFkLWlucHV0JyxcbiAgICAgICAgICAgIGlucHV0RGlyZWN0aW9uID0gZ2V0VGV4dERpcmVjdGlvbihpbnB1dFZhbHVlKTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3JlYWN0LXR5cGVhaGVhZC1pbnB1dC1jb250YWluZXInPlxuICAgICAgICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgICAgICAgICByZWY9J2lucHV0J1xuICAgICAgICAgICAgICAgICAgICByb2xlPSdjb21ib2JveCdcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1vd25zPXtfdGhpcy5vcHRpb25zSWR9XG4gICAgICAgICAgICAgICAgICAgIGFyaWEtZXhwYW5kZWQ9e3N0YXRlLmlzRHJvcGRvd25WaXNpYmxlfVxuICAgICAgICAgICAgICAgICAgICBhcmlhLWF1dG9jb21wbGV0ZT0nYm90aCdcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1hY3RpdmVkZXNjZW5kYW50PXtfdGhpcy5hY3RpdmVEZXNjZW5kYW50SWR9XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpbnB1dFZhbHVlfVxuICAgICAgICAgICAgICAgICAgICBzcGVsbENoZWNrPXtmYWxzZX1cbiAgICAgICAgICAgICAgICAgICAgYXV0b0NvbXBsZXRlPXtmYWxzZX1cbiAgICAgICAgICAgICAgICAgICAgYXV0b0NvcnJlY3Q9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICBkaXI9e2lucHV0RGlyZWN0aW9ufVxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtfdGhpcy5oYW5kbGVDbGlja31cbiAgICAgICAgICAgICAgICAgICAgb25Gb2N1cz17X3RoaXMuaGFuZGxlRm9jdXN9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtfdGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICAgICAgICAgIG9uS2V5RG93bj17X3RoaXMuaGFuZGxlS2V5RG93bn1cbiAgICAgICAgICAgICAgICAgICAgaWQ9e3Byb3BzLmlucHV0SWR9XG4gICAgICAgICAgICAgICAgICAgIGF1dG9Gb2N1cz17cHJvcHMuYXV0b0ZvY3VzfVxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17cHJvcHMucGxhY2Vob2xkZXJ9XG4gICAgICAgICAgICAgICAgICAgIG9uU2VsZWN0PXtwcm9wcy5vblNlbGVjdH1cbiAgICAgICAgICAgICAgICAgICAgb25LZXlVcD17cHJvcHMub25LZXlVcH1cbiAgICAgICAgICAgICAgICAgICAgb25LZXlQcmVzcz17cHJvcHMub25LZXlQcmVzc31cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWUgKyAnIHJlYWN0LXR5cGVhaGVhZC11c2VydGV4dCd9XG4gICAgICAgICAgICAgICAgLz5cblxuICAgICAgICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICAgcm9sZT0ncHJlc2VudGF0aW9uJ1xuICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICAgZGlyPXtpbnB1dERpcmVjdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWUgKyAnIHJlYWN0LXR5cGVhaGVhZC1oaW50J31cbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3N0YXRlLmlzSGludFZpc2libGUgPyBwcm9wcy5oYW5kbGVIaW50KGlucHV0VmFsdWUsIHByb3BzLm9wdGlvbnMpIDogbnVsbH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIHJlbmRlckRyb3Bkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIHN0YXRlID0gX3RoaXMuc3RhdGUsXG4gICAgICAgICAgICBwcm9wcyA9IF90aGlzLnByb3BzLFxuICAgICAgICAgICAgT3B0aW9uVGVtcGxhdGUgPSBwcm9wcy5vcHRpb25UZW1wbGF0ZSxcbiAgICAgICAgICAgIHNlbGVjdGVkSW5kZXggPSBzdGF0ZS5zZWxlY3RlZEluZGV4LFxuICAgICAgICAgICAgaXNEcm9wZG93blZpc2libGUgPSBzdGF0ZS5pc0Ryb3Bkb3duVmlzaWJsZSxcbiAgICAgICAgICAgIGFjdGl2ZURlc2NlbmRhbnRJZCA9IF90aGlzLmFjdGl2ZURlc2NlbmRhbnRJZDtcblxuICAgICAgICBpZiAodGhpcy5wcm9wcy5vcHRpb25zLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDx1bCBpZD17X3RoaXMub3B0aW9uc0lkfVxuICAgICAgICAgICAgICAgIHJvbGU9J2xpc3Rib3gnXG4gICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49eyFpc0Ryb3Bkb3duVmlzaWJsZX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e1xuICAgICAgICAgICAgICAgICAgICAncmVhY3QtdHlwZWFoZWFkLW9wdGlvbnMnICsgKCFpc0Ryb3Bkb3duVmlzaWJsZSA/ICcgcmVhY3QtdHlwZWFoZWFkLWhpZGRlbicgOiAnJylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb25Nb3VzZU91dD17dGhpcy5oYW5kbGVNb3VzZU91dH0+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBwcm9wcy5vcHRpb25zLm1hcChmdW5jdGlvbihkYXRhLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlzU2VsZWN0ZWQgPSBzZWxlY3RlZEluZGV4ID09PSBpbmRleDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGkgaWQ9e2lzU2VsZWN0ZWQgPyBhY3RpdmVEZXNjZW5kYW50SWQgOiBudWxsfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb2xlPSdvcHRpb24nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e190aGlzLmhhbmRsZU9wdGlvbkNsaWNrLmJpbmQoX3RoaXMsIGluZGV4KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Nb3VzZU92ZXI9e190aGlzLmhhbmRsZU9wdGlvbk1vdXNlT3Zlci5iaW5kKF90aGlzLCBpbmRleCl9PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxPcHRpb25UZW1wbGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YT17ZGF0YX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4PXtpbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJbnB1dFZhbHVlPXtfdGhpcy51c2VySW5wdXRWYWx1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0VmFsdWU9e3Byb3BzLmlucHV0VmFsdWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1NlbGVjdGVkPXtpc1NlbGVjdGVkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIHJlbmRlckFyaWFNZXNzYWdlRm9yT3B0aW9uczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgICBwcm9wcyA9IF90aGlzLnByb3BzLFxuICAgICAgICAgICAgb3B0aW9uID0gcHJvcHMub3B0aW9uc1tfdGhpcy5zdGF0ZS5zZWxlY3RlZEluZGV4XSB8fCBwcm9wcy5pbnB1dFZhbHVlO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8QXJpYVN0YXR1c1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U9e3Byb3BzLmdldE1lc3NhZ2VGb3JPcHRpb24ob3B0aW9uKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIHJlbmRlckFyaWFNZXNzYWdlRm9ySW5jb21pbmdPcHRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxBcmlhU3RhdHVzXG4gICAgICAgICAgICAgICAgbWVzc2FnZT17dGhpcy5wcm9wcy5nZXRNZXNzYWdlRm9ySW5jb21pbmdPcHRpb25zKCl9XG4gICAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICBzaG93RHJvcGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlzRHJvcGRvd25WaXNpYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBoaWRlRHJvcGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlzRHJvcGRvd25WaXNpYmxlOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2hvd0hpbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgICAgcHJvcHMgPSBfdGhpcy5wcm9wcyxcbiAgICAgICAgICAgIGlucHV0VmFsdWUgPSBwcm9wcy5pbnB1dFZhbHVlLFxuICAgICAgICAgICAgaW5wdXRWYWx1ZUxlbmd0aCA9IGlucHV0VmFsdWUubGVuZ3RoLFxuICAgICAgICAgICAgaXNIaW50VmlzaWJsZSA9IGlucHV0VmFsdWVMZW5ndGggPiAwICYmXG4gICAgICAgICAgICAgICAgLy8gQSB2aXNpYmxlIHBhcnQgb2YgdGhlIGhpbnQgbXVzdCBiZVxuICAgICAgICAgICAgICAgIC8vIGF2YWlsYWJsZSBmb3IgdXMgdG8gY29tcGxldGUgaXQuXG4gICAgICAgICAgICAgICAgcHJvcHMuaGFuZGxlSGludChpbnB1dFZhbHVlLCBwcm9wcy5vcHRpb25zKS5zbGljZShpbnB1dFZhbHVlTGVuZ3RoKS5sZW5ndGggPiAwO1xuXG4gICAgICAgIF90aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlzSGludFZpc2libGU6IGlzSGludFZpc2libGVcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGhpZGVIaW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpc0hpbnRWaXNpYmxlOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2V0U2VsZWN0ZWRJbmRleDogZnVuY3Rpb24oaW5kZXgsIGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgc2VsZWN0ZWRJbmRleDogaW5kZXhcbiAgICAgICAgfSwgY2FsbGJhY2spO1xuICAgIH0sXG5cbiAgICBoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgX3RoaXMuc2hvd0hpbnQoKTtcbiAgICAgICAgX3RoaXMuc2hvd0Ryb3Bkb3duKCk7XG4gICAgICAgIF90aGlzLnNldFNlbGVjdGVkSW5kZXgoLTEpO1xuICAgICAgICBfdGhpcy5wcm9wcy5vbkNoYW5nZShldmVudCk7XG4gICAgICAgIF90aGlzLnVzZXJJbnB1dFZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIH0sXG5cbiAgICBoYW5kbGVGb2N1czogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICBfdGhpcy5zaG93RHJvcGRvd24oKTtcbiAgICAgICAgX3RoaXMucHJvcHMub25Gb2N1cyhldmVudCk7XG4gICAgfSxcblxuICAgIGhhbmRsZUNsaWNrOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIF90aGlzLnNob3dIaW50KCk7XG4gICAgICAgIF90aGlzLnByb3BzLm9uSW5wdXRDbGljayhldmVudCk7XG4gICAgfSxcblxuICAgIG5hdmlnYXRlOiBmdW5jdGlvbihkaXJlY3Rpb24sIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgICBtaW5JbmRleCA9IC0xLFxuICAgICAgICAgICAgbWF4SW5kZXggPSBfdGhpcy5wcm9wcy5vcHRpb25zLmxlbmd0aCAtIDEsXG4gICAgICAgICAgICBpbmRleCA9IF90aGlzLnN0YXRlLnNlbGVjdGVkSW5kZXggKyBkaXJlY3Rpb247XG5cbiAgICAgICAgaWYgKGluZGV4ID4gbWF4SW5kZXgpIHtcbiAgICAgICAgICAgIGluZGV4ID0gbWluSW5kZXg7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5kZXggPCBtaW5JbmRleCkge1xuICAgICAgICAgICAgaW5kZXggPSBtYXhJbmRleDtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzLnNldFNlbGVjdGVkSW5kZXgoaW5kZXgsIGNhbGxiYWNrKTtcbiAgICB9LFxuXG4gICAgaGFuZGxlS2V5RG93bjogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIGtleSA9IGV2ZW50LmtleSxcbiAgICAgICAgICAgIHByb3BzID0gX3RoaXMucHJvcHMsXG4gICAgICAgICAgICBpbnB1dCA9IF90aGlzLnJlZnMuaW5wdXQsXG4gICAgICAgICAgICBpc0Ryb3Bkb3duVmlzaWJsZSA9IF90aGlzLnN0YXRlLmlzRHJvcGRvd25WaXNpYmxlLFxuICAgICAgICAgICAgaXNIaW50VmlzaWJsZSA9IF90aGlzLnN0YXRlLmlzSGludFZpc2libGUsXG4gICAgICAgICAgICBoYXNIYW5kbGVkS2V5RG93biA9IGZhbHNlLFxuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICBvcHRpb25EYXRhLFxuICAgICAgICAgICAgZGlyO1xuXG4gICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgIGNhc2UgJ0VuZCc6XG4gICAgICAgIGNhc2UgJ1RhYic6XG4gICAgICAgICAgICBpZiAoaXNIaW50VmlzaWJsZSAmJiAhZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHByb3BzLm9uQ29tcGxldGUoZXZlbnQsIHByb3BzLmhhbmRsZUhpbnQocHJvcHMuaW5wdXRWYWx1ZSwgcHJvcHMub3B0aW9ucykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6XG4gICAgICAgIGNhc2UgJ0Fycm93UmlnaHQnOlxuICAgICAgICAgICAgaWYgKGlzSGludFZpc2libGUgJiYgIWV2ZW50LnNoaWZ0S2V5ICYmIGlucHV0LmlzQ3Vyc29yQXRFbmQoKSkge1xuICAgICAgICAgICAgICAgIGRpciA9IGdldFRleHREaXJlY3Rpb24ocHJvcHMuaW5wdXRWYWx1ZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoKGRpciA9PT0gJ2x0cicgJiYga2V5ID09PSAnQXJyb3dSaWdodCcpIHx8IChkaXIgPT09ICdydGwnICYmIGtleSA9PT0gJ0Fycm93TGVmdCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BzLm9uQ29tcGxldGUoZXZlbnQsIHByb3BzLmhhbmRsZUhpbnQocHJvcHMuaW5wdXRWYWx1ZSwgcHJvcHMub3B0aW9ucykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdFbnRlcic6XG4gICAgICAgICAgICBpbnB1dC5ibHVyKCk7XG4gICAgICAgICAgICBfdGhpcy5oaWRlSGludCgpO1xuICAgICAgICAgICAgX3RoaXMuaGlkZURyb3Bkb3duKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnRXNjYXBlJzpcbiAgICAgICAgICAgIF90aGlzLmhpZGVIaW50KCk7XG4gICAgICAgICAgICBfdGhpcy5oaWRlRHJvcGRvd24oKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdBcnJvd1VwJzpcbiAgICAgICAgY2FzZSAnQXJyb3dEb3duJzpcbiAgICAgICAgICAgIGlmIChwcm9wcy5vcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgX3RoaXMuc2hvd0hpbnQoKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5zaG93RHJvcGRvd24oKTtcblxuICAgICAgICAgICAgICAgIGlmIChpc0Ryb3Bkb3duVmlzaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICBkaXIgPSBrZXkgPT09ICdBcnJvd1VwJyA/IC0xOiAxO1xuICAgICAgICAgICAgICAgICAgICBoYXNIYW5kbGVkS2V5RG93biA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubmF2aWdhdGUoZGlyLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZEluZGV4ID0gX3RoaXMuc3RhdGUuc2VsZWN0ZWRJbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2aW91c0lucHV0VmFsdWUgPSBfdGhpcy5wcmV2aW91c0lucHV0VmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uRGF0YSA9IHByZXZpb3VzSW5wdXRWYWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UncmUgY3VycmVudGx5IG9uIGFuIG9wdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTYXZlIHRoZSBjdXJyZW50IGBpbnB1dGAgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXMgd2UgbWlnaHQgYXJyb3cgYmFjayB0byBpdCBsYXRlci5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldmlvdXNJbnB1dFZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnByZXZpb3VzSW5wdXRWYWx1ZSA9IHByb3BzLmlucHV0VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uRGF0YSA9IHByb3BzLm9wdGlvbnNbc2VsZWN0ZWRJbmRleF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzLm9uT3B0aW9uQ2hhbmdlKGV2ZW50LCBvcHRpb25EYXRhLCBzZWxlY3RlZEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzLm9uS2V5RG93bihldmVudCwgb3B0aW9uRGF0YSwgc2VsZWN0ZWRJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWhhc0hhbmRsZWRLZXlEb3duKSB7XG4gICAgICAgICAgICBpbmRleCA9IHRoaXMuc3RhdGUuc2VsZWN0ZWRJbmRleDtcbiAgICAgICAgICAgIG9wdGlvbkRhdGEgPSBpbmRleCA8IDAgPyBwcm9wcy5pbnB1dFZhbHVlIDogcHJvcHMub3B0aW9uc1tpbmRleF07XG4gICAgICAgICAgICBwcm9wcy5vbktleURvd24oZXZlbnQsIG9wdGlvbkRhdGEsIGluZGV4KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBoYW5kbGVPcHRpb25DbGljazogZnVuY3Rpb24oc2VsZWN0ZWRJbmRleCwgZXZlbnQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIHByb3BzID0gX3RoaXMucHJvcHM7XG5cbiAgICAgICAgX3RoaXMuaGlkZUhpbnQoKTtcbiAgICAgICAgX3RoaXMuaGlkZURyb3Bkb3duKCk7XG4gICAgICAgIF90aGlzLnNldFNlbGVjdGVkSW5kZXgoc2VsZWN0ZWRJbmRleCk7XG4gICAgICAgIHByb3BzLm9uT3B0aW9uQ2xpY2soZXZlbnQsIHByb3BzLm9wdGlvbnNbc2VsZWN0ZWRJbmRleF0sIHNlbGVjdGVkSW5kZXgpO1xuICAgIH0sXG5cbiAgICBoYW5kbGVPcHRpb25Nb3VzZU92ZXI6IGZ1bmN0aW9uKHNlbGVjdGVkSW5kZXgpIHtcbiAgICAgICAgdGhpcy5zZXRTZWxlY3RlZEluZGV4KHNlbGVjdGVkSW5kZXgpO1xuICAgIH0sXG5cbiAgICBoYW5kbGVNb3VzZU91dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRJbmRleCgtMSk7XG4gICAgfSxcblxuICAgIGhhbmRsZVdpbmRvd0Nsb3NlOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIGlmICghUmVhY3QuZmluZERPTU5vZGUodGhpcykuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgICAgICAgX3RoaXMuaGlkZUhpbnQoKTtcbiAgICAgICAgICAgIF90aGlzLmhpZGVEcm9wZG93bigpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jb21wb25lbnRzL3R5cGVhaGVhZC5qc3hcbiAqKi8iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L25vZGUtbGlicy1icm93c2VyL34vcHJvY2Vzcy9icm93c2VyLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBSZWFjdDtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwiUmVhY3RcIlxuICoqIG1vZHVsZSBpZCA9IDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgZGlzcGxheU5hbWU6ICdJbnB1dCcsXG5cbiAgICBwcm9wVHlwZXM6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicgPyB7fSA6IHtcbiAgICAgICAgdmFsdWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIG9uQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xuICAgIH0sXG5cbiAgICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6ICcnLFxuICAgICAgICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uKCkge31cbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgY29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIGRpciA9IF90aGlzLnByb3BzLmRpcjtcblxuICAgICAgICBpZiAoZGlyID09PSBudWxsIHx8IGRpciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBXaGVuIHNldHRpbmcgYW4gYXR0cmlidXRlIHRvIG51bGwvdW5kZWZpbmVkLFxuICAgICAgICAgICAgLy8gUmVhY3QgaW5zdGVhZCBzZXRzIHRoZSBhdHRyaWJ1dGUgdG8gYW4gZW1wdHkgc3RyaW5nLlxuXG4gICAgICAgICAgICAvLyBUaGlzIGlzIG5vdCBkZXNpcmVkIGJlY2F1c2Ugb2YgYSBwb3NzaWJsZSBidWcgaW4gQ2hyb21lLlxuICAgICAgICAgICAgLy8gSWYgdGhlIHBhZ2UgaXMgUlRMLCBhbmQgdGhlIGlucHV0J3MgYGRpcmAgYXR0cmlidXRlIGlzIHNldFxuICAgICAgICAgICAgLy8gdG8gYW4gZW1wdHkgc3RyaW5nLCBDaHJvbWUgYXNzdW1lcyBMVFIsIHdoaWNoIGlzbid0IHdoYXQgd2Ugd2FudC5cbiAgICAgICAgICAgIFJlYWN0LmZpbmRET01Ob2RlKF90aGlzKS5yZW1vdmVBdHRyaWJ1dGUoJ2RpcicpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIHsuLi5fdGhpcy5wcm9wc31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17X3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgaGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgcHJvcHMgPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIC8vIFRoZXJlIGFyZSBzZXZlcmFsIFJlYWN0IGJ1Z3MgaW4gSUUsXG4gICAgICAgIC8vIHdoZXJlIHRoZSBgaW5wdXRgJ3MgYG9uQ2hhbmdlYCBldmVudCBpc1xuICAgICAgICAvLyBmaXJlZCBldmVuIHdoZW4gdGhlIHZhbHVlIGRpZG4ndCBjaGFuZ2UuXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9pc3N1ZXMvMjE4NVxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvaXNzdWVzLzMzNzdcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC52YWx1ZSAhPT0gcHJvcHMudmFsdWUpIHtcbiAgICAgICAgICAgIHByb3BzLm9uQ2hhbmdlKGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBibHVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgUmVhY3QuZmluZERPTU5vZGUodGhpcykuYmx1cigpO1xuICAgIH0sXG5cbiAgICBpc0N1cnNvckF0RW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIGlucHV0RE9NTm9kZSA9IFJlYWN0LmZpbmRET01Ob2RlKF90aGlzKSxcbiAgICAgICAgICAgIHZhbHVlTGVuZ3RoID0gX3RoaXMucHJvcHMudmFsdWUubGVuZ3RoO1xuXG4gICAgICAgIHJldHVybiBpbnB1dERPTU5vZGUuc2VsZWN0aW9uU3RhcnQgPT09IHZhbHVlTGVuZ3RoICYmXG4gICAgICAgICAgICAgICBpbnB1dERPTU5vZGUuc2VsZWN0aW9uRW5kID09PSB2YWx1ZUxlbmd0aDtcbiAgICB9XG59KTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NvbXBvbmVudHMvaW5wdXQuanN4XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ0FyaWEgU3RhdHVzJyxcblxuICAgIHByb3BUeXBlczogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyA/IHt9IDoge1xuICAgICAgICBtZXNzYWdlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gICAgfSxcblxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAvLyBUaGlzIGlzIG5lZWRlZCBhcyBgY29tcG9uZW50RGlkVXBkYXRlYFxuICAgICAgICAvLyBkb2VzIG5vdCBmaXJlIG9uIHRoZSBpbml0aWFsIHJlbmRlci5cbiAgICAgICAgX3RoaXMuc2V0VGV4dENvbnRlbnQoX3RoaXMucHJvcHMubWVzc2FnZSk7XG4gICAgfSxcblxuICAgIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgX3RoaXMuc2V0VGV4dENvbnRlbnQoX3RoaXMucHJvcHMubWVzc2FnZSk7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgIHJvbGU9J3N0YXR1cydcbiAgICAgICAgICAgICAgICBhcmlhLWxpdmU9J3BvbGl0ZSdcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9J3JlYWN0LXR5cGVhaGVhZC1vZmZzY3JlZW4nXG4gICAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICAvLyBXZSBjYW5ub3Qgc2V0IGB0ZXh0Q29udGVudGAgZGlyZWN0bHkgaW4gYHJlbmRlcmAsXG4gICAgLy8gYmVjYXVzZSBSZWFjdCBhZGRzL2RlbGV0ZXMgdGV4dCBub2RlcyB3aGVuIHJlbmRlcmluZyxcbiAgICAvLyB3aGljaCBjb25mdXNlcyBzY3JlZW4gcmVhZGVycyBhbmQgZG9lc24ndCBjYXVzZSB0aGVtIHRvIHJlYWQgY2hhbmdlcy5cbiAgICBzZXRUZXh0Q29udGVudDogZnVuY3Rpb24odGV4dENvbnRlbnQpIHtcbiAgICAgICAgLy8gV2UgY291bGQgc2V0IGBpbm5lckhUTUxgLCBidXQgaXQncyBiZXR0ZXIgdG8gYXZvaWQgaXQuXG4gICAgICAgIHRoaXMuZ2V0RE9NTm9kZSgpLnRleHRDb250ZW50ID0gdGV4dENvbnRlbnQgfHwgJyc7XG4gICAgfVxufSk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jb21wb25lbnRzL2FyaWFfc3RhdHVzLmpzeFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxudmFyIFJUTENoYXJhY3RlcnNSZWdFeHAgPSByZXF1aXJlKCcuL3J0bF9jaGFyc19yZWdleHAnKSxcbiAgICBOZXV0cmFsQ2hhcmFjdGVyc1JlZ0V4cCA9IHJlcXVpcmUoJy4vbmV1dHJhbF9jaGFyc19yZWdleHAnKSxcbiAgICBzdGFydHNXaXRoUlRMID0gbmV3IFJlZ0V4cCgnXig/OicgKyBOZXV0cmFsQ2hhcmFjdGVyc1JlZ0V4cCArICcpKig/OicgKyBSVExDaGFyYWN0ZXJzUmVnRXhwICsgJyknKSxcbiAgICBuZXV0cmFsVGV4dCA9IG5ldyBSZWdFeHAoJ14oPzonICsgTmV1dHJhbENoYXJhY3RlcnNSZWdFeHAgKyAnKSokJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHZhciBkaXIgPSAnbHRyJztcblxuICAgIGlmIChzdGFydHNXaXRoUlRMLnRlc3QodGV4dCkpIHtcbiAgICAgICAgZGlyID0gJ3J0bCc7XG4gICAgfSBlbHNlIGlmIChuZXV0cmFsVGV4dC50ZXN0KHRleHQpKSB7XG4gICAgICAgIGRpciA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpcjtcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3V0aWxzL2dldF90ZXh0X2RpcmVjdGlvbi5qc1xuICoqIG1vZHVsZSBpZCA9IDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8vIERPIE5PVCBFRElUIVxuLy8gVEhJUyBGSUxFIElTIEdFTkVSQVRFRCFcblxuLy8gQWxsIGJpZGkgY2hhcmFjdGVycyBmb3VuZCBpbiBjbGFzc2VzICdSJywgJ0FMJywgJ1JMRScsICdSTE8nLCBhbmQgJ1JMSScgYXMgcGVyIFVuaWNvZGUgNy4wLjAuXG5cbi8vIGpzaGludCBpZ25vcmU6c3RhcnRcbi8vIGpzY3M6ZGlzYWJsZSBtYXhpbXVtTGluZUxlbmd0aFxubW9kdWxlLmV4cG9ydHMgPSAnW1xcdTA1QkVcXHUwNUMwXFx1MDVDM1xcdTA1QzZcXHUwNUQwLVxcdTA1RUFcXHUwNUYwLVxcdTA1RjRcXHUwNjA4XFx1MDYwQlxcdTA2MERcXHUwNjFCXFx1MDYxQ1xcdTA2MUUtXFx1MDY0QVxcdTA2NkQtXFx1MDY2RlxcdTA2NzEtXFx1MDZENVxcdTA2RTVcXHUwNkU2XFx1MDZFRVxcdTA2RUZcXHUwNkZBLVxcdTA3MERcXHUwNzBGXFx1MDcxMFxcdTA3MTItXFx1MDcyRlxcdTA3NEQtXFx1MDdBNVxcdTA3QjFcXHUwN0MwLVxcdTA3RUFcXHUwN0Y0XFx1MDdGNVxcdTA3RkFcXHUwODAwLVxcdTA4MTVcXHUwODFBXFx1MDgyNFxcdTA4MjhcXHUwODMwLVxcdTA4M0VcXHUwODQwLVxcdTA4NThcXHUwODVFXFx1MDhBMC1cXHUwOEIyXFx1MjAwRlxcdTIwMkJcXHUyMDJFXFx1MjA2N1xcdUZCMURcXHVGQjFGLVxcdUZCMjhcXHVGQjJBLVxcdUZCMzZcXHVGQjM4LVxcdUZCM0NcXHVGQjNFXFx1RkI0MFxcdUZCNDFcXHVGQjQzXFx1RkI0NFxcdUZCNDYtXFx1RkJDMVxcdUZCRDMtXFx1RkQzRFxcdUZENTAtXFx1RkQ4RlxcdUZEOTItXFx1RkRDN1xcdUZERjAtXFx1RkRGQ1xcdUZFNzAtXFx1RkU3NFxcdUZFNzYtXFx1RkVGQ118XFx1RDgwMltcXHVEQzAwLVxcdURDMDVcXHVEQzA4XFx1REMwQS1cXHVEQzM1XFx1REMzN1xcdURDMzhcXHVEQzNDXFx1REMzRi1cXHVEQzU1XFx1REM1Ny1cXHVEQzlFXFx1RENBNy1cXHVEQ0FGXFx1REQwMC1cXHVERDFCXFx1REQyMC1cXHVERDM5XFx1REQzRlxcdUREODAtXFx1RERCN1xcdUREQkVcXHVEREJGXFx1REUwMFxcdURFMTAtXFx1REUxM1xcdURFMTUtXFx1REUxN1xcdURFMTktXFx1REUzM1xcdURFNDAtXFx1REU0N1xcdURFNTAtXFx1REU1OFxcdURFNjAtXFx1REU5RlxcdURFQzAtXFx1REVFNFxcdURFRUItXFx1REVGNlxcdURGMDAtXFx1REYzNVxcdURGNDAtXFx1REY1NVxcdURGNTgtXFx1REY3MlxcdURGNzgtXFx1REY5MVxcdURGOTktXFx1REY5Q1xcdURGQTktXFx1REZBRl18XFx1RDgwM1tcXHVEQzAwLVxcdURDNDhdfFxcdUQ4M0FbXFx1REMwMC1cXHVEQ0M0XFx1RENDNy1cXHVEQ0NGXXxcXHVEODNCW1xcdURFMDAtXFx1REUwM1xcdURFMDUtXFx1REUxRlxcdURFMjFcXHVERTIyXFx1REUyNFxcdURFMjdcXHVERTI5LVxcdURFMzJcXHVERTM0LVxcdURFMzdcXHVERTM5XFx1REUzQlxcdURFNDJcXHVERTQ3XFx1REU0OVxcdURFNEJcXHVERTRELVxcdURFNEZcXHVERTUxXFx1REU1MlxcdURFNTRcXHVERTU3XFx1REU1OVxcdURFNUJcXHVERTVEXFx1REU1RlxcdURFNjFcXHVERTYyXFx1REU2NFxcdURFNjctXFx1REU2QVxcdURFNkMtXFx1REU3MlxcdURFNzQtXFx1REU3N1xcdURFNzktXFx1REU3Q1xcdURFN0VcXHVERTgwLVxcdURFODlcXHVERThCLVxcdURFOUJcXHVERUExLVxcdURFQTNcXHVERUE1LVxcdURFQTlcXHVERUFCLVxcdURFQkJdJztcbi8vIGpzY3M6ZW5hYmxlIG1heGltdW1MaW5lTGVuZ3RoXG4vLyBqc2hpbnQgaWdub3JlOmVuZFxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy91dGlscy9ydGxfY2hhcnNfcmVnZXhwLmpzXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLy8gRE8gTk9UIEVESVQhXG4vLyBUSElTIEZJTEUgSVMgR0VORVJBVEVEIVxuXG4vLyBBbGwgYmlkaSBjaGFyYWN0ZXJzIGV4Y2VwdCB0aG9zZSBmb3VuZCBpbiBjbGFzc2VzICdMJyAoTFRSKSwgJ1InIChSVEwpLCBhbmQgJ0FMJyAoUlRMIEFyYWJpYykgYXMgcGVyIFVuaWNvZGUgNy4wLjAuXG5cbi8vIGpzaGludCBpZ25vcmU6c3RhcnRcbi8vIGpzY3M6ZGlzYWJsZSBtYXhpbXVtTGluZUxlbmd0aFxubW9kdWxlLmV4cG9ydHMgPSAnW1xcMC1AXFxbLWBcXHstXFx4QTlcXHhBQi1cXHhCNFxceEI2LVxceEI5XFx4QkItXFx4QkZcXHhEN1xceEY3XFx1MDJCOVxcdTAyQkFcXHUwMkMyLVxcdTAyQ0ZcXHUwMkQyLVxcdTAyREZcXHUwMkU1LVxcdTAyRURcXHUwMkVGLVxcdTAzNkZcXHUwMzc0XFx1MDM3NVxcdTAzN0VcXHUwMzg0XFx1MDM4NVxcdTAzODdcXHUwM0Y2XFx1MDQ4My1cXHUwNDg5XFx1MDU4QVxcdTA1OEQtXFx1MDU4RlxcdTA1OTEtXFx1MDVCRFxcdTA1QkZcXHUwNUMxXFx1MDVDMlxcdTA1QzRcXHUwNUM1XFx1MDVDN1xcdTA2MDAtXFx1MDYwN1xcdTA2MDlcXHUwNjBBXFx1MDYwQ1xcdTA2MEUtXFx1MDYxQVxcdTA2NEItXFx1MDY2Q1xcdTA2NzBcXHUwNkQ2LVxcdTA2RTRcXHUwNkU3LVxcdTA2RURcXHUwNkYwLVxcdTA2RjlcXHUwNzExXFx1MDczMC1cXHUwNzRBXFx1MDdBNi1cXHUwN0IwXFx1MDdFQi1cXHUwN0YzXFx1MDdGNi1cXHUwN0Y5XFx1MDgxNi1cXHUwODE5XFx1MDgxQi1cXHUwODIzXFx1MDgyNS1cXHUwODI3XFx1MDgyOS1cXHUwODJEXFx1MDg1OS1cXHUwODVCXFx1MDhFNC1cXHUwOTAyXFx1MDkzQVxcdTA5M0NcXHUwOTQxLVxcdTA5NDhcXHUwOTREXFx1MDk1MS1cXHUwOTU3XFx1MDk2MlxcdTA5NjNcXHUwOTgxXFx1MDlCQ1xcdTA5QzEtXFx1MDlDNFxcdTA5Q0RcXHUwOUUyXFx1MDlFM1xcdTA5RjJcXHUwOUYzXFx1MDlGQlxcdTBBMDFcXHUwQTAyXFx1MEEzQ1xcdTBBNDFcXHUwQTQyXFx1MEE0N1xcdTBBNDhcXHUwQTRCLVxcdTBBNERcXHUwQTUxXFx1MEE3MFxcdTBBNzFcXHUwQTc1XFx1MEE4MVxcdTBBODJcXHUwQUJDXFx1MEFDMS1cXHUwQUM1XFx1MEFDN1xcdTBBQzhcXHUwQUNEXFx1MEFFMlxcdTBBRTNcXHUwQUYxXFx1MEIwMVxcdTBCM0NcXHUwQjNGXFx1MEI0MS1cXHUwQjQ0XFx1MEI0RFxcdTBCNTZcXHUwQjYyXFx1MEI2M1xcdTBCODJcXHUwQkMwXFx1MEJDRFxcdTBCRjMtXFx1MEJGQVxcdTBDMDBcXHUwQzNFLVxcdTBDNDBcXHUwQzQ2LVxcdTBDNDhcXHUwQzRBLVxcdTBDNERcXHUwQzU1XFx1MEM1NlxcdTBDNjJcXHUwQzYzXFx1MEM3OC1cXHUwQzdFXFx1MEM4MVxcdTBDQkNcXHUwQ0NDXFx1MENDRFxcdTBDRTJcXHUwQ0UzXFx1MEQwMVxcdTBENDEtXFx1MEQ0NFxcdTBENERcXHUwRDYyXFx1MEQ2M1xcdTBEQ0FcXHUwREQyLVxcdTBERDRcXHUwREQ2XFx1MEUzMVxcdTBFMzQtXFx1MEUzQVxcdTBFM0ZcXHUwRTQ3LVxcdTBFNEVcXHUwRUIxXFx1MEVCNC1cXHUwRUI5XFx1MEVCQlxcdTBFQkNcXHUwRUM4LVxcdTBFQ0RcXHUwRjE4XFx1MEYxOVxcdTBGMzVcXHUwRjM3XFx1MEYzOS1cXHUwRjNEXFx1MEY3MS1cXHUwRjdFXFx1MEY4MC1cXHUwRjg0XFx1MEY4NlxcdTBGODdcXHUwRjhELVxcdTBGOTdcXHUwRjk5LVxcdTBGQkNcXHUwRkM2XFx1MTAyRC1cXHUxMDMwXFx1MTAzMi1cXHUxMDM3XFx1MTAzOVxcdTEwM0FcXHUxMDNEXFx1MTAzRVxcdTEwNThcXHUxMDU5XFx1MTA1RS1cXHUxMDYwXFx1MTA3MS1cXHUxMDc0XFx1MTA4MlxcdTEwODVcXHUxMDg2XFx1MTA4RFxcdTEwOURcXHUxMzVELVxcdTEzNUZcXHUxMzkwLVxcdTEzOTlcXHUxNDAwXFx1MTY4MFxcdTE2OUJcXHUxNjlDXFx1MTcxMi1cXHUxNzE0XFx1MTczMi1cXHUxNzM0XFx1MTc1MlxcdTE3NTNcXHUxNzcyXFx1MTc3M1xcdTE3QjRcXHUxN0I1XFx1MTdCNy1cXHUxN0JEXFx1MTdDNlxcdTE3QzktXFx1MTdEM1xcdTE3REJcXHUxN0REXFx1MTdGMC1cXHUxN0Y5XFx1MTgwMC1cXHUxODBFXFx1MThBOVxcdTE5MjAtXFx1MTkyMlxcdTE5MjdcXHUxOTI4XFx1MTkzMlxcdTE5MzktXFx1MTkzQlxcdTE5NDBcXHUxOTQ0XFx1MTk0NVxcdTE5REUtXFx1MTlGRlxcdTFBMTdcXHUxQTE4XFx1MUExQlxcdTFBNTZcXHUxQTU4LVxcdTFBNUVcXHUxQTYwXFx1MUE2MlxcdTFBNjUtXFx1MUE2Q1xcdTFBNzMtXFx1MUE3Q1xcdTFBN0ZcXHUxQUIwLVxcdTFBQkVcXHUxQjAwLVxcdTFCMDNcXHUxQjM0XFx1MUIzNi1cXHUxQjNBXFx1MUIzQ1xcdTFCNDJcXHUxQjZCLVxcdTFCNzNcXHUxQjgwXFx1MUI4MVxcdTFCQTItXFx1MUJBNVxcdTFCQThcXHUxQkE5XFx1MUJBQi1cXHUxQkFEXFx1MUJFNlxcdTFCRThcXHUxQkU5XFx1MUJFRFxcdTFCRUYtXFx1MUJGMVxcdTFDMkMtXFx1MUMzM1xcdTFDMzZcXHUxQzM3XFx1MUNEMC1cXHUxQ0QyXFx1MUNENC1cXHUxQ0UwXFx1MUNFMi1cXHUxQ0U4XFx1MUNFRFxcdTFDRjRcXHUxQ0Y4XFx1MUNGOVxcdTFEQzAtXFx1MURGNVxcdTFERkMtXFx1MURGRlxcdTFGQkRcXHUxRkJGLVxcdTFGQzFcXHUxRkNELVxcdTFGQ0ZcXHUxRkRELVxcdTFGREZcXHUxRkVELVxcdTFGRUZcXHUxRkZEXFx1MUZGRVxcdTIwMDAtXFx1MjAwRFxcdTIwMTAtXFx1MjAyOVxcdTIwMkYtXFx1MjA2NFxcdTIwNjhcXHUyMDZBLVxcdTIwNzBcXHUyMDc0LVxcdTIwN0VcXHUyMDgwLVxcdTIwOEVcXHUyMEEwLVxcdTIwQkRcXHUyMEQwLVxcdTIwRjBcXHUyMTAwXFx1MjEwMVxcdTIxMDMtXFx1MjEwNlxcdTIxMDhcXHUyMTA5XFx1MjExNFxcdTIxMTYtXFx1MjExOFxcdTIxMUUtXFx1MjEyM1xcdTIxMjVcXHUyMTI3XFx1MjEyOVxcdTIxMkVcXHUyMTNBXFx1MjEzQlxcdTIxNDAtXFx1MjE0NFxcdTIxNEEtXFx1MjE0RFxcdTIxNTAtXFx1MjE1RlxcdTIxODlcXHUyMTkwLVxcdTIzMzVcXHUyMzdCLVxcdTIzOTRcXHUyMzk2LVxcdTIzRkFcXHUyNDAwLVxcdTI0MjZcXHUyNDQwLVxcdTI0NEFcXHUyNDYwLVxcdTI0OUJcXHUyNEVBLVxcdTI2QUJcXHUyNkFELVxcdTI3RkZcXHUyOTAwLVxcdTJCNzNcXHUyQjc2LVxcdTJCOTVcXHUyQjk4LVxcdTJCQjlcXHUyQkJELVxcdTJCQzhcXHUyQkNBLVxcdTJCRDFcXHUyQ0U1LVxcdTJDRUFcXHUyQ0VGLVxcdTJDRjFcXHUyQ0Y5LVxcdTJDRkZcXHUyRDdGXFx1MkRFMC1cXHUyRTQyXFx1MkU4MC1cXHUyRTk5XFx1MkU5Qi1cXHUyRUYzXFx1MkYwMC1cXHUyRkQ1XFx1MkZGMC1cXHUyRkZCXFx1MzAwMC1cXHUzMDA0XFx1MzAwOC1cXHUzMDIwXFx1MzAyQS1cXHUzMDJEXFx1MzAzMFxcdTMwMzZcXHUzMDM3XFx1MzAzRC1cXHUzMDNGXFx1MzA5OS1cXHUzMDlDXFx1MzBBMFxcdTMwRkJcXHUzMUMwLVxcdTMxRTNcXHUzMjFEXFx1MzIxRVxcdTMyNTAtXFx1MzI1RlxcdTMyN0MtXFx1MzI3RVxcdTMyQjEtXFx1MzJCRlxcdTMyQ0MtXFx1MzJDRlxcdTMzNzctXFx1MzM3QVxcdTMzREVcXHUzM0RGXFx1MzNGRlxcdTREQzAtXFx1NERGRlxcdUE0OTAtXFx1QTRDNlxcdUE2MEQtXFx1QTYwRlxcdUE2NkYtXFx1QTY3RlxcdUE2OUZcXHVBNkYwXFx1QTZGMVxcdUE3MDAtXFx1QTcyMVxcdUE3ODhcXHVBODAyXFx1QTgwNlxcdUE4MEJcXHVBODI1XFx1QTgyNlxcdUE4MjgtXFx1QTgyQlxcdUE4MzhcXHVBODM5XFx1QTg3NC1cXHVBODc3XFx1QThDNFxcdUE4RTAtXFx1QThGMVxcdUE5MjYtXFx1QTkyRFxcdUE5NDctXFx1QTk1MVxcdUE5ODAtXFx1QTk4MlxcdUE5QjNcXHVBOUI2LVxcdUE5QjlcXHVBOUJDXFx1QTlFNVxcdUFBMjktXFx1QUEyRVxcdUFBMzFcXHVBQTMyXFx1QUEzNVxcdUFBMzZcXHVBQTQzXFx1QUE0Q1xcdUFBN0NcXHVBQUIwXFx1QUFCMi1cXHVBQUI0XFx1QUFCN1xcdUFBQjhcXHVBQUJFXFx1QUFCRlxcdUFBQzFcXHVBQUVDXFx1QUFFRFxcdUFBRjZcXHVBQkU1XFx1QUJFOFxcdUFCRURcXHVGQjFFXFx1RkIyOVxcdUZEM0VcXHVGRDNGXFx1RkRGRFxcdUZFMDAtXFx1RkUxOVxcdUZFMjAtXFx1RkUyRFxcdUZFMzAtXFx1RkU1MlxcdUZFNTQtXFx1RkU2NlxcdUZFNjgtXFx1RkU2QlxcdUZFRkZcXHVGRjAxLVxcdUZGMjBcXHVGRjNCLVxcdUZGNDBcXHVGRjVCLVxcdUZGNjVcXHVGRkUwLVxcdUZGRTZcXHVGRkU4LVxcdUZGRUVcXHVGRkY5LVxcdUZGRkRdfFxcdUQ4MDBbXFx1REQwMVxcdURENDAtXFx1REQ4Q1xcdUREOTAtXFx1REQ5QlxcdUREQTBcXHVEREZEXFx1REVFMC1cXHVERUZCXFx1REY3Ni1cXHVERjdBXXxcXHVEODAyW1xcdUREMUZcXHVERTAxLVxcdURFMDNcXHVERTA1XFx1REUwNlxcdURFMEMtXFx1REUwRlxcdURFMzgtXFx1REUzQVxcdURFM0ZcXHVERUU1XFx1REVFNlxcdURGMzktXFx1REYzRl18XFx1RDgwM1tcXHVERTYwLVxcdURFN0VdfFtcXHVEODA0XFx1REI0MF1bXFx1REMwMVxcdURDMzgtXFx1REM0NlxcdURDNTItXFx1REM2NVxcdURDN0YtXFx1REM4MVxcdURDQjMtXFx1RENCNlxcdURDQjlcXHVEQ0JBXFx1REQwMC1cXHVERDAyXFx1REQyNy1cXHVERDJCXFx1REQyRC1cXHVERDM0XFx1REQ3M1xcdUREODBcXHVERDgxXFx1RERCNi1cXHVEREJFXFx1REUyRi1cXHVERTMxXFx1REUzNFxcdURFMzZcXHVERTM3XFx1REVERlxcdURFRTMtXFx1REVFQVxcdURGMDFcXHVERjNDXFx1REY0MFxcdURGNjYtXFx1REY2Q1xcdURGNzAtXFx1REY3NF18XFx1RDgwNVtcXHVEQ0IzLVxcdURDQjhcXHVEQ0JBXFx1RENCRlxcdURDQzBcXHVEQ0MyXFx1RENDM1xcdUREQjItXFx1RERCNVxcdUREQkNcXHVEREJEXFx1RERCRlxcdUREQzBcXHVERTMzLVxcdURFM0FcXHVERTNEXFx1REUzRlxcdURFNDBcXHVERUFCXFx1REVBRFxcdURFQjAtXFx1REVCNVxcdURFQjddfFxcdUQ4MUFbXFx1REVGMC1cXHVERUY0XFx1REYzMC1cXHVERjM2XXxcXHVEODFCW1xcdURGOEYtXFx1REY5Ml18XFx1RDgyRltcXHVEQzlEXFx1REM5RVxcdURDQTAtXFx1RENBM118XFx1RDgzNFtcXHVERDY3LVxcdURENjlcXHVERDczLVxcdUREODJcXHVERDg1LVxcdUREOEJcXHVEREFBLVxcdUREQURcXHVERTAwLVxcdURFNDVcXHVERjAwLVxcdURGNTZdfFxcdUQ4MzVbXFx1REVEQlxcdURGMTVcXHVERjRGXFx1REY4OVxcdURGQzNcXHVERkNFLVxcdURGRkZdfFxcdUQ4M0FbXFx1RENEMC1cXHVEQ0Q2XXxcXHVEODNCW1xcdURFRjBcXHVERUYxXXxcXHVEODNDW1xcdURDMDAtXFx1REMyQlxcdURDMzAtXFx1REM5M1xcdURDQTAtXFx1RENBRVxcdURDQjEtXFx1RENCRlxcdURDQzEtXFx1RENDRlxcdURDRDEtXFx1RENGNVxcdUREMDAtXFx1REQwQ1xcdURENkFcXHVERDZCXFx1REYwMC1cXHVERjJDXFx1REYzMC1cXHVERjdEXFx1REY4MC1cXHVERkNFXFx1REZENC1cXHVERkY3XXxcXHVEODNEW1xcdURDMDAtXFx1RENGRVxcdUREMDAtXFx1REQ0QVxcdURENTAtXFx1REQ3OVxcdUREN0ItXFx1RERBM1xcdUREQTUtXFx1REU0MlxcdURFNDUtXFx1REVDRlxcdURFRTAtXFx1REVFQ1xcdURFRjAtXFx1REVGM1xcdURGMDAtXFx1REY3M1xcdURGODAtXFx1REZENF18XFx1RDgzRVtcXHVEQzAwLVxcdURDMEJcXHVEQzEwLVxcdURDNDdcXHVEQzUwLVxcdURDNTlcXHVEQzYwLVxcdURDODdcXHVEQzkwLVxcdURDQURdJztcbi8vIGpzY3M6ZW5hYmxlIG1heGltdW1MaW5lTGVuZ3RoXG4vLyBqc2hpbnQgaWdub3JlOmVuZFxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy91dGlscy9uZXV0cmFsX2NoYXJzX3JlZ2V4cC5qc1xuICoqIG1vZHVsZSBpZCA9IDlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=