Typeahead, written using the React.js library.
==============================================

Features
========
* Accessibility.
* BiDi support for RTL languages.
* Keyboard navigation.
* Hinting support for the current input value.
* Autocompletion of the hint when possible.
* Custom templates for each option.
* Auto-closing dropdown for the options list.
* **5KB minified+gzipped!**

Examples
--------

**YouTube's Autocomplete widget**. It uses the [Flux application architecture](https://facebook.github.io/flux/) in conjunction with YouTube's API.

![youtube11](https://cloud.githubusercontent.com/assets/368069/7670388/3ab8d8ae-fc57-11e4-8fc1-7ff020e76bf1.gif)

**Yahoo Mail** (this component is used in production by Yahoo Mail).

![mail11](https://cloud.githubusercontent.com/assets/368069/7670476/137c5960-fc5b-11e4-9b9f-6d125a532239.gif)


Getting started
---------------

If you're developing using npm and CommonJS modules:
```
npm i react-typeahead-component
```
```jsx
var React = require('react'),
    Typeahead = require('react-typeahead-component');

React.render(
    // Pass in the desired props
    <Typeahead
        placeholder='Search'
        ...
    />,

    // Render Typeahead into the container of your choice.
    document.body
);
```

You may also want to download one of the distributions from the `dist` folder, and load it in the browser that way. A global variable named `Typeahead` will be available to use.

Class names
-----------

These are some default classes names provided by the component. You may override and provide your own styling.

**react-typeahead-container**
  * A `div` element containing the entire Typeahead.

**react-typeahead-input-container**
  * A `div` element containing the usertext and hint.

**react-typeahead-usertext**
  * An `input` element containing the usertext.

**react-typeahead-hint**
  * An `input` element containing the hint.

**react-typeahead-options**
  * A `ul` element containing the rendered list of options.

Available props:
----------------

#### *ReactElement* optionTemplate ***required***
This determines how to render each option. It is required. It should a reference to a ReactElement. It is instantiated for every item in `options`.

When instantiated, it is passed these props:

 * `index` - The position of this option in the `options` list.
 * `data` - The raw data of this option.
 * `userInputValue` - The value the user has **actually typed**.
 * `inputValue` - Typeahead's current input value. Note: this may be different than `userInputValue`.
 * `isSelected` - Is this option currently selected? This will be `true` on when hovered over, or arrowed to.

**Example**:

```jsx
// OptionTemplate.jsx
module.exports = React.createClass({
    render: function() {
        var bgColor = null;

        // If this option is currently selected, render it with a green background.
        if (this.props.isSelected) {
            bgColor = {
                color: 'green'
            };
        }

        return (
            <div style={bgColor}>
                <p>My name is {this.props.data.name}!</p>
            </div>
        );
    }
});

// Then in your main app...
var OptionTemplate = require('./OptionTemplate.jsx');

<Typeahead
    optionTemplate={OptionTemplate}
/>
```
#### *string* inputId ***optional***
This input id is used for the Typeahead's input element.

For example, this allows us to associate a label with the Typeahead's input element. Screen readers will then be able to read the label once the Typeahead is focused.

```jsx
<label for="message-to-field">To</label>

<Typeahead
    inputId="message-to-field"
    ...
/>
```

#### *string* className ***optional***
* This class name is used for the Typeahead's container.

#### *string* inputValue ***optional***
* The input element's `value` attribute. **NOTE**: You must pass this prop to Typeahead display the value. You have control of the current input value.

#### *array* options ***optional***
* These options are used when rendering the options list. It can contain data of any type.

#### *boolean* autoFocus ***optional***
* If true, the input element is focused on the initial render.

#### *string* placeholder ***optional***
* The input element's `placeholder` attribute.

#### *function* onComplete(*event*, *completedInputValue*) ***optional***
Fires when the user is attempting to complete the input element's hint. If there is no hint, it will not be called.

This function is called when the user presses the `ArrowRight`, `Tab`, or `End` keys. `ArrowLeft` is used instead of `ArrowRight` **if** the input value is RTL.


**Example**:

```jsx
handleComplete: function(event, completedInputValue) {
    this.setState({
        inputValue: completedInputValue
    });
}

<Typeahead
    inputValue={this.state.inputValue}
    onComplete={this.handleComplete}
/>
```

#### *function* onChange(*event*) ***optional***
* Fires when a change occurs on the input element.

#### *function* onInputClick(*event*) ***optional***
* Fires when the input element is clicked.

#### *function* onKeyDown(*event*, optionData, selectedIndex) ***optional***
Fires when a key down occurs on the input element.
It is also passed the currently selected option, and its index.
If no option is selected, `optionData` is the input value, and `selectedIndex` is `-1`.

#### *function* onKeyPress(*event*) ***optional***
* Fires when a key press occurs on the input element.

#### *function* onKeyUp(*event*) ***optional***
* Fires when a key up occurs on the input element.

#### *function* onFocus(*event*) ***optional***
* Fires when the input element is focused.

#### *function* onBlur(*event*) ***optional***
* Fires when the input element is blurred.

#### *function* onSelect(*event*) ***optional***
* Fires when the input element's text is selected.

#### *function* onOptionClick(*event*, index, optionData) ***optional***
* Fires when an option is clicked. `optionData` is the option that was clicked.

#### *function* onOptionChange(*event*, index, optionData) ***optional***
* Fires when the user arrows up or down to an option. It is also called if the user arrows back to the input element, and in that case `index` is `-1`. `optionData` is the option, or input text, data that has been navigated to.

#### *function* handleHint(inputValue, options) ***optional***
This function determines what the hint is. It is called whenever the input has changed. If a hint is considered available, it should return the entire string, otherwise return a default string.

**Example**:

```jsx
handleHint: function(inputValue, options) {
    // If the current input value matches the first option,
    // return that option. It will be used to display the hint.
    if (new RegExp('^' + inputValue).test(options[0].first_name)) {

        // This must return a string!
        return options[0].first_name;
    }

    // No hint is available.
    return '';
}

// Now pass it as a prop...
<Typeahead
    handleHint={this.handleHint}
/>
```

#### *function* getMessageForOption(*optionData*) ***optional***
This is for accessibility. It is called when an option is clicked or arrowed to. `optionData` is the option we're currently on. The return value is then read by the screen reader. It is also called if the user arrows back to the input element. The string returned should be localized so it is read in the correct language.

```js
getMessageForOption: function(optionData) {

    switch (optionData.type) {
    case 'PERSON':
        return 'Search for the person ' + optionData.name;

    case 'PLACE':
        return 'Search for the place ' + optionData.name;

    default:
        return 'Search for the thing ' + optionData.name;
    }
}
```

#### *function* getMessageForIncomingOptions() ***optional***
This is for accessibility. It is called when a new set of options is passed into Typeahead. The return value is then read by the screen reader. The string returned should be localized so it is read in the correct language.

```js
getMessageForIncomingOptions: function() {
    return 'There are new options available. Use the up and down arrows to navigate.';
}
```

Don't see your prop? [Create an issue](https://github.com/ezequiel/react-typeahead-component/issues/new?title=Missing%20prop) explaining your use case, and I will add it.

Testing
-------
The tests are written using [mocha](https://github.com/mochajs/mocha), and ran using [Karma](https://github.com/karma-runner/karma). Run the command `npm test` to perform a single run of the tests in PhantomJS, and `npm test:dev` to debug the tests in Chrome.

Issues
------
Please [file an issue](https://github.com/ezequiel/react-typeahead-component/issues/new) if you find a bug, or need help.

License
-------
The MIT License (MIT)
Copyright (c) 2015 Ezequiel Rodriguez
