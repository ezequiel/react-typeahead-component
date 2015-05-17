var doc = global.document,
    css = require('./css/react-typeahead-component.css.js'),
    styleElement,
    head;

// If the `document` object exists, assume this is a browser.
if (doc) {
    styleElement = doc.createElement('style');

    if ('textContent' in styleElement) {
        styleElement.textContent = css;
    } else {
        // IE 8
        styleElement.styleSheet.cssText = css;
    }

    head = doc.head;
    head.insertBefore(styleElement, head.firstChild);
}

module.exports = require('./components/typeahead.jsx');
