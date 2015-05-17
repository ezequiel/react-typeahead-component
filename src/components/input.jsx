'use strict';

var React = require('react');

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
            <input
                {..._this.props}
                onChange={_this.handleChange}
            />
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
