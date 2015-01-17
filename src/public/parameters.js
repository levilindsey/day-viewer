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

  dv.eventBorderRightWidth = 4;

  dv.testEvents = [
    {start: 30, end: 150},
    {start: 540, end: 600},
    {start: 560, end: 620},
    {start: 610, end: 670}
  ];
})();
