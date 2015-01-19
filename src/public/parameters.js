'use strict';

(function () {
  /**
   * This module defines some of the common parameters/constants that are used throughout the application.
   *
   * @module parameters
   */

  // --- Definitions of some common types --- //

  /**
   * @typedef {Object} Event
   * @property {Number} start
   * @property {Number} end
   */

  /**
   * @typedef {Object} BoundingBox
   * @property {String} left
   * @property {String} top
   * @property {String} width
   * @property {String} height
   */

  // Create the app namespace if this module is included first
  window.dv = window.dv || {};

  // --- Expose system parameters on the app namespace --- //

  dv.minTimeInMinutes = 0;
  dv.maxTimeInMinutes = 720;

  dv.timeColumnTickIntervalInMinutes = 30;

  // A minute value of zero corresponds to 9:00 AM
  dv.startingHourValue = 9;

  // NOTE: this needs to be kept in-sync with the corresponding styles in the stylesheet
  dv.eventBorderLeftWidth = 4;
  dv.eventBorderWidth = 1;

  dv.eventTitle = 'Sample Item';
  dv.eventLocation = 'Sample Location';

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
    adjacentEvents: [
      {start: 100, end: 160},
      {start: 161, end: 221},
      {start: 160, end: 220},
      {start: 0, end: 720}
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
      {start: 300, end: 360},
      {start: 301, end: 361},
      {start: 302, end: 362},
      {start: 303, end: 363},
      {start: 304, end: 364},
      {start: 305, end: 365},
      {start: 310, end: 370},
      {start: 311, end: 371},
      {start: 312, end: 372},
      {start: 313, end: 373},
      {start: 314, end: 374},
      {start: 315, end: 375},
      {start: 320, end: 380},
      {start: 321, end: 381},
      {start: 322, end: 382},
      {start: 323, end: 383},
      {start: 324, end: 384},
      {start: 325, end: 385},
      {start: 330, end: 390},
      {start: 331, end: 391},
      {start: 332, end: 392},
      {start: 333, end: 393},
      {start: 334, end: 394},
      {start: 335, end: 395},
      {start: 340, end: 400},
      {start: 341, end: 401},
      {start: 342, end: 402},
      {start: 343, end: 403},
      {start: 344, end: 404},
      {start: 345, end: 405},
      {start: 350, end: 410},
      {start: 351, end: 411},
      {start: 352, end: 412},
      {start: 353, end: 413},
      {start: 354, end: 414},
      {start: 355, end: 415},
      {start: 360, end: 420},
      {start: 361, end: 421}
    ]
  };

  dv.testEvents = dv.testEventCollections.basic;
})();
