'use strict';

(function () {
  /**
   * This module is the main entry point for execution of the application. It renders the day viewer and exposes the
   * layOutDay function on the global scope.
   *
   * @module main
   */

  // Create the app namespace if this module is included first
  window.dv = window.dv || {};

  // Expose the layOutDay function as a global variable
  window.layOutDay = layOutDay;

  window.addEventListener('load', run, false);

  // ---  --- //

  /**
   * Populates the time column.
   */
  function run() {
    console.log('Running day-viewer');

    window.removeEventListener('load', run);

    layOutTimeColumn();
    layOutDay(dv.testEvents);
  }

  /**
   * Renders the given events in the day viewer.
   *
   * This depends on the pre-existence of an `.events-panel` element in the DOM.
   *
   * @param {Array.<Event>} events
   */
  function layOutDay(events) {
    console.log('Rendering events', events);

    var eventsPanelElement = document.querySelector('.events-panel');
    dv.renderEvents(eventsPanelElement, events);
  }

  /**
   * Renders the time ticks along the left-side of the day viewer.
   *
   * This depends on the pre-existence of a `.time-column` element in the DOM.
   */
  function layOutTimeColumn() {
    console.log('Rendering the time column');

    var timeColumnElement = document.querySelector('.time-column');
    dv.renderTimeColumn(timeColumnElement);
  }
})();

(function () {
  /**
   * This module defines all of the logic for rendering the events within the main events panel.
   *
   * @module events-panel
   */

    // Create the app namespace if this module is included first
  window.dv = window.dv || {};

  // Expose logic on the app namespace
  dv.renderEvents = renderEvents;

  // ---  --- //

  /**
   * Creates an element corresponding to each of the given events within the given events-panel element.
   *
   * @param {HTMLElement} eventsPanelElement
   * @param {Array.<Event>} events
   */
  function renderEvents(eventsPanelElement, events) {
    var dimensions;

    // Clear any old content from the element (ensures idempotency)
    eventsPanelElement.innerHTML = '';

    // Are there any events to render?
    if (events.length) {
      dimensions = dv.calculateAllEventDimensions(events);
      dv.createEventElements(eventsPanelElement, dimensions);
    }
  }
})();

