'use strict';

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
