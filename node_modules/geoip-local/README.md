# geoip-local

[![Build Status](https://travis-ci.org/song940/geoip-local.svg?branch=master)](https://travis-ci.org/song940/geoip-local)

geoip  tools for nodejs .

[![NPM](https://nodei.co/npm/geoip-local.png?downloads=true&stars=true)](https://nodei.co/npm/geoip-local/)


## Installation

	npm install geoip-local --save

## Usage

```javascript
var geoip = require('geoip-local');

geoip.lookup('111.193.186.221', function(geo){
  console.log(geo);
});
```

## Licence

The MIT License (MIT)

Copyright (c) 2014 Lsong

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.