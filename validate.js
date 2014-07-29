'use strict';

/**
 *
 * Restify Middleware to validate input against the fields provided in IORest spec.
 * Currently only checks
 *               - a value is provided for required fields.
 *               - params of type number are numbers.
 *               - params exists in options array if provided
 *
 * TODO:         - add json schema validation
 */

var restify = require('restify');

/**
 * validate that a given parameter matches the expected schema
 * @param  {object} expected the expected schema
 * @param  {value} param the value being tested
 * @return {error} returns error or undefined
 * @author Andreas
 * @date   2014-07-29
 */
function validateParam(expected, param) {
  if (!param) {
    return (expected.required) ? '`' + expected.name + '` is a required field.' : [];
  }

  if (expected.type === 'number' && isNaN(param)) {
    return 'Expected number in field `' + expected.name +
          '` but got value: `' + param + '`.';
  }

  if (expected.options) {
    var badItems = [];
    if (typeof param === 'string') {
      if (!expected.options[param]) {
        badItems.push(param);
      }
    } else {
      var d = param.length;
      while(d--) {
        var incomingItem = param[d];
        if (!expected.options[incomingItem]) {
          badItems.push(incomingItem);
        }
      }
    }

    if (badItems.length > 0) {
      var plural = (badItems.length > 1) ? 's' : '';
      return 'Invalid value' + plural + ' (' + badItems.join(', ') +
        ') entered in field: `' + expected.name + '`. Available options'+
        ' are: ' + Object.keys(expected.options).join(', ');
    }
  }
  return [];

}

module.exports = function(req, res, next) {
  var expected, i;
  var errors = [];

  for (i = 0; i < req.spec.parameters.length; i += 1) {
    expected = req.spec.parameters[i];
    // if body is specified we need to check the body :)
    // exclude files
    // todo - what if files are required?

    if(expected.location === 'body') {
      if (expected.type !== 'file' && expected.name !== 'body') {
        errors = errors.concat(validateParam(expected, req.body[expected.name]));
      }
    } else {
      errors = errors.concat(validateParam(expected, req.params[expected.name]));
    }

  }
  if (errors.length > 0) {
    return next(new restify.BadRequestError(errors.join('\n')));
  }
  next();
};

