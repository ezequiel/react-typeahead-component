'use strict';

var React = require('react'),
    Input = require('./input'),
    AriaStatus = require('./aria_status'),
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
