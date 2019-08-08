# 🚀 Dom Event Tracker!
Dynamically tracks mutations and listens for click and seen events.

[![CircleCI](https://circleci.com/gh/Trendyol/dom-event-tracker.svg?style=svg)](https://circleci.com/gh/Trendyol/dom-event-tracker) [![codecov](https://codecov.io/gh/Trendyol/dom-event-tracker/branch/master/graph/badge.svg)](https://codecov.io/gh/Trendyol/dom-event-tracker) [![npm version](https://badge.fury.io/js/dom-event-tracker.svg)](https://www.npmjs.com/package/dom-event-tracker)


DOM Event Tracker uses [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) and [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) to tracker for events click and seen.
Whenever an element is visible in the users screen it fires `seen` event. 
Whenever user clicks an item, it fies `click` event.


## Install
```
npm install dom-event-tracker
```

## Custom Build
You can also clone repository and build.

```
git clone git@github.com:Trendyol/dom-event-tracker.git && cd dom-event-tracker
npm install
npm run build
```

## Usage
1. Add `data-tracker-root` attribute to root element. Root element is being tracked for mutations.
2. Add tracking attributes to elements that you want to track `data-tracker="seen:seenEventName click:clickEventName"`. 
3. Start Tracker
```js
window.Tracker.init((eventName, eventType, element) => {
    //Report your event
    GoogleAnalytics.fireEvent(eventName);
});
```

## Example

```html
<html>
    <head></head>
    <body>
        <div class="container" data-tracker-root>
            <div>
                <div class="info-box" data-tracker="seen:infoBoxSeen"></div>
            </div>
            <div class="help-button" data-tracker="click:helpButtonClicked"></div>
        </div>
        <script>
            window.Tracker.init(); // Without callback it uses console for notifying events
        </script>
    </body>
</html>
```


## Event Types
### Seen
Whenever an element is visible in the users screen it fires `seen` event. IntersectionObserver without threshold.

> Whenever callback returns `true`, seen event won't be fired for that element. Otherwise it will always fire seen event. This means almost each scroll

### Click
Whenever user clicks an item, it fies `click` event.


## Tracker Callback

### Root Callback
You can provide root callback for async initialize.
```html
<div data-tracker-root="onTrackerLoaded">
    <div data-tracker="seen:seenItem"></div>
</div>
<script>
function onTrackerLoaded(e){
  GoogleAnalytics.event(e);
}
</script>
<script src="cdn://tracker.min.js" defer></script>
```

### Custom start
You can also call init manually
```html
<div data-tracker-root="">
    <div data-tracker="seen:seenItem"></div>
</div>
<script src="cdn://tracker.min.js"></script>
<script>
    window.Tracker.init((e) => GoogleAnalytics.event(e));
</script>
```

### Callback Params
```js
function callbackHandler(eventName, eventType, element){
  
}
```
