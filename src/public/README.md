# Code Challenge: Day Viewer

I would like to make explicit some of the assumptions I made while solving this code challenge:

- I did not assume the given array of events passed to layOutDay would be sorted.
- I assumed that event start and end values are inclusive. E.g., if an event starts at 0 and ends at 60, then the 
  rectangle for that event will have a height of 61 pixels.
- A related assumption I made was that if one event ended on the same minute that another event started that the two 
  events should be considered as conflicting. This is because the rendered rectangles would have overlapped by one 
  pixel.
- I assumed that the _offsetHeight_ of an event rectangle should correspond to the event's duration. This is important 
  for ensuring that no two adjacent events will visually overlap regardless of the border width.
- With my implementation, if an event has a duration of one minute, then it will be rendered as two-pixel tall 
  rectangle.
- My implementation uses percent values for the `left` and `width` styles of the event rectangles. This can produce 
  unwanted sub-pixel artifacts.






My test suite is by no means complete.
