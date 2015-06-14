var OptionStore = require('./stores/OptionStore');
var OptionActions = require('./actions/OptionActions');
var OptionTemplate = require('./components/OptionTemplate.jsx');
var throttle = require('lodash.throttle');
var React = require('react');
var Typeahead = require('react-typeahead-component');

var MyApp = React.createClass({
    getInitialState: function() {
        return {
            inputValue: '',
            options: []
        };
    },

    componentWillMount: function() {
        OptionStore.on('change', this.handleStoreChange);
    },

    componentWillUnmount: function() {
        OptionStore.removeListener('change', this.handleStoreChange);
    },

    render: function() {
        return (
            <Typeahead
                inputValue={this.state.inputValue}
                options={this.state.options}
                onChange={this.handleChange}
                optionTemplate={OptionTemplate}
                onOptionChange={this.handleOptionChange}
                onOptionClick={this.handleOptionClick}
            />
        );
    },

    handleChange: function(event) {
        var value = event.target.value;
        this.setInputValue(value);
        this.getOptions(value);
    },

    getOptions: throttle(OptionActions.getOptions, 300),

    handleOptionChange: function(event, option) {
        this.setInputValue(option);
    },

    handleOptionClick: function(event, option) {
        this.setInputValue(option);
    },

    setInputValue: function(value) {
        this.setState({
            inputValue: value
        });
    },

    handleStoreChange: function(newOptions) {
        this.setState({
            options: newOptions
        });
    }
});

React.render(<MyApp />, document.getElementById('yt-typeahead'));
