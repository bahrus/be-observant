# be-observant

[![Actions Status](https://github.com/bahrus/be-observant/workflows/CI/badge.svg)](https://github.com/bahrus/be-observant/actions?query=workflow%3ACI)

<a href="https://nodei.co/npm/be-observant/"><img src="https://nodei.co/npm/be-observant.png"></a>

be-observant is a key member of the [may-it-be](https://github.com/bahrus/may-it-be) family of web components.  It allows one DOM element to observe another element,  where that element came "before it".  It is much like how Javascript closures can access variables defined outside the closure, as long as it came before.

be-observant is also a trend-setting member of the family -- many of the other may-it-be components piggy-back both on the code as well as the syntax for adding "environment-aware" bindings to their configuration properties.

## Now hold on just a minute... 

<details>
    <summary>A personal statement</summary>

Have I learned nothing, you may be asking?  "Don't you know props are passed down, events passed up?"  Yes, the approach be-observant follows has been declared an "anti-pattern" by many.  However, this anti-pattern is somewhat forced on us, when we use custom attributes, and when in addition we want to adhere to the principle of not attaching unrecognized properties on the element adorned by the attribute.  Yes, there is a [protocol](https://github.com/bahrus/be-observant/blob/baseline/getProxy.ts) for extracting the proxy corresponding to an attribute, which theoretically the host could use to pass props down.  But the intention of these custom attribute / decorators / behaviors is that they be usable within any framework, but especially within any web component library (without having to modify / extend the code), avoiding tight-coupling as much as possible.  Providing a specific protocol for "passing props down,"  and insisting on allowing no alternative would get in the way of achieving that goal.  

Anyway, be-observant encourages uni-directional data flow, which to me is the more important goal, if these goals are designed to make reasoning about the code easier. (Of course what makes things easier to reason about is quite subjective).  

Another benefit of this "anti-pattern" is that it works quite nicely when lazy loading content.  The hosting element doesn't need to be micro-managing internal elements coming and going.  It is a less "planned" component economic model :-).  Underlying this idea is the concept that web components and custom decorators / attributes / behaviors, have a sense of "identity", capable of reacting spontaneously to user events, and able to "think independently" when interacting with peer components, even able to spawn children when the conditions are right, without bogging the host element down in minutia.  Reasoning about them may be easier if we can relate to the way they work together to how human organizations function -- or at least non-North Korean Military organizations :-).  This approach also seems to be more natural when striving for more declarative, markup-centric, less code-centric environments.  be-observant is closely "observing" whether there are any signs of life as far as HTML Modules.  Oh, and JQuery, still the most popular framework out there, doesn't follow such a strict hierarchy either, am I right?

An alternative approach might be to use the "context api" to develop a connection between custom attribute and host -- the custom-attribute-based DOM decorator emits a bubbling event -- "how can I help?".  But this may depend on timing considerations -- with declarative custom elements (including now declarative ShadowDOM), the host may become upgraded *after* the attribute does.  Why insist the element can't be interactive until that happens?

Nevertheless, that approach will be considered once the api is stabilized, especially if there is a significant performance benefit on the context api's side.

Just as custom elements becoming activated relies on css features of the markup (registered tag names), here we also rely on CSS recognizing the attribute, without permission from any host component (though the host has to "opt-in" in a rather light-touch way if using Shadow DOM). 

</details>

## Priors

be-observant strives to accomplish the same thing as the [pass-down](https://github.com/bahrus/pass-down) custom element, but in a possibly more performant way in many circumstances.  It uses attributes rather than elements to bind things together.  So instead of:

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
        "lhs": {"observe": "[-lhs]", "on":"value-changed", "valueFromTarget": "value"}, 
        "rhs": {"observe": "[-rhs]", "on":"value-changed", "valueFromTarget": "value"} 
    }'></iff-diff>
    <div hidden>A witch!</div>
</ways-of-science>
```

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

is interpreted to mean: "any time the host's expandAll property changes (communicated via expand-all-changed event), set this instance's "open" property to the same value.  Likewise with the other two lhs/rhs pairs.

The host is obtained by calling the native function el.getRootNode().  If that is a miss, it searches for the closest parent containing a dash.

To specify a different source to observe other than the host, there are numerous other options, which are catalogued below.

## NB's

**NB I:** Editing large JSON attributes like this is quite error-prone, if you are like me.  The [json-in-html](https://marketplace.visualstudio.com/items?itemName=andersonbruceb.json-in-html) VSCode extension can help with this issue.  That extension is compatible with [pressing "." on the github page](https://github.dev/bahrus/be-observant) and with the [web version of vs-code](https://vscode.dev/). 

**NB II:** Whilst the first example involves more tags, and may often impose a slightly higher performance penalty, it is (subjectively) a bit more pleasant to type, and to reason about, add comments to, and to debug.  Perhaps starting with the former approach, and then moving to this approach when it is close to being ready for production may be the way to reconcile this.  Other approaches could be to transform one into the other during build time, or sometime during template processing (pre- or post- cloning).

To make debugging easier, set JSON key "debug" to true.

**NB III:**  The attribute name "be-observant" is configurable.  "data-be-observant" also works, with the default configuration.  The only limitation as far as naming is the attribute must start with be-* (which also guarentees data-be-* as well).

**NB IV:** The syntax, and the core code behind be-observant, is also used by a fair number of other web components in the may-it-be family of web components, so it is worthwhile expounding on exactly what that syntax means.

## Syntax in depth

First we need to choose *what* to observe.  This is done via a number of alternative keys:

<table>
    <caption>What to observe</caption>
    <thead>
        <th>Key</th>
        <th>Meaning</th>
    </thead>
    <tbody>
        <tr>
            <td><i>unspecified</i></td>
            <td>Observe the host element via the native function el.getRootNode().  If that is a miss, it searches for the closest parent containing a dash.</td>
        </tr>
        <tr>
            <td>observe</td>
            <td>Do an "up-search" -- previous siblings, parent, previous siblings of parent, etc, until an element "css matching" the value of "observe" is found.  Stop at any ShadowDOM boundary.</td>
        </tr>
        <tr>
            <td>observeClosest</td>
            <td>Use the native function call "closest" to find the element to observe.</td>
        </tr>
        <tr>
            <td>observeClosestOrHost</td>
            <td>Use the native function call "closest".  If that's null, do el.getRootNode()</td>
        </td>
        <tr>
            <td>observeSelf</td>
            <td>Observe self</td>
        </tr>
    </tbody>
</table>

Once we find the element to observe, next we need to specify what property or event to listen to on that element.

<table>
    <caption>When to react</caption>
    <thead>
        <th>Key</th>
        <th>Meaning</th>
        <th>Notes</th>
    </thead>
    <tbody>
        <tr>
            <td>on</td>
            <td>Name (or "type") of event to listen for.  Uses the standard el.addEventListener([on])</td>
            <td>If not specified, will be set to the value of valFromTarget, after turning it into lisp case and appending with -changed.</td> 
        </tr>
        <tr>
            <td>onSet</td>
            <td>Watches for property changes made via invoking the setter of the property.</td>
            <td></td>
        </tr>
    </tbody>
</table>

Next we specify what to pass from the element we are observing and possibly from the event.

<table>
    <caption>Getting the value</caption>
    <thead>
        <th>Key</th>
        <th>Meaning</th>
        <th>Notes</th>
    </thead>
    <tbody>
        <tr>
            <td>valFromTarget</td>
            <td>Specify a path from the target to "pull" when the event is raised or the property changes, using "." notation.</td>
            <td>Aliased by "vft".  Can also be used to auto-set the "on" value as described above.</td>
        </tr>
        <tr>
            <td>vft</td>
            <td>Abbrev. for valFromTarget</td>
            <td></td>
        </tr>
        <tr>
            <td>valFromEvent</td>
            <td>Specify a path from the event to "pull" when the event fires</td>
            <td></td>
        </tr>
        <tr>
            <td>fromProxy</td>
            <td>Specify the name of a proxy ("ifWantsToBe") from another may-it-be decorator</td>
            <td></td>
        </tr>
    </tbody>
</table>

## Big time short cuts.

When working with be-observant, we will likely encounter the following patterns rather frequently:

```html
<my-element be-observant='{
    "typicalProp1": {"vft": "myHostProp1"},
    "typicalProp2": {"onSet": "myHostProp2", "vft": "myHostProp2"}
}'>
```

These are already shortcuts for a number of configurable atomic operations, but even these shortcuts get to feeling rather repetitive in many circumstances.

The shortcut for these two scenarios is shown below:

```html
<my-element be-observant='{
    "typicalProp1": "myHostProp1",
    "typicalProp2": ".myHostProp2"
}'>
```

## Being host-ish

Sometimes there are scenarios where we would like to benefit from the shortcuts above, but don't want to use Shadow DOM on a containing component just for the benefit of the shortcut.

An element can declare itself to be a host for these purposes by adding global attribute "itemscope". Be-observant searches for such an element before doing the getRootNode() call. 

Under the hood, this scenario will use another option:  observeClosestOrHost (ocoho for short), which tries using the native "closest" query first, and if that fails, does getRootNode()

## [Configuration Parameters](types.d.ts)

## Observe another proxy

"fromProxy" can be added, indicating that the data we want referenced or copied from the target element should actually come from a virtual property of the proxy.

```html
<list-sorter  upgrade=* if-wants-to-be=sorted with-binding></list-sorter>

...

<button be-toggled></button>

...

<ul be-sorted='{"nodeSelectorToSortOn":"span"}' be-sorted-with-binding='{
    "direction": {"observe": "button", "fromProxy":"toggled", "vft": "on", "valIfTrue": "asc", "valIfFalse": "desc", "to-proxy": "sorted"}
}'>
    <li>
        <span>Zorse</span>
    </li>
    <li>
        <span>Aardvark</span>
    </li>
</ul>

```

## Pass to another proxy on the same element[TODO]

use to-proxy



 

