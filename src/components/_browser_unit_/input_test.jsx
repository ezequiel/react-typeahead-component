'use strict';

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils,
    Input = require('../input.jsx');

describe('Input', function() {
    describe('#componentDidUpdate', function() {
        it('should remove the `dir` attribute if re-rendered with a null/undefined value', function(done) {
            var inputInstance = TestUtils.renderIntoDocument(
                    <Input
                        dir='rtl'
                    />
                );

            [null, undefined].forEach(function(value) {
                inputInstance.setProps({
                    dir: value
                }, function() {
                    expect(React.findDOMNode(inputInstance).hasAttribute('dir')).to.be.false;
                    done();
                });
            });
        });

        it('should not remove the `dir` attribute if re-rendered with a legit value', function(done) {
            var inputInstance = TestUtils.renderIntoDocument(
                    <Input
                        dir='rtl'
                    />
                );

            inputInstance.setProps({
                dir: 'ltr'
            }, function() {
                expect(React.findDOMNode(inputInstance).hasAttribute('dir')).to.be.true;
                done();
            });
        });
    });

    describe('#handleChange', function() {
        it('should call `onChange` if the input value did change', function() {
            var handleChange = sinon.spy(),
                inputInstance = TestUtils.renderIntoDocument(
                    <Input
                        value='ezequiel'
                        onChange={handleChange}
                    />
                );

            inputInstance.handleChange({
                target: {
                    value: 'ezequiel rodriguez'
                }
            });

            expect(handleChange).to.have.been.called.once;
        });

        it('should not call `onChange` if the input value did not change', function() {
            var handleChange = sinon.spy(),
                inputInstance = TestUtils.renderIntoDocument(
                    <Input
                        value='ezequiel'
                        onChange={handleChange}
                    />
                );

            inputInstance.handleChange({
                target: {
                    value: 'ezequiel'
                }
            });

            expect(handleChange).to.have.not.been.called;
        });

        it('should pass the event object to `onChange`', function() {
            var handleChange = sinon.spy(),
                inputInstance = TestUtils.renderIntoDocument(
                    <Input
                        value='ezequiel'
                        onChange={handleChange}
                    />
                ),
                eventData = {
                    target: {
                        value: 'ezequiel rodriguez'
                    }
                };

            // We cannot use TestUtils here, as it passes a full-fledged
            // SyntheticEvent to `handleChange`, which is difficult to test against.
            inputInstance.handleChange(eventData);

            expect(handleChange).to.have.been.calledWith(eventData);
        });

        it('should not throw an error if `onChange` was not passed in', function() {
            var inputInstance = TestUtils.renderIntoDocument(
                    <Input
                        value='ezequiel'
                    />
                );

            inputInstance.handleChange({
                target: {
                    value: 'ezequiel rodriguez'
                }
            });
        });
    });

    describe('#isCursorAtEnd', function() {
        // This is only required for tests which use `setSelectionRange`.
        // We have to render into the body because `setSelectionRange`
        // doesn't work if the element isn't actually on the page.
        var renderIntoBody = function(instance) {
            return React.render(instance, document.body);
        };

        afterEach(function() {
            React.unmountComponentAtNode(document.body);
        });

        it('should return `true` if the cursor is at the end', function() {
            var value = 'ezequiel',
                inputInstance = renderIntoBody(
                    <Input
                        value={value}
                    />
                ),
                inputDOMNode = React.findDOMNode(inputInstance),
                startRange = value.length,
                endRange = value.length;

            inputDOMNode.setSelectionRange(startRange, endRange);

            expect(inputInstance.isCursorAtEnd()).to.be.true;
        });

        it('should return `false` if the cursor is at the beginning', function() {
            var inputInstance = renderIntoBody(
                    <Input
                        value='ezequiel'
                    />
                ),
                inputDOMNode = React.findDOMNode(inputInstance);

            inputDOMNode.setSelectionRange(0, 0);

            expect(inputInstance.isCursorAtEnd()).to.be.false;
        });

        it('should return `false` if the cursor is in the middle', function() {
            var value = 'ezequiel',
                inputInstance = renderIntoBody(
                    <Input
                        value={value}
                    />
                ),
                inputDOMNode = React.findDOMNode(inputInstance),
                startRange = Math.floor(value.length / 2),
                endRange = Math.floor(value.length / 2);


            inputDOMNode.setSelectionRange(startRange, endRange);

            expect(inputInstance.isCursorAtEnd()).to.be.false;
        });

        it('should return `true` if the `value` is empty', function() {
            var inputInstance = renderIntoBody(
                    <Input
                        value=''
                    />
                );

            expect(inputInstance.isCursorAtEnd()).to.be.true;
        });

        it('should return `true` if there is no `value`', function() {
            var inputInstance = renderIntoBody(
                    <Input />
                );

            expect(inputInstance.isCursorAtEnd()).to.be.true;
        });
    });
});
