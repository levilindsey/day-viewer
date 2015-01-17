'use strict';

(function () {
  // Create the app namespace if this module is included first
  window.dv = window.dv || {};

  // Expose logic on the app namespace
  dv.renderEvents = renderEvents;

  // ---  --- //

  /**
   * @param {Array.<Event>} events
   * @param {HTMLElement} eventsPanelElement
   */
  function renderEvents(events, eventsPanelElement) {


    // Clear any old content from the element (ensures idempotency)
    eventsPanelElement.innerHTML = '';

    // TODO:
  }
})();
