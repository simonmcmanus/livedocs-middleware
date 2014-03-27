'use strict';

/**
 *
 * Restify Middleware to validate input against the fields provided in IORest spec.
 * Currently only checks
 *               - a value is provided for required fields.
 *               - params of type number are numbers.
 *               - params exists in options array if provided
 *
 */

var restify = require('restify');

module.exports = function(req, res, next) {


  function inArray(item, arr) {
    return arr.indexOf(item) > -1;
  }

  var expected = req.spec.parameters;
  var errors = [];
  var c = expected.length;
  while (c--) {

    if (!req.params[expected[c].name]) { // param provided is listed.

      if (expected[c].required) {
        if (
          !req.params[expected[c].name] ||
          req.params[expected[c].name] === ''
        ) {
          errors.push('`' + expected[c].name + '` is a required field.');
        }
      }



    } else {

      if (expected[c].type === 'number') {
        if (isNaN(req.params[expected[c].name])) {
          errors.push('Expected number in field `' + expected[c].name +
            '` but got value: `' + req.params[expected[c].name] + '`.');
        }
      }

      if (expected[c].options) {
        if (!inArray(req.params[expected[c].name], expected[c].options)) {
          errors.push('Invalid value (' + req.params[expected[c].name] +
            ') entered in field: `' + expected[c].name + '`. Available options'+
            ' are: ' + expected[c].options.join(', ')
            );
        }
      }

    }
  }
  if (errors.length > 0) {
    return next(new restify.BadRequestError(errors.join('\n')));
  }
  next();
};

