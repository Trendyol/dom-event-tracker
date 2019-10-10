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
        this.traverseNodes(mutation.addedNodes);
      } else if (mutation.type === 'attributes') {
        this.detectTrackerOnElement(mutation.target);
      }
    });
  }

  detectTrackerOnElement(element) {
    if (element && element.attributes && element.attributes[ENUMS.TRACKING_ATTRIBUTE]) {
      this.listener.track(element, this.handlerCallback);
    }
  }

  traverseNodes(nodeList) {
    if (nodeList && (nodeList instanceof NodeList || nodeList instanceof Array)) {
      nodeList.forEach(node => {
        this.detectTrackerOnElement(node);
        this.traverseNodes(node.childNodes);
      });
    }
  }
}

Observer.OBSERVER_CONFIGURATION = {
  attributes: true,
  childList: true,
  subtree: true,
};

module.exports = Observer;
