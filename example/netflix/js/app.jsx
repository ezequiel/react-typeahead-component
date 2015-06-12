var OptionStore = require('./stores/OptionStore');
var OptionActions = require('./actions/OptionActions');
var OptionTemplate = require('./components/OptionTemplate.jsx');
var throttle = require('lodash.throttle');

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
            <div className='netflix-typeahead-container'>
                <span
                    role='presentation'
                    className='icon-search'
                />
                <Typeahead
                    ref='typeahead'
                    placeholder='Titles, people, genres'
                    inputValue={this.state.inputValue}
                    options={this.state.options}
                    onChange={this.handleChange}
                    optionTemplate={OptionTemplate}
                    onOptionChange={this.handleOptionChange}
                    onOptionClick={this.handleOptionClick}
                />
                {this.renderRemoveIcon()}
            </div>
        );
    },

    renderRemoveIcon: function() {
        if (this.state.inputValue.length > 0) {
            return (
                <button
                    onClick={this.handleRemoveClick}
                    className='icon-remove'
                />
            );
        }

        return null;
    },

    setInputValue: function(value) {
        this.setState({
            inputValue: value
        });
    },

    setOptions: function(options) {
        this.setState({
            options: options
        });
    },

    handleChange: function(event) {
        var value = event.target.value;
        this.setInputValue(value);
        this.getOptions(value);
    },

    getOptions: throttle(OptionActions.getOptions, 300),

    handleOptionChange: function(event, option) {
        this.setInputValue(option.value || option);
    },

    handleOptionClick: function(event, option) {
        this.setInputValue(option.value);
    },

    handleRemoveClick: function() {
        this.setInputValue('');
        this.setOptions([]);
        this.refs.typeahead.focus();
    },

    handleStoreChange: function(newOptions) {
        this.setOptions(newOptions);
    }
});

React.render(<MyApp />, document.getElementById('nf-typeahead'));
