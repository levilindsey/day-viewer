'use strict';

describe('Module: time-column', function () {

  describe('renderTimeColumn', function () {
    var timeColumnElement;

    beforeEach(function () {
      timeColumnElement = document.createElement('ul');
      dv.renderTimeColumn(timeColumnElement);
    });

    it('should create the correct number of list item elements', function () {
      expect(timeColumnElement.querySelectorAll('li').length).toBe(25);
    });

    it('should add the correct text values to the DOM', function () {
      var actualText = timeColumnElement.querySelector('li').innerHTML;
      expect(actualText).toMatch(/9:00.*AM/);
    });
  });

  describe('minutesToTimeString', function () {
    it('should translate AM times', function () {
      expect(dv.minutesToTimeString(30)).toBe('9:30');
    });

    it('should translate PM times', function () {
      expect(dv.minutesToTimeString(360)).toBe('3:00');
    });

    it('should zero-pad minute values that are less than 10', function () {
      expect(dv.minutesToTimeString(1)).toBe('9:01');
    });
  });

  describe('minutesToAmPmString', function () {
    it('should identify AM times', function () {
      expect(dv.minutesToAmPmString(60)).toBe('AM');
    });

    it('should identify PM times', function () {
      expect(dv.minutesToAmPmString(360)).toBe('PM');
    });

    it('should identify noon', function () {
      expect(dv.minutesToAmPmString(180)).toBe('PM');
    });
  });
});
