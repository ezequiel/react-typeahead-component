var OptionTemplate = require('./components/OptionTemplate.jsx');
var OptionWebAPIUtils = require('./utils/OptionWebAPIUtils');
var Typeahead = require('react-typeahead-component');
var React = require('react');
var Rx = require('rx');

var MyApp = React.createClass({
    getInitialState: function() {
        return {
            inputValue: '',
            options: []
        };
    },

    componentWillMount: function() {
        var inputChanges = this.inputChanges = new Rx.Subject();
        this.handleChange = inputChanges.onNext.bind(inputChanges);

        inputChanges
            .map(function(event) {
                return event.target.value;
            })
            .subscribe(this.setInputValue);

        inputChanges
            .map(function(event) {
                return event.target.value;
            })
            .debounce(250)
            .flatMapLatest(function(inputValue) {
                return (
                    OptionWebAPIUtils
                        .fetchOptions(inputValue)
                        .retry(2)
                        .takeUntil(inputChanges)
                );
            })
            .subscribe(this.setOptions);
    },

    componentWillUnmount: function() {
        this.inputChanges.dispose();
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
    }
});

React.render(<MyApp />, document.getElementById('nf-typeahead'));
