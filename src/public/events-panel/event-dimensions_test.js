'use strict';

describe('Module: events-dimensions', function () {

  describe('calculateSingleEventDimensions', function () {
    var event;

    beforeEach(function () {
      event = {start: 60, end: 120};
    });

    it('should produce the correct dimensions', function () {
      var dimensions = dv.calculateSingleEventDimensions(4, 3, event);

      // Use regex matching so we don't have to worry about the specifics of the border offset values used with the
      // CSS calc function
      expect(dimensions.left).toMatch(/75%/);
      expect(dimensions.top).toBe('60px');
      expect(dimensions.width).toMatch(/25%/);
      expect(dimensions.height).toBe(60 - dv.eventBorderWidth * 2 + 1 + 'px');
    });
  });

  describe('doEventsConflict', function () {
    it('should identify conflicting events', function () {
      var event1 = {start: 60, end: 120};
      var event2 = {start: 90, end: 150};

      expect(dv.doEventsConflict(event1, event2)).toBeTruthy();
    });

    it('should not identify non-conflicting events', function () {
      var event1 = {start: 60, end: 90};
      var event2 = {start: 120, end: 180};

      expect(dv.doEventsConflict(event1, event2)).toBeFalsy();
    });

    it('should consider events as conflicting if one starts the minute the other ends', function () {
      var event1 = {start: 60, end: 120};
      var event2 = {start: 120, end: 180};

      expect(dv.doEventsConflict(event1, event2)).toBeTruthy();
    });
  });

  describe('eventsComparator', function () {
    it('should return a negative value for a smaller first argument', function () {
      var earlierEvent = {start: 100, end: 200};
      var laterEvent = {start: 400, end: 500};

      expect(dv.eventsComparator(earlierEvent, laterEvent)).toBeLessThan(0);
    });

    it('should return a positive value for a larger first argument', function () {
      var earlierEvent = {start: 100, end: 200};
      var laterEvent = {start: 400, end: 500};

      expect(dv.eventsComparator(laterEvent, earlierEvent)).toBeGreaterThan(0);
    });

    it('should return value of zero for equal arguments', function () {
      var earlierEvent = {start: 100, end: 200};

      expect(dv.eventsComparator(earlierEvent, earlierEvent)).toBe(0);
    });

    it('should consider start time before end time', function () {
      var longEvent = {start: 100, end: 400};
      var shortEvent = {start: 200, end: 300};

      expect(dv.eventsComparator(longEvent, shortEvent)).toBeLessThan(0);
    });

    it('should consider end time when start times are equal', function () {
      var shortEvent = {start: 200, end: 300};
      var shorterEvent = {start: 200, end: 250};

      expect(dv.eventsComparator(shorterEvent, shortEvent)).toBeLessThan(0);
    });
  });
});
