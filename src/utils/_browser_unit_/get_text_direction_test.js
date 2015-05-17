'use strict';

var getTextDirection = require('../get_text_direction.js');

describe('getTextDirection', function() {
    it('should return `rtl` for the Arabic language', function() {
        expect(getTextDirection('مرحبا')).to.equal('rtl')
    });

    it('should return `rtl` for the Hebrew language', function() {
        expect(getTextDirection('בראשית')).to.equal('rtl')
    });

    it('should return `ltr` for the Chinese language', function() {
        expect(getTextDirection('漢語')).to.equal('ltr');
    });

    it('should return `ltr` for the English language', function() {
        expect(getTextDirection('hello')).to.equal('ltr');
    });

    it('should return `null` for punctuation (neutral text)', function() {
        expect(getTextDirection('! %$,')).to.equal(null);
    });

    it('should return `null` for digits (neutral text)', function() {
        expect(getTextDirection('01233456789')).to.equal(null);
    });

    it('should return `ltr` for text which starts in English, but ends in Arabic', function() {
        expect(getTextDirection('hello goodbye مرحبا')).to.equal('ltr');
    });

    it('should return `rtl` for text which starts in Arabic, but ends in English', function() {
        expect(getTextDirection('مرحبا hello goodbye')).to.equal('rtl')
    });

    it('should return `rtl` for text which starts and ends in Hebrew', function() {
        expect(getTextDirection('בראשית hello בראשית')).to.equal('rtl');
    });

    it('should return `ltr` for text which starts and ends in English', function() {
        expect(getTextDirection('hello בראשית goodbye')).to.equal('ltr');
    });
});
