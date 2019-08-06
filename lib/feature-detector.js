class FeatureDetector {
  constructor() {
    this.intersectionObserverSupported = this.detectIntersectionObserverSupport();
    this.mutationObserverSupported = this.detectMutationObserverSupport();
  }

  get supported() {
    return this.intersectionObserverSupported && this.mutationObserverSupported;
  }

  detectIntersectionObserverSupport() {
    return 'IntersectionObserver' in window
      && 'IntersectionObserverEntry' in window
      && 'intersectionRatio' in window.IntersectionObserverEntry.prototype;
  }

  detectMutationObserverSupport() {
    return "MutationObserver" in window;
  }
}

module.exports = FeatureDetector;