(function () {
  /**
   * This module defines all of the logic for calculating event dimensions.
   *
   * @module event-dimensions
   */

  // Create the app namespace if this module is included first
  window.dv = window.dv || {};

  // Expose logic on the app namespace
  dv.calculateAllEventDimensions = calculateAllEventDimensions;
  dv.calculateSingleEventDimensions = calculateSingleEventDimensions;
  dv.doEventsConflict = doEventsConflict;
  dv.eventsComparator = eventsComparator;

  // ---  --- //

  /**
   * Calculates the dimensions to use for each event element.
   *
   * The event positioning algorithm proceeds as follows:
   *
   * 1. Sort the events first by start time then by end time.
   * 2. Iterate through the events, searching for the smallest sub-group of consecutive events such that the preceding
   *    and proceeding events from the overall event collection do not overlap in time with any of the events in the
   *    sub-group.
   *   - The events of a sub-group are stored in a collection of columns.
   *   - Each successive event in a column cannot overlap in time with the previous event.
   * 3. When a new event is found to belong to a sub-group, add the event to the first non-conflicting column of the
   *    sub-group. If the event conflicts with every pre-existing column in the sub-group, then create a new column
   *    for the event.
   * 4. After identifying a complete sub-group, calculate and save the dimensions of the events of the sub-group and
   *    continue with step 2 from the next event following the sub-group.
   *
   * @param {Array.<Event>} events
   * @returns {Array.<BoundingBox>}
   */
  function calculateAllEventDimensions(events) {
    var dimensions, subGroupColumns, latestEndTime, doesEventFitInAColumn;

    dimensions = [];
    subGroupColumns = [];
    latestEndTime = Number.NaN;

    events.sort(eventsComparator)
      .forEach(function (event) {
        // If the event starts after the latest end time from all previous events, then we have all of the
        // information that is needed in order to position the latest sub-group of events.
        if (event.start > latestEndTime) {
          dimensions = dimensions.concat(calculateEventDimensionsInColumns(subGroupColumns));
          subGroupColumns.length = 0;
          latestEndTime = Number.NaN;
        }

        // Try to fit the event into a pre-existing column
        doesEventFitInAColumn = subGroupColumns.some(tryToFitEventInColumn.bind(null, event));

        // If the event did not fit in a pre-existing column, then create a new column for the event
        if (!doesEventFitInAColumn) {
          subGroupColumns.push([event]);
        }

        // Update the latest event end time
        if (event.end > latestEndTime || isNaN(latestEndTime)) {
          latestEndTime = event.end;
        }
      });

    // Handle the fencepost problem: Position the events of the last sub-group
    dimensions = dimensions.concat(calculateEventDimensionsInColumns(subGroupColumns));

    return dimensions;
  }

  /**
   * If the given event does not conflict with the last event in the given column, then this adds the event to the
   * column and returns true.
   *
   * @param {Event} event
   * @param {Array.<Event>} column
   * @returns {Boolean}
   */
  function tryToFitEventInColumn(event, column) {
    if (doEventsConflict(event, column[column.length - 1])) {
      return false;
    } else {
      column.push(event);
      return true;
    }
  }

  /**
   * Returns true if the time frames of the two events overlap.
   *
   * Two events are considered to conflict if one starts on the same minute that the other ends.
   *
   * @param {Event} event1
   * @param {Event} event2
   * @returns {Boolean}
   */
  function doEventsConflict(event1, event2) {
    return event1.start <= event2.end && event2.start <= event1.end;
  }

  /**
   * Orders events first by start time then by end end time.
   *
   * @param {Event} event1
   * @param {Event} event2
   * @returns {Number}
   */
  function eventsComparator(event1, event2) {
    if (event1.start === event2.start) {
      return event1.end - event2.end;
    } else {
      return event1.start - event2.start;
    }
  }

  /**
   * Calculates the CSS dimension values to use for each event in the given columns.
   *
   * @param {Array.<Array.<Event>>} columns
   * @returns {Array.<BoundingBox>}
   */
  function calculateEventDimensionsInColumns(columns) {
    return columns.reduce(function (dimensions, column, index) {
      return dimensions.concat(calculateEventDimensionsInColumn(columns.length, column, index));
    }, []);
  }

  /**
   * Calculates the CSS dimension values to use for each event in the given column.
   *
   * @param {Number} columnCount
   * @param {Array.<Event>} column
   * @param {Number} columnIndex
   * @returns {Array.<BoundingBox>}
   */
  function calculateEventDimensionsInColumn(columnCount, column, columnIndex) {
    return column.map(calculateSingleEventDimensions.bind(null, columnCount, columnIndex));
  }

  /**
   * Calculates the CSS dimension values to use for the given event according to the given column values.
   *
   * @param {Number} columnCount
   * @param {Event} event
   * @param {Number} columnIndex
   * @returns {BoundingBox}
   */
  function calculateSingleEventDimensions(columnCount, columnIndex, event) {
    var duration, widthPercentage, leftPercentage, borderOffsetX, borderOffsetY, left, top, width, height;

    duration = event.end - event.start + 1;
    widthPercentage = 100 / columnCount;
    leftPercentage = widthPercentage * columnIndex;

    borderOffsetX = dv.eventBorderWidth + dv.eventBorderLeftWidth;
    borderOffsetY = dv.eventBorderWidth * 2;

    // NOTE: the pixel rounding problem with the calc function can cause events to visually overlap
    width = 'calc(' + widthPercentage + '% - ' + borderOffsetX + 'px)';
    left = 'calc(' + leftPercentage + '% + ' + dv.eventBorderLeftWidth + 'px)';

    height = (duration < borderOffsetY ? 0 : duration - borderOffsetY) + 'px';
    top = event.start + 'px';

    return {
      left: left,
      top: top,
      width: width,
      height: height
    };
  }
})();

