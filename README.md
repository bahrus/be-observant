# be-observant [TODO]

be-observant is a member of the [p-et-alia](https://github.com/bahrus/p-et-alia) family of web components.

It strives to accomplish the same thing as the [pass-down](https://github.com/bahrus/pass-down) custom element, but in a possibly more performant way in many circumstances.  It uses attributes rather than elements to bind things together.  So instead of:

```html
<ways-of-science>
    <largest-scale>
        <woman-with-carrot-attached-to-nose></woman-with-carrot-attached-to-nose>
    </largest-scale>
    <p-d vft to=[-lhs] m=1></p-d>
    <largest-scale>
        <a-duck></a-duck>
    </largest-scale>
    <p-d vft to=[-rhs] m=1 ></p-d>
    <iff-diff iff -lhs not-equals -rhs set-attr=hidden></iff-diff>
    <div hidden>A witch!</div>
</ways-of-science>
```

We have

```html
<ways-of-science>
    <largest-scale -lhs>
        <woman-with-carrot-attached-to-nose></woman-with-carrot-attached-to-nose>
    </largest-scale>
    <largest-scale -rhs>
        <a-duck></a-duck>
    </largest-scale>
    <iff-diff iff -lhs=largest-scale[-lhs] not-equals -rhs=largest-scale[-rhs] set-attr=hidden be-observant></iff-diff>
    <div hidden>A witch!</div>
</ways-of-science>
```

which is a shorthand / more readable version (based on overridable assumptions) of:

```html
<ways-of-science>
    <largest-scale -lhs>
        <woman-with-carrot-attached-to-nose></woman-with-carrot-attached-to-nose>
    </largest-scale>
    <largest-scale -rhs>
        <a-duck></a-duck>
    </largest-scale>
    <iff-diff iff not-equals set-attr=hidden be-observant='{
        "lhs": {"observe": "[-lhs]", "on":"value-changed", "value-from-target": "value"}, 
        "rhs": {"observe": "[-rhs]", "on":"value-changed", "value-from-target": "value"} 
    }'></iff-diff>
    <div hidden>A witch!</div>
</ways-of-science>
```


**NB I:** Editing large JSON attributes like this is quite error-prone, if you are like me.  The [json-in-html](https://marketplace.visualstudio.com/items?itemName=andersonbruceb.json-in-html) VSCode extension can help with this issue.  That extension is compatible with [pressing "." on the github page](https://github.dev/bahrus/be-observant). 

**NB II:** Whilst the first example involves more tags, and may often impose a slightly higher performance penalty, it is (subjectively) a bit more pleasant to type, and to reason about, add comments to, and to debug.  Perhaps starting with the former approach, and then moving to this approach when it is close to being ready for production may be the way to reconcile this.  Other approaches could be to transform one into the other during build time, or sometime during template processing (pre- or post- cloning).

**NB III:**  The attribute name "be-observant" is configurable.  "data-be-observant" also works, with the default configuration.  
