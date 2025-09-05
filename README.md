# be-observant (👀) [TODO]

```html
<label>
    a: <input id=a>
</label>
<label>
    b: <input id=b type=checkbox>
</label>
<label>
    c: <input id=d type=number>
</label>
<label>
    d: <input id=d type=date>
</label>
<div be-observant="of a and b and c and d"></div>
```

What this does:

sets data-[id] of the adorned element to the value of the input element:

```html
<div data-a=... data-b=... data-c=... data-d=...>
```

