const Tracker = require('./tracker');
const FeatureDetector = require('./feature-detector');
const Observer = require('./observer');
const Listener = require('./listener');

const listener = new Listener();
const observer = new Observer(listener);
const featureDetector = new FeatureDetector();

Object.defineProperty(window, 'Tracker', {
  writable: false,
  enumerable: false,
  configurable: false,
  value: new Tracker(featureDetector, observer, listener)
});

