'use strict';

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
