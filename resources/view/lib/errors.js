var util = require('util');

var errors = {};

var LayoutNotFoundError = function (msg, constr) {
  Error.captureStackTrace(this, constr || this);
  this.message = msg || 'Error';
};
util.inherits(LayoutNotFoundError, Error);
LayoutNotFoundError.prototype.name = 'Layout Not Found Error';

errors.LayoutNotFoundError = LayoutNotFoundError;

module['exports'] = errors;
