const faker = require('faker');
const { expect } = require('chai');
const sinon = require('sinon');
const Observer = require('../lib/observer');
const Listener = require('../lib/listener');
const ENUMS = require('../lib/enums');

const sandbox = sinon.createSandbox();
const listener = new Listener();

let listenerMock;
let observer;

describe('Observer', () => {
  beforeEach(() => {
    listenerMock = sandbox.mock(listener);
    observer = new Observer(listener);
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it('should create new Observer', () => {
    // Act
    const observer = new Observer(listener);

    // Assert
    expect(observer).to.be.instanceOf(Observer);
  });

  it('should init new observer', () => {
    // Arrange
    const callback = sandbox.spy();
    const element = {};
    const stub = sandbox.stub();
    window.MutationObserver = function () {
      this.observe = stub;
    };

    // Act
    observer.init(element, callback);

    // Assert
    expect(stub.calledWithExactly(element, Observer.OBSERVER_CONFIGURATION)).to.eq(true);
  });

  it('should add trackers to new mutation elements', () => {
    // Arrange
    const node = {
      attributes: {
        [ENUMS.TRACKING_ATTRIBUTE]: faker.random.word(),
      },
    };
    const mutations = [
      {
        type: 'childList',
        addedNodes: [
          node,
        ],
      },
    ];

    const cb = sandbox.spy();
    observer.handlerCallback = cb;

    listenerMock.expects('track').withExactArgs(node, cb);

    // Act
    observer.onMutation(mutations);
  });

  it('should not call tracker if no attributes', () => {
    // Arrange
    const node = {

    };
    const mutations = [
      {
        type: 'childList',
        addedNodes: [
          node,
        ],
      },
    ];

    const cb = sandbox.spy();
    observer.handlerCallback = cb;

    listenerMock.expects('track').never();

    // Act
    observer.onMutation(mutations);
  });

  it('should not call tracker if type is not childList', () => {
    // Arrange
    const node = {
      attributes: {
        [ENUMS.TRACKING_ATTRIBUTE]: faker.random.word(),
      },
    };
    const mutations = [
      {
        type: faker.random.word(),
        addedNodes: [
          node,
        ],
      },
    ];

    const cb = sandbox.spy();
    observer.handlerCallback = cb;

    listenerMock.expects('track').never();

    // Act
    observer.onMutation(mutations);
  });
});