(function () {
  /**
   * This module defines all of the logic for adding event elements to the DOM.
   *
   * @module event-element
   */

  // Create the app namespace if this module is included first
  window.dv = window.dv || {};

  // Expose logic on the app namespace
  dv.createEventElements = createEventElements;
  dv.createEventElement = createEventElement;

  // ---  --- //

  /**
   * Creates the event elements according to the given dimensions and adds them to the DOM as children of the given
   * events panel.
   *
   * @param {HTMLElement} eventsPanelElement
   * @param {Array.<BoundingBox>} dimensions
   */
  function createEventElements(eventsPanelElement, dimensions) {
    dimensions.forEach(createEventElement.bind(null, eventsPanelElement));
  }

  /**
   * Creates the event element according to the given dimensions, and adds it to the DOM as a child of the given
   * events panel.
   *
   * @param {HTMLElement} eventsPanelElement
   * @param {BoundingBox} dimensions
   */
  function createEventElement(eventsPanelElement, dimensions) {
    var eventElement = document.createElement('div');
    eventElement.className = 'event';

    eventElement.style.left = dimensions.left;
    eventElement.style.top = dimensions.top;
    eventElement.style.width = dimensions.width;
    eventElement.style.height = dimensions.height;

    eventsPanelElement.appendChild(eventElement);

    addEventElementContents(eventElement);
  }

  /**
   * Adds the textual contents for the given event element.
   *
   * @param {HTMLElement} eventElement
   */
  function addEventElementContents(eventElement) {
    var eventTitleElement, eventLocationElement;

    eventTitleElement = document.createElement('h1');
    eventTitleElement.innerHTML = dv.eventTitle;
    eventElement.appendChild(eventTitleElement);

    eventLocationElement = document.createElement('h2');
    eventLocationElement.innerHTML = dv.eventLocation;
    eventElement.appendChild(eventLocationElement);
  }
})();

(function () {
  /**
   * This module defines all of the logic for rendering the time column ticks along the left-side of the day viewer.
   *
   * @module time-column
   */

  // Create the app namespace if this module is included first
  window.dv = window.dv || {};

  // Expose logic on the app namespace
  dv.renderTimeColumn = renderTimeColumn;
  dv.minutesToTimeString = minutesToTimeString;
  dv.minutesToAmPmString = minutesToAmPmString;

  // ---  --- //

  /**
   * Creates time-tick list-item elements and adds them to the given time-column element.
   *
   * @param {HTMLElement} timeColumnElement
   */
  function renderTimeColumn(timeColumnElement) {
    var minutes, timeStr, ampmStr;

    // Clear any old content from the element (ensures idempotency)
    timeColumnElement.innerHTML = '';

    for (minutes = dv.minTimeInMinutes;
         minutes <= dv.maxTimeInMinutes;
         minutes += dv.timeColumnTickIntervalInMinutes) {
      // Determine the string values for the time tick
      timeStr = minutesToTimeString(minutes);
      ampmStr = minutesToAmPmString(minutes);

      // Create the DOM elements for the time tick
      renderTimeTick(timeStr, ampmStr, timeColumnElement);
    }
  }

  /**
   * Creates a time-tick list item element with the given time and AM/PM strings, and adds the tick as a child of the
   * given time-column element.
   *
   * @param {String} timeStr
   * @param {String} ampmStr
   * @param {HTMLElement} timeColumnElement
   */
  function renderTimeTick(timeStr, ampmStr, timeColumnElement) {
    var timeTickElement, ampmElement;

    timeTickElement = document.createElement('li');
    timeColumnElement.appendChild(timeTickElement);
    timeTickElement.className = 'time-tick';
    timeTickElement.innerHTML = timeStr;

    ampmElement = document.createElement('span');
    ampmElement.className = 'am-pm';
    ampmElement.innerHTML = ' ' + ampmStr;
    timeTickElement.appendChild(ampmElement);
  }

  /**
   * Translates the given number of minutes past 9:00 AM into a string of the form "[h]h:mm".
   *
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
   * Determines the appropriate AM/PM string value that corresponds to the given number of minutes past 9:00 AM.
   *
   * @param {Number} minutes
   * @returns {'AM'|'PM'}
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
