'use strict';

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils,
    AriaStatus = require('../aria_status.jsx');

describe('AriaStatus', function() {
    describe('#setTextContent', function() {
        it('should set the text content of the component', function() {
            var ariaStatusInstance = TestUtils.renderIntoDocument(
                    <AriaStatus />
                ),
                text = 'this is a test';

            ariaStatusInstance.setTextContent(text);
            expect(React.findDOMNode(ariaStatusInstance).textContent).to.equal(text);
        });

        it('should set the text content to an empty string when passed null/undefined', function() {
            var ariaStatusInstance = TestUtils.renderIntoDocument(
                    <AriaStatus />
                );

            [null, undefined].forEach(function(value) {
                ariaStatusInstance.setTextContent(value);
                expect(React.findDOMNode(ariaStatusInstance).textContent).to.equal('');
            });
        });
    });
});
