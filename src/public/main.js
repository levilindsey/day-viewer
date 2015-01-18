'use strict';

(function () {
  /**
   * This module populates the time column and exposes the layOutDay function on the global scope.
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
