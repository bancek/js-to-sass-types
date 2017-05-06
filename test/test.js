var assert = require('chai').assert;
var sass = require('node-sass');
var convert = require('..').convert;

describe('convert', function () {
  it('should convert JavaScript object to node-sass type', function () {
    var jsObj = {
      colors: {
        bodyBg: '#fff',
        text: '#333',
        border: '#aabbcc',
      },
      borderRadius: '15.5px',
      width: '50%',
      hasPadding: true,
      hasMargin: false,
      fonts: ['Arial', 'Helvetica'],
      fontIndex: 1,
      content: null,
    };

    var sassObj = convert(jsObj);

    var res = sass.renderSync({
      data: [
        '$config: getconfig();',
        '$colors: map-get($config, "colors");',
        '$color-body-bg: map-get($colors, "bodyBg");',
        '$color-text: map-get($colors, "text");',
        '$color-border: map-get($colors, "border");',
        '$color-box-shadow: rgba(red($color-border), green($color-border), blue($color-border), 0.5);',
        '$box-shadow: 0 1px 3px 0 $color-box-shadow;',
        '$border-radius: map-get($config, "borderRadius");',
        '$width: map-get($config, "width");',
        '$hasPadding: map-get($config, "hasPadding");',
        '$hasMargin: map-get($config, "hasMargin");',
        '$fonts: map-get($config, "fonts");',
        '$font-index: map-get($config, "fontIndex");',
        '$content: map-get($config, "content");',
        '#nav {',
        '  background-color: $color-body-bg;',
        '  color: $color-text;',
        '  border: $color-border;',
        '  box-shadow: $box-shadow;',
        '  border-radius: $border-radius + 5px;',
        '  width: $width + 5%;',
        '  @if $hasPadding {',
        '    padding: 10px;',
        '  } @else {',
        '    padding: 0;',
        '  }',
        '  @if $hasMargin {',
        '    margin: 10px;',
        '  } @else {',
        '    margin: 0;',
        '  }',
        '  font: nth($fonts, $font-index);',
        '  content: $content;',
        '}'
      ].join('\n'),
      functions: {
        'getconfig()': function () {
          return sassObj;
        }
      }
    });

    var expected = [
      '#nav {',
      '  background-color: white;',
      '  color: #333333;',
      '  border: #aabbcc;',
      '  box-shadow: 0 1px 3px 0 rgba(170, 187, 204, 0.5);',
      '  border-radius: 20.5px;',
      '  width: 55%;',
      '  padding: 10px;',
      '  margin: 0;',
      '  font: Arial; }',
      '',
    ].join('\n');

    assert.equal(res.css.toString(), expected);
  });

  it('should throw for unsupported types', function () {
    assert.throws(function () { convert(function(){}) });
  });
});
