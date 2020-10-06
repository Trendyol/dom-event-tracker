const ENUMS = require('./enums');

const ERRORS = {
  ROOT_ELEMENT_NOT_REGISTERED: `[CODE: E1] Root element not registered, use attribute ${ENUMS.ROOT_TRACKER_ATTRIBUTE}.`,
};

const WARNINGS = {
  DATA_TRACKER_NOT_SUPPORTED: '[CODE: W1] Data tracker is not supported on your browser',
  DATA_TRACKER_ALREADY_DEFINED: '[CODE: W2] Data tracker already defined to the window.',
};

module.exports = {
  ERRORS,
  WARNINGS,
};
