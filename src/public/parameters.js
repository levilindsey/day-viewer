'use strict';

(function () {
  /**
   * @typedef {Object} Event
   * @property {Number} start
   * @property {Number} end
   */

  // Create the app namespace if this module is included first
  window.dv = window.dv || {};

  // --- Expose system parameters on the app namespace --- //

  dv.minTimeInMinutes = 0;
  dv.maxTimeInMinutes = 720;
  dv.timeColumnTickIntervalInMinutes = 30;

  // A minute value of zero corresponds to 9:00 AM
  dv.startingHourValue = 9;

  dv.minutesToPixelsRatio = 1;

  // NOTE: this needs to be kept in-sync with the corresponding styles in the stylesheet
  dv.eventBorderLeftWidth = 4;
  dv.eventBorderWidth = 1;

  dv.eventTitle = 'Sample Item';
  dv.eventLocation = 'Sample Location';

  // TODO: add and visually test additional event collections
  dv.testEventCollections = {
    basic: [
      {start: 30, end: 150},
      {start: 540, end: 600},
      {start: 560, end: 620},
      {start: 610, end: 670}
    ],
    reverse: [
      {start: 30, end: 150},
      {start: 540, end: 600},
      {start: 560, end: 620},
      {start: 610, end: 670}
    ],
    empty: [
    ],
    shortEvents: [
      {start: 0, end: 1},
      {start: 2, end: 3},
      {start: 406, end: 409},
      {start: 409, end: 419},
      {start: 409, end: 429},
      {start: 410, end: 439}
    ],
    manyOverlappingEvents: [
      //{start: , end: },
      //{start: , end: },
      //{start: , end: },
      //{start: , end: },
      //{start: , end: },
      //{start: , end: },
      //{start: , end: },
      //{start: , end: },
      //{start: , end: },
      //{start: , end: }
    ],
    complex: [
      //{start: , end: },
      //{start: , end: },
      //{start: , end: },
      //{start: , end: },
      //{start: , end: },
      //{start: , end: },
      //{start: , end: },
      //{start: , end: },
      //{start: , end: },
      //{start: , end: },
      //{start: , end: },
      //{start: , end: },
      //{start: , end: },
      //{start: , end: },
      //{start: , end: },
      {start: 0, end: 720}
    ]
  };

  dv.testEvents = dv.testEventCollections.shortEvents;
})();
