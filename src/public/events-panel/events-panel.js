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
