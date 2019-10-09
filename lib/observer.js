const ENUMS = require('./enums');

class Observer {
  constructor(listener) {
    this.listener = listener;

    this.onMutation = this.onMutation.bind(this);
    this.detectTrackerOnElement = this.detectTrackerOnElement.bind(this);
  }

  init(rootElement, handlerCallback) {
    this.handlerCallback = handlerCallback;
    this.rootElement = rootElement;
    this.observer = new MutationObserver(this.onMutation);
    this.observer.observe(this.rootElement, Observer.OBSERVER_CONFIGURATION);
  }

  onMutation(mutations) {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        this.detectTrackerOnElement(mutation.target);
        mutation.addedNodes.forEach(this.detectTrackerOnElement);
      }
    });
  }

  detectTrackerOnElement(element) {
    if(element.attributes && element.attributes[ENUMS.TRACKING_ATTRIBUTE]){
      this.listener.track(element, this.handlerCallback);
    }
  }
}

Observer.OBSERVER_CONFIGURATION = {
  attributes: false,
  childList: true,
  subtree: true,
};

module.exports = Observer;
