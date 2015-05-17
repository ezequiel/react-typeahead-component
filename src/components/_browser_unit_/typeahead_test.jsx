'use strict';

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils,
    Typeahead = require('../typeahead.jsx');

describe('Typeahead', function() {
    // This is only required for tests which use `setSelectionRange`.
    // We have to render into the body because `setSelectionRange`
    // doesn't work if the element isn't actually on the page.
    var renderIntoBody = function(instance) {
        return React.render(instance, document.body);
    };

    describe('#componentWillReceiveProps', function() {
        it('should set `isHintVisible` to false if there isn\'t something completeable', function(done) {
            var typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead
                        inputValue='e'
                        handleHint={function() {
                            return 'ezequiel';
                        }}
                    />
                );

            // Put Typeahead in a state where the hint is visible.
            typeaheadInstance.handleChange();

            // The hint should be visible at this point.
            expect(typeaheadInstance.state.isHintVisible).to.be.true;

            typeaheadInstance.setProps({
                inputValue: 'm',
                handleHint: function() {
                    return '';
                }
            }, function() {
                expect(typeaheadInstance.state.isHintVisible).to.be.false;
                done();
            });
        });

        it('should set `isHintVisible` to true if there is something completeable', function(done) {
            var typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead
                        inputValue='m'
                        handleHint={function() {
                            return '';
                        }}
                    />
                );

            // The hint should not be visible at this point.
            expect(typeaheadInstance.state.isHintVisible).to.be.false;

            typeaheadInstance.setProps({
                inputValue: 'e',
                handleHint: function() {
                    return 'ezequiel'
                }
            }, function() {
                expect(typeaheadInstance.state.isHintVisible).to.be.true;
                done();
            });
        });
    });

    describe('#showDropdown', function() {
        it('should show the dropdown', function() {
            var typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead />
                );

            typeaheadInstance.showDropdown();

            expect(typeaheadInstance.state.isDropdownVisible).to.be.true;
        });
    });

    describe('#hideDropdown', function() {
        it('should hide the dropdown', function() {
            var typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead />
                );

            typeaheadInstance.hideDropdown();

            expect(typeaheadInstance.state.isDropdownVisible).to.be.false;
            TestUtils.findRenderedDOMComponentWithClass(typeaheadInstance, 'react-typeahead-hidden');
        });
    });

    describe('#showHint', function() {
        it('should not show the hint if there is no `inputValue`', function() {
            var typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead />
                );

            typeaheadInstance.showHint();

            expect(typeaheadInstance.state.isHintVisible).to.be.false;
        });

        it('should not show the hint if there is no hint available', function() {
            var typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead
                        inputValue='eze'
                    />
                );

            typeaheadInstance.showHint();

            expect(typeaheadInstance.state.isHintVisible).to.be.false;
        });

        it('should not show the hint if there is no hint available to complete', function() {
            var typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead
                        inputValue='eze'
                        handleHint={function() {
                            return 'eze';
                        }}
                    />
                );

            typeaheadInstance.showHint();

            expect(typeaheadInstance.state.isHintVisible).to.be.false;
        });


        it('should show the hint if there is a hint available to complete', function() {
            var typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead
                        inputValue='eze'
                        handleHint={function() {
                            return 'ezequiel';
                        }}
                    />
                );

            typeaheadInstance.showHint();

            expect(typeaheadInstance.state.isHintVisible).to.be.true;
        });
    });

    describe('#hideHint', function() {
        it('should hide the hint', function() {
            var typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead />
                );

            typeaheadInstance.hideHint();

            expect(typeaheadInstance.state.isHintVisible).to.be.false;
        });
    });

    describe('#setSelectedIndex', function() {
        it('should set the selected index', function() {
            var typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead />
                );

            typeaheadInstance.setSelectedIndex(1337);

            expect(typeaheadInstance.state.selectedIndex).to.be.equal(1337);
        });
    });

    describe('#handleChange', function() {
        it('should show the hint on change', function() {
            var typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead
                        inputValue='eze'
                        handleHint={function() {
                            return 'ezequiel'
                        }}
                    />
                );

            typeaheadInstance.handleChange();
            expect(typeaheadInstance.state.isHintVisible).to.be.equal(true);
        });

        it('should show the dropdown on change', function() {
            var typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead />
                );

            typeaheadInstance.handleChange();
            expect(typeaheadInstance.state.isDropdownVisible).to.be.equal(true);
        });

        it('should reset the selected index on change', function() {
            var typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead />
                );

            typeaheadInstance.handleChange();
            expect(typeaheadInstance.state.selectedIndex).to.be.equal(-1);
        });

        it('should call `onChange` if passed in', function() {
            var handleChange = sinon.spy(),
                typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead
                        onChange={handleChange}
                    />
                );

            typeaheadInstance.handleChange();
            expect(handleChange).to.have.been.called.once;
        });

        it('should pass the event object to `onChange` if passed in', function() {
            var handleChange = sinon.spy(),
                typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead
                        onChange={handleChange}
                    />
                ),
                eventData = {
                    timestamp: Date.now()
                };

            typeaheadInstance.handleChange(eventData);
            expect(handleChange).to.have.been.calledWith(eventData);
        });
    });

    describe('#handleFocus', function() {
        it('should show the dropdown on focus', function() {
            var typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead />
                );

            typeaheadInstance.handleFocus();
            expect(typeaheadInstance.state.isDropdownVisible).to.be.equal(true);
        });


        it('should call `onFocus` if passed in', function() {
            var handleFocus = sinon.spy(),
                typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead
                        onFocus={handleFocus}
                    />
                );

            typeaheadInstance.handleFocus();
            expect(handleFocus).to.have.been.called.once;
        });

        it('should pass the event object to `onFocus` if passed in', function() {
            var handleFocus = sinon.spy(),
                typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead
                        onFocus={handleFocus}
                    />
                ),
                eventData = {
                    timestamp: Date.now()
                };

            typeaheadInstance.handleFocus(eventData);
            expect(handleFocus).to.have.been.calledWith(eventData);
        });
    });

    describe('#handleClick', function() {
        it('should show the hint on click', function() {
            var typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead
                        inputValue='eze'
                        handleHint={function() {
                            return 'ezequiel'
                        }}
                    />
                );

            typeaheadInstance.handleClick();
            expect(typeaheadInstance.state.isHintVisible).to.be.equal(true);
        });
    });

    describe('#navigate', function() {

        it('should not change the selected index if there is no `options`', function() {
            var typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead />
                );

            typeaheadInstance.navigate(-1);
            expect(typeaheadInstance.state.selectedIndex).to.be.equal(-1);

            typeaheadInstance.navigate(1);
            expect(typeaheadInstance.state.selectedIndex).to.be.equal(-1);
        });

        it('should not change the selected index if `options` is empty', function() {
            var typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead
                        options={[]}
                    />
                );

            typeaheadInstance.navigate(-1);
            expect(typeaheadInstance.state.selectedIndex).to.be.equal(-1);

            typeaheadInstance.navigate(1);
            expect(typeaheadInstance.state.selectedIndex).to.be.equal(-1);
        });

        it('should increment and decrement the selected index if we navigate down and up respectively', function() {
            var OptionTemplate = React.createClass({
                    render: function() {
                        return <p>{this.props.data}</p>
                    }
                }),
                typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead
                        options={['a', 'b', 'c']}
                        optionTemplate={OptionTemplate}
                    />
                );

            typeaheadInstance.navigate(1);
            expect(typeaheadInstance.state.selectedIndex).to.be.equal(0);

            typeaheadInstance.navigate(-1);
            expect(typeaheadInstance.state.selectedIndex).to.be.equal(-1);
        });

        it('should wrap the selected index if we navigate up before the input and down past the last item respectively', function() {
            var OptionTemplate = React.createClass({
                    render: function() {
                        return <p>{this.props.data}</p>
                    }
                }),
                options = ['a', 'b', 'c'],
                typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead
                        options={options}
                        optionTemplate={OptionTemplate}
                    />
                );

            typeaheadInstance.navigate(-1);
            expect(typeaheadInstance.state.selectedIndex).to.be.equal(options.length - 1);

            typeaheadInstance.navigate(1);
            expect(typeaheadInstance.state.selectedIndex).to.be.equal(-1);
        });
    });

    describe('#handleKeyDown', function() {
        describe('Tab/End', function() {
            it('should complete the hint if it is visible', function() {
                var handleComplete = sinon.spy(),
                    typeaheadInstance = TestUtils.renderIntoDocument(
                        <Typeahead
                            inputValue='eze'
                            handleHint={function() {
                                return 'ezequiel';
                            }}
                            onComplete={handleComplete}
                        />
                    );

                // Put Typeahead in a state where the hint and dropdown is visible.
                typeaheadInstance.handleChange();

                ['Tab', 'End'].forEach(function(key) {
                    var preventDefault = sinon.spy(),
                        eventData = {
                            key: key,
                            timestamp: Date.now(),
                            preventDefault: preventDefault
                        };

                    typeaheadInstance.handleKeyDown(eventData);
                    expect(preventDefault).to.have.been.called.once;
                    expect(handleComplete).to.have.been.calledWith(eventData, 'ezequiel');
                });
            });

            it('should not complete the hint if the hint is not visible', function() {
                var handleComplete = sinon.spy(),
                    typeaheadInstance = TestUtils.renderIntoDocument(
                        <Typeahead
                            inputValue='eze'
                            handleHint={function() {
                                return 'ezequiel';
                            }}
                            onComplete={handleComplete}
                        />
                    );

                ['Tab', 'End'].forEach(function(key) {
                    var preventDefault = sinon.spy(),
                        eventData = {
                            key: key,
                            timestamp: Date.now(),
                            preventDefault: preventDefault
                        };

                    typeaheadInstance.handleKeyDown(eventData);
                    expect(preventDefault).to.have.not.been.called;
                    expect(handleComplete).to.have.not.been.calledWith(eventData, 'ezequiel');
                });
            });

            it('should not complete the hint if shift is pressed', function() {
                var handleComplete = sinon.spy(),
                    typeaheadInstance = TestUtils.renderIntoDocument(
                        <Typeahead
                            inputValue='eze'
                            handleHint={function() {
                                return 'ezequiel';
                            }}
                            onComplete={handleComplete}
                        />
                    );

                // Put Typeahead in a state where the hint and dropdown is visible.
                typeaheadInstance.handleChange(event);

                ['Tab', 'End'].forEach(function(key) {
                    var preventDefault = sinon.spy(),
                        eventData = {
                            key: key,
                            shiftKey: true,
                            timestamp: Date.now(),
                            preventDefault: preventDefault
                        };

                    typeaheadInstance.handleKeyDown(eventData);
                    expect(preventDefault).to.have.not.been.called;
                    expect(handleComplete).to.have.not.been.calledWith(eventData, 'ezequiel');
                });
            });

            it('should complete the hint if the the hint is visible and the input value is rtl', function() {
                var handleComplete = sinon.spy(),
                    typeaheadInstance = TestUtils.renderIntoDocument(
                        <Typeahead
                            inputValue='شزذ'
                            handleHint={function() {
                                return 'شزذيثبل';
                            }}
                            onComplete={handleComplete}
                        />
                    );

                // Put Typeahead in a state where the hint and dropdown is visible.
                typeaheadInstance.handleChange();

                ['Tab', 'End'].forEach(function(key) {
                    var preventDefault = sinon.spy(),
                        eventData = {
                            key: key,
                            preventDefault: preventDefault
                        };

                    typeaheadInstance.handleKeyDown(eventData);

                    expect(preventDefault).to.have.been.called;
                    expect(handleComplete).to.have.been.calledWith(eventData, 'شزذيثبل');
                });
            });
        });

        describe('ArrowLeft', function() {
            afterEach(function() {
                React.unmountComponentAtNode(document.body);
            });

            describe('in rtl languages', function() {
                it('should complete the hint if it is visible', function() {
                    var inputValue = 'شزذ',
                        handleComplete = sinon.spy(),
                        typeaheadInstance = renderIntoBody(
                            <Typeahead
                                inputValue={inputValue}
                                handleHint={function() {
                                    return 'شزذيثب';
                                }}
                                onComplete={handleComplete}
                            />
                        ),
                        eventData = {
                            key: 'ArrowLeft'
                        },
                        inputDOMNode =
                            React.findDOMNode(
                                TestUtils.findRenderedDOMComponentWithClass(typeaheadInstance, 'react-typeahead-usertext')
                            ),
                        startRange = inputValue.length,
                        endRange = inputValue.length

                    // Put Typeahead in a state where the hint and dropdown is visible.
                    typeaheadInstance.handleChange();

                    // The cursor must be at the end to be completeable.
                    inputDOMNode.setSelectionRange(startRange, endRange);

                    typeaheadInstance.handleKeyDown(eventData);

                    expect(handleComplete).to.have.been.calledWith(eventData, 'شزذيثب');
                });

                it('should not complete the hint if the cursor is not at the end', function() {
                    var handleComplete = sinon.spy(),
                        inputValue = 'شزذ',
                        typeaheadInstance = renderIntoBody(
                            <Typeahead
                                inputValue={inputValue}
                                handleHint={function() {
                                    return 'ezequiel';
                                }}
                                onComplete={handleComplete}
                            />
                        ),
                        eventData = {
                            key: 'ArrowLeft'
                        },
                        inputDOMNode =
                            React.findDOMNode(
                                TestUtils.findRenderedDOMComponentWithClass(typeaheadInstance, 'react-typeahead-usertext')
                            ),
                        startRange = Math.floor(inputValue.length / 2),
                        endRange = Math.floor(inputValue.length / 2);

                    // Put Typeahead in a state where the hint and dropdown is visible.
                    typeaheadInstance.handleChange();

                    inputDOMNode.setSelectionRange(startRange, endRange);

                    typeaheadInstance.handleKeyDown(eventData);

                    expect(handleComplete).to.have.not.been.calledWith(eventData, 'ezequiel');
                });

                it('should not complete the hint if the hint is not visible', function() {
                    var handleComplete = sinon.spy(),
                        typeaheadInstance = TestUtils.renderIntoDocument(
                            <Typeahead
                                inputValue='شزذ'
                                handleHint={function() {
                                    return 'شزذيثب';
                                }}
                                onComplete={handleComplete}
                            />
                        ),
                        eventData = {
                            key: 'ArrowLeft'
                        };

                    typeaheadInstance.handleKeyDown(eventData);

                    expect(handleComplete).to.have.not.been.calledWith(eventData, 'شزذيثب');
                });

                it('should not complete the hint if shift is pressed', function() {
                    var handleComplete = sinon.spy(),
                        typeaheadInstance = TestUtils.renderIntoDocument(
                            <Typeahead
                                inputValue='شزذ'
                                handleHint={function() {
                                    return 'شزذيثب';
                                }}
                                onComplete={handleComplete}
                            />
                        ),
                        eventData = {
                            key: 'ArrowLeft',
                            shiftKey: true
                        };

                    // Put Typeahead in a state where the hint and dropdown is visible.
                    typeaheadInstance.handleChange();

                    typeaheadInstance.handleKeyDown(eventData);
                    expect(handleComplete).to.have.not.been.calledWith(eventData, 'شزذيثب');
                });
            });

            it('should not complete the hint if the inputValue is ltr', function() {
                var handleComplete = sinon.spy(),
                    typeaheadInstance = TestUtils.renderIntoDocument(
                        <Typeahead
                            inputValue='eze'
                            handleHint={function() {
                                return 'ezequiel'
                            }}
                            onComplete={handleComplete}
                        />
                    ),
                    eventData = {
                        key: 'ArrowLeft'
                    };

                // Put Typeahead in a state where the hint and dropdown is visible.
                typeaheadInstance.handleChange();

                typeaheadInstance.handleKeyDown(eventData);
                expect(handleComplete).to.have.not.been.calledWith(eventData, 'ezequiel');
            });
        });

        describe('ArrowRight', function() {
            afterEach(function() {
                React.unmountComponentAtNode(document.body);
            });

            describe('in ltr languages', function() {
                it('should complete the hint if it is visible', function() {
                    var inputValue = 'eze',
                        handleComplete = sinon.spy(),
                        typeaheadInstance = renderIntoBody(
                            <Typeahead
                                inputValue={inputValue}
                                handleHint={function() {
                                    return 'ezequiel';
                                }}
                                onComplete={handleComplete}
                            />
                        ),
                        eventData = {
                            key: 'ArrowRight'
                        },
                        inputDOMNode =
                            React.findDOMNode(
                                TestUtils.findRenderedDOMComponentWithClass(typeaheadInstance, 'react-typeahead-usertext')
                            ),
                        startRange = inputValue.length,
                        endRange = inputValue.length


                    // Put Typeahead in a state where the hint and dropdown is visible.
                    typeaheadInstance.handleChange();

                    // The cursor must be at the end to be completeable.
                    inputDOMNode.setSelectionRange(startRange, endRange);

                    typeaheadInstance.handleKeyDown(eventData);

                    expect(handleComplete).to.have.been.calledWith(eventData, 'ezequiel');
                });

                it('should not complete the hint if the cursor is not at the end', function() {
                    var handleComplete = sinon.spy(),
                        inputValue = 'eze',
                        typeaheadInstance = renderIntoBody(
                            <Typeahead
                                inputValue={inputValue}
                                handleHint={function() {
                                    return 'ezequiel';
                                }}
                                onComplete={handleComplete}
                            />
                        ),
                        eventData = {
                            key: 'ArrowRight',
                            target: {
                                value: 'ezequiel'
                            },
                        },
                        inputDOMNode =
                            React.findDOMNode(
                                TestUtils.findRenderedDOMComponentWithClass(typeaheadInstance, 'react-typeahead-usertext')
                            ),
                        startRange = Math.floor(inputValue.length / 2),
                        endRange = Math.floor(inputValue.length / 2);

                    // Put Typeahead in a state where the hint and dropdown is visible.
                    typeaheadInstance.handleChange();

                    inputDOMNode.setSelectionRange(startRange, endRange);

                    typeaheadInstance.handleKeyDown(eventData);
                    expect(handleComplete).to.have.not.been.calledWith(eventData, 'ezequiel');
                });

                it('should not complete the hint if the hint is not visible', function() {
                    var handleComplete = sinon.spy(),
                        typeaheadInstance = TestUtils.renderIntoDocument(
                            <Typeahead
                                inputValue='eze'
                                handleHint={function() {
                                    return 'ezequiel';
                                }}
                                onComplete={handleComplete}
                            />
                        ),
                        eventData = {
                            key: 'ArrowRight'
                        };

                    typeaheadInstance.handleKeyDown(eventData);

                    expect(handleComplete).to.have.not.been.calledWith(eventData);
                });

                it('should not complete the hint if shift is pressed', function() {
                    var handleComplete = sinon.spy(),
                        typeaheadInstance = TestUtils.renderIntoDocument(
                            <Typeahead
                                inputValue='eze'
                                handleHint={function() {
                                    return 'ezequiel';
                                }}
                                onComplete={handleComplete}
                            />
                        ),
                        eventData = {
                            key: 'ArrowRight',
                            shiftKey: true
                        };

                    // Put Typeahead in a state where the hint and dropdown is visible.
                    typeaheadInstance.handleChange();

                    typeaheadInstance.handleKeyDown(eventData);
                    expect(handleComplete).to.have.not.been.calledWith(eventData, 'ezequiel');
                });
            });

            it('should not complete the hint if the inputValue is rtl', function() {
                var handleComplete = sinon.spy(),
                    typeaheadInstance = TestUtils.renderIntoDocument(
                        <Typeahead
                            inputValue='شزذ'
                            handleHint={function() {
                                return 'شزذيثب';
                            }}
                            onComplete={handleComplete}
                        />
                    ),
                    eventData = {
                        key: 'ArrowRight'
                    };

                // Put Typeahead in a state where the hint and dropdown is visible.
                typeaheadInstance.handleChange();

                typeaheadInstance.handleKeyDown(eventData);
                expect(handleComplete).to.have.not.been.calledWith(eventData, 'شزذيثب');
            });
        });

        describe('Enter/Escape', function() {
            it('should hide the hint', function() {
                var handleChange = sinon.spy(),
                    typeaheadInstance = TestUtils.renderIntoDocument(
                        <Typeahead
                            inputValue='eze'
                            handleHint={function() {
                                return 'ezequiel';
                            }}
                            onChange={handleChange}
                        />
                    );

                ['Enter', 'Escape'].forEach(function(key) {
                    var eventData = {
                        key: key
                    };

                    // Put Typeahead in a state where the hint and dropdown is visible.
                    typeaheadInstance.handleChange();

                    typeaheadInstance.handleKeyDown(eventData);

                    expect(typeaheadInstance.state.isHintVisible).to.be.false;
                });
            });

            it('should hide the dropdown', function() {
                var handleChange = sinon.spy(),
                    typeaheadInstance = TestUtils.renderIntoDocument(
                        <Typeahead
                            inputValue='eze'
                            handleHint={function() {
                                return 'ezequiel';
                            }}
                            onChange={handleChange}
                        />
                    );

                ['Enter', 'Escape'].forEach(function(key) {
                    var eventData = {
                        key: key
                    };

                    // Put Typeahead in a state where the hint and dropdown is visible.
                    typeaheadInstance.handleChange();

                    typeaheadInstance.handleKeyDown(eventData);

                    expect(typeaheadInstance.state.isDropdownVisible).to.be.false;
                });
            });
        });

        describe('ArrowDown/ArrowUp', function() {
            it('should show the dropdown if there is `options`', function() {
                 var handleChange = sinon.spy(),
                    OptionTemplate = React.createClass({
                        render: function() {
                            return <p>{this.props.data}</p>
                        }
                    }),
                    typeaheadInstance = TestUtils.renderIntoDocument(
                        <Typeahead
                            inputValue='eze'
                            handleHint={function() {
                                return 'ezequiel';
                            }}
                            onChange={handleChange}
                            options={['a', 'b', 'c']}
                            optionTemplate={OptionTemplate}
                        />
                    );

                ['ArrowUp', 'ArrowDown'].forEach(function(key) {
                    var preventDefault = sinon.spy(),
                        eventData = {
                            key: key,
                            preventDefault: preventDefault
                        };

                    // Put Typeahead in a state where the hint and dropdown is visible.
                    typeaheadInstance.handleChange();

                    typeaheadInstance.handleKeyDown(eventData);

                    expect(typeaheadInstance.state.isDropdownVisible).to.be.true;
                    expect(preventDefault).to.have.been.called.once;
                });
            });
        });

        it('should not show the dropdown if there is no `options`', function() {
             var handleChange = sinon.spy(),
                typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead
                        inputValue='eze'
                        handleHint={function() {
                            return 'ezequiel';
                        }}
                        onChange={handleChange}
                    />
                );

            ['ArrowUp', 'ArrowDown'].forEach(function(key) {
                var preventDefault = sinon.spy(),
                    eventData = {
                        key: key,
                        preventDefault: preventDefault
                    };

                typeaheadInstance.handleKeyDown(eventData);

                expect(typeaheadInstance.state.isDropdownVisible).to.be.false;
                expect(preventDefault).to.have.not.been.called.once;
            });
        });

        it('should not call `onOptionChange` if there is no `options`', function() {
            var handleOptionChange = sinon.spy(),
                typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead
                        onOptionChange={handleOptionChange}
                    />
                );

            ['ArrowUp', 'ArrowDown'].forEach(function(key) {
                var preventDefault = sinon.spy(),
                    eventData = {
                        key: key,
                        preventDefault: preventDefault
                    };

                typeaheadInstance.handleKeyDown(eventData);

                expect(handleOptionChange).to.have.not.been.called;
                expect(preventDefault).to.have.not.been.called;
            });
        });

        it('should not call `onOptionChange` if there is no `options`', function() {
            var handleOptionChange = sinon.spy(),
                typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead
                        options={[]}
                        onOptionChange={handleOptionChange}
                    />
                );

            ['ArrowUp', 'ArrowDown'].forEach(function(key) {
                var preventDefault = sinon.spy(),
                    eventData = {
                        key: key,
                        preventDefault: preventDefault
                    };

                typeaheadInstance.handleKeyDown(eventData);

                expect(handleOptionChange).to.have.not.been.called;
                expect(preventDefault).to.have.not.been.called;
            });
        });

        it('should call `onOptionChange` with the correct values if we arrow down and up respectively', function() {
            var handleOptionChange = sinon.spy(),
                OptionTemplate = React.createClass({
                    render: function() {
                        return <p>{this.props.data}</p>
                    }
                }),
                typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead
                        inputValue='eze'
                        options={['a', 'b', 'c']}
                        optionTemplate={OptionTemplate}
                        onOptionChange={handleOptionChange}
                    />
                ),
                expected = ['a', 'eze'];

            typeaheadInstance.showDropdown();

            ['ArrowDown', 'ArrowUp'].forEach(function(key, index) {
                var preventDefault = sinon.spy(),
                    eventData = {
                        key: key,
                        preventDefault: preventDefault
                    };

                typeaheadInstance.handleKeyDown(eventData);

                expect(handleOptionChange).to.have.been.calledWith(eventData, expected[index]);
                expect(preventDefault).to.have.been.called;
            });
        });

        it('should wrap and call `onOptionChange` if we arrow up before the input and down past the last item respectively', function() {
            var handleOptionChange = sinon.spy(),
                OptionTemplate = React.createClass({
                    render: function() {
                        return <p>{this.props.data}</p>
                    }
                }),
                typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead
                        inputValue='ezeq'
                        options={['a', 'b', 'c']}
                        optionTemplate={OptionTemplate}
                        onOptionChange={handleOptionChange}
                    />
                ),
                expected = ['c', 'ezeq'];

            typeaheadInstance.showDropdown();

            ['ArrowUp', 'ArrowDown'].forEach(function(key, index) {
                var preventDefault = sinon.spy(),
                    eventData = {
                        key: key,
                        preventDefault: preventDefault
                    };

                typeaheadInstance.handleKeyDown(eventData);

                expect(handleOptionChange).to.have.been.calledWith(eventData, expected[index]);
                expect(preventDefault).to.have.been.called;
            });

        });
    });

    describe('#handleOptionClick', function() {
        it('should hide the hint', function() {
            var typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead
                        inputValue='eze'
                        handleHint={function() {
                            return 'ezequiel';
                        }}
                    />
                );

            // Put  Typeahead in a state where the hint is visible.
            typeaheadInstance.handleClick();

            typeaheadInstance.handleOptionClick();

            expect(typeaheadInstance.state.isHintVisible).to.be.false;
        });

        it('should hide the dropdown', function() {
            var typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead
                        inputValue='eze'
                        handleHint={function() {
                            return 'ezequiel';
                        }}
                    />
                );

            // Put  Typeahead in a state where the hint is visible.
            typeaheadInstance.handleClick();

            typeaheadInstance.handleOptionClick();

            expect(typeaheadInstance.state.isDropdownVisible).to.be.false;
        });

        it('should set the selected index to the index of the item that was clicked', function() {
            var typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead />
                );

            typeaheadInstance.handleOptionClick(1337);

            expect(typeaheadInstance.state.selectedIndex).to.be.equal(1337);
        });

        it('should call `onOptionClick` if passed in', function() {
            var handleOptionClick = sinon.spy(),
                typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead
                        onOptionClick={handleOptionClick}
                    />
                );

            typeaheadInstance.handleOptionClick();

            expect(handleOptionClick).to.be.have.been.called.once;
        });

        it('should pass the event object to `onOptionClick` if passed in', function() {
            var handleOptionClick = sinon.spy(),
                OptionTemplate = React.createClass({
                    render: function() {
                        return <p>{this.props.data}</p>
                    }
                }),
                options = ['a', 'b', 'c'],
                typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead
                        options={options}
                        optionTemplate={OptionTemplate}
                        onOptionClick={handleOptionClick}
                    />
                ),
                eventData = {
                    timestamp: Date.now()
                },
                index = 1;

            typeaheadInstance.handleOptionClick(index, eventData);

            expect(handleOptionClick).to.be.have.been.calledWith(eventData, options[index], index);
        });
    });

    describe('#handleWindowClose', function() {
        it('should hide the hint and dropdown if `event.target` is outside of typeahead', function() {
            var typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead
                        inputValue='eze'
                        handleHint={function() {
                            return 'ezequiel';
                        }}
                    />
                );

           // Put Typeahead in a state where the hint and dropdown is visible.
           typeaheadInstance.handleChange();

            typeaheadInstance.handleWindowClose({
                // Pretend this object is a DOM node we know nothing about.
                target: {}
            });

            expect(typeaheadInstance.state.isHintVisible).to.be.false;
            expect(typeaheadInstance.state.isDropdownVisible).to.be.false;
        });

        it('should not hide the hint nor dropdown if `event.target` is inside of typeahead', function() {
            var typeaheadInstance = TestUtils.renderIntoDocument(
                    <Typeahead
                        inputValue='eze'
                        handleHint={function() {
                            return 'ezequiel';
                        }}
                    />
                );

            // Put Typeahead in a state where the hint and dropdown is visible.
            typeaheadInstance.handleChange();

            typeaheadInstance.handleWindowClose({
                target: React.findDOMNode(
                    TestUtils.findRenderedDOMComponentWithClass(typeaheadInstance, 'react-typeahead-options')
                )
            });

            expect(typeaheadInstance.state.isHintVisible).to.be.true;
            expect(typeaheadInstance.state.isDropdownVisible).to.be.true;
        });
    });
});
