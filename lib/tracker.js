const ENUMS = require("./enums");
const {ERRORS, WARNINGS} = require('./errors');

class Tracker {
  constructor(featureDetector, observer, listener) {
    this.featureDetector = featureDetector;
    this.observer = observer;
    this.listener = listener;
  }

  init(handlerCallback) {
    if (!this.featureDetector.supported) {
      return console.warn(WARNINGS.DATA_TRACKER_NOT_SUPPORTED);
    }

    const callback = handlerCallback || this.logEvent;

    this.registerInitialListeners(callback);
    this.registerMutationObserver(callback);
  }

  registerMutationObserver(handlerCallback) {
    const rootElement = document.querySelector(`[${ENUMS.ROOT_TRACKER_ATTRIBUTE}]`);
    if (!rootElement) throw ERRORS.ROOT_ELEMENT_NOT_REGISTERED;

    this.observer.init(rootElement, handlerCallback);
  }

  registerInitialListeners(handlerCallback) {
    const trackedElements = document.querySelectorAll(`[${ENUMS.TRACKING_ATTRIBUTE}]`);

    trackedElements.forEach(element => {
      this.listener.track(element, handlerCallback);
    });
  }

  logEvent(eventName, type, element) {
    console.log({
      eventName,
      type,
      element
    })
  }
}

module.exports = Tracker;
