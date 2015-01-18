'use strict';

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
  dv.doEventsConflict = doEventsConflict;
  dv.eventsComparator = eventsComparator;

  // ---  --- //

  /**
   * Creates an element corresponding to each of the given events within the given events-panel element.
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
   * 4. After identifying a complete sub-group, render the events of the sub-group and continue with step 2 from the
   *    next event following the sub-group.
   *
   * @param {HTMLElement} eventsPanelElement
   * @param {Array.<Event>} events
   */
  function renderEvents(eventsPanelElement, events) {
    var subGroupColumns, latestEndTime, doesEventFitInAColumn;

    // Clear any old content from the element (ensures idempotency)
    eventsPanelElement.innerHTML = '';

    // Are there any events to render?
    if (events.length) {
      subGroupColumns = [];
      latestEndTime = Number.NaN;

      events.sort(eventsComparator)
        .forEach(function (event) {
          // If the event starts after the latest end time from all previous events, then we have all of the
          // information that is needed in order to position the latest sub-group of events.
          if (event.start > latestEndTime) {
            renderColumns(eventsPanelElement, subGroupColumns);
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

      // Handle the fencepost problem: Render the events of the last sub-group
      renderColumns(eventsPanelElement, subGroupColumns);
    }
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
   * Adds child elements to the given events panel for each event in the given array of columns.
   *
   * @param {HTMLElement} eventsPanelElement
   * @param {Array.<Array.<Event>>} columns
   */
  function renderColumns(eventsPanelElement, columns) {
    columns.forEach(renderColumn.bind(null, eventsPanelElement, columns.length));
  }

  /**
   * Adds child elements to the given events panel for each event in the given column.
   *
   * @param {HTMLElement} eventsPanelElement
   * @param {Number} columnCount
   * @param {Array.<Event>} column
   * @param {Number} columnIndex
   */
  function renderColumn(eventsPanelElement, columnCount, column, columnIndex) {
    column.forEach(renderEvent.bind(null, eventsPanelElement, columnCount, columnIndex));
  }

  /**
   * Adds a child element to the given events panel for the given event.
   *
   * @param {HTMLElement} eventsPanelElement
   * @param {Number} columnCount
   * @param {Event} event
   * @param {Number} columnIndex
   */
  function renderEvent(eventsPanelElement, columnCount, columnIndex, event) {
    var dimensions = calculateEventDimensions(columnCount, columnIndex, event);
    createEventElement(eventsPanelElement, dimensions);
  }

  /**
   * Calculates the CSS dimension values to use for the given event according to the given column values.
   *
   * @param {Number} columnCount
   * @param {Event} event
   * @param {Number} columnIndex
   * @returns {{left: String, top: String, width: String, height: String}}
   */
  function calculateEventDimensions(columnCount, columnIndex, event) {
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

  /**
   * Creates the event element according to the given dimensions, and adds it to the DOM as a child of the given
   * events panel.
   *
   * @param {HTMLElement} eventsPanelElement
   * @param {{left: String, top: String, width: String, height: String}} dimensions
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
})();
