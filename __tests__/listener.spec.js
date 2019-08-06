const Observer = require('../lib/observer');
const Listener = require('../lib/listener');
const faker = require('faker');
const ENUMS = require('../lib/enums');
const {expect} = require('chai');
const sinon = require('sinon');

const sandbox = sinon.createSandbox();

let listener;

describe('Listener', () => {
  beforeEach(() => {
    listener = new Listener();
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it('should create new Listener', () => {
    // Act
    const listener = new Listener();

    // Assert
    expect(listener).to.be.instanceOf(Listener);
  });

  it('should track element if it is not tracked before', () => {
    // Arrange
    const trackerAttribute = faker.random.word();
    const element = {
      getAttribute: sandbox.stub().returns(trackerAttribute)
    };
    const cb = sandbox.spy();
    const trackerOptions = {};
    const parseTrackerStub = sandbox.stub(listener, 'parseTrackerOptions').returns(trackerOptions);
    const hookListenersStub = sandbox.stub(listener, 'hookListeners');

    // Act
    listener.track(element, cb);

    // Assert
    expect(parseTrackerStub.calledWithExactly(trackerAttribute)).to.eq(true);
    expect(hookListenersStub.calledWith({
      element,
      trackers: trackerOptions
    })).to.eq(true);
  });

  it('should not track if element is tracked before', () => {
    // Arrange
    const trackerAttribute = faker.random.word();
    const element = {
      getAttribute: sandbox.stub().returns(trackerAttribute),
      __tracker_registered: true
    };
    const cb = sandbox.spy();
    const trackerOptions = {};
    const parseTrackerStub = sandbox.stub(listener, 'parseTrackerOptions').returns(trackerOptions);
    const hookListenersStub = sandbox.stub(listener, 'hookListeners');

    // Act
    listener.track(element, cb);

    // Assert
    expect(parseTrackerStub.calledWithExactly(trackerAttribute)).to.eq(true);
    expect(hookListenersStub.calledWith({
      element,
      trackers: trackerOptions
    })).to.eq(false);
  });

  describe('Tracker Options', () => {
    it('should parse multiple options', () => {
      // Arrange
      const options = 'seen:e1 click:e2';

      // Act
      const parsed = listener.parseTrackerOptions(options);

      // Assert
      expect(parsed).to.deep.eq([
        {
          type: 'seen',
          event: 'e1'
        },
        {
          type: 'click',
          event: 'e2'
        }
      ])
    });

    it('should parse single option', () => {
      // Arrange
      const options = 'seen:e1';

      // Act
      const parsed = listener.parseTrackerOptions(options);

      // Assert
      expect(parsed).to.deep.eq([
        {
          type: 'seen',
          event: 'e1'
        }
      ])
    });
  });

  it('should hook click listeners', () => {
    // Arrange
    const event = faker.random.word();
    const trackingOptions = {
      trackers: [{
        type: ENUMS.TRACKING_TYPE.CLICK,
        event,
      }],
      element: {
        addEventListener: sandbox.stub()
      }
    };
    const handlerFn = {};
    const cb = {
      bind: sandbox.stub().returns(handlerFn)
    };

    // Act
    listener.hookListeners(trackingOptions, cb);

    // Assert
    expect(cb.bind.calledWithExactly(null, event, ENUMS.TRACKING_TYPE.CLICK, trackingOptions.element)).to.eq(true);
    expect(trackingOptions.element.addEventListener.calledWith('click', handlerFn)).to.eq(true);
  });

  it('should hook intersection listeners', () => {
    // Arrange
    const event = faker.random.word();
    const tracker = {
      type: ENUMS.TRACKING_TYPE.SEEN,
      event,
    };
    const trackingOptions = {
      trackers: [tracker],
      element: {
        addEventListener: sandbox.stub()
      }
    };
    const cb = sandbox.stub();
    const registerStub = sandbox.stub(listener, 'registerIntersectionObserver');

    // Act
    listener.hookListeners(trackingOptions, cb);

    // Assert
    expect(registerStub.calledWith(tracker, trackingOptions.element, cb)).to.eq(true);
  });

  it('should hook intersection listeners', () => {
    // Arrange
    const event = faker.random.word();
    const tracker = {
      type: 'unkowntype',
      event,
    };
    const trackingOptions = {
      trackers: [tracker],
      element: {
        addEventListener: sandbox.stub()
      }
    };
    const cb = sandbox.stub();
    const registerStub = sandbox.stub(listener, 'registerIntersectionObserver');

    // Act
    listener.hookListeners(trackingOptions, cb);

    // Assert
    expect(registerStub.calledWith(tracker, trackingOptions.element, cb)).to.eq(false);
  });

  it('should create new intersection observer', () => {
    // Arrange
    const tracker = {
      event: faker.random.word(),
      type: faker.random.word()
    };
    const element = {};
    const callback = sandbox.stub();
    const fn = {};

    listener.onIntersection.bind = sandbox.stub().returns(fn);
    const intersectionObserverProto = {
      observe: sandbox.stub()
    }
    window.IntersectionObserver = sandbox.stub().returns(intersectionObserverProto);

    // Act
    listener.registerIntersectionObserver(tracker, element, callback);

    // Assert
    expect(listener.onIntersection.bind.calledWith(null, tracker, element, callback)).to.eq(true);
    expect(window.IntersectionObserver.calledWith(fn)).to.eq(true);
    expect(intersectionObserverProto.observe.calledWithExactly(element)).to.eq(true);
  });

  it('should track intersections and disconnect', () => {
    // Arrange
    const tracker = {
      event: faker.random.word(),
      type: faker.random.word()
    };
    const element = {};
    const callback = sandbox.stub();
    const entries = [{
      isIntersecting: true
    }];
    const observer = {
      disconnect: sandbox.stub()
    };

    // Act
    listener.onIntersection(tracker, element, callback, entries, observer);

    // Assert
    expect(callback.calledWithExactly(tracker.event, tracker.type, element)).to.eq(true);
    expect(observer.disconnect.calledOnce).to.eq(true);
  });

  it('should track intersections not disconnect no intersection', () => {
    // Arrange
    const tracker = {
      event: faker.random.word(),
      type: faker.random.word()
    };
    const element = {};
    const callback = sandbox.stub();
    const entries = [{
      isIntersecting: false
    }];
    const observer = {
      disconnect: sandbox.stub()
    };

    // Act
    listener.onIntersection(tracker, element, callback, entries, observer);

    // Assert
    expect(callback.calledWithExactly(tracker.event, tracker.type, element)).to.eq(false);
    expect(observer.disconnect.calledOnce).to.eq(false);
  });
});

