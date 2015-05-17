'use strict';

var React = require('react');

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
