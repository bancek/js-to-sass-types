var sass = require('node-sass');
var _ = require('lodash');

var intUnitRegExp = /^([0-9]+)(%|cm|em|ex|in|mm|pc|pt|px|vh|vw|vmin)$/;
var floatUnitRegExp = /^([0-9\.]+)(%|cm|em|ex|in|mm|pc|pt|px|vh|vw|vmin)$/;

function convert (obj) {
  if (obj == null) {
    return sass.types.Null.NULL;
  } else if (_.isString(obj)) {
    if (/^#[0-9a-f]{3}$/i.test(obj)) {
      var r = parseInt(obj[1] + obj[1], 16);
      var g = parseInt(obj[2] + obj[2], 16);
      var b = parseInt(obj[3] + obj[3], 16);

      return new sass.types.Color(r, g, b);
    } else if (/^#[0-9a-f]{6}$/i.test(obj)) {
      var r = parseInt(obj[1] + obj[2], 16);
      var g = parseInt(obj[3] + obj[4], 16);
      var b = parseInt(obj[5] + obj[6], 16);

      return new sass.types.Color(r, g, b);
    } else if (intUnitRegExp.test(obj)) {
      var match = obj.match(intUnitRegExp);

      return new sass.types.Number(parseInt(match[1], 10), match[2]);
    } else if (floatUnitRegExp.test(obj)) {
      var match = obj.match(floatUnitRegExp);

      return new sass.types.Number(parseFloat(match[1]), match[2]);
    } else {
      return new sass.types.String(obj);
    }
  } else if (_.isNumber(obj)) {
    return new sass.types.Number(obj);
  } else if (_.isBoolean(obj)) {
    return obj ? sass.types.Boolean.TRUE : sass.types.Boolean.FALSE;
  } else if (_.isArray(obj)) {
    var list = new sass.types.List(obj.length);

    for (var i = 0; i < obj.length; i++) {
      list.setValue(i, convert(obj[i]));
    }

    return list;
  } else if (_.isObject(obj) && !_.isFunction(obj) && !_.isDate(obj)) {
    var keys = _.keys(obj);

    var map = new sass.types.Map(keys.length);

    _.forEach(keys, function (key, i) {
      map.setKey(i, convert(key));
      map.setValue(i, convert(obj[key]));
    })

    return map;
  } else {
    throw new Error('js-to-sass-types: invalid object: ' + obj);
  }
}

exports.convert = convert;
