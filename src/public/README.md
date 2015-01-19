# Code Challenge: Day Viewer

## Code Structure

### `dist` vs `src`

While developing the solution to this challenge, I used a gulp-based build system and a Node.js server running 
locally. So I have submitted both the original versions of my code and the built versions of my code. The built 
version (`dist`) is what you should run your tests against.

I also have all of my code in a GitHub repository at https://github.com/levisl176/day-viewer.

### JavaScript Modules

I split my solution apart into six separate JavaScript modules:

- `event-dimensions`: Defines all of the logic for calculating event dimensions.
- `event-element`: Defines all of the logic for adding event elements to the DOM.
- `events-panel`: Defines all of the logic for rendering the events within the main events panel.
- `time-column`: Defines all of the logic for rendering the time column ticks along the left-side of the day viewer.
- `parameters`: Defines some of the common parameters/constants that are used throughout the application.
- `main`: This module is the main entry point for execution of the application. It renders the day viewer and exposes the `layOutDay` function on the global scope.

## Assumptions

I would like to make explicit some of the small assumptions I made while solving this code challenge:

- I assumed that event start and end values are inclusive. E.g., if an event starts at 0 and ends at 60, then the 
  rectangle for that event will have a height of 61 pixels.
- A related assumption I made was that if one event ended on the same minute that another event started, then the two 
  events should be considered as conflicting. This is because the rendered rectangles would have overlapped by one 
  pixel.
- I did not assume the given array of events passed to `layOutDay` would be sorted.
- I assumed that the `offsetHeight` of an event rectangle should correspond to the event's duration. This is important 
  for ensuring that no two adjacent events will visually overlap regardless of the border width.
- With my implementation, if an event has a duration of one minute, then it will be rendered as two-pixel tall 
  rectangle.
- My implementation uses percent values for the `left` and `width` styles of the event rectangles. This can produce 
  unwanted sub-pixel artifacts.
