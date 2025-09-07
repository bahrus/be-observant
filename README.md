# be-observant (👀)

be-observant is an HTML enhancement that reflects peer elements or the host's properties to data-* attributes.  This is useful for styling, among other reasons.

[![NPM version](https://badge.fury.io/js/be-observant.png)](http://badge.fury.io/js/be-observant)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-observant?style=for-the-badge)](https://bundlephobia.com/result?p=be-observant)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-observant?compression=gzip">
[![Playwright Tests](https://github.com/bahrus/be-observant/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-observant/actions/workflows/CI.yml)

```html
<label>
    a: <input id=a>
</label>
<label>
    b: <input id=b type=checkbox>
</label>
<label>
    c: <input id=c type=number>
</label>
<label>
    d: <input id=d type=date>
</label>
<div be-observant="of #a and #b and #c and #d"></div>
```

What this does:

sets data-[id] of the adorned element to the value of the input element:

```html
<div data-a=... data-b=... data-c=... data-d=...>
```

## Viewing Demos Locally

Any web server that can serve static files with server side includes will do, but...

1.  Install git.
2.  Fork/clone this repo.
3.  Install node.js.
4.  Install python 3 or later.
5.  Open command window to folder where you cloned this repo.
6.  > npm install
7.  > npm run serve
8.  Open http://localhost:8000/demo/ in a modern browser.

## Running Tests

```
> npm run test
```

## Using from ESM Module:

```JavaScript
import 'be-observant/emc.js';
```

or

```JavaScript
import 'be-observant/🔭.js';
```


## Using from CDN:

```html
<script type=module crossorigin=anonymous>
    import 'https://esm.run/be-observant';
</script>
```

