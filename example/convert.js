var sass = require('node-sass');
var convert = require('..').convert;

var config = convert(require('./sass-config.json'));

var res = sass.renderSync({
  file: './style.scss',
  functions: {
    'getconfig()': function () {
      return config;
    }
  }
});

console.log(res.css.toString());
