'use strict';

(function () {
  // Create the app namespace if this module is included first
  window.dv = window.dv || {};

  // Expose logic on the app namespace
  dv.renderTimeColumn = renderTimeColumn;
  dv.minutesToTimeString = minutesToTimeString;
  dv.minutesToAmPmString = minutesToAmPmString;

  // ---  --- //

  /**
   * @param {HTMLElement} timeColumnElement
   */
  function renderTimeColumn(timeColumnElement) {
    var minutes, timeStr, ampmStr, timeTickElement, ampmElement;

    // Clear any old content from the element (ensures idempotency)
    timeColumnElement.innerHTML = '';

    for (minutes = dv.minTimeInMinutes;
         minutes <= dv.maxTimeInMinutes;
         minutes += dv.timeColumnTickIntervalInMinutes) {
      // Determine the string values for this time
      timeStr = minutesToTimeString(minutes);
      ampmStr = minutesToAmPmString(minutes);

      // Add the DOM elements for this time

      timeTickElement = document.createElement('li');
      timeColumnElement.appendChild(timeTickElement);
      timeTickElement.className = 'time-tick';
      timeTickElement.innerHTML = timeStr;

      ampmElement = document.createElement('span');
      ampmElement.className = 'am-pm';
      ampmElement.innerHTML = ' ' + ampmStr;
      timeTickElement.appendChild(ampmElement);
    }
  }

  /**
   * @param {Number} minutes
   * @returns {String}
   */
  function minutesToTimeString(minutes) {
    var h, m, mStr;

    // Extract the hour and minute components from the total number of minutes
    h = parseInt(minutes / 60);
    m = minutes % 60;

    // Offset the hours component so that a total minutes value of zero corresponds to 9:00 AM
    h += dv.startingHourValue;

    // Convert the hours component from a 24-hour clock value to a 12-hour clock value.
    // This expression also ensures that an initial hour component of 12 (or 24) will yield a value of 12, rather than
    // a value of 0.
    h = (h + 11) % 12 + 1;

    // Zero-pad the minutes component if needed
    mStr = m < 10 ? '0' + m : '' + m;

    return h + ':' + mStr;
  }

  /**
   * @param {Number} minutes
   * @returns {String}
   */
  function minutesToAmPmString(minutes) {
    // Extract the hour and minute components from the total number of minutes
    var h = parseInt(minutes / 60);

    // Offset the hours component so that a total minutes value of zero corresponds to 9:00 AM
    h += dv.startingHourValue;

    // Determine whether the 12-hour clock time value is in the AM or PM cycle
    return h >= 12 ? 'PM' : 'AM';
  }
})();
