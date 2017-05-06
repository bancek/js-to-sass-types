# js-to-sass-types [![npm version](https://badge.fury.io/js/js-to-sass-types.svg)](http://badge.fury.io/js/js-to-sass-types)

Convert JavaScript types to node-sass types.

## Installation

```sh
$ npm install --save js-to-sass-types
```

## Usage

`sass-config.json`

```js
{
  "colors": {
    "text": "#fff"
  }
}
```

`style.scss`

```css
$config: getconfig();
$colors: map-get($config, "colors");
$color-text: map-get($colors, "text");

body {
  color: $color-text;
}
```

```js
var sass = require('node-sass');
var convert = require('js-to-sass-types').convert;

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
```
## License

MIT © Luka Zakrajšek
