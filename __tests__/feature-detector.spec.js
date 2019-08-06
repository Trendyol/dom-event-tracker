const FeatureDetector = require('../lib/feature-detector');
const {expect} = require('chai');
const sinon = require('sinon');

const sandbox = sinon.createSandbox();

let featureDetector;

describe('FeatureDetector', () => {
  beforeEach(() => {
    featureDetector = new FeatureDetector();
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it('should create new FeatureDetector', () => {
    // Arrange
    const featureDetector = new FeatureDetector();

    // Assert
    expect(featureDetector).to.be.instanceOf(FeatureDetector);
  });

  it('should detect mutation observer support', () => {
    // Arrange
    delete window.IntersectionObserver;
    delete window.IntersectionObserverEntry;

    // Act
    const isIntersectionObserverFeatureDetector = featureDetector.detectMutationObserverSupport();

    // Assert
    expect(isIntersectionObserverFeatureDetector).to.eq(false);
  });

  it('should detect mutation observer support', () => {
    // Arrange
    window.IntersectionObserver = {};
    window.IntersectionObserverEntry = {
      prototype: {
        intersectionRatio: true
      }
    };

    // Act
    const isIntersectionObserverFeatureDetector = featureDetector.detectIntersectionObserverSupport();

    // Assert
    expect(isIntersectionObserverFeatureDetector).to.eq(true);
  });

  it('should return all checks result', () => {
    // Arrange
    featureDetector.intersectionObserverSupported = true;
    featureDetector.mutationObserverSupported = true;

    // Act
    const isSupported = featureDetector.supported;

    // Assert
    expect(isSupported).to.eq(true);
  });
});

