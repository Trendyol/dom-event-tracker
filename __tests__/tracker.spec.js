const Tracker = require('../lib/tracker');
const FeatureDetector = require('../lib/feature-detector');
const Observer = require('../lib/observer');
const Listener = require('../lib/listener');
const {WARNINGS, ERRORS} = require('../lib/errors');
const ENUMS = require('../lib/enums');
const {expect} = require('chai');
const sinon = require('sinon');
const faker = require('faker');

const sandbox = sinon.createSandbox();

const featureDetector = new FeatureDetector();
const listener = new Listener();
const observer = new Observer(listener);

let tracker;
let featureDetectorMock;
let observerMock;
let listenerMock;
let checkStartPrototypeStub;

describe('Tracker', () => {
  beforeEach(() => {
    featureDetectorMock = sandbox.mock(featureDetector);
    observerMock = sandbox.mock(observer);
    listenerMock = sandbox.mock(listener);
    sandbox.stub(console, 'warn');
    checkStartPrototypeStub = sandbox.stub(Tracker.prototype, 'checkStartCallback');
    tracker = new Tracker(featureDetector, observer, listener);
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it('should create new Tracker', () => {
    // Arrange
    const tracker = new Tracker(featureDetector);

    // Assert
    expect(tracker).to.be.instanceOf(Tracker);
  });

  it('should warn user if data tracker is not supported', () => {
    // Arrange
    sandbox.stub(featureDetector, 'supported').get(_ => false);

    // Act
    tracker.init();

    // Assert
    expect(console.warn.calledWithExactly(WARNINGS.DATA_TRACKER_NOT_SUPPORTED)).to.eq(true);
  });

  it('should use custom handler if no handler provided', () => {
    // Arrange
    sandbox.stub(featureDetector, 'supported').get(_ => true);
    const initialListenersSpy = sandbox.stub(tracker, 'registerInitialListeners');
    const mutationObserverSpy = sandbox.stub(tracker, 'registerMutationObserver');

    // Act
    tracker.init();

    // Assert
    expect(initialListenersSpy.calledWithExactly(tracker.logEvent)).to.eq(true);
    expect(mutationObserverSpy.calledWithExactly(tracker.logEvent)).to.eq(true);
  });

  it('should use provided handler', () => {
    // Arrange
    sandbox.stub(featureDetector, 'supported').get(_ => true);
    const handler = sandbox.stub();
    const initialListenersSpy = sandbox.stub(tracker, 'registerInitialListeners');
    const mutationObserverSpy = sandbox.stub(tracker, 'registerMutationObserver');

    // Act
    tracker.init(handler);

    // Assert
    expect(initialListenersSpy.calledWithExactly(handler)).to.eq(true);
    expect(mutationObserverSpy.calledWithExactly(handler)).to.eq(true);
  });

  it('should start observer', () => {
    // Arrange
    const spy = sandbox.spy();
    const element = {};
    const stub = sandbox.stub(tracker, 'getRootElement').returns(element);
    observerMock.expects('init').withExactArgs(element, spy);

    // Act
    tracker.registerMutationObserver(spy);

    // Assert
    expect(stub.calledOnce).to.eq(true);
  });

  it('should register initial listeners', () => {
    // Arrange
    const element = {};
    const spy = sandbox.spy();
    const stub = sandbox.stub(document, 'querySelectorAll').returns([element]);
    listenerMock.expects('track').withExactArgs(element, spy);

    // Act
    tracker.registerInitialListeners(spy);

    // Assert
    expect(stub.calledWithExactly(`[${ENUMS.TRACKING_ATTRIBUTE}]`)).to.eq(true);
  });

  it('should log captured event', () => {
    // Arrange
    const eventName = faker.random.word();
    const type = faker.random.word();
    const element = {};
    const stub = sandbox.stub(console, 'log');

    // Act
    tracker.logEvent(eventName, type, element);

    // Assert
    expect(stub.calledWith({
      eventName,
      type,
      element
    })).to.eq(true);
  });

  it('should check for startCallback and call init', () => {
    // Arrange

    const fnName = '__fakeCallback';
    window[fnName] = () => {};
    const element = {
      attributes: {
        [ENUMS.ROOT_TRACKER_ATTRIBUTE]: {
          value: fnName
        }
      }
    };
    const rootElementStub = sandbox.stub(tracker, 'getRootElement').returns(element);
    const stubbedMethod = checkStartPrototypeStub.wrappedMethod.bind(tracker);
    const initStub = sandbox.stub(tracker, 'init');


    // Act
    stubbedMethod();

    // Assert
    expect(initStub.calledWithExactly(window[fnName])).to.eq(true);
  });

  it('should check for startCallback and should not call init for invalid', () => {
    // Arrange
    const element = {
      attributes: {
        [ENUMS.ROOT_TRACKER_ATTRIBUTE]: {
          value: ''
        }
      }
    };
    const rootElementStub = sandbox.stub(tracker, 'getRootElement').returns(element);
    const stubbedMethod = checkStartPrototypeStub.wrappedMethod.bind(tracker);
    const initStub = sandbox.stub(tracker, 'init');


    // Act
    stubbedMethod();

    // Assert
    expect(initStub.notCalled).to.eq(true);
  });

  it('should throw error if root element not exists', () => {
    // Act
    const test = () => {
      tracker.getRootElement()
    }

    // Assert
    expect(test).to.throw(ERRORS.ROOT_ELEMENT_NOT_REGISTERED);
  });

  it('should return root element', () => {
    // Arrange
    const foundElement = {};
    const queryStub = sandbox.stub(document, 'querySelector').returns(foundElement);

    // Act
    const element = tracker.getRootElement();

    // Assert
    expect(element).to.eq(foundElement);
    expect(queryStub.calledWithExactly(`[${ENUMS.ROOT_TRACKER_ATTRIBUTE}]`)).to.eq(true);
  });
});

