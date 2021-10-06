# be-observant

[![Actions Status](https://github.com/bahrus/be-observant/workflows/CI/badge.svg)](https://github.com/bahrus/be-observant/actions?query=workflow%3ACI)

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

<!--

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

-->

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

## NB's

**NB I:** Editing large JSON attributes like this is quite error-prone, if you are like me.  The [json-in-html](https://marketplace.visualstudio.com/items?itemName=andersonbruceb.json-in-html) VSCode extension can help with this issue.  That extension is compatible with [pressing "." on the github page](https://github.dev/bahrus/be-observant). 

**NB II:** Whilst the first example involves more tags, and may often impose a slightly higher performance penalty, it is (subjectively) a bit more pleasant to type, and to reason about, add comments to, and to debug.  Perhaps starting with the former approach, and then moving to this approach when it is close to being ready for production may be the way to reconcile this.  Other approaches could be to transform one into the other during build time, or sometime during template processing (pre- or post- cloning).

**NB III:**  The attribute name "be-observant" is configurable.  "data-be-observant" also works, with the default configuration. 

## Assumptions, shortcuts

Whereas the pass-down component may be more fitting for a 30,000 ft above the ground environment outside any web component (rather, as part of a "web composition" of Native DOM and custom DOM elements), be-observant is more tailored for markup within a web component.  The overlap between them, functionally, is considerable though.

For example, the preceding example does not yet assume King Arthur has fully established his kingdom -- it works regardless of a containing component managing state.

But with be-observant, the shortcuts we provide are based on the assumption that there is such a component container.

So, for example:  

```html
 <xtal-editor be-observant='{
    "open": "expandAll",
    "expandAll": "expandAll",
    "readOnly": "readOnly"
}'></xtal-editor>
```

is interpreted to mean: "any time the host's expandAll property changes, set this instance's "open" property to the same value.  Likewise with the other two lhs/rhs pairs.

The host is obtained by calling the native function .getRootNode().  If that is a miss, it searches for the closest parent containing a dash.

To specify a different source to observe other than the host, we use "observe", or "observe-closest" as we saw in the previous example.

"observe" does an "upsearch" -- previous siblings, parent, previous siblings of parent, etc, until an element "css matching" the value of "observe" is found.

"observe-closest" uses the native function call "closest" for this purpose.

These searches all stop at any ShadowDOM boundary.

## [Confoguration Parameters](types.d.ts)

 

