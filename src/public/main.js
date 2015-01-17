'use strict';

(function () {
  // Create the app namespace if this module is included first
  window.dv = window.dv || {};

  // TODO: make sure to pull functions out in order to keep things modular (think coupling and cohesion) (this is also going to be vital for unit testing)

  // Expose the layOutDay function as a global variable
  window.layOutDay = layOutDay;

  window.addEventListener('load', run, false);

  // ---  --- //

  function run() {
    console.log('Running day-viewer');

    window.removeEventListener('load', run);

    layOutDay(dv.testEvents);
  }

  /**
   * @param {Array.<Event>} events
   */
  function layOutDay(events) {
    var timeColumnElement, eventsPanelElement;

    timeColumnElement = document.querySelector('.time-column');
    eventsPanelElement = document.querySelector('.events-panel');

    dv.renderTimeColumn(timeColumnElement);
    dv.renderEvents(events, eventsPanelElement);
  }
})();
