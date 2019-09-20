const { TRACKING_TYPE } = require('./enums');

class Listener {
  track(element, callback) {
    const trackingOptions = {
      element,
      trackers: this.parseTrackerOptions(element.getAttribute('data-tracker')),
    };

    if (!element.__tracker_registered) {
      // eslint-disable-next-line no-param-reassign
      element.__tracker_registered = true;
      this.hookListeners(trackingOptions, callback);
    }
  }

  parseTrackerOptions(trackerOptions) {
    const trackingTypes = trackerOptions.split(' ');
    return trackingTypes.map((trackingField) => {
      const [type, event] = trackingField.split(':');

      return {
        type,
        event,
      };
    });
  }

  hookListeners(trackingOptions, callback) {
    trackingOptions.trackers.forEach((tracker) => {
      if (tracker.type === TRACKING_TYPE.CLICK) {
        trackingOptions.element.addEventListener('click', callback.bind(null, tracker.event, tracker.type, trackingOptions.element));
      } else if (tracker.type === TRACKING_TYPE.SEEN) {
        this.registerIntersectionObserver(tracker, trackingOptions.element, callback);
      }
    });
  }

  registerIntersectionObserver(tracker, element, callback) {
    new IntersectionObserver(
      this.onIntersection.bind(null, tracker, element, callback),
    ).observe(element);
  }

  onIntersection(tracker, element, callback, entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (callback(tracker.event, tracker.type, element)) {
          observer.disconnect();
        }
      }
    });
  }
}

module.exports = Listener;
