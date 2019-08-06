const ENUMS = require('./enums');

class Observer {
  constructor(listener) {
    this.listener = listener;

    this.onMutation = this.onMutation.bind(this);
  }

  init(rootElement, handlerCallback) {
    this.handlerCallback = handlerCallback;
    this.rootElement = rootElement;
    this.observer = new MutationObserver(this.onMutation);
    this.observer.observe(this.rootElement, Observer.OBSERVER_CONFIGURATION);
  }

  onMutation(mutations) {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if(node.attributes && node.attributes[ENUMS.TRACKING_ATTRIBUTE]){
            this.listener.track(node, this.handlerCallback);
          }
        });
      }
    })
  }
}

Observer.OBSERVER_CONFIGURATION = {
  attributes: false,
  childList: true,
  subtree: true
};

module.exports = Observer;
