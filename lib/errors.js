const ENUMS = require('./enums');

const ERRORS = {
  ROOT_ELEMENT_NOT_REGISTERED: `[CODE: E1] Root element not registered, use attribute ${ENUMS.ROOT_TRACKER_ATTRIBUTE}.`
};

const WARNINGS = {
  DATA_TRACKER_NOT_SUPPORTED: `[CODE: W1] Data tracker is not supported on your browser`
};

module.exports = {
  ERRORS,
  WARNINGS
};
