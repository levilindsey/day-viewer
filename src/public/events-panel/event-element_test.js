'use strict';

describe('Module: events-dimensions', function () {

  describe('createEventElement', function () {
    var eventsPanelElement, dimensions, eventElement;

    beforeEach(function () {
      eventsPanelElement = document.createElement('div');
      dimensions = {
        left: '50%',
        top: '20px',
        width: '25%',
        height: '60px'
      };
      dv.createEventElement(eventsPanelElement, dimensions);
      eventElement = eventsPanelElement.querySelector('.event');
    });

    it('should create the event element', function () {
      expect(eventElement).not.toBeNull();
    });

    it('should create the event element with the correct dimensions', function () {
      expect(eventElement.style.left).toBe(dimensions.left);
      expect(eventElement.style.top).toBe(dimensions.top);
      expect(eventElement.style.width).toBe(dimensions.width);
      expect(eventElement.style.height).toBe(dimensions.height);
    });

    it('should create the event element with the correct contents', function () {
      expect(eventElement.innerHTML).toBe('<h1>Sample Item</h1><h2>Sample Location</h2>');
    });
  });
});
